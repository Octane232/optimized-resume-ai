import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  Target, 
  Mail, 
  ArrowRight, 
  Clock,
  CheckCircle2,
  Briefcase,
  Zap,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import CareerStreak from './CareerStreak';
import UsageIndicator from './UsageIndicator';

interface HunterDashboardProps {
  setActiveTab: (tab: string) => void;
}

const HunterDashboard: React.FC<HunterDashboardProps> = ({ setActiveTab }) => {
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState({
    applicationsThisWeek: 2,
    weeklyGoal: 5,
    pendingReplies: 3,
    interviews: 1
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile?.full_name) {
        setUserName(profile.full_name.split(' ')[0]);
      } else {
        setUserName(user.email?.split('@')[0] || 'there');
      }

      const { data: applications } = await supabase
        .from('job_applications')
        .select('status')
        .eq('user_id', user.id);

      if (applications) {
        setStats({
          applicationsThisWeek: applications.length,
          weeklyGoal: 5,
          pendingReplies: applications.filter(a => a.status === 'applied').length,
          interviews: applications.filter(a => a.status === 'interviewing').length
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const [scoutJobs, setScoutJobs] = useState<Array<{ company: string; role: string; match: number; color: string; url?: string }>>([]);
  const [staleApplication, setStaleApplication] = useState<{ company: string; jobTitle: string; daysSince: number } | null>(null);

  useEffect(() => {
    const fetchScoutJobs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch scouted jobs
      const { data } = await supabase
        .from('scouted_jobs')
        .select('*')
        .eq('is_active', true)
        .limit(3)
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];
        // Calculate match score based on skills overlap with user vault
        const { data: vaultData } = await supabase
          .from('user_vault')
          .select('skills')
          .eq('user_id', user.id)
          .maybeSingle();
        
        const userSkills = (vaultData?.skills || []).map((s: string) => s.toLowerCase());
        
        setScoutJobs(data.map((job, i) => {
          const jobSkills = (job.skills || []).map((s: string) => s.toLowerCase());
          const matchingSkills = jobSkills.filter((s: string) => userSkills.includes(s));
          const matchScore = jobSkills.length > 0 
            ? Math.round((matchingSkills.length / jobSkills.length) * 100)
            : 75;
          
          return {
            company: job.company_name || 'Unknown',
            role: job.job_title || 'Position',
            match: Math.max(matchScore, 60), // Minimum 60% for display
            color: colors[i % colors.length],
            url: job.job_url
          };
        }));
      }

      // Fetch stale applications (applied > 5 days ago)
      const { data: applications } = await supabase
        .from('job_applications')
        .select('company_name, job_title, applied_date')
        .eq('user_id', user.id)
        .eq('status', 'applied')
        .order('applied_date', { ascending: true })
        .limit(1);

      if (applications && applications.length > 0) {
        const app = applications[0];
        const appliedDate = new Date(app.applied_date);
        const daysSince = Math.floor((Date.now() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSince >= 5) {
          setStaleApplication({
            company: app.company_name,
            jobTitle: app.job_title,
            daysSince
          });
        }
      }
    };
    fetchScoutJobs();
  }, []);

  const applicationVelocity = Math.round((stats.applicationsThisWeek / stats.weeklyGoal) * 100);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold mb-1">
          {getGreeting()}, {userName} 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Let's land that dream role today.
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
      >
        {[
          { label: 'Applications', value: stats.applicationsThisWeek, icon: Briefcase, color: 'text-primary' },
          { label: 'This Week', value: `${applicationVelocity}%`, icon: Zap, color: 'text-amber-500' },
          { label: 'Pending', value: stats.pendingReplies, icon: Clock, color: 'text-orange-500' },
          { label: 'Interviews', value: stats.interviews, icon: CheckCircle2, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm bg-card/50">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Scout Report */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary to-primary/50" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Scout Report</h3>
                    <p className="text-xs text-muted-foreground">{scoutJobs.length > 0 ? `${scoutJobs.length} high-match roles` : 'No matches yet'}</p>
                  </div>
                </div>
                <Badge className="bg-primary/10 text-primary border-0 text-xs">New</Badge>
              </div>
              
              <div className="space-y-2">
                {scoutJobs.map((job, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${job.color} flex items-center justify-center text-white text-xs font-bold`}>
                        {job.company[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{job.company}</p>
                        <p className="text-xs text-muted-foreground">{job.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-emerald-500">{job.match}%</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button 
                onClick={() => setActiveTab('resume-engine')} 
                className="w-full mt-4 bg-primary hover:bg-primary/90 gap-2"
                size="sm"
              >
                <Sparkles className="w-3 h-3" />
                Review Matches
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Required */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Action Required</h3>
                    <p className="text-xs text-muted-foreground">Follow-up needed</p>
                  </div>
                </div>
              </div>

              {staleApplication ? (
                <>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {staleApplication.company.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{staleApplication.company}</p>
                        <p className="text-xs text-muted-foreground mb-2">No reply in {staleApplication.daysSince} days</p>
                        <p className="text-xs text-muted-foreground/80 line-clamp-2">
                          Consider sending a follow-up for your {staleApplication.jobTitle} application.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-1.5"
                      onClick={() => setActiveTab('mission-control')}
                    >
                      <Mail className="w-3 h-3" />
                      View Application
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setActiveTab('mission-control')}
                      className="gap-1"
                    >
                      View All
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground">No pending follow-ups needed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Weekly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4"
      >
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-sm">Weekly Goal</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {stats.applicationsThisWeek} / {stats.weeklyGoal} applications
              </span>
            </div>
            <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(applicationVelocity, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {applicationVelocity >= 100 
                ? "🎉 Goal achieved! Keep the momentum going." 
                : `${stats.weeklyGoal - stats.applicationsThisWeek} more to hit your target.`}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Career Streak & Usage */}
      <div className="grid lg:grid-cols-2 gap-4 mt-4">
        <CareerStreak compact />
        <UsageIndicator />
      </div>
    </div>
  );
};

export default HunterDashboard;
