import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Search, Building2, MapPin, Clock, Briefcase, CalendarClock, Crosshair } from 'lucide-react';

const checks = [
  'Cross-industry news & trade feeds',
  'AI-powered company & role detection',
  '% match with your career preferences',
  'Rich intel: why now, likely roles, outreach angle',
  'Find hiring contact (LinkedIn deep search)',
];

const rows = [
  { name: 'Northwind Logistics', sig: 'New distribution center announced', loc: 'Manchester, UK', t: '2h ago', m: 92, tone: 'teal' },
  { name: 'Apex Energy', sig: '$43M expansion funding round', loc: 'Houston, TX', t: '6h ago', m: 78, tone: 'amber' },
  { name: 'HealthPlus', sig: 'New regional office opening', loc: 'Chicago, IL', t: '8h ago', m: 65, tone: 'amber' },
];

const Ring = ({ v, tone }: { v: number; tone: string }) => {
  const c = 2 * Math.PI * 16;
  return (
    <svg viewBox="0 0 40 40" className="w-11 h-11 -rotate-90" aria-label={`${v}% match`}>
      <circle cx="20" cy="20" r="16" fill="none" className="stroke-vy-mist" strokeWidth="3" />
      <circle cx="20" cy="20" r="16" fill="none" className={tone === 'teal' ? 'stroke-vy-teal' : 'stroke-vy-amber'} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(v / 100) * c} ${c}`} />
      <text x="20" y="24" textAnchor="middle" className="fill-vy-deep text-[10px] font-semibold rotate-90 origin-center">{v}%</text>
    </svg>
  );
};

/** "Meet Hiring Radar" flagship section. */
const FeaturesSection = () => (
  <section id="features" className="bg-vy-paper py-16 border-b border-vy-mist">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_1.2fr_0.75fr] gap-8 items-start">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.14em] text-vy-teal mb-3">OUR FLAGSHIP FEATURE</p>
        <h2 className="font-serif text-3xl sm:text-4xl text-vy-deep mb-4">Meet Hiring Radar</h2>
        <p className="text-sm text-vy-body leading-relaxed mb-6">
          The most powerful way to discover companies that may be hiring, before the job is posted. Get rich intelligence, not just a list of jobs.
        </p>
        <ul className="space-y-3 mb-8">
          {checks.map((c) => (
            <li key={c} className="flex items-center gap-3 text-sm text-vy-deep">
              <span className="w-5 h-5 rounded-full bg-vy-teal flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-vy-text" /></span>{c}
            </li>
          ))}
        </ul>
        <Link to="/auth" className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-vy-teal text-vy-text text-sm font-semibold hover:bg-vy-deep transition-colors">
          Explore Hiring Radar <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="rounded-2xl border border-vy-mist bg-card shadow-[0_20px_50px_-30px_hsl(var(--vy-deep)/0.35)] p-5">
        <div className="flex items-start justify-between mb-3">
          <div><p className="font-semibold text-vy-deep">Hiring Radar</p><p className="text-xs text-vy-teal">34 signals detected</p></div>
          <div className="flex items-center justify-between w-32 h-8 px-2 rounded-md border border-vy-mist text-[11px] text-vy-body">Search... <Search className="w-3.5 h-3.5" /></div>
        </div>
        <div className="flex gap-1.5 mb-4 text-[11px]">
          <span className="px-3 py-1 rounded-full bg-vy-teal text-vy-text">34 signals</span>
          {['High Match', 'New', 'Saved'].map((t) => <span key={t} className="px-3 py-1 rounded-full border border-vy-mist text-vy-body">{t}</span>)}
        </div>
        <ul className="divide-y divide-vy-mist">
          {rows.map((r) => (
            <li key={r.name} className="flex items-center gap-3 py-4">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${r.tone === 'teal' ? 'bg-vy-teal' : 'bg-vy-amber'}`}><Building2 className="w-4 h-4 text-vy-text" /></span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-vy-deep">{r.name}</p>
                <p className="text-xs text-vy-body">{r.sig}</p>
                <p className="flex gap-3 mt-1 text-[10px] text-vy-body"><span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{r.loc}</span><span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.t}</span></p>
              </div>
              <Ring v={r.m} tone={r.tone} />
              <span className="h-8 px-4 rounded-md bg-vy-teal text-vy-text text-xs font-semibold flex items-center">View</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-vy-mist bg-card p-5 text-xs">
        <p className="font-semibold text-vy-deep mb-4">Signal Intelligence</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-vy-teal flex items-center justify-center"><Building2 className="w-3 h-3 text-vy-text" /></span>
          <span className="font-semibold text-vy-deep">Northwind Logistics</span>
          <span className="px-1.5 py-0.5 rounded bg-vy-mist text-vy-teal text-[10px]">High</span>
        </div>
        <div className="flex gap-2 mb-4">
          <Briefcase className="w-3.5 h-3.5 text-vy-teal mt-0.5" />
          <div className="text-vy-body leading-relaxed"><p className="text-vy-deep font-medium">Likely roles</p>Operations Manager<br />Warehouse Manager<br />Logistics Coordinator<br /><span className="text-vy-teal">+3 more</span></div>
        </div>
        <div className="flex gap-2 mb-4">
          <CalendarClock className="w-3.5 h-3.5 text-vy-teal mt-0.5" />
          <div className="text-vy-body leading-relaxed"><p className="text-vy-deep font-medium">Why now</p>New distribution center + expansion announcements suggest increased operational hiring in 30-60 days.</div>
        </div>
        <div className="flex gap-2 mb-5">
          <Crosshair className="w-3.5 h-3.5 text-vy-teal mt-0.5" />
          <div className="flex-1">
            <div className="flex justify-between"><span className="text-vy-teal font-medium">Your fit</span><span className="font-semibold text-vy-deep">92%</span></div>
            <div className="h-1.5 rounded-full bg-vy-mist mt-2"><div className="h-full w-[92%] rounded-full bg-vy-teal" /></div>
          </div>
        </div>
        <span className="flex items-center justify-center gap-1 h-9 rounded-md border border-vy-teal/50 text-vy-teal font-semibold">Find hiring contacts <ArrowRight className="w-3.5 h-3.5" /></span>
      </div>
    </div>
  </section>
);

export default FeaturesSection;
