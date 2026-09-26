import React, { useState, useEffect } from 'react';
import {
  Telescope,
  FileText,
  Briefcase,
  Mic,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Sun,
  Lightbulb,
  Linkedin,
  Sparkles,
  Calendar,
} from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import { useUsageLimit } from '@/contexts/UsageLimitContext';
import { cn } from '@/lib/utils';
import { CompanyLogo } from '@/components/dashboard/CompanyLogo';
import { Button } from '@/components/ui/button';

interface HunterDashboardProps {
  setActiveTab: (tab: string) => void;
}

interface RadarOpportunity {
  id: string;
  company: string;
  companyDomain?: string | null;
  role: string;
  location: string;
  whyNow: string;
  signalAge: string;
  match: number;
  url?: string;
}

interface Stats {
  radarSignals: number;
  newSignals: number;
  applications: number;
  interviews: number;
  practiceSessions: number;
  resumeScore: number | null;
}

interface ChecklistItem {
  label: string;
  done: boolean;
  detail: string;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const formatDate = (): string =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const daysAgo = (date?: string | null): string => {
  if (!date) return 'new';
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);
  if (diff <= 0) return 'today';
  return `${diff}d`;
};

const HunterDashboard: React.FC<HunterDashboardProps> = ({ setActiveTab }) => {
  const { tier } = useUsageLimit();
  const isPaid = tier === 'trial' || tier === 'pro' || tier === 'elite';

  const [userName, setUserName] = useState('there');
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<RadarOpportunity[]>([]);
  const [stats, setStats] = useState<Stats>({
    radarSignals: 0,
    newSignals: 0,
    applications: 0,
    interviews: 0,
    resumeScore: null,
  });
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, prefsRes, resumesRes, appsRes, alertsRes] = await Promise.all([
        supabase.from('profiles').select('full_name, phone, location').eq('user_id', user.id).maybeSingle(),
        supabase.from('career_preferences').select('target_role').eq('user_id', user.id).maybeSingle(),
        supabase.from('resumes').select('id, ats_score, content, created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('job_applications').select('status').eq('user_id', user.id),
        supabase.from('radar_alerts').select('id, match_score, signal_id, is_read, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      ]);

      const profile: any = profileRes.data;
      const prefs: any = prefsRes.data;
      const resumes: any[] = resumesRes.data || [];
      const apps: any[] = appsRes.data || [];
      const alerts: any[] = alertsRes.data || [];

      setUserName(profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'there');

      const scoreOf = (r: any) => {
        const direct = typeof r?.ats_score === 'number' ? r.ats_score : null;
        if (direct !== null) return direct;
        const nested = r?.content?.ats_score;
        return typeof nested === 'number' ? nested : null;
      };
      const topScore = resumes.map(scoreOf).find((s) => s !== null) ?? null;

      setStats({
        radarSignals: alerts.length,
        newSignals: alerts.filter((a) => !a.is_read).length,
        applications: apps.length,
        interviews: apps.filter((a) => a.status === 'interviewing').length,
        resumeScore: topScore,
      });

      setChecklist([
        { label: 'Complete your profile', done: Boolean(profile?.full_name && profile?.location), detail: profile?.full_name && profile?.location ? 'Done' : 'Add name and location' },
        { label: 'Upload a resume', done: resumes.length > 0, detail: resumes.length > 0 ? `${resumes.length} saved` : 'Not yet' },
        { label: 'Set career preferences', done: Boolean(prefs?.target_role), detail: prefs?.target_role || 'Not set' },
        { label: 'Track 10 applications', done: apps.length >= 10, detail: `${apps.length}/10` },
        { label: 'Practise 2 interviews', done: apps.filter((a) => a.status === 'interviewing').length >= 2, detail: `${apps.filter((a) => a.status === 'interviewing').length}/2` },
      ]);

      // Resolve radar signals for the top alerts
      const signalIds = alerts.map((a) => a.signal_id).filter(Boolean).slice(0, 5);
      if (signalIds.length > 0) {
        const { data: signals } = await supabase
          .from('radar_signals')
          .select('id, company_name, company_domain, likely_roles, location, why_now, description, source_url, published_at')
          .in('id', signalIds);

        const map = new Map((signals || []).map((s: any) => [s.id, s]));
        setOpportunities(
          alerts.slice(0, 5).map((a) => {
            const s: any = map.get(a.signal_id);
            return {
              id: a.id,
              company: s?.company_name || 'New signal',
              companyDomain: s?.company_domain,
              role: s?.likely_roles?.[0] || 'Hiring soon',
              location: s?.location || 'Location pending',
              whyNow: s?.why_now || s?.description || 'Recent hiring signal detected',
              signalAge: daysAgo(s?.published_at || a.created_at),
              match: a.match_score || 0,
              url: s?.source_url,
            };
          })
        );
      }
    } catch (error) {
      console.error('Dashboard load failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const completed = checklist.filter((c) => c.done).length;
  const progress = checklist.length ? Math.round((completed / checklist.length) * 100) : 0;

  const statCards = [
    {
      label: 'Job Radar signals',
      caption: 'Matched to your goals',
      value: stats.radarSignals,
      note: stats.newSignals > 0 ? `${stats.newSignals} unread` : 'All reviewed',
      icon: Telescope,
      action: () => setActiveTab('scout'),
      actionLabel: 'View all',
    },
    {
      label: 'Applications',
      caption: 'In your pipeline',
      value: stats.applications,
      note: `${stats.interviews} interviewing`,
      icon: Briefcase,
      action: () => setActiveTab('mission-control'),
      actionLabel: 'View pipeline',
    },
    {
      label: 'Resume score',
      caption: 'Last analysed',
      value: stats.resumeScore !== null ? `${stats.resumeScore}` : '—',
      note: stats.resumeScore !== null ? 'out of 100' : 'Run your first scan',
      icon: FileText,
      action: () => setActiveTab('resume-engine'),
      actionLabel: 'View details',
    },
    {
      label: 'Interview prep',
      caption: 'Practice sessions',
      value: stats.interviews,
      note: 'Keep practising',
      icon: Mic,
      action: () => setActiveTab('interview-prep'),
      actionLabel: 'Start practice',
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-10 w-64 rounded-lg bg-muted animate-pulse" />
        <div className="h-40 rounded-lg bg-muted animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      {/* ===== Main column ===== */}
      <div className="space-y-6 min-w-0">
        {/* Greeting */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Sun className="w-6 h-6 text-primary mt-1.5 shrink-0" />
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-foreground">
                {getGreeting()}, {userName}
              </h1>
              <p className="text-[15px] text-muted-foreground mt-1">
                Here's what's happening with your career today.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {formatDate()}
          </div>
        </div>

        {/* Featured Job Radar banner */}
        <div className="rounded-lg bg-foreground text-background p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 min-w-0">
            <span className="inline-block rounded-full bg-background/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider">
              Featured
            </span>
            <h2 className="font-display text-3xl mt-3">Job Radar</h2>
            <p className="mt-2 text-[15px] text-background/75 max-w-md">
              Discover companies preparing to hire before they post the role publicly.
            </p>
            <Button
              onClick={() => setActiveTab('scout')}
              className="mt-5"
            >
              View radar
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-full md:w-72 space-y-2.5 shrink-0">
            {opportunities.slice(0, 2).map((o) => (
              <button
                key={o.id}
                onClick={() => setActiveTab('scout')}
                className="w-full text-left rounded-xl bg-background/10 border border-background/15 p-3 transition-colors hover:bg-background/15"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                    <CompanyLogo companyName={o.company} domain={o.companyDomain} className="h-7 w-7 border-background/20" />
                    <span className="truncate">{o.company}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-primary/25 px-2 py-0.5 text-[11px] font-semibold">
                    {o.match}% match
                  </span>
                </div>
                <p className="mt-1 text-xs text-background/70 truncate">
                  {o.role} · {o.signalAge}
                </p>
              </button>
            ))}
            {opportunities.length === 0 && (
              <div className="rounded-xl bg-background/10 border border-background/15 p-4 text-sm text-background/75">
                {isPaid
                  ? 'No signals yet. Run your first radar scan to see companies hiring early.'
                  : 'Upgrade to a paid plan to receive Job Radar signals.'}
              </div>
            )}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-lg border border-border bg-card p-4 flex flex-col">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">{card.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{card.caption}</p>
                  </div>
                </div>
                <p className="mt-4 text-3xl font-bold text-foreground tabular-nums">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.note}</p>
                <Button
                  variant="link"
                  onClick={card.action}
                  className="mt-3 h-auto justify-start p-0"
                >
                  {card.actionLabel}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Opportunities + progress */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          {/* Opportunities */}
          <div className="rounded-lg border border-border bg-card overflow-hidden min-w-0">
            <div className="flex items-center justify-between gap-3 p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Top Job Radar opportunities</h3>
              <button
                onClick={() => setActiveTab('scout')}
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline shrink-0"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {opportunities.length === 0 ? (
              <div className="p-8 text-center">
                <Telescope className="w-8 h-8 text-muted-foreground mx-auto" />
                <p className="mt-3 text-sm font-medium text-foreground">No signals yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isPaid
                    ? 'Set your career preferences, then run a radar scan.'
                    : 'A paid plan is required to run Job Radar scans.'}
                </p>
                <button
                  onClick={() => setActiveTab(isPaid ? 'scout' : 'billing')}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  {isPaid ? 'Open Job Radar' : 'See plans'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {opportunities.map((o) => (
                  <li key={o.id} className="p-4 flex flex-wrap items-start gap-3">
                    <CompanyLogo companyName={o.company} domain={o.companyDomain} className="h-9 w-9" />
                    <div className="flex-1 min-w-[180px]">
                      <p className="text-sm font-semibold text-foreground">{o.company}</p>
                      <p className="text-sm text-muted-foreground">{o.role}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{o.location}</p>
                      <p className="mt-2 text-[13px] text-foreground/80">{o.whyNow}</p>
                      <span className="mt-2 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        Hiring signal · {o.signalAge}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-primary tabular-nums">{o.match}%</span>
                      <button
                        onClick={() => setActiveTab('scout')}
                        className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        View
                      </button>
                      {o.url && (
                        <a
                          href={o.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          aria-label={`Open source article for ${o.company}`}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Career progress */}
          <div className="rounded-lg border border-border bg-card p-4 min-w-0">
            <h3 className="font-semibold text-foreground">Your career progress</h3>

            <div className="mt-4 flex items-center gap-4">
              <div
                className="h-20 w-20 shrink-0 rounded-full grid place-items-center"
                style={{
                  background: `conic-gradient(hsl(var(--primary)) ${progress * 3.6}deg, hsl(var(--muted)) 0deg)`,
                }}
              >
                <div className="h-14 w-14 rounded-full bg-card grid place-items-center text-lg font-bold text-foreground tabular-nums">
                  {progress}%
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">Setup complete</p>
                <p className="text-sm text-muted-foreground">
                  {completed} of {checklist.length} steps done.
                </p>
              </div>
            </div>

            <ul className="mt-4 space-y-2.5">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5">
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                  <span className={cn('flex-1 text-sm', item.done ? 'text-foreground' : 'text-muted-foreground')}>
                    {item.label}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">{item.detail}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-xl bg-muted/60 p-3 flex gap-2.5">
              <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Tip</p>
                <p className="text-[13px] text-muted-foreground mt-0.5">
                  Tailor your resume to each job description before applying. It usually lifts your ATS score noticeably.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Right rail ===== */}
      <aside className="space-y-4 min-w-0">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-semibold text-foreground">Quick actions</h3>
          <div className="mt-3 space-y-2">
            {[
              { label: 'Scan a resume', caption: 'Score it against a job description', icon: FileText, tab: 'resume-engine' },
              { label: 'Check Job Radar', caption: 'Companies hiring before jobs go public', icon: Briefcase, tab: 'scout' },
              { label: 'Practise an interview', caption: 'Role-specific questions with feedback', icon: Mic, tab: 'interview-prep' },
              { label: 'Improve LinkedIn', caption: 'Headline, About and keywords', icon: Linkedin, tab: 'linkedin' },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.label}
                  onClick={() => setActiveTab(a.tab)}
                  className="w-full flex items-start gap-3 rounded-xl border border-border p-3 text-left transition-colors hover:bg-muted"
                >
                  <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">{a.label}</span>
                    <span className="block text-xs text-muted-foreground">{a.caption}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {!isPaid && (
          <div className="rounded-lg bg-foreground text-background p-5">
            <span className="inline-block rounded-full bg-background/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider">
              Upgrade
            </span>
            <h3 className="font-display text-2xl mt-3">Unlock every tool</h3>
            <p className="mt-2 text-sm text-background/75">
              Paid plans include Job Radar alerts, resume scans, interview coaching and salary reports.
            </p>
            <button
              onClick={() => setActiveTab('billing')}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              View plans
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Need help?</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Read the guides or contact support and we will get back to you.
          </p>
          <button
            onClick={() => setActiveTab('help')}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Visit help centre
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </div>
  );
};

export default HunterDashboard;
