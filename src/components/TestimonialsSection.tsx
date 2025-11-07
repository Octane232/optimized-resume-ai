
import React from 'react';
import { Star, Quote, TrendingUp, Zap } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Marcus T.',
      role: 'Product Manager', 
      company: 'Tech Startup',
      content: "Got 2 interviews in the first week. The templates aren't flashy but they work. My only gripe is I wish there were more design options.",
      rating: 4,
      initials: 'MT',
      bgColor: 'bg-blue-500'
    },
    {
      name: 'Priya S.',
      role: 'Software Engineer',
      company: 'Fortune 500', 
      content: "After months of applying with my old resume and hearing nothing, I rebuilt it here. Finally got past the ATS systems and landed 3 interviews.",
      rating: 5,
      initials: 'PS',
      bgColor: 'bg-purple-500'
    },
    {
      name: 'Alex R.',
      role: 'Marketing Specialist',
      company: 'Agency',
      content: "Decent tool for quick resume updates. The AI suggestions are hit or miss but saved me a lot of time. Would recommend for the price.",
      rating: 4,
      initials: 'AR',
      bgColor: 'bg-emerald-500'
    },
    {
      name: 'Jordan K.',
      role: 'Data Analyst',
      company: 'Finance',
      content: "Was skeptical but it actually helped me structure my experience better. Went from generic bullet points to impact-focused ones. Worth trying.",
      rating: 4,
      initials: 'JK',
      bgColor: 'bg-orange-500'
    },
    {
      name: 'Sam L.',
      role: 'Designer',
      company: 'Creative Studio',
      content: "Clean templates that don't try to be too fancy. Perfect for when you need something professional fast. Export quality is good too.",
      rating: 5,
      initials: 'SL',
      bgColor: 'bg-pink-500'
    },
    {
      name: 'Taylor M.',
      role: 'Sales Rep',
      company: 'SaaS Company',
      content: "The metrics suggestions for sales roles are surprisingly good. Helped me quantify achievements I was underselling. Got me to final round twice.",
      rating: 4,
      initials: 'TM',
      bgColor: 'bg-indigo-500'
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
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-foreground">
              4.6 average from 1,200+ reviews
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="block text-foreground">What people are saying</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Real feedback from job seekers who used our platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="testimonial-card rounded-3xl p-8 group animate-fade-in"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {/* Decorative quote icon */}
              <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center rotate-6 group-hover:rotate-12 transition-transform duration-500">
                <Quote className="w-8 h-8 text-blue-500/40 dark:text-blue-400/40" />
              </div>

              {/* Rating Stars with glow effect */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <div key={i} className="relative">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                  </div>
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-foreground/90 mb-8 leading-relaxed text-base font-medium relative z-10">
                "{testimonial.content}"
              </p>

              {/* User Info with enhanced styling */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                <div className={`relative w-14 h-14 ${testimonial.bgColor} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  {testimonial.initials}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-base mb-1">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground font-medium">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Subtle gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
