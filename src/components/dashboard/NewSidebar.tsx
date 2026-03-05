import React from 'react';
import { 
  Target, 
  Crosshair,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Lock,
  Compass,
  Wrench,
  Users,
  TrendingUp,
  Pen,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface NewSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mode: 'hunter' | 'growth';
  setMode: (mode: 'hunter' | 'growth') => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const hunterNavItems = [
  { id: 'daily-hunt', label: 'The Daily Hunt', icon: Compass },
  { id: 'mission-control', label: 'Mission Control', icon: Crosshair },
  { id: 'apply-toolkit', label: 'Apply Toolkit', icon: Wrench },
  { id: 'referral-network', label: 'Referral Network', icon: Users },
];

const growthNavItems = [
  { id: 'career-dashboard', label: 'Career Dashboard', icon: BarChart3 },
  { id: 'brand-autopilot', label: 'Brand Autopilot', icon: Pen },
  { id: 'skill-strategist', label: 'Skill-Gap Strategist', icon: TrendingUp },
];

const NewSidebar: React.FC<NewSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  mode, 
  setMode,
  collapsed,
  setCollapsed
}) => {
  const navItems = mode === 'hunter' ? hunterNavItems : growthNavItems;

  const modeColor = mode === 'hunter' 
    ? 'hsl(217, 100%, 50%)' 
    : 'hsl(262, 83%, 58%)';

  return (
    <div 
      className={`
        h-screen flex flex-col bg-sidebar border-r border-sidebar-border
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'}
      `}
    >
      {/* Logo & Collapse */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Vaylance
          </span>
        )}
        {collapsed && (
          <span className="text-lg font-bold text-primary mx-auto">VL</span>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="shrink-0 h-8 w-8"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mode Toggle */}
      <div className="p-3">
        <div 
          className={`
            relative flex rounded-xl p-1 
            ${collapsed ? 'flex-col gap-1' : 'bg-sidebar-accent'}
          `}
        >
          <button
            onClick={() => {
              setMode('hunter');
              setActiveTab('daily-hunt');
            }}
            className={`
              relative flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg
              font-medium text-sm transition-all duration-300
              ${mode === 'hunter' 
                ? 'text-white' 
                : 'text-sidebar-foreground/60 hover:text-sidebar-foreground'
              }
            `}
          >
            {mode === 'hunter' && (
              <div 
                className="absolute inset-0 rounded-lg bg-primary"
              />
            )}
            <Target className="w-4 h-4 relative z-10" />
            {!collapsed && <span className="relative z-10">Hunter</span>}
          </button>
          
          <button
            onClick={() => {
              setMode('growth');
              setActiveTab('career-dashboard');
            }}
            className={`
              relative flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg
              font-medium text-sm transition-all duration-300
              ${mode === 'growth' 
                ? 'text-white' 
                : 'text-sidebar-foreground/40 hover:text-sidebar-foreground/60'
              }
            `}
          >
            {mode === 'growth' && (
              <div 
                className="absolute inset-0 rounded-lg"
                style={{ background: 'linear-gradient(135deg, hsl(262, 83%, 58%), hsl(280, 70%, 45%))' }}
              />
            )}
            <Sparkles className="w-4 h-4 relative z-10" />
            {!collapsed && <span className="relative z-10">Growth</span>}
          </button>
        </div>
      </div>

      {/* Navigation — only 3-4 links */}
      <nav className="flex-1 p-3 space-y-1">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                      transition-all duration-200 text-left
                      ${isActive 
                        ? 'bg-sidebar-accent text-sidebar-foreground' 
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      }
                    `}
                    style={isActive ? { borderLeft: `3px solid ${modeColor}` } : {}}
                  >
                    <Icon 
                      className="w-5 h-5 shrink-0" 
                      style={isActive ? { color: modeColor } : {}}
                    />
                    {!collapsed && (
                      <span className="font-medium text-sm">{item.label}</span>
                    )}
                  </button>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>
    </div>
  );
};

export default NewSidebar;
