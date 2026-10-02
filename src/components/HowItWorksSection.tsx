import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, FileText, Mail, Puzzle, Linkedin, Users, Target, X } from 'lucide-react';

const tools = [
  { icon: FileText, t: 'Resume + ATS', d: 'Measure your fit, get tailored rewrites and improve your score.' },
  { icon: Mail, t: 'Cover Letter', d: 'Create personalized, job-specific cover letters.' },
  { icon: Puzzle, t: 'Skill Gap Analyzer', d: "See what you're missing and how to build it." },
  { icon: Linkedin, t: 'LinkedIn Optimizer', d: 'Improve your profile and presence.' },
  { icon: Users, t: 'Interview Coach', d: 'Practice, get feedback, boost your confidence.' },
  { icon: Target, t: 'Mission Control', d: 'Track applications, follow-ups and next steps.' },
];

const bars = [
  { l: 'Skills Match', v: 92, c: 'bg-vy-glow' },
  { l: 'Experience', v: 85, c: 'bg-destructive' },
  { l: 'Keywords', v: 78, c: 'bg-vy-amber' },
];

/** Toolkit section + the dark "career timeline" band. */
const HowItWorksSection = () => (
  <>
    <section className="bg-vy-paper py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.55fr_1fr] gap-10 items-center">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-vy-teal mb-3">MORE THAN JUST A TOOLKIT</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-vy-deep mb-3">Everything you need, in one place.</h2>
          <p className="text-sm text-vy-body max-w-[34rem] mb-10">From finding opportunities to preparing your application, Vaylance gives you the tools to move faster, stay ready and get hired.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
            {tools.map((t) => (
              <Link to="/auth" key={t.t} className="group flex gap-3">
                <span className="w-10 h-10 rounded-lg bg-vy-mist flex items-center justify-center shrink-0"><t.icon className="w-5 h-5 text-vy-teal" /></span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-vy-deep">{t.t}</p>
                  <p className="text-xs text-vy-body leading-relaxed mt-1">{t.d}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-vy-body mt-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>

        <div className="relative h-[340px]">
          <div className="absolute inset-y-4 -right-24 left-6 rounded-[40%] bg-vy-mist" />
          <div className="absolute left-4 top-24 w-48 h-44 rounded-lg bg-vy-deep border border-vy-line p-3 -rotate-3">
            <p className="text-[8px] text-vy-dim mb-2">Dashboard</p>
            {[70, 55, 80, 45, 60].map((w, i) => <div key={i} className="h-1.5 rounded bg-vy-line mb-2.5" style={{ width: `${w}%` }} />)}
          </div>
          <div className="absolute left-24 top-6 w-56 rounded-xl bg-vy-ink border border-vy-line p-4 rotate-3 shadow-2xl">
            <div className="flex justify-between text-[9px] text-vy-dim mb-3"><span>ATS Analysis</span><X className="w-3 h-3" /></div>
            <p className="text-3xl font-semibold text-vy-glow">87%</p>
            <p className="text-[10px] text-vy-text mb-4">Overall Match</p>
            {bars.map((b) => (
              <div key={b.l} className="mb-3">
                <div className="flex justify-between text-[9px] text-vy-text mb-1"><span>{b.l}</span><span>{b.v}%</span></div>
                <div className="h-1 rounded bg-vy-line"><div className={`h-full rounded ${b.c}`} style={{ width: `${b.v}%` }} /></div>
              </div>
            ))}
            <span className="inline-block mt-1 text-[8px] px-2 py-1 rounded border border-vy-line text-vy-text">View full report →</span>
          </div>
          <p className="absolute right-0 top-28 font-serif italic text-xl text-vy-teal -rotate-12 leading-tight">Build your<br />next move.</p>
        </div>
      </div>
    </section>

    <section id="how-it-works" className="bg-vy-ink py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-center">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-vy-glow mb-3">YOUR CAREER TIMELINE</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-vy-text leading-tight mb-4">
            The job board is where everyone arrives.<br /><span className="text-vy-glow">Vaylance starts earlier.</span>
          </h2>
          <p className="text-sm text-vy-dim max-w-md mb-6">While others react to job postings, you'll be ahead with the intelligence, preparation and connections to move first.</p>
          <Link to="/auth" className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-vy-teal text-vy-text text-sm font-semibold hover:bg-vy-glow transition-colors">
            See the full journey <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="rounded-2xl border border-vy-line p-6">
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
            {['Company signal', 'AI detects hiring potential', 'Likely roles identified', 'Prepare & build', 'Reach out to contact', 'Job opens', 'Apply'].map((s, i) => (
              <div key={s} className="relative text-center">
                <span className="mx-auto w-10 h-10 rounded-full border border-vy-glow/60 flex items-center justify-center text-xs text-vy-glow">{i + 1}</span>
                {i < 6 && <span className="hidden sm:block absolute top-5 left-[70%] w-[60%] border-t border-dashed border-vy-line" />}
                <p className="text-[11px] text-vy-text mt-3 leading-snug">{s}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm font-semibold text-vy-text mt-6 pt-4 border-t border-vy-line">You're already prepared.</p>
        </div>
      </div>
    </section>
  </>
);

export default HowItWorksSection;
