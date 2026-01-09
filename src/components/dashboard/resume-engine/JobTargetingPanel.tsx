import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Sparkles, ChevronDown, ChevronUp, Briefcase, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface JobTargetingPanelProps {
  onAnalyze: (jobDescription: string, jobTitle?: string, company?: string) => void;
  isAnalyzing: boolean;
  isPremium: boolean;
  onUpgrade: () => void;
}

const JobTargetingPanel = ({ 
  onAnalyze, 
  isAnalyzing, 
  isPremium,
  onUpgrade 
}: JobTargetingPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return;
    onAnalyze(jobDescription, jobTitle, company);
  };

  const canAnalyze = jobDescription.trim().length > 50;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="command-card overflow-hidden"
    >
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              Target a Specific Job
              {!isPremium && (
                <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-500 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Pro
                </span>
              )}
            </h3>
            <p className="text-xs text-muted-foreground">
              Paste a job description to see how well your resume matches
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
              {/* Job Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Job Title (optional)
                  </label>
                  <Input
                    placeholder="e.g., Senior Product Manager"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Company (optional)
                  </label>
                  <Input
                    placeholder="e.g., Google"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {/* Job Description */}
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Job Description *
                </label>
                <Textarea
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[150px] resize-none text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {jobDescription.length}/50 characters minimum
                </p>
              </div>

              {/* Action Button */}
              {isPremium ? (
                <Button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze || isAnalyzing}
                  className="w-full gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Analyzing Match...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze Match
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={onUpgrade}
                    className="w-full gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                  >
                    <Lock className="w-4 h-4" />
                    Unlock Job Targeting with Pro
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Pro users can analyze unlimited job descriptions
                  </p>
                </div>
              )}

              {/* Quick Tips */}
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground">
                  <span className="text-primary font-medium">Tip:</span> Include the full job posting 
                  for the most accurate match analysis. The AI will identify missing keywords and 
                  suggest specific improvements.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JobTargetingPanel;
