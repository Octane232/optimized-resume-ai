import { Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUsageLimit, UsageAction, ACTION_LABELS, PLAN_LIMITS } from '@/contexts/UsageLimitContext';

const TRACKED_ACTIONS: UsageAction[] = [
  'resume_ats', 'cover_letter', 'interview_prep', 'salary_intel', 'linkedin', 'skill_gap', 'radar_alert', 'docx_rewrite',
];

const UsageHeader = ({ setActiveTab }: { setActiveTab?: (tab: string) => void }) => {
  const { tier, displayTier, getCurrentUsage, loading, subscriptionEnd } = useUsageLimit();

  const tierBadgeClass =
    tier === 'free' ? 'bg-muted text-muted-foreground border-border' :
    tier === 'pro' ? 'bg-primary/10 text-primary border-primary/20' :
    'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';

  if (loading) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-6 space-y-5">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded-xl" />
            <div className="space-y-2">
              <div className="h-3 w-16 bg-muted rounded" />
              <div className="h-5 w-24 bg-muted rounded" />
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 bg-muted rounded" />
            <div className="h-8 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Calculate total used and total limit across all features
  const totalUsed = TRACKED_ACTIONS.reduce((sum, action) => {
    return sum + getCurrentUsage(action);
  }, 0);
  
  const totalLimit = TRACKED_ACTIONS.reduce((sum, action) => {
    return sum + (PLAN_LIMITS[tier]?.[action] ?? 0);
  }, 0);
  
  const pct = totalLimit > 0 ? (totalUsed / totalLimit) * 100 : 0;
  const isEmpty = totalUsed >= totalLimit && totalLimit > 0;
  const isLow = pct >= 70 && !isEmpty;

  // FIXED: Get display name for tier - show "Trial" for free users with active trial
  const getDisplayTierName = () => {
    // Trial user: free tier but has subscriptionEnd (active trial)
    if (tier === 'free' && subscriptionEnd) {
      return 'Trial';
    }
    if (displayTier === 'Free') return 'Free';
    if (displayTier === 'Pro') return 'Pro';
    return 'Elite';
  };

  const displayName = getDisplayTierName();
  const isTrial = displayName === 'Trial';

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
              <h3 className="text-lg font-bold text-foreground">{displayName}</h3>
              <Badge className={`text-xs border ${tierBadgeClass}`}>
                {isTrial ? 'Trial' : displayName}
              </Badge>
            </div>
            {isTrial && subscriptionEnd && (
              <p className="text-xs text-muted-foreground mt-1">
                Trial ends {new Date(subscriptionEnd).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Monthly Usage</p>
          <span className={`text-xs font-semibold ${isEmpty ? 'text-destructive' : isLow ? 'text-amber-500' : 'text-foreground'}`}>
            {totalUsed} / {totalLimit} uses
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isEmpty ? 'bg-destructive' : isLow ? 'bg-amber-500' : 'bg-primary'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          {isTrial 
            ? 'Full access during your trial. Upgrade to continue after trial ends.'
            : 'Each feature has a monthly limit. Upgrade to get more uses.'}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Monthly Limits</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {TRACKED_ACTIONS.map((action) => {
            const used = getCurrentUsage(action);
            const limit = PLAN_LIMITS[tier]?.[action] ?? 0;
            const isActionEmpty = limit > 0 && used >= limit;
            const label = ACTION_LABELS[action];
            
            // Skip actions with 0 limit for free tier to reduce clutter
            // For trial users, show all limits since they have elite access
            if (limit === 0 && !isTrial) return null;
            
            return (
              <div key={action} className="flex items-center justify-between rounded-md bg-muted/40 px-2.5 py-1.5">
                <span className="text-xs text-foreground">{label}</span>
                <span className={`text-xs font-medium ${isActionEmpty ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {used} / {limit}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UsageHeader;
