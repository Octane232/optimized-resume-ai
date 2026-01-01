import React from 'react';
import { motion } from 'framer-motion';

interface MatchMeterProps {
  score: number;
  missingCount: number;
  isAnalyzing?: boolean;
}

const MatchMeter = ({ score, missingCount, isAnalyzing }: MatchMeterProps) => {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getScoreColor = () => {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 60) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  const getScoreGlow = () => {
    if (score >= 80) return 'drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]';
    if (score >= 60) return 'drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]';
    return 'drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]';
  };

  const getDynamicMessage = () => {
    if (score >= 90) return "Excellent match! You're a top candidate for this role.";
    if (score >= 80) return "Strong match. Minor tweaks could make you stand out.";
    if (score >= 70) return `Good fit, but the ATS might miss ${missingCount} key skills.`;
    if (score >= 60) return `You're competitive, but ${missingCount} missing keywords hurt your chances.`;
    if (score >= 50) return `Fair match. Add the missing keywords to improve visibility.`;
    return `Low match. Consider tailoring your resume significantly for this role.`;
  };

  return (
    <div className="command-card p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">Match Score</h3>
      
      <div className="flex items-center gap-6">
        {/* Circular Gauge */}
        <div className="relative">
          <svg className={`w-28 h-28 transform -rotate-90 ${getScoreGlow()}`}>
            {/* Background circle */}
            <circle
              cx="56"
              cy="56"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <motion.circle
              cx="56"
              cy="56"
              r="45"
              strokeWidth="8"
              fill="none"
              className={getScoreColor()}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: isAnalyzing ? circumference : strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          
          {/* Score number */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isAnalyzing ? (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <span className="text-3xl font-bold text-foreground">{score}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Dynamic Message */}
        <div className="flex-1">
          <motion.p 
            className="text-sm text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            key={score}
          >
            {isAnalyzing ? 'Analyzing your resume against the job description...' : getDynamicMessage()}
          </motion.p>
          
          {!isAnalyzing && score < 80 && missingCount > 0 && (
            <motion.p 
              className="text-xs text-primary mt-2 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
            >
              ↓ Add {missingCount} keywords below to boost your score
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchMeter;
