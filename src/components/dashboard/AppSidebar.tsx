
import React from "react";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Search,
  CreditCard,
  Settings,
  Brain,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

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
    },
    {
      title: "My Resumes",
      id: "my-resumes", 
      icon: FileText,
    },
    {
      title: "Create Resume",
      id: "create-resume",
      icon: Plus,
    },
    {
      title: "Job Finder",
      id: "job-finder",
      icon: Search,
    },
    {
      title: "Interview Prep",
      id: "interview-prep",
      icon: Brain,
    },
    {
      title: "Billing",
      id: "billing",
      icon: CreditCard,
    },
    {
      title: "Settings",
      id: "settings",
      icon: Settings,
    }
  ];

  return (
    <Sidebar className="bg-white/10 dark:bg-slate-900/10 backdrop-blur-lg border-r border-white/20 dark:border-slate-700/20 shadow-lg w-72">
      <SidebarContent className="px-4 pt-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab(item.id)}
                      className={`group relative w-full px-4 py-4 rounded-2xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-white/20 dark:bg-slate-800/30 backdrop-blur-xl text-blue-600 dark:text-blue-400 border border-white/30 dark:border-slate-700/30 shadow-lg' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-white/10 dark:hover:bg-slate-800/20 hover:backdrop-blur-xl hover:shadow-md hover:border hover:border-white/20 dark:hover:border-slate-700/20'
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0 w-full">
                        <div className={`p-2.5 rounded-xl transition-all duration-300 flex-shrink-0 ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25' 
                            : 'bg-white/20 dark:bg-slate-800/20 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600'
                        }`}>
                          <item.icon className={`w-5 h-5 transition-colors ${
                            isActive 
                              ? 'text-white' 
                              : 'text-slate-600 dark:text-slate-400 group-hover:text-white'
                          }`} />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className={`font-semibold text-base whitespace-nowrap overflow-hidden text-ellipsis ${
                            isActive 
                              ? 'text-blue-700 dark:text-blue-300' 
                              : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            {item.title}
                          </div>
                        </div>
                      </div>
                      {isActive && (
                        <div className="absolute right-3 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg"></div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
