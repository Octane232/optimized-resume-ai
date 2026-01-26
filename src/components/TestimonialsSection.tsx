import React from 'react';
import { Star, Quote, Sparkles, CheckCircle } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Marcus T.',
      role: 'Product Manager', 
      company: 'Tech Company',
      content: "After struggling with generic resume builders for months, I tried Vaylance. The AI found keyword gaps I never noticed and rewrote my bullets with real impact. Got 2 interviews in the first week after making the changes.",
      rating: 5,
      initials: 'MT',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      verified: true
    },
    {
      name: 'Priya S.',
      role: 'Software Engineer',
      company: 'Fortune 500', 
      content: "After months of silence from applications, I asked the AI to analyze my resume. It showed me exactly why I was getting filtered out by ATS systems. Landed 3 interviews after implementing the fixes it suggested.",
      rating: 5,
      initials: 'PS',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      verified: true
    },
    {
      name: 'Alex R.',
      role: 'Marketing Specialist',
      company: 'SaaS Startup',
      content: "I was skeptical about AI career tools, but Vaylance genuinely understands context. It wrote a cover letter that actually sounded like me—not generic AI fluff. My response rate went from 5% to over 20%.",
      rating: 5,
      initials: 'AR',
      bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      verified: true
    },
    {
      name: 'Jordan K.',
      role: 'Data Analyst',
      company: 'Finance Industry',
      content: "The job match scoring is surprisingly accurate. The AI told me a role was only 62% match and explained exactly why. Saved me from wasting time on jobs I wouldn't get and helped me focus on better opportunities.",
      rating: 5,
      initials: 'JK',
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
      verified: true
    },
    {
      name: 'Sam L.',
      role: 'UX Designer',
      company: 'Design Agency',
      content: "Used Vaylance to help me pivot from graphic design to UX. It identified transferable skills I completely overlooked and helped me reframe my entire experience. Landed my dream role within 2 months.",
      rating: 5,
      initials: 'SL',
      bgColor: 'bg-gradient-to-br from-pink-500 to-pink-600',
      verified: true
    },
    {
      name: 'Taylor M.',
      role: 'Sales Manager',
      company: 'Enterprise Tech',
      content: "The follow-up email suggestions are gold. Vaylance reminded me to follow up on day 5 and drafted the perfect message. It got me to final rounds twice—something I'd been struggling with for over a year.",
      rating: 5,
      initials: 'TM',
      bgColor: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      verified: true
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden bg-background">
      {/* Advanced background with animated gradients */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-60"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-emerald-400/20 dark:from-purple-500/10 dark:to-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Real Results
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="block text-foreground">What Our Users Say</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join thousands of job seekers who've accelerated their career with Vaylance
          </p>
          
          {/* Rating summary */}
          <div className="flex items-center justify-center gap-2 mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground ml-2">4.8 average rating</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="testimonial-card rounded-3xl p-8 group animate-fade-in relative"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {/* Decorative quote icon */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl flex items-center justify-center rotate-6 group-hover:rotate-12 transition-transform duration-500">
                <Quote className="w-6 h-6 text-primary/40" />
              </div>

              {/* Rating Stars with glow effect */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <div key={i} className="relative">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]" />
                  </div>
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-foreground/90 mb-8 leading-relaxed text-sm font-medium relative z-10">
                "{testimonial.content}"
              </p>

              {/* User Info with avatar initials */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                <div className={`w-12 h-12 rounded-full ${testimonial.bgColor} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                  <span className="text-white font-bold text-sm">{testimonial.initials}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-foreground text-sm">
                      {testimonial.name}
                    </h4>
                    {testimonial.verified && (
                      <div className="flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">
                    {testimonial.role} • {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
