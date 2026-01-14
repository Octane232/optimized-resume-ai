import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Lock, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ATSAnalysis {
  overall_score: number;
  formatting_score: number;
  keywords_score: number;
  experience_score: number;
  education_score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: { category: string; suggestion: string; priority: string }[];
  missing_keywords?: string[];
}

interface DeepAnalysisCardProps {
  analysis: ATSAnalysis | null;
  isAnalyzing: boolean;
  onAnalyze: () => void;
}

const DeepAnalysisCard = ({ 
  analysis, 
  isAnalyzing, 
  onAnalyze
}: DeepAnalysisCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const categories = analysis ? [
    { label: 'Formatting', score: analysis.formatting_score, icon: '📝' },
    { label: 'Keywords', score: analysis.keywords_score, icon: '🔑' },
    { label: 'Experience', score: analysis.experience_score, icon: '💼' },
    { label: 'Education', score: analysis.education_score, icon: '🎓' },
  ] : [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="command-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">AI Deep Analysis</h2>
        </div>
        {!analysis && !isAnalyzing && (
          <Button
            onClick={onAnalyze}
            size="sm"
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Run AI Analysis
          </Button>
        )}
      </div>

      {isAnalyzing ? (
        <div className="space-y-4 py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm text-muted-foreground">Analyzing your resume with AI...</p>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      ) : analysis ? (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted/20"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="40"
                  strokeWidth="8"
                  fill="none"
                  className={getProgressColor(analysis.overall_score).replace('bg-', 'stroke-')}
                  strokeLinecap="round"
                  strokeDasharray={251.2}
                  initial={{ strokeDashoffset: 251.2 }}
                  animate={{ strokeDashoffset: 251.2 - (analysis.overall_score / 100) * 251.2 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${getScoreColor(analysis.overall_score)}`}>
                  {analysis.overall_score}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-1">AI Analysis Complete</p>
              <p className="text-xs text-muted-foreground">
                Your resume has been analyzed against ATS best practices and industry standards.
              </p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="p-3 rounded-lg bg-muted/30 border border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <span>{cat.icon}</span>
                    {cat.label}
                  </span>
                  <span className={`text-sm font-bold ${getScoreColor(cat.score)}`}>
                    {cat.score}
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${getProgressColor(cat.score)} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.score}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                Strengths
              </p>
              <ul className="space-y-1">
                {analysis.strengths.slice(0, 3).map((s, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="text-xs text-muted-foreground pl-3 border-l-2 border-emerald-500/30"
                  >
                    {s}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-500" />
                Needs Work
              </p>
              <ul className="space-y-1">
                {analysis.weaknesses.slice(0, 3).map((w, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    className="text-xs text-muted-foreground pl-3 border-l-2 border-amber-500/30"
                  >
                    {w}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Top Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-foreground">Priority Actions</p>
              <div className="space-y-2">
                {analysis.suggestions.slice(0, 3).map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    className={`flex items-start gap-2 p-2 rounded text-xs ${
                      s.priority === 'high' 
                        ? 'bg-destructive/10 border border-destructive/20' 
                        : s.priority === 'medium'
                        ? 'bg-amber-500/10 border border-amber-500/20'
                        : 'bg-muted/50 border border-border'
                    }`}
                  >
                    <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{s.suggestion}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="grid grid-cols-2 gap-3 opacity-50">
          {['Formatting', 'Keywords', 'Experience', 'Education'].map((label) => (
            <div key={label} className="p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-sm font-bold text-muted-foreground">--</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full" />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default DeepAnalysisCard;
