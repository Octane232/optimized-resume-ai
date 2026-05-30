import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings as SettingsIcon,
  CreditCard,
  LogOut,
  ChevronDown,
  Bell,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useUsageLimit } from '@/contexts/UsageLimitContext';

import NewSidebar from '@/components/dashboard/NewSidebar';
import MobileNav from '@/components/dashboard/MobileNav';
import HunterDashboard from '@/components/dashboard/HunterDashboard';
import GrowthTeaser from '@/components/dashboard/GrowthTeaser';
import MissionControl from '@/components/dashboard/MissionControl';
import Settings from '@/components/dashboard/Settings';
import Billing from '@/components/dashboard/Billing';
import ResumeEngine from '@/components/dashboard/ResumeEngine';
import Scout from '@/components/dashboard/Scout';
import InterviewPrep from '@/components/dashboard/InterviewPrep';
import { SkillGapAnalyzer } from '@/components/dashboard/SkillGapAnalyzer';
import LinkedInOptimizer from '@/components/dashboard/LinkedInOptimizer';
import SalaryIntel from '@/components/dashboard/SalaryIntel';
import WalkthroughGuide from '@/components/dashboard/WalkthroughGuide';

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

// ===== Type Definitions =====
type Mode = 'hunter' | 'growth';
type Tab = 
  | 'briefing'
  | 'scout'
  | 'salary-intel'
  | 'resume-engine'
  | 'interview-prep'
  | 'skill-gap'
  | 'linkedin'
  | 'mission-control'
  | 'billing'
  | 'settings'
  | 'help';

// ===== Constants =====
const TAB_TITLES: Record<Tab, string> = {
  briefing: 'Dashboard',
  scout: 'Job Radar',
  'salary-intel': 'Salary Intelligence',
  'resume-engine': 'Resume Engine',
  'interview-prep': 'Interview Coach',
  'skill-gap': 'Skill Gap Analyzer',
  linkedin: 'LinkedIn Optimizer',
  'mission-control': 'Application Tracker',
  billing: 'Billing',
  settings: 'Settings',
  help: 'Help & Support',
};

const REFRESH_DELAYS = [2000, 5000, 10000];

// ===== Helper Functions =====
const getUserInitials = (email: string): string => {
  const username = email.split('@')[0];
  const initials = username
    .split('.')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return initials || 'U';
};

// ===== Main Component =====
const Dashboard = () => {
  // ===== Hooks =====
  const { toast } = useToast();
  const { refresh: refreshSubscription } = useSubscription();
  const { tier, subscriptionEnd, loading: usageLoading } = useUsageLimit();
  const navigate = useNavigate();

  // ===== State =====
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const saved = localStorage.getItem('dashboard-active-tab') as Tab | null;
    return saved || 'briefing';
  });
  const handleSetActiveTab = (tab: string) => setActiveTab(tab as Tab);
  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem('dashboard-mode') as Mode | null;
    return saved || 'hunter';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasResume, setHasResume] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userInitials, setUserInitials] = useState<string>('U');
  const [unreadAlerts, setUnreadAlerts] = useState(0);

  // ===== Trial Status Calculations =====
  const isTrialExpired = tier === 'free' && subscriptionEnd && 
    new Date(subscriptionEnd) < new Date();
  const isTrialActive = tier === 'elite' && subscriptionEnd && 
    new Date(subscriptionEnd) > new Date();
  const isTrialEndingSoon = isTrialActive && subscriptionEnd &&
    (new Date(subscriptionEnd).getTime() - new Date().getTime()) < 24 * 60 * 60 * 1000;

  // ===== Effects =====
  useEffect(() => {
    handleStripeRedirect();
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboard-active-tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('dashboard-mode', mode);
  }, [mode]);

  useEffect(() => {
    if (activeTab === 'scout') {
      setUnreadAlerts(0);
    }
  }, [activeTab]);

  // ===== Stripe Redirect Handler =====
  const handleStripeRedirect = () => {
    const params = new URLSearchParams(window.location.search);
    const upgradeStatus = params.get('upgrade');

    if (upgradeStatus === 'success') {
      toast({
        title: '✅ Payment successful!',
        description: 'Your account is being upgraded. This may take a few seconds.',
      });

      window.history.replaceState({}, '', '/dashboard');

      REFRESH_DELAYS.forEach(delay => {
        setTimeout(() => refreshSubscription(), delay);
      });
    } else if (upgradeStatus === 'cancelled') {
      toast({
        title: 'Checkout cancelled',
        description: 'No charge was made. You can upgrade anytime from Billing.',
      });
      window.history.replaceState({}, '', '/dashboard');
    }
  };

  // ===== Authentication =====
  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      setUserEmail(user.email || '');
      setUserInitials(getUserInitials(user.email || ''));

      const { data: resumes } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);
      setHasResume(resumes && resumes.length > 0);

      const { data: preferences } = await supabase
        .from('career_preferences')
        .select('work_style, walkthrough_completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (preferences?.work_style) {
        setMode(preferences.work_style as Mode);
      }

      if (!preferences?.walkthrough_completed) {
        setShowWalkthrough(true);
      }

      const { count } = await supabase
        .from('radar_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      setUnreadAlerts(count || 0);

    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  // ===== Event Handlers =====
  const handleWalkthroughComplete = async () => {
    setShowWalkthrough(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('career_preferences')
        .upsert(
          { user_id: user.id, walkthrough_completed: true },
          { onConflict: 'user_id' }
        );
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

  // ===== Render Helpers =====
  const renderContent = () => {
    if (mode === 'growth') {
      return <GrowthTeaser setMode={setMode} />;
    }

    switch (activeTab) {
      case 'briefing':
        return <HunterDashboard setActiveTab={handleSetActiveTab} />;
      case 'scout':
        return <Scout />;
      case 'salary-intel':
        return <SalaryIntel />;
      case 'resume-engine':
        return <ResumeEngine setActiveTab={handleSetActiveTab} hasResume={hasResume} />;
      case 'interview-prep':
        return <InterviewPrep setActiveTab={handleSetActiveTab} />;
      case 'skill-gap':
        return <SkillGapAnalyzer />;
      case 'linkedin':
        return <LinkedInOptimizer />;
      case 'mission-control':
        return <MissionControl />;
      case 'billing':
        return <Billing setActiveTab={handleSetActiveTab} />;
      case 'settings':
        return <Settings />;
      case 'help':
        return (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Help & Support</h1>
            <p className="text-muted-foreground mb-6">
              Have questions or need assistance? We're here to help.
            </p>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-border bg-card">
                <h3 className="font-semibold mb-1">📧 Email Support</h3>
                <a 
                  href="mailto:contact-us@vaylance.com" 
                  className="text-primary hover:underline"
                >
                  contact-us@vaylance.com
                </a>
                <p className="text-xs text-muted-foreground mt-1">
                  Response within 24 hours
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card">
                <h3 className="font-semibold mb-1">📚 Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Check our guides for tips on using each feature.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <HunterDashboard setActiveTab={handleSetActiveTab} />;
    }
  };

  const getTabTitle = (): string => {
    return TAB_TITLES[activeTab] || 'Dashboard';
  };

  // ===== Loading State =====
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading your command center…</p>
        </div>
      </div>
    );
  }

  // ===== Render =====
  return (
    <div className="h-screen flex w-full bg-background overflow-hidden">
      {/* Walkthrough Guide */}
      {showWalkthrough && (
        <WalkthroughGuide onComplete={handleWalkthroughComplete} />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <NewSidebar
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          mode={mode}
          setMode={setMode}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto pb-16 md:pb-0">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4 md:px-6">
            {/* Title */}
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{getTabTitle()}</h1>
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {mode === 'hunter' ? 'Hunter Mode' : 'Growth Mode'}
              </span>
            </div>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-4">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadAlerts > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                        {unreadAlerts > 9 ? '9+' : unreadAlerts}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadAlerts > 0 && (
                      <span className="text-xs text-muted-foreground">{unreadAlerts} new</span>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto p-4 text-center text-sm text-muted-foreground">
                    <Sparkles className="mx-auto mb-2 h-5 w-5 opacity-60" />
                    You're all caught up.
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleSetActiveTab('scout')} 
                    className="cursor-pointer justify-center font-medium text-primary"
                  >
                    View all alerts
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
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

                  <DropdownMenuItem 
                    onClick={() => handleSetActiveTab('settings')} 
                    className="cursor-pointer"
                  >
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    onClick={() => handleSetActiveTab('billing')} 
                    className="cursor-pointer"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    onClick={() => handleSetActiveTab('help')} 
                    className="cursor-pointer"
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

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

        {/* Content Area with Trial Banners */}
        <div className="p-4 md:p-6">
          {/* Trial Ending Soon Banner */}
          {!usageLoading && isTrialEndingSoon && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                ⏰ Your trial ends today — upgrade to keep full access.
              </p>
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => handleSetActiveTab('billing')}
              >
                Upgrade Now
              </Button>
            </div>
          )}

          {/* Trial Expired Banner */}
          {!usageLoading && isTrialExpired && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-destructive">
                  Your free trial has ended
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upgrade to Pro or Elite to continue using all features.
                </p>
              </div>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={() => handleSetActiveTab('billing')}
              >
                Choose a Plan
              </Button>
            </div>
          )}

          {renderContent()}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        mode={mode}
      />
    </div>
  );
};

export default Dashboard;
