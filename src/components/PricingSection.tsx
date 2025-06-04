
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        '1 Resume download',
        'Basic templates',
        'AI-powered content suggestions',
        'ATS optimization'
      ],
      buttonText: 'Get Started Free',
      popular: false
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'Best for active job seekers',
      features: [
        'Unlimited resume downloads',
        'Premium templates',
        'Advanced AI customization',
        'Cover letter generator',
        'Multiple resume versions',
        'Job discovery & matching',
        'Priority support'
      ],
      buttonText: 'Start 7-Day Free Trial',
      popular: true
    },
    {
      name: 'Pro+',
      price: '$79.99',
      period: 'per year',
      description: 'Maximum value for career growth',
      features: [
        'Everything in Pro',
        'LinkedIn profile optimization',
        'Job application tracking',
        'Career coaching tips',
        'Resume analytics',
        'Priority phone support'
      ],
      buttonText: 'Start 7-Day Free Trial',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start with a 7-day free trial, upgrade when you need more features
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-8 relative animate-fade-in ${
                plan.popular ? 'ring-2 ring-navy-500 scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-navy-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <p className="text-gray-600">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.popular 
                    ? 'gradient-bg hover:opacity-90' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need a custom solution for your team?
          </p>
          <Button variant="outline" className="border-navy-300 text-navy-600 hover:bg-navy-50">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
