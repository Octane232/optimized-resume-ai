import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Download, User, Crown, Plus, Lightbulb, TrendingUp, Star, Zap, Target, Clock, Award, Calendar, ArrowRight, Eye } from 'lucide-react';
import OnboardingFlow from './OnboardingFlow';
import ResumePreview from './ResumePreview';
import TemplateGallery from './TemplateGallery';
import ActivityFeed from './ActivityFeed';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DashboardMain = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [resumes, setResumes] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [aiTips, setAiTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fetch resumes
      const { data: resumesData } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      // Fetch analytics
      const { data: analyticsData } = await supabase
        .from('resume_analytics')
        .select('*')
        .eq('user_id', user.id);

      // Fetch subscription
      const { data: subscriptionData } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fetch AI tips
      const { data: tipsData } = await supabase
        .from('ai_tips')
        .select('*')
        .eq('is_active', true)
        .limit(3);

      setProfile(profileData);
      setResumes(resumesData || []);
      setAnalytics(analyticsData || []);
      setSubscription(subscriptionData);
      setAiTips(tipsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const totalDownloads = analytics.reduce((sum: number, item: any) => sum + (item.downloads || 0), 0);
  const totalViews = analytics.reduce((sum: number, item: any) => sum + (item.views || 0), 0);
  const profileCompletion = profile?.profile_completion || 0;

  const stats = [
    { 
      title: 'Total Resumes', 
      value: resumes.length.toString(), 
      icon: FileText, 
      color: 'bg-gradient-to-r from-primary to-primary/80', 
      bgColor: 'bg-primary/5', 
      change: resumes.length > 0 ? 'Keep building!' : 'Create your first resume',
      trend: 'up'
    },
    { 
      title: 'Downloads', 
      value: totalDownloads.toString(), 
      icon: Download, 
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600', 
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20', 
      change: 'Total downloads',
      trend: 'up'
    },
    { 
      title: 'Views', 
      value: totalViews.toString(), 
      icon: Eye, 
      color: 'bg-gradient-to-r from-amber-500 to-amber-600', 
      bgColor: 'bg-amber-50 dark:bg-amber-950/20', 
      change: 'Total views',
      trend: 'neutral'
    },
    { 
      title: 'Plan Status', 
      value: subscription?.plan_name || 'Free', 
      icon: Crown, 
      color: 'bg-gradient-to-r from-purple-500 to-purple-600', 
      bgColor: 'bg-purple-50 dark:bg-purple-950/20', 
      change: subscription?.plan_status === 'active' ? 'Active plan' : 'Inactive',
      trend: 'neutral'
    },
  ];

  const defaultTips = [
    "Use action verbs to start your bullet points for more impact",
    "Quantify your achievements with specific numbers and percentages",
    "Tailor your resume keywords to match job descriptions",
    "Keep your resume to 1-2 pages for optimal readability",
    "Use consistent formatting throughout your document"
  ];

  const currentTips = aiTips.length > 0 ? aiTips : defaultTips.map(tip => ({ description: tip }));

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
                    <span className="gradient-text"> dream job</span>, {profile?.full_name || 'User'}?
                  </h1>
                  
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Create professional resumes in minutes with our AI-powered platform. Your next career opportunity is just one click away.
                  </p>
                </div>
                
                {/* Profile Completion */}
                <div className="bg-accent/30 rounded-2xl p-6 border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-foreground">Profile Completion</span>
                    <span className="text-lg font-bold text-foreground">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-3 mb-3" />
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      {profileCompletion < 100 ? 'Complete your profile to unlock premium features' : '🎉 Profile complete! All features unlocked'}
                    </p>
                  </div>
                </div>

                {/* AI Tip */}
                <div className="flex items-start gap-4 p-6 bg-amber-50/80 dark:bg-amber-950/20 rounded-2xl border border-amber-200/50 dark:border-amber-800/30">
                  <div className="p-2.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl shadow-lg">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">💡 Pro Tip</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {currentTips[Math.floor(Math.random() * currentTips.length)]?.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <Button 
                  onClick={() => setShowOnboarding(true)}
                  size="lg"
                  className="h-16 text-lg font-semibold gradient-bg shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Create New Resume
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => setShowTemplates(true)}
                  size="lg"
                  className="h-14 text-base font-medium border-2 rounded-2xl"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Browse Templates
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
            <Card key={index} className="relative overflow-hidden glass-morphism border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
              <div className={`absolute inset-0 ${stat.bgColor}`} />
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-2xl ${stat.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {stat.trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-500" />}
                  <span className="text-sm text-muted-foreground font-medium">{stat.change}</span>
                </div>
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
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 gradient-bg rounded-2xl shadow-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Recent Resumes</h2>
                    <p className="text-sm text-muted-foreground mt-1">Manage and edit your resume collection</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {resumes.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No resumes yet</h3>
                    <p className="mb-6">Create your first resume to get started on your career journey</p>
                    <Button onClick={() => setShowTemplates(true)} className="rounded-xl">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Resume
                    </Button>
                  </div>
                ) : (
                  resumes.slice(0, 3).map((resume, index) => (
                    <div key={resume.id} className="group relative overflow-hidden bg-accent/20 rounded-2xl border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center shadow-lg">
                              <FileText className="w-7 h-7 text-white" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="font-semibold text-foreground text-lg">{resume.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Modified {new Date(resume.updated_at).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{resume.template_name || 'Classic'}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-xs">
                                  {resume.template_name || 'Classic Template'}
                                </Badge>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  resume.is_public 
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                }`}>
                                  {resume.is_public ? 'Public' : 'Private'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button variant="outline" size="sm" className="rounded-xl">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-xl">
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <ActivityFeed />
        </div>
      </div>

      {/* Modals */}
      {showOnboarding && (
        <OnboardingFlow onClose={() => setShowOnboarding(false)} />
      )}
      
      {showTemplates && (
        <TemplateGallery onClose={() => setShowTemplates(false)} />
      )}
    </div>
  );
};

export default DashboardMain;