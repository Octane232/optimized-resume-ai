import React from 'react';
import { 
  Home, 
  Target, 
  FolderLock, 
  Crosshair,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Lock,
  Sparkles,
  Telescope
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import logo from '@/assets/pitchsora-logo-navbar.png';

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
  const navigate = useNavigate();

  const navItems = [
    { id: 'briefing', label: 'Briefing', icon: Home },
    { id: 'scout', label: 'Scout', icon: Telescope },
    { id: 'resume-engine', label: 'Resume Engine', icon: Stethoscope },
    { id: 'vault', label: 'Master Vault', icon: FolderLock },
    { id: 'mission-control', label: 'Mission Control', icon: Crosshair },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({ title: "Signed out successfully" });
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error signing out",
        variant: "destructive"
      });
    }
  };

  const modeColor = mode === 'hunter' 
    ? 'hsl(217, 100%, 50%)' 
    : 'hsl(262, 83%, 58%)';

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
        {!collapsed && (
          <img src={logo} alt="Pitchsora" className="h-8" />
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

      {/* Navigation */}
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

      {/* Bottom Actions */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setActiveTab('settings')}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 text-left
                  ${activeTab === 'settings'
                    ? 'bg-sidebar-accent text-sidebar-foreground' 
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }
                `}
              >
                <Settings className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="font-medium text-sm">Settings</span>}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Settings</TooltipContent>
            )}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive
                  transition-all duration-200 text-left"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">Sign Out</TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default NewSidebar;
