import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  { name: 'Sarah J.', role: 'Product Designer at Linear', content: 'Vaylance changed my job search completely. I started getting interviews within a week!', tone: 'from-pink-500 to-rose-500' },
  { name: 'Mike R.', role: 'Software Engineer at Meta', content: 'The AI cover letters are incredible. So personalized and effective!', tone: 'from-blue-500 to-cyan-500' },
  { name: 'David L.', role: 'Product Manager at Google', content: 'Got my dream job at Google! The interview coach really helped me prepare.', tone: 'from-emerald-500 to-teal-500' },
];

const TestimonialsSection = () => {
  return (
    <section className="py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.25em] mb-3 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">LOVED BY JOB SEEKERS</p>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            See what our users are saying
          </h2>
        </div>

        <div className="relative">
          <button className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card border border-border items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors z-10">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card border border-border items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors z-10">
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="grid md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border bg-card flex flex-col">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed flex-1 mb-5">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.tone} flex items-center justify-center text-xs font-bold text-white`}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
