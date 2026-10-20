import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Stripe prices (live account)
// Only send customers back to our own sites after checkout.
function safeOrigin(origin: string | null): string {
  const fallback = "https://vaylance.com";
  if (!origin) return fallback;
  try {
    const u = new URL(origin);
    const h = u.hostname.toLowerCase();
    const ok =
      (u.protocol === "https:" &&
        (h === "vaylance.com" || h === "www.vaylance.com" ||
          h.endsWith(".lovable.app") || h.endsWith(".lovableproject.com"))) ||
      h === "localhost" || h === "127.0.0.1";
    return ok ? u.origin : fallback;
  } catch {
    return fallback;
  }
}

const PRICE_IDS = {
  pro_monthly: "price_1URpXZJWRvoiSBe0Pd8kSbMX",
  elite_monthly: "price_1USZ03JWRvoiSBe0B0Z2tdlG",
};


serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

    if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (userError || !user) throw new Error("Unauthorized");

    const { plan, billing } = await req.json();

    // Build price key e.g. "pro_monthly" or "elite_yearly"
    const priceKey = `${plan}_${billing}` as keyof typeof PRICE_IDS;
    const priceId = PRICE_IDS[priceKey];
    if (!priceId) throw new Error(`Invalid plan: ${priceKey}`);

    // Check if customer already exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id as string | null | undefined;

    // Validate the stored customer still exists in THIS Stripe mode (test ids
    // are invalid after switching to live keys).
    if (customerId) {
      try {
        const existing = await stripe.customers.retrieve(customerId);
        if ((existing as any)?.deleted) customerId = null;
      } catch (_e) {
        console.log("Stale stripe customer, recreating:", customerId);
        customerId = null;
      }
    }

    const emailVerified = Boolean((user as any).email_confirmed_at || (user as any).confirmed_at);
    if (!customerId && user.email && emailVerified) {
      // Reuse a live customer with the same verified email, unless it belongs to another account
      const found = await stripe.customers.list({ email: user.email, limit: 1 });
      const match = found.data[0];
      const ownerId = match?.metadata?.supabase_user_id;
      if (match && (!ownerId || ownerId === user.id)) customerId = match.id;
    }

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
    }

    if (customerId !== profile?.stripe_customer_id) {
      await supabase
        .from("profiles")
        .upsert({ user_id: user.id, stripe_customer_id: customerId }, { onConflict: "user_id" });
    }


    // 3-day free trial: only for customers who never subscribed before.
    let grantTrial = false;
    try {
      const priorSubs = await stripe.subscriptions.list({
        customer: customerId,
        status: "all",
        limit: 1,
      });
      grantTrial = priorSubs.data.length === 0;
    } catch (e) {
      console.log("Could not check prior subscriptions, skipping trial:", e);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${safeOrigin(req.headers.get("origin"))}/dashboard?upgrade=success`,
      cancel_url: `${safeOrigin(req.headers.get("origin"))}/dashboard?upgrade=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        plan,
        billing,
      },
      subscription_data: {
        ...(grantTrial ? { trial_period_days: 3 } : {}),
        metadata: {
          supabase_user_id: user.id,
          plan,
          billing,
        },
      },
      allow_promotion_codes: true,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("stripe-checkout error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
