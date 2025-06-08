
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
    <Sidebar className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border-r border-white/20 dark:border-white/10">
      <SidebarContent className="py-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4 px-4">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab(item.id)}
                      className={`group w-full px-6 py-4 rounded-2xl transition-all duration-300 flex items-center gap-4 text-base font-medium ${
                        isActive 
                          ? 'bg-white/20 dark:bg-white/15 backdrop-blur-xl text-primary border border-white/30 shadow-xl' 
                          : 'text-foreground/80 hover:bg-white/15 dark:hover:bg-white/10 hover:backdrop-blur-xl hover:text-foreground hover:shadow-lg'
                      }`}
                    >
                      <div className={`p-3 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-primary/20 text-primary shadow-lg' 
                          : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary'
                      }`}>
                        <item.icon className="w-5 h-5" />
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
    </Sidebar>
  );
}
