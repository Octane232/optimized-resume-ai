import { CreditCard, ExternalLink, Receipt, CheckCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/contexts/UsageLimitContext';
import { 
  useUsageLimit, 
  UsageAction, 
  ACTION_LABELS 
} from '@/contexts/UsageLimitContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// FIXED: Added resume_parse and corrected all actions
const ACTIONS: UsageAction[] = [
  'resume_ats',
  'cover_letter',
  'interview_prep', 
  'salary_intel', 
  'linkedin', 
  'skill_gap', 
  'radar_alert',
  'docx_rewrite',
  'resume_parse',
];

const PaidManagement = () => {
  const { tier, subscriptionEnd } = useSubscription();
  const { getRemaining, getLimit, getCurrentUsage } = useUsageLimit();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // FIXED: Correct tier labels for Pro and Elite
  const getTierLabel = () => {
    if (tier === 'elite') return 'Elite';
    if (tier === 'pro') return 'Pro';
    if (tier === 'trial' || (tier === 'free' && subscriptionEnd)) return 'Trial';
    return 'Free';
  };
  
  const tierLabel = getTierLabel();
  const isTrial = tier === 'trial' || (tier === 'free' && subscriptionEnd);

  // Handle billing portal redirect
  const handleManageBilling = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('stripe-customer-portal');

      if (error) throw error;
      if (!data?.url) throw new Error('No portal URL');

      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Billing portal error:', error);
      toast({
        title: 'Could not open billing portal',
        description: 'Please contact support at contact@vaylance.com',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Format subscription end date
  const formattedEndDate = subscriptionEnd
    ? new Date(subscriptionEnd).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  // Calculate if trial is ending soon (within 3 days)
  const isTrialEndingSoon = isTrial && subscriptionEnd && 
    (new Date(subscriptionEnd).getTime() - new Date().getTime()) < 3 * 24 * 60 * 60 * 1000;

  return (
    <div className="space-y-4">
      {/* Active Plan Card */}
      <div className={`rounded-xl border p-5 ${
        isTrial 
          ? 'border-amber-500/20 bg-amber-500/5' 
          : 'border-emerald-500/20 bg-emerald-500/5'
      }`}>
        <div className="flex items-center justify-between">
          {/* Plan Info */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isTrial ? 'bg-amber-500/10' : 'bg-emerald-500/10'
            }`}>
              <CheckCircle className={`w-5 h-5 ${
                isTrial ? 'text-amber-500' : 'text-emerald-500'
              }`} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-foreground">{tierLabel} Plan</h3>
                <Badge className={`border-0 text-xs ${
                  isTrial 
                    ? 'bg-amber-500/10 text-amber-600' 
                    : 'bg-emerald-500/10 text-emerald-600'
                }`}>
                  {isTrial ? 'Trial Active' : 'Active'}
                </Badge>
                {isTrialEndingSoon && (
                  <Badge className="bg-red-500/10 text-red-600 border-0 text-xs">
                    Ends Soon
                  </Badge>
                )}
              </div>

              {formattedEndDate && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isTrial ? 'Trial ends' : 'Renews'} {formattedEndDate}
                </p>
              )}
            </div>
          </div>

          {/* Manage Billing Button - only show for paid users, not trial */}
          {!isTrial && (
            <Button
              onClick={handleManageBilling}
              disabled={loading}
              variant="outline"
              size="sm"
              className="gap-2 font-medium"
            >
              <Receipt className="w-4 h-4" />
              {loading ? 'Opening…' : 'Manage'}
              <ExternalLink className="w-3 h-3 opacity-60" />
            </Button>
          )}
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
        {/* FIXED: Updated section title for trial users */}
        <h4 className="text-sm font-semibold text-foreground">
          {isTrial ? 'Trial Access (Elite Level)' : 'What You Can Still Do This Month'}
        </h4>

        {/* Usage Bars */}
        <div className="grid sm:grid-cols-2 gap-3">
          {ACTIONS.map((action) => {
            const limit = getLimit(action);
            const remaining = getRemaining(action);
            const used = getCurrentUsage(action);
            
            // FIXED: Show correct remaining based on tier
            const percentage = limit > 0 ? Math.min((remaining / limit) * 100, 100) : 0;
            const isEmpty = remaining === 0 && limit > 0;
            const isLow = percentage <= 30 && !isEmpty;

            // Skip features with 0 limit for free users (but show all for trial)
            if (limit === 0 && !isTrial) return null;

            // Determine status color
            const statusColor = isEmpty 
              ? 'destructive' 
              : isLow 
                ? 'amber' 
                : 'primary';

            const textColor = isEmpty 
              ? 'text-destructive' 
              : isLow 
                ? 'text-amber-500' 
                : 'text-foreground';

            const barColor = isEmpty 
              ? 'bg-destructive' 
              : isLow 
                ? 'bg-amber-500' 
                : 'bg-primary';

            return (
              <div key={action} className="space-y-1.5">
                {/* Label and Count */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {ACTION_LABELS[action]}
                  </span>
                  <span className={`text-xs font-semibold ${textColor}`}>
                    {isTrial ? `${used} / ${limit}` : `${remaining} left`}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${isTrial ? (used / limit) * 100 : percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* FIXED: Updated description text */}
        <p className="text-xs text-muted-foreground">
          {isTrial 
            ? 'You have full Elite access during your trial. Upgrade to keep using all features.'
            : 'Shows how many more times you can use each feature this month. Limits reset on your billing date.'}
        </p>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-muted-foreground text-center">
        {isTrial 
          ? 'Upgrade anytime to keep your trial usage history.'
          : 'Update payment method, download invoices, switch plans, or cancel via the billing portal.'}
      </p>
    </div>
  );
};

export default PaidManagement;
