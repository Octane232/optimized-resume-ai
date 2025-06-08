
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
  ChevronRight,
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
import { ScrollArea } from "@/components/ui/scroll-area";
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
      description: "Overview & Analytics",
    },
    {
      title: "My Resumes",
      id: "my-resumes", 
      icon: FileText,
      badge: "3",
      description: "Manage Documents",
    },
    {
      title: "Create Resume",
      id: "create-resume",
      icon: Plus,
      badge: null,
      description: "Build New Resume",
    },
    {
      title: "Job Finder",
      id: "job-finder",
      icon: Search,
      badge: "New",
      description: "Discover Opportunities",
    },
    {
      title: "Interview Prep",
      id: "interview-prep",
      icon: Brain,
      badge: null,
      description: "Practice & Improve",
    },
    {
      title: "Billing",
      id: "billing",
      icon: CreditCard,
      badge: null,
      description: "Subscription & Plans",
    },
    {
      title: "Settings",
      id: "settings",
      icon: Settings,
      badge: null,
      description: "Preferences & Account",
    }
  ];

  const supportItems = [
    {
      title: "Help & Support",
      id: "help",
      icon: HelpCircle,
      description: "Get Assistance",
    }
  ];

  const handleLogout = () => {
    console.log("Logging out...");
  };

  return (
    <Sidebar className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-r border-slate-200/60 dark:border-slate-700/60 shadow-xl">
      {/* Header */}
      <SidebarHeader className="p-8 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
              <Crown className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              AI Resume Pro
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="text-xs bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 shadow-md">
                <Crown className="w-3 h-3 mr-1" />
                Professional
              </Badge>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <ScrollArea className="h-full px-2">
          {/* Main Navigation */}
          <SidebarGroup>
            <div className="px-4 py-3">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Workspace
              </h3>
            </div>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        onClick={() => setActiveTab(item.id)}
                        className={`group relative mx-2 px-4 py-4 rounded-xl transition-all duration-300 flex items-center gap-4 text-sm font-medium overflow-hidden ${
                          isActive 
                            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 shadow-lg' 
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full" />
                        )}
                        
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                        }`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold ${
                            isActive 
                              ? 'text-indigo-700 dark:text-indigo-300' 
                              : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100'
                          }`}>
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.description}
                          </div>
                        </div>

                        {item.badge && (
                          <Badge 
                            className={`text-xs px-2.5 py-1 font-medium ${
                              item.badge === "New" 
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800" 
                                : "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800"
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}

                        {isActive && (
                          <ChevronRight className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-6 mx-6 bg-slate-200 dark:bg-slate-700" />

          {/* Support Section */}
          <SidebarGroup>
            <div className="px-4 py-3">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Support
              </h3>
            </div>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {supportItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        onClick={() => setActiveTab(item.id)}
                        className={`group relative mx-2 px-4 py-4 rounded-xl transition-all duration-300 flex items-center gap-4 text-sm font-medium ${
                          isActive 
                            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50 shadow-lg' 
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                        }`}
                      >
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                        }`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`font-semibold ${
                            isActive 
                              ? 'text-indigo-700 dark:text-indigo-300' 
                              : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100'
                          }`}>
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.description}
                          </div>
                        </div>
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
      <SidebarFooter className="p-6 border-t border-slate-200/60 dark:border-slate-700/60">
        {/* Notification Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                2 new suggestions
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Resume improvements available
              </div>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-lg font-bold text-white">JD</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">John Doe</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate">john@example.com</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start h-10 text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <User className="w-4 h-4 mr-3" />
              Profile Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start h-10 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
