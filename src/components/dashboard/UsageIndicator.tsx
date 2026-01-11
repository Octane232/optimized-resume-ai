import React from 'react';
import { 
  Zap, 
  FileText, 
  Sparkles, 
  Clock, 
  Crown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface UsageIndicatorProps {
  compact?: boolean;
  showUpgradeButton?: boolean;
}

const UsageIndicator: React.FC<UsageIndicatorProps> = ({ 
  compact = false,
  showUpgradeButton = true 
}) => {
  const navigate = useNavigate();
  const { 
    tier, 
    limits, 
    usage, 
    getRemainingDownloads, 
    getRemainingAIGenerations 
  } = useSubscription();

  const isPremium = tier === 'premium';

  // Calculate usage percentages
  const pdfLimit = limits.pdfDownloads;
  const aiLimit = limits.aiGenerations;
  
  const pdfUsagePercent = pdfLimit === Infinity 
    ? 0 
    : (usage.monthlyPdfDownloads / pdfLimit) * 100;
  
  const aiUsagePercent = aiLimit === Infinity 
    ? 0 
    : (usage.monthlyAiGenerations / aiLimit) * 100;

  const remainingPdf = getRemainingDownloads();
  const remainingAi = getRemainingAIGenerations();

  // Days until reset
  const daysUntilReset = usage.usageCycleResetDate 
    ? Math.max(0, Math.ceil((new Date(usage.usageCycleResetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) + 30)
    : 30;

  // Urgency levels
  const getPdfUrgency = () => {
    if (pdfLimit === Infinity) return 'none';
    if (remainingPdf === 0) return 'critical';
    if (pdfUsagePercent >= 80) return 'warning';
    return 'normal';
  };

  const getAiUrgency = () => {
    if (aiLimit === Infinity) return 'none';
    if (remainingAi === 0) return 'critical';
    if (aiUsagePercent >= 80) return 'warning';
    return 'normal';
  };

  const pdfUrgency = getPdfUrgency();
  const aiUrgency = getAiUrgency();

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-500 bg-red-500/10';
      case 'warning': return 'text-amber-500 bg-amber-500/10';
      default: return 'text-emerald-500 bg-emerald-500/10';
    }
  };

  const getProgressColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-primary';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-xs">
        {/* PDF Downloads */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${getUrgencyColor(pdfUrgency)}`}>
          <FileText className="w-3 h-3" />
          <span className="font-medium">
            {pdfLimit === Infinity 
              ? '∞' 
              : `${remainingPdf}/${pdfLimit}`}
          </span>
          {pdfUrgency === 'critical' && <AlertTriangle className="w-3 h-3" />}
        </div>

        {/* AI Generations */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${getUrgencyColor(aiUrgency)}`}>
          <Sparkles className="w-3 h-3" />
          <span className="font-medium">
            {aiLimit === Infinity 
              ? '∞' 
              : `${remainingAi}/${aiLimit}`}
          </span>
          {aiUrgency === 'critical' && <AlertTriangle className="w-3 h-3" />}
        </div>

        {/* Reset Timer */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{daysUntilReset}d</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm">Usage This Month</h4>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Resets in {daysUntilReset} days</span>
          </div>
        </div>

        {/* Usage Bars */}
        <div className="space-y-3">
          {/* PDF Downloads */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <span>PDF Downloads</span>
              </div>
              <span className={`font-medium ${pdfUrgency === 'critical' ? 'text-red-500' : pdfUrgency === 'warning' ? 'text-amber-500' : ''}`}>
                {pdfLimit === Infinity 
                  ? 'Unlimited' 
                  : `${usage.monthlyPdfDownloads} / ${pdfLimit}`}
              </span>
            </div>
            {pdfLimit !== Infinity && (
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full ${getProgressColor(pdfUrgency)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(pdfUsagePercent, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
            {pdfUrgency === 'critical' && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Limit reached! Upgrade to continue downloading.
              </p>
            )}
          </div>

          {/* AI Generations */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                <span>AI Generations</span>
              </div>
              <span className={`font-medium ${aiUrgency === 'critical' ? 'text-red-500' : aiUrgency === 'warning' ? 'text-amber-500' : ''}`}>
                {aiLimit === Infinity 
                  ? 'Unlimited' 
                  : `${usage.monthlyAiGenerations} / ${aiLimit}`}
              </span>
            </div>
            {aiLimit !== Infinity && (
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full ${getProgressColor(aiUrgency)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(aiUsagePercent, 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
            {aiUrgency === 'critical' && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Limit reached! Upgrade for more AI power.
              </p>
            )}
          </div>
        </div>

        {/* Upgrade CTA */}
        {showUpgradeButton && !isPremium && (pdfUrgency !== 'normal' || aiUrgency !== 'normal') && (
          <Button 
            className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            size="sm"
            onClick={() => navigate('/dashboard?tab=settings')}
          >
            <Crown className="w-4 h-4" />
            Upgrade for Unlimited Access
          </Button>
        )}

        {/* Premium Badge */}
        {isPremium && (
          <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary/10">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">Premium • Unlimited Usage</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageIndicator;
