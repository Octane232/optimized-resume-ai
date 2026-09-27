import React from 'react';
import { Radar, FileText, Mic, DollarSign, Linkedin, Search, TrendingUp, Send, Building2, Users, Trophy } from 'lucide-react';

const pillars = [
  {
    title: 'Get ahead',
    subtitle: 'Discover and understand',
    items: [
      { icon: Radar, title: 'Hiring Radar', desc: 'Spot companies showing signs of upcoming hiring.' },
      { icon: Building2, title: 'Company intelligence', desc: 'See the full picture: roles, location and timing.' },
      { icon: Users, title: 'Hiring contacts', desc: 'Find the people relevant to the opportunity.' },
    ],
  },
  {
    title: 'Get ready',
    subtitle: 'Build your advantage',
    items: [
      { icon: FileText, title: 'Resume + ATS', desc: 'Improve your match while keeping your own layout.' },
      { icon: TrendingUp, title: 'Skill Gap Analyzer', desc: 'See what you are missing for your target role.' },
      { icon: Send, title: 'Cover letters', desc: 'Create tailored, high-impact letters in minutes.' },
      { icon: Linkedin, title: 'LinkedIn Optimizer', desc: 'Make your profile easier for recruiters to find.' },
      { icon: Mic, title: 'Interview Coach', desc: 'Practise your answers and get scored feedback.' },
    ],
  },
  {
    title: 'Stay on track',
    subtitle: 'Take action',
    items: [
      { icon: Search, title: 'Application Tracker', desc: 'Keep every application and follow-up in one place.' },
      { icon: DollarSign, title: 'Salary Intelligence', desc: 'Know your value and negotiate with confidence.' },
      { icon: Trophy, title: 'Career wins and streaks', desc: 'Stay motivated and build steady momentum.' },
    ],
  },
];

const FeaturesSection = () => (
  <section className="py-16 sm:py-24 border-b border-border bg-secondary/40">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mb-10 sm:mb-12">
        <p className="text-[11px] font-semibold uppercase text-primary mb-4">The complete career workspace</p>
        <h2 className="text-[26px] leading-tight sm:text-4xl font-bold text-foreground">
          Everything you need to get ahead, get ready and get hired.
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {pillars.map((p) => (
          <article key={p.title} className="rounded-lg border border-border bg-card p-5 sm:p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">{p.title}</h3>
              <p className="text-[11px] font-semibold uppercase text-muted-foreground mt-1">{p.subtitle}</p>
            </div>
            <ul className="space-y-5">
              {p.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.title} className="flex gap-3">
                    <span className="w-8 h-8 shrink-0 rounded-md bg-signal-soft flex items-center justify-center"><Icon className="w-4 h-4 text-primary" /></span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-[13px] text-muted-foreground leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
