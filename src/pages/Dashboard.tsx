import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import NewSidebar from '@/components/dashboard/NewSidebar';
import MobileNav from '@/components/dashboard/MobileNav';
import SoraSidecar from '@/components/dashboard/SoraSidecar';
import HunterDashboard from '@/components/dashboard/HunterDashboard';
import GrowthTeaser from '@/components/dashboard/GrowthTeaser';
import MissionControl from '@/components/dashboard/MissionControl';
import Settings from '@/components/dashboard/Settings';
import Billing from '@/components/dashboard/Billing';
import ResumeEngine from '@/components/dashboard/ResumeEngine';
import Scout from '@/components/dashboard/Scout';
import CoverLetterGenerator from '@/components/dashboard/CoverLetterGenerator';
import InterviewPrep from '@/components/dashboard/InterviewPrep';
import { SkillGapAnalyzer } from '@/components/dashboard/SkillGapAnalyzer';
import LinkedInOptimizer from '@/components/dashboard/LinkedInOptimizer';
import WalkthroughGuide from '@/components/dashboard/WalkthroughGuide';
import CreateResume from '@/components/dashboard/CreateResume';
import TheVault from '@/components/dashboard/TheVault';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Settings as SettingsIcon,
  CreditCard,
  LogOut,
  User,
  ChevronDown,
  Bell,
  HelpCircle,
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dashboard-active-tab') || 'briefing';
  });
  const [mode, setMode] = useState<'hunter' | 'growth'>(() => {
    return (localStorage.getItem('dashboard-mode') as 'hunter' | 'growth') || 'hunter';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasResume, setHasResume] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userInitials, setUserInitials] = useState<string>('U');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboard-active-tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('dashboard-mode', mode);
  }, [mode]);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Set user info for navbar
      setUserEmail(user.email || '');
      if (user.email) {
        const initials = user.email
          .split('@')[0]
          .split('.')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        setUserInitials(initials);
      }

      // Check if user has a resume
      const { data: resumes } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      setHasResume(resumes && resumes.length > 0);

      // Check for saved mode preference and walkthrough status
      const { data: preferences } = await supabase
        .from('career_preferences')
        .select('work_style, walkthrough_completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (preferences?.work_style) {
        setMode(preferences.work_style as 'hunter' | 'growth');
      }

      // Show walkthrough if not completed
      if (!preferences?.walkthrough_completed) {
        setShowWalkthrough(true);
      }

    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleWalkthroughComplete = async () => {
    setShowWalkthrough(false);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('career_preferences')
        .upsert({
          user_id: user.id,
          walkthrough_completed: true
        }, { onConflict: 'user_id' });
    } catch (error) {
      console.error('Error saving walkthrough status:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground text-sm">Loading your command center...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    // If in growth mode, always show teaser
    if (mode === 'growth') {
      return <GrowthTeaser setMode={setMode} />;
    }

    switch (activeTab) {
      case 'briefing':
        return <HunterDashboard setActiveTab={setActiveTab} />;
      case 'scout':
        return <Scout />;
      case 'resume-builder':
        return <CreateResume />;
      case 'resume-engine':
        return <ResumeEngine setActiveTab={setActiveTab} hasResume={hasResume} />;
      case 'cover-letter':
        return <CoverLetterGenerator />;
      case 'interview-prep':
        return <InterviewPrep />;
      case 'skill-gap':
        return <SkillGapAnalyzer />;
      case 'linkedin':
        return <LinkedInOptimizer />;
      case 'vault':
        return <TheVault setActiveTab={setActiveTab} />;
      case 'mission-control':
        return <MissionControl />;
      case 'billing':
        return <Billing />;
      case 'settings':
        return <Settings />;
      default:
        return <HunterDashboard setActiveTab={setActiveTab} />;
    }
  };

  // Get the current page title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case 'briefing': return 'Briefing';
      case 'scout': return 'Job Scout';
      case 'resume-builder': return 'Resume Builder';
      case 'resume-engine': return 'Resume Engine';
      case 'cover-letter': return 'Cover Letter Generator';
      case 'interview-prep': return 'Interview Prep';
      case 'skill-gap': return 'Skill Gap Analyzer';
      case 'linkedin': return 'LinkedIn Optimizer';
      case 'vault': return 'The Vault';
      case 'mission-control': return 'Mission Control';
      case 'billing': return 'Billing';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="h-screen flex w-full bg-background overflow-hidden">
      {/* Walkthrough Guide for first-time users */}
      {showWalkthrough && (
        <WalkthroughGuide onComplete={handleWalkthroughComplete} />
      )}

      {/* Zone A: Left Sidebar - Hidden on mobile */}
      <div className="hidden md:flex">
        <NewSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          mode={mode}
          setMode={setMode}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>
      
      {/* Zone B: Main Content with Navbar */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4 md:px-6">
            {/* Left side - Title based on active tab */}
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold capitalize">
                {getPageTitle()}
              </h1>
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {mode === 'hunter' ? 'Hunter Mode' : 'Growth Mode'}
              </span>
            </div>

            {/* Right side - Actions and Profile */}
            <div className="ml-auto flex items-center gap-4">
              {/* Notification Bell */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                  3
                </span>
              </Button>

              {/* Help/Support */}
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={userEmail} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start text-sm">
                      <span className="font-medium">{userEmail}</span>
                      <span className="text-xs text-muted-foreground capitalize">{mode} Mode</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Settings */}
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('settings')}
                    className="cursor-pointer"
                  >
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  
                  {/* Billing */}
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('billing')}
                    className="cursor-pointer"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  
                  {/* Profile */}
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  {/* Sign Out */}
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {renderContent()}
        </main>
      </div>

      {/* Zone C: Vaya Sidecar (only on briefing) */}
      {activeTab === 'briefing' && mode === 'hunter' && (
        <div className="w-80 hidden lg:block h-screen overflow-y-auto border-l border-border">
          <SoraSidecar mode={mode} />
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <MobileNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
      />
    </div>
  );
};

export default Dashboard;
