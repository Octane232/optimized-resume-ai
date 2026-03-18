import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { 
  useUsageLimit, 
  UsageAction, 
  ACTION_LABELS 
} from '@/contexts/UsageLimitContext';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface UsageGateProps {
  action: UsageAction;
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
  // Hooks
  const { canUse, getRemaining, getLimit, trackUsage } = useUsageLimit();
  const { tier } = useSubscription();

  // Derived state
  const remaining = getRemaining(action);
  const limit = getLimit(action);
  const allowed = canUse(action);

  // Event handlers
  const handleClick = async () => {
    if (!allowed) return;

    const success = await trackUsage(action);
    if (success) {
      await onSuccess();
    }
  };

  // If user has reached their limit, show upgrade prompt
  if (!allowed) {
    return (
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
        {/* Lock Icon and Message */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4 text-primary" />
          </div>
          
          <div>
            <p className="text-sm font-semibold text-foreground">
              {tier === 'free' ? 'Free limit reached' : 'Monthly limit reached'}
            </p>
            <p className="text-xs text-muted-foreground">
              You have used all {limit} {ACTION_LABELS[action]} 
              on your {tier === 'free' ? 'free plan' : `${tier} plan this month`}
            </p>
          </div>
        </div>

        {/* Upgrade Button (if setActiveTab is provided) */}
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

  // If user has remaining usage, show the action button
  return (
    <div className="space-y-1.5">
      {/* Action Button */}
      <Button
        onClick={handleClick}
        disabled={disabled}
        className={className}
        variant={variant}
        size={size}
      >
        {children}
      </Button>

      {/* Low Usage Warning */}
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
