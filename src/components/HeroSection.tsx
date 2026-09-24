import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Radar, Building2, MapPin, Linkedin, FileText, ArrowDown } from 'lucide-react';
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
    <section className="relative border-b border-border pt-24 sm:pt-28 pb-12 sm:pb-20">
      <div className="absolute inset-0 -z-10 grid-texture opacity-[0.35]" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-border bg-secondary/60 text-[11px] font-semibold text-muted-foreground mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-signal" />
              Job Radar · live hiring signals
            </div>

            <h1 className="text-[2.15rem] leading-[1.1] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05] font-extrabold text-foreground tracking-tight mb-5">
              Reach companies before the job is posted
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-md mb-7 leading-relaxed">
              Vaylance tracks funding, expansion and hiring news, then tailors your
              resume to the roles those companies are about to open.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button asChild size="lg" className="h-12 px-6 text-base font-semibold">
                <Link to="/auth">
                  Start scanning
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base font-semibold">
                <Link to="/#pricing">See pricing</Link>
              </Button>
            </div>

            <dl className="grid grid-cols-3 gap-4 max-w-md border-t border-border pt-6">
              {[
                { v: '12+', l: 'Industries scanned' },
                { v: '6h', l: 'Scan interval' },
                { v: '50/30/20', l: 'ATS score model' },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="tabular text-xl font-semibold text-foreground">{s.v}</dt>
                  <dd className="text-xs text-muted-foreground mt-0.5">{s.l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right: real product evidence */}
          <div className="space-y-3">
            {/* Radar signal */}
            <article className="panel p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-md bg-secondary border border-border flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">{signal.company}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {signal.location}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-signal-soft border border-signal/30 text-[11px] font-semibold text-signal">
                  <Radar className="w-3 h-3" />
                  {signal.confidence}% match
                </span>
              </div>

              <div className="rounded-md border border-border bg-secondary/40 px-3 py-2.5 mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Why now
                </p>
                <p className="text-sm text-foreground">
                  {signal.trigger} · {signal.when}
                </p>
              </div>

              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Likely to open
              </p>
              <ul className="space-y-1.5 mb-4">
                {signal.roles.map((r) => (
                  <li key={r} className="flex items-center justify-between text-sm text-foreground/90">
                    <span>{r}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Linkedin className="w-3.5 h-3.5" />
                  Find hiring contact
                </span>
              </div>
            </article>

            <div className="flex justify-center">
              <ArrowDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            </div>

            {/* ATS follow-through */}
            <article className="panel p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-md bg-secondary border border-border flex items-center justify-center">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">Resume + ATS</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Tailored to Operations Manager</p>
                  </div>
                </div>
                <span className="tabular text-2xl font-bold text-signal">94</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { l: 'Semantic fit', w: 96, weight: '50%' },
                  { l: 'Skills & experience', w: 91, weight: '30%' },
                  { l: 'Exact ATS keywords', w: 88, weight: '20%' },
                ].map((b) => (
                  <div key={b.l}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        {b.l} <span className="tabular">({b.weight})</span>
                      </span>
                      <span className="tabular font-medium text-foreground">{b.w}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-signal" style={{ width: `${b.w}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
