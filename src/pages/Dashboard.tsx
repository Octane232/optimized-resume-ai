
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
import HelpSupport from '@/components/dashboard/HelpSupport';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dashboard-active-tab') || 'briefing';
  });
  const [loading, setLoading] = useState(true);
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
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
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
    switch (activeTab) {
      case 'briefing':
        return <Briefing setActiveTab={setActiveTab} />;
      case 'resume-engine':
        return <ResumeEngine />;
      case 'vault':
        return <TheVault />;
      case 'mission-control':
        return <MissionControl />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <HelpSupport />;
      default:
        return <Briefing setActiveTab={setActiveTab} />;
    }
  };

  // Get page title for header
  const getPageTitle = () => {
    switch (activeTab) {
      case 'briefing': return 'Briefing';
      case 'resume-engine': return 'Resume Engine';
      case 'vault': return 'The Vault';
      case 'mission-control': return 'Mission Control';
      case 'settings': return 'Settings';
      case 'help': return 'Help & Support';
      default: return 'Briefing';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          {/* Contextual Page Header */}
          <header className="h-14 border-b border-border flex items-center px-6 bg-card/50">
            <h1 className="text-lg font-semibold text-foreground">{getPageTitle()}</h1>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
