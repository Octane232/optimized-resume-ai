import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
// PROBLEM 1 FIXED: Updated imports to use PLAN_LIMITS instead of ACTION_COSTS
import { SubscriptionTier, UsageAction, PLAN_LIMITS, getFeatureLimit, getRemainingUses } from "./tierLimits.ts";

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
    .select("tier, plan_status, trial_end")
    .eq("user_id", data.user.id)
    .maybeSingle();
  
  // Updated: Now includes 'trial' as a valid status
  if ((subData?.plan_status === 'active' || subData?.plan_status === 'trial') && subData?.tier) {
    // Check if trial has expired
    if (subData?.plan_status === 'trial' && subData?.trial_end) {
      const trialEnd = new Date(subData.trial_end);
      if (new Date() > trialEnd) {
        tier = 'free';
        console.log(`Trial expired for user ${data.user.id}, downgraded to free`);
      } else {
        tier = 'trial';
        console.log(`Active trial for user ${data.user.id} until ${subData.trial_end}`);
      }
    } else {
      tier = subData.tier as SubscriptionTier;
    }
  }

  return {
    id: data.user.id,
    email: data.user.email ?? null,
    tier,
    serviceClient,
  };
}

// ===== PROBLEM 4: Add checkFeatureLimit function =====
export async function checkFeatureLimit(
  user: AuthedUser,
  action: UsageAction
): Promise<Response | null> {
  const limit = getFeatureLimit(user.tier, action);

  if (limit === 0) {
    return jsonResponse({
      error: `This feature is not available on your ${user.tier} plan. Upgrade to access it.`,
      action,
      tier: user.tier,
      limit: 0,
      remaining: 0,
    }, 402);
  }

  const { data } = await user.serviceClient
    .from("user_usage")
    .select("used")
    .eq("user_id", user.id)
    .eq("feature", action)
    .maybeSingle();

  const used = data?.used ?? 0;
  const remaining = Math.max(0, limit - used);

  if (remaining <= 0) {
    return jsonResponse({
      error: `You've reached your monthly limit for ${action}. Upgrade to get more uses.`,
      action,
      tier: user.tier,
      limit,
      used,
      remaining: 0,
    }, 402);
  }

  return null;
}

// ===== PROBLEM 4: Add incrementFeatureUsage function =====
export async function incrementFeatureUsage(
  user: AuthedUser,
  action: UsageAction
): Promise<boolean> {
  const { data: existing } = await user.serviceClient
    .from("user_usage")
    .select("used")
    .eq("user_id", user.id)
    .eq("feature", action)
    .maybeSingle();

  const currentUsed = existing?.used ?? 0;
  const resetDate = new Date();
  resetDate.setDate(resetDate.getDate() + 30);

  const { error } = await user.serviceClient
    .from("user_usage")
    .upsert({
      user_id: user.id,
      feature: action,
      used: currentUsed + 1,
      reset_date: resetDate.toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,feature" });

  if (error) {
    console.error("[incrementFeatureUsage] error:", error.message);
    return false;
  }
  return true;
}

// ===== PROBLEM 2 FIXED: enforceQuota now uses checkFeatureLimit =====
export async function enforceQuota(
  user: AuthedUser,
  action: UsageAction,
): Promise<Response | null> {
  return checkFeatureLimit(user, action);
}

// ===== PROBLEM 3 FIXED: recordUsage now uses incrementFeatureUsage =====
export async function recordUsage(user: AuthedUser, action: UsageAction): Promise<void> {
  await incrementFeatureUsage(user, action);
}
