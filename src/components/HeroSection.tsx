import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, PlayCircle, Users, Building2, Heart, LayoutDashboard, Radar, FileText, Mail,
  Mic, GraduationCap, Linkedin, Rocket, Settings, Search, Bell, MapPin, Clock,
} from 'lucide-react';
import VaylanceLogo from '@/components/VaylanceLogo';

const side = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Radar, label: 'Hiring Radar', active: true },
  { icon: FileText, label: 'Resume + ATS' },
  { icon: Mail, label: 'Cover Letter' },
  { icon: Mic, label: 'Interview Coach' },
  { icon: GraduationCap, label: 'Skill Gap' },
  { icon: Linkedin, label: 'LinkedIn Optimizer' },
  { icon: Rocket, label: 'Mission Control' },
];

const HeroSection = () => (
  <section id="top" className="relative overflow-hidden bg-vy-ink pt-[104px] pb-6">
    {/* Wave lines */}
    <svg className="absolute left-0 bottom-0 w-[60%] h-56 text-vy-teal/25 pointer-events-none" viewBox="0 0 600 200" fill="none" aria-hidden>
      {[0, 12, 24, 36, 48].map((o) => (
        <path key={o} d={`M0 ${200 - o} C150 ${120 - o}, 300 ${210 - o}, 600 ${90 - o}`} stroke="currentColor" strokeWidth="1" />
      ))}
    </svg>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_1.12fr] gap-10 lg:gap-12 items-center">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-vy-glow mb-4">AI CAREER INTELLIGENCE</p>
        <h1 className="font-serif text-[2.6rem] sm:text-6xl leading-[1.08] text-vy-text mb-6">
          Know who's hiring <br />
          <em className="text-vy-glow pr-1">before</em> the job is posted.
        </h1>
        <p className="text-base text-vy-dim max-w-[30rem] leading-relaxed mb-8">
          Vaylance detects business signals that can precede hiring, like funding, expansion, new contracts and more, then turns them into actionable career intelligence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <Link to="/auth" className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg bg-vy-teal text-vy-text font-semibold hover:bg-vy-glow transition-colors active:scale-[0.98]">
            Explore Hiring Radar <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-lg border border-vy-line text-vy-text font-semibold hover:border-vy-glow transition-colors">
            <PlayCircle className="w-4 h-4" /> See how it works
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: Users, a: '34 signals detected', b: 'in the last 7 days' },
            { icon: Building2, a: '12 high-potential', b: 'companies identified' },
            { icon: Heart, a: 'Fit explained', b: 'against your preferences' },
          ].map((s) => (
            <div key={s.a} className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-full border border-vy-line flex items-center justify-center shrink-0">
                <s.icon className="w-4 h-4 text-vy-glow" />
              </span>
              <p className="text-xs text-vy-text leading-snug">{s.a}<br /><span className="text-vy-dim">{s.b}</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* App preview */}
      <div className="rounded-2xl border border-vy-line bg-vy-panel shadow-[0_30px_80px_-30px_hsl(var(--vy-teal)/0.35)] overflow-hidden">
        <div className="flex gap-1.5 px-4 pt-3">
          <span className="w-2 h-2 rounded-full bg-destructive" /><span className="w-2 h-2 rounded-full bg-vy-amber" /><span className="w-2 h-2 rounded-full bg-vy-glow" />
        </div>
        <div className="flex">
          <aside className="hidden sm:flex w-44 flex-col border-r border-vy-line p-3 text-[11px]">
            <div className="flex items-center gap-2 px-2 pb-4"><VaylanceLogo width={20} height={20} /><span className="font-semibold text-vy-text text-xs">Vaylance</span></div>
            <div className="space-y-0.5">
              {side.map((s) => (
                <div key={s.label} className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${s.active ? 'bg-vy-teal/70 text-vy-text' : 'text-vy-dim'}`}>
                  <s.icon className="w-3.5 h-3.5" />{s.label}
                </div>
              ))}
            </div>
            <div className="mt-auto pt-10 space-y-3">
              <div className="flex items-center gap-2 px-2 text-vy-dim"><Settings className="w-3.5 h-3.5" />Settings</div>
              <div className="flex items-center gap-2 px-2">
                <span className="w-6 h-6 rounded-full bg-vy-mist text-vy-deep text-[9px] font-bold flex items-center justify-center">LK</span>
                <span className="text-vy-text leading-tight">Leslie K.<br /><span className="text-[9px] text-vy-dim">Pro Plan</span></span>
              </div>
            </div>
          </aside>

          <div className="flex-1 p-4 sm:p-5 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-base font-semibold text-vy-text">Hiring Radar</p>
                <p className="text-[10px] text-vy-dim">Discover companies showing signs of upcoming hiring.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-1.5 h-7 px-2 rounded-md border border-vy-line text-[10px] text-vy-dim"><Search className="w-3 h-3" />Search companies...</div>
                <Bell className="w-4 h-4 text-vy-text" />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4 text-[10px]">
              <span className="px-3 py-1 rounded-md bg-vy-teal/70 text-vy-text">All Signals 34</span>
              <span className="px-3 py-1 rounded-md border border-vy-line text-vy-dim">High Match 12</span>
              <span className="px-3 py-1 rounded-md border border-vy-line text-vy-dim">New 6</span>
              <span className="px-3 py-1 rounded-md border border-vy-line text-vy-dim">Saved 5</span>
            </div>

            <div className="rounded-xl border border-vy-line p-4 mb-3">
              <div className="flex gap-3">
                <span className="w-7 h-7 rounded-md bg-vy-teal flex items-center justify-center shrink-0"><Building2 className="w-3.5 h-3.5 text-vy-text" /></span>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-vy-teal/60 text-vy-text">High Potential</span>
                  <p className="text-sm font-semibold text-vy-text mt-1">Northwind Logistics</p>
                  <p className="text-[10px] text-vy-dim">New distribution center announced</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[9px] text-vy-dim">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Manchester, UK</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />2h ago</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />Large (500-1k)</span>
                  </div>
                  <p className="text-[10px] text-vy-glow mt-3 mb-1.5">Likely roles</p>
                  <div className="flex flex-wrap gap-1.5 text-[9px] text-vy-text">
                    {['Operations Manager', 'Supply Chain Analyst', 'Warehouse Manager'].map((r) => (
                      <span key={r} className="px-2 py-1 rounded border border-vy-line">{r}</span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 mt-3 text-[9px] px-2.5 py-1 rounded bg-vy-teal/60 text-vy-text">View intelligence <ArrowRight className="w-3 h-3" /></span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-vy-glow flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-vy-text">74%</span><span className="text-[7px] text-vy-glow">match</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-vy-amber/40 p-4 flex gap-3">
              <span className="w-7 h-7 rounded-md bg-vy-amber flex items-center justify-center shrink-0"><Building2 className="w-3.5 h-3.5 text-vy-ink" /></span>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-vy-amber/25 text-vy-amber">Hiring Surge</span>
                <p className="text-sm font-semibold text-vy-text mt-1">Apex Energy</p>
                <p className="text-[10px] text-vy-dim">$42M expansion funding round</p>
                <div className="flex flex-wrap gap-x-4 mt-2 text-[9px] text-vy-dim">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />Houston, TX</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />6h ago</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />Medium (100-500)</span>
                </div>
              </div>
               <div className="w-12 h-12 rounded-full border-2 border-vy-amber flex items-center justify-center shrink-0 text-xs font-semibold text-vy-amber">58%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
