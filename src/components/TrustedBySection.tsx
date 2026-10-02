import React from 'react';
import { Rocket, Building, FileSignature, Store, MapPin, Briefcase, TrendingUp } from 'lucide-react';

const steps = [
  { icon: Rocket, t: 'Funding / Investment', d: 'New capital, investors, expansion plans' },
  { icon: Building, t: 'Expansion', d: 'New offices, facilities or market expansion' },
  { icon: FileSignature, t: 'New Contract', d: 'Large contracts or partnerships' },
  { icon: Store, t: 'Hiring Demand', d: 'Increased operations or product launches' },
  { icon: MapPin, t: 'New Location', d: 'Regional or international expansion' },
];

/** "The hiring signal comes before the job listing" lifecycle section. */
const TrustedBySection = () => (
  <section className="bg-vy-paper py-16 border-b border-vy-mist">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.9fr_2.1fr] gap-10 items-start">
      <div>
        <p className="text-[11px] font-semibold tracking-[0.14em] text-vy-teal mb-3">THE HIRING SIGNALS LIFE CYCLE</p>
        <h2 className="font-serif text-3xl sm:text-4xl leading-tight text-vy-deep mb-4">
          The hiring signal comes <em className="text-vy-teal">before</em> the job listing.
        </h2>
        <p className="text-sm text-vy-body leading-relaxed">
          Companies leave clues. We find them. Vaylance monitors business activity across industries and turns real-world signals into <strong className="text-vy-deep font-semibold">hiring intelligence</strong>, before the roles go live.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_15rem] gap-6 items-start">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 pt-6">
          {steps.map((s, i) => (
            <div key={s.t} className="relative">
              <span className="w-11 h-11 rounded-full bg-vy-mist border border-vy-teal/30 flex items-center justify-center mb-3">
                <s.icon className="w-5 h-5 text-vy-teal" />
              </span>
              {i < steps.length && <span className="hidden md:block absolute top-5 left-14 right-0 border-t border-vy-teal/40" />}
              <p className="text-sm font-medium text-vy-deep mb-2">{s.t}</p>
              <p className="text-[11px] text-vy-body leading-snug">{s.d}</p>
            </div>
          ))}
          <div className="md:pt-3">
            <span className="flex items-center gap-2 mb-5"><Briefcase className="w-5 h-5 text-vy-deep" /><span className="text-sm font-medium text-vy-deep">Job Opening</span></span>
            <p className="text-[11px] text-vy-body leading-snug">Role postings appear (later).</p>
          </div>
        </div>

        <div className="rounded-xl bg-vy-mist p-5">
          <span className="w-10 h-10 rounded-full bg-vy-paper flex items-center justify-center mb-3"><TrendingUp className="w-5 h-5 text-vy-teal" /></span>
          <p className="text-sm font-semibold text-vy-deep mb-2">The result?</p>
          <p className="text-xs text-vy-body leading-relaxed">
            You get signals, not just job listings, so you can prepare, reach out and apply before the opportunity <span className="underline decoration-vy-teal decoration-2 underline-offset-4">becomes crowded.</span>
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default TrustedBySection;
