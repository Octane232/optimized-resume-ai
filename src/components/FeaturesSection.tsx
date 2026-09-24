import React from 'react';
import { Radar, FileText, Mic, DollarSign, Linkedin, Search, TrendingUp } from 'lucide-react';

const supporting = [
  { icon: Mic, title: 'Interview Prep', desc: 'Technical, behavioural and situational rounds with scored feedback.' },
  { icon: DollarSign, title: 'Salary Intelligence', desc: 'Market benchmarks plus a negotiation script for your offer.' },
  { icon: Linkedin, title: 'LinkedIn Optimizer', desc: 'Headline and summary rewritten for recruiter search.' },
  { icon: Search, title: 'Job Search', desc: 'Live listings filtered by role, location and work style.' },
  { icon: TrendingUp, title: 'Skill Gap Analyzer', desc: 'What you are missing for a target role, and how to close it.' },
];

const FeaturesSection = () => (
  <section className="py-14 sm:py-20 border-b border-border">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mb-10 sm:mb-12">
        <h2 className="text-[26px] leading-tight sm:text-4xl font-bold text-foreground tracking-tight mb-3">
          Two tools do the heavy lifting
        </h2>
        <p className="text-muted-foreground text-base">
          Everything else supports the same loop: find the opening early, then arrive better prepared than the queue.
        </p>
      </div>

      {/* Anchor pair */}
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <article className="panel panel-hover p-6 sm:p-7 bg-secondary/30">
          <div className="flex items-center gap-2 mb-4">
            <Radar className="w-5 h-5 text-signal" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-signal">Flagship</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Job Radar</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            Scans funding rounds, expansions, leadership hires and major contracts across healthcare,
            logistics, retail, energy, tech and more — then tells you which roles are about to open.
          </p>
          <ul className="space-y-2 text-sm text-foreground/85">
            {['Why the company is hiring now', 'Likely roles and seniority', 'A specific outreach angle', 'Direct link to the hiring contact'].map((i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-signal shrink-0" />
                {i}
              </li>
            ))}
          </ul>
        </article>

        <article className="panel panel-hover p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Core</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Resume + ATS</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            Upload a PDF or Word file and get one honest score: half semantic meaning,
            a third skills and experience overlap, the rest exact keyword matching.
          </p>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { v: '50%', l: 'Semantic' },
              { v: '30%', l: 'Overlap' },
              { v: '20%', l: 'Keywords' },
            ].map((s) => (
              <div key={s.l} className="rounded-md border border-border bg-secondary/40 px-3 py-2.5">
                <p className="tabular text-lg font-semibold text-foreground">{s.v}</p>
                <p className="text-[11px] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-foreground/85">
            The rewrite edits your own Word document in place — your fonts, margins and layout stay exactly as they were.
          </p>
        </article>
      </div>

      {/* Supporting row */}
      <div className="panel divide-y divide-border sm:divide-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:divide-x">
        {supporting.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="p-5 sm:border-b sm:border-border last:border-b-0">
              <Icon className="w-4.5 h-4.5 text-muted-foreground mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
