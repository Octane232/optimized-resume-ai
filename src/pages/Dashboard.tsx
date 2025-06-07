
import React, { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardMain from '@/components/dashboard/DashboardMain';
import MyResumes from '@/components/dashboard/MyResumes';
import CreateResume from '@/components/dashboard/CreateResume';
import JobFinder from '@/components/dashboard/JobFinder';
import InterviewPrep from '@/components/dashboard/InterviewPrep';
import Billing from '@/components/dashboard/Billing';
import Settings from '@/components/dashboard/Settings';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardMain />;
      case 'my-resumes':
        return <MyResumes />;
      case 'create-resume':
        return <CreateResume />;
      case 'job-finder':
        return <JobFinder />;
      case 'interview-prep':
        return <InterviewPrep />;
      case 'billing':
        return <Billing />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardMain />;
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
