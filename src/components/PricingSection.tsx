import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const plans = [
  { name: 'Free', sub: 'Get started at no cost.', price: 0, cta: 'Get started', features: ['1 Hiring Radar alert', '1 Resume analysis', '1 Cover letter', 'Access to basic tools'] },
  { name: 'Pro', sub: 'Build your advantage.', price: 15, cta: 'Go Pro', popular: true, features: ['15 Hiring Radar alerts', '30 Resume + ATS analyses', '30 Cover letters', '15 Skill gap analyses', '15 LinkedIn optimizations', '30 Interview sessions', '10 DOCX rewrites', '50 Job searches'] },
  { name: 'Elite', sub: 'Maximum impact.', price: 29, cta: 'Go Elite', features: ['50 Hiring Radar alerts', '100 Resume + ATS analyses', '100 Cover letters', '50 Skill gap analyses', '50 LinkedIn optimizations', '100 Interview sessions', '50 DOCX rewrites', '120 Job searches'] },
];

const PricingSection = () => (
  <section id="pricing" className="bg-vy-paper py-14">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-vy-teal mb-2">SIMPLE, TRANSPARENT PRICING</p>
        <h2 className="font-serif text-3xl sm:text-4xl text-vy-deep mb-2">Choose the plan that fits your goals.</h2>
        <p className="text-sm text-vy-body">More tools. More insights. A stronger you.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {plans.map((p) => (
          <div key={p.name} className={`relative rounded-xl bg-card p-5 border ${p.popular ? 'border-2 border-vy-teal' : 'border-vy-mist'}`}>
            {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-vy-teal text-vy-text text-[10px] font-semibold">Most Popular</span>}
            <p className="font-semibold text-vy-deep">{p.name}</p>
            <p className="text-xs text-vy-body mb-2">{p.sub}</p>
            <p className="mb-4"><span className="text-2xl font-bold text-vy-deep">${p.price}</span><span className="text-xs text-vy-body"> /month</span></p>
            <ul className="space-y-1.5 mb-6 min-h-[11rem]">
              {p.features.map((f) => <li key={f} className="flex gap-2 text-xs text-vy-body"><Check className="w-3.5 h-3.5 text-vy-teal shrink-0" />{f}</li>)}
            </ul>
            <Link to="/auth" className={`h-9 rounded-md flex items-center justify-center text-xs font-semibold ${p.popular ? 'bg-vy-teal text-vy-text hover:bg-vy-deep' : 'border border-vy-mist text-vy-deep hover:border-vy-teal'}`}>{p.cta}</Link>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
