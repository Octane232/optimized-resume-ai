
import React from "react";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Search,
  CreditCard,
  Settings,
  Brain,
  TrendingUp,
  File,
  Download,
  MessageSquare,
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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
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
      description: "Overview and stats"
    },
    {
      title: "My Resumes",
      id: "my-resumes", 
      icon: FileText,
      description: "Manage your resumes"
    },
    {
      title: "Create Resume",
      id: "create-resume",
      icon: Plus,
      description: "Build new resume"
    },
    {
      title: "Job Finder",
      id: "job-finder",
      icon: Search,
      description: "Discover opportunities"
    },
    {
      title: "Interview Prep",
      id: "interview-prep",
      icon: Brain,
      description: "AI interview coaching"
    },
    {
      title: "Billing",
      id: "billing",
      icon: CreditCard,
      description: "Plans and payments"
    },
    {
      title: "Settings",
      id: "settings",
      icon: Settings,
      description: "Account preferences"
    }
  ];

  const stats = [
    { label: 'Resumes Created', value: '12', icon: FileText, color: 'from-blue-500 to-blue-600' },
    { label: 'Downloads', value: '26', icon: Download, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Messages', value: '8', icon: MessageSquare, color: 'from-purple-500 to-purple-600' },
    { label: 'Connections', value: '45', icon: Users, color: 'from-orange-500 to-orange-600' }
  ];

  const footerLinks = [
    { label: 'Terms', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Support', href: '#' }
  ];

  return (
    <Sidebar className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-r border-white/20 dark:border-slate-700/20 shadow-2xl shadow-slate-900/10">
      <SidebarHeader className="px-6 pt-6 pb-4">
        <Link to="/" className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/25">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-lg"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              AI Interview Pro
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Professional Suite</p>
          </div>
        </Link>
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
                          ? 'bg-gradient-to-r from-blue-500/15 via-purple-500/15 to-indigo-500/15 backdrop-blur-xl text-blue-600 dark:text-blue-400 border border-blue-200/30 dark:border-blue-800/30 shadow-lg shadow-blue-500/10' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40 hover:backdrop-blur-xl hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25' 
                            : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600'
                        }`}>
                          <item.icon className={`w-5 h-5 transition-colors ${
                            isActive 
                              ? 'text-white' 
                              : 'text-slate-500 dark:text-slate-400 group-hover:text-white'
                          }`} />
                        </div>
                        <div className="text-left flex-1">
                          <div className={`font-semibold text-sm ${
                            isActive 
                              ? 'text-blue-700 dark:text-blue-300' 
                              : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {item.description}
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

        {/* Stats Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2">
            Quick Stats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                      <stat.icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter className="px-6 py-6 mt-auto border-t border-white/10 dark:border-slate-700/10">
        <div className="flex items-center justify-between mb-6 p-4 bg-white/30 dark:bg-slate-800/30 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10 ring-2 ring-white/20 dark:ring-slate-700/20">
                <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">JD</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
            <div className="text-sm">
              <p className="font-semibold text-slate-900 dark:text-white">John Doe</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Premium Member</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 border-0 text-white text-xs font-semibold px-3 py-1 shadow-lg">
            Pro
          </Badge>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex gap-4">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors font-medium">
                {link.label}
              </a>
            ))}
          </div>
          <p className="font-medium">&copy; {new Date().getFullYear()}</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
