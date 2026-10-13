import React, { useState, useEffect } from 'react';
import { 
  Telescope, Search, MapPin, DollarSign, Clock, ExternalLink,
  Sparkles, Crown, Lock, Zap, TrendingUp, Rocket, Building2,
  Users, ArrowUpRight, RefreshCw, Bell, BellOff,
  Plus, Check, Copy, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useUsageLimit } from '@/contexts/UsageLimitContext';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { CompanyLogo } from '@/components/dashboard/CompanyLogo';
import { matchTextClass } from '@/lib/matchTier';

// ===== Types =====
interface RadarSignal {
  id: string;
  company_name: string;
  company_domain?: string | null;
  amount: string | null;
  funding_stage: string | null;
  industry: string | null;
  description: string | null;
  source_url: string;
  likely_roles: string[] | null;
  hiring_window: string | null;
  published_at: string | null;
  created_at: string | null;
  signal_type?: string | null;
  location?: string | null;
  company_size?: string | null;
  why_now?: string | null;
  outreach_angle?: string | null;
  departments?: string[] | null;
  confidence?: number | null;
  source_name?: string | null;
}

interface RadarAlert {
  id: string;
  signal_id: string;
  match_score: number;
  match_reasons: string[] | null;
  insight: string | null;
  is_read: boolean | null;
  created_at: string | null;
  radar_signals: RadarSignal;
}

// ===== Helper Functions =====
const getStageColor = (stage: string | null): string => {
  const stageLower = stage?.toLowerCase();
  const colorMap: Record<string, string> = {
    'seed': 'bg-primary/10 text-primary border-primary/20',
    'series a': 'bg-signal-soft text-signal border-signal/20',
    'series b': 'bg-secondary text-secondary-foreground border-border',
    'series c': 'bg-muted text-muted-foreground border-border',
  };
  return colorMap[stageLower || ''] || 'bg-muted text-muted-foreground';
};

const getMatchColor = (score: number): string => matchTextClass(score);

const filterSignals = (signals: any[], searchQuery: string): any[] => {
  if (!searchQuery) return signals;
  const q = searchQuery.toLowerCase();
  return signals.filter(s =>
    s.company_name?.toLowerCase().includes(q) ||
    s.industry?.toLowerCase().includes(q) ||
    s.location?.toLowerCase().includes(q) ||
    s.signal_type?.toLowerCase().includes(q) ||
    s.description?.toLowerCase().includes(q) ||
    s.departments?.some((d: string) => d.toLowerCase().includes(q)) ||
    s.likely_roles?.some((r: string) => r.toLowerCase().includes(q))
  );
};


// ===== Custom Hooks =====
const useRadarData = () => {
  const [alerts, setAlerts] = useState<RadarAlert[]>([]);
  const [signals, setSignals] = useState<RadarSignal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data, error } = await supabase.functions.invoke('radar-alerts', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      if (error) throw error;
      setAlerts(data.alerts || []);
      setSignals(data.signals || data.alerts?.map((a: any) => a.radar_signals).filter(Boolean) || []);
    } catch (error) {
      console.error('Error fetching radar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.functions.invoke('radar-mark-read', {
      body: { markAllRead: true },
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
    await fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { alerts, signals, loading, fetchData, markAllRead };
};

const useRadarScan = (onScanComplete: () => void) => {
  const { toast } = useToast();
  const { canUse, trackUsage, loading: usageLoading } = useUsageLimit();
  const [scanning, setScanning] = useState(false);

  const handleScan = async () => {
    if (!canUse('radar_alert')) {
      toast({
        title: 'Limit reached',
        description: 'You have used all your radar scans this period.',
        variant: 'destructive'
      });
      return;
    }

    setScanning(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in to run a radar scan.');

      const { data, error } = await supabase.functions.invoke('radar-scan', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      if (error) throw error;
      
      await trackUsage('radar_alert');
      
      toast({
        title: "Radar Scan Complete",
        description: `Scored ${data?.signalsMatched || data?.signalsExtracted || 0} signals. ${data?.alertsCreated || data?.alertsUpdated || 0} matched your preferences.`,
      });
      onScanComplete();
    } catch (error: any) {
      toast({ title: "Scan Failed", description: error.message || "Could not complete scan.", variant: "destructive" });
    } finally {
      setScanning(false);
    }
  };

  return { scanning, usageLoading, canScan: canUse('radar_alert'), handleScan };
};

const useCareerPreferences = () => {
  const [preferences, setPreferences] = useState<{
    target_role: string | null;
    target_industry: string | null;
    target_location: string | null;
    experience_level: string | null;
    work_style: string | null;
  } | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('career_preferences')
        .select('target_role, target_industry, target_location, experience_level, work_style')
        .eq('user_id', user.id)
        .maybeSingle();
      setPreferences(data ?? null);
    })();
  }, []);

  return preferences;
};

const FocusBanner: React.FC<{
  preferences: {
    target_role: string | null;
    target_industry: string | null;
    target_location: string | null;
    experience_level: string | null;
    work_style: string | null;
  } | null;
  onEdit: () => void;
}> = ({ preferences, onEdit }) => {
  const chips = [
    preferences?.target_role,
    preferences?.target_industry,
    preferences?.work_style,
    preferences?.target_location,
    preferences?.experience_level,
  ].filter(Boolean) as string[];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }}>
      <Card className="border-border bg-card">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Scanning for</span>
            {chips.length > 0 ? (
              chips.map((chip) => (
                <Badge key={chip} variant="secondary" className="text-xs">{chip}</Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">
                No career preferences set — the radar is scanning broadly.
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" onClick={onEdit} className="shrink-0">
            {chips.length > 0 ? 'Change focus' : 'Set preferences'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ===== Subcomponents =====
const HeaderSection: React.FC<{
  onMarkAllRead: () => void;
  onScan: () => void;
  scanning: boolean;
  usageLoading: boolean;
  canScan: boolean;
}> = ({ onMarkAllRead, onScan, scanning, usageLoading, canScan }) => (
  <motion.div 
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
  >
    <div className="flex items-center gap-3">
      <div className="p-2.5 rounded-lg bg-primary text-primary-foreground">
        <Telescope className="w-6 h-6" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Hidden Job Radar</h1>
        <p className="text-sm text-muted-foreground">Every industry. Every hiring signal. Before the job is posted.</p>
      </div>
    </div>
    
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onMarkAllRead}>
        Mark All Read
      </Button>
      <Button onClick={onScan} disabled={scanning || usageLoading || !canScan} className="gap-2">
        <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
        {scanning ? 'Scanning...' : 'Scan Now'}
      </Button>
    </div>
  </motion.div>
);

const ExplainerBanner: React.FC = () => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
    <Card className="border-primary/15 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">How it works</p>
            <p className="text-xs text-muted-foreground mt-1">
              The Radar scans news across <strong>every sector</strong> — healthcare, retail, construction, logistics,
              hospitality, manufacturing, energy, education, finance, public sector and tech — for events that create
              jobs: funding, expansions, new sites, contract wins, acquisitions and hiring announcements. You see who is
              about to hire, why, and what to say — <strong>before</strong> the role is advertised.
            </p>
          </div>

        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const ViewToggle: React.FC<{
  viewMode: 'alerts' | 'all';
  onViewChange: (mode: 'alerts' | 'all') => void;
  alertsCount: number;
  signalsCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}> = ({ viewMode, onViewChange, alertsCount, signalsCount, searchQuery, onSearchChange }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-3">
    <div className="flex rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => onViewChange('alerts')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          viewMode === 'alerts' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-background text-muted-foreground hover:bg-muted'
        }`}
      >
        <Bell className="w-3.5 h-3.5 inline mr-1.5" />
        My Alerts ({alertsCount})
      </button>
      <button
        onClick={() => onViewChange('all')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          viewMode === 'all' 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-background text-muted-foreground hover:bg-muted'
        }`}
      >
        All Signals ({signalsCount})
      </button>
    </div>
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input 
        placeholder="Search by company, industry, or role..." 
        className="pl-10 bg-muted/50"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  </motion.div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="border-0 shadow-sm animate-pulse">
        <CardContent className="p-5">
          <div className="h-6 bg-muted rounded w-1/3 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2 mb-4" />
          <div className="h-4 bg-muted rounded w-full" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const EmptyState: React.FC<{
  viewMode: 'alerts' | 'all';
  onScan: () => void;
  scanning: boolean;
  usageLoading: boolean;
  canScan: boolean;
}> = ({ viewMode, onScan, scanning, usageLoading, canScan }) => (
  <Card className="border-dashed">
    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-full bg-primary/10 mb-4">
        <Telescope className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {viewMode === 'alerts' ? 'No Alerts Yet' : 'No Signals Found'}
      </h3>
      <p className="text-muted-foreground max-w-md mb-4">
        {viewMode === 'alerts' 
          ? 'Set your target role and industry in Settings, then run a scan to get matched alerts.'
          : 'Click "Scan Now" to discover companies that just raised funding and are about to hire.'}
      </p>
      <Button onClick={onScan} disabled={scanning || usageLoading || !canScan} className="gap-2">
        <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
        Run First Scan
      </Button>
    </CardContent>
  </Card>
);

interface SignalCardProps {
  signal: RadarSignal;
  alert?: RadarAlert;
  index: number;
  targetRole?: string | null;
}

interface Opening {
  title: string;
  location: string | null;
  department: string | null;
  url: string;
}

interface OpeningsResult {
  status: 'company_site' | 'ats' | 'pre_market';
  provider?: string;
  board_url?: string;
  careers_url?: string;
  company_url?: string | null;
  jobs: Opening[];
}

const buildOutreachDraft = (s: RadarSignal, role?: string | null) => {
  const trigger = s.why_now || s.description || 'your recent growth';
  const roleLine = role || s.likely_roles?.[0] || 'a role on your team';
  const angle = s.outreach_angle ? `\n\n${s.outreach_angle}` : '';
  return `Hi [Name],

I saw the news about ${s.company_name}${s.amount ? ` (${[s.funding_stage, s.amount].filter(Boolean).join(' · ')})` : ''}: ${trigger.replace(/\.$/, '')}. Congratulations.

Teams usually grow fast after a move like this, and I'd love to be considered for ${roleLine} before it's posted publicly.${angle}

Would you be open to a 15-minute chat this week? I can share my resume and a few ideas on how I'd contribute.

Best,
[Your name]`;
};

const SignalCard: React.FC<SignalCardProps> = ({ signal, alert, index, targetRole }) => {
  const s = signal;
  const { toast } = useToast();
  const [openingsLoading, setOpeningsLoading] = useState(false);
  const [openings, setOpenings] = useState<OpeningsResult | null>(null);
  const [showOpenings, setShowOpenings] = useState(false);
  const [showOutreach, setShowOutreach] = useState(false);
  const [draft, setDraft] = useState(() => buildOutreachDraft(s, targetRole));
  const [tracking, setTracking] = useState(false);
  const [tracked, setTracked] = useState(false);
  const feedbackKey = `radar_feedback_${s.id}`;
  const [feedback, setFeedback] = useState<string | null>(() => localStorage.getItem(feedbackKey));

  useEffect(() => { setDraft(buildOutreachDraft(s, targetRole)); }, [targetRole, s.id]);

  const copyDraft = async () => {
    await navigator.clipboard.writeText(draft);
    toast({ title: 'Message copied', description: 'Paste it into LinkedIn or your email.' });
  };

  const saveFeedback = async (value: 'up' | 'down') => {
    localStorage.setItem(feedbackKey, value);
    setFeedback(value);
    if (value === 'down' && alert && !alert.is_read) {
      supabase.from('radar_alerts').update({ is_read: true }).eq('id', alert.id);
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('usage_events').insert({
        user_id: user.id,
        feature: 'radar_feedback',
        metadata: { signal_id: s.id, value, signal_type: s.signal_type, industry: s.industry },
      });
    }
    toast({ title: value === 'up' ? 'Thanks — marked useful' : "Got it — we'll show fewer like this" });
  };

  const addToMissionControl = async () => {
    setTracking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in again.');
      const { data: existing } = await supabase
        .from('job_applications').select('id')
        .eq('user_id', user.id).ilike('company_name', s.company_name).limit(1);
      if (existing?.length) { setTracked(true); toast({ title: 'Already in Mission Control' }); return; }
      const notes = [
        `Radar signal: ${s.signal_type || 'Hiring signal'}`,
        s.why_now && `Why now: ${s.why_now}`,
        s.outreach_angle && `Outreach angle: ${s.outreach_angle}`,
        alert && `Match: ${alert.match_score}%`,
      ].filter(Boolean).join('\n');
      const { error } = await supabase.from('job_applications').insert({
        user_id: user.id,
        company_name: s.company_name,
        job_title: targetRole || s.likely_roles?.[0] || 'Target role',
        job_url: s.source_url || null,
        location: s.location || null,
        notes,
        status: 'saved',
      });
      if (error) throw error;
      setTracked(true);
      toast({ title: 'Added to Mission Control', description: `${s.company_name} is now tracked as Saved.` });
    } catch (e) {
      toast({ title: "Couldn't add it", description: e instanceof Error ? e.message : 'Please try again.', variant: 'destructive' });
    } finally {
      setTracking(false);
    }
  };

  const ProofBadge = () => {
    if (!openings) return (
      <Badge variant="outline" className="text-xs font-normal">Postings not checked yet</Badge>
    );
    if (openings.status === 'ats' && openings.jobs.length) return (
      <Badge variant="outline" className="text-xs bg-muted text-foreground border-border">Already posted · {openings.jobs.length} open</Badge>
    );
    if (openings.status === 'company_site') return (
      <Badge variant="outline" className="text-xs font-normal">Careers page found</Badge>
    );
    return (
      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
        <Zap className="w-3 h-3 mr-1" /> Hiring signal · no posting yet
      </Badge>
    );
  };

  const companyUrl = s.company_domain
    ? `https://${s.company_domain.replace(/^www\./, '')}`
    : null;

  const findApplication = async () => {
    if (openings) {
      setShowOpenings((v) => !v);
      return;
    }
    setOpeningsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Please sign in again.');
      const { data, error } = await supabase.functions.invoke('find-openings', {
        body: { company_name: s.company_name, company_domain: s.company_domain },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (error) throw error;
      const result = data as OpeningsResult;
      setOpenings(result);
      setShowOpenings(true);
      if (result.status === 'company_site' && result.careers_url) {
        window.open(result.careers_url, '_blank');
      }
    } catch (e) {
      toast({
        title: "Couldn't check openings",
        description: e instanceof Error ? e.message : 'Please try again in a moment.',
        variant: 'destructive',
      });
    } finally {
      setOpeningsLoading(false);
    }
  };

  const ApplicationPanel = () => {
    if (!openings || !showOpenings) return null;

    if (openings.status === 'company_site') {
      return (
        <div className="mt-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
          <p className="text-sm text-foreground mb-2">
            Applications are handled on their own careers page.
          </p>
          <Button size="sm" className="gap-2" onClick={() => window.open(openings.careers_url, '_blank')}>
            <ExternalLink className="w-3.5 h-3.5" />
            Open careers page
          </Button>
        </div>
      );
    }

    if (openings.status === 'ats') {
      return (
        <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-xs font-semibold text-primary mb-2">
            {openings.jobs.length} open position{openings.jobs.length === 1 ? '' : 's'}
            {openings.provider ? ` · via ${openings.provider}` : ''}
          </p>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {openings.jobs.map((job, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-md bg-background border border-border px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{job.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {[job.location, job.department].filter(Boolean).join(' · ') || 'See listing'}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 gap-1.5"
                  onClick={() => window.open(job.url, '_blank')}
                >
                  Apply
                  <ArrowUpRight className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-3 p-3 rounded-lg border border-border bg-muted/30">
        <p className="text-sm text-foreground">
          No public application posted yet — you're early. Message the hiring lead using your outreach
          angle before this goes public.
        </p>
      </div>
    );
  };
  
  
  const MetaInfo = () => (
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
      {s.industry && (
        <span className="flex items-center gap-1">
          <Building2 className="w-3 h-3" />
          {s.industry}
        </span>
      )}
      {s.location && (
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {s.location}
        </span>
      )}
      {s.company_size && (
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {s.company_size}
        </span>
      )}
      {s.hiring_window && (
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Hiring: {s.hiring_window}
        </span>
      )}
      {s.published_at && (
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {new Date(s.published_at).toLocaleDateString()}
          {s.source_name ? ` · ${s.source_name}` : ''}
        </span>
      )}
    </div>
  );

  const WhyNow = () => {
    if (!s.why_now) return null;
    return (
      <div className="mb-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-xs font-semibold text-amber-600 mb-0.5 flex items-center gap-1">
          <Zap className="w-3 h-3" /> Why they're hiring now
        </p>
        <p className="text-sm text-foreground">{s.why_now}</p>
      </div>
    );
  };

  const Departments = () => {
    if (!s.departments?.length) return null;
    return (
      <div className="flex flex-wrap gap-1.5 mb-2">
        <span className="text-xs text-muted-foreground mr-1 py-0.5">Departments:</span>
        {s.departments.map((d: string, i: number) => (
          <Badge key={i} variant="outline" className="text-xs font-normal">
            {d}
          </Badge>
        ))}
      </div>
    );
  };

  const OutreachAngle = () => {
    if (!s.outreach_angle) return null;
    return (
      <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-xs font-semibold text-primary mb-0.5 flex items-center gap-1">
          <Rocket className="w-3 h-3" /> Your outreach angle
        </p>
        <p className="text-sm text-foreground">{s.outreach_angle}</p>
      </div>
    );
  };

  const LikelyRoles = () => {
    if (!s.likely_roles?.length) return null;
    return (
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-xs text-muted-foreground mr-1 py-0.5">Likely hiring:</span>
        {s.likely_roles.map((role: string, i: number) => (
          <Badge key={i} variant="secondary" className="text-xs font-normal bg-muted/50">
            {role}
          </Badge>
        ))}
      </div>
    );
  };


  const AlertInsight = () => {
    if (!alert?.insight) return null;
    return (
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-sm text-foreground">
        <Sparkles className="w-3.5 h-3.5 inline mr-1.5 text-primary" />
        {alert.insight}
      </div>
    );
  };

  const MatchReasons = () => {
    if (!alert?.match_reasons?.length) return null;
    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {alert.match_reasons.map((reason: string, i: number) => (
          <Badge key={i} variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
            ✓ {reason}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      key={s.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.05 }}
    >
      <Card className="border-border transition-colors hover:border-primary/35 group">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <CompanyLogo
              companyName={s.company_name}
              domain={s.company_domain}
              className="h-12 w-12 rounded-xl"
              imageClassName="rounded-xl"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors flex flex-wrap items-center gap-2">
                    {companyUrl ? (
                      <a
                        href={companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-primary hover:underline"
                      >
                        {s.company_name}
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    ) : (
                      s.company_name
                    )}
                    {s.signal_type && (
                      <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                        {s.signal_type}
                      </Badge>
                    )}
                    {s.kind && (
                      <Badge variant="outline" className="text-xs">
                        {s.kind === 'posting' ? 'Open vacancy' : 'Early lead'}
                      </Badge>
                    )}
                    {s.workplace_type?.startsWith('remote') && (
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                        {s.workplace_type === 'remote_worldwide' ? 'Remote · Worldwide' : `Remote · ${s.remote_region || 'Regional'}`}
                      </Badge>
                    )}
                    {s.trust_tier === 'high' && (
                      <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">Verified employer</Badge>
                    )}
                    {s.sector && (
                      <Badge variant="secondary" className="text-xs">{s.sector}</Badge>
                    )}
                    {s.amount && (
                      <Badge variant="outline" className={`${getStageColor(s.funding_stage)} text-xs`}>
                        {[s.funding_stage, s.amount].filter(Boolean).join(' · ')}
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
                </div>

                {alert && (
                  <div className={`text-right shrink-0 ${getMatchColor(alert.match_score)}`}>
                    <div className="text-2xl font-bold">{alert.match_score}%</div>
                    <div className="text-xs">match</div>
                  </div>
                )}
              </div>

              <MetaInfo />
              <WhyNow />
              <LikelyRoles />
              <Departments />
              <AlertInsight />
              <MatchReasons />
              <OutreachAngle />

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  className="gap-2"
                  disabled={openingsLoading}
                  onClick={findApplication}
                >
                  {openingsLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  {openings
                    ? showOpenings
                      ? 'Hide application'
                      : 'Show application'
                    : 'Find application'}
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowOutreach(true)}>
                  <Rocket className="w-3.5 h-3.5" />
                  Draft Outreach
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  disabled={tracked || tracking}
                  onClick={addToMissionControl}
                >
                  {tracked ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {tracked ? 'In Mission Control' : 'Add to Mission Control'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => window.open(`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${s.company_name} recruiter`)}`, '_blank')}
                >
                  <Users className="w-3.5 h-3.5" />
                  Hiring Contact
                </Button>
                {typeof s.confidence === 'number' && (
                  <Badge variant="secondary" className="text-xs">
                    {s.confidence}% signal confidence
                  </Badge>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <ProofBadge />
                  {s.source_url && (
                    <a href={s.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-primary hover:underline">
                      <ArrowUpRight className="w-3 h-3" />
                      Source: {s.source_name || 'article'}
                      {s.published_at ? ` · ${new Date(s.published_at).toLocaleDateString()}` : ''}
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground mr-1">Useful?</span>
                  <Button
                    size="icon" variant={feedback === 'up' ? 'default' : 'ghost'} className="h-7 w-7"
                    aria-label="Useful signal" onClick={() => saveFeedback('up')}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    size="icon" variant={feedback === 'down' ? 'secondary' : 'ghost'} className="h-7 w-7"
                    aria-label="Not useful signal" onClick={() => saveFeedback('down')}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <ApplicationPanel />

              <Dialog open={showOutreach} onOpenChange={setShowOutreach}>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Outreach to {s.company_name}</DialogTitle>
                  </DialogHeader>
                  <p className="text-xs text-muted-foreground">Edit it, then copy into LinkedIn or email.</p>
                  <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={11} className="text-sm" />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(`https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(`${s.company_name} hiring manager`)}`, '_blank')}>
                      Find on LinkedIn
                    </Button>
                    <Button size="sm" className="gap-2" onClick={copyDraft}>
                      <Copy className="w-3.5 h-3.5" /> Copy message
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>



            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface LockedTeaserProps {
  lockedCount: number;
  onUpgradeClick: () => void;
}

// PROBLEM 3 FIXED: Added onUpgradeClick prop
const LockedTeaser: React.FC<LockedTeaserProps> = ({ lockedCount, onUpgradeClick }) => (
  <Card className="border-dashed border-primary/30 bg-primary/5">
    <CardContent className="p-6 text-center">
      <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
      <h3 className="font-semibold text-lg mb-2">+{lockedCount} More Signals</h3>
      <p className="text-sm text-muted-foreground mb-4">Upgrade to see all funding signals and get matched alerts.</p>
      <Button 
        className="gap-2"
        onClick={onUpgradeClick}
      >
        <Crown className="w-4 h-4" />
        {/* PROBLEM 2 FIXED: Changed button text */}
        Upgrade to Unlock
      </Button>
    </CardContent>
  </Card>
);

interface SignalsListProps {
  signals: any[];
  loading: boolean;
  viewMode: 'alerts' | 'all';
  onScan: () => void;
  scanning: boolean;
  usageLoading: boolean;
  canScan: boolean;
  tier: string;
  onUpgradeClick: () => void;
  targetRole?: string | null;
}

const SignalsList: React.FC<SignalsListProps> = ({ 
  signals, 
  loading, 
  viewMode, 
  onScan, 
  scanning, 
  usageLoading, 
  canScan, 
  tier,
  onUpgradeClick,
  targetRole
}) => {
  const hasFullAccess = tier === 'trial' || tier === 'pro' || tier === 'elite';
  const visibleSignals = hasFullAccess ? signals : signals.slice(0, 3);
  const lockedCount = signals.length - visibleSignals.length;

  if (loading) return <LoadingSkeleton />;
  if (signals.length === 0) {
    return <EmptyState viewMode={viewMode} onScan={onScan} scanning={scanning} usageLoading={usageLoading} canScan={canScan} />;
  }

  return (
    <div className="space-y-4">
      {visibleSignals.map((signal: any, index) => (
        <SignalCard
          key={signal.id}
          signal={signal.radar_signals || signal}
          alert={signal.alert || null}
          index={index}
          targetRole={targetRole}
        />
      ))}
      {lockedCount > 0 && <LockedTeaser lockedCount={lockedCount} onUpgradeClick={onUpgradeClick} />}
    </div>
  );
};

// ===== Main Component =====
interface ScoutProps {
  setActiveTab?: (tab: string) => void;
}

const Scout: React.FC<ScoutProps> = ({ setActiveTab }) => {
  const { tier } = useUsageLimit();
  const { alerts, signals, loading, fetchData, markAllRead } = useRadarData();
  const { scanning, usageLoading, canScan, handleScan } = useRadarScan(fetchData);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'alerts' | 'all'>('alerts');
  const [scope, setScope] = useState<'all' | 'remote' | 'public' | 'local'>('all');
  const preferences = useCareerPreferences();

  const handleUpgradeClick = () => {
    if (setActiveTab) {
      setActiveTab('billing');
    }
  };

  const getDisplaySignals = (): any[] => {
    const baseSignals = viewMode === 'alerts' 
      ? alerts.map(a => ({ ...a.radar_signals, alert: a }))
      : signals;

    const scoped = baseSignals.filter((s: any) => {
      const wt = s?.workplace_type || 'onsite';
      if (scope === 'remote') return wt.startsWith('remote') && s?.trust_tier === 'high';
      if (scope === 'local') return !wt.startsWith('remote');
      if (scope === 'public') return /education|healthcare|public/i.test(`${s?.sector || ''} ${s?.industry || ''}`);
      return true;
    });
    return filterSignals(scoped, searchQuery);
  };

  const displaySignals = getDisplaySignals();
  const alertsCount = alerts.length;
  const signalsCount = signals.length;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <HeaderSection 
        onMarkAllRead={markAllRead}
        onScan={handleScan}
        scanning={scanning}
        usageLoading={usageLoading}
        canScan={canScan}
      />
      
      <FocusBanner preferences={preferences} onEdit={() => setActiveTab?.('settings')} />

      <ExplainerBanner />
      
      <ViewToggle
        viewMode={viewMode}
        onViewChange={setViewMode}
        alertsCount={alertsCount}
        signalsCount={signalsCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter opportunities">
        {([
          ['all', 'All'],
          ['remote', 'Verified remote'],
          ['public', 'Schools, health & public sector'],
          ['local', 'Local / on-site'],
        ] as const).map(([key, label]) => (
          <Button
            key={key}
            role="tab"
            aria-selected={scope === key}
            size="sm"
            variant={scope === key ? 'default' : 'outline'}
            onClick={() => setScope(key)}
          >
            {label}
          </Button>
        ))}
      </div>
      
      <SignalsList
        signals={displaySignals}
        loading={loading}
        viewMode={viewMode}
        onScan={handleScan}
        scanning={scanning}
        usageLoading={usageLoading}
        canScan={canScan}
        tier={tier}
        targetRole={preferences?.target_role}
        onUpgradeClick={handleUpgradeClick}
      />
    </div>
  );
};

export default Scout;
