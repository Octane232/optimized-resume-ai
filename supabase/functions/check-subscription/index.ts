import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRICE_TO_TIER: Record<string, string> = {
  "price_1TubObJWRvoiSBe022Vai2lg": "pro",
  "price_1TubdJJWRvoiSBe0t7LFroSD": "pro",
  "price_1TubbmJWRvoiSBe0pbGLrU1I": "elite",
  "price_1TubeGJWRvoiSBe04wrFEQCC": "elite",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Auth error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Find customer by email
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found, returning free tier");
      return new Response(JSON.stringify({ subscribed: false, tier: "free" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      logStep("No active subscription, reverting to free");
      // Sync free status to DB
      await supabaseClient.from("profiles").update({ plan: "free" }).eq("user_id", user.id);
      return new Response(JSON.stringify({ subscribed: false, tier: "free" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subscription = subscriptions.data[0];
    const priceId = subscription.items.data[0]?.price?.id;
    const tier = PRICE_TO_TIER[priceId] || subscription.metadata?.plan || "starter";
    const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
    logStep("Active subscription found", { priceId, tier, subscriptionEnd });

    // Sync to DB
    const planName = tier === "pro" ? "Pro" : "Starter";
    const { data: planData } = await supabaseClient
      .from("subscription_plans")
      .select("id")
      .ilike("name", planName)
      .limit(1)
      .maybeSingle();

    if (planData?.id) {
      await supabaseClient.from("user_subscriptions").upsert({
        user_id: user.id,
        plan_id: planData.id,
        tier,
        plan_status: "active",
        current_period_end: subscriptionEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
      logStep("Synced user_subscriptions");
    }

    // Sync profile
    await supabaseClient.from("profiles").update({
      plan: tier,
      stripe_customer_id: customerId,
    }).eq("user_id", user.id);
    logStep("Synced profile", { tier, customerId });

    return new Response(JSON.stringify({
      subscribed: true,
      tier,
      subscription_end: subscriptionEnd,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
