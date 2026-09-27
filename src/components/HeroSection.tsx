import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Radar, Building2, MapPin, Search, FileText, Bell, Target, PlayCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const signals = [
  { company: 'Northwind Logistics', trigger: 'New distribution center announced', meta: 'Logistics · Manchester, UK · 2h ago', match: 92, level: 'High' },
  { company: 'Apex Energy', trigger: '$42M expansion funding round', meta: 'Energy · Houston, TX · 4h ago', match: 78, level: 'Medium' },
  { company: 'HealthPlus', trigger: 'New regional office opening', meta: 'Healthcare · Chicago, IL · 6h ago', match: 85, level: 'High' },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-border pt-24 sm:pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-20">
        <div className="grid lg:grid-cols-[0.92fr_1.08fr] gap-12 lg:gap-16 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-signal-soft text-[11px] font-semibold text-primary mb-6">
              <Radar className="w-3.5 h-3.5" />
              AI CAREER COACH
            </div>

            <h1 className="text-[2.6rem] sm:text-6xl lg:text-[4rem] leading-[1.05] font-bold text-foreground mb-6 text-balance">
              Know who's hiring <span className="italic text-primary">before</span> the job is posted.
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              Vaylance spots the business signals that come before hiring — funding, expansion, new contracts — and turns them into a plan you can act on.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-7">
              <Button asChild size="lg" className="h-12 px-6 text-base font-semibold">
                <Link to="/auth">
                  Explore Hiring Radar
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base font-semibold">
                <Link to="/#how-it-works">
                  <PlayCircle className="w-4 h-4 mr-1.5" />
                  See how it works
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {['Not another job board', 'Free forever plan, no card', 'Get ahead of the hiring cycle'].map((item) => (
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
                    <div className="flex items-center gap-2 rounded-md bg-primary px-2.5 py-2 text-primary-foreground"><Radar className="w-3.5 h-3.5" /> Hiring Radar</div>
                    <div className="flex items-center gap-2 px-2.5 py-2 text-muted-foreground"><FileText className="w-3.5 h-3.5" /> Resume + ATS</div>
                    <div className="flex items-center gap-2 px-2.5 py-2 text-muted-foreground"><Target className="w-3.5 h-3.5" /> Interview Coach</div>
                    <div className="flex items-center gap-2 px-2.5 py-2 text-muted-foreground"><Search className="w-3.5 h-3.5" /> Application Tracker</div>
                  </div>
                  <div className="mt-auto rounded-md border border-border bg-card p-2.5">
                    <p className="text-[10px] font-semibold text-foreground">Weekly progress</p>
                    <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden"><div className="h-full w-3/4 bg-primary" /></div>
                  </div>
                </aside>

                <div className="min-w-0 flex-1 p-4 sm:p-5 bg-background/55">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="!text-lg !font-semibold font-body text-foreground">Hiring Radar</h2>
                      <p className="text-[11px] text-muted-foreground">Companies showing signs of upcoming hiring</p>
                    </div>
                    <div className="w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center"><Bell className="w-4 h-4 text-muted-foreground" /></div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4 text-[10px]">
                    <span className="rounded-full bg-primary px-2.5 py-1 font-semibold text-primary-foreground">All signals 24</span>
                    <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">High match 8</span>
                    <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">New 12</span>
                    <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">Saved 6</span>
                  </div>

                  <div className="space-y-2.5">
                    {signals.map((s) => (
                      <article key={s.company} className="rounded-lg border border-border bg-card p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="w-8 h-8 shrink-0 rounded-md bg-signal-soft flex items-center justify-center"><Building2 className="w-4 h-4 text-primary" /></div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-semibold text-foreground truncate">{s.company}</p>
                                <span className="rounded-full bg-signal-soft px-1.5 py-0.5 text-[9px] font-semibold text-primary">{s.level}</span>
                              </div>
                              <p className="text-[11px] text-muted-foreground truncate">{s.trigger}</p>
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-2.5 h-2.5" />{s.meta}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="tabular text-sm font-semibold text-primary">{s.match}%</p>
                            <p className="text-[9px] text-muted-foreground">your match</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
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
