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

  // PROBLEM 1 FIXED: Updated plan name mapping
  async function resolvePlanId(planName: string): Promise<string | null> {
    const nameMap: Record<string, string> = {
      pro: "Pro",
      elite: "Elite",
    };
    const displayName = nameMap[planName.toLowerCase()] || planName;

    const { data, error } = await supabase
      .from("subscription_plans")
      .select("id")
      .ilike("name", displayName)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error resolving plan_id:", error);
    }
    if (data?.id) return data.id;

    // Fixed fallback logic - correct mappings without cross-contamination
    const fallbackNames = planName === "pro"
      ? ["Pro", "Premium", "Pitchsora Premium"]
      : ["Elite"];

    for (const name of fallbackNames) {
      const { data: fallback } = await supabase
        .from("subscription_plans")
        .select("id")
        .ilike("name", `%${name}%`)
        .limit(1)
        .maybeSingle();
      if (fallback?.id) return fallback.id;
    }

    console.error(`Could not find subscription_plans entry for plan: ${planName}`);
    return null;
  }

  // PROBLEM 2 FIXED: Reset feature usage by deleting from user_usage table
  async function resetFeatureUsage(userId: string) {
    const { error } = await supabase
      .from("user_usage")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Error resetting feature usage:", error);
    } else {
      console.log(`✅ Feature usage reset for user ${userId}`);
    }
  }

  // PROBLEM 3 FIXED: Updated tier resolution for Pro/Elite/Free
  async function resolveSubscriptionTier(
    subscription: Stripe.Subscription, 
    userId: string
  ): Promise<string> {
    // Strategy 1: Check metadata first (most reliable)
    if (subscription.metadata?.plan) {
      const tier = subscription.metadata?.plan === "elite" ? "elite" : 
                   subscription.metadata?.plan === "pro" ? "pro" : "free";
      console.log(`Tier resolved from metadata: ${tier}`);
      return tier;
    }
    
    // Strategy 2: Query current tier from database
    const { data: currentSub } = await supabase
      .from("user_subscriptions")
      .select("tier")
      .eq("user_id", userId)
      .single();
    
    if (currentSub?.tier) {
      console.log(`Tier preserved from existing record: ${currentSub.tier}`);
      return currentSub.tier;
    }
    
    // Strategy 3: Final fallback to free
    console.log(`No metadata or existing record found for user ${userId}, defaulting to free`);
    return "free";
  }

  try {
    switch (event.type) {

      // ── Payment succeeded — upgrade user ──────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const plan = session.metadata?.plan; // "pro" or "elite"
        const billing = session.metadata?.billing; // "monthly" or "yearly"

        if (!userId || !plan) {
          console.error("Missing metadata in checkout session", { userId, plan });
          break;
        }

        console.log(`Processing checkout for user ${userId}, plan: ${plan}, billing: ${billing}`);

        // Get actual subscription data from Stripe to get correct period end
        let periodEnd: Date;
        let stripeSubscriptionId: string | null = null;
        
        if (session.subscription) {
          stripeSubscriptionId = session.subscription as string;
          const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
          periodEnd = new Date(subscription.current_period_end * 1000);
        } else {
          // Fallback if no subscription (shouldn't happen for paid plans)
          const now = new Date();
          periodEnd = billing === "yearly"
            ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
            : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        }

        // Resolve plan_id UUID from subscription_plans table
        const planId = await resolvePlanId(plan);
        if (!planId) {
          console.error(`Could not find subscription_plans entry for plan: ${plan}. Will use fallback.`);
        }

        // PROBLEM 4 FIXED: Updated tier mapping and price map
        const tier = plan === "elite" ? "elite" : plan === "pro" ? "pro" : "free";

        const priceMap: Record<string, Record<string, number>> = {
          pro: { monthly: 15, yearly: 144 },
          elite: { monthly: 29, yearly: 278 },
        };
        const price = priceMap[plan]?.[billing || "monthly"] || 0;

        // Save Stripe customer ID and subscription ID to profile
        if (session.customer) {
          const updateData: Record<string, unknown> = {
            stripe_customer_id: session.customer as string,
            plan: tier,
          };
          
          if (stripeSubscriptionId) {
            updateData.stripe_subscription_id = stripeSubscriptionId;
          }
          
          const { error: profileError } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("user_id", userId);
            
          if (profileError) {
            console.error("Error updating profile:", profileError);
          } else {
            console.log(`Updated profile for user ${userId}: plan=${tier}, stripe_customer_id=${session.customer}`);
          }
        }

        // Build subscription upsert
        const subData: Record<string, unknown> = {
          user_id: userId,
          tier,
          billing_cycle: billing || "monthly",
          plan_status: "active",
          price,
          current_period_end: periodEnd.toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (stripeSubscriptionId) {
          subData.stripe_subscription_id = stripeSubscriptionId;
        }

        if (planId) {
          subData.plan_id = planId;
        } else {
          const { data: anyPlan } = await supabase
            .from("subscription_plans")
            .select("id")
            .limit(1)
            .maybeSingle();
          subData.plan_id = anyPlan?.id;
        }

        const { error: subError } = await supabase.from("user_subscriptions").upsert(
          subData,
          { onConflict: "user_id" }
        );

        if (subError) {
          console.error("Error updating subscription:", subError);
          break;
        }

        // Reset feature usage for the user
        await resetFeatureUsage(userId);

        console.log(`✅ User ${userId} upgraded to ${tier} (${billing}), period end: ${periodEnd.toISOString()}`);
        break;
      }

      // ── Subscription renewed ──────────────────────────────────
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Skip first-time invoices (subscription creation)
        if (invoice.billing_reason === 'subscription_create') {
          console.log("Skipping first-time invoice, handled by checkout.session.completed");
          break;
        }
        
        const subscriptionId = invoice.subscription as string;
        if (!subscriptionId) break;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) {
          console.log("No supabase_user_id in subscription metadata, skipping");
          break;
        }

        const periodEnd = new Date(subscription.current_period_end * 1000);
        
        // Resolve plan tier
        const plan = await resolveSubscriptionTier(subscription, userId);

        await supabase.from("user_subscriptions")
          .update({
            plan_status: "active",
            current_period_end: periodEnd.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        // Reset feature usage for renewed subscription
        await resetFeatureUsage(userId);

        console.log(`✅ Subscription renewed for user ${userId}, period end: ${periodEnd.toISOString()}`);
        break;
      }

      // ── Subscription updated (upgrade/downgrade mid-cycle) ────
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.supabase_user_id;

        if (!userId) {
          console.log("No supabase_user_id in subscription metadata, skipping");
          break;
        }

        // Resolve the new tier using the helper function
        const newTier = await resolveSubscriptionTier(subscription, userId);
        
        const periodEnd = new Date(subscription.current_period_end * 1000);
        const status = subscription.status === "active" ? "active" : 
                       subscription.status === "past_due" ? "past_due" : 
                       subscription.status === "canceled" ? "cancelled" : "incomplete";

        // Get current subscription to check for changes
        const { data: existingSub } = await supabase
          .from("user_subscriptions")
          .select("tier, plan_status")
          .eq("user_id", userId)
          .single();

        // Only update if tier actually changed or status changed
        if (existingSub?.tier !== newTier || existingSub?.plan_status !== status) {
          await supabase.from("user_subscriptions")
            .update({
              tier: newTier,
              plan_status: status,
              current_period_end: periodEnd.toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", userId);

          // Update profile tier
          await supabase.from("profiles")
            .update({ plan: newTier })
            .eq("user_id", userId);

          // PROBLEM 5 FIXED: Removed credit adjustment blocks
          console.log(`✅ Subscription updated for user ${userId}: ${existingSub?.tier || 'none'} → ${newTier}, status = ${status}`);
        } else {
          console.log(`No tier change for user ${userId}, skipping update`);
        }
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

        await supabase.from("profiles")
          .update({ plan: "free" })
          .eq("user_id", userId);

        // PROBLEM 6 FIXED: Reset feature usage instead of clearing credits
        await resetFeatureUsage(userId);

        console.log(`✅ Subscription cancelled for user ${userId}`);
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
            tier: "free",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        await supabase.from("profiles")
          .update({ plan: "free" })
          .eq("user_id", userId);

        // PROBLEM 7 FIXED: Reset feature usage instead of clearing credits
        await resetFeatureUsage(userId);

        console.log(`⚠️ Payment failed for user ${userId}, downgraded to free and feature usage reset`);
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
