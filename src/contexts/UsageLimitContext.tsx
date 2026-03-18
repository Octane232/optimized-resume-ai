import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/contexts/SubscriptionContext';
export type UsageAction =
  | 'resume_ats'
  | 'interview_prep'
  | 'salary_intel'
  | 'linkedin'
  | 'skill_gap'
  | 'radar_alert';
// Limits per tier per month (free = lifetime total)
export const TIER_LIMITS: Record<string, Record<UsageAction, number>> = {
  free: {
    resume_ats: 5,
    interview_prep: 3,
    salary_intel: 3,
    linkedin: 0,
    skill_gap: 0,
    radar_alert: 0,
  },
  starter: {
    resume_ats: 20,
    interview_prep: 10,
    salary_intel: 5,
    linkedin: 3,
    skill_gap: 10,
    radar_alert: 20,
  },
  pro: {
    resume_ats: 60,
    interview_prep: 20,
    salary_intel: 15,
    linkedin: 10,
    skill_gap: 20,
    radar_alert: 100,
  },
  premium: {
    resume_ats: 60,
    interview_prep: 20,
    salary_intel: 15,
    linkedin: 10,
    skill_gap: 20,
    radar_alert: 100,
  },
};
export const ACTION_LABELS: Record<UsageAction, string> = {
  resume_ats: 'Application bundles',
  interview_prep: 'Mock interviews',
  salary_intel: 'Salary insights',
  linkedin: 'LinkedIn optimizations',
  skill_gap: 'Skill gap analyses',
  radar_alert: 'Job Radar alerts',
};
interface UsageLimitContextType {
  usage: Record<UsageAction, number>;
  loading: boolean;
  canUse: (action: UsageAction) => boolean;
  getRemaining: (action: UsageAction) => number;
  getLimit: (action: UsageAction) => number;
  trackUsage: (action: UsageAction) => Promise<boolean>;
  refresh: () => Promise<void>;
}
const UsageLimitContext = createContext<UsageLimitContextType | undefined>(undefined);
const EMPTY_USAGE: Record<UsageAction, number> = {
  resume_ats: 0, interview_prep: 0, salary_intel: 0,
  linkedin: 0, skill_gap: 0, radar_alert: 0,
};
export const UsageLimitProvider = ({ children }: { children: ReactNode }) => {
  const { tier } = useSubscription();
  const [usage, setUsage] = useState<Record<UsageAction, number>>({ ...EMPTY_USAGE });
  const [loading, setLoading] = useState(true);
  const fetchUsage = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const { data, error } = await supabase
        .from('feature_usage')
        .select('action, count')
        .eq('user_id', session.user.id);
      if (!error && data) {
        const map = { ...EMPTY_USAGE };
        data.forEach(row => {
          if (row.action in map) map[row.action as UsageAction] = row.count;
        });
        setUsage(map);
      }
    } catch (e) {
      console.error('[UsageLimit]', e);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchUsage();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') fetchUsage();
      else if (event === 'SIGNED_OUT') setUsage({ ...EMPTY_USAGE });
    });
    return () => subscription.unsubscribe();
  }, [fetchUsage]);
  const getLimit = (action: UsageAction): number => {
    const t = tier in TIER_LIMITS ? tier : 'free';
    return TIER_LIMITS[t][action];
  };
  const getRemaining = (action: UsageAction): number =>
    Math.max(0, getLimit(action) - (usage[action] || 0));
  const canUse = (action: UsageAction): boolean =>
    getLimit(action) > 0 && getRemaining(action) > 0;
  const trackUsage = async (action: UsageAction): Promise<boolean> => {
    if (!canUse(action)) return false;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return false;
      const { error } = await supabase.rpc('increment_feature_usage', {
        p_user_id: session.user.id,
        p_action: action,
      });
      if (error) { console.error('[UsageLimit] track error:', error); return false; }
      setUsage(prev => ({ ...prev, [action]: (prev[action] || 0) + 1 }));
      return true;
    } catch (e) {
    }
      console.error('[UsageLimit]', e);
      return false;
  };
  return (
    <UsageLimitContext.Provider value={{ usage, loading, canUse, getRemaining, getLimit, trackUsage, refresh: fetchUsage }}>
      {children}
    </UsageLimitContext.Provider>
  );
};
export const useUsageLimit = () => {
  const ctx = useContext(UsageLimitContext);
  if (!ctx) throw new Error('useUsageLimit must be used within UsageLimitProvider');
  return ctx;
};
