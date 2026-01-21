import React from 'react';
import { Star, Quote, Sparkles, Bot, CheckCircle } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Marcus Thompson',
      role: 'Product Manager', 
      company: 'Spotify',
      content: "Vaylance is like having a career coach in my pocket. It found keyword gaps I never noticed and rewrote my bullets with real impact. Got 2 interviews in the first week.",
      rating: 5,
      highlight: 'keyword gaps',
      initials: 'MT',
      bgColor: 'bg-blue-500',
      verified: true,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      company: 'Google', 
      content: "After months of silence from applications, I asked Vaylance AI to analyze my resume. It showed me exactly why I was getting filtered out. Landed 3 interviews after the fixes.",
      rating: 5,
      highlight: 'getting filtered out',
      initials: 'PS',
      bgColor: 'bg-purple-500',
      verified: true,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Alex Rodriguez',
      role: 'Marketing Specialist',
      company: 'HubSpot',
      content: "I was skeptical about an 'AI career assistant' but Vaylance genuinely understands context. It wrote a cover letter that actually sounded like me, not generic AI fluff.",
      rating: 5,
      highlight: 'sounded like me',
      initials: 'AR',
      bgColor: 'bg-emerald-500',
      verified: true,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Jordan Kim',
      role: 'Data Analyst',
      company: 'Netflix',
      content: "The job match scoring is surprisingly accurate. Vaylance told me a role was only 62% match and explained why. Saved me from wasting time on jobs I wouldn't get.",
      rating: 5,
      highlight: 'job match scoring',
      initials: 'JK',
      bgColor: 'bg-orange-500',
      verified: true,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Sam Liu',
      role: 'UX Designer',
      company: 'Figma',
      content: "Asked Vaylance AI to help me pivot from graphic design to UX. It identified transferable skills I overlooked and helped me reframe my entire experience. Game changer.",
      rating: 5,
      highlight: 'transferable skills',
      initials: 'SL',
      bgColor: 'bg-pink-500',
      verified: true,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Taylor Mitchell',
      role: 'Sales Manager',
      company: 'Salesforce',
      content: "Vaylance's follow-up email suggestions are gold. It reminded me to follow up on day 5 and drafted the perfect message. Got me to final round twice.",
      rating: 5,
      highlight: 'follow-up email',
      initials: 'TM',
      bgColor: 'bg-indigo-500',
      verified: true,
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
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
              Loved by Job Seekers
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="block text-foreground">What People Say About</span>
            <span className="gradient-text">Vaylance</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Real feedback from job seekers who let Vaylance guide their career journey
          </p>
          
          {/* Rating summary */}
          <div className="flex items-center justify-center gap-2 mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground ml-2">4.8 average from 2,400+ users</span>
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
              <div className="absolute top-6 right-6 w-16 h-16 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl flex items-center justify-center rotate-6 group-hover:rotate-12 transition-transform duration-500">
                <Quote className="w-8 h-8 text-primary/40" />
              </div>

              {/* Vaylance mention badge */}
              <div className="flex items-center gap-1.5 mb-4">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                  <Bot className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium text-primary">Vaylance User</span>
              </div>

              {/* Rating Stars with glow effect */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <div key={i} className="relative">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                  </div>
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-muted/30" />
                ))}
              </div>

              {/* Testimonial Content */}
              <p className="text-foreground/90 mb-8 leading-relaxed text-base font-medium relative z-10">
                "{testimonial.content}"
              </p>

              {/* User Info with enhanced styling */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-foreground text-base">
                      {testimonial.name}
                    </h4>
                    {testimonial.verified && (
                      <div className="flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {testimonial.role} at <span className="text-foreground">{testimonial.company}</span>
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
