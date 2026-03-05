import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  FileText, 
  Mail, 
  Mic, 
  BarChart3, 
  Linkedin, 
  Archive, 
  Target,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  LineChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  // Navigation items - ONLY dashboard features, NO settings/billing
  const hunterNavItems = [
    { id: 'briefing', label: 'Briefing', icon: LayoutDashboard },
    { id: 'scout', label: 'Scout', icon: Search },
    { id: 'resume-builder', label: 'Resume Builder', icon: FileText },
    { id: 'resume-engine', label: 'Resume Engine', icon: FileText },
    { id: 'cover-letter', label: 'Cover Letter', icon: Mail },
    { id: 'interview-prep', label: 'Interview Prep', icon: Mic },
    { id: 'skill-gap', label: 'Skill Gap', icon: BarChart3 },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { id: 'vault', label: 'The Vault', icon: Archive },
    { id: 'mission-control', label: 'Mission Control', icon: Target },
  ];

  const growthNavItems = [
    { id: 'briefing', label: 'Briefing', icon: LayoutDashboard },
    { id: 'mission-control', label: 'Mission Control', icon: Target },
    { id: 'skill-gap', label: 'Skill Gap', icon: BarChart3 },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  ];

  const navItems = mode === 'hunter' ? hunterNavItems : growthNavItems;

  return (
    <aside 
      className={cn(
        "h-screen border-r border-border bg-background transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo area */}
      <div className={cn(
        "h-14 flex items-center border-b border-border",
        collapsed ? "justify-center px-2" : "px-4"
      )}>
        {collapsed ? (
          <Briefcase className="h-6 w-6 text-primary" />
        ) : (
          <div className="flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">CareerFlow</span>
          </div>
        )}
      </div>

      {/* Mode toggle */}
      <div className={cn(
        "p-2 border-b border-border",
        collapsed ? "flex justify-center" : ""
      )}>
        <div className={cn(
          "flex rounded-lg bg-muted p-1",
          collapsed ? "flex-col" : ""
        )}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMode('hunter')}
            className={cn(
              "flex-1",
              mode === 'hunter' ? "bg-background shadow-sm" : "",
              collapsed ? "px-2" : ""
            )}
          >
            <Briefcase className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Hunter</span>}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMode('growth')}
            className={cn(
              "flex-1",
              mode === 'growth' ? "bg-background shadow-sm" : "",
              collapsed ? "px-2" : ""
            )}
          >
            <LineChart className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Growth</span>}
          </Button>
        </div>
      </div>

      {/* Navigation items - ONLY dashboard features */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full justify-start",
                  activeTab === item.id ? "bg-muted" : "",
                  collapsed ? "px-2" : "px-3"
                )}
              >
                <Icon className={cn("h-4 w-4", collapsed ? "mx-auto" : "mr-2")} />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Bottom section - ONLY collapse button, NO settings/billing/sign out */}
      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("w-full", collapsed ? "px-2" : "justify-start")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};

export default NewSidebar;
