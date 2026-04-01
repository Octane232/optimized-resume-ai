import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


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

  const eventName = payload.meta?.event_name;
  console.log(`Received Lemon Squeezy webhook event: ${eventName}`);

  // Extract custom data with user ID
  const customData = payload.meta?.custom_data || payload.data?.attributes?.first_order_item?.custom_data || {};
  const userId = customData.supabase_user_id;
  const plan = customData.plan; // "starter" or "pro"
  const billing = customData.billing; // "monthly" or "yearly"

  // Also try to get from urls/checkout custom data
  const attributes = payload.data?.attributes || {};

  // Helper: resolve plan name to subscription_plans UUID
  async function resolvePlanId(planName: string): Promise<string | null> {
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
    switch (eventName) {
      case "order_created":
      case "subscription_created":
      case "subscription_updated": {
        if (!userId || !plan) {
          console.error("Missing user ID or plan in webhook data", { userId, plan, customData });
          break;
        }

        const status = attributes.status;
        const isActive = status === "active" || status === "on_trial" || eventName === "order_created";

        if (!isActive && eventName === "subscription_updated") {
          console.log(`Subscription status is ${status}, not activating`);
          // Handle cancellation/pause
          if (status === "cancelled" || status === "expired") {
            await supabase.from("user_subscriptions")
              .update({
                plan_status: "cancelled",
                tier: "free",
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", userId);
            console.log(`Subscription cancelled for user ${userId}`);
          }
          break;
        }

        // Resolve plan_id UUID
        const planId = await resolvePlanId(plan);
        if (!planId) {
          console.error(`Could not find subscription_plans entry for plan: ${plan}`);
          break;
        }

        // Calculate subscription end date
        const renewsAt = attributes.renews_at;
        const endsAt = attributes.ends_at;
        const periodEnd = renewsAt || endsAt || null;

        // Map plan to tier
        const tier = plan === "pro" ? "pro" : "starter";

        // Determine price
        const priceMap: Record<string, Record<string, number>> = {
          starter: { monthly: 12, yearly: 115 },
          pro: { monthly: 29, yearly: 278 },
        };
        const price = priceMap[plan]?.[billing || "monthly"] || 0;

        // Upsert subscription
        const { error: subError } = await supabase.from("user_subscriptions").upsert({
          user_id: userId,
          plan_id: planId,
          tier,
          billing_cycle: billing || "monthly",
          plan_status: "active",
          price,
          current_period_end: periodEnd,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

        if (subError) {
          console.error("Error updating subscription:", subError);
          break;
        }

        // Add/refresh credits
        const credits = plan === "pro" ? 100 : 50;
        await supabase.from("user_credits").upsert({
          user_id: userId,
          balance: credits,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });

        // Store LemonSqueezy subscription ID on profile
        const lsSubscriptionId = payload.data?.id?.toString();
        if (lsSubscriptionId) {
          await supabase.from("profiles")
            .update({ lemonsqueezy_subscription_id: lsSubscriptionId })
            .eq("user_id", userId);
        }

        console.log(`User ${userId} upgraded to ${plan} (${billing}) — status: active`);
        break;
      }

      case "subscription_cancelled":
      case "subscription_expired": {
        if (!userId) {
          console.error("Missing user ID for cancellation");
          break;
        }

        await supabase.from("user_subscriptions")
          .update({
            plan_status: "cancelled",
            tier: "free",
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        console.log(`Subscription cancelled/expired for user ${userId}`);
        break;
      }

      case "subscription_payment_failed": {
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
        console.log(`Unhandled event type: ${eventName}`);
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
