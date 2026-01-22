import React from 'react';
import { TrendingUp, DollarSign, Target, Sparkles } from 'lucide-react';

const VaultInsightsTeaser = () => {
  return (
    <div className="command-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground text-sm">Vault Insights</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-secondary/50 rounded-lg text-center">
          <Target className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Skills Gap</p>
          <p className="font-bold text-lg text-foreground">4 missing</p>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg text-center">
          <DollarSign className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Market Value</p>
          <p className="font-bold text-lg text-foreground">$95k-$130k</p>
        </div>
        <div className="p-3 bg-secondary/50 rounded-lg text-center">
          <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">Profile Rank</p>
          <p className="font-bold text-lg text-foreground">Top 23%</p>
        </div>
      </div>
    </div>
  );
};

export default VaultInsightsTeaser;
