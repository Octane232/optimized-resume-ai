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

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lsApiKey = Deno.env.get("LEMON_SQUEEZY_API_KEY") || Deno.env.get("LEMONSQUEEZY_API_KEY");

    if (!lsApiKey) {
      console.error("Lemon Squeezy API key not configured");
      return new Response(JSON.stringify({ error: "Payment provider not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get customer ID from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("lemonsqueezy_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    const customerId = profile?.lemonsqueezy_customer_id;
    if (!customerId) {
      console.error(`No LS customer for user ${user.id}`);
      return new Response(JSON.stringify({ error: "No billing account found. Please contact support." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create customer portal URL via Lemon Squeezy API
    // The customer portal URL format: https://STORE.lemonsqueezy.com/billing?customer_id=CUSTOMER_ID
    // But the proper way is via the API
    const portalRes = await fetch("https://api.lemonsqueezy.com/v1/customers/" + customerId, {
      headers: {
        "Authorization": `Bearer ${lsApiKey}`,
        "Accept": "application/vnd.api+json",
      },
    });

    if (!portalRes.ok) {
      const errText = await portalRes.text();
      console.error("LS API error:", errText);
      return new Response(JSON.stringify({ error: "Failed to retrieve billing info" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerData = await portalRes.json();
    const portalUrl = customerData.data?.attributes?.urls?.customer_portal;

    if (!portalUrl) {
      console.error("No portal URL in customer data:", JSON.stringify(customerData.data?.attributes?.urls));
      return new Response(JSON.stringify({ error: "Billing portal unavailable. Please contact support." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ url: portalUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Portal error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
