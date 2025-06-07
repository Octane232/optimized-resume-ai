
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
    <Sidebar className="bg-white/5 dark:bg-black/5 backdrop-blur-xl border-r border-white/10 dark:border-white/5">
      <SidebarContent className="px-6 py-8">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {menuItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => setActiveTab(item.id)}
                      className={`group w-full px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                        isActive 
                          ? 'bg-white/15 dark:bg-white/10 backdrop-blur-xl text-primary border border-white/20 shadow-lg' 
                          : 'text-foreground/80 hover:bg-white/10 dark:hover:bg-white/5 hover:backdrop-blur-xl hover:text-foreground'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        isActive 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                      }`}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className={`font-medium text-sm ${
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
