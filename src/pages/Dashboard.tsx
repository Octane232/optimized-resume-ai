import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import NewSidebar from '@/components/dashboard/NewSidebar';
import SoraSidecar from '@/components/dashboard/SoraSidecar';
import NewOnboarding from '@/components/dashboard/NewOnboarding';
import HunterDashboard from '@/components/dashboard/HunterDashboard';
import GrowthTeaser from '@/components/dashboard/GrowthTeaser';
import TheVault from '@/components/dashboard/TheVault';
import MissionControl from '@/components/dashboard/MissionControl';
import Settings from '@/components/dashboard/Settings';
import ResumeEngine from '@/components/dashboard/ResumeEngine';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dashboard-active-tab') || 'briefing';
  });
  const [mode, setMode] = useState<'hunter' | 'growth'>(() => {
    return (localStorage.getItem('dashboard-mode') as 'hunter' | 'growth') || 'hunter';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

      // Check onboarding status and resume
      const [preferencesResult, resumesResult] = await Promise.all([
        supabase
          .from('career_preferences')
          .select('onboarding_completed, work_style')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('resumes')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)
      ]);

      const preferences = preferencesResult.data;
      const resumes = resumesResult.data;

      // Check if user has a resume
      setHasResume(resumes && resumes.length > 0);

      // If no resume or onboarding not completed, show onboarding
      if (!resumes || resumes.length === 0 || !preferences?.onboarding_completed) {
        setShowOnboarding(true);
      } else if (preferences?.work_style) {
        setMode(preferences.work_style as 'hunter' | 'growth');
      }

    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = (selectedMode: 'hunter' | 'growth') => {
    setMode(selectedMode);
    setShowOnboarding(false);
    setHasResume(true);
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

  if (showOnboarding) {
    return <NewOnboarding onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    // If in growth mode, always show teaser
    if (mode === 'growth') {
      return <GrowthTeaser setMode={setMode} />;
    }

    switch (activeTab) {
      case 'briefing':
        return <HunterDashboard setActiveTab={setActiveTab} />;
      case 'resume-engine':
        return <ResumeEngine setActiveTab={setActiveTab} hasResume={hasResume} />;
      case 'vault':
        return <TheVault onResumeChange={(has) => setHasResume(has)} />;
      case 'mission-control':
        return <MissionControl />;
      case 'settings':
        return <Settings />;
      default:
        return <HunterDashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Zone A: Left Sidebar */}
      <NewSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        mode={mode}
        setMode={setMode}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      {/* Zone B: Main Content */}
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>

      {/* Zone C: Sora Sidecar (only on briefing) */}
      {activeTab === 'briefing' && (
        <div className="w-80 hidden lg:block">
          <SoraSidecar mode={mode} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
