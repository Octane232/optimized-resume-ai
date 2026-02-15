import { Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCredits } from '@/contexts/CreditsContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { TIER_FEATURES } from '@/lib/tierConfig';

const UsageHeader = () => {
  const { balance } = useCredits();
  const { tier } = useSubscription();
  const tierInfo = TIER_FEATURES[tier];
  const maxCredits = tierInfo.credits === -1 ? '∞' : tierInfo.credits;
  const isLow = tierInfo.credits !== -1 && balance <= 2;
  const isEmpty = balance === 0 && tierInfo.credits !== -1;

  const tierLabel = tier === 'free' ? 'Explorer' : tier === 'pro' ? 'Career Pro' : 'Career Elite';

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-card border border-border/60">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-primary/10">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Current Plan</p>
          <h3 className="text-lg font-bold text-foreground">{tierLabel} {tier === 'free' && <span className="text-muted-foreground font-normal">(Free)</span>}</h3>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Zap className={`w-4 h-4 ${isEmpty ? 'text-destructive' : isLow ? 'text-amber-500' : 'text-primary'}`} />
        <span className={`text-lg font-bold ${isEmpty ? 'text-destructive' : isLow ? 'text-amber-500' : 'text-foreground'}`}>
          {balance}/{maxCredits}
        </span>
        <span className="text-sm text-muted-foreground">AI Credits</span>
        {isEmpty && (
          <Badge variant="destructive" className="ml-2 text-xs">Empty</Badge>
        )}
        {isLow && !isEmpty && (
          <Badge className="ml-2 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">Low</Badge>
        )}
      </div>
    </div>
  );
};

export default UsageHeader;
