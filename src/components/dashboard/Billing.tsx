import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, CreditCard, Download, Star, Zap, Shield, Headphones, Sparkles, TrendingUp, Users, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

const Billing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [currentPlan, setCurrentPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [usageStats, setUsageStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedPlansAndFetchData();
  }, []);

  useEffect(() => {
    fetchBillingData();
  }, [billingCycle]);

  const seedPlansAndFetchData = async () => {
    try {
      // Seed plans first
      await supabase.functions.invoke('seed-subscription-plans');
      // Then fetch all data
      await fetchBillingData();
    } catch (error) {
      console.error('Error seeding plans:', error);
      await fetchBillingData();
    }
  };

  const fetchBillingData = async () => {
    try {
      // Fetch subscription plans
      const { data: plansData, error: plansError } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price_monthly', { ascending: true });

      if (plansError) throw plansError;

      // Fetch user subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        throw subscriptionError;
      }

      // Fetch invoices
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('billing_invoices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (invoicesError) throw invoicesError;

      // Fetch usage stats
      const { data: usageData, error: usageError } = await supabase
        .from('user_usage_stats')
        .select('*')
        .single();

      if (usageError && usageError.code !== 'PGRST116') {
        throw usageError;
      }

      // Process and set data - filter plans based on billing cycle
      const filteredPlans = plansData?.filter(plan => {
        if (plan.name === 'Free') return true;
        if (billingCycle === 'monthly') {
          return plan.price_monthly !== null && !plan.name.includes('Yearly');
        } else {
          return plan.price_yearly !== null && (plan.name.includes('Yearly') || plan.price_yearly === 0);
        }
      }) || [];

      const formattedPlans = filteredPlans.map(plan => ({
        id: plan.id,
        name: plan.name.replace(' Yearly', ''),
        monthlyPrice: plan.price_monthly,
        yearlyPrice: plan.price_yearly,
        price: billingCycle === 'monthly' 
          ? `$${plan.price_monthly || 0}` 
          : `$${plan.price_yearly || 0}`,
        period: billingCycle === 'monthly' ? 'per month' : 'per year',
        originalPrice: billingCycle === 'yearly' && plan.price_monthly ? 
          `$${plan.price_monthly * 12}` : null,
        features: plan.features || [],
        icon: getIconForPlan(plan.icon_name),
        color: plan.color_class || 'from-slate-500 to-slate-600',
        popular: plan.is_popular,
        current: subscriptionData?.plan_id === plan.id,
        description: plan.description || '',
        lemonSqueezyVariantId: plan.lemon_squeezy_variant_id,
        savings: billingCycle === 'yearly' && plan.price_monthly ? 
          `Save $${(plan.price_monthly * 12) - plan.price_yearly}` : null
      }));

      const formattedInvoices = invoicesData?.map(invoice => ({
        id: invoice.invoice_number,
        date: new Date(invoice.created_at).toLocaleDateString(),
        amount: `$${parseFloat(invoice.amount.toString()).toFixed(2)}`,
        status: invoice.status,
        description: invoice.description,
        paymentMethod: invoice.payment_method || '•••• 4242'
      })) || [];

      // Find the plan details for the current subscription
      const currentPlanDetails = subscriptionData ? 
        plansData?.find(plan => plan.id === subscriptionData.plan_id) : null;

      const currentSubscription = currentPlanDetails ? {
        name: currentPlanDetails.name,
        price: `$${subscriptionData.price}/${subscriptionData.billing_cycle}`,
        nextBilling: subscriptionData.expires_at ? 
          new Date(subscriptionData.expires_at).toLocaleDateString() : 'N/A',
        features: currentPlanDetails.features || [],
        status: subscriptionData.plan_status
      } : {
        name: 'Free',
        price: '$0/month',
        nextBilling: 'N/A',
        features: ['3 resumes max', 'Basic templates', 'Standard support'],
        status: 'active'
      };

      const currentUsage = usageData ? [
        { 
          label: 'Resumes Created', 
          value: usageData.resumes_created?.toString() || '0', 
          max: currentSubscription.name === 'Free' ? '3' : '∞', 
          color: 'from-blue-500 to-blue-600' 
        },
        { 
          label: 'AI Generations', 
          value: usageData.ai_generations?.toString() || '0', 
          max: currentSubscription.name === 'Free' ? '10' : '∞', 
          color: 'from-purple-500 to-purple-600' 
        },
        { 
          label: 'Downloads', 
          value: usageData.downloads?.toString() || '0', 
          max: '∞', 
          color: 'from-emerald-500 to-emerald-600' 
        },
        { 
          label: 'Templates Used', 
          value: usageData.templates_used?.toString() || '0', 
          max: currentSubscription.name === 'Free' ? '5' : '∞', 
          color: 'from-orange-500 to-orange-600' 
        }
      ] : [];

      setPlans(formattedPlans);
      setCurrentPlan(currentSubscription);
      setInvoices(formattedInvoices);
      setUsageStats(currentUsage);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForPlan = (iconName) => {
    switch (iconName) {
      case 'Shield': return Shield;
      case 'Sparkles': return Sparkles;
      case 'Crown': return Crown;
      case 'Users': return Users;
      default: return Shield;
    }
  };

  const handleUpgrade = async (plan) => {
    if (!plan.lemonSqueezyVariantId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Redirect to Lemon Squeezy checkout
      const checkoutUrl = `https://pitchsorahqs.lemonsqueezy.com/checkout?variant=${plan.lemonSqueezyVariantId}&checkout[email]=${user.email}&checkout[custom][user_id]=${user.id}`;
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error initiating checkout:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50">
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-4">
                <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Billing & Subscription</span>
        </div>
        
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
          Manage Your Plan
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Upgrade, downgrade, or manage your subscription and billing information
        </p>
      </div>

      {/* Current Plan */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
        <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Current Plan: {currentPlan?.name || 'Free'}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">Active subscription</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">
                  {currentPlan?.price || '$0/month'}
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                  {currentPlan?.status || 'active'}
                </Badge>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Next billing date: <span className="font-semibold">{currentPlan?.nextBilling || 'N/A'}</span>
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {currentPlan?.features?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">
                <CreditCard className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
              <Button variant="outline" className="border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl">
                Cancel Subscription
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {usageStats.map((stat, index) => (
          <Card key={index} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl">
            <CardContent className="p-4">
              <div className="text-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                  <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">/ {stat.max}</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-2 shadow-lg">
          <div className="flex gap-2">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 rounded-xl font-semibold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === 'yearly' ? 'default' : 'ghost'}
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 rounded-xl font-semibold transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Yearly
              <Badge className="ml-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 text-xs">
                Save 17%
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
        <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
          <CardTitle className="text-2xl font-bold text-center">Choose Your Plan</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <div key={index} className={`relative p-8 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-2 ${
                  plan.current 
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 shadow-xl' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xl'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-orange-400 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg border-0">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="text-4xl font-bold text-slate-900 dark:text-white">
                          {plan.price}
                        </div>
                        {plan.originalPrice && (
                          <div className="text-lg line-through text-slate-500 dark:text-slate-400">
                            {plan.originalPrice}
                          </div>
                        )}
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{plan.period}</p>
                      {plan.savings && (
                        <Badge className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                          {plan.savings}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      plan.current 
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : `bg-gradient-to-r ${plan.color} hover:shadow-lg text-white`
                    }`}
                    disabled={plan.current || plan.name === 'Free'}
                    onClick={() => handleUpgrade(plan)}
                  >
                    {plan.current ? (
                      <>
                        <Crown className="w-5 h-5 mr-2" />
                        Current Plan
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        {plan.name === 'Free' ? 'Current Plan' : `Upgrade to ${plan.name}`}
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-2xl">
        <CardHeader className="border-b border-slate-200/60 dark:border-slate-700/60">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Billing History</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-normal">Your payment history and invoices</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No invoices yet</p>
              </div>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/30 dark:to-slate-700/30 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-slate-900 dark:text-white">{invoice.id}</p>
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs">
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{invoice.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500 mt-1">
                        <span>{invoice.date}</span>
                        <span>•</span>
                        <span>{invoice.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">{invoice.amount}</span>
                    <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;