
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Brain,
  Database,
  Target,
  Settings,
  LogOut,
  Crosshair,
  Rocket,
  Lock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import logo from "@/assets/pitchsora-logo.png";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'hunter' | 'growth'>('hunter');

  // Big Four navigation items
  const menuItems = [
    {
      title: "Briefing",
      id: "briefing",
      icon: LayoutDashboard,
    },
    {
      title: "Resume Engine",
      id: "resume-engine",
      icon: Brain,
    },
    {
      title: "The Vault",
      id: "vault",
      icon: Database,
    },
    {
      title: "Mission Control",
      id: "mission-control",
      icon: Target,
    },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      });
      
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      {/* Header with Logo */}
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Pitchsora" className="h-10 w-auto" />
        </div>

        {/* Mode Toggle */}
        <div className="mt-4 p-1 bg-sidebar-accent/30 rounded-lg flex">
          <button
            onClick={() => setMode('hunter')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all ${
              mode === 'hunter'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-sidebar-foreground'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            Hunter
          </button>
          <button
            onClick={() => toast({ title: "Coming Soon", description: "Growth Mode will be available in a future update." })}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium text-muted-foreground/50 cursor-not-allowed"
          >
            <Rocket className="w-3.5 h-3.5" />
            Growth
            <Lock className="w-3 h-3" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Big Four Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full justify-start gap-3 h-11 rounded-lg transition-all ${
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-md' 
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        {/* Settings */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full justify-start gap-3 h-10 rounded-lg ${
                    activeTab === 'settings'
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="font-medium text-sm">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start h-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
