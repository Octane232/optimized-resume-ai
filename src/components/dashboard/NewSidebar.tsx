import React from 'react';
import VaylanceLogo from '@/components/VaylanceLogo';
import { 
  Home, 
  Target, 
  Crosshair,
  ChevronLeft,
  ChevronRight,
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
  mode: 'hunter' | 'growth';
  setMode: (mode: 'hunter' | 'growth') => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const NewSidebar: React.FC<NewSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  mode, 
  setMode,
  collapsed,
  setCollapsed
}) => {
  // Navigation structure per document spec
  const intelligenceItems = [
    { id: 'job-search', label: 'Job Search', icon: Search },
    { id: 'scout', label: 'Job Radar ', icon: Telescope },
    { id: 'salary-intel', label: 'Salary Intel ', icon: DollarSign },
  ];

  const toolsItems = [
    { id: 'resume-engine', label: 'Resume Engine', icon: Stethoscope },
    { id: 'interview-prep', label: 'Interview Coach ', icon: Mic },
    { id: 'mission-control', label: 'App Tracker ', icon: Crosshair },
    { id: 'linkedin', label: 'LinkedIn', icon: Sparkles },
    { id: 'skill-gap', label: 'Skill Gap', icon: TrendingUp },
  ];

  const modeColor = mode === 'hunter' 
    ? 'hsl(217, 100%, 50%)' 
    : 'hsl(262, 83%, 58%)';

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
            <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <rect width="48" height="48" rx="11" fill="#1d4ed8"/>
              <circle cx="22" cy="27" r="11" stroke="white" strokeWidth="2.2" fill="none"/>
              <circle cx="22" cy="27" r="6.5" stroke="white" strokeWidth="1.6" strokeOpacity="0.6" fill="none"/>
              <circle cx="22" cy="27" r="2.6" fill="white"/>
              <line x1="29.5" y1="19.5" x2="36" y2="13" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
              <line x1="32.5" y1="13" x2="36" y2="13" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
              <line x1="36" y1="13" x2="36" y2="16.5" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
            </svg>
            <span className="text-xl font-bold text-foreground">Vaylance</span>
          </div>
        ) : (
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" aria-hidden="true" className="mx-auto">
            <rect width="48" height="48" rx="11" fill="#1d4ed8"/>
            <circle cx="22" cy="27" r="11" stroke="white" strokeWidth="2.2" fill="none"/>
            <circle cx="22" cy="27" r="6.5" stroke="white" strokeWidth="1.6" strokeOpacity="0.6" fill="none"/>
            <circle cx="22" cy="27" r="2.6" fill="white"/>
            <line x1="29.5" y1="19.5" x2="36" y2="13" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
            <line x1="32.5" y1="13" x2="36" y2="13" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
            <line x1="36" y1="13" x2="36" y2="16.5" stroke="white" strokeWidth="1.9" strokeLinecap="round"/>
          </svg>
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

      {/* Mode Toggle */}
      <div className="p-3">
        <div 
          className={`
            relative flex rounded-xl p-1 
            ${collapsed ? 'flex-col gap-1' : 'bg-sidebar-accent'}
          `}
        >
          <button
            onClick={() => setMode('hunter')}
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
                className="absolute inset-0 rounded-lg"
                style={{ background: 'linear-gradient(135deg, hsl(217, 100%, 50%), hsl(230, 80%, 45%))' }}
              />
            )}
            <Target className="w-4 h-4 relative z-10" />
            {!collapsed && <span className="relative z-10">Hunter</span>}
          </button>
          
          <button
            onClick={() => setMode('growth')}
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
            <Target className="w-4 h-4 relative z-10 rotate-45" />
            {!collapsed && (
              <span className="relative z-10 flex items-center gap-1.5">
                Growth
                <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-[hsl(262,83%,58%)]/20 text-[hsl(262,83%,58%)]">
                  <Sparkles className="w-2.5 h-2.5" />
                  Soon
                </span>
              </span>
            )}
            {collapsed && (
              <Lock className="w-3 h-3 absolute -top-1 -right-1 text-[hsl(262,83%,58%)]" />
            )}
          </button>
        </div>
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

          {/* INTELLIGENCE section */}
          {!collapsed && (
            <div className="pt-4 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">Intelligence</span>
            </div>
          )}
          {collapsed && <div className="my-2 border-t border-sidebar-border" />}
          {intelligenceItems.map(renderNavItem)}

          {/* TOOLS section */}
          {!collapsed && (
            <div className="pt-4 pb-1 px-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/40">Tools</span>
            </div>
          )}
          {collapsed && <div className="my-2 border-t border-sidebar-border" />}
          {toolsItems.map(renderNavItem)}
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
