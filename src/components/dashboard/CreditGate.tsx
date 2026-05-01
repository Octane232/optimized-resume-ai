import React from 'react';
import { Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUsageLimit, UsageAction } from '@/contexts/UsageLimitContext';
import { useToast } from '@/hooks/use-toast';

interface CreditGateProps {
  /** Usage action to gate this button on (e.g. "resume_ats"). */
  action: UsageAction;
  description?: string;
  onSuccess: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
}

/**
 * Wraps an action button. Disables when the user is out of quota for `action`.
 * Server-side enforcement still happens inside the edge function — this is UX only.
 */
const CreditGate: React.FC<CreditGateProps> = ({
  action,
  onSuccess,
  children,
  disabled = false,
  className = '',
  variant = 'default',
}) => {
  const { canUse, getRemaining } = useUsageLimit();
  const { toast } = useToast();
  const allowed = canUse(action);
  const remaining = getRemaining(action);

  const handleClick = () => {
    if (!allowed) {
      toast({
        title: 'Monthly limit reached',
        description: 'Upgrade your plan to keep using this feature.',
        variant: 'destructive',
      });
      return;
    }
    onSuccess();
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || !allowed}
      className={className}
      variant={variant}
    >
      {children}
      <span className="ml-2 inline-flex items-center gap-1 text-xs opacity-80">
        <Coins className="w-3 h-3" />
        {remaining}
      </span>
    </Button>
  );
};

export default CreditGate;
