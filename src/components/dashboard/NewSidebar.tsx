import React from 'react';
import VaylanceLogo from '@/components/VaylanceLogo';
import {
  Home,
  Telescope,
  Search,
  FileText,
  Mic,
  TrendingUp,
  Linkedin,
  DollarSign,
  Crosshair,
  Settings as SettingsIcon,
  HelpCircle,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useUsageLimit } from '@/contexts/UsageLimitContext';

interface NewSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mode?: 'hunter';
  setMode?: (mode: 'hunter') => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  radarCount?: number;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const NewSidebar: React.FC<NewSidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  radarCount = 0,
}) => {
  const { tier } = useUsageLimit();
  const isPaid = tier === 'pro' || tier === 'elite';

  const mainItems: NavItem[] = [
    { id: 'briefing', label: 'Home / Briefing', icon: Home },
    { id: 'scout', label: 'Job Radar', icon: Telescope, badge: radarCount },
    { id: 'job-search', label: 'Job Search', icon: Search },
    { id: 'resume-engine', label: 'Resume + ATS', icon: FileText },
    { id: 'interview-prep', label: 'Interview Coach', icon: Mic },
    { id: 'skill-gap', label: 'Skill Gap', icon: TrendingUp },
    { id: 'linkedin', label: 'LinkedIn Optimizer', icon: Linkedin },
    { id: 'salary-intel', label: 'Salary Intelligence', icon: DollarSign },
    { id: 'mission-control', label: 'Mission Control', icon: Crosshair },
  ];

  const toolItems: NavItem[] = [
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <Tooltip key={item.id}>
        <TooltipTrigger asChild>
          <button
            onClick={() => setActiveTab(item.id)}
            className={cn(
              'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
              collapsed && 'justify-center px-0',
              isActive
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-foreground/75 hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className={cn('w-[18px] h-[18px] shrink-0', isActive && 'text-primary')} />
            {!collapsed && (
              <>
                <span className="flex-1 text-sm truncate">{item.label}</span>
                {item.badge ? (
                  <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {item.badge}
                  </span>
                ) : null}
              </>
            )}
          </button>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
      </Tooltip>
    );
  };

  return (
    <div
      className={cn(
        'h-screen flex flex-col bg-card border-r border-border transition-all duration-300',
        collapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* Brand */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-border shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-2 min-w-0">
            <VaylanceLogo width={28} height={28} />
            <span className="text-lg font-bold text-foreground truncate">Vaylance</span>
          </div>
        ) : (
          <VaylanceLogo width={28} height={28} className="mx-auto" />
        )}
        {!collapsed && (
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(true)} className="shrink-0 h-8 w-8">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      {collapsed && (
        <div className="px-2 pt-2">
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(false)} className="w-full h-8">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <TooltipProvider delayDuration={0}>
          {mainItems.map(renderNavItem)}

          <div className="pt-5 pb-1">
            {!collapsed ? (
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Account
              </p>
            ) : (
              <div className="border-t border-border mx-2" />
            )}
          </div>

          {toolItems.map(renderNavItem)}
        </TooltipProvider>
      </nav>

      {/* Plan card */}
      {!collapsed && (
        <div className="p-3 shrink-0">
          {isPaid ? (
            <div className="rounded-xl border border-border bg-muted/50 p-3 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold capitalize text-foreground">{tier} plan</p>
                <p className="text-xs text-muted-foreground">All tools unlocked</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-primary p-4 text-primary-foreground">
              <p className="text-sm font-semibold">Unlock your full potential</p>
              <p className="mt-1 text-xs text-primary-foreground/80">
                Upgrade for Job Radar alerts, resume scans and coaching tools.
              </p>
              <button
                onClick={() => setActiveTab('billing')}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-background px-3 py-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-90"
              >
                View plans
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewSidebar;
