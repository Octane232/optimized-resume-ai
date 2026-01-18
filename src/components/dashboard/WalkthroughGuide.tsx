import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  X,
  Rocket
} from 'lucide-react';

interface WalkthroughGuideProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Target,
    title: 'Scout Jobs',
    description: 'Find high-match roles curated just for you based on your skills and experience.',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: FileText,
    title: 'Resume Engine',
    description: 'Build, optimize, and tailor your resume to beat ATS systems and impress recruiters.',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Tools',
    description: 'Cover letters, interview prep, and skill analysis—all powered by AI.',
    color: 'from-purple-500 to-purple-600'
  }
];

const WalkthroughGuide: React.FC<WalkthroughGuideProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
      >
        {/* Skip button */}
        <button 
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Progress dots */}
        <div className="absolute top-4 left-4 flex gap-1.5 z-10">
          {steps.map((_, i) => (
            <div 
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentStep 
                  ? 'bg-primary w-6' 
                  : i < currentStep 
                    ? 'bg-primary/50' 
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-8 pt-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="text-center"
            >
              {/* Icon */}
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-10 h-10 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold mb-3">{step.title}</h2>
              
              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-8">
                {step.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              onClick={handleSkip}
              className="flex-1"
            >
              Skip Tour
            </Button>
            <Button 
              onClick={handleNext}
              className="flex-1 gap-2"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Get Started
                  <Rocket className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WalkthroughGuide;
