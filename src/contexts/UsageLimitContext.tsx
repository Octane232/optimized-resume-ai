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
  | 'job_search'
  | 'bullet_rewrite';

// ===== STEP 4: Add PLAN_LIMITS Constant - MUST BE EXPORTED =====
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
  job_search: 'Job search',
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
  job_search: "Job Search",
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
  job_search: "Search for jobs across multiple platforms",
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

      // Get subscription tier - UPDATED to include trial_end
      const { data: subData } = await supabase
        .from('user_subscriptions')
        .select('tier, plan_status, current_period_end, trial_end')
        .eq('user_id', session.user.id)
        .maybeSingle();

      let resolvedTier: SubscriptionTier = 'free';
      
      // FIXED: Handle trial status properly
      if (subData?.plan_status === 'active' && subData?.tier) {
        const raw = subData.tier as string;
        // Map old tier names to new ones
        if (raw === 'starter') resolvedTier = 'pro';
        else if (raw === 'premium') resolvedTier = 'elite';
        else if (raw === 'pro') resolvedTier = 'pro';
        else if (raw === 'elite') resolvedTier = 'elite';
        else resolvedTier = 'free';
        setSubscriptionEnd(subData.current_period_end ?? null);
      } else if (subData?.plan_status === 'trial') {
        const trialEnd = subData?.trial_end ? new Date(subData.trial_end) : null;
        if (trialEnd && new Date() < trialEnd) {
          resolvedTier = 'trial';
          console.log(`[UsageLimit] Active trial until ${subData.trial_end}`);
        } else {
          resolvedTier = 'free';
          console.log(`[UsageLimit] Trial expired, downgraded to free`);
        }
        setSubscriptionEnd(subData.trial_end ?? null);
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
