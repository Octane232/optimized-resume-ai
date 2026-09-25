import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

// ===== STEP 1: Fix Types =====
export type SubscriptionTier = 'free' | 'trial' | 'pro' | 'elite';
export type UsageAction =
  | 'resume_ats'
  | 'cover_letter'
  | 'interview_prep'
  | 'salary_intel'
  | 'linkedin'
  | 'skill_gap'
  | 'radar_alert'
  | 'docx_rewrite'
  | 'resume_parse'
  | 'bullet_rewrite';

// ===== Monthly limits per tier =====
// free  = account with no active subscription (trial ended or cancelled)
// trial = 3-day Stripe trial, fair-use caps
// pro   = $24/month
// elite = $49/month
export const PLAN_LIMITS: Record<SubscriptionTier, Record<UsageAction, number>> = {
  free: {
    resume_ats: 1,
    cover_letter: 1,
    linkedin: 0,
    skill_gap: 0,
    interview_prep: 0,
    salary_intel: 1,
    radar_alert: 3,
    docx_rewrite: 0,
    resume_parse: 2,
    bullet_rewrite: 3,
  },
  trial: {
    resume_ats: 5,
    cover_letter: 5,
    linkedin: 3,
    skill_gap: 3,
    interview_prep: 3,
    salary_intel: 3,
    radar_alert: 5,
    docx_rewrite: 3,
    resume_parse: 10,
    bullet_rewrite: 15,
  },
  pro: {
    resume_ats: 40,
    cover_letter: 40,
    linkedin: 20,
    skill_gap: 20,
    interview_prep: 40,
    salary_intel: 15,
    radar_alert: 30,
    docx_rewrite: 15,
    resume_parse: 120,
    bullet_rewrite: 150,
  },
  elite: {
    resume_ats: 150,
    cover_letter: 150,
    linkedin: 60,
    skill_gap: 60,
    interview_prep: 120,
    salary_intel: 40,
    radar_alert: 100,
    docx_rewrite: 50,
    resume_parse: 500,
    bullet_rewrite: 400,
  },
};

// ===== Display Names (kept for UI) =====
export const ACTION_LABELS: Record<UsageAction, string> = {
  resume_ats: 'Resume + ATS',
  cover_letter: 'Cover letter',
  interview_prep: 'Mock interview',
  salary_intel: 'Salary insight',
  linkedin: 'LinkedIn optimization',
  skill_gap: 'Skill gap analysis',
  radar_alert: 'Job Radar scan',
  docx_rewrite: 'AI DOCX rewrite',
  resume_parse: 'Resume upload',
  bullet_rewrite: 'Bullet rewrite',
};

// ===== Feature Display Names (for UI) =====
export const FEATURE_NAMES: Record<UsageAction, string> = {
  resume_ats: "Resume + ATS Optimization",
  cover_letter: "Cover Letter Generation",
  linkedin: "LinkedIn Optimizer",
  skill_gap: "Skill Gap Analyzer",
  interview_prep: "Interview Practice",
  salary_intel: "Salary Intelligence",
  radar_alert: "Job Radar Alerts",
  docx_rewrite: "DOCX Resume Rewrite",
  resume_parse: "Resume File Upload",
  bullet_rewrite: "Bullet Point Rewrite",
};

// ===== Feature Descriptions =====
export const FEATURE_DESCRIPTIONS: Record<UsageAction, string> = {
  resume_ats: "Tailored resume + cover letter + ATS score in one click",
  cover_letter: "AI-generated cover letters tailored to each job",
  linkedin: "Optimize your LinkedIn profile for recruiters",
  skill_gap: "Identify missing skills and get learning recommendations",
  interview_prep: "Practice with AI interview coach and get feedback",
  salary_intel: "Real-time salary data and negotiation tips",
  radar_alert: "Discover hidden job opportunities before they're posted",
  docx_rewrite: "AI-powered DOCX resume rewriting",
  resume_parse: "Upload and parse PDF/DOCX resume files",
  bullet_rewrite: "AI-powered bullet point rewriting for resumes",
};

interface UsageLimitContextType {
  tier: SubscriptionTier;
  displayTier: 'Free' | 'Trial' | 'Pro' | 'Elite';
  subscriptionEnd: string | null;
  loading: boolean;
  /** Can the user perform this action? */
  canUse: (action: UsageAction) => boolean;
  /** How many times the user can still perform this action */
  getRemaining: (action: UsageAction) => number;
  /** Total limit for this action on current tier */
  getLimit: (action: UsageAction) => number;
  /** Current usage count for this action */
  getCurrentUsage: (action: UsageAction) => number;
  /** Increment usage for an action after successful operation */
  trackUsage: (action: UsageAction) => Promise<boolean>;
  refresh: () => Promise<void>;
}

// Separate interface for subscription-only data
interface SubscriptionContextType {
  tier: SubscriptionTier;
  displayTier: 'Free' | 'Trial' | 'Pro' | 'Elite';
  subscriptionEnd: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

const UsageLimitContext = createContext<UsageLimitContextType | undefined>(undefined);
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const UsageLimitProvider = ({ children }: { children: ReactNode }) => {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  
  // ===== STEP 3: Add usageData State =====
  const [usageData, setUsageData] = useState<Record<string, number>>({});

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setTier('free');
        setUsageData({});
        setLoading(false);
        setInitialFetchDone(true);
        return;
      }

      // Get subscription tier
      // Ordered + limited instead of maybeSingle(): if more than one row
      // ever exists for a user, maybeSingle() silently returns null and
      // the code below falls back to 'free' (0 limits on everything).
      // Taking the most recently updated row avoids that failure mode.
      const { data: subRows } = await supabase
        .from('user_subscriptions')
        .select('tier, plan_status, current_period_end')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      const subData = subRows?.[0] ?? null;

      let resolvedTier: SubscriptionTier = 'free';

      const notExpired =
        !subData?.current_period_end ||
        new Date(subData.current_period_end).getTime() > Date.now();

      const activeStatus =
        subData?.plan_status === 'active' || subData?.plan_status === 'trialing';

      if (activeStatus && subData?.tier && notExpired) {
        const raw = subData.tier as string;
        if (raw === 'trial') resolvedTier = 'trial';
        else if (raw === 'starter') resolvedTier = 'pro';
        else if (raw === 'premium') resolvedTier = 'elite';
        else if (raw === 'pro') resolvedTier = 'pro';
        else if (raw === 'elite') resolvedTier = 'elite';
        else resolvedTier = 'free';
        setSubscriptionEnd(subData.current_period_end ?? null);
      } else {
        setSubscriptionEnd(null);
      }


      setTier(resolvedTier);

      // ===== STEP 5: Replace user_credits Query =====
      const { data: usageRows } = await supabase
        .from('user_usage')
        .select('feature, used')
        .eq('user_id', session.user.id);

      if (usageRows) {
        const map: Record<string, number> = {};
        usageRows.forEach(row => { 
          map[row.feature] = row.used; 
        });
        setUsageData(map);
      } else {
        setUsageData({});
      }
    } catch (err) {
      console.error('[UsageLimit] fetchAll error:', err);
      setTier('free');
      setUsageData({});
    } finally {
      setLoading(false);
      setInitialFetchDone(true);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchAll();
      } else if (event === 'SIGNED_OUT') {
        setTier('free');
        setUsageData({});
        setLoading(false);
        setInitialFetchDone(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchAll]);

  // ===== Helper Functions =====
  const getLimit = useCallback((action: UsageAction): number => {
    return PLAN_LIMITS[tier]?.[action] ?? 0;
  }, [tier]);

  const getCurrentUsage = useCallback((action: UsageAction): number => {
    return usageData[action] ?? 0;
  }, [usageData]);

  // ===== STEP 7: Replace getRemaining =====
  const getRemaining = useCallback((action: UsageAction): number => {
    const limit = PLAN_LIMITS[tier]?.[action] ?? 0;
    const used = usageData[action] ?? 0;
    return Math.max(0, limit - used);
  }, [tier, usageData]);

  // ===== STEP 6: Replace canUse =====
  const canUse = useCallback((action: UsageAction): boolean => {
    if (loading || !initialFetchDone) return false;
    const limit = PLAN_LIMITS[tier]?.[action] ?? 0;
    const used = usageData[action] ?? 0;
    return used < limit;
  }, [tier, usageData, loading, initialFetchDone]);

  // ===== STEP 8: Replace trackUsage =====
  const trackUsage = useCallback(async (action: UsageAction): Promise<boolean> => {
    if (loading || !initialFetchDone) return false;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const { data, error } = await supabase.rpc('increment_usage', {
        p_user_id: session.user.id,
        p_feature: action,
      });

      if (error || !data) {
        console.error('[UsageLimit] increment_usage failed:', error);
        return false;
      }

      // Update local state optimistically
      setUsageData(prev => ({ 
        ...prev, 
        [action]: (prev[action] ?? 0) + 1 
      }));
      
      return true;
    } catch (err) {
      console.error('[UsageLimit] trackUsage error:', err);
      return false;
    }
  }, [loading, initialFetchDone]);

  const displayTier: 'Free' | 'Trial' | 'Pro' | 'Elite' =
    tier === 'free' ? 'Free' : tier === 'trial' ? 'Trial' : tier === 'pro' ? 'Pro' : 'Elite';

  const usageLimitValue: UsageLimitContextType = {
    tier,
    displayTier,
    subscriptionEnd,
    loading,
    canUse,
    getRemaining,
    getLimit,
    getCurrentUsage,
    trackUsage,
    refresh: fetchAll,
  };

  const subscriptionValue: SubscriptionContextType = {
    tier,
    displayTier,
    subscriptionEnd,
    loading,
    refresh: fetchAll,
  };

  return (
    <UsageLimitContext.Provider value={usageLimitValue}>
      <SubscriptionContext.Provider value={subscriptionValue}>
        {children}
      </SubscriptionContext.Provider>
    </UsageLimitContext.Provider>
  );
};

export const useUsageLimit = () => {
  const ctx = useContext(UsageLimitContext);
  if (!ctx) throw new Error('useUsageLimit must be used within UsageLimitProvider');
  return ctx;
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within UsageLimitProvider');
  return ctx;
};
