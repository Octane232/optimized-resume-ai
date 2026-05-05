import { Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUsageLimit, PLAN_CREDITS, FREE_MONTHLY_CREDITS } from '@/contexts/UsageLimitContext';

const UsageHeader = ({ setActiveTab }: { setActiveTab?: (tab: string) => void }) => {
  const { tier, displayTier, totalCredits, planCredits, monthlyCredits } = useUsageLimit();

  const tierBadgeClass =
    tier === 'free' ? 'bg-muted text-muted-foreground border-border' :
    tier === 'starter' ? 'bg-primary/10 text-primary border-primary/20' :
    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';

  const planAllowance = PLAN_CREDITS[tier];
  const planUsed = Math.max(0, planAllowance - planCredits);
  const planPct = planAllowance > 0 ? Math.min((planUsed / planAllowance) * 100, 100) : 0;

  const monthlyUsed = Math.max(0, FREE_MONTHLY_CREDITS - monthlyCredits);
  const monthlyPct = (monthlyUsed / FREE_MONTHLY_CREDITS) * 100;

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

      <div className="rounded-lg border border-border/40 bg-muted/30 p-4">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Available Credits</span>
          <span className="text-2xl font-bold text-foreground">{totalCredits}</span>
        </div>
        <p className="text-xs text-muted-foreground">1 credit = 1 action (Resume ATS, Interview session, LinkedIn optimization, etc.)</p>
      </div>

      <div className="space-y-3">
        {planAllowance > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Plan credits ({displayTier})</span>
              <span className="text-xs font-semibold text-foreground">{planCredits} / {planAllowance}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${planPct}%` }} />
            </div>
          </div>
        )}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Free monthly credits</span>
            <span className="text-xs font-semibold text-foreground">{monthlyCredits} / {FREE_MONTHLY_CREDITS}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${monthlyPct}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground">Resets at the start of each month.</p>
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
