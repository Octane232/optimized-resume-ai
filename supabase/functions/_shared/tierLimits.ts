import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ===== Types =====
export type SubscriptionTier = "free" | "trial" | "pro" | "elite";
export type UsageAction =
  | "resume_ats"
  | "cover_letter"
  | "interview_prep"
  | "salary_intel"
  | "linkedin"
  | "skill_gap"
  | "radar_alert"
  | "docx_rewrite"
  | "resume_parse"
  | "job_search"
  | "bullet_rewrite";

// ===== Monthly Limits Per Feature Per Tier =====
export const PLAN_LIMITS: Record<SubscriptionTier, Record<UsageAction, number>> = {
  free: {
    resume_ats: 0,
    cover_letter: 0,
    linkedin: 0,
    skill_gap: 0,
    interview_prep: 0,
    salary_intel: 0,
    radar_alert: 0,
    docx_rewrite: 0,
    resume_parse: 0,
    job_search: 0,
    bullet_rewrite: 0,
  },
  trial: {
    resume_ats: 10,
    cover_letter: 10,
    linkedin: 5,
    skill_gap: 5,
    interview_prep: 10,
    salary_intel: 5,
    radar_alert: 5,
    docx_rewrite: 5,
    resume_parse: 20,
    job_search: 10,
    bullet_rewrite: 20,
  },
  pro: {
    resume_ats: 30,
    cover_letter: 30,
    linkedin: 15,
    skill_gap: 15,
    interview_prep: 30,
    salary_intel: 10,
    radar_alert: 15,
    docx_rewrite: 10,
    resume_parse: 100,
    job_search: 50,
    bullet_rewrite: 75,
  },
  elite: {
    resume_ats: 100,
    cover_letter: 100,
    linkedin: 50,
    skill_gap: 50,
    interview_prep: 100,
    salary_intel: 30,
    radar_alert: 50,
    docx_rewrite: 50,
    resume_parse: 500,
    job_search: 120,
    bullet_rewrite: 300,
  },
};

// ===== Get user's tier from profile =====
export async function getUserTier(userId: string) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const adminClient = createClient(supabaseUrl, serviceKey);

  const { data: profile, error } = await adminClient
    .from("profiles")
    .select("subscription_tier, subscription_end")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching user tier:", error);
    throw new Error("Failed to fetch user tier");
  }

  const tier = profile?.subscription_tier || "free";
  const subscriptionEnd = profile?.subscription_end 
    ? new Date(profile.subscription_end) 
    : null;

  // Check if subscription has expired
  if (subscriptionEnd && subscriptionEnd < new Date()) {
    return { tier: "expired", isExpired: true };
  }

  return { tier, isExpired: false };
}

// ===== Enforce quota for a specific feature =====
export async function enforceQuota(userId: string, feature: UsageAction) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const adminClient = createClient(supabaseUrl, serviceKey);

  const { tier, isExpired } = await getUserTier(userId);

  if (isExpired) {
    throw new Error("Subscription expired - Please upgrade to continue using this feature");
  }

  const tierLimit = PLAN_LIMITS[tier as SubscriptionTier]?.[feature] || 0;
  
  // Count usage for this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const { count: usageCount, error: countError } = await adminClient
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("feature", feature)
    .gte("created_at", startOfMonth.toISOString());

  if (countError) {
    console.error("Error counting usage:", countError);
    throw new Error("Failed to check usage limits");
  }

  const currentUsage = usageCount || 0;
  const remaining = tierLimit - currentUsage;

  if (tierLimit === 0) {
    const tierNames = {
      free: "Free",
      trial: "Trial",
      pro: "Pro",
      elite: "Elite"
    };
    throw new Error(
      `Your ${tierNames[tier as SubscriptionTier] || tier} plan does not include ${feature}. ` +
      `Upgrade to Pro or Elite to use this feature.`
    );
  }

  if (currentUsage >= tierLimit) {
    const tierNames = {
      free: "Free",
      trial: "Trial",
      pro: "Pro",
      elite: "Elite"
    };
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
    throw new Error(
      `Monthly ${featureNames[feature] || feature} limit reached (${currentUsage}/${tierLimit}). ` +
      `Your ${tierNames[tier as SubscriptionTier] || tier} plan includes ${tierLimit} per month. ` +
      `${tier === 'free' || tier === 'trial' ? 'Upgrade to Pro or Elite' : tier === 'pro' ? 'Upgrade to Elite' : 'Contact support'} for more.`
    );
  }

  return { tier, currentUsage, tierLimit, remaining };
}

// ===== Record usage for a specific feature =====
export async function recordUsage(userId: string, feature: UsageAction) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const adminClient = createClient(supabaseUrl, serviceKey);

  const { error } = await adminClient
    .from("usage_events")
    .insert({
      user_id: userId,
      feature: feature,
      created_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error recording usage:", error);
    // Don't throw - we don't want to fail the request if usage recording fails
  }
}

// ===== Check if user can use a feature =====
export async function canUseFeature(userId: string, feature: UsageAction): Promise<boolean> {
  try {
    const { remaining } = await enforceQuota(userId, feature);
    return remaining > 0;
  } catch {
    return false;
  }
}
