import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Lemon Squeezy variant IDs from seed data
const VARIANT_IDS: Record<string, string> = {
  starter_monthly: "1065978",
  starter_yearly: "1065979",
  pro_monthly: "1065981",
  pro_yearly: "1065987",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LS_API_KEY = Deno.env.get("LEMON_SQUEEZY_API_KEY") || Deno.env.get("LEMONSQUEEZY_API_KEY");
    const LS_STORE_ID = Deno.env.get("LEMON_SQUEEZY_STORE_ID");
    if (!LS_API_KEY) throw new Error("LEMON_SQUEEZY_API_KEY not configured");
    if (!LS_STORE_ID) throw new Error("LEMON_SQUEEZY_STORE_ID not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );
    if (userError || !user) throw new Error("Unauthorized");

    const { plan, billing } = await req.json();
    const variantKey = `${plan}_${billing}`;
    const variantId = VARIANT_IDS[variantKey];
    if (!variantId) throw new Error(`Invalid plan: ${variantKey}`);

    console.log(`Creating checkout for user ${user.id}, plan: ${plan}, billing: ${billing}, variant: ${variantId}`);

    // Determine the app origin for redirect URLs
    const origin = req.headers.get("origin") || "https://vaylance.com";

    // Create Lemon Squeezy checkout via API
    const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LS_API_KEY}`,
        "Content-Type": "application/vnd.api+json",
        "Accept": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: {
              email: user.email,
              custom: {
                supabase_user_id: user.id,
                plan,
                billing,
              },
            },
            product_options: {
              redirect_url: `${origin}/dashboard?upgrade=success`,
            },
          },
          relationships: {
            store: {
              data: { type: "stores", id: LS_STORE_ID },
            },
            variant: {
              data: { type: "variants", id: variantId },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LemonSqueezy API error:", errorText);
      throw new Error(`LemonSqueezy API error: ${response.status}`);
    }

    const result = await response.json();
    const checkoutUrl = result.data?.attributes?.url;

    if (!checkoutUrl) throw new Error("No checkout URL returned");

    console.log(`Checkout created for user ${user.id}: ${checkoutUrl}`);

    return new Response(
      JSON.stringify({ url: checkoutUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("lemonsqueezy-checkout error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
