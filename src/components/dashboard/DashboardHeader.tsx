
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Sun, Moon, Crown, Bell, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import logo from '@/assets/pitchsora-logo.png';
import { supabase } from '@/integrations/supabase/client';

interface DashboardHeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const DashboardHeader = ({ activeTab, setActiveTab }: DashboardHeaderProps) => {
  const { theme, setTheme } = useTheme();
  const [userName, setUserName] = useState('');
  const [userInitials, setUserInitials] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();

      if (profile?.full_name) {
        setUserName(profile.full_name);
        // Generate initials: first letter of first name + first letter of last name
        const names = profile.full_name.trim().split(' ').filter(n => n.length > 0);
        let initials = '';
        if (names.length >= 2) {
          // First letter of first name + first letter of last name
          initials = (names[0][0] + names[names.length - 1][0]).toUpperCase();
        } else if (names.length === 1) {
          // If only one name, use first two letters
          initials = names[0].slice(0, 2).toUpperCase();
        }
        setUserInitials(initials);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

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
          
          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-sm font-semibold text-white">{userInitials || 'U'}</span>
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{userName || 'User'}</p>
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
