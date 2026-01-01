import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import Briefing from '@/components/dashboard/Briefing';
import ResumeEngine from '@/components/dashboard/ResumeEngine';
import TheVault from '@/components/dashboard/TheVault';
import MissionControl from '@/components/dashboard/MissionControl';
import Settings from '@/components/dashboard/Settings';
import OnboardingFlow from '@/components/dashboard/OnboardingFlow';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dashboard-active-tab') || 'briefing';
  });
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    localStorage.setItem('dashboard-active-tab', activeTab);
  }, [activeTab]);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Check onboarding status
      const { data: preferences } = await supabase
        .from('career_preferences')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!preferences?.onboarding_completed) {
        setShowOnboarding(true);
      }

      // Check if user has a resume
      const { data: resumes } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      setHasResume(resumes && resumes.length > 0);

    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
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
    switch (activeTab) {
      case 'briefing':
        return <Briefing setActiveTab={setActiveTab} hasResume={hasResume} />;
      case 'resume-engine':
        return <ResumeEngine setActiveTab={setActiveTab} hasResume={hasResume} />;
      case 'vault':
        return <TheVault onResumeChange={(has) => setHasResume(has)} />;
      case 'mission-control':
        return <MissionControl />;
      case 'settings':
        return <Settings />;
      default:
        return <Briefing setActiveTab={setActiveTab} hasResume={hasResume} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      {showOnboarding && <OnboardingFlow onComplete={handleOnboardingComplete} />}
    </SidebarProvider>
  );
};

export default Dashboard;
