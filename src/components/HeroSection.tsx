import React from 'react';
import { Link } from 'react-router-dom';
import { Play, CheckCircle, Search, Bell, User, Briefcase, FileText, PenTool, Mic, BarChart3, Settings, Layers, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sidebarItems = [
  { icon: Layers, label: 'Dashboard', active: true },
  { icon: Briefcase, label: 'Job Matches' },
  { icon: FileText, label: 'Applications' },
  { icon: PenTool, label: 'Resume Builder' },
  { icon: FileText, label: 'AI Cover Letter' },
  { icon: Mic, label: 'Interview Coach' },
  { icon: BarChart3, label: 'Analytics' },
  { icon: Sparkles, label: 'Saved Items' },
  { icon: Settings, label: 'Settings' },
];

const jobMatches = [
  { initial: 'S', company: 'Senior Product Designer', sub: 'Linear', location: 'Remote', match: '95%', tone: 'from-blue-500 to-blue-600' },
  { initial: 'P', company: 'Product Designer', sub: '', location: 'Remote', match: '92%', tone: 'from-violet-500 to-violet-600' },
  { initial: 'S', company: 'UI/UX Designer', sub: 'Stripe', location: 'New York, NY', match: '90%', tone: 'from-emerald-500 to-emerald-600' },
];

const HeroSection = () => {
  return (
    <section className="relative pt-28 pb-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-violet-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur text-xs font-semibold text-muted-foreground mb-6">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              AI-Powered Job Search
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.05] mb-6">
              Land your next job{' '}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                faster
              </span>
              {' '}with AI
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Vaylance helps you create the perfect resume, find matching jobs,
              and apply with AI — so you can get hired faster.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button asChild size="lg" className="h-12 px-7 font-semibold text-base bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-xl shadow-blue-600/30">
                <Link to="/auth">Get Started Free →</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-7 font-semibold text-base border-border bg-card/30 hover:bg-card text-foreground">
                <Link to="/auth">
                  <Play className="w-4 h-4 mr-1 fill-current" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> No credit card required</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Cancel anytime</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Loved by 10,000+ users</span>
            </div>
          </div>

          {/* Right: dashboard mockup */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/30 via-violet-600/20 to-fuchsia-600/30 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl border border-border/80 bg-card shadow-2xl overflow-hidden">
              {/* Topbar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-card">
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M4 6 L16 28 L28 6" stroke="url(#vh)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/><defs><linearGradient id="vh" x1="0" y1="0" x2="32" y2="32"><stop stopColor="hsl(217 91% 65%)"/><stop offset="1" stopColor="hsl(262 83% 65%)"/></linearGradient></defs></svg>
                  <span className="text-xs font-bold text-foreground">Vaylance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-muted-foreground" />
                  <Bell className="w-3.5 h-3.5 text-muted-foreground" />
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center"><User className="w-3 h-3 text-white" /></div>
                </div>
              </div>

              <div className="flex">
                {/* Sidebar */}
                <div className="w-36 border-r border-border/60 bg-background/50 p-2 space-y-0.5 hidden sm:block">
                  {sidebarItems.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] ${item.active ? 'bg-primary/15 text-primary font-semibold' : 'text-muted-foreground'}`}>
                        <Icon className="w-3 h-3" />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Content */}
                <div className="flex-1 p-3 space-y-3">
                  <div>
                    <p className="text-[11px] font-bold text-foreground">Good morning, Alex 👋</p>
                    <p className="text-[9px] text-muted-foreground">Here's your job search overview</p>
                  </div>

                  {/* Stat tiles */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { label: 'Job Matches', value: '128', chg: '+24 this week' },
                      { label: 'Applications', value: '32', chg: '+12 this week' },
                      { label: 'Interview Calls', value: '8', chg: 'this week' },
                      { label: 'Profile Score', value: '85%', chg: '+15% improv' },
                    ].map((s, i) => (
                      <div key={i} className="rounded-md border border-border/60 bg-background/40 p-1.5">
                        <p className="text-[7px] text-muted-foreground">{s.label}</p>
                        <p className="text-sm font-bold text-foreground">{s.value}</p>
                        <p className="text-[6px] text-emerald-400">{s.chg}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Top job matches */}
                    <div className="col-span-2 rounded-md border border-border/60 bg-background/40 p-2">
                      <p className="text-[9px] font-bold text-foreground mb-1.5">Top Job Matches</p>
                      <div className="space-y-1">
                        {jobMatches.map((j, i) => (
                          <div key={i} className="flex items-center gap-1.5 p-1 rounded bg-card/60">
                            <div className={`w-5 h-5 rounded bg-gradient-to-br ${j.tone} flex items-center justify-center text-[8px] font-bold text-white`}>{j.initial}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[8px] font-semibold text-foreground truncate">{j.company}</p>
                              <p className="text-[6px] text-muted-foreground">{j.location}</p>
                            </div>
                            <span className="text-[7px] font-bold text-emerald-400">{j.match} match</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[7px] text-primary mt-1 font-semibold">View all matches →</p>
                    </div>

                    {/* Profile strength */}
                    <div className="rounded-md border border-border/60 bg-background/40 p-2">
                      <p className="text-[9px] font-bold text-foreground mb-1">Profile Strength</p>
                      <div className="relative w-12 h-12 mx-auto mb-1">
                        <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
                          <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3"/>
                          <circle cx="18" cy="18" r="15" fill="none" stroke="url(#pg)" strokeWidth="3" strokeDasharray="80 100" strokeLinecap="round"/>
                          <defs><linearGradient id="pg" x1="0" y1="0" x2="36" y2="36"><stop stopColor="#60a5fa"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-[10px] font-bold text-foreground">85%</span>
                          <span className="text-[5px] text-muted-foreground">Excellent</span>
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        {['Resume', 'Skills', 'Experience', 'Keywords'].map((s) => (
                          <div key={s} className="flex items-center gap-1 text-[6px] text-muted-foreground">
                            <CheckCircle className="w-1.5 h-1.5 text-emerald-400" />{s}
                          </div>
                        ))}
                      </div>
                      <button className="mt-1 w-full rounded text-[6px] font-semibold py-1 bg-gradient-to-r from-blue-600 to-violet-600 text-white">Improve Score</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
