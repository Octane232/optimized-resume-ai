import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronRight, CheckCircle2, AlertTriangle, Info, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Recommendation {
  action: string;
  section: 'summary' | 'experience' | 'skills' | 'education' | 'other';
  priority: 'high' | 'medium' | 'low';
  example?: string;
}

interface Gap {
  gap: string;
  severity: 'critical' | 'moderate' | 'minor';
  suggestion: string;
}

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
  gaps: Gap[];
  fitSummary?: string;
  atsWarnings?: string[];
  onApplyRecommendation?: (recommendation: Recommendation) => void;
}

const RecommendationsPanel = ({ 
  recommendations, 
  gaps, 
  fitSummary,
  atsWarnings = [],
  onApplyRecommendation 
}: RecommendationsPanelProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'moderate': return <Info className="w-4 h-4 text-amber-400" />;
      default: return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSectionLabel = (section: string) => {
    const labels: Record<string, string> = {
      summary: 'Summary',
      experience: 'Experience',
      skills: 'Skills',
      education: 'Education',
      other: 'Other'
    };
    return labels[section] || section;
  };

  const highPriorityRecs = recommendations.filter(r => r.priority === 'high');
  const otherRecs = recommendations.filter(r => r.priority !== 'high');
  const criticalGaps = gaps.filter(g => g.severity === 'critical');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="command-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">AI Recommendations</h3>
          <p className="text-xs text-muted-foreground">
            {recommendations.length} actions to improve your match
          </p>
        </div>
        {highPriorityRecs.length > 0 && (
          <Badge variant="destructive" className="text-xs">
            {highPriorityRecs.length} High Priority
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Fit Summary */}
        {fitSummary && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-lg bg-primary/10 border border-primary/20"
          >
            <p className="text-sm text-foreground leading-relaxed">{fitSummary}</p>
          </motion.div>
        )}

        {/* ATS Warnings */}
        {atsWarnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              ATS Warnings
            </h4>
            <div className="space-y-1">
              {atsWarnings.map((warning, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2 p-2 rounded bg-red-500/10 border border-red-500/20"
                >
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-red-300">{warning}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Critical Gaps */}
        {criticalGaps.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Critical Gaps to Address
            </h4>
            <div className="space-y-2">
              {criticalGaps.map((gap, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 rounded-lg border border-red-500/20 bg-red-500/5"
                >
                  <div className="flex items-start gap-2">
                    {getSeverityIcon(gap.severity)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{gap.gap}</p>
                      <p className="text-xs text-muted-foreground mt-1">{gap.suggestion}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Actionable Improvements
          </h4>
          <div className="space-y-2">
            <AnimatePresence>
              {[...highPriorityRecs, ...otherRecs].map((rec, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-3 rounded-lg border border-border hover:border-primary/30 bg-card hover:bg-muted/30 transition-all cursor-pointer"
                  onClick={() => onApplyRecommendation?.(rec)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {getSectionLabel(rec.section)}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground">{rec.action}</p>
                      {rec.example && (
                        <p className="text-xs text-muted-foreground mt-1.5 italic border-l-2 border-primary/30 pl-2">
                          "{rec.example}"
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Other Gaps */}
        {gaps.filter(g => g.severity !== 'critical').length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Other Skill Gaps
            </h4>
            <div className="flex flex-wrap gap-2">
              {gaps.filter(g => g.severity !== 'critical').map((gap, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="group relative"
                >
                  <Badge 
                    variant="outline" 
                    className={`cursor-help ${gap.severity === 'moderate' ? 'border-amber-500/30 text-amber-400' : 'border-border'}`}
                  >
                    {gap.gap}
                  </Badge>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover border border-border rounded text-xs text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {gap.suggestion}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecommendationsPanel;
