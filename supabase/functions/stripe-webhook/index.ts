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

  // Helper: resolve plan name to subscription_plans UUID
  async function resolvePlanId(planName: string): Promise<string | null> {
    const nameMap: Record<string, string> = {
      starter: "Starter",
      pro: "Pro",
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
      : ["Starter"];

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

  // Helper: refill the user's monthly credit balance to their tier allowance
  async function resetFeatureUsage(userId: string, tier: string = "free") {
    const allowance = tier === "pro" || tier === "premium" ? 250 : tier === "starter" ? 80 : 25;
    const { error } = await supabase
      .from("user_credits")
      .update({
        balance: allowance,
        monthly_allowance: allowance,
        last_reset_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Error resetting credits:", error);
    } else {
      console.log(`✅ Credits reset for user ${userId} to ${allowance}`);
    }
  }

  // Helper: resolve subscription tier from Stripe subscription object
  async function resolveSubscriptionTier(
    subscription: Stripe.Subscription, 
    userId: string
  ): Promise<string> {
    // Strategy 1: Check metadata first (most reliable)
    if (subscription.metadata?.plan) {
      const tier = subscription.metadata.plan === "pro" ? "pro" : "starter";
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
    
    // Strategy 3: Final fallback to starter
    console.log(`No metadata or existing record found for user ${userId}, defaulting to starter`);
    return "starter";
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

        // Map plan to tier
        const tier = plan === "pro" ? "pro" : "starter";

        // Determine price
        const priceMap: Record<string, Record<string, number>> = {
          starter: { monthly: 12, yearly: 115 },
          pro: { monthly: 29, yearly: 278 },
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

        // FIXED PROBLEM 1: Only use resetFeatureUsage with correct tier
        // Removed the duplicate upsert block
        await resetFeatureUsage(userId, tier);

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

        // FIXED PROBLEM 2: Only use resetFeatureUsage with correct plan tier
        // Removed the duplicate upsert block
        await resetFeatureUsage(userId, plan);

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

          // Adjust credits if upgrading to Pro - set to 250
          if (newTier === "pro" && existingSub?.tier !== "pro") {
            const { data: credits } = await supabase
              .from("user_credits")
              .select("balance")
              .eq("user_id", userId)
              .single();
            
            if (!credits || credits.balance < 250) {
              await supabase.from("user_credits")
                .update({ balance: 250, monthly_allowance: 250 })
                .eq("user_id", userId);
              console.log(`Upgraded credits to 250 for user ${userId}`);
            }
          }
          
          // Adjust credits if downgrading to Starter - set to 80
          if (newTier === "starter" && existingSub?.tier === "pro") {
            await supabase.from("user_credits")
              .update({ balance: 80, monthly_allowance: 80 })
              .eq("user_id", userId);
            console.log(`Downgraded credits to 80 for user ${userId}`);
          }

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

        await supabase.from("user_credits").upsert({
          user_id: userId,
          balance: 0,
          monthly_allowance: 0,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

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

        // FIXED PROBLEM 3: Clear credits when payment fails
        await supabase.from("user_credits")
          .update({
            balance: 0,
            monthly_allowance: 0,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        console.log(`⚠️ Payment failed for user ${userId}, downgraded to free and credits cleared`);
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
