import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Download, Plus, Lightbulb, ArrowRight, Sparkles, MessageSquare, Briefcase, Crosshair } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import ResumeTemplatePreview from './ResumeTemplatePreview';
import ActivityFeed from './ActivityFeed';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DashboardMainProps {
  setActiveTab?: (tab: string) => void;
}

const DashboardMain = ({ setActiveTab }: DashboardMainProps) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [usageStats, setUsageStats] = useState<any>(null);
  const [aiTips, setAiTips] = useState<any[]>([]);
  const [coverLettersCount, setCoverLettersCount] = useState(0);
  const [interviewSessionsCount, setInterviewSessionsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, resumesRes, analyticsRes, usageRes, tipsRes, coverRes, interviewRes, appsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('resumes').select('*').eq('user_id', user.id).order('updated_at', { ascending: false }),
        supabase.from('resume_analytics').select('*').eq('user_id', user.id),
        supabase.from('user_usage_stats').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('ai_tips').select('*').eq('is_active', true).limit(5),
        supabase.from('cover_letters').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('interview_sessions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('job_applications').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      setProfile(profileRes.data);
      setResumes(resumesRes.data || []);
      setAnalytics(analyticsRes.data || []);
      setUsageStats(usageRes.data);
      setAiTips(tipsRes.data || []);
      setCoverLettersCount(coverRes.count || 0);
      setInterviewSessionsCount(interviewRes.count || 0);
      setApplicationsCount(appsRes.count || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({ title: "Error", description: "Failed to load dashboard data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  const stats = [
    { title: 'Resumes', value: resumes.length.toString(), icon: FileText, change: resumes.length > 0 ? 'Keep building!' : 'Create your first' },
    { title: 'Cover Letters', value: coverLettersCount.toString(), icon: MessageSquare, change: 'Generated with AI' },
    { title: 'Applications', value: applicationsCount.toString(), icon: Crosshair, change: 'Tracked applications' },
    { title: 'Interview Prep', value: interviewSessionsCount.toString(), icon: Briefcase, change: 'Practice sessions' },
  ];

  const handleDownloadResume = async (resumeId: string) => {
    try {
      toast({ title: "Download started", description: "Preparing your resume..." });
      const { data: resume, error } = await supabase.from('resumes').select('*').eq('id', resumeId).single();
      if (error || !resume) throw new Error('Failed to fetch resume');

      const { data: templatesData } = await supabase.from('resume_templates').select('*');
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.width = '210mm';
      document.body.appendChild(container);

      const root = document.createElement('div');
      container.appendChild(root);
      const { createRoot } = await import('react-dom/client');
      const reactRoot = createRoot(root);
      
      await new Promise<void>((resolve) => {
        reactRoot.render(
          <ResumeTemplatePreview 
            resumeData={resume.content as any}
            templateId={resume.template_name || ''}
            templates={templatesData || []}
          />
        );
        setTimeout(() => resolve(), 100);
      });

      const clone = root.cloneNode(true) as HTMLElement;
      container.removeChild(root);
      container.appendChild(clone);

      await html2pdf().set({
        margin: 0,
        filename: `${resume.title || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(clone).save();

      reactRoot.unmount();
      document.body.removeChild(container);
      toast({ title: "Success", description: "Resume downloaded successfully" });
    } catch (error: any) {
      console.error('Error downloading resume:', error);
      toast({ title: "Error", description: "Failed to download resume.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-subtle rounded-3xl" />
        <div className="relative glass-morphism rounded-3xl border border-border/50 shadow-xl">
          <div className="p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/50 rounded-full border border-border/50">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-foreground">Welcome back!</span>
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    Ready to land your 
                    <span className="gradient-text"> dream job</span>?
                  </h1>
                  
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Paste a job description. Get a tailored resume, cover letter, and ATS score in 60 seconds.
                  </p>
                </div>

                {aiTips.length > 0 && (
                  <div className="flex items-start gap-4 p-6 bg-accent/50 rounded-2xl border border-border/50">
                    <div className="p-2.5 bg-primary rounded-xl shadow-lg">
                      <Lightbulb className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Pro Tip
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {aiTips[Math.floor(Math.random() * aiTips.length)]?.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={() => setActiveTab?.('resume-engine')}
                  size="lg"
                  className="h-16 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Tailor Resume to Job
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-3d glass-card-strong border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground/70 uppercase tracking-wide">{stat.title}</p>
                    <p className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{stat.value}</p>
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                </div>
                <p className="text-sm text-foreground/60 font-medium">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Resumes */}
        <div className="xl:col-span-2">
          <Card className="glass-morphism border border-border/50 shadow-lg rounded-2xl">
            <CardHeader className="border-b border-border/60 pb-6">
              <CardTitle className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Recent Resumes</h2>
                  <p className="text-sm text-muted-foreground mt-1">Your latest resume projects</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {resumes.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No resumes yet</h3>
                    <p className="mb-6">Use the Resume Engine to create your first ATS-optimized resume</p>
                    <Button onClick={() => setActiveTab?.('resume-engine')} className="rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Go to Resume Engine
                    </Button>
                  </div>
                ) : (
                  resumes.slice(0, 5).map((resume) => (
                    <div key={resume.id} className="group relative overflow-hidden bg-accent/20 rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300">
                      <div className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                              <FileText className="w-7 h-7 text-primary" />
                            </div>
                            <div className="space-y-2 flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground text-lg truncate">{resume.title}</h3>
                              <span className="text-sm text-muted-foreground">
                                Updated {new Date(resume.updated_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-xl" onClick={() => handleDownloadResume(resume.id)}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default DashboardMain;