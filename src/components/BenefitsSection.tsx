
import React from 'react';
import { CheckCircle, Clock, Target, BarChart3, FileText, Brain, Shield, Zap, Users, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BenefitsSection = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Create professional resumes in minutes with our AI-powered platform',
      color: 'from-yellow-500 to-orange-500',
      delay: '0.1s'
    },
    {
      icon: Target,
      title: 'ATS Optimized',
      description: 'Get past automated screening with ATS-friendly resume formats',
      color: 'from-blue-500 to-cyan-500',
      delay: '0.2s'
    },
    {
      icon: Users,
      title: 'Expert Templates',
      description: 'Choose from templates designed by hiring professionals',
      color: 'from-purple-500 to-pink-500',
      delay: '0.3s'
    },
    {
      icon: TrendingUp,
      title: 'Career Boost',
      description: 'Increase your interview chances with data-driven improvements',
      color: 'from-emerald-500 to-teal-500',
      delay: '0.4s'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared with third parties',
      color: 'from-red-500 to-orange-500',
      delay: '0.5s'
    },
    {
      icon: FileText,
      title: 'Multiple Formats',
      description: 'Download in PDF, Word, or plain text format instantly',
      color: 'from-indigo-500 to-purple-500',
      delay: '0.6s'
    }
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Complex layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-500/5 to-background"></div>
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-30"></div>
      
      {/* Diagonal accent strips */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-purple-500/5 via-transparent to-transparent skew-x-12 transform origin-top-right"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent -skew-x-12 transform origin-bottom-left"></div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 glass-card rounded-full px-8 py-4 mb-10 animate-fade-in hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
            <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <span className="text-base font-bold gradient-text bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Premium Features Included
            </span>
            <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" style={{ animationDelay: '0.4s' }} />
            <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" style={{ animationDelay: '0.6s' }} />
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[0.95] tracking-tighter animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="block text-foreground mb-2 drop-shadow-sm">Everything You Need</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(59,130,246,0.5)]">
              All In One Place
            </span>
          </h2>

          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="text-foreground/80">Powerful features that set you apart from the competition</span>
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="card-3d glass-card-strong rounded-3xl p-8 relative group overflow-hidden animate-fade-in"
                style={{ animationDelay: feature.delay }}
              >
                {/* Animated gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Gradient border effect */}
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                  <div className={`absolute inset-[1px] rounded-3xl bg-background`}></div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} blur-xl`}></div>
                </div>

                <div className="relative z-10">
                  {/* Icon with glow */}
                  <div className="relative mb-6 inline-block">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity rounded-2xl`}></div>
                    <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:gradient-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 transition-all">
                    {feature.title}
                  </h3>
                  
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${feature.color} opacity-5 rounded-tr-3xl`}></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA with enhanced styling */}
        <div className="mt-24 text-center">
          <div className="inline-flex flex-col items-center gap-8 glass-card-strong rounded-3xl px-12 py-10 animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: '0.7s' }}>
            <div className="flex -space-x-4">
              {[
                { gradient: 'from-blue-400 to-blue-600', letter: 'S' },
                { gradient: 'from-purple-400 to-purple-600', letter: 'M' },
                { gradient: 'from-pink-400 to-pink-600', letter: 'E' },
                { gradient: 'from-emerald-400 to-emerald-600', letter: 'D' },
                { gradient: 'from-orange-400 to-orange-600', letter: 'L' }
              ].map((user, i) => (
                <div 
                  key={i}
                  className={`w-16 h-16 bg-gradient-to-br ${user.gradient} rounded-full border-4 border-background flex items-center justify-center text-white text-xl font-black shadow-2xl hover:scale-110 hover:-translate-y-2 transition-all duration-300 cursor-pointer`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {user.letter}
                </div>
              ))}
              <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-4 border-background flex items-center justify-center text-white text-sm font-black shadow-2xl">
                +250K
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-3">
                <Zap className="w-7 h-7 text-yellow-500" />
                <span className="text-4xl font-black gradient-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-[length:200%_auto] animate-gradient">
                  1,200+
                </span>
                <Zap className="w-7 h-7 text-yellow-500" />
              </div>
              <p className="text-lg text-muted-foreground font-medium">
                Professionals already using Pitchsora
              </p>
            </div>

            <Button asChild size="lg" className="saas-button h-16 px-12 text-lg font-bold group mt-4">
              <Link to="/auth" className="flex items-center">
                Join Them Today
                <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative blurred circles */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse hidden lg:block"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse hidden lg:block" style={{ animationDelay: '1.5s' }}></div>
    </section>
  );
};

export default BenefitsSection;
