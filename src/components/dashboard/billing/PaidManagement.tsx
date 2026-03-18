import { CreditCard, ExternalLink, Receipt, CheckCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { 
  useUsageLimit, 
  UsageAction, 
  ACTION_LABELS 
} from '@/contexts/UsageLimitContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// All usage actions for display
const ACTIONS: UsageAction[] = [
  'resume_ats', 
  'interview_prep', 
  'salary_intel', 
  'linkedin', 
  'skill_gap', 
  'radar_alert'
];

const PaidManagement = () => {
  const { tier, subscriptionEnd } = useSubscription();
  const { getRemaining, getLimit } = useUsageLimit();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Format tier name for display
  const tierLabel = tier === 'starter' ? 'Starter' : 'Pro';

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
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <div className="flex items-center justify-between">
          {/* Plan Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{tierLabel} Plan</h3>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-xs">
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
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">Usage This Month</h4>

        {/* Usage Bars */}
        <div className="grid sm:grid-cols-2 gap-3">
          {ACTIONS.map((action) => {
            const limit = getLimit(action);
            const remaining = getRemaining(action);
            const used = limit - remaining;
            const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
            const isEmpty = remaining === 0;
            const isLow = percentage >= 70 && !isEmpty;

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
                    {used}/{limit}
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

        {/* Usage Note */}
        <p className="text-xs text-muted-foreground">
          Usage resets on the 1st of each month.
        </p>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-muted-foreground text-center">
        Update payment method, download invoices, switch plans, or cancel via Stripe's secure portal.
      </p>
    </div>
  );
};

export default PaidManagement;
