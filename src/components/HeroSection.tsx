import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Radar, Building2, MapPin, Search, FileText, Bell, BriefcaseBusiness, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const signal = {
  company: 'Northwind Logistics',
  trigger: 'Raised $42M Series B',
  when: '2 days ago',
  location: 'Austin, TX · Hybrid',
  roles: ['Operations Manager', 'Supply Chain Analyst', 'Regional Dispatch Lead'],
  confidence: 92,
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-border pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-12 lg:gap-16 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/60 text-[11px] font-semibold text-primary mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-signal" />
              CAREER OPPORTUNITY INTELLIGENCE
            </div>

            <h1 className="text-[2.75rem] sm:text-6xl lg:text-[4.2rem] font-bold text-foreground mb-6 text-balance">
              Find the opportunity <span className="text-primary">before the crowd.</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Discover companies preparing to hire, tailor your resume for the role, and walk into every application better prepared.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-7">
              <Button asChild size="lg" className="h-12 px-6 text-base font-semibold">
                <Link to="/auth">
                  Create free account
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base font-semibold">
                <Link to="/#pricing">See pricing</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {['No credit card required', 'Free resume + ATS scan included', 'Instant access'].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-lg border border-border bg-card shadow-card">
              <div className="flex h-[440px] sm:h-[480px]">
                <aside className="hidden sm:flex w-40 shrink-0 flex-col border-r border-border bg-secondary/35 p-3">
                  <div className="flex items-center gap-2 px-2 py-2 mb-5 font-semibold text-sm text-foreground">
                    <Radar className="w-4 h-4 text-primary" /> Vaylance
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 rounded-md bg-primary px-2.5 py-2 text-primary-foreground"><Radar className="w-3.5 h-3.5" /> Job Radar</div>
                    <div className="flex items-center gap-2 px-2.5 py-2 text-muted-foreground"><Search className="w-3.5 h-3.5" /> Application Tracker</div>
                    <div className="flex items-center gap-2 px-2.5 py-2 text-muted-foreground"><FileText className="w-3.5 h-3.5" /> Resume + ATS</div>
                    <div className="flex items-center gap-2 px-2.5 py-2 text-muted-foreground"><Target className="w-3.5 h-3.5" /> Interview Prep</div>
                  </div>
                  <div className="mt-auto rounded-md border border-border bg-card p-2.5">
                    <p className="text-[10px] font-semibold text-foreground">Weekly progress</p>
                    <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden"><div className="h-full w-3/4 bg-primary" /></div>
                  </div>
                </aside>

                <div className="min-w-0 flex-1 p-4 sm:p-5 bg-background/55">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[11px] text-muted-foreground">Good morning</p>
                      <h2 className="!text-lg !font-semibold font-body text-foreground">Your opportunity feed</h2>
                    </div>
                    <div className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center"><Bell className="w-4 h-4 text-muted-foreground" /></div>
                  </div>

                  <div className="rounded-lg bg-primary p-4 text-primary-foreground mb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div><p className="text-[11px] opacity-80 mb-1">JOB RADAR</p><p className="text-sm font-semibold">New companies match your goals</p></div>
                      <span className="tabular text-2xl font-semibold">12</span>
                    </div>
                    <Button asChild variant="secondary" size="sm" className="mt-4 h-8 text-xs"><Link to="/auth">View radar <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link></Button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[{ icon: Target, n: '94', l: 'ATS score' }, { icon: BriefcaseBusiness, n: '8', l: 'Applications' }, { icon: Sparkles, n: '3', l: 'Prep sessions' }].map((item) => {
                      const Icon = item.icon;
                      return <div key={item.l} className="rounded-md border border-border bg-card p-3"><Icon className="w-4 h-4 text-primary mb-3" /><p className="tabular text-xl font-semibold text-foreground">{item.n}</p><p className="text-[10px] text-muted-foreground mt-0.5">{item.l}</p></div>;
                    })}
                  </div>

                  <article className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5"><div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center"><Building2 className="w-4 h-4 text-primary" /></div><div><p className="text-xs font-semibold text-foreground">{signal.company}</p><p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{signal.location}</p></div></div>
                      <span className="rounded-full bg-signal-soft px-2 py-1 text-[10px] font-semibold text-signal">{signal.confidence}% match</span>
                    </div>
                    <div className="rounded-md bg-secondary/60 p-2.5 mb-3"><p className="text-[9px] text-muted-foreground mb-1">WHY NOW</p><p className="text-xs text-foreground">{signal.trigger} · {signal.when}</p></div>
                    <div className="flex flex-wrap gap-1.5">
                      {signal.roles.slice(0, 2).map((role) => <span key={role} className="rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground">{role}</span>)}
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-card/55">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="grid sm:grid-cols-3 gap-5 sm:gap-0 sm:divide-x divide-border mb-7">
            {[{ value: '12+', label: 'industries monitored' }, { value: 'Every 6h', label: 'signal scan cadence' }, { value: 'PDF + DOCX', label: 'resume formats supported' }].map((stat) => (
              <div key={stat.label} className="text-center px-4"><p className="text-xl font-semibold text-foreground">{stat.value}</p><p className="text-sm text-muted-foreground mt-1">{stat.label}</p></div>
            ))}
          </div>
          <p className="text-center text-xs font-semibold uppercase text-muted-foreground mb-4">Explore coverage by industry</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Technology', 'Healthcare', 'Finance', 'Logistics', 'Retail', 'Energy'].map((industry) => <Button key={industry} asChild variant="outline" size="sm" className="h-9 rounded-full text-sm"><Link to="/auth" aria-label={`Explore ${industry} opportunities`}>{industry}</Link></Button>)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
