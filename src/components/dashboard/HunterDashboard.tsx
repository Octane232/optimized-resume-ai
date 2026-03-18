import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Coins
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import CareerStreak from './CareerStreak';
import UsageIndicator from './UsageIndicator';
import { useUsageLimit } from '@/contexts/UsageLimitContext';

// ===== Type Definitions =====
interface HunterDashboardProps {
  setActiveTab: (tab: string) => void;
}

interface Stats {
  applicationsThisWeek: number;
  weeklyGoal: number;
  pendingReplies: number;
  interviews: number;
}

interface ScoutJob {
  company: string;
  role: string;
  match: number;
  color: string;
  url?: string;
}

interface StaleApplication {
  company: string;
  jobTitle: string;
  daysSince: number;
}

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ElementType;
  bgClass: string;
  textClass: string;
}

// ===== Constants =====
const STAT_COLORS = [
  { bgClass: 'bg-primary/10', textClass: 'text-primary' },
  { bgClass: 'bg-amber-500/10', textClass: 'text-amber-500' },
  { bgClass: 'bg-orange-500/10', textClass: 'text-orange-500' },
  { bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-500' },
];

const SCOUT_COLORS = ['bg-blue-500', 'bg-green-500', 'bg-purple-500'];

// ===== Helper Functions =====
const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const getFirstName = (fullName: string): string => {
  return fullName.split(' ')[0];
};

const getInitials = (company: string): string => {
  return company.charAt(0).toUpperCase();
};

// ===== Main Component =====
const HunterDashboard: React.FC<HunterDashboardProps> = ({ setActiveTab }) => {
  // ===== Hooks =====
  const { getRemaining } = useUsageLimit();

  // ===== State =====
  const [userName, setUserName] = useState('');
  const [stats, setStats] = useState<Stats>({
    applicationsThisWeek: 2,
    weeklyGoal: 5,
    pendingReplies: 3,
    interviews: 1
  });
  const [scoutJobs, setScoutJobs] = useState<ScoutJob[]>([]);
  const [staleApplication, setStaleApplication] = useState<StaleApplication | null>(null);
  const [loading, setLoading] = useState(true);

  // ===== Derived Values =====
  const balance = getRemaining('resume_ats');
  const isLowCredits = balance <= 2;
  const applicationVelocity = Math.round((stats.applicationsThisWeek / stats.weeklyGoal) * 100);

  // ===== Effects =====
  useEffect(() => {
    fetchUserData();
    fetchScoutJobs();
  }, []);

  // ===== Data Fetching =====
  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profile?.full_name) {
        setUserName(getFirstName(profile.full_name));
      } else {
        setUserName(user.email?.split('@')[0] || 'there');
      }

      // Fetch applications
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
    } finally {
      setLoading(false);
    }
  };

  const fetchScoutJobs = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch radar alerts
      const { data: alerts } = await supabase
        .from('radar_alerts')
        .select('match_score, radar_signals(company_name, likely_roles, source_url)')
        .eq('user_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(3);

      if (alerts && alerts.length > 0) {
        setScoutJobs(alerts.map((alert: any, index: number) => ({
          company: alert.radar_signals?.company_name || 'Unknown',
          role: alert.radar_signals?.likely_roles?.[0] || 'Position',
          match: alert.match_score || 75,
          color: SCOUT_COLORS[index % SCOUT_COLORS.length],
          url: alert.radar_signals?.source_url
        })));
      }

      // Check for stale applications
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
    } catch (error) {
      console.error('Error fetching scout jobs:', error);
    }
  };

  // ===== Stat Cards Data =====
  const statCards: StatCard[] = [
    {
      label: 'Applications',
      value: stats.applicationsThisWeek,
      icon: Briefcase,
      bgClass: STAT_COLORS[0].bgClass,
      textClass: STAT_COLORS[0].textClass
    },
    {
      label: 'Weekly Goal',
      value: `${applicationVelocity}%`,
      icon: Zap,
      bgClass: STAT_COLORS[1].bgClass,
      textClass: STAT_COLORS[1].textClass
    },
    {
      label: 'Pending',
      value: stats.pendingReplies,
      icon: Clock,
      bgClass: STAT_COLORS[2].bgClass,
      textClass: STAT_COLORS[2].textClass
    },
    {
      label: 'Interviews',
      value: stats.interviews,
      icon: CheckCircle2,
      bgClass: STAT_COLORS[3].bgClass,
      textClass: STAT_COLORS[3].textClass
    }
  ];

  // ===== Render =====
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Greeting + Credit Badge Row */}
      <HeaderSection
        greeting={getGreeting()}
        userName={userName}
        balance={balance}
        isLowCredits={isLowCredits}
        onCreditClick={() => setActiveTab('billing')}
      />

      {/* Stats Row */}
      <StatsGrid stats={statCards} />

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Scout Report */}
        <ScoutReport
          scoutJobs={scoutJobs}
          onReviewMatches={() => setActiveTab('resume-engine')}
        />

        {/* Action Required */}
        <ActionRequired
          staleApplication={staleApplication}
          onViewApplication={() => setActiveTab('mission-control')}
          onViewAll={() => setActiveTab('mission-control')}
        />
      </div>

      {/* Weekly Progress */}
      <WeeklyProgress
        current={stats.applicationsThisWeek}
        goal={stats.weeklyGoal}
        velocity={applicationVelocity}
      />

      {/* Career Streak & Usage */}
      <div className="grid lg:grid-cols-2 gap-4">
        <CareerStreak compact />
        <UsageIndicator />
      </div>
    </div>
  );
};

// ===== Subcomponents =====

interface HeaderSectionProps {
  greeting: string;
  userName: string;
  balance: number;
  isLowCredits: boolean;
  onCreditClick: () => void;
}

const HeaderSection: React.FC<HeaderSectionProps> = ({
  greeting,
  userName,
  balance,
  isLowCredits,
  onCreditClick,
}) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
  >
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">
        {greeting}, {userName} 👋
      </h1>
      <p className="text-muted-foreground text-sm mt-1">
        Let's land that dream role today.
      </p>
    </div>

    {/* Credit Badge */}
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.15 }}
      onClick={onCreditClick}
      className={`
        flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all
        hover:shadow-md cursor-pointer shrink-0 self-start
        ${
          isLowCredits
            ? 'bg-destructive/5 border-destructive/20 text-destructive hover:bg-destructive/10'
            : 'bg-primary/5 border-primary/20 text-primary hover:bg-primary/10'
        }
      `}
    >
      <Coins className="w-4 h-4" />
      <span className="text-sm font-semibold">
        {balance} bundle{balance !== 1 ? 's' : ''} left
      </span>
      {isLowCredits && (
        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
          Low
        </Badge>
      )}
    </motion.button>
  </motion.div>
);

interface StatsGridProps {
  stats: StatCard[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="grid grid-cols-2 md:grid-cols-4 gap-3"
  >
    {stats.map((stat, index) => (
      <StatCard key={index} {...stat} />
    ))}
  </motion.div>
);

interface StatCardProps extends StatCard {}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  bgClass,
  textClass,
}) => (
  <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow bg-card">
    <CardContent className="p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${bgClass} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${textClass}`} />
      </div>
      <div>
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
);

interface ScoutReportProps {
  scoutJobs: ScoutJob[];
  onReviewMatches: () => void;
}

const ScoutReport: React.FC<ScoutReportProps> = ({ scoutJobs, onReviewMatches }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2 }}
  >
    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full">
      <div className="h-1 bg-gradient-to-r from-primary to-primary/40" />
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">Scout Report</h3>
              <p className="text-xs text-muted-foreground">
                {scoutJobs.length > 0 ? `${scoutJobs.length} high-match roles` : 'No matches yet'}
              </p>
            </div>
          </div>
          {scoutJobs.length > 0 && (
            <Badge className="bg-primary/10 text-primary border-0 text-xs font-medium">
              New
            </Badge>
          )}
        </div>

        {/* Scout Jobs List */}
        <ScoutJobsList jobs={scoutJobs} />

        {/* Review Button */}
        <Button onClick={onReviewMatches} className="w-full mt-4 gap-2" size="sm">
          <Sparkles className="w-3.5 h-3.5" />
          Review Matches
        </Button>
      </CardContent>
    </Card>
  </motion.div>
);

interface ScoutJobsListProps {
  jobs: ScoutJob[];
}

const ScoutJobsList: React.FC<ScoutJobsListProps> = ({ jobs }) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-6">
        <Target className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No scouted jobs yet</p>
        <p className="text-xs text-muted-foreground/70">Add jobs to Scout to see matches</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {jobs.map((job, index) => (
        <ScoutJobItem key={index} job={job} index={index} />
      ))}
    </div>
  );
};

interface ScoutJobItemProps {
  job: ScoutJob;
  index: number;
}

const ScoutJobItem: React.FC<ScoutJobItemProps> = ({ job, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 + index * 0.1 }}
    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
  >
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg ${job.color} flex items-center justify-center text-white text-xs font-bold`}>
        {getInitials(job.company)}
      </div>
      <div>
        <p className="font-medium text-sm text-foreground">{job.company}</p>
        <p className="text-xs text-muted-foreground">{job.role}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-emerald-500">{job.match}%</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </motion.div>
);

interface ActionRequiredProps {
  staleApplication: StaleApplication | null;
  onViewApplication: () => void;
  onViewAll: () => void;
}

const ActionRequired: React.FC<ActionRequiredProps> = ({
  staleApplication,
  onViewApplication,
  onViewAll,
}) => (
  <motion.div
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.25 }}
  >
    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow overflow-hidden h-full">
      <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-400" />
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Mail className="w-4.5 h-4.5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">Action Required</h3>
              <p className="text-xs text-muted-foreground">Follow-up needed</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {staleApplication ? (
          <StaleApplicationContent
            application={staleApplication}
            onViewApplication={onViewApplication}
            onViewAll={onViewAll}
          />
        ) : (
          <AllCaughtUp />
        )}
      </CardContent>
    </Card>
  </motion.div>
);

interface StaleApplicationContentProps {
  application: StaleApplication;
  onViewApplication: () => void;
  onViewAll: () => void;
}

const StaleApplicationContent: React.FC<StaleApplicationContentProps> = ({
  application,
  onViewApplication,
  onViewAll,
}) => (
  <>
    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
          {getInitials(application.company)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground">{application.company}</p>
          <p className="text-xs text-muted-foreground mb-1.5">
            No reply in {application.daysSince} days
          </p>
          <p className="text-xs text-muted-foreground/80 line-clamp-2">
            Consider sending a follow-up for your {application.jobTitle} application.
          </p>
        </div>
      </div>
    </div>

    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={onViewApplication}>
        <Mail className="w-3.5 h-3.5" />
        View Application
      </Button>
      <Button variant="ghost" size="sm" onClick={onViewAll} className="gap-1">
        View All
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </div>
  </>
);

const AllCaughtUp: React.FC = () => (
  <div className="text-center py-6">
    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
    <p className="text-sm font-medium text-foreground">All caught up!</p>
    <p className="text-xs text-muted-foreground">No pending follow-ups needed</p>
  </div>
);

interface WeeklyProgressProps {
  current: number;
  goal: number;
  velocity: number;
}

const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ current, goal, velocity }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
  >
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-sm text-foreground">Weekly Goal</span>
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {current} / {goal} applications
          </span>
        </div>

        <div className="h-2.5 bg-muted/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(velocity, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          {velocity >= 100
            ? "🎉 Goal achieved! Keep the momentum going."
            : `${goal - current} more to hit your target.`}
        </p>
      </CardContent>
    </Card>
  </motion.div>
);

export default HunterDashboard;
