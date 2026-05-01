import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { TIER_LIMITS, SubscriptionTier, UsageAction } from "./tierLimits.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export interface AuthedUser {
  id: string;
  email: string | null;
  tier: SubscriptionTier;
  serviceClient: SupabaseClient;
}

/**
 * Authenticate the caller via Authorization: Bearer <jwt>.
 * Returns either the user (with their resolved subscription tier) or a Response to send back.
 */
export async function requireUser(req: Request): Promise<AuthedUser | Response> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }
  const token = authHeader.replace("Bearer ", "");

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

  const authClient = createClient(supabaseUrl, anonKey);
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data?.user) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const serviceClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  // Resolve tier
  let tier: SubscriptionTier = "free";
  const { data: subData } = await serviceClient
    .from("user_subscriptions")
    .select("tier, plan_status")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (subData?.plan_status === "active" && subData?.tier) {
    tier = subData.tier as SubscriptionTier;
  }

  return {
    id: data.user.id,
    email: data.user.email ?? null,
    tier,
    serviceClient,
  };
}

/**
 * Check the user's monthly usage for an action. Returns null if allowed,
 * or a 429 Response if over the quota for their tier.
 */
export async function enforceQuota(
  user: AuthedUser,
  action: UsageAction,
): Promise<Response | null> {
  const limit = TIER_LIMITS[user.tier]?.[action] ?? 0;
  if (limit <= 0) {
    return jsonResponse(
      { error: "Your plan does not include this feature.", action, tier: user.tier },
      402,
    );
  }

  const periodStart = new Date(
    Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1),
  ).toISOString();

  const { data: usage } = await user.serviceClient
    .from("feature_usage")
    .select("count")
    .eq("user_id", user.id)
    .eq("action", action)
    .gte("period_start", periodStart)
    .maybeSingle();

  const used = usage?.count ?? 0;
  if (used >= limit) {
    return jsonResponse(
      {
        error: "Monthly limit reached for this feature. Upgrade to continue.",
        action,
        tier: user.tier,
        used,
        limit,
      },
      429,
    );
  }
  return null;
}

/**
 * Record successful usage. Call AFTER the AI call returned a usable result.
 */
export async function recordUsage(user: AuthedUser, action: UsageAction): Promise<void> {
  const { error } = await user.serviceClient.rpc("increment_feature_usage", {
    p_user_id: user.id,
    p_action: action,
  });
  if (error) console.error("[recordUsage] failed:", error.message);
}
