import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

// Map Stripe price IDs to tier names
const getTierFromPriceId = (priceId: string): string => {
  const proPrices = ['price_1SaQC1CcyAnmb029kDR4Mof6', 'price_1SaQDUCcyAnmb029YBXFwjjH'];
  const premiumPrices = ['price_1SaQCbCcyAnmb0297JqYygrH', 'price_1SaQE7CcyAnmb029QOzfgiQG'];
  
  if (proPrices.includes(priceId)) return 'pro';
  if (premiumPrices.includes(priceId)) return 'premium';
  return 'free';
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // FIRST: Check database for subscription (source of truth)
    const { data: dbSubscription, error: dbError } = await supabaseClient
      .from("user_subscriptions")
      .select("tier, plan_status, current_period_end")
      .eq("user_id", user.id)
      .maybeSingle();

    if (dbError) {
      logStep("Database query error", { error: dbError.message });
    }

    // If we have an active subscription in the database, use it
    if (dbSubscription && dbSubscription.plan_status === "active" && dbSubscription.tier) {
      logStep("Found active subscription in database", { 
        tier: dbSubscription.tier, 
        endDate: dbSubscription.current_period_end 
      });
      
      return new Response(JSON.stringify({
        subscribed: true,
        tier: dbSubscription.tier,
        subscription_end: dbSubscription.current_period_end,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("No active subscription in database, checking Stripe as fallback");

    // FALLBACK: Check Stripe directly and sync to database if found
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found, returning free tier");
      return new Response(JSON.stringify({ 
        subscribed: false,
        tier: 'free',
        subscription_end: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
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
      logStep("No active Stripe subscription found");
      return new Response(JSON.stringify({ 
        subscribed: false,
        tier: 'free',
        subscription_end: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Found active subscription in Stripe - sync to database
    const subscription = subscriptions.data[0];
    let subscriptionEnd = null;
    try {
      if (subscription.current_period_end) {
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      }
    } catch (e) {
      logStep("Date conversion error", { error: e, rawValue: subscription.current_period_end });
    }
    
    const priceId = subscription.items.data[0]?.price?.id;
    const tier = getTierFromPriceId(priceId || '');

    logStep("Active Stripe subscription found, syncing to database", { 
      subscriptionId: subscription.id, 
      tier, 
      priceId,
      endDate: subscriptionEnd 
    });

    // Sync to database so next time we read from DB
    const { error: upsertError } = await supabaseClient
      .from("user_subscriptions")
      .upsert({
        user_id: user.id,
        plan_id: priceId || "unknown",
        plan_status: "active",
        tier: tier,
        current_period_end: subscriptionEnd,
        billing_cycle: subscription.items.data[0]?.price.recurring?.interval || "month",
      }, { onConflict: "user_id" });

    if (upsertError) {
      logStep("Error syncing subscription to database", { error: upsertError.message });
    } else {
      logStep("Subscription synced to database successfully");
    }

    return new Response(JSON.stringify({
      subscribed: true,
      tier,
      price_id: priceId,
      subscription_end: subscriptionEnd,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
