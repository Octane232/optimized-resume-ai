import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0";

// ===== Constants =====
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RETURN_URL = "https://vaylance.com/dashboard?tab=billing";

// ===== Helper Functions =====
const handleCorsPreflight = (req: Request): Response | null => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS_HEADERS });
  }
  return null;
};

const createErrorResponse = (message: string, status: number = 500): Response => {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" }
    }
  );
};

const createSuccessResponse = (data: unknown): Response => {
  return new Response(
    JSON.stringify(data),
    { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
  );
};

// ===== Main Handler =====
serve(async (req: Request) => {
  try {
    // Handle CORS preflight
    const corsResponse = handleCorsPreflight(req);
    if (corsResponse) return corsResponse;

    // ===== Validate Environment Variables =====
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      return createErrorResponse("Stripe configuration error", 500);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase credentials not configured");
      return createErrorResponse("Supabase configuration error", 500);
    }

    // ===== Initialize Clients =====
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2023-10-16" });

    // ===== Authenticate User =====
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      return createErrorResponse("Unauthorized", 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error("Authentication error:", userError?.message);
      return createErrorResponse("Unauthorized", 401);
    }

    // ===== Get Customer ID from Profile =====
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Profile fetch error:", profileError.message);
      return createErrorResponse("Failed to fetch customer profile", 500);
    }

    if (!profile?.stripe_customer_id) {
      console.error(`No Stripe customer found for user: ${user.id}`);
      return createErrorResponse("No Stripe customer found. Please contact support.", 404);
    }

    // ===== Create Customer Portal Session =====
    let portalSession;
    try {
      portalSession = await stripe.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: RETURN_URL,
      });
    } catch (stripeError) {
      console.error("Stripe portal session error:", stripeError);
      return createErrorResponse("Failed to create billing portal session", 500);
    }

    // ===== Return Success Response =====
    return createSuccessResponse({ url: portalSession.url });

  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error in customer-portal function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return createErrorResponse(errorMessage, 500);
  }
});
