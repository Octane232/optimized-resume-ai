import { useSubscription } from '@/contexts/UsageLimitContext';
import UsageHeader from './billing/UsageHeader';
import PricingCards from './billing/PricingCards';
import BillingFAQ from './billing/BillingFAQ';
import PaidManagement from './billing/PaidManagement';

interface BillingProps {
  setActiveTab?: (tab: string) => void;
}

const Billing = ({ setActiveTab }: BillingProps) => {
  const { tier, loading, subscriptionEnd } = useSubscription();
  
  // FIXED: Correct tier check for Pro and Elite only
  const isPaid = tier === 'pro' || tier === 'elite';
  
  // FIXED: Show PaidManagement for paid users OR trial users (free with subscriptionEnd)
  const showPaidManagement = isPaid || (tier === 'free' && subscriptionEnd);
  
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Billing & Plan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {showPaidManagement ? 'Manage your subscription and usage' : 'Choose the plan that fits your job search'}
        </p>
      </div>
      <UsageHeader setActiveTab={setActiveTab} />
      {showPaidManagement ? <PaidManagement /> : <PricingCards />}
      <BillingFAQ />
    </div>
  );
};

export default Billing;
