import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'pro' | 'premium';

export interface TierLimits {
  templateSelections: number;
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
  monthlyTemplateSelections: number;
  monthlyPdfDownloads: number;
  monthlyAiGenerations: number;
  resumesCreated: number;
  usageCycleResetDate: string | null;
}

const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: {
    templateSelections: 1,
    pdfDownloads: 1,
    aiGenerations: 0,
    activeResumes: 1,
    hasAIResume: false,
    hasCoverLetter: false,
    hasATSScoring: false,
    hasInterviewPrep: false,
    hasSkillGap: false,
  },
  pro: {
    templateSelections: 5,
    pdfDownloads: 10,
    aiGenerations: 5,
    activeResumes: 5,
    hasAIResume: true,
    hasCoverLetter: true,
    hasATSScoring: true,
    hasInterviewPrep: false,
    hasSkillGap: false,
  },
  premium: {
    templateSelections: Infinity,
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

export const useSubscriptionLimits = () => {
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [usage, setUsage] = useState<UsageStats>({
    monthlyTemplateSelections: 0,
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
        setTier('free');
        setLoading(false);
        return;
      }

      // Fetch subscription tier from edge function
      const { data: subData, error: subError } = await supabase.functions.invoke('check-subscription');
      
      if (subError) {
        console.error('Error checking subscription:', subError);
        setTier('free');
      } else if (subData) {
        setTier(subData.tier || 'free');
        setSubscriptionEnd(subData.subscription_end);
      }

      // Fetch usage stats
      const { data: usageData, error: usageError } = await supabase
        .from('user_usage_stats')
        .select('*')
        .single();

      if (usageError && usageError.code !== 'PGRST116') {
        console.error('Error fetching usage:', usageError);
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
              monthly_template_selections: 0,
              monthly_pdf_downloads: 0,
              monthly_ai_generations: 0,
              usage_cycle_reset_date: now.toISOString(),
            })
            .eq('user_id', session.user.id);

          setUsage({
            monthlyTemplateSelections: 0,
            monthlyPdfDownloads: 0,
            monthlyAiGenerations: 0,
            resumesCreated: usageData.resumes_created || 0,
            usageCycleResetDate: now.toISOString(),
          });
        } else {
          setUsage({
            monthlyTemplateSelections: usageData.monthly_template_selections || 0,
            monthlyPdfDownloads: usageData.monthly_pdf_downloads || 0,
            monthlyAiGenerations: usageData.monthly_ai_generations || 0,
            resumesCreated: usageData.resumes_created || 0,
            usageCycleResetDate: usageData.usage_cycle_reset_date,
          });
        }
      }
    } catch (error) {
      console.error('Error in fetchSubscriptionStatus:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptionStatus();
    
    // Refresh every minute
    const interval = setInterval(fetchSubscriptionStatus, 60000);
    return () => clearInterval(interval);
  }, [fetchSubscriptionStatus]);

  const limits = TIER_LIMITS[tier];

  const canSelectTemplate = () => {
    if (tier === 'premium') return true;
    return usage.monthlyTemplateSelections < limits.templateSelections;
  };

  const canDownloadPDF = () => {
    if (tier === 'premium') return true;
    return usage.monthlyPdfDownloads < limits.pdfDownloads;
  };

  const canUseAI = () => {
    if (tier === 'premium') return true;
    if (tier === 'free') return false;
    return usage.monthlyAiGenerations < limits.aiGenerations;
  };

  const canCreateResume = () => {
    if (tier === 'premium') return true;
    return usage.resumesCreated < limits.activeResumes;
  };

  const getRemainingTemplates = () => {
    if (tier === 'premium') return Infinity;
    return Math.max(0, limits.templateSelections - usage.monthlyTemplateSelections);
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

  const incrementUsage = async (type: 'template' | 'download' | 'ai' | 'resume') => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const updates: Record<string, number> = {};
    
    switch (type) {
      case 'template':
        updates.monthly_template_selections = usage.monthlyTemplateSelections + 1;
        setUsage(prev => ({ ...prev, monthlyTemplateSelections: prev.monthlyTemplateSelections + 1 }));
        break;
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

  return {
    tier,
    limits,
    usage,
    loading,
    subscriptionEnd,
    canSelectTemplate,
    canDownloadPDF,
    canUseAI,
    canCreateResume,
    getRemainingTemplates,
    getRemainingDownloads,
    getRemainingAIGenerations,
    getNextResetDate,
    incrementUsage,
    refresh: fetchSubscriptionStatus,
  };
};
