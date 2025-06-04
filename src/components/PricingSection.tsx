
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Free',
      monthlyPrice: '$0',
      annualPrice: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '1 Resume download',
        'Basic templates',
        'AI-powered content suggestions',
        'ATS optimization',
        'Basic job search'
      ],
      buttonText: 'Get Started Free',
      popular: false,
      isFree: true
    },
    {
      name: 'Pro',
      monthlyPrice: '$19.99',
      annualPrice: '$199.99',
      period: isAnnual ? 'per year' : 'per month',
      description: 'Best for active job seekers',
      features: [
        'Unlimited resume downloads',
        'Premium templates (50+)',
        'Advanced AI customization',
        'Cover letter generator',
        'Multiple resume versions',
        'Smart job discovery & matching',
        'Resume analytics & insights',
        'Priority support',
        'ATS score optimization'
      ],
      buttonText: 'Start 7-Day Free Trial',
      popular: true,
      savings: isAnnual ? 'Save $40' : null
    },
    {
      name: 'Pro+',
      monthlyPrice: '$39.99',
      annualPrice: '$399.99',
      period: isAnnual ? 'per year' : 'per month',
      description: 'Maximum value for career growth',
      features: [
        'Everything in Pro',
        'LinkedIn profile optimization',
        'Job application tracking',
        'Career coaching insights',
        'Advanced resume analytics',
        'Interview preparation tips',
        'Salary negotiation guidance',
        'Priority phone support',
        'Custom branding options',
        'API access'
      ],
      buttonText: 'Start 7-Day Free Trial',
      popular: false,
      savings: isAnnual ? 'Save $80' : null
    }
  ];

  return (
    <section id="pricing" className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            Start with a 7-day free trial, upgrade when you need more features
          </p>
          
          {/* Monthly/Annual Toggle */}
          <div className="flex items-center justify-center mb-8">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`mx-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isAnnual ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Save up to 20%
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-2xl transition-all duration-500 p-8 relative animate-fade-in border transform hover:scale-105 hover:-translate-y-2 ${
                plan.popular 
                  ? 'ring-2 ring-blue-500 dark:ring-blue-400 scale-105 border-blue-200 dark:border-blue-700' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-700'
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {plan.savings && (
                <div className="absolute -top-2 -right-2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {plan.savings}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {isAnnual && !plan.isFree ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">/{plan.period}</span>
                  {isAnnual && !plan.isFree && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      ${(parseFloat(plan.annualPrice.replace('$', '')) / 12).toFixed(2)}/month billed annually
                    </div>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full transition-all duration-300 transform hover:scale-105 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl' 
                    : plan.isFree
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Need a custom solution for your team?
          </p>
          <Button variant="outline" className="border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
