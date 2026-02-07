import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Zap, AlertCircle, CheckCircle2, Loader2, TrendingUp, TrendingDown, 
  Minus, ThumbsUp, ThumbsDown, Copy, ChevronDown, ChevronUp, Sparkles,
  AlertTriangle, Lightbulb, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { ParsedResume } from './ResumeParser';

interface MatchResult {
  matchScore: number;
  isGoodFit: boolean;
  fitSummary: string;
  strengths: Array<{ point: string; impact: 'high' | 'medium' }>;
  gaps: Array<{ gap: string; severity: 'critical' | 'moderate' | 'minor'; suggestion: string }>;
  recommendations: Array<{ 
    action: string; 
    section: string; 
    priority: 'high' | 'medium' | 'low';
    example?: string;
  }>;
  keywordMatches: string[];
  missingKeywords: Array<{ keyword: string; importance: 'must-have' | 'nice-to-have'; context?: string }>;
  atsWarnings?: string[];
}

interface MatchingEngineProps {
  parsedResume: ParsedResume | null;
  rawText: string;
  onMatchComplete?: (result: any) => void;
}

const MatchingEngine: React.FC<MatchingEngineProps> = ({ parsedResume, rawText, onMatchComplete }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    verdict: true,
    strengths: true,
    gaps: true,
    recommendations: true,
    keywords: false,
    warnings: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "No job description",
        description: "Please paste the job description to analyze",
        variant: "destructive",
      });
      return;
    }

    if (!rawText && !parsedResume) {
      toast({
        title: "No resume content",
        description: "Please upload or paste your resume first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume-match', {
        body: {
          resumeText: rawText,
          jobDescription: jobDescription,
        }
      });

      if (error) throw error;

      // Map API response to our interface
      const result: MatchResult = {
        matchScore: data.match_score || 0,
        isGoodFit: data.is_good_fit || false,
        fitSummary: data.fit_summary || '',
        strengths: (data.strengths || []).map((s: any) => ({
          point: s.point,
          impact: s.impact || 'medium'
        })),
        gaps: (data.gaps || []).map((g: any) => ({
          gap: g.gap,
          severity: g.severity || 'moderate',
          suggestion: g.suggestion || ''
        })),
        recommendations: (data.recommendations || []).map((r: any) => ({
          action: r.action,
          section: r.section || 'other',
          priority: r.priority || 'medium',
          example: r.example
        })),
        keywordMatches: data.keyword_matches || [],
        missingKeywords: (data.missing_keywords || []).map((k: any) => ({
          keyword: typeof k === 'string' ? k : k.keyword,
          importance: k.importance || 'nice-to-have',
          context: k.context
        })),
        atsWarnings: data.ats_warnings || [],
      };

      setMatchResult(result);
      
      // Notify parent
      onMatchComplete?.({
        overallScore: result.matchScore,
        missingKeywords: result.missingKeywords.map(k => k.keyword),
      });

      toast({
        title: result.isGoodFit ? "Good Match! 🎉" : "Room for Improvement",
        description: `Match Score: ${result.matchScore}%`,
        variant: result.isGoodFit ? "default" : "destructive",
      });

    } catch (error: any) {
      console.error('Matching error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Could not complete the analysis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'moderate': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      default: return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Job Description Input */}
      <Card className="overflow-hidden border-primary/20">
        <div className="p-5 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">ATS Resume Analyzer</h3>
              <p className="text-sm text-muted-foreground">
                Paste the job description to see if you're a good fit and get actionable fixes
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <Label htmlFor="job-description" className="text-sm mb-2 block font-medium">
              Job Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="job-description"
              placeholder="Paste the complete job description here...

Include the job title, requirements, responsibilities, and qualifications for the most accurate analysis."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              className="resize-none"
            />
            {jobDescription && (
              <p className="text-xs text-muted-foreground mt-2">
                {jobDescription.split(/\s+/).filter(Boolean).length} words
              </p>
            )}
          </div>

          <Button
            onClick={handleMatch}
            disabled={!jobDescription.trim() || isAnalyzing || (!rawText && !parsedResume)}
            className="w-full gap-2"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing Your Chances...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Analyze My Chances
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Match Results */}
      <AnimatePresence>
        {matchResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Verdict Card */}
            <Card className={`p-6 border-2 ${matchResult.isGoodFit ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-amber-500/50 bg-amber-500/5'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${matchResult.isGoodFit ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                  {matchResult.isGoodFit ? (
                    <ThumbsUp className="w-8 h-8 text-emerald-500" />
                  ) : (
                    <ThumbsDown className="w-8 h-8 text-amber-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-foreground">
                      {matchResult.isGoodFit ? "You're a Good Fit!" : "Needs Improvement"}
                    </h2>
                    <div className={`text-3xl font-bold ${getScoreColor(matchResult.matchScore)}`}>
                      {matchResult.matchScore}%
                    </div>
                  </div>
                  <p className="text-muted-foreground">{matchResult.fitSummary}</p>
                  <Progress 
                    value={matchResult.matchScore} 
                    className="h-3 mt-4" 
                  />
                </div>
              </div>
            </Card>

            {/* Strengths Section */}
            {matchResult.strengths.length > 0 && (
              <Collapsible open={expandedSections.strengths} onOpenChange={() => toggleSection('strengths')}>
                <Card className="overflow-hidden">
                  <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground">Your Strengths</h3>
                        <p className="text-xs text-muted-foreground">{matchResult.strengths.length} strengths identified</p>
                      </div>
                    </div>
                    {expandedSections.strengths ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-2">
                      {matchResult.strengths.map((strength, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-foreground">{strength.point}</p>
                          </div>
                          {strength.impact === 'high' && (
                            <Badge className="bg-emerald-500 text-white text-xs">High Impact</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )}

            {/* Gaps Section */}
            {matchResult.gaps.length > 0 && (
              <Collapsible open={expandedSections.gaps} onOpenChange={() => toggleSection('gaps')}>
                <Card className="overflow-hidden">
                  <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground">Gaps to Address</h3>
                        <p className="text-xs text-muted-foreground">{matchResult.gaps.length} gaps found</p>
                      </div>
                    </div>
                    {expandedSections.gaps ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-3">
                      {matchResult.gaps.map((gap, i) => (
                        <div key={i} className={`p-4 rounded-lg border ${getSeverityColor(gap.severity)}`}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="font-medium text-foreground">{gap.gap}</p>
                            <Badge variant="outline" className={`text-xs capitalize ${
                              gap.severity === 'critical' ? 'border-red-500 text-red-500' :
                              gap.severity === 'moderate' ? 'border-amber-500 text-amber-500' :
                              'border-blue-500 text-blue-500'
                            }`}>
                              {gap.severity}
                            </Badge>
                          </div>
                          {gap.suggestion && (
                            <div className="flex items-start gap-2 mt-2 p-2 bg-background/50 rounded">
                              <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <p className="text-sm text-muted-foreground">{gap.suggestion}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )}

            {/* Recommendations Section */}
            {matchResult.recommendations.length > 0 && (
              <Collapsible open={expandedSections.recommendations} onOpenChange={() => toggleSection('recommendations')}>
                <Card className="overflow-hidden">
                  <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground">How to Fix It</h3>
                        <p className="text-xs text-muted-foreground">{matchResult.recommendations.length} actionable steps</p>
                      </div>
                    </div>
                    {expandedSections.recommendations ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-3">
                      {matchResult.recommendations.map((rec, i) => (
                        <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border">
                          <div className="flex items-start gap-3">
                            <div className={`w-6 h-6 rounded-full ${getPriorityColor(rec.priority)} text-white text-xs flex items-center justify-center shrink-0`}>
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs capitalize">
                                  {rec.section}
                                </Badge>
                                <Badge variant="outline" className={`text-xs ${
                                  rec.priority === 'high' ? 'text-red-500 border-red-500' :
                                  rec.priority === 'medium' ? 'text-amber-500 border-amber-500' :
                                  'text-blue-500 border-blue-500'
                                }`}>
                                  {rec.priority} priority
                                </Badge>
                              </div>
                              <p className="text-sm text-foreground font-medium">{rec.action}</p>
                              {rec.example && (
                                <div className="mt-2 p-3 bg-background rounded border border-border">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-muted-foreground">Example:</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 px-2"
                                      onClick={() => copyToClipboard(rec.example!)}
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <p className="text-sm text-primary italic">"{rec.example}"</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )}

            {/* Keywords Analysis */}
            <Collapsible open={expandedSections.keywords} onOpenChange={() => toggleSection('keywords')}>
              <Card className="overflow-hidden">
                <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground">Keyword Analysis</h3>
                      <p className="text-xs text-muted-foreground">
                        {matchResult.keywordMatches.length} matched, {matchResult.missingKeywords.length} missing
                      </p>
                    </div>
                  </div>
                  {expandedSections.keywords ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-4">
                    {/* Matched Keywords */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Keywords Found ({matchResult.keywordMatches.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {matchResult.keywordMatches.length > 0 ? (
                          matchResult.keywordMatches.map((kw, i) => (
                            <span key={i} className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded text-xs">
                              {kw}
                            </span>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No matching keywords found</p>
                        )}
                      </div>
                    </div>

                    {/* Missing Keywords */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        Missing Keywords ({matchResult.missingKeywords.length})
                      </h4>
                      <div className="space-y-2">
                        {matchResult.missingKeywords.length > 0 ? (
                          matchResult.missingKeywords.map((mk, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 rounded bg-red-500/5 border border-red-500/20">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                mk.importance === 'must-have' 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-amber-500/20 text-amber-600'
                              }`}>
                                {mk.importance === 'must-have' ? 'Must Have' : 'Nice to Have'}
                              </span>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-foreground">{mk.keyword}</span>
                                {mk.context && (
                                  <p className="text-xs text-muted-foreground mt-0.5">{mk.context}</p>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-emerald-600">All important keywords are present! 🎉</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* ATS Warnings */}
            {matchResult.atsWarnings && matchResult.atsWarnings.length > 0 && (
              <Collapsible open={expandedSections.warnings} onOpenChange={() => toggleSection('warnings')}>
                <Card className="overflow-hidden border-amber-500/30">
                  <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground">ATS Warnings</h3>
                        <p className="text-xs text-muted-foreground">{matchResult.atsWarnings.length} potential issues</p>
                      </div>
                    </div>
                    {expandedSections.warnings ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-2">
                      {matchResult.atsWarnings.map((warning, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground">{warning}</p>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatchingEngine;
