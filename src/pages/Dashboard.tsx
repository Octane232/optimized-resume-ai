
import React, { useState } from 'react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardMain from '@/components/dashboard/DashboardMain';
import MyResumes from '@/components/dashboard/MyResumes';
import CreateResume from '@/components/dashboard/CreateResume';
import JobFinder from '@/components/dashboard/JobFinder';
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
      case 'billing':
        return <Billing />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardMain />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex w-full">
      <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
