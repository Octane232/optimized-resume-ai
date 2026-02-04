import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Sparkles, FileText, Telescope, RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useSubscription } from '@/contexts/SubscriptionContext';

// New modular components
import ResumeIngestion, { type IngestionResult } from './resume-engine/ResumeIngestion';
import ResumeParser, { type ParsedResume } from './resume-engine/ResumeParser';
import MatchingEngine from './resume-engine/MatchingEngine';
import EnhancementSuggestions from './resume-engine/EnhancementSuggestions';
import ExportPanel from './resume-engine/ExportPanel';

interface ResumeEngineProps {
  setActiveTab?: (tab: string) => void;
  hasResume?: boolean;
}

type EngineStep = 'ingest' | 'parse' | 'match' | 'enhance' | 'export';

const STEPS: { id: EngineStep; label: string; description: string }[] = [
  { id: 'ingest', label: 'Upload', description: 'Import your resume' },
  { id: 'parse', label: 'Parse', description: 'AI extraction' },
  { id: 'match', label: 'Match', description: 'Compare with job' },
  { id: 'enhance', label: 'Enhance', description: 'Get suggestions' },
  { id: 'export', label: 'Export', description: 'Download & share' },
];

const ResumeEngine: React.FC<ResumeEngineProps> = ({ setActiveTab }) => {
  const { tier } = useSubscription();
  
  // Engine state
  const [currentStep, setCurrentStep] = useState<EngineStep>('ingest');
  const [rawText, setRawText] = useState<string>('');
  const [ingestionResult, setIngestionResult] = useState<IngestionResult | null>(null);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle resume ingestion complete - now transitions to AI parsing step
  const handleIngestionComplete = useCallback((result: IngestionResult) => {
    setIngestionResult(result);
    setRawText(result.rawText);
    setCurrentStep('parse'); // Move to parse step where AI parsing happens
    
    toast({
      title: "Resume Uploaded",
      description: "Starting AI-powered analysis...",
    });
  }, []);

  // Handle parsing complete (from parser component)
  const handleParsingComplete = useCallback((parsed: ParsedResume) => {
    setParsedResume(parsed);
  }, []);

  // Handle match complete
  const handleMatchComplete = useCallback((result: any) => {
    setMatchScore(result.overallScore);
    setMissingKeywords(result.missingKeywords || []);
    setCurrentStep('enhance');
  }, []);

  // Reset engine
  const handleReset = () => {
    setCurrentStep('ingest');
    setRawText('');
    setIngestionResult(null);
    setParsedResume(null);
    setMatchScore(null);
    setMissingKeywords([]);
  };

  // Navigate to Scout
  const handleNavigateToScout = () => setActiveTab?.('scout');

  // Step navigation
  const canNavigateToStep = (step: EngineStep): boolean => {
    const stepIndex = STEPS.findIndex(s => s.id === step);
    const currentIndex = STEPS.findIndex(s => s.id === currentStep);
    
    // Can always go back
    if (stepIndex < currentIndex) return true;
    
    // Can only go forward if prerequisites are met
    switch (step) {
      case 'ingest': return true;
      case 'parse': return !!rawText;
      case 'match': return !!parsedResume;
      case 'enhance': return !!parsedResume;
      case 'export': return !!parsedResume;
      default: return false;
    }
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border px-6 py-4 bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-primary" />
              Resume Engine
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-powered resume parsing, analysis, and optimization
            </p>
          </div>
          {rawText && (
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Start Over
            </Button>
          )}
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isPast = STEPS.findIndex(s => s.id === currentStep) > index;
            const canNav = canNavigateToStep(step.id);

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => canNav && setCurrentStep(step.id)}
                  disabled={!canNav}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : isPast 
                        ? 'bg-primary/20 text-primary hover:bg-primary/30' 
                        : canNav
                          ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                          : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    isActive ? 'bg-primary-foreground text-primary' : 
                    isPast ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'
                  }`}>
                    {isPast ? '✓' : index + 1}
                  </span>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-medium">{step.label}</p>
                    <p className="text-[10px] opacity-70">{step.description}</p>
                  </div>
                </button>
                {index < STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 pb-12 max-w-5xl mx-auto space-y-6">
        {/* Scout Tip */}
        {currentStep === 'ingest' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-muted/30 border border-border"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Telescope className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Looking for job matches?</p>
                  <p className="text-xs text-muted-foreground">
                    Use Scout to discover jobs that match your profile
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleNavigateToScout}
                className="gap-2"
              >
                Go to Scout
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step Content */}
        {currentStep === 'ingest' && (
          <ResumeIngestion 
            onIngestionComplete={handleIngestionComplete}
            isProcessing={isProcessing}
          />
        )}

        {currentStep === 'parse' && rawText && (
          <div className="space-y-6">
            <ResumeParser 
              rawText={rawText} 
              onParsingComplete={handleParsingComplete}
            />
            
            {parsedResume && (
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setCurrentStep('ingest')}>
                  Upload Different Resume
                </Button>
                <Button onClick={() => setCurrentStep('match')} className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  Match with Job
                </Button>
              </div>
            )}
          </div>
        )}

        {currentStep === 'match' && (
          <MatchingEngine 
            parsedResume={parsedResume}
            rawText={rawText}
            onMatchComplete={handleMatchComplete}
          />
        )}

        {currentStep === 'enhance' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EnhancementSuggestions
                parsedResume={parsedResume}
                missingKeywords={missingKeywords}
              />
            </div>
            <div>
              <ExportPanel
                parsedResume={parsedResume}
                rawText={rawText}
                matchScore={matchScore || undefined}
                missingKeywords={missingKeywords}
              />
            </div>
          </div>
        )}

        {currentStep === 'export' && (
          <div className="max-w-md mx-auto">
            <ExportPanel
              parsedResume={parsedResume}
              rawText={rawText}
              matchScore={matchScore || undefined}
              missingKeywords={missingKeywords}
            />
          </div>
        )}

        {/* Quick Navigation */}
        {parsedResume && currentStep !== 'ingest' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 pt-4 border-t border-border"
          >
            <span className="text-xs text-muted-foreground py-2">Quick access:</span>
            {STEPS.slice(1).map(step => (
              <Button
                key={step.id}
                variant={currentStep === step.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setCurrentStep(step.id)}
                className="text-xs"
              >
                {step.label}
              </Button>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!rawText && currentStep === 'ingest' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <FileText className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Start by uploading your resume
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Upload a PDF, DOCX, or TXT file, paste your resume text, or import from LinkedIn 
              to begin the AI-powered analysis process.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResumeEngine;
