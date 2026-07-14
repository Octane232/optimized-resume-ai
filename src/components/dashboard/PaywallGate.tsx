import React from 'react';
import { Lock, Sparkles, Check, ArrowRight, Telescope, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUsageLimit } from '@/contexts/UsageLimitContext';

interface PaywallGateProps {
  feature: 'radar' | 'job-search';
  onUpgrade: () => void;
  children: React.ReactNode;
}

const COPY = {
  radar: {
    icon: Telescope,
    title: 'Job Radar is a paid feature',
    subtitle: 'Reach hiring managers 14 days before jobs go public.',
    bullets: [
      'AI-scanned funding & hiring signals',
      'Personalized match score for each company',
      'Alerts delivered before postings go live',
    ],
  },
  'job-search': {
    icon: Search,
    title: 'Job Search is a paid feature',
    subtitle: 'Search millions of live listings across every major board.',
    bullets: [
      'Live jobs from LinkedIn, Indeed, Glassdoor & more',
      'Advanced filters: remote, salary, date, type',
      'One-click apply with your tailored resume',
    ],
  },
};

const PaywallGate: React.FC<PaywallGateProps> = ({ feature, onUpgrade, children }) => {
  const { tier, loading } = useUsageLimit();

  // While we don't yet know the tier, render nothing to avoid a flash.
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isPaid = tier === 'trial' || tier === 'pro' || tier === 'elite';
  if (isPaid) return <>{children}</>;

  const copy = COPY[feature];
  const Icon = copy.icon;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card className="relative overflow-hidden border-2">
        {/* Gradient background accent */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{ background: 'linear-gradient(135deg, hsl(217, 100%, 50%), hsl(262, 83%, 58%))' }}
        />

        <div className="relative p-8 md:p-12 text-center">
          {/* Icon badge */}
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg"
            style={{ background: 'linear-gradient(135deg, hsl(217, 100%, 50%), hsl(262, 83%, 58%))' }}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Flagship badge for radar */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Locked · Upgrade required
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-3">{copy.title}</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{copy.subtitle}</p>

          {/* Bullets */}
          <div className="max-w-md mx-auto mb-8 space-y-3 text-left">
            {copy.bullets.map((b) => (
              <div key={b} className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-foreground">{b}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button
            size="lg"
            onClick={onUpgrade}
            className="gap-2 font-semibold shadow-lg text-white"
            style={{ background: 'linear-gradient(135deg, hsl(217, 100%, 50%), hsl(262, 83%, 58%))' }}
          >
            <Sparkles className="w-4 h-4" />
            Upgrade to unlock
            <ArrowRight className="w-4 h-4" />
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Starts with a free trial · Cancel anytime
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PaywallGate;
