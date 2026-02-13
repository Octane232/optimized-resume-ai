import React from 'react';
import { Coins, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCredits } from '@/contexts/CreditsContext';
import { useToast } from '@/hooks/use-toast';

interface CreditGateProps {
  action: string;
  description?: string;
  onSuccess: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
}

/**
 * Wraps a button that costs 1 credit.
 * Shows cost indicator and handles credit deduction.
 */
const CreditGate: React.FC<CreditGateProps> = ({
  action,
  description,
  onSuccess,
  children,
  disabled = false,
  className = '',
  variant = 'default',
}) => {
  const { balance, spendCredit } = useCredits();
  const { toast } = useToast();
  const hasCredits = balance > 0;

  const handleClick = async () => {
    if (!hasCredits) {
      toast({
        title: "No credits remaining",
        description: "You've used all your credits this month. Upgrade your plan for more credits.",
        variant: "destructive",
      });
      return;
    }

    const success = await spendCredit(action, description);
    if (success) {
      onSuccess();
    } else {
      toast({
        title: "No credits remaining",
        description: "You've used all your credits this month. Upgrade your plan for more credits.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || !hasCredits}
      className={className}
      variant={variant}
    >
      {children}
      <span className="ml-2 inline-flex items-center gap-1 text-xs opacity-80">
        <Coins className="w-3 h-3" />1
      </span>
    </Button>
  );
};

export default CreditGate;
