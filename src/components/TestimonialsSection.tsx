
import React from 'react';
import { Star, Quote, TrendingUp, Zap } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Manager', 
      company: 'TechCorp',
      content: 'AI Resume Pro helped me land my dream job! The AI-generated resume was perfectly tailored to the position, and I got 3 interviews within a week.',
      rating: 5,
      initials: 'SJ',
      bgColor: 'bg-blue-500'
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      company: 'StartupXYZ', 
      content: 'The ATS optimization really works! I went from getting no responses to multiple interview requests. The templates are clean and professional.',
      rating: 5,
      initials: 'MC',
      bgColor: 'bg-purple-500'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Project Manager',
      company: 'Global Industries',
      content: 'I loved how easy it was to customize my resume for different job applications. The AI suggestions helped me highlight the right skills.',
      rating: 5,
      initials: 'ER',
      bgColor: 'bg-emerald-500'
    },
    {
      name: 'David Kim',
      role: 'Data Scientist',
      company: 'Analytics Pro',
      content: 'The resume suggestions were spot-on. I received 5 interview calls in 2 weeks. The platform is intuitive and the results speak for themselves.',
      rating: 5,
      initials: 'DK',
      bgColor: 'bg-orange-500'
    },
    {
      name: 'Lisa Park',
      role: 'UX Designer',
      company: 'Design Studio',
      content: 'Finally, a resume builder that understands design! The templates are modern and helped me showcase my portfolio perfectly.',
      rating: 5,
      initials: 'LP',
      bgColor: 'bg-pink-500'
    },
    {
      name: 'James Wilson',
      role: 'Sales Director',
      company: 'Growth Inc',
      content: 'Switched from my old resume and saw immediate results. The AI suggestions for sales metrics were incredibly helpful.',
      rating: 5,
      initials: 'JW',
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
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 mb-8 animate-fade-in">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-semibold gradient-text bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              250,000+ Success Stories
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="block gradient-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] animate-gradient">
              Real results
            </span>
            <span className="block text-foreground">from real people</span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Join thousands of professionals who accelerated their careers with AI-powered tools
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

        {/* Bottom CTA with advanced styling */}
        <div className="text-center mt-24">
          <div className="inline-flex items-center gap-6 glass-card-strong rounded-3xl px-10 py-6 animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <div className="flex -space-x-3">
              {[
                { bg: 'bg-gradient-to-br from-blue-400 to-blue-600', letter: 'S' },
                { bg: 'bg-gradient-to-br from-purple-400 to-purple-600', letter: 'M' },
                { bg: 'bg-gradient-to-br from-emerald-400 to-emerald-600', letter: 'E' },
                { bg: 'bg-gradient-to-br from-orange-400 to-orange-600', letter: 'D' },
                { bg: 'bg-gradient-to-br from-pink-400 to-pink-600', letter: 'L' }
              ].map((user, i) => (
                <div 
                  key={i}
                  className={`w-12 h-12 ${user.bg} rounded-full border-4 border-background flex items-center justify-center text-white text-sm font-bold shadow-xl animate-pulse`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  {user.letter}
                </div>
              ))}
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border-4 border-background flex items-center justify-center text-white text-xs font-bold shadow-xl">
                +250K
              </div>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold gradient-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] animate-gradient">
                  250,000+
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Professionals landed their dream jobs
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
