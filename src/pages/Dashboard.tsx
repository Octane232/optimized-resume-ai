
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardMain from '@/components/dashboard/DashboardMain';
import MyResumes from '@/components/dashboard/MyResumes';
import CreateResume from '@/components/dashboard/CreateResume';
import CoverLetterGenerator from '@/components/dashboard/CoverLetterGenerator';
import JobFinder from '@/components/dashboard/JobFinder';
import InterviewPrep from '@/components/dashboard/InterviewPrep';
import Billing from '@/components/dashboard/Billing';
import Settings from '@/components/dashboard/Settings';
import HelpSupport from '@/components/dashboard/HelpSupport';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    // Restore last active tab from localStorage
    return localStorage.getItem('dashboard-active-tab') || 'dashboard';
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    // Persist active tab to localStorage
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardMain setActiveTab={setActiveTab} />;
      case 'my-resumes':
        return <MyResumes />;
      case 'create-resume':
        return <CreateResume />;
      case 'cover-letter':
        return <CoverLetterGenerator />;
      case 'job-finder':
        return <JobFinder />;
      case 'interview-prep':
        return <InterviewPrep />;
      case 'billing':
        return <Billing />;
      case 'settings':
        return <Settings />;
      case 'help':
        return <HelpSupport />;
      default:
        return <DashboardMain setActiveTab={setActiveTab} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background/95 to-muted/30">
        <AppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
