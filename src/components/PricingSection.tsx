import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingSection = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '1 professional resume',
        '5 templates to choose from',
        'Basic AI suggestions',
        'PDF download',
        'Email support'
      ],
      cta: 'Start Free',
      popular: false,
      href: '/auth'
    },
    {
      name: 'Professional',
      price: '$29',
      period: 'per month',
      description: 'Everything you need to land interviews',
      features: [
        'Unlimited resumes',
        '50+ premium templates',
        'Advanced AI content generation',
        'ATS optimization score',
        'Cover letter builder',
        'Resume analytics',
        'Priority support',
        'LinkedIn optimization'
      ],
      cta: 'Start 14-day trial',
      popular: true,
      href: '/auth'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For teams and organizations',
      features: [
        'Everything in Professional',
        'Team collaboration tools',
        'Custom branding',
        'Advanced analytics dashboard',
        'SSO integration',
        'Dedicated account manager',
        'Custom integrations',
        'Priority phone support'
      ],
      cta: 'Contact Sales',
      popular: false,
      href: '/contact'
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            Pricing
          </div>
          <h2 className="heading-lg text-gray-900 dark:text-white mb-6 text-balance">
            Choose the plan that fits your goals
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-balance">
            Start free and upgrade as your career grows. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`enterprise-card p-8 relative fade-in-up ${
                plan.popular ? 'ring-2 ring-blue-600 dark:ring-blue-400 scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600 dark:text-gray-400 ml-1">
                      /{plan.period}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                asChild
                className={`w-full ${
                  plan.popular 
                    ? 'saas-button' 
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <Link to={plan.href}>
                  {plan.cta}
                  {plan.name !== 'Enterprise' && <ArrowRight className="ml-2 w-4 h-4" />}
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Money back guarantee */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Check className="w-4 h-4 text-green-500" />
            30-day money-back guarantee on all paid plans
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;