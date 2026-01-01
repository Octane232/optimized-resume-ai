
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  ArrowRight, 
  Upload, 
  Target, 
  FileText, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface BriefingProps {
  setActiveTab: (tab: string) => void;
}

const Briefing = ({ setActiveTab }: BriefingProps) => {
  const [userName, setUserName] = useState<string>('');
  const [hasResume, setHasResume] = useState(false);
  const [vaultCompleteness, setVaultCompleteness] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [loading, setLoading] = useState(true);

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

      // Get application count
      const { count: appCount } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      setApplicationCount(appCount || 0);

      // Calculate vault completeness (simplified)
      let completeness = 0;
      if ((resumeCount || 0) > 0) completeness += 50;
      if (profile?.full_name) completeness += 25;
      // Could add more factors like skills, certifications etc.
      setVaultCompleteness(Math.min(completeness + 10, 100));

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-48 bg-muted rounded-2xl"></div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="h-32 bg-muted rounded-xl"></div>
          <div className="h-32 bg-muted rounded-xl"></div>
          <div className="h-32 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Hero Card - Mission Statement */}
      <div className="command-card p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10"></div>
        
        <div className="relative z-10">
          <p className="text-muted-foreground mb-2">Good {getTimeOfDay()}, {userName}</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {hasResume 
              ? "Your career command center is ready." 
              : "Welcome. Let's build your career command center."}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
            {hasResume 
              ? "Paste a job description to analyze your match, or track your applications in Mission Control."
              : "Start by uploading your master resume. This becomes the foundation for all your career insights."}
          </p>

          {/* Primary CTA */}
          <div className="flex flex-wrap gap-4">
            {!hasResume ? (
              <Button 
                size="lg" 
                className="saas-button h-12 px-8 text-base font-semibold"
                onClick={() => setActiveTab('vault')}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Master Resume
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="saas-button h-12 px-8 text-base font-semibold"
                  onClick={() => setActiveTab('resume-engine')}
                >
                  <Target className="w-5 h-5 mr-2" />
                  Analyze Job Match
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-12 px-8 text-base font-semibold"
                  onClick={() => setActiveTab('mission-control')}
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Track Applications
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Vault Status */}
        <div 
          className="command-card p-5 cursor-pointer group"
          onClick={() => setActiveTab('vault')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-electric to-blue-400 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">The Vault</h3>
          <p className="text-sm text-muted-foreground mb-3">Your career foundation</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Completeness</span>
              <span className={vaultCompleteness >= 75 ? 'text-emerald-500' : 'text-amber-500'}>
                {vaultCompleteness}%
              </span>
            </div>
            <Progress value={vaultCompleteness} className="h-2" />
          </div>
        </div>

        {/* Resume Engine Status */}
        <div 
          className="command-card p-5 cursor-pointer group"
          onClick={() => setActiveTab('resume-engine')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-400 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Resume Engine</h3>
          <p className="text-sm text-muted-foreground mb-3">Analyze job matches</p>
          <div className="flex items-center gap-2">
            {hasResume ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-emerald-500">Ready to analyze</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-amber-500">Upload resume first</span>
              </>
            )}
          </div>
        </div>

        {/* Mission Control Status */}
        <div 
          className="command-card p-5 cursor-pointer group"
          onClick={() => setActiveTab('mission-control')}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-400 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">Mission Control</h3>
          <p className="text-sm text-muted-foreground mb-3">Track applications</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">{applicationCount}</span>
            <span className="text-xs text-muted-foreground">applications tracked</span>
          </div>
        </div>
      </div>

      {/* Quick Actions / Next Steps */}
      {hasResume && (
        <div className="command-card p-6">
          <h3 className="font-semibold text-foreground mb-4">What to do next</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setActiveTab('resume-engine')}
              className="w-full flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Paste a job description</p>
                <p className="text-xs text-muted-foreground">See your match score and keyword gaps</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </button>
            
            <button 
              onClick={() => setActiveTab('vault')}
              className="w-full flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Strengthen your vault</p>
                <p className="text-xs text-muted-foreground">Add skills, certifications, and projects</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </button>
            
            <button 
              onClick={() => setActiveTab('mission-control')}
              className="w-full flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors text-left"
            >
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Track an application</p>
                <p className="text-xs text-muted-foreground">Never lose sight of where you've applied</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Briefing;
