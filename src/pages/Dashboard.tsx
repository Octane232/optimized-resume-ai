import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import NewSidebar from '@/components/dashboard/NewSidebar';
import MobileNav from '@/components/dashboard/MobileNav';
import TopBar from '@/components/dashboard/TopBar';
import DailyHunt from '@/components/dashboard/DailyHunt';
import MissionControl from '@/components/dashboard/MissionControl';
import ApplyToolkit from '@/components/dashboard/ApplyToolkit';
import ReferralNetwork from '@/components/dashboard/ReferralNetwork';
import CareerDashboard from '@/components/dashboard/CareerDashboard';
import BrandAutopilot from '@/components/dashboard/BrandAutopilot';
import SkillStrategist from '@/components/dashboard/SkillStrategist';
import TheVault from '@/components/dashboard/TheVault';
import Settings from '@/components/dashboard/Settings';
import Billing from '@/components/dashboard/Billing';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('dashboard-active-tab') || 'daily-hunt';
  });
  const [mode, setMode] = useState<'hunter' | 'growth'>(() => {
    return (localStorage.getItem('dashboard-mode') as 'hunter' | 'growth') || 'hunter';
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
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

      const { data: preferences } = await supabase
        .from('career_preferences')
        .select('work_style')
        .eq('user_id', user.id)
        .maybeSingle();

      if (preferences?.work_style) {
        setMode(preferences.work_style as 'hunter' | 'growth');
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
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      // Hunter Mode
      case 'daily-hunt':
        return <DailyHunt />;
      case 'mission-control':
        return <MissionControl />;
      case 'apply-toolkit':
        return <ApplyToolkit />;
      case 'referral-network':
        return <ReferralNetwork />;
      // Growth Mode
      case 'career-dashboard':
        return <CareerDashboard />;
      case 'brand-autopilot':
        return <BrandAutopilot />;
      case 'skill-strategist':
        return <SkillStrategist />;
      // Avatar dropdown pages
      case 'vault':
        return <TheVault setActiveTab={setActiveTab} />;
      case 'settings':
        return <Settings />;
      case 'billing':
        return <Billing />;
      default:
        return mode === 'hunter' ? <DailyHunt /> : <CareerDashboard />;
    }
  };

  return (
    <div className="h-screen flex w-full bg-background overflow-hidden">
      {/* Left Sidebar */}
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
      
      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <TopBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mode={mode}
      />
    </div>
  );
};

export default Dashboard;
