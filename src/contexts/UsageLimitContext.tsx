import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'premium';
export type UsageAction =
  | 'resume_ats'
  | 'cover_letter'
  | 'interview_prep'
  | 'salary_intel'
  | 'linkedin'
  | 'skill_gap'
  | 'radar_alert'
  | 'docx_rewrite';

// Credit cost per action (single unified wallet model)
export const ACTION_COSTS: Record<UsageAction, number> = {
  resume_ats: 1,
  cover_letter: 1,
  linkedin: 1,
  skill_gap: 1,
  interview_prep: 3,
  salary_intel: 2,
  radar_alert: 2,
  docx_rewrite: 3,
};

export const ACTION_LABELS: Record<UsageAction, string> = {
  resume_ats: 'Resume + ATS',
  cover_letter: 'Cover letter',
  interview_prep: 'Mock interview',
  salary_intel: 'Salary insight',
  linkedin: 'LinkedIn optimization',
  skill_gap: 'Skill gap analysis',
  radar_alert: 'Job Radar scan',
  docx_rewrite: 'AI DOCX rewrite',
};

// Total monthly credit pool per tier
export const TIER_POOL: Record<SubscriptionTier, number> = {
  free: 25,
  starter: 80,
  pro: 250,
  premium: 600,
};

interface UsageLimitContextType {
  tier: SubscriptionTier;
  displayTier: 'Free' | 'Starter' | 'Pro';
  subscriptionEnd: string | null;
  /** Total credits available right now (monthly + plan top-ups) */
  credits: number;
  /** Monthly allowance for the user's tier */
  monthlyAllowance: number;
  loading: boolean;
  /** Cost of an action in credits */
  costOf: (action: UsageAction) => number;
  /** Can the user afford this action? */
  canUse: (action: UsageAction) => boolean;
  /** How many times the user can still perform this action with current balance */
  getRemaining: (action: UsageAction) => number;
  /** Tier-defined max number of times the action could be performed in a fresh month */
  getLimit: (action: UsageAction) => number;
  /** Spend credits for an action. Returns true on success. */
  trackUsage: (action: UsageAction) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const UsageLimitContext = createContext<UsageLimitContextType | undefined>(undefined);

export const UsageLimitProvider = ({ children }: { children: ReactNode }) => {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [monthlyAllowance, setMonthlyAllowance] = useState<number>(25);
  const [loading, setLoading] = useState(true);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setTier('free');
        setCredits(0);
        setLoading(false);
        setInitialFetchDone(true);
        return;
      }

      const { data: subData } = await supabase
        .from('user_subscriptions')
        .select('tier, plan_status, current_period_end')
        .eq('user_id', session.user.id)
        .maybeSingle();

      let resolvedTier: SubscriptionTier = 'free';
      if (subData?.plan_status === 'active' && subData?.tier) {
        const raw = subData.tier as SubscriptionTier;
        resolvedTier = raw === 'premium' ? 'pro' : raw;
        setSubscriptionEnd(subData.current_period_end ?? null);
      } else {
        setSubscriptionEnd(null);
      }
      setTier(resolvedTier);
      setMonthlyAllowance(TIER_POOL[resolvedTier]);

      const { data: creditData } = await supabase
        .from('user_credits')
        .select('balance, plan_credits, monthly_allowance')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (creditData) {
        setCredits((creditData.balance ?? 0) + (creditData.plan_credits ?? 0));
        if (creditData.monthly_allowance) setMonthlyAllowance(creditData.monthly_allowance);
      } else {
        setCredits(0);
      }
    } catch (err) {
      console.error('[UsageLimit] fetchAll error:', err);
      setTier('free');
      setCredits(0);
    } finally {
      setLoading(false);
      setInitialFetchDone(true);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') fetchAll();
      else if (event === 'SIGNED_OUT') {
        setTier('free');
        setCredits(0);
        setLoading(false);
        setInitialFetchDone(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchAll]);

  const costOf = (action: UsageAction) => ACTION_COSTS[action] ?? 1;
  const getLimit = (action: UsageAction) => Math.floor(monthlyAllowance / costOf(action));
  const getRemaining = (action: UsageAction) => Math.max(0, Math.floor(credits / costOf(action)));

  const canUse = (action: UsageAction) => {
    if (loading || !initialFetchDone) return false;
    return credits >= costOf(action);
  };

  const trackUsage = async (action: UsageAction): Promise<boolean> => {
    if (loading || !initialFetchDone) return false;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const cost = costOf(action);
      const { data, error } = await supabase.rpc('spend_credit', {
        p_user_id: session.user.id,
        p_action: action,
        p_amount: cost,
        p_description: ACTION_LABELS[action],
      });
      if (error || data === false) {
        console.error('[UsageLimit] spend_credit failed:', error);
        return false;
      }
      setCredits((prev) => Math.max(0, prev - cost));
      return true;
    } catch (err) {
      console.error('[UsageLimit] trackUsage error:', err);
      return false;
    }
  };

  const displayTier: 'Free' | 'Starter' | 'Pro' =
    tier === 'free' ? 'Free' : tier === 'starter' ? 'Starter' : 'Pro';

  return (
    <UsageLimitContext.Provider
      value={{
        tier,
        displayTier,
        subscriptionEnd,
        credits,
        monthlyAllowance,
        loading,
        costOf,
        canUse,
        getRemaining,
        getLimit,
        trackUsage,
        refresh: fetchAll,
      }}
    >
      {children}
    </UsageLimitContext.Provider>
  );
};

export const useUsageLimit = () => {
  const ctx = useContext(UsageLimitContext);
  if (!ctx) throw new Error('useUsageLimit must be used within UsageLimitProvider');
  return ctx;
};

export const useSubscription = useUsageLimit;
