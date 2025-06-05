
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, CreditCard, Download } from 'lucide-react';

const Billing = () => {
  const currentPlan = {
    name: 'Pro',
    price: '$19/month',
    features: ['Unlimited resumes', 'AI-powered content', 'Premium templates', 'Priority support'],
    nextBilling: '2024-02-15'
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: ['3 resumes max', 'Basic templates', 'Standard support'],
      current: false
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      features: ['Unlimited resumes', 'AI-powered content', 'Premium templates', 'Priority support'],
      current: true,
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: 'per month',
      features: ['Everything in Pro', 'Team collaboration', 'Advanced analytics', 'Custom branding'],
      current: false
    }
  ];

  const invoices = [
    { id: 'INV-001', date: '2024-01-15', amount: '$19.00', status: 'Paid' },
    { id: 'INV-002', date: '2023-12-15', amount: '$19.00', status: 'Paid' },
    { id: 'INV-003', date: '2023-11-15', amount: '$19.00', status: 'Paid' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Billing & Plans</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your subscription and billing information</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            Current Plan: {currentPlan.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                {currentPlan.price}
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Next billing date: {currentPlan.nextBilling}
              </p>
              <ul className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <Button variant="outline">
                <CreditCard className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
              <Button variant="outline">Cancel Subscription</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div key={index} className={`relative p-6 rounded-lg border-2 ${
                plan.current 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-slate-200 dark:border-slate-700'
              }`}>
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Most Popular
                  </Badge>
                )}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">
                    {plan.price}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{plan.period}</p>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.current ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  disabled={plan.current}
                >
                  {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{invoice.date}</p>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {invoice.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{invoice.amount}</span>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
