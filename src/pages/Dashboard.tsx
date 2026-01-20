import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import NewSidebar from '@/components/dashboard/NewSidebar';
import SoraSidecar from '@/components/dashboard/SoraSidecar';
import HunterDashboard from '@/components/dashboard/HunterDashboard';
import GrowthTeaser from '@/components/dashboard/GrowthTeaser';
import TheVault from '@/components/dashboard/TheVault';
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
        return <TheVault onResumeChange={(has) => setHasResume(has)} />;
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

  return (
    <div className="h-screen flex w-full bg-background overflow-hidden">
      {/* Walkthrough Guide for first-time users */}
      {showWalkthrough && (
        <WalkthroughGuide onComplete={handleWalkthroughComplete} />
      )}

      {/* Zone A: Left Sidebar */}
      <NewSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        mode={mode}
        setMode={setMode}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      
      {/* Zone B: Main Content - Single scroll container */}
      <main className="flex-1 h-screen overflow-y-auto">
        {renderContent()}
      </main>

      {/* Zone C: Vaya Sidecar (only on briefing) */}
      {activeTab === 'briefing' && mode === 'hunter' && (
        <div className="w-80 hidden lg:block h-screen overflow-y-auto border-l border-border">
          <SoraSidecar mode={mode} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
