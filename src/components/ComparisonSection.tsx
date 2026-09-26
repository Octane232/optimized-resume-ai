import React from 'react';
import { Radar, FileCheck2, Layers } from 'lucide-react';

const points = [
  {
    icon: Radar,
    title: 'Job boards show you the queue',
    them: 'On Indeed or LinkedIn a role is public, so hundreds of people have already applied by the time you see it.',
    us: 'Job Radar watches hiring signals — funding rounds, expansion news, team growth — so you can reach out before the listing goes live.',
  },
  {
    icon: FileCheck2,
    title: 'Generic AI guesses, we measure',
    them: 'A chatbot rewrites your resume from a blank prompt, invents numbers and dates, and hands back plain text that loses your formatting.',
    us: 'We score your actual file against the actual job description, show the exact missing keywords, and rewrite inside your Word document so the layout stays intact.',
  },
  {
    icon: Layers,
    title: 'One search, not six tabs',
    them: 'Searching, tailoring, tracking and interview practice live in separate free tools that never talk to each other.',
    us: 'Radar, resume scoring, cover letters, applications and interview practice all share the same profile, so every step builds on the last.',
  },
];

const ComparisonSection = () => (
  <section id="why-vaylance" className="py-16 sm:py-24 border-b border-border">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mb-10 sm:mb-14">
        <p className="text-[11px] font-semibold uppercase text-primary mb-4">Why not just use free tools?</p>
        <h2 className="text-[26px] leading-tight sm:text-4xl font-bold text-foreground mb-4">
          Free tools help you apply. Vaylance helps you get picked.
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Indeed and a chatbot can get an application out the door. Here is what they cannot do.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {points.map((p) => {
          const Icon = p.icon;
          return (
            <article key={p.title} className="rounded-lg border border-border bg-card p-5 sm:p-6 flex flex-col">
              <div className="w-10 h-10 rounded-md bg-signal-soft flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-4">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 pb-4 border-b border-border">
                {p.them}
              </p>
              <p className="text-[15px] text-foreground leading-relaxed">{p.us}</p>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);

export default ComparisonSection;
