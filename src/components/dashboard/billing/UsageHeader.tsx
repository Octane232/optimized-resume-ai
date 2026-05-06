import { Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUsageLimit, UsageAction, ACTION_LABELS, ACTION_COSTS } from '@/contexts/UsageLimitContext';

const TRACKED_ACTIONS: UsageAction[] = [
  'resume_ats', 'cover_letter', 'interview_prep', 'salary_intel', 'linkedin', 'skill_gap', 'radar_alert', 'docx_rewrite',
];

const UsageHeader = ({ setActiveTab }: { setActiveTab?: (tab: string) => void }) => {
  const { tier, displayTier, credits, monthlyAllowance } = useUsageLimit();

  const tierBadgeClass =
    tier === 'free' ? 'bg-muted text-muted-foreground border-border' :
    tier === 'starter' ? 'bg-primary/10 text-primary border-primary/20' :
    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';

  const used = Math.max(0, monthlyAllowance - credits);
  const pct = monthlyAllowance > 0 ? Math.min((used / monthlyAllowance) * 100, 100) : 0;
  const isEmpty = credits <= 0;
  const isLow = pct >= 70 && !isEmpty;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">Current Plan</p>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">{displayTier}</h3>
              <Badge className={`text-xs border ${tierBadgeClass}`}>{displayTier}</Badge>
            </div>
          </div>
        </div>
        {/* Change 2: Removed upgrade button */}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Credit Balance</p>
          <span className={`text-xs font-semibold ${isEmpty ? 'text-destructive' : isLow ? 'text-amber-500' : 'text-foreground'}`}>
            {credits} / {monthlyAllowance} credits
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isEmpty ? 'bg-destructive' : isLow ? 'bg-amber-500' : 'bg-primary'}`}
            style={{ width: `${pct}%` }}  // Change 1: Fixed inverted progress bar
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          One pool, every feature. Watching is free — only AI generation spends credits.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Cost per action</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {TRACKED_ACTIONS.map((action) => (
            <div key={action} className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5">
              <span className="text-xs text-foreground">{ACTION_LABELS[action]}</span>
              <span className="text-xs font-medium text-muted-foreground">{ACTION_COSTS[action]} cr</span>
            </div>
          ))}
        </div>
      </div>

      {/* Change 3: Removed salary disclaimer */}
    </div>
  );
};

export default UsageHeader;
