import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUsageLimit, UsageAction, ACTION_LABELS } from '@/contexts/UsageLimitContext';

interface UsageGateProps {
  action: UsageAction;
  // onSuccess must contain the API call — trackUsage fires AFTER it resolves
  onSuccess: () => void | Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  setActiveTab?: (tab: string) => void;
}

const UsageGate: React.FC<UsageGateProps> = ({
  action,
  onSuccess,
  children,
  disabled = false,
  className = '',
  variant = 'default',
  size = 'default',
  setActiveTab,
}) => {
  const { canUse, getRemaining, getLimit, trackUsage, tier } = useUsageLimit();

  const remaining = getRemaining(action);
  const limit = getLimit(action);
  const allowed = canUse(action);

  const handleClick = async () => {
    if (!allowed) return;

    try {
      // 1. Run the actual feature (API call lives inside onSuccess)
      await onSuccess();
      // 2. Only charge the usage if the call didn't throw
      await trackUsage(action);
    } catch (err) {
      // API call failed — do NOT charge usage
      console.error('[UsageGate] onSuccess threw, not tracking usage:', err);
    }
  };

  // Limit reached — show upgrade prompt
  if (!allowed) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {tier === 'free' ? 'Free limit reached' : 'Monthly limit reached'}
            </p>
            <p className="text-xs text-muted-foreground">
              You've used all {limit} {ACTION_LABELS[action]}{' '}
              {tier === 'free' ? 'on your free plan' : `on your ${tier} plan this month`}
            </p>
          </div>
        </div>

        {setActiveTab && (
          <Button
            size="sm"
            className="w-full gap-2"
            onClick={() => setActiveTab('billing')}
          >
            {tier === 'free' ? 'Upgrade to continue' : 'View your plan'}
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <Button
        onClick={handleClick}
        disabled={disabled}
        className={className}
        variant={variant}
        size={size}
      >
        {children}
      </Button>

      {remaining <= 2 && remaining > 0 && (
        <p className="text-xs text-amber-600 text-center">
          {remaining} {ACTION_LABELS[action]} remaining
          {tier === 'free' ? ' on free plan' : ' this month'}
        </p>
      )}
    </div>
  );
};

export default UsageGate;
