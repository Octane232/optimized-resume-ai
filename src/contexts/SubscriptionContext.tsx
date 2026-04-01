import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'premium';

export interface TierLimits {
  pdfDownloads: number;
  aiGenerations: number;
  activeResumes: number;
  hasAIResume: boolean;
  hasCoverLetter: boolean;
  hasATSScoring: boolean;
  hasInterviewPrep: boolean;
  hasSkillGap: boolean;
}

export interface UsageStats {
  monthlyPdfDownloads: number;
  monthlyAiGenerations: number;
  resumesCreated: number;
  usageCycleResetDate: string | null;
}

// All features unlocked for restructuring
const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: {
    pdfDownloads: Infinity,
    aiGenerations: Infinity,
    activeResumes: Infinity,
    hasAIResume: true,
    hasCoverLetter: true,
    hasATSScoring: true,
    hasInterviewPrep: true,
    hasSkillGap: true,
  },
  starter: {
    pdfDownloads: Infinity,
    aiGenerations: Infinity,
    activeResumes: Infinity,
    hasAIResume: true,
    hasCoverLetter: true,
    hasATSScoring: true,
    hasInterviewPrep: true,
    hasSkillGap: true,
  },
  pro: {
    pdfDownloads: Infinity,
    aiGenerations: Infinity,
    activeResumes: Infinity,
    hasAIResume: true,
    hasCoverLetter: true,
    hasATSScoring: true,
    hasInterviewPrep: true,
    hasSkillGap: true,
  },
  premium: {
    pdfDownloads: Infinity,
    aiGenerations: Infinity,
    activeResumes: Infinity,
    hasAIResume: true,
    hasCoverLetter: true,
    hasATSScoring: true,
    hasInterviewPrep: true,
    hasSkillGap: true,
  },
};

interface SubscriptionContextType {
  tier: SubscriptionTier;
  limits: TierLimits;
  usage: UsageStats;
  loading: boolean;
  subscriptionEnd: string | null;
  canDownloadPDF: () => boolean;
  canUseAI: () => boolean;
  canCreateResume: () => boolean;
  getRemainingResumes: () => number;
  getRemainingDownloads: () => number;
  getRemainingAIGenerations: () => number;
  getNextResetDate: () => Date;
  incrementUsage: (type: 'download' | 'ai' | 'resume') => Promise<void>;
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [usage, setUsage] = useState<UsageStats>({
    monthlyPdfDownloads: 0,
    monthlyAiGenerations: 0,
    resumesCreated: 0,
    usageCycleResetDate: null,
  });
  const [loading, setLoading] = useState(true);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);

  const fetchSubscriptionStatus = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('[SubscriptionContext] No session, setting free tier');
        setTier('free');
        setLoading(false);
        return;
      }

      // Check subscription from database
      const { data: subData, error: subError } = await supabase
        .from('user_subscriptions')
        .select('tier, plan_status, current_period_end')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (subError) {
        console.error('[SubscriptionContext] Error checking subscription:', subError);
        setTier('free');
      } else if (subData && subData.plan_status === 'active' && subData.tier) {
        const newTier = subData.tier as SubscriptionTier;
        console.log('[SubscriptionContext] Setting tier to:', newTier);
        setTier(newTier);
        setSubscriptionEnd(subData.current_period_end);
      } else {
        setTier('free');
      }

      // Fetch usage stats
      const { data: usageData, error: usageError } = await supabase
        .from('user_usage_stats')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (usageError) {
        console.error('[SubscriptionContext] Error fetching usage:', usageError);
      } else if (usageData) {
        // Check if we need to reset (2nd of each month)
        const now = new Date();
        const resetDate = usageData.usage_cycle_reset_date ? new Date(usageData.usage_cycle_reset_date) : null;
        const shouldReset = resetDate && (
          now.getMonth() !== resetDate.getMonth() || 
          now.getFullYear() !== resetDate.getFullYear()
        ) && now.getDate() >= 2;

        if (shouldReset) {
          // Reset usage counters
          await supabase
            .from('user_usage_stats')
            .update({
              monthly_pdf_downloads: 0,
              monthly_ai_generations: 0,
              usage_cycle_reset_date: now.toISOString(),
            })
            .eq('user_id', session.user.id);

          setUsage({
            monthlyPdfDownloads: 0,
            monthlyAiGenerations: 0,
            resumesCreated: usageData.resumes_created || 0,
            usageCycleResetDate: now.toISOString(),
          });
        } else {
          setUsage({
            monthlyPdfDownloads: usageData.monthly_pdf_downloads || 0,
            monthlyAiGenerations: usageData.monthly_ai_generations || 0,
            resumesCreated: usageData.resumes_created || 0,
            usageCycleResetDate: usageData.usage_cycle_reset_date,
          });
        }
      } else {
        // Create usage stats record if it doesn't exist
        console.log('[SubscriptionContext] Creating usage stats record');
        await supabase
          .from('user_usage_stats')
          .insert({
            user_id: session.user.id,
            monthly_pdf_downloads: 0,
            monthly_ai_generations: 0,
            resumes_created: 0,
            usage_cycle_reset_date: new Date().toISOString(),
          });
      }
    } catch (error) {
      console.error('[SubscriptionContext] Error in fetchSubscriptionStatus:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionStatus();

    // Clean up URL params after checkout redirect (no polling needed — realtime handles it)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true' || urlParams.get('upgrade') === 'success' || window.location.pathname.includes('success')) {
      console.log('[SubscriptionContext] Detected checkout return, waiting for realtime update...');
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }

    // Listen for auth state changes
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[SubscriptionContext] Auth state changed:', event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        fetchSubscriptionStatus();
      } else if (event === 'SIGNED_OUT') {
        setTier('free');
        setUsage({
          monthlyPdfDownloads: 0,
          monthlyAiGenerations: 0,
          resumesCreated: 0,
          usageCycleResetDate: null,
        });
      }
    });

    // Realtime: re-fetch whenever user_subscriptions row changes (e.g. after webhook fires)
    let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      realtimeChannel = supabase
        .channel('user_subscriptions_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_subscriptions',
            filter: `user_id=eq.${session.user.id}`,
          },
          (payload) => {
            console.log('[SubscriptionContext] Realtime subscription change detected:', payload);
            fetchSubscriptionStatus();
          }
        )
        .subscribe();
    });

    return () => {
      authSubscription.unsubscribe();
      if (realtimeChannel) supabase.removeChannel(realtimeChannel);
    };
  }, [fetchSubscriptionStatus]);

  const limits = TIER_LIMITS[tier];

  const canDownloadPDF = () => {
    if (tier === 'premium') return true;
    return usage.monthlyPdfDownloads < limits.pdfDownloads;
  };

  const canUseAI = () => {
    // All features currently unlocked for restructuring
    return true;
  };

  const canCreateResume = () => {
    if (tier === 'premium') return true;
    return usage.resumesCreated < limits.activeResumes;
  };

  const getRemainingResumes = () => {
    if (tier === 'premium') return Infinity;
    return Math.max(0, limits.activeResumes - usage.resumesCreated);
  };

  const getRemainingDownloads = () => {
    if (tier === 'premium') return Infinity;
    return Math.max(0, limits.pdfDownloads - usage.monthlyPdfDownloads);
  };

  const getRemainingAIGenerations = () => {
    if (tier === 'premium') return Infinity;
    if (tier === 'free') return 0;
    return Math.max(0, limits.aiGenerations - usage.monthlyAiGenerations);
  };

  const getNextResetDate = () => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 2);
    return nextMonth;
  };

  const incrementUsage = async (type: 'download' | 'ai' | 'resume') => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const updates: Record<string, number> = {};
    
    switch (type) {
      case 'download':
        updates.monthly_pdf_downloads = usage.monthlyPdfDownloads + 1;
        setUsage(prev => ({ ...prev, monthlyPdfDownloads: prev.monthlyPdfDownloads + 1 }));
        break;
      case 'ai':
        updates.monthly_ai_generations = usage.monthlyAiGenerations + 1;
        setUsage(prev => ({ ...prev, monthlyAiGenerations: prev.monthlyAiGenerations + 1 }));
        break;
      case 'resume':
        updates.resumes_created = usage.resumesCreated + 1;
        setUsage(prev => ({ ...prev, resumesCreated: prev.resumesCreated + 1 }));
        break;
    }

    await supabase
      .from('user_usage_stats')
      .update(updates)
      .eq('user_id', session.user.id);
  };

  return (
    <SubscriptionContext.Provider value={{
      tier,
      limits,
      usage,
      loading,
      subscriptionEnd,
      canDownloadPDF,
      canUseAI,
      canCreateResume,
      getRemainingResumes,
      getRemainingDownloads,
      getRemainingAIGenerations,
      getNextResetDate,
      incrementUsage,
      refresh: fetchSubscriptionStatus,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
