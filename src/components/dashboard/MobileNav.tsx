import React from 'react';
import { 
  Compass, 
  Crosshair, 
  Wrench,
  Users,
  BarChart3,
  Pen,
  TrendingUp,
} from 'lucide-react';
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

  const hunterItems = [
    { id: 'daily-hunt', label: 'Hunt', icon: Compass },
    { id: 'mission-control', label: 'Missions', icon: Crosshair },
    { id: 'apply-toolkit', label: 'Toolkit', icon: Wrench },
    { id: 'referral-network', label: 'Referrals', icon: Users },
  ];

  const growthItems = [
    { id: 'career-dashboard', label: 'Career', icon: BarChart3 },
    { id: 'brand-autopilot', label: 'Brand', icon: Pen },
    { id: 'skill-strategist', label: 'Skills', icon: TrendingUp },
  ];

  const items = mode === 'hunter' ? hunterItems : growthItems;

  return (
    <nav className="mobile-bottom-nav md:hidden">
      <div className="flex items-center justify-around px-2">
        {items.map((item) => {
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
      </div>
    </nav>
  );
};

export default MobileNav;
