import React from 'react';
import { Coins } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUsageLimit } from '@/contexts/UsageLimitContext';

interface CreditBadgeProps {
  collapsed?: boolean;
}

const CreditBadge: React.FC<CreditBadgeProps> = ({ collapsed = false }) => {
  const { totalCredits, planCredits, monthlyCredits } = useUsageLimit();
  const isLow = totalCredits <= 1;

  if (collapsed) {
    return (
      <div className={`mx-auto flex items-center justify-center w-10 h-10 rounded-xl ${isLow ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
        <span className="text-sm font-bold">{totalCredits}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border ${isLow ? 'bg-destructive/5 border-destructive/20 text-destructive' : 'bg-primary/5 border-primary/20 text-primary'}`}>
      <Coins className="w-4 h-4 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium leading-tight">{totalCredits} credit{totalCredits !== 1 ? 's' : ''} left</p>
        <p className="text-[10px] text-muted-foreground leading-tight">
          {planCredits} plan + {monthlyCredits} monthly
        </p>
      </div>
      {isLow && <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Low</Badge>}
    </div>
  );
};

export default CreditBadge;
