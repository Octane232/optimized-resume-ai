
import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Sun, Moon, Crown, Bell, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import logo from '@/assets/pitchsora-logo.png';

interface DashboardHeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const DashboardHeader = ({ activeTab, setActiveTab }: DashboardHeaderProps) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <SidebarTrigger className="h-10 w-10 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors" />
          
          {/* Logo */}
          <button 
            onClick={() => setActiveTab?.('dashboard')}
            className="flex items-center group transition-all duration-300 hover:opacity-80"
          >
            <img src={logo} alt="Pitchsora" className="h-36 w-auto object-contain" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search resumes, templates..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-10 w-10 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="relative h-10 w-10 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500 border-2 border-white dark:border-slate-900">
              3
            </Badge>
          </Button>
          
          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-sm font-semibold text-white">JD</span>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">John Doe</p>
              <div className="flex items-center gap-2">
                <Badge className="text-xs bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 border-0">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro Plan
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
