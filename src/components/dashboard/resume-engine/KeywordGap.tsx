import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KeywordGapProps {
  matchingKeywords: string[];
  missingKeywords: { keyword: string; reason: string }[];
  onAddToVault?: (keywords: string[]) => void;
}

const KeywordGap = ({ matchingKeywords, missingKeywords, onAddToVault }: KeywordGapProps) => {
  return (
    <div className="command-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Keyword Gap</h3>
        {missingKeywords.length > 0 && onAddToVault && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-primary hover:text-primary/80"
            onClick={() => onAddToVault(missingKeywords.map(k => k.keyword))}
          >
            <Plus className="w-3 h-3 mr-1" />
            Add All to Vault
          </Button>
        )}
      </div>

      {/* Found Keywords */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-500" />
          </div>
          <span className="text-xs font-medium text-foreground">
            Found in Resume ({matchingKeywords.length})
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {matchingKeywords.map((keyword, i) => (
              <motion.span
                key={keyword}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.05 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium border border-emerald-500/20"
              >
                <Check className="w-3 h-3" />
                {keyword}
              </motion.span>
            ))}
          </AnimatePresence>
          {matchingKeywords.length === 0 && (
            <span className="text-xs text-muted-foreground italic">No matching keywords found</span>
          )}
        </div>
      </div>

      {/* Missing Keywords */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-destructive/20 flex items-center justify-center">
            <X className="w-3 h-3 text-destructive" />
          </div>
          <span className="text-xs font-medium text-foreground">
            Missing from Resume ({missingKeywords.length})
          </span>
        </div>
        <TooltipProvider>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {missingKeywords.map((item, i) => (
                <Tooltip key={item.keyword}>
                  <TooltipTrigger asChild>
                    <motion.span
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: i * 0.05 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20 border-dashed cursor-help hover:bg-destructive/15 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      {item.keyword}
                    </motion.span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                      <p className="text-xs">{item.reason}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </AnimatePresence>
            {missingKeywords.length === 0 && (
              <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                <Check className="w-3 h-3" />
                All keywords covered!
              </span>
            )}
          </div>
        </TooltipProvider>
      </div>

      {/* Tip */}
      {missingKeywords.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10"
        >
          <p className="text-xs text-muted-foreground">
            <span className="text-primary font-medium">Pro tip:</span> Add missing keywords to your Vault skills. 
            The preview will update in real-time as you add them.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default KeywordGap;
