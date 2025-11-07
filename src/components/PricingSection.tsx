import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Create 1 resume or profile',
        'Access to basic job search (limited to 10 job listings per day)',
        'Basic AI interview questions (up to 5 per session)',
        'Access to 1 job alert or recommendation per week',
        'Email notifications for new jobs (once per week)',
        'Save up to 2 job applications',
        'Basic career tips or articles',
        'Community support / Help center only'
      ],
      cta: 'Start Free',
      popular: false,
      href: '/auth'
    },
    {
      name: 'Premium',
      price: '$9',
      yearlyPrice: '$84',
      monthlyPrice: '$9',
      period: 'per month',
      description: 'Everything you need to land your dream job',
      features: [
        'Unlimited job searches & listings',
        'AI Interview Coach (up to 20 questions per session)',
        'Generate unlimited AI-based interview answers',
        'Resume builder (up to 5 resumes)',
        'Save unlimited jobs',
        'Daily job alerts (via email or dashboard)',
        'Download interview prep materials (PDF or notes)',
        'Priority email support'
      ],
      cta: 'Start Premium',
      popular: true,
      href: '/auth'
    },
    {
      name: 'Premium Plus',
      price: '$19',
      yearlyPrice: '$168',
      monthlyPrice: '$19',
      period: 'per month',
      description: 'Advanced features for serious job seekers',
      features: [
        'Everything in Premium',
        'Access to global job APIs (worldwide listings)',
        'Smart job matching (AI recommends top jobs)',
        'Unlimited AI interview simulations (mock interviews with feedback)',
        'Resume optimization (AI-enhanced resume scoring)',
        'Personalized career path suggestions',
        'Direct recruiter contact (if available via API)',
        'Exclusive insights & premium resources',
        'Early access to new features'
      ],
      cta: 'Get Premium Plus',
      popular: false,
      href: '/auth'
    }
  ];

  return (
    <section id="pricing" className="relative py-32 overflow-hidden bg-background">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-50"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-bl from-purple-400/20 to-emerald-400/20 dark:from-purple-500/10 dark:to-emerald-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-6 py-3 mb-8 animate-fade-in">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
            <span className="text-sm font-semibold gradient-text bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Flexible Pricing
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1] tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="block text-foreground drop-shadow-sm">Choose the plan</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(59,130,246,0.5)]">
              that fits your goals
            </span>
          </h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="text-foreground/80">Start free and upgrade as your career grows. No hidden fees, cancel anytime.</span>
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <span className={`text-lg font-semibold transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-16 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all hover:shadow-lg"
          >
            <div
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                isYearly ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-lg font-semibold transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Yearly
          </span>
          <span className="glass-card px-3 py-1 rounded-full text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Save 22%
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`pricing-card-premium rounded-3xl p-10 relative group animate-fade-in ${
                plan.popular ? 'scale-105 z-10' : ''
              }`}
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {/* Rotating gradient border effect */}
              <div className="relative z-10">
                {plan.popular && (
                  <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
                    <div className="saas-button px-6 py-2 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-10">
                  <h3 className="text-3xl font-extrabold text-foreground mb-4">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-6xl font-extrabold gradient-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] group-hover:animate-gradient">
                      {plan.yearlyPrice && isYearly ? plan.yearlyPrice : plan.price}
                    </span>
                    {(plan.period || isYearly) && (
                      <span className="text-muted-foreground text-lg font-medium ml-2">
                        /{isYearly ? 'year' : plan.period}
                      </span>
                    )}
                  </div>
                  {plan.yearlyPrice && isYearly && plan.monthlyPrice && (
                    <p className="text-sm text-muted-foreground mb-2">
                      That's {plan.monthlyPrice.replace('$', '$')}/month billed annually
                    </p>
                  )}
                  <p className="text-muted-foreground text-base font-medium">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-5 mb-10">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-4 group/item">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-foreground/90 font-medium group-hover/item:text-foreground transition-colors">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  asChild
                  size="lg"
                  className={`w-full h-14 text-lg font-bold ${
                    plan.popular 
                      ? 'saas-button' 
                      : 'glass-card hover:border-primary/50 transition-all'
                  }`}
                >
                  <Link to={plan.href} className="flex items-center justify-center">
                    {plan.cta}
                    {plan.name !== 'Enterprise' && <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Money back guarantee with enhanced styling */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-3 glass-card rounded-2xl px-8 py-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-6 h-6 text-white" />
            </div>
            <span className="text-base font-semibold text-foreground">
              30-day money-back guarantee on all paid plans
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;