import React from 'react';
import { Lock, TrendingUp, DollarSign, Target, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VaultInsightsTeaserProps {
  onUpgrade: () => void;
}

const VaultInsightsTeaser = ({ onUpgrade }: VaultInsightsTeaserProps) => {
  return (
    <div className="command-card p-5 relative overflow-hidden">
      {/* Blur Overlay */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
        <div className="p-3 rounded-full bg-primary/10 mb-3">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <p className="font-semibold text-foreground mb-1">Premium Insights</p>
        <p className="text-xs text-muted-foreground mb-3 text-center max-w-[200px]">
          Unlock career analytics powered by AI
        </p>
        <Button 
          size="sm" 
          onClick={onUpgrade}
          className="bg-gradient-to-r from-primary to-electric hover:opacity-90"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Unlock with Pro
        </Button>
      </div>
      
      {/* Blurred Content Preview */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground text-sm">Vault Insights</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-secondary/50 rounded-lg text-center">
          <Target className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Skills Gap</p>
          <p className="font-bold text-lg text-foreground">4 missing</p>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg text-center">
          <DollarSign className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Market Value</p>
          <p className="font-bold text-lg text-foreground">$95k-$130k</p>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg text-center">
          <TrendingUp className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Profile Rank</p>
          <p className="font-bold text-lg text-foreground">Top 23%</p>
        </div>
      </div>
    </div>
  );
};

export default VaultInsightsTeaser;
