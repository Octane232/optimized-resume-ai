import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'premium';

// Kept for backwards compatibility with existing call-sites.
// In the new credit-pool model, the action label is informational only.
export type UsageAction =
  | 'resume_ats'
  | 'cover_letter'
  | 'interview_prep'
  | 'salary_intel'
  | 'linkedin'
  | 'skill_gap'
  | 'radar_alert';

export const ACTION_LABELS: Record<UsageAction, string> = {
  resume_ats: 'Resume + ATS bundle',
  cover_letter: 'Cover letter',
  interview_prep: 'Interview session',
  salary_intel: 'Salary insight',
  linkedin: 'LinkedIn optimization',
  skill_gap: 'Skill gap analysis',
  radar_alert: 'Radar scan',
};

// Plan credit allowances
export const PLAN_CREDITS: Record<SubscriptionTier, number> = {
  free: 0,        // free users only get the monthly 5
  starter: 50,
  pro: 150,
  premium: 150,
};

export const FREE_MONTHLY_CREDITS = 5;

interface UsageLimitContextType {
  tier: SubscriptionTier;
  displayTier: 'Free' | 'Starter' | 'Pro';
  subscriptionEnd: string | null;
  monthlyCredits: number;   // free monthly pool (resets each month)
  planCredits: number;      // credits granted by paid plan (do not expire on cancel until period end)
  totalCredits: number;     // sum of the two
  loading: boolean;
  // Backwards-compatible API
  canUse: (action?: UsageAction) => boolean;
  getRemaining: (action?: UsageAction) => number;
  getLimit: (action?: UsageAction) => number;
  trackUsage: (action?: UsageAction, description?: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const UsageLimitContext = createContext<UsageLimitContextType | undefined>(undefined);

export const UsageLimitProvider = ({ children }: { children: ReactNode }) => {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [monthlyCredits, setMonthlyCredits] = useState(0);
  const [planCredits, setPlanCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setTier('free');
        setMonthlyCredits(0);
        setPlanCredits(0);
        setLoading(false);
        setInitialFetchDone(true);
        return;
      }

      const { data: subData } = await supabase
        .from('user_subscriptions')
        .select('tier, plan_status, current_period_end')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (subData?.plan_status === 'active' && subData?.tier) {
        const raw = subData.tier as SubscriptionTier;
        setTier(raw === 'premium' ? 'pro' : raw);
        setSubscriptionEnd(subData.current_period_end ?? null);
      } else {
        setTier('free');
        setSubscriptionEnd(null);
      }

      const { data: creditRow } = await supabase
        .from('user_credits')
        .select('balance, plan_credits')
        .eq('user_id', session.user.id)
        .maybeSingle();

      setMonthlyCredits(creditRow?.balance ?? 0);
      setPlanCredits((creditRow as any)?.plan_credits ?? 0);
    } catch (err) {
      console.error('[UsageLimit] fetchAll error:', err);
      setTier('free');
      setMonthlyCredits(0);
      setPlanCredits(0);
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
        setMonthlyCredits(0);
        setPlanCredits(0);
        setLoading(false);
        setInitialFetchDone(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchAll]);

  const totalCredits = monthlyCredits + planCredits;

  const canUse = (_action?: UsageAction) => {
    if (loading || !initialFetchDone) return false;
    return totalCredits > 0;
  };

  const getRemaining = (_action?: UsageAction) => totalCredits;
  const getLimit = (_action?: UsageAction) =>
    PLAN_CREDITS[tier] + FREE_MONTHLY_CREDITS;

  const trackUsage = async (action?: UsageAction, description?: string): Promise<boolean> => {
    if (loading || !initialFetchDone) return false;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;

      const { data, error } = await supabase.rpc('spend_credit', {
        p_user_id: session.user.id,
        p_action: action ?? 'action',
        p_description: description ?? null,
      });
      if (error) {
        console.error('[UsageLimit] spend_credit error:', error);
        return false;
      }
      if (data === false) return false;

      // Optimistically deduct: plan_credits first, then monthly
      if (planCredits > 0) setPlanCredits((p) => p - 1);
      else if (monthlyCredits > 0) setMonthlyCredits((m) => m - 1);
      return true;
    } catch (err) {
      console.error('[UsageLimit] trackUsage error:', err);
      return false;
    }
  };

  const displayTier: 'Free' | 'Starter' | 'Pro' =
    tier === 'free' ? 'Free' : tier === 'starter' ? 'Starter' : 'Pro';

  return (
    <UsageLimitContext.Provider value={{
      tier,
      displayTier,
      subscriptionEnd,
      monthlyCredits,
      planCredits,
      totalCredits,
      loading,
      canUse,
      getRemaining,
      getLimit,
      trackUsage,
      refresh: fetchAll,
    }}>
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

// Legacy export retained so any old import that referenced TIER_LIMITS still resolves.
export const TIER_LIMITS: Record<SubscriptionTier, Record<UsageAction, number>> = {
  free:    { resume_ats: 5, cover_letter: 5, interview_prep: 5, salary_intel: 5, linkedin: 5, skill_gap: 5, radar_alert: 5 },
  starter: { resume_ats: 50, cover_letter: 50, interview_prep: 50, salary_intel: 50, linkedin: 50, skill_gap: 50, radar_alert: 50 },
  pro:     { resume_ats: 150, cover_letter: 150, interview_prep: 150, salary_intel: 150, linkedin: 150, skill_gap: 150, radar_alert: 150 },
  premium: { resume_ats: 150, cover_letter: 150, interview_prep: 150, salary_intel: 150, linkedin: 150, skill_gap: 150, radar_alert: 150 },
};
