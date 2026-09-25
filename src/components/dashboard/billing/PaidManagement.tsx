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

  const getTierLabel = () => {
    if (tier === 'elite') return 'Elite';
    if (tier === 'pro') return 'Pro';
    if (tier === 'trial') return 'Free trial';
    return 'Free';
  };
  
  const tierLabel = getTierLabel();

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


  return (
    <div className="space-y-4">
      {/* Active Plan Card */}
      <div className="rounded-lg border p-5 border-primary/20 bg-primary/5">
        <div className="flex items-center justify-between">
          {/* Plan Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-foreground">{tierLabel} Plan</h3>
                <Badge className="border-0 text-xs bg-primary/10 text-primary">
                  Active
                </Badge>
              </div>

              {formattedEndDate && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Renews {formattedEndDate}
                </p>
              )}
            </div>
          </div>

          {/* Manage Billing Button */}
          {(
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
        <h4 className="text-sm font-semibold text-foreground">
          What You Can Still Do This Month
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

            if (limit === 0) return null;

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
                    {remaining} left
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barColor}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* FIXED: Updated description text */}
        <p className="text-xs text-muted-foreground">
          Shows how many more times you can use each feature this month. Limits reset on your billing date.
        </p>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-muted-foreground text-center">
        Update payment method, download invoices, switch plans, or cancel via the billing portal.
      </p>
    </div>
  );
};

export default PaidManagement;
