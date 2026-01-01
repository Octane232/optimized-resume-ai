import React from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowRight, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TargetJobHeaderProps {
  masterResumeTitle?: string;
  targetJobTitle?: string;
  companyName?: string;
  onTailor?: () => void;
  isTailoring?: boolean;
  hasAnalysis?: boolean;
}

const TargetJobHeader = ({ 
  masterResumeTitle = 'Master Resume',
  targetJobTitle,
  companyName,
  onTailor,
  isTailoring,
  hasAnalysis
}: TargetJobHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="command-card p-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        {/* Comparison Display */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Source Resume */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{masterResumeTitle}</span>
          </div>

          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />

          {/* Target Job */}
          {targetJobTitle ? (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20"
            >
              <Target className="w-4 h-4 text-primary" />
              <div>
                <span className="text-sm font-medium text-foreground">{targetJobTitle}</span>
                {companyName && (
                  <span className="text-xs text-muted-foreground ml-1">at {companyName}</span>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-dashed border-border">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Paste a job description below</span>
            </div>
          )}
        </div>

        {/* Tailor Button */}
        {hasAnalysis && onTailor && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={onTailor}
              disabled={isTailoring}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/25"
            >
              {isTailoring ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Tailoring...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Add Missing Keywords to Vault
                </>
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TargetJobHeader;
