import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, ArrowRight, X } from 'lucide-react';
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
        '1 template selection/month',
        '1 PDF download/month',
        '1 active resume',
        'Basic templates only',
        'Community support',
      ],
      lockedFeatures: [
        'AI Resume Generator',
        'Cover Letter Generator',
        'ATS Scoring',
        'Interview Prep',
        'Skill Gap Analyzer',
      ],
      cta: 'Start Free',
      popular: false,
      href: '/auth'
    },
    {
      name: 'Pro',
      price: '$12',
      yearlyPrice: '$120',
      monthlyPrice: '$12',
      period: 'per month',
      description: 'For serious job seekers',
      features: [
        '5 template selections/month',
        '10 PDF downloads/month',
        '5 AI resume generations/month',
        '5 active resumes',
        'AI Resume Generator',
        'Cover Letter Generator',
        'ATS Scoring',
        'Email support',
      ],
      lockedFeatures: [
        'Interview Prep',
        'Skill Gap Analyzer',
      ],
      cta: 'Start Pro',
      popular: true,
      href: '/auth'
    },
    {
      name: 'Premium',
      price: '$24',
      yearlyPrice: '$240',
      monthlyPrice: '$24',
      period: 'per month',
      description: 'Everything you need to land your dream job',
      features: [
        'Unlimited template selections',
        'Unlimited PDF downloads',
        'Unlimited AI generations',
        'Unlimited active resumes',
        'AI Resume Generator',
        'Cover Letter Generator',
        'Full ATS Analysis',
        'Interview Prep with AI feedback',
        'Skill Gap Analyzer',
        'Priority Support',
      ],
      lockedFeatures: [],
      cta: 'Get Premium',
      popular: false,
      href: '/auth'
    }
  ];

  return (
    <section id="pricing" className="relative py-16 sm:py-24 lg:py-32 overflow-hidden bg-background">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-[var(--gradient-mesh)] opacity-50"></div>
      <div className="absolute top-1/2 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-br from-blue-400/20 to-purple-500/20 dark:from-blue-500/10 dark:to-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-bl from-purple-400/20 to-emerald-400/20 dark:from-purple-500/10 dark:to-emerald-500/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12 sm:mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 animate-fade-in">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
            <span className="text-xs sm:text-sm font-semibold gradient-text bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Flexible Pricing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 leading-[1.1] tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="block text-foreground drop-shadow-sm">Choose the plan</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-[0_2px_20px_rgba(59,130,246,0.5)]">
              that fits your goals
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
            <span className="text-foreground/80">Start free and upgrade as your career grows. No hidden fees, cancel anytime.</span>
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <span className={`text-sm sm:text-lg font-semibold transition-colors ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-14 sm:w-16 h-7 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all hover:shadow-lg"
          >
            <div
              className={`absolute top-1 w-5 sm:w-6 h-5 sm:h-6 bg-white rounded-full shadow-md transition-transform ${
                isYearly ? 'translate-x-7 sm:translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm sm:text-lg font-semibold transition-colors ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Yearly
          </span>
          <span className="glass-card px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Save 22%
          </span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`pricing-card-premium rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 relative group animate-fade-in ${
                plan.popular ? 'md:scale-105 z-10' : ''
              }`}
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              {/* Rotating gradient border effect */}
              <div className="relative z-10">
                {plan.popular && (
                  <div className="absolute -top-10 sm:-top-14 left-1/2 transform -translate-x-1/2">
                    <div className="saas-button px-4 sm:px-6 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold shadow-xl flex items-center gap-1.5 sm:gap-2">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3 sm:mb-4">
                    {plan.name}
                  </h3>
                  <div className="mb-4 sm:mb-6">
                    <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold gradient-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] group-hover:animate-gradient">
                      {plan.yearlyPrice && isYearly ? plan.yearlyPrice : plan.price}
                    </span>
                    {(plan.period || isYearly) && (
                      <span className="text-muted-foreground text-sm sm:text-lg font-medium ml-1 sm:ml-2">
                        /{isYearly ? 'year' : plan.period}
                      </span>
                    )}
                  </div>
                  {plan.yearlyPrice && isYearly && plan.monthlyPrice && (
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                      That's {plan.monthlyPrice.replace('$', '$')}/month billed annually
                    </p>
                  )}
                  <p className="text-muted-foreground text-sm sm:text-base font-medium">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 sm:gap-4 group/item">
                      <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="text-foreground/90 font-medium text-sm sm:text-base group-hover/item:text-foreground transition-colors">{feature}</span>
                    </li>
                  ))}
                  {plan.lockedFeatures?.map((feature, featureIndex) => (
                    <li key={`locked-${featureIndex}`} className="flex items-start gap-2 sm:gap-4 opacity-50">
                      <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
                        <X className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <span className="text-muted-foreground font-medium text-sm sm:text-base line-through">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  asChild
                  size="lg"
                  className={`w-full h-12 sm:h-14 text-base sm:text-lg font-bold ${
                    plan.popular 
                      ? 'saas-button' 
                      : 'glass-card hover:border-primary/50 transition-all'
                  }`}
                >
                  <Link to={plan.href} className="flex items-center justify-center">
                    {plan.cta}
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Money back guarantee with enhanced styling */}
        <div className="text-center mt-12 sm:mt-16 lg:mt-20">
          <div className="inline-flex items-center gap-2 sm:gap-3 glass-card rounded-xl sm:rounded-2xl px-4 sm:px-8 py-3 sm:py-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-sm sm:text-base font-semibold text-foreground">
              30-day money-back guarantee on all paid plans
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;