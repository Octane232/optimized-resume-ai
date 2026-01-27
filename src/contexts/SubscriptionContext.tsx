import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'pro' | 'premium';

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

      // Fetch subscription tier from edge function
      console.log('[SubscriptionContext] Fetching subscription status...');
      const { data: subData, error: subError } = await supabase.functions.invoke('check-subscription');
      
      if (subError) {
        console.error('[SubscriptionContext] Error checking subscription:', subError);
        setTier('free');
      } else if (subData) {
        const newTier = subData.tier || 'free';
        console.log('[SubscriptionContext] Subscription response:', subData);
        console.log('[SubscriptionContext] Setting tier to:', newTier);
        setTier(newTier);
        setSubscriptionEnd(subData.subscription_end);
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
    
    // Check if returning from checkout (success page)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true' || window.location.pathname.includes('success')) {
      console.log('[SubscriptionContext] Detected checkout return, refreshing subscription...');
      // Give webhook time to process, then refresh
      setTimeout(fetchSubscriptionStatus, 2000);
      setTimeout(fetchSubscriptionStatus, 5000);
    }
    
    // Refresh every minute
    const interval = setInterval(fetchSubscriptionStatus, 60000);
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
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

    return () => {
      clearInterval(interval);
      subscription.unsubscribe();
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
