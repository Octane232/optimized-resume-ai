import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Lock, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AutoOptimizeButtonProps {
  isPremium: boolean;
  onUpgrade: () => void;
  onOptimize: () => Promise<void>;
  disabled?: boolean;
}

const AutoOptimizeButton = ({ 
  isPremium, 
  onUpgrade,
  onOptimize,
  disabled 
}: AutoOptimizeButtonProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const optimizationSteps = [
    { label: 'Analyzing bullet points', icon: '📝' },
    { label: 'Identifying weak areas', icon: '🔍' },
    { label: 'Rewriting with AI', icon: '✨' },
    { label: 'Adding missing keywords', icon: '🔑' },
    { label: 'Optimizing formatting', icon: '📐' },
    { label: 'Finalizing changes', icon: '✅' },
  ];

  const handleOptimize = async () => {
    setShowConfirm(false);
    setIsOptimizing(true);
    setCurrentStep(0);

    // Simulate step-by-step progress
    for (let i = 0; i < optimizationSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      await onOptimize();
    } finally {
      setIsOptimizing(false);
    }
  };

  if (!isPremium) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="command-card p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Wand2 className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              One-Click Auto-Optimize
              <span className="px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary rounded-full">
                Premium
              </span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Let AI automatically rewrite weak bullets, add keywords, and optimize your entire resume
            </p>
          </div>
          <Button onClick={onUpgrade} className="gap-2 shrink-0">
            <Lock className="w-4 h-4" />
            Unlock
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="command-card p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Wand2 className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">One-Click Auto-Optimize</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Apply all AI suggestions at once - rewrite bullets, add keywords, and improve formatting
            </p>
          </div>
          <Button 
            onClick={() => setShowConfirm(true)} 
            disabled={disabled || isOptimizing}
            className="gap-2 shrink-0 bg-gradient-to-r from-primary to-primary/80"
          >
            {isOptimizing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Auto-Optimize
              </>
            )}
          </Button>
        </div>

        {/* Progress Steps */}
        {isOptimizing && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-border"
          >
            <div className="space-y-2">
              {optimizationSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: i <= currentStep ? 1 : 0.3,
                    x: 0 
                  }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    i < currentStep 
                      ? 'bg-emerald-500/20 text-emerald-500' 
                      : i === currentStep
                      ? 'bg-primary/20 text-primary animate-pulse'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {i < currentStep ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <span>{step.icon}</span>
                    )}
                  </div>
                  <span className={`text-sm ${
                    i <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                  {i === currentStep && (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              Auto-Optimize Resume
            </DialogTitle>
            <DialogDescription>
              This will apply all AI improvements to your resume. You can review and undo changes afterward.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground">The AI will:</p>
            <ul className="space-y-2">
              {[
                'Rewrite weak bullet points with stronger action verbs',
                'Add missing keywords from your target job',
                'Improve your professional summary',
                'Optimize formatting for ATS systems'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button className="flex-1 gap-2" onClick={handleOptimize}>
              <Sparkles className="w-4 h-4" />
              Start Optimization
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AutoOptimizeButton;
