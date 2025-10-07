
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Search,
  CreditCard,
  Settings,
  Brain,
  LogOut,
  HelpCircle,
  Mail,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
  const navigate = useNavigate();
  const menuItems = [
    {
      title: "Dashboard",
      id: "dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      title: "My Resumes",
      id: "my-resumes", 
      icon: FileText,
      badge: "3",
    },
    {
      title: "Create Resume",
      id: "create-resume",
      icon: Plus,
      badge: null,
    },
    {
      title: "Cover Letter",
      id: "cover-letter",
      icon: Mail,
      badge: "New",
    },
    {
      title: "Job Finder",
      id: "job-finder",
      icon: Search,
      badge: null,
    },
    {
      title: "Interview Prep",
      id: "interview-prep",
      icon: Brain,
      badge: null,
    },
    {
      title: "Billing",
      id: "billing",
      icon: CreditCard,
      badge: null,
    },
    {
      title: "Settings",
      id: "settings",
      icon: Settings,
      badge: null,
    }
  ];

  const supportItems = [
    {
      title: "Help & Support",
      id: "help",
      icon: HelpCircle,
    }
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar className="border-r border-border">
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">AR</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Resume</h2>
            <p className="text-xs text-muted-foreground">Professional</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 p-2">
                {menuItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full justify-start gap-3 h-10 ${
                          isActive 
                            ? 'bg-accent text-accent-foreground' 
                            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.title}</span>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className="ml-auto text-xs h-5"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-4" />

          {/* Support Section */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 p-2">
                {supportItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full justify-start gap-3 h-10 ${
                          isActive 
                            ? 'bg-accent text-accent-foreground' 
                            : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>

      {/* Footer with User Profile */}
      <SidebarFooter className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start h-9 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
