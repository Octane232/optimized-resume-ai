import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { 
  Target, 
  Mail, 
  Building2, 
  ArrowRight, 
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Briefcase
} from 'lucide-react';

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

      // Fetch real application stats
      const { data: applications } = await supabase
        .from('job_applications')
        .select('status')
        .eq('user_id', user.id);

      if (applications) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
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

  const scoutJobs = [
    { company: 'Google', role: 'Senior Product Manager', match: 94, logo: '🔵' },
    { company: 'Spotify', role: 'Product Lead', match: 91, logo: '🟢' },
    { company: 'Stripe', role: 'Growth PM', match: 88, logo: '🟣' },
  ];

  const applicationVelocity = Math.round((stats.applicationsThisWeek / stats.weeklyGoal) * 100);

  return (
    <div className="p-6 space-y-6 pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-muted-foreground">
          Here's your morning briefing. Let's land that dream role.
        </p>
      </div>

      {/* Priority Cards Feed */}
      <div className="space-y-4">
        {/* Scout Report - Priority High */}
        <Card className="border-l-4 border-l-[hsl(217,100%,50%)] bg-gradient-to-r from-[hsl(217,100%,50%)]/5 to-transparent">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge className="bg-[hsl(217,100%,50%)] text-white">Priority High</Badge>
              <span className="text-xs text-muted-foreground">Just now</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[hsl(217,100%,50%)]/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-[hsl(217,100%,50%)]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">The Scout Report</h3>
                <p className="text-muted-foreground mb-4">
                  While you slept, I found <span className="font-semibold text-foreground">3 High-Match Roles (90%+)</span> at Google, Spotify, and Stripe.
                </p>
                
                <div className="space-y-2 mb-4">
                  {scoutJobs.map((job, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{job.logo}</span>
                        <div>
                          <p className="font-medium">{job.company}</p>
                          <p className="text-sm text-muted-foreground">{job.role}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                        {job.match}% Match
                      </Badge>
                    </div>
                  ))}
                </div>

                <Button onClick={() => setActiveTab('scout')} className="gap-2 bg-[hsl(217,100%,50%)] hover:bg-[hsl(217,100%,45%)]">
                  Review Matches
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Velocity */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Application Velocity</h3>
                <p className="text-muted-foreground mb-4">
                  You sent <span className="font-semibold text-foreground">{stats.applicationsThisWeek} applications</span> this week. Goal is {stats.weeklyGoal}.
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Weekly Progress</span>
                    <span className="font-medium">{stats.applicationsThisWeek}/{stats.weeklyGoal}</span>
                  </div>
                  <div className="relative">
                    <Progress value={applicationVelocity} className="h-3" />
                    <div 
                      className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-[hsl(217,100%,50%)] to-[hsl(217,100%,60%)]"
                      style={{ width: `${Math.min(applicationVelocity, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Control Snapshot */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Mission Control Alert</h3>
                <p className="text-muted-foreground mb-4">
                  Google hasn't replied in 5 days. I drafted a follow-up email for you.
                </p>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <Mail className="w-4 h-4" />
                    Review & Send
                  </Button>
                  <Button variant="ghost" onClick={() => setActiveTab('mission-control')}>
                    View All Applications
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[hsl(217,100%,50%)]/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-[hsl(217,100%,50%)]" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.applicationsThisWeek}</p>
                <p className="text-sm text-muted-foreground">Applications</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingReplies}</p>
                <p className="text-sm text-muted-foreground">Pending Replies</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.interviews}</p>
                <p className="text-sm text-muted-foreground">Interviews</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HunterDashboard;
