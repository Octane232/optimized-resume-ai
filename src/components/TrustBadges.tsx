import React from 'react';
import { Shield, Lock, CheckCircle2, Globe } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    {
      icon: Lock,
      title: '256-bit SSL',
      description: 'Bank-level encryption'
    },
    {
      icon: Shield,
      title: 'GDPR Compliant',
      description: 'Your data protected'
    },
    {
      icon: CheckCircle2,
      title: 'SOC 2 Type II',
      description: 'Enterprise security'
    },
    {
      icon: Globe,
      title: 'Privacy First',
      description: 'Never shared or sold'
    }
  ];

  const integrations = [
    'LinkedIn',
    'Indeed',
    'Glassdoor',
    'ZipRecruiter',
    'Google Jobs'
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="text-center mb-12">
          <h3 className="text-lg font-semibold text-foreground mb-8">
            Enterprise-Grade Security & Privacy
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            {badges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-3 glass-card px-5 py-3 rounded-2xl animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground text-sm">{badge.title}</div>
                    <div className="text-xs text-muted-foreground">{badge.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border my-12"></div>

        {/* Integrations */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Works seamlessly with
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
            {integrations.map((integration, index) => (
              <span 
                key={index}
                className="text-xl font-bold text-muted-foreground/50 hover:text-muted-foreground/80 transition-colors cursor-default"
              >
                {integration}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
