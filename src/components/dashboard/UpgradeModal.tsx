import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SubscriptionTier } from '@/hooks/useSubscriptionLimits';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: string;
  requiredTier: 'pro' | 'premium';
  currentTier: SubscriptionTier;
  resetDate?: Date;
  limitType?: 'templates' | 'downloads' | 'ai' | 'feature';
}

const tierFeatures = {
  pro: {
    name: 'Pro',
    price: '$12',
    color: 'from-blue-500 to-cyan-500',
    features: [
      '5 template selections/month',
      '10 PDF downloads/month',
      '5 AI resume generations/month',
      '5 active resumes',
      'AI Resume Generator',
      'Cover Letter Generator',
      'ATS Scoring',
    ],
  },
  premium: {
    name: 'Premium',
    price: '$24',
    color: 'from-purple-500 to-pink-600',
    features: [
      'Unlimited templates',
      'Unlimited PDF downloads',
      'Unlimited AI generations',
      'Unlimited active resumes',
      'AI Resume Generator',
      'Cover Letter Generator',
      'Full ATS Analysis',
      'Interview Prep',
      'Skill Gap Analyzer',
      'Priority Support',
    ],
  },
};

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  open,
  onOpenChange,
  feature,
  requiredTier,
  currentTier,
  resetDate,
  limitType,
}) => {
  const navigate = useNavigate();
  const tierInfo = tierFeatures[requiredTier];

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate('/dashboard', { state: { activeTab: 'billing' } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-2xl">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
            {limitType === 'feature' ? 'Premium Feature' : 'Limit Reached'}
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            {limitType === 'feature' ? (
              <span><strong>{feature}</strong> requires a {tierInfo.name} subscription.</span>
            ) : (
              <span>You've reached your monthly limit for <strong>{feature}</strong>.</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {resetDate && limitType !== 'feature' && (
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your limits reset on <strong>{resetDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</strong>
              </p>
            </div>
          )}

          <div className={`p-6 bg-gradient-to-br ${tierInfo.color}/10 rounded-2xl border border-slate-200/50 dark:border-slate-700/50`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${tierInfo.color} rounded-xl flex items-center justify-center`}>
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{tierInfo.name}</h3>
                  <p className="text-sm text-slate-500">{tierInfo.price}/month</p>
                </div>
              </div>
              <Badge className={`bg-gradient-to-r ${tierInfo.color} text-white border-0`}>
                Recommended
              </Badge>
            </div>

            <ul className="space-y-2">
              {tierInfo.features.slice(0, 5).map((feat, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {feat}
                </li>
              ))}
              {tierInfo.features.length > 5 && (
                <li className="text-sm text-slate-500">
                  +{tierInfo.features.length - 5} more features
                </li>
              )}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleUpgrade}
              className={`w-full h-12 bg-gradient-to-r ${tierInfo.color} hover:shadow-lg text-white font-semibold rounded-xl transition-all duration-300`}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Upgrade to {tierInfo.name}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="text-slate-500 hover:text-slate-700"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
