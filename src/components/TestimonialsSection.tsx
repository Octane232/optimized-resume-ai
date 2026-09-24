import React from 'react';
import { ArrowRight, Check, MapPin, Radar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TestimonialsSection = () => (
  <section className="py-16 sm:py-24 bg-foreground text-background overflow-hidden">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.78fr_1.22fr] gap-12 lg:gap-16 items-center">
      <div>
        <p className="text-[11px] font-semibold uppercase text-signal mb-4">The Vaylance advantage</p>
        <h2 className="text-[26px] leading-tight sm:text-4xl text-background mb-5">More than a job board. Your career command center.</h2>
        <p className="text-background/65 leading-relaxed mb-7">See where demand is building, prepare the right application, and keep every next step in one place.</p>
        <ul className="space-y-3 mb-8">
          {['Fresh hiring signals', 'Role-specific resume scoring', 'Focused preparation tools', 'A clear application workflow'].map((point) => <li key={point} className="flex items-center gap-2.5 text-sm text-background/85"><Check className="w-4 h-4 text-signal" />{point}</li>)}
        </ul>
        <Button asChild size="lg"><Link to="/auth">Explore the app <ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
      </div>

      <div className="relative">
        <div className="rounded-lg border border-background/15 bg-background/5 p-3 sm:p-5">
          <div className="flex items-center justify-between border-b border-background/10 pb-4 mb-4"><div className="flex items-center gap-2 text-sm font-semibold"><Radar className="w-4 h-4 text-signal" /> Job Radar</div><span className="text-xs text-background/50">Latest signals</span></div>
          <div className="space-y-3">
            {[
              { company: 'Northwind Logistics', role: 'Operations Manager', place: 'Austin · Hybrid', score: 92 },
              { company: 'Meridian Health', role: 'Program Coordinator', place: 'Chicago · On-site', score: 88 },
              { company: 'Harbor Energy', role: 'Commercial Analyst', place: 'Houston · Hybrid', score: 84 },
            ].map((item) => <article key={item.company} className="grid grid-cols-[1fr_auto] gap-4 rounded-md border border-background/10 bg-background/5 p-4"><div><p className="text-sm font-semibold text-background">{item.company}</p><p className="text-xs text-background/65 mt-1">{item.role}</p><p className="text-[11px] text-background/45 mt-2 flex items-center gap-1"><MapPin className="w-3 h-3" />{item.place}</p></div><div className="text-right"><p className="tabular text-lg font-semibold text-signal">{item.score}%</p><p className="text-[10px] text-background/45">match</p></div></article>)}
          </div>
        </div>
        <div className="hidden sm:block absolute -right-8 top-1/2 -translate-y-1/2 w-44 rounded-lg border border-signal/40 bg-foreground p-4 shadow-xl">
          <Radar className="w-5 h-5 text-signal mb-8" /><p className="text-sm font-semibold text-background mb-2">Find the right opening early.</p><p className="text-xs leading-relaxed text-background/55">Use real company activity to decide where to focus next.</p>
        </div>
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
