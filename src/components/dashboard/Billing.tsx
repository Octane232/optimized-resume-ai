import { useSubscription } from '@/contexts/SubscriptionContext';
import UsageHeader from './billing/UsageHeader';
import PricingCards from './billing/PricingCards';
import BillingFAQ from './billing/BillingFAQ';
import PaidManagement from './billing/PaidManagement';

const Billing = () => {
  const { tier, loading } = useSubscription();
  const isPaid = tier === 'pro' || tier === 'premium';

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Plan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isPaid ? 'Manage your subscription and payment details' : 'Choose the plan that fits your career goals'}
        </p>
      </div>

      {/* Usage header — always shown */}
      <UsageHeader />

      {isPaid ? (
        /* ── State B: Paid user management view ── */
        <PaidManagement />
      ) : (
        /* ── State A: Free user sales view ── */
        <PricingCards />
      )}

      {/* FAQ — always shown */}
      <BillingFAQ />
    </div>
  );
};

export default Billing;
