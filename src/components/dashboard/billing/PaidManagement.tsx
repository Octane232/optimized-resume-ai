import { CreditCard, ExternalLink, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

const PaidManagement = () => {
  const { tier, subscriptionEnd } = useSubscription();
  const [loading, setLoading] = useState(false);

  const tierLabel = tier === 'pro' ? 'Career Pro' : 'Career Elite';

  const handleManageBilling = async () => {
    // Stripe Customer Portal will be wired here
    setLoading(true);
    try {
      console.log('[Billing] Opening Stripe Customer Portal — not yet configured');
      // const { data, error } = await supabase.functions.invoke('customer-portal');
      // if (data?.url) window.open(data.url, '_blank');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <CreditCard className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Subscription Management</h3>
          <p className="text-xs text-muted-foreground">
            You're on the <strong>{tierLabel}</strong> plan
            {subscriptionEnd && (
              <> · Renews {new Date(subscriptionEnd).toLocaleDateString()}</>
            )}
          </p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Update your payment method, download invoices, switch plans, or cancel — all in one place via Stripe's secure portal.
      </p>

      <Button
        onClick={handleManageBilling}
        disabled={loading}
        className="w-full sm:w-auto rounded-xl font-semibold"
      >
        <Receipt className="w-4 h-4 mr-2" />
        {loading ? 'Opening…' : 'Update Payment Method or Cancel'}
        <ExternalLink className="w-3.5 h-3.5 ml-2 opacity-60" />
      </Button>
    </div>
  );
};

export default PaidManagement;
