import React from 'react';
import { FileText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { useUsageLimit } from '@/contexts/UsageLimitContext';

// ===== Type Definitions =====
interface CreditBadgeProps {
  collapsed?: boolean;
}

// ===== Helper Functions =====
const getBadgeClasses = (isLow: boolean, collapsed: boolean = false): string => {
  const baseClasses = collapsed
    ? 'mx-auto flex items-center justify-center w-10 h-10 rounded-xl'
    : 'flex items-center gap-2.5 px-3 py-2.5 rounded-xl border';

  const colorClasses = isLow
    ? collapsed
      ? 'bg-destructive/10 text-destructive'
      : 'bg-destructive/5 border-destructive/20 text-destructive'
    : collapsed
      ? 'bg-primary/10 text-primary'
      : 'bg-primary/5 border-primary/20 text-primary';

  return `${baseClasses} ${colorClasses}`;
};

const getPluralizedBundles = (count: number): string => {
  return `bundle${count !== 1 ? 's' : ''}`;
};

// ===== Main Component =====
const CreditBadge: React.FC<CreditBadgeProps> = ({ collapsed = false }) => {
  // ===== Hooks =====
  const { getRemaining } = useUsageLimit();

  // ===== Derived Values =====
  const remaining = getRemaining('resume_ats');
  const isLow = remaining <= 1;
  const badgeClasses = getBadgeClasses(isLow, collapsed);
  const bundleText = getPluralizedBundles(remaining);

  // ===== Render =====
  if (collapsed) {
    return (
      <CollapsedBadge
        remaining={remaining}
        isLow={isLow}
        badgeClasses={badgeClasses}
      />
    );
  }

  return (
    <ExpandedBadge
      remaining={remaining}
      isLow={isLow}
      bundleText={bundleText}
      badgeClasses={badgeClasses}
    />
  );
};

// ===== Collapsed Badge Component =====
interface CollapsedBadgeProps {
  remaining: number;
  isLow: boolean;
  badgeClasses: string;
}

const CollapsedBadge: React.FC<CollapsedBadgeProps> = ({
  remaining,
  isLow,
  badgeClasses,
}) => (
  <div className={badgeClasses}>
    <span className="text-sm font-bold">{remaining}</span>
  </div>
);

// ===== Expanded Badge Component =====
interface ExpandedBadgeProps {
  remaining: number;
  isLow: boolean;
  bundleText: string;
  badgeClasses: string;
}

const ExpandedBadge: React.FC<ExpandedBadgeProps> = ({
  remaining,
  isLow,
  bundleText,
  badgeClasses,
}) => (
  <div className={badgeClasses}>
    <FileText className="w-4 h-4 shrink-0" />

    <div className="flex-1 min-w-0">
      <p className="text-xs font-medium leading-tight">
        {remaining} {bundleText} left
      </p>
    </div>

    {isLow && (
      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
        Low
      </Badge>
    )}
  </div>
);

export default CreditBadge;
