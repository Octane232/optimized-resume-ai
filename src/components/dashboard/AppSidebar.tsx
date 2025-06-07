
import React from "react";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Search,
  CreditCard,
  Settings,
  Brain,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
    <Sidebar className="bg-white/10 dark:bg-slate-900/10 backdrop-blur-2xl border-r border-white/10 dark:border-slate-700/10 shadow-2xl shadow-slate-900/5 w-72">
      <SidebarHeader className="px-6 pt-8 pb-6">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-4 w-full text-left group transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-lg"></div>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent truncate">
              AI Interview Pro
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Professional Suite</p>
          </div>
        </button>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2">
            Navigation
          </SidebarGroupLabel>
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
                          ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 backdrop-blur-xl text-blue-600 dark:text-blue-400 border border-blue-200/40 dark:border-blue-800/40 shadow-lg shadow-blue-500/10' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-white/30 dark:hover:bg-slate-800/30 hover:backdrop-blur-xl hover:shadow-md hover:border hover:border-white/20 dark:hover:border-slate-700/20'
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`p-2.5 rounded-xl transition-all duration-300 flex-shrink-0 ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25' 
                            : 'bg-slate-100/80 dark:bg-slate-800/80 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600'
                        }`}>
                          <item.icon className={`w-5 h-5 transition-colors ${
                            isActive 
                              ? 'text-white' 
                              : 'text-slate-500 dark:text-slate-400 group-hover:text-white'
                          }`} />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className={`font-semibold text-base ${
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

      {/* Footer Section */}
      <SidebarFooter className="px-6 py-6 mt-auto border-t border-white/10 dark:border-slate-700/10">
        <div className="flex items-center justify-between p-4 bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <Avatar className="w-12 h-12 ring-2 ring-white/20 dark:ring-slate-700/20">
                <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">JD</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
            <div className="text-sm min-w-0 flex-1">
              <p className="font-semibold text-slate-900 dark:text-white truncate">John Doe</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Premium Member</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 border-0 text-white text-xs font-semibold px-3 py-1 shadow-lg flex-shrink-0">
            Pro
          </Badge>
        </div>
        
        <div className="flex items-center justify-center mt-4 text-xs text-slate-500 dark:text-slate-400">
          <p className="font-medium">&copy; {new Date().getFullYear()} AI Interview Pro</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
