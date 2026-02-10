import React from 'react';
import { 
  Home, 
  Telescope, 
  FolderLock, 
  Crosshair,
  Stethoscope,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mode: 'hunter' | 'growth';
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, mode }) => {
  const modeColor = mode === 'hunter' 
    ? 'hsl(217, 100%, 50%)' 
    : 'hsl(262, 83%, 58%)';

  const primaryItems = [
    { id: 'briefing', label: 'Home', icon: Home },
    { id: 'scout', label: 'Scout', icon: Telescope },
    { id: 'resume-engine', label: 'Engine', icon: Stethoscope },
    { id: 'vault', label: 'Vault', icon: FolderLock },
  ];

  const moreItems = [
    { id: 'resume-builder', label: 'Templates' },
    { id: 'cover-letter', label: 'Cover Letters' },
    { id: 'interview-prep', label: 'Interview Prep' },
    { id: 'skill-gap', label: 'Skill Gap' },
    { id: 'linkedin', label: 'LinkedIn' },
    { id: 'mission-control', label: 'Mission Control' },
    { id: 'billing', label: 'Billing' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <nav className="mobile-bottom-nav md:hidden">
      <div className="flex items-center justify-around px-2">
        {primaryItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "mobile-nav-item flex-1 min-w-0",
                isActive && "active"
              )}
              style={isActive ? { color: modeColor } : {}}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium truncate">{item.label}</span>
            </button>
          );
        })}
        
        {/* More menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="mobile-nav-item flex-1 min-w-0">
              <MoreHorizontal className="w-5 h-5" />
              <span className="text-[10px] font-medium">More</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 mb-2">
            {moreItems.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "cursor-pointer",
                  activeTab === item.id && "bg-primary/10 text-primary"
                )}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default MobileNav;
