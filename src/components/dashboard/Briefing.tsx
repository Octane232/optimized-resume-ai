
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Target, 
  FileText, 
  Briefcase,
  Lightbulb,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface BriefingProps {
  setActiveTab: (tab: string) => void;
}

// Daily tips for the mini-tip box
const DAILY_TIPS = [
  "Add measurable results to bullet points for better ATS match.",
  "Use action verbs at the start of each bullet point.",
  "Tailor your summary for each job application.",
  "Include industry-specific keywords from job descriptions.",
  "Quantify achievements: numbers catch recruiter attention.",
  "Keep your resume to 1-2 pages for most roles.",
  "List skills mentioned in the job description first.",
];

const Briefing = ({ setActiveTab }: BriefingProps) => {
  const [userName, setUserName] = useState<string>('');
  const [hasResume, setHasResume] = useState(false);
  const [resumeHealthScore, setResumeHealthScore] = useState(0);
  const [weeklyApplications, setWeeklyApplications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dailyTip] = useState(() => DAILY_TIPS[Math.floor(Math.random() * DAILY_TIPS.length)]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();
      
      if (profile?.full_name) {
        setUserName(profile.full_name.split(' ')[0]);
      } else {
        setUserName(user.email?.split('@')[0] || 'there');
      }

      // Check for resumes
      const { count: resumeCount } = await supabase
        .from('resumes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      setHasResume((resumeCount || 0) > 0);

      // Get resume health score from latest resume_scores
      const { data: scores } = await supabase
        .from('resume_scores')
        .select('overall_score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (scores && scores.length > 0) {
        setResumeHealthScore(scores[0].overall_score);
      } else if ((resumeCount || 0) > 0) {
        setResumeHealthScore(72); // Default score if resume exists but not analyzed
      }

      // Get weekly application count
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { count: weeklyCount } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('applied_date', oneWeekAgo.toISOString());
      
      setWeeklyApplications(weeklyCount || 0);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-48 bg-muted rounded-2xl"></div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="h-24 bg-muted rounded-xl"></div>
          <div className="h-24 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Hero Message */}
      <div className="command-card p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/5"></div>
        
        <div className="relative z-10">
          <p className="text-muted-foreground mb-1">Hey {userName},</p>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Today's mission: Improve your resume, apply to 3 roles, and stay on track.
          </h1>
          
          {/* Status Bar */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Resume Health</p>
                <p className="text-lg font-bold text-foreground">
                  {hasResume ? `${resumeHealthScore}%` : '—'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-electric/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-electric" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">This Week</p>
                <p className="text-lg font-bold text-foreground">{weeklyApplications}/10 applied</p>
              </div>
            </div>
          </div>

          {/* Priority Action Card */}
          <div className="bg-background/50 border border-border rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-electric flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Scan Job Description</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  See your match score and missing keywords instantly.
                </p>
                <Button 
                  className="saas-button h-11 px-6"
                  onClick={() => setActiveTab('resume-engine')}
                >
                  Scan Now
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards Row */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Vault Card */}
        <div 
          className="command-card p-5 cursor-pointer group hover:border-primary/30 transition-colors"
          onClick={() => setActiveTab('vault')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-electric to-blue-400 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">The Vault</h3>
          <p className="text-xs text-muted-foreground mb-3">Career foundation</p>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Completeness</span>
              <span className={hasResume ? 'text-emerald-500' : 'text-amber-500'}>
                {hasResume ? '60%' : '0%'}
              </span>
            </div>
            <Progress value={hasResume ? 60 : 0} className="h-1.5" />
          </div>
        </div>

        {/* Resume Engine Card */}
        <div 
          className="command-card p-5 cursor-pointer group hover:border-primary/30 transition-colors"
          onClick={() => setActiveTab('resume-engine')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">Resume Engine</h3>
          <p className="text-xs text-muted-foreground mb-3">Analyze job matches</p>
          <p className={`text-xs ${hasResume ? 'text-emerald-500' : 'text-amber-500'}`}>
            {hasResume ? '✓ Ready to analyze' : '⚠ Upload resume first'}
          </p>
        </div>

        {/* Mission Control Card */}
        <div 
          className="command-card p-5 cursor-pointer group hover:border-primary/30 transition-colors"
          onClick={() => setActiveTab('mission-control')}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-400 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">Mission Control</h3>
          <p className="text-xs text-muted-foreground mb-3">Track applications</p>
          <p className="text-xs text-foreground">
            <span className="text-lg font-bold">{weeklyApplications}</span>
            <span className="text-muted-foreground ml-1">this week</span>
          </p>
        </div>
      </div>

      {/* Mini-Tip Box */}
      <div className="command-card p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-amber-500" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm mb-1">Daily Tip</h4>
          <p className="text-sm text-muted-foreground">{dailyTip}</p>
        </div>
      </div>
    </div>
  );
};

export default Briefing;
