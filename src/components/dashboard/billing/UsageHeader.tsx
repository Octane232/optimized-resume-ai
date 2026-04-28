import { Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUsageLimit, UsageAction, ACTION_LABELS } from '@/contexts/UsageLimitContext';

const TRACKED_ACTIONS: UsageAction[] = ['resume_ats', 'cover_letter', 'interview_prep', 'salary_intel', 'linkedin', 'skill_gap'];

const UsageHeader = ({ setActiveTab }: { setActiveTab?: (tab: string) => void }) => {
  const { tier, displayTier, getLimit, getRemaining } = useUsageLimit();

  const tierBadgeClass =
    tier === 'free' ? 'bg-muted text-muted-foreground border-border' :
    tier === 'starter' ? 'bg-primary/10 text-primary border-primary/20' :
    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';

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
        {tier === 'free' && setActiveTab && (
          <Button size="sm" className="gap-1.5 font-semibold" onClick={() => setActiveTab('billing')}>
            Upgrade <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
          {tier === 'free' ? 'Lifetime Usage' : 'This Month'}
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {TRACKED_ACTIONS.map((action) => {
            const limit = getLimit(action);
            const remaining = getRemaining(action);
            const used = limit - remaining;
            const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
            const isEmpty = remaining === 0;
            const isLow = pct >= 70 && !isEmpty;
            return (
              <div key={action} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{ACTION_LABELS[action]}</span>
                  <span className={`text-xs font-semibold ${isEmpty ? 'text-destructive' : isLow ? 'text-amber-500' : 'text-foreground'}`}>
                    {used} / {limit}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isEmpty ? 'bg-destructive' : isLow ? 'bg-amber-500' : 'bg-primary'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-start gap-2 pt-2 border-t border-border/40">
        <p className="text-xs text-muted-foreground leading-relaxed">
          💡 Salary figures are AI estimates. Always verify with{' '}
          <a href="https://www.glassdoor.com/Salaries/index.htm" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5">Glassdoor<ExternalLink className="w-2.5 h-2.5 ml-0.5" /></a>,{' '}
          <a href="https://www.levels.fyi" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5">Levels.fyi<ExternalLink className="w-2.5 h-2.5 ml-0.5" /></a>, or{' '}
          <a href="https://www.linkedin.com/salary/" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-0.5">LinkedIn Salary<ExternalLink className="w-2.5 h-2.5 ml-0.5" /></a>.
        </p>
      </div>
    </div>
  );
};

export default UsageHeader;
