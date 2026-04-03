import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { findMatchingSubscriptionPlan } from "../_shared/subscriptionPlanResolver.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const WEBHOOK_SECRET = Deno.env.get("LEMON_SQUEEZY_WEBHOOK_SECRET") || Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  if (!WEBHOOK_SECRET) {
    console.error("LEMON_SQUEEZY_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const body = await req.text();

  // Verify webhook signature
  const signature = req.headers.get("x-signature");
  if (signature) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(WEBHOOK_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
    const expectedSignature = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return new Response("Invalid signature", { status: 400 });
    }
  }

  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // Log webhook for debugging
  await supabase.from("webhook_logs").insert({
    event_type: payload.meta?.event_name || "unknown",
    payload,
  });

  const eventName = payload.meta?.event_name;
  console.log(`Received LS webhook: ${eventName}`);

  const customData = payload.meta?.custom_data || {};
  const userId = customData.supabase_user_id;
  const plan = customData.plan;
  const billing = customData.billing;
  const attributes = payload.data?.attributes || {};

  async function resolvePlanId(planName: string, billingCycle?: string | null): Promise<string | null> {
    const { data: plans, error } = await supabase
      .from("subscription_plans")
      .select("id, name")
      .limit(50);

    if (error) {
      console.error("Error resolving plan_id:", error);
      return null;
    }

    const matchedPlan = findMatchingSubscriptionPlan(plans || [], planName, billingCycle);

    if (!matchedPlan) {
      const availablePlans = (plans || []).map((plan) => plan.name).filter(Boolean).join(", ");
      console.error(`Plan not found for ${planName} (${billingCycle || "monthly"}). Available plans: ${availablePlans}`);
      return null;
    }

    return matchedPlan.id;
  }

  try {
    if (
      eventName === "order_created" ||
      eventName === "subscription_created" ||
      eventName === "subscription_updated"
    ) {
      if (!userId || !plan) {
        console.error("Missing userId or plan", { userId, plan, customData });
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const status = attributes.status;
      const isActive = status === "active" || status === "on_trial" || eventName === "order_created";

      if (!isActive && eventName === "subscription_updated") {
        if (status === "cancelled" || status === "expired") {
          await supabase.from("user_subscriptions")
            .update({ plan_status: "cancelled", tier: "free", updated_at: new Date().toISOString() })
            .eq("user_id", userId);
          console.log(`Subscription cancelled for ${userId}`);
        }
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const planId = await resolvePlanId(plan, billing);
      if (!planId) {
        console.error(`Plan not found: ${plan}`);
        return new Response(JSON.stringify({ received: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const periodEnd = attributes.renews_at || attributes.ends_at || null;
      const tier = plan === "pro" ? "pro" : "starter";
      const priceMap: Record<string, Record<string, number>> = {
        starter: { monthly: 12, yearly: 115 },
        pro: { monthly: 29, yearly: 278 },
      };
      const price = priceMap[plan]?.[billing || "monthly"] || 0;

      await supabase.from("user_subscriptions").upsert({
        user_id: userId,
        plan_id: planId,
        tier,
        billing_cycle: billing || "monthly",
        plan_status: "active",
        price,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

      const credits = plan === "pro" ? 100 : 50;
      await supabase.from("user_credits").upsert({
        user_id: userId,
        balance: credits,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

      const lsSubId = payload.data?.id?.toString();
      if (lsSubId) {
        await supabase.from("profiles")
          .update({ lemonsqueezy_subscription_id: lsSubId })
          .eq("user_id", userId);
      }

      console.log(`User ${userId} upgraded to ${plan} (${billing})`);

    } else if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
      if (userId) {
        await supabase.from("user_subscriptions")
          .update({ plan_status: "cancelled", tier: "free", updated_at: new Date().toISOString() })
          .eq("user_id", userId);
        console.log(`Subscription ended for ${userId}`);
      }

    } else if (eventName === "subscription_payment_failed") {
      if (userId) {
        await supabase.from("user_subscriptions")
          .update({ plan_status: "past_due", updated_at: new Date().toISOString() })
          .eq("user_id", userId);
        console.log(`Payment failed for ${userId}`);
      }

    } else {
      console.log(`Unhandled event: ${eventName}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook handler failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
