import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
  const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return new Response("Stripe not configured", { status: 500 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });
  const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  console.log("Stripe event received:", event.type);

  // Helper: resolve plan name (e.g. "starter", "pro") to subscription_plans UUID
  async function resolvePlanId(planName: string): Promise<string | null> {
    // Map plan names to subscription_plans.name
    const nameMap: Record<string, string> = {
      starter: "Starter",
      pro: "Pro",
    };
    const displayName = nameMap[planName] || planName;
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("id")
      .ilike("name", displayName)
      .limit(1)
      .maybeSingle();
    if (error) {
      console.error("Error resolving plan_id:", error);
      return null;
    }
    return data?.id || null;
  }

  try {
    switch (event.type) {

      // ── Payment succeeded — upgrade user ──────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const plan = session.metadata?.plan; // "starter" or "pro"
        const billing = session.metadata?.billing; // "monthly" or "yearly"

        if (!userId || !plan) {
          console.error("Missing metadata in checkout session");
          break;
        }

        // Resolve plan_id UUID from subscription_plans table
        const planId = await resolvePlanId(plan);
        if (!planId) {
          console.error(`Could not find subscription_plans entry for plan: ${plan}`);
          break;
        }

        // Map plan to tier
        const tier = plan === "pro" ? "pro" : "starter";

        // Calculate subscription end date
        const now = new Date();
        const endDate = billing === "yearly"
          ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
          : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Determine price
        const priceMap: Record<string, Record<string, number>> = {
          starter: { monthly: 12, yearly: 115 },
          pro: { monthly: 29, yearly: 278 },
        };
        const price = priceMap[plan]?.[billing || "monthly"] || 0;

        // Update subscription in database
        const { error: subError } = await supabase.from("user_subscriptions").upsert({
          user_id: userId,
          plan_id: planId,
          tier,
          billing_cycle: billing,
          plan_status: "active",
          price,
          current_period_end: endDate.toISOString(),
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

        if (subError) {
          console.error("Error updating subscription:", subError);
          break;
        }

        // Add credits based on plan
        const credits = plan === "pro" ? 100 : 50;
        await supabase.from("user_credits").upsert({
          user_id: userId,
          balance: credits,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

        console.log(`User ${userId} upgraded to ${plan} (${billing})`);
        break;
      }

      // ── Subscription renewed ──────────────────────────────────
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (!subscriptionId) break;

        // Get subscription details
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) break;

        const periodEnd = new Date(subscription.current_period_end * 1000);

        // Renew subscription period
        await supabase.from("user_subscriptions")
          .update({
            plan_status: "active",
            current_period_end: periodEnd.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        // Refresh credits on renewal
        const plan = subscription.metadata?.plan || "starter";
        const credits = plan === "pro" ? 100 : 50;
        await supabase.from("user_credits").upsert({
          user_id: userId,
          balance: credits,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

        console.log(`Subscription renewed for user ${userId}`);
        break;
      }

      // ── Subscription cancelled ────────────────────────────────
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) break;

        await supabase.from("user_subscriptions")
          .update({
            plan_status: "cancelled",
            tier: "free",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        console.log(`Subscription cancelled for user ${userId}`);
        break;
      }

      // ── Payment failed ────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) break;

        await supabase.from("user_subscriptions")
          .update({
            plan_status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        console.log(`Payment failed for user ${userId}`);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Webhook handler error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook handler failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
