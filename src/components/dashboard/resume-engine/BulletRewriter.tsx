import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Check, Lock, RefreshCw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface BulletPoint {
  text: string;
  score: number;
}

interface RewriteResult {
  original: string;
  rewritten: string;
  improvements: string[];
  score_before: number;
  score_after: number;
}

interface BulletRewriterProps {
  bullets: BulletPoint[];
  onBulletUpdated?: (original: string, rewritten: string) => void;
}

const BulletRewriter = ({ 
  bullets, 
  onBulletUpdated
}: BulletRewriterProps) => {
  const [rewritingIndex, setRewritingIndex] = useState<number | null>(null);
  const [rewriteResults, setRewriteResults] = useState<{ [key: number]: RewriteResult }>({});
  const [acceptedRewrites, setAcceptedRewrites] = useState<Set<number>>(new Set());

  const handleRewrite = async (bullet: BulletPoint, index: number) => {
    setRewritingIndex(index);

    try {
      const { data, error } = await supabase.functions.invoke('rewrite-bullet', {
        body: { bullet: bullet.text }
      });

      if (error) throw error;

      setRewriteResults(prev => ({
        ...prev,
        [index]: data
      }));

      toast({
        title: "Bullet rewritten!",
        description: `Score improved from ${data.score_before} to ${data.score_after}`
      });
    } catch (error: any) {
      console.error('Error rewriting bullet:', error);
      toast({
        title: "Rewrite failed",
        description: error.message || "Could not rewrite the bullet point",
        variant: "destructive"
      });
    } finally {
      setRewritingIndex(null);
    }
  };

  const handleAccept = (index: number) => {
    const result = rewriteResults[index];
    if (result && onBulletUpdated) {
      onBulletUpdated(result.original, result.rewritten);
      setAcceptedRewrites(prev => new Set([...prev, index]));
      toast({
        title: "Change accepted",
        description: "Your resume has been updated"
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-500/20';
    if (score >= 60) return 'text-amber-500 bg-amber-500/20';
    return 'text-red-500 bg-red-500/20';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="command-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Bullet Optimizer</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          Unlimited rewrites
        </span>
      </div>

      <div className="space-y-3">
        {bullets.length > 0 ? (
          bullets.map((bullet, index) => {
            const result = rewriteResults[index];
            const isAccepted = acceptedRewrites.has(index);
            const isRewriting = rewritingIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {/* Original Bullet */}
                <div className={`p-4 rounded-lg border transition-all ${
                  result && !isAccepted
                    ? 'bg-muted/20 border-border' 
                    : 'bg-muted/30 border-border hover:border-primary/30'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${getScoreColor(bullet.score)}`}>
                      {bullet.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm text-foreground leading-relaxed ${result && !isAccepted ? 'line-through opacity-50' : ''}`}>
                        {bullet.text}
                      </p>
                    </div>
                    
                    {/* Rewrite Button */}
                    {!result && !isAccepted && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRewrite(bullet, index)}
                        disabled={isRewriting}
                        className="shrink-0 gap-1 text-primary hover:text-primary"
                      >
                        {isRewriting ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Rewriting...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3" />
                            AI Rewrite
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Rewrite Result */}
                <AnimatePresence>
                  {result && !isAccepted && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mt-2"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRight className="w-4 h-4 text-primary" />
                        <span className="text-xs text-primary font-medium">AI Suggestion</span>
                        <div className="flex items-center gap-1 ml-auto">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getScoreColor(result.score_before)}`}>
                            {result.score_before}
                          </span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getScoreColor(result.score_after)}`}>
                            {result.score_after}
                          </span>
                          <span className="text-xs text-emerald-500 font-medium">
                            +{result.score_after - result.score_before}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm text-foreground leading-relaxed mb-3">
                          {result.rewritten}
                        </p>
                        
                        {/* Improvements */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {result.improvements.map((imp, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                              {imp}
                            </span>
                          ))}
                        </div>

                        {/* Accept Button */}
                        <Button
                          size="sm"
                          onClick={() => handleAccept(index)}
                          className="w-full gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Accept Change
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Accepted State */}
                {isAccepted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 flex items-center gap-2 text-emerald-500"
                  >
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-medium">Change applied</span>
                  </motion.div>
                )}
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <Zap className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Upload a resume to optimize your bullet points with AI
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BulletRewriter;
