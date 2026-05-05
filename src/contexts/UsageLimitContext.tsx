import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'premium';
export type UsageAction = 'resume_ats' | 'cover_letter' | 'interview_prep' | 'salary_intel' | 'linkedin' | 'skill_gap' | 'radar_alert';

export const TIER_LIMITS: Record<SubscriptionTier, Record<UsageAction, number>> = {
  free:    { resume_ats: 3,  cover_letter: 3,  interview_prep: 2, salary_intel: 2, linkedin: 2, skill_gap: 2, radar_alert: 5  },
  starter: { resume_ats: 15, cover_letter: 15, interview_prep: 10, salary_intel: 8, linkedin: 8, skill_gap: 8, radar_alert: 20 },
  pro:     { resume_ats: 40, cover_letter: 40, interview_prep: 30, salary_intel: 20, linkedin: 20, skill_gap: 20, radar_alert: 60 },
  premium: { resume_ats: 40, cover_letter: 40, interview_prep: 30, salary_intel: 20, linkedin: 20, skill_gap: 20, radar_alert: 60 },
};

export const ACTION_LABELS: Record<UsageAction, string> = {
  resume_ats: 'Application bundles', cover_letter: 'Cover letters', interview_prep: 'Mock interviews',
  salary_intel: 'Salary insights', linkedin: 'LinkedIn optimizations', skill_gap: 'Skill gap analyses', radar_alert: 'Job Radar alerts',
};

interface UsageLimitContextType {
  tier: SubscriptionTier;
  displayTier: 'Free' | 'Starter' | 'Pro';
  subscriptionEnd: string | null;
  usage: Record<UsageAction, number>;
  loading: boolean;
  canUse: (action: UsageAction) => boolean;
  getRemaining: (action: UsageAction) => number;
  getLimit: (action: UsageAction) => number;
  trackUsage: (action: UsageAction) => Promise<boolean>;
  refresh: () => Promise<void>;
}

const UsageLimitContext = createContext<UsageLimitContextType | undefined>(undefined);
const EMPTY_USAGE: Record<UsageAction, number> = { resume_ats: 0, cover_letter: 0, interview_prep: 0, salary_intel: 0, linkedin: 0, skill_gap: 0, radar_alert: 0 };

export const UsageLimitProvider = ({ children }: { children: ReactNode }) => {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [usage, setUsage] = useState<Record<UsageAction, number>>({ ...EMPTY_USAGE });
  const [loading, setLoading] = useState(true);
  const [initialFetchDone, setInitialFetchDone] = useState(false);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { 
        setTier('free');
        setUsage({ ...EMPTY_USAGE });
        setLoading(false);
        setInitialFetchDone(true);
        return; 
      }

      const { data: subData } = await supabase
        .from('user_subscriptions').select('tier, plan_status, current_period_end')
        .eq('user_id', session.user.id).maybeSingle();

      if (subData?.plan_status === 'active' && subData?.tier) {
        const raw = subData.tier as SubscriptionTier;
        setTier(raw === 'premium' ? 'pro' : raw);
        setSubscriptionEnd(subData.current_period_end ?? null);
      } else {
        setTier('free');
        setSubscriptionEnd(null);
      }

      const { data: usageData } = await supabase.from('feature_usage').select('action, count').eq('user_id', session.user.id);
      if (usageData) {
        const map = { ...EMPTY_USAGE };
        usageData.forEach((row) => { if (row.action in map) map[row.action as UsageAction] = row.count; });
        setUsage(map);
      } else {
        setUsage({ ...EMPTY_USAGE });
      }
    } catch (err) { 
      console.error('[UsageLimit] fetchAll error:', err);
      // On error, set safe defaults (free tier, zero usage) to prevent false positives
      setTier('free');
      setUsage({ ...EMPTY_USAGE });
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
        setUsage({ ...EMPTY_USAGE });
        setLoading(false);
        setInitialFetchDone(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchAll]);

  const getLimit = (action: UsageAction) => TIER_LIMITS[tier]?.[action] ?? 0;
  const getRemaining = (action: UsageAction) => Math.max(0, getLimit(action) - (usage[action] || 0));
  
  // FIXED: canUse returns false while loading to prevent race conditions
  const canUse = (action: UsageAction) => {
    if (loading || !initialFetchDone) return false;
    return getRemaining(action) > 0;
  };

  // trackUsage now also checks loading state
  const trackUsage = async (action: UsageAction): Promise<boolean> => {
    // Prevent tracking if still loading or no session
    if (loading || !initialFetchDone) {
      console.warn('[UsageLimit] trackUsage called while still loading');
      return false;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;
      
      const { error } = await supabase.rpc('increment_feature_usage', { p_user_id: session.user.id, p_action: action });
      if (error) { 
        console.error('[UsageLimit] trackUsage error:', error); 
        return false; 
      }
      
      setUsage((prev) => ({ ...prev, [action]: (prev[action] || 0) + 1 }));
      return true;
    } catch (err) { 
      console.error('[UsageLimit] trackUsage error:', err); 
      return false; 
    }
  };

  const displayTier: 'Free' | 'Starter' | 'Pro' = tier === 'free' ? 'Free' : tier === 'starter' ? 'Starter' : 'Pro';

  return (
    <UsageLimitContext.Provider value={{ 
      tier, 
      displayTier, 
      subscriptionEnd, 
      usage, 
      loading, 
      canUse, 
      getRemaining, 
      getLimit, 
      trackUsage, 
      refresh: fetchAll 
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
