import React, { useState } from 'react';
import VaylanceLogo from '@/components/VaylanceLogo';
import { 
  Home, 
  Target, 
  Crosshair,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Stethoscope,
  Sparkles,
  Telescope,
  FileText,
  Mic,
  TrendingUp,
  Lock,
  Radar,
  DollarSign,
  Globe,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import ThemeToggle from '@/components/ThemeToggle';

interface NewSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mode?: 'hunter';
  setMode?: (mode: 'hunter') => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const NewSidebar: React.FC<NewSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  collapsed,
  setCollapsed
}) => {
  const mode: 'hunter' = 'hunter';
  const [moreOpen, setMoreOpen] = useState(
    ['job-search', 'salary-intel', 'resume-engine', 'interview-prep', 'mission-control', 'linkedin', 'skill-gap'].includes(activeTab)
  );

  // Everything except the flagship Job Radar collapses under "More features"
  const moreItems = [
    { id: 'job-search', label: 'Job Search', icon: Search },
    { id: 'salary-intel', label: 'Salary Intel', icon: DollarSign },
    { id: 'resume-engine', label: 'Resume Engine', icon: Stethoscope },
    { id: 'interview-prep', label: 'Interview Coach ', icon: Mic },
    { id: 'mission-control', label: 'App Tracker ', icon: Crosshair },
    { id: 'linkedin', label: 'LinkedIn', icon: Sparkles },
    { id: 'skill-gap', label: 'Skill Gap', icon: TrendingUp },
  ];

  const modeColor = 'hsl(217, 100%, 50%)';

  const renderNavItem = (item: { id: string; label: string; icon: any; comingSoon?: boolean }) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <Tooltip key={item.id}>
        <TooltipTrigger asChild>
          <button
            onClick={() => !item.comingSoon && setActiveTab(item.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
              transition-all duration-200 text-left
              ${item.comingSoon 
                ? 'text-sidebar-foreground/40 cursor-not-allowed' 
                : isActive 
                  ? 'bg-sidebar-accent text-sidebar-foreground' 
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }
            `}
            style={isActive && !item.comingSoon ? { borderLeft: `3px solid ${modeColor}` } : {}}
          >
            <Icon 
              className="w-5 h-5 shrink-0" 
              style={isActive && !item.comingSoon ? { color: modeColor } : {}}
            />
            {!collapsed && (
              <span className="font-medium text-sm flex items-center gap-2">
                {item.label}
                {item.comingSoon && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">Soon</span>
                )}
              </span>
            )}
          </button>
        </TooltipTrigger>
        {collapsed && (
          <TooltipContent side="right">
            {item.label}{item.comingSoon ? ' (Coming Soon)' : ''}
          </TooltipContent>
        )}
      </Tooltip>
    );
  };

  return (
    <div 
      className={`
        h-screen flex flex-col bg-sidebar border-r border-sidebar-border
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Logo & Toggle */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <VaylanceLogo width={28} height={28} />
            <span className="text-xl font-bold text-foreground">Vaylance</span>
          </div>
        ) : (
          <VaylanceLogo width={32} height={32} className="mx-auto" />
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>


      {/* Navigation with sections */}
      <nav className="flex-1 p-3 space-y-1 overflow-hidden">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setActiveTab('briefing')}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 text-left
                  ${activeTab === 'briefing' 
                    ? 'bg-sidebar-accent text-sidebar-foreground' 
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }
                `}
                style={activeTab === 'briefing' ? { borderLeft: `3px solid ${modeColor}` } : {}}
              >
                <Home className="w-5 h-5 shrink-0" style={activeTab === 'briefing' ? { color: modeColor } : {}} />
                {!collapsed && <span className="font-medium text-sm">Dashboard</span>}
              </button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Dashboard</TooltipContent>}
          </Tooltip>

          {/* ===== FLAGSHIP: JOB RADAR ===== */}
          <div className="pt-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveTab('scout')}
                  className={`
                    group relative w-full flex items-center gap-3 rounded-xl text-left
                    transition-all duration-300 overflow-hidden
                    ${collapsed ? 'p-2.5 justify-center' : 'p-3'}
                    ${activeTab === 'scout'
                      ? 'shadow-lg shadow-blue-500/30'
                      : 'hover:shadow-md hover:shadow-blue-500/20'
                    }
                  `}
                  style={{
                    background: activeTab === 'scout'
                      ? 'linear-gradient(135deg, hsl(217, 100%, 50%), hsl(262, 83%, 58%))'
                      : 'linear-gradient(135deg, hsl(217, 100%, 50% / 0.12), hsl(262, 83%, 58% / 0.12))',
                    border: activeTab === 'scout' ? 'none' : `1px solid ${modeColor}40`,
                  }}
                >
                  <div className={`shrink-0 rounded-lg p-1.5 ${activeTab === 'scout' ? 'bg-white/20' : ''}`}
                       style={activeTab !== 'scout' ? { background: `${modeColor}20` } : {}}>
                    <Telescope className="w-5 h-5" style={{ color: activeTab === 'scout' ? 'white' : modeColor }} />
                  </div>
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${activeTab === 'scout' ? 'text-white' : 'text-sidebar-foreground'}`}>
                          Job Radar
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold tracking-wide ${
                          activeTab === 'scout' ? 'bg-white/25 text-white' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        }`}>
                          FLAGSHIP
                        </span>
                      </div>
                      <p className={`text-[10px] mt-0.5 ${activeTab === 'scout' ? 'text-white/80' : 'text-sidebar-foreground/60'}`}>
                        Hidden jobs, 14 days early
                      </p>
                    </div>
                  )}
                </button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Job Radar — Flagship</TooltipContent>}
            </Tooltip>
          </div>

          {/* ===== MORE FEATURES (collapsible) ===== */}
          <div className="pt-4">
            {!collapsed ? (
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg hover:bg-sidebar-accent/50 transition-colors"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">
                  More features
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-sidebar-foreground/40 transition-transform ${moreOpen ? '' : '-rotate-90'}`} />
              </button>
            ) : (
              <div className="my-2 border-t border-sidebar-border" />
            )}
            {(moreOpen || collapsed) && (
              <div className="mt-1 space-y-1">
                {moreItems.map(renderNavItem)}
              </div>
            )}
          </div>
        </TooltipProvider>
      </nav>

      {/* Bottom section with ThemeToggle */}
      <div className="p-3 border-t border-sidebar-border flex items-center justify-between">
        {!collapsed && <span className="text-xs text-muted-foreground">Theme</span>}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default NewSidebar;
