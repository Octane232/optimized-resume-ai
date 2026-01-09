import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Lock, Sparkles, TrendingUp, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IndustryBenchmarkProps {
  userScore: number;
  isPremium: boolean;
  onUpgrade: () => void;
  targetRole?: string;
}

const IndustryBenchmark = ({ 
  userScore, 
  isPremium, 
  onUpgrade,
  targetRole = 'your target role'
}: IndustryBenchmarkProps) => {
  // Simulated benchmark data (in production, this would come from an API)
  const benchmarkData = {
    averageScore: 62,
    topPercentile: 85,
    userPercentile: userScore >= 85 ? 95 : userScore >= 75 ? 80 : userScore >= 65 ? 60 : userScore >= 50 ? 40 : 20,
  };

  const isAboveAverage = userScore > benchmarkData.averageScore;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="command-card p-6 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary rounded-full blur-2xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Industry Benchmark</h3>
          </div>
          {isPremium && isAboveAverage && (
            <span className="px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-500 rounded-full flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              Above Average
            </span>
          )}
        </div>

        {isPremium ? (
          <div className="space-y-4">
            {/* Percentile Display */}
            <div className="flex items-center gap-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/30 flex items-center justify-center"
              >
                <div className="text-center">
                  <span className="text-2xl font-bold text-primary">
                    {benchmarkData.userPercentile}%
                  </span>
                </div>
              </motion.div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  Top {100 - benchmarkData.userPercentile}% of candidates
                </p>
                <p className="text-xs text-muted-foreground">
                  for {targetRole} positions
                </p>
              </div>
            </div>

            {/* Comparison Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Your Score</span>
                <span className="font-medium text-foreground">{userScore}</span>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                {/* Average Marker */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-muted-foreground/50 z-10"
                  style={{ left: `${benchmarkData.averageScore}%` }}
                />
                {/* Top Percentile Marker */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-emerald-500/50 z-10"
                  style={{ left: `${benchmarkData.topPercentile}%` }}
                />
                {/* User Score */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${userScore}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full rounded-full ${
                    isAboveAverage 
                      ? 'bg-gradient-to-r from-primary to-emerald-500' 
                      : 'bg-gradient-to-r from-amber-500 to-primary'
                  }`}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                  Avg: {benchmarkData.averageScore}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                  Top: {benchmarkData.topPercentile}
                </span>
                <span>100</span>
              </div>
            </div>

            {/* Insight */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`p-3 rounded-lg ${
                isAboveAverage 
                  ? 'bg-emerald-500/10 border border-emerald-500/20' 
                  : 'bg-amber-500/10 border border-amber-500/20'
              }`}
            >
              <p className="text-xs text-muted-foreground flex items-start gap-2">
                <TrendingUp className={`w-4 h-4 shrink-0 ${isAboveAverage ? 'text-emerald-500' : 'text-amber-500'}`} />
                {isAboveAverage 
                  ? `Great job! Your resume scores ${userScore - benchmarkData.averageScore} points above the industry average.`
                  : `Your resume is ${benchmarkData.averageScore - userScore} points below average. Follow the AI suggestions to improve.`
                }
              </p>
            </motion.div>
          </div>
        ) : (
          /* Locked State */
          <div className="relative">
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-lg">
              <div className="text-center p-4">
                <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground mb-1">
                  See How You Compare
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  Unlock percentile ranking against other candidates
                </p>
                <Button size="sm" onClick={onUpgrade} className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Unlock with Pro
                </Button>
              </div>
            </div>
            <div className="blur-sm opacity-50 pointer-events-none">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
              <div className="h-3 bg-muted rounded-full" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default IndustryBenchmark;
