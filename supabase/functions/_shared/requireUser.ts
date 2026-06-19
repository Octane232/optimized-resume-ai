import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";
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
  
  // Handle trial status properly
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
      const rawTier = subData.tier as string;
      // Map old tier names to new ones
      if (rawTier === 'starter') tier = 'pro';
      else if (rawTier === 'premium') tier = 'elite';
      else if (rawTier === 'pro') tier = 'pro';
      else if (rawTier === 'elite') tier = 'elite';
      else tier = 'free';
    }
  }

  return {
    id: data.user.id,
    email: data.user.email ?? null,
    tier,
    serviceClient,
  };
}

/**
 * Check if user has remaining quota for a feature
 * Returns null if allowed, or a Response if blocked
 */
export async function checkFeatureLimit(
  user: AuthedUser,
  action: UsageAction
): Promise<Response | null> {
  const limit = getFeatureLimit(user.tier, action);

  if (limit === 0) {
    const tierNames = {
      free: "Free",
      trial: "Trial",
      pro: "Pro",
      elite: "Elite"
    };
    return jsonResponse({
      error: `${tierNames[user.tier] || user.tier} plan does not include ${action}. Upgrade to access it.`,
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
    const featureNames: Record<UsageAction, string> = {
      resume_ats: "Resume + ATS runs",
      cover_letter: "Cover Letters",
      linkedin: "LinkedIn Optimizations",
      skill_gap: "Skill Gap Analyses",
      interview_prep: "Interview Prep sessions",
      salary_intel: "Salary Insights",
      radar_alert: "Radar Alerts",
      docx_rewrite: "DOCX Rewrites",
      resume_parse: "Resume Uploads",
      job_search: "Job Searches",
      bullet_rewrite: "Bullet Rewrites",
    };
    const tierNames = {
      free: "Free",
      trial: "Trial",
      pro: "Pro",
      elite: "Elite"
    };
    return jsonResponse({
      error: `Monthly ${featureNames[action] || action} limit reached (${used}/${limit}). ` +
             `Your ${tierNames[user.tier] || user.tier} plan includes ${limit} per month. ` +
             `${user.tier === 'free' || user.tier === 'trial' ? 'Upgrade to Pro or Elite' : user.tier === 'pro' ? 'Upgrade to Elite' : 'Contact support'} for more.`,
      action,
      tier: user.tier,
      limit,
      used,
      remaining: 0,
    }, 402);
  }

  return null;
}

/**
 * Increment usage for a feature
 */
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

/**
 * Check quota and return null if allowed, or Response if blocked
 * @deprecated Use checkFeatureLimit instead
 */
export async function enforceQuota(
  user: AuthedUser,
  action: UsageAction,
): Promise<Response | null> {
  return checkFeatureLimit(user, action);
}

/**
 * Record usage for a feature
 * @deprecated Use incrementFeatureUsage instead
 */
export async function recordUsage(user: AuthedUser, action: UsageAction): Promise<void> {
  await incrementFeatureUsage(user, action);
}

/**
 * Get remaining uses for a feature
 */
export async function getRemainingUsesForUser(
  user: AuthedUser,
  action: UsageAction
): Promise<number> {
  const limit = getFeatureLimit(user.tier, action);
  if (limit === 0) return 0;

  const { data } = await user.serviceClient
    .from("user_usage")
    .select("used")
    .eq("user_id", user.id)
    .eq("feature", action)
    .maybeSingle();

  const used = data?.used ?? 0;
  return Math.max(0, limit - used);
}

/**
 * Get current usage for a feature
 */
export async function getCurrentUsageForUser(
  user: AuthedUser,
  action: UsageAction
): Promise<number> {
  const { data } = await user.serviceClient
    .from("user_usage")
    .select("used")
    .eq("user_id", user.id)
    .eq("feature", action)
    .maybeSingle();

  return data?.used ?? 0;
}
