
import React from "react";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Search,
  CreditCard,
  Settings,
  Brain,
  User,
  LogOut,
  Crown,
  Sparkles,
  Bell,
  HelpCircle,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AppSidebar({ activeTab, setActiveTab }: AppSidebarProps) {
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
      title: "Job Finder",
      id: "job-finder",
      icon: Search,
      badge: "New",
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

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
    // You can add actual logout functionality here
  };

  return (
    <Sidebar className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border-r border-white/20 dark:border-white/10">
      {/* Header */}
      <SidebarHeader className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Crown className="w-2 h-2 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">AI Resume Pro</h2>
            <div className="flex items-center gap-2">
              <Badge className="text-xs bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 border-0">
                <Crown className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-6">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-4">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab(item.id)}
                      className={`group w-full px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 text-sm font-medium relative ${
                        isActive 
                          ? 'bg-white/20 dark:bg-white/15 backdrop-blur-xl text-primary border border-white/30 shadow-xl' 
                          : 'text-foreground/80 hover:bg-white/15 dark:hover:bg-white/10 hover:backdrop-blur-xl hover:text-foreground hover:shadow-lg'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? 'bg-primary/20 text-primary shadow-lg' 
                          : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary'
                      }`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className={`flex-1 font-semibold ${
                        isActive 
                          ? 'text-primary' 
                          : 'text-foreground/80 group-hover:text-foreground'
                      }`}>
                        {item.title}
                      </span>
                      {item.badge && (
                        <Badge 
                          className={`text-xs px-2 py-0.5 ${
                            item.badge === "New" 
                              ? "bg-green-500/20 text-green-300 border-green-500/30" 
                              : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                          }`}
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

        <SidebarSeparator className="my-4 mx-4" />

        {/* Support Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 px-4">
              {supportItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab(item.id)}
                      className={`group w-full px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 text-sm font-medium ${
                        isActive 
                          ? 'bg-white/20 dark:bg-white/15 backdrop-blur-xl text-primary border border-white/30 shadow-xl' 
                          : 'text-foreground/80 hover:bg-white/15 dark:hover:bg-white/10 hover:backdrop-blur-xl hover:text-foreground hover:shadow-lg'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? 'bg-primary/20 text-primary shadow-lg' 
                          : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary'
                      }`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className={`font-semibold ${
                        isActive 
                          ? 'text-primary' 
                          : 'text-foreground/80 group-hover:text-foreground'
                      }`}>
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with User Profile */}
      <SidebarFooter className="p-4 border-t border-white/10">
        {/* Notification Banner */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-xl p-3 mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-foreground/80">
              2 new resume suggestions
            </span>
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-sm font-semibold text-white">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">John Doe</p>
              <p className="text-xs text-foreground/60 truncate">john@example.com</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-8 text-xs text-foreground/80 hover:text-foreground hover:bg-white/10"
            >
              <User className="w-3 h-3 mr-2" />
              Profile Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start h-8 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="w-3 h-3 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
