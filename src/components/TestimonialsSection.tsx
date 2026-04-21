import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

const testimonials = [
  {
    name: 'Marcus T.',
    role: 'Product Manager',
    company: 'Tech Company',
    content: 'After struggling with generic resume builders for months, I tried Vaylance. The AI found keyword gaps I never noticed and rewrote my bullets with real impact. Got 2 interviews in the first week.',
    initials: 'MT',
  },
  {
    name: 'Priya S.',
    role: 'Software Engineer',
    company: 'Fortune 500',
    content: 'After months of silence from applications, Vaylance showed me exactly why I was getting filtered out by ATS systems. Landed 3 interviews after implementing the fixes it suggested.',
    initials: 'PS',
  },
  {
    name: 'Alex R.',
    role: 'Marketing Specialist',
    company: 'SaaS Startup',
    content: 'It wrote a cover letter that actually sounded like me — not generic AI fluff. My response rate went from 5% to over 20%.',
    initials: 'AR',
  },
  {
    name: 'Jordan K.',
    role: 'Data Analyst',
    company: 'Finance Industry',
    content: 'The job match scoring is surprisingly accurate. Saved me from wasting time on jobs I wouldn\'t get and helped me focus on better opportunities.',
    initials: 'JK',
  },
  {
    name: 'Sam L.',
    role: 'UX Designer',
    company: 'Design Agency',
    content: 'Used Vaylance to pivot from graphic design to UX. It identified transferable skills I completely overlooked. Landed my dream role within 2 months.',
    initials: 'SL',
  },
  {
    name: 'Taylor M.',
    role: 'Sales Manager',
    company: 'Enterprise Tech',
    content: 'The follow-up email suggestions are gold. It drafted the perfect follow-up message and got me to final rounds twice — something I\'d been struggling with for over a year.',
    initials: 'TM',
  },
];

const avatarColors = [
  'bg-blue-100 text-blue-800',
  'bg-purple-100 text-purple-800',
  'bg-emerald-100 text-emerald-800',
  'bg-orange-100 text-orange-800',
  'bg-pink-100 text-pink-800',
  'bg-indigo-100 text-indigo-800',
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
            Real results
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
            People are getting hired.
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-medium">4.8 average · 1,200+ users</span>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                "{t.content}"
              </p>

              {/* User */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                  {t.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{t.name}</span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                      <CheckCircle className="w-2.5 h-2.5" />
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
