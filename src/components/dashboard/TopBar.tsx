import React, { useState, useEffect } from 'react';
import { Sun, Moon, FolderLock, Settings, CreditCard, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ activeTab, setActiveTab }) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
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
        const names = profile.full_name.trim().split(' ').filter((n: string) => n.length > 0);
        if (names.length >= 2) {
          setUserInitials((names[0][0] + names[names.length - 1][0]).toUpperCase());
        } else if (names.length === 1) {
          setUserInitials(names[0].slice(0, 2).toUpperCase());
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({ title: "Signed out successfully" });
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast({ title: "Error signing out", variant: "destructive" });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const getPageTitle = (tab: string) => {
    const titles: Record<string, string> = {
      'daily-hunt': 'The Daily Hunt',
      'mission-control': 'Mission Control',
      'apply-toolkit': 'Apply Toolkit',
      'referral-network': 'Referral Network',
      'career-dashboard': 'Career Dashboard',
      'brand-autopilot': 'Brand Autopilot',
      'skill-strategist': 'Skill-Gap Strategist',
      'vault': 'Master Vault',
      'settings': 'Account Settings',
      'billing': 'Billing & Plan',
    };
    return titles[tab] || 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl h-14 flex items-center justify-between px-6">
      {/* Page Title */}
      <h1 className="text-lg font-semibold text-foreground">
        {getPageTitle(activeTab)}
      </h1>

      {/* Right side: theme toggle + avatar dropdown */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-lg"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-white">{userInitials || 'U'}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {userName && (
              <>
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-foreground">{userName}</p>
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => setActiveTab('vault')} className="cursor-pointer gap-2">
              <FolderLock className="w-4 h-4" />
              Master Vault
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab('settings')} className="cursor-pointer gap-2">
              <Settings className="w-4 h-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab('billing')} className="cursor-pointer gap-2">
              <CreditCard className="w-4 h-4" />
              Billing & Plan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer gap-2 text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
