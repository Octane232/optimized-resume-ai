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
    <Sidebar className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/60">
      <SidebarHeader className="px-6 pt-6 pb-4">
        <Link to="/" className="flex items-center gap-4">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              AI Interview Pro
            </h1>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab(item.id)}
                      className={`group relative w-full px-4 py-3 rounded-xl transition-all duration-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 ${
                        isActive 
                          ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50 shadow-sm' 
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                        <div className="text-left">
                          <div className={`font-medium ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>
                            {item.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {item.description}
                          </div>
                        </div>
                      </div>
                      {isActive && (
                        <div className="absolute right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
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
          <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
            Statistics
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-2 gap-2">
              {stats.map((stat) => (
                <div key={stat.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <stat.icon className={`w-4 h-4 text-slate-500 dark:text-slate-400`} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{stat.value}</span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Section */}
      <SidebarFooter className="px-6 py-4 mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="John Doe" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium text-slate-900 dark:text-white">John Doe</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pro Account</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 border-0 text-white text-xs">
            Pro
          </Badge>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex gap-3">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href} className="hover:underline">
                {link.label}
              </a>
            ))}
          </div>
          <p>&copy; {new Date().getFullYear()}</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
