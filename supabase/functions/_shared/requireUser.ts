import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SubscriptionTier, UsageAction, ACTION_COSTS } from "./tierLimits.ts";

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
 * Pre-flight: check the user has enough credits for the action.
 * Returns null if allowed, or a 402 response if not.
 */
export async function enforceQuota(
  user: AuthedUser,
  action: UsageAction,
): Promise<Response | null> {
  const cost = ACTION_COSTS[action] ?? 1;
  const { data } = await user.serviceClient
    .from("user_credits")
    .select("balance, plan_credits")
    .eq("user_id", user.id)
    .maybeSingle();
  const total = (data?.balance ?? 0) + (data?.plan_credits ?? 0);
  if (total < cost) {
    return jsonResponse(
      {
        error: "You've used all your credits. Upgrade to keep going.",
        action,
        tier: user.tier,
        credits: total,
        cost,
      },
      402,
    );
  }
  return null;
}

/**
 * Record successful usage by spending credits via the secured RPC.
 */
export async function recordUsage(user: AuthedUser, action: UsageAction): Promise<void> {
  const cost = ACTION_COSTS[action] ?? 1;
  const { error } = await user.serviceClient.rpc("spend_credit", {
    p_user_id: user.id,
    p_action: action,
    p_amount: cost,
    p_description: action,
  });
  if (error) console.error("[recordUsage] failed:", error.message);
}
