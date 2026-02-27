import React from 'react';
import { Shield, Zap, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import VayaChatPreview from './VayaChatPreview';

const BenefitsSection = () => {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-secondary/30">
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
          {/* Left — Copy */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                Meet Vaylance AI
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                Your 24/7 
                <span className="gradient-text"> career assistant</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Ask Vaylance AI anything — analyze your resume, write cover letters, 
                prep for interviews, or find skill gaps. It's like having a career expert on call.
              </p>
            </div>

            {/* Trust signals */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Shield, title: '100% Private', desc: 'Data never shared' },
                { icon: Zap, title: 'Instant Answers', desc: 'Responds in seconds' },
                { icon: Clock, title: 'Always Available', desc: 'Career help 24/7' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="saas-button h-13 sm:h-14 px-8 text-base sm:text-lg font-bold">
              <Link to="/auth" className="flex items-center gap-2">
                Try Vaylance AI Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Right — AI Chat Preview */}
          <div className="order-1 lg:order-2 animate-fade-in">
            <VayaChatPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
