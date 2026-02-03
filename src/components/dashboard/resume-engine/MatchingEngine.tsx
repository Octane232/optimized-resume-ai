import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, AlertCircle, CheckCircle2, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { ParsedResume } from './ResumeParser';

interface MatchResult {
  overallScore: number;
  keywordMatch: number;
  skillCoverage: number;
  experienceAlignment: number;
  formattingScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  matchedSkills: string[];
  missingSkills: string[];
  experienceGaps: string[];
  strengths: string[];
  recommendations: string[];
}

interface MatchingEngineProps {
  parsedResume: ParsedResume | null;
  rawText: string;
  onMatchComplete?: (result: MatchResult) => void;
}

// Extract keywords from job description
const extractJobKeywords = (jobDescription: string): string[] => {
  const text = jobDescription.toLowerCase();
  
  // Common technical terms and requirements
  const technicalPatterns = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'go', 'rust',
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform',
    'sql', 'mysql', 'postgresql', 'mongodb', 'redis',
    'git', 'ci/cd', 'agile', 'scrum', 'microservices', 'rest api', 'graphql',
    'machine learning', 'data science', 'deep learning', 'nlp',
  ];

  const softSkillPatterns = [
    'leadership', 'communication', 'teamwork', 'problem solving', 'collaboration',
    'mentoring', 'project management', 'stakeholder', 'cross-functional',
  ];

  const experiencePatterns = [
    /(\d+)\+?\s*years?/gi,
    /senior|lead|principal|staff|junior|entry/gi,
  ];

  const keywords: string[] = [];

  // Extract technical skills mentioned
  technicalPatterns.forEach(skill => {
    if (text.includes(skill)) {
      keywords.push(skill);
    }
  });

  // Extract soft skills
  softSkillPatterns.forEach(skill => {
    if (text.includes(skill)) {
      keywords.push(skill);
    }
  });

  return [...new Set(keywords)];
};

// Calculate TF-IDF style similarity
const calculateKeywordMatch = (resumeText: string, jobKeywords: string[]): { score: number; matched: string[]; missing: string[] } => {
  const lowerResume = resumeText.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];

  jobKeywords.forEach(keyword => {
    if (lowerResume.includes(keyword.toLowerCase())) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  const score = jobKeywords.length > 0 
    ? Math.round((matched.length / jobKeywords.length) * 100)
    : 0;

  return { score, matched, missing };
};

// Calculate skill coverage
const calculateSkillCoverage = (
  resumeSkills: ParsedResume['skills'], 
  jobKeywords: string[]
): { score: number; matched: string[]; missing: string[] } => {
  const resumeSkillNames = resumeSkills.map(s => s.normalizedName.toLowerCase());
  const matched: string[] = [];
  const missing: string[] = [];

  jobKeywords.forEach(keyword => {
    if (resumeSkillNames.some(skill => 
      skill.includes(keyword.toLowerCase()) || 
      keyword.toLowerCase().includes(skill)
    )) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  const score = jobKeywords.length > 0
    ? Math.round((matched.length / jobKeywords.length) * 100)
    : 0;

  return { score, matched, missing };
};

const MatchingEngine: React.FC<MatchingEngineProps> = ({ parsedResume, rawText, onMatchComplete }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "No job description",
        description: "Please paste a job description to match against",
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
      // Extract keywords from job description
      const jobKeywords = extractJobKeywords(jobDescription);

      // Calculate local matches first (fallback if AI fails)
      const keywordAnalysis = calculateKeywordMatch(rawText, jobKeywords);
      const skillAnalysis = parsedResume 
        ? calculateSkillCoverage(parsedResume.skills, jobKeywords)
        : { score: 0, matched: [], missing: [] };

      // Try AI-powered analysis
      let aiResult: any = null;
      try {
        const { data, error } = await supabase.functions.invoke('analyze-resume-match', {
          body: {
            resumeContent: rawText,
            jobDescription: jobDescription,
          }
        });

        if (!error && data) {
          aiResult = data;
        }
      } catch (e) {
        console.warn('AI analysis failed, using local analysis', e);
      }

      // Combine results
      const result: MatchResult = {
        overallScore: aiResult?.matchScore || Math.round((keywordAnalysis.score + skillAnalysis.score) / 2),
        keywordMatch: keywordAnalysis.score,
        skillCoverage: skillAnalysis.score,
        experienceAlignment: aiResult?.experienceAlignment || 70,
        formattingScore: aiResult?.formattingScore || 85,
        matchedKeywords: keywordAnalysis.matched,
        missingKeywords: keywordAnalysis.missing,
        matchedSkills: skillAnalysis.matched,
        missingSkills: skillAnalysis.missing,
        experienceGaps: aiResult?.experienceGaps || [],
        strengths: aiResult?.strengths || [
          `${keywordAnalysis.matched.length} matching keywords found`,
          parsedResume ? `${parsedResume.skills.length} skills identified` : 'Resume content processed',
        ],
        recommendations: aiResult?.recommendations || [
          ...keywordAnalysis.missing.slice(0, 3).map(kw => `Add "${kw}" to your resume if applicable`),
          'Quantify achievements with metrics where possible',
          'Tailor bullet points to match job requirements',
        ],
      };

      setMatchResult(result);
      onMatchComplete?.(result);

      toast({
        title: `Match Score: ${result.overallScore}%`,
        description: `${result.matchedKeywords.length} keywords matched, ${result.missingKeywords.length} gaps identified`,
      });

    } catch (error: any) {
      console.error('Matching error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Could not complete the analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const ScoreGauge = ({ score, label }: { score: number; label: string }) => {
    const getColor = (s: number) => {
      if (s >= 80) return 'text-emerald-500';
      if (s >= 60) return 'text-amber-500';
      return 'text-red-500';
    };

    const getTrend = (s: number) => {
      if (s >= 80) return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      if (s >= 60) return <Minus className="w-4 h-4 text-amber-500" />;
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    };

    return (
      <div className="text-center p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center justify-center gap-1 mb-1">
          <span className={`text-2xl font-bold ${getColor(score)}`}>{score}%</span>
          {getTrend(score)}
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    );
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
              <h3 className="font-semibold text-lg text-foreground">Job Matching Engine</h3>
              <p className="text-sm text-muted-foreground">
                Paste a job description to analyze match and identify gaps
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <Label htmlFor="job-description" className="text-sm mb-2 block">
              Job Description
            </Label>
            <Textarea
              id="job-description"
              placeholder="Paste the complete job description here...

Include requirements, responsibilities, and qualifications for the best analysis."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
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
                Analyzing Match...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Analyze Match
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
            {/* Overall Score */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Match Analysis
                </h3>
                <div className={`text-3xl font-bold ${
                  matchResult.overallScore >= 80 ? 'text-emerald-500' :
                  matchResult.overallScore >= 60 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {matchResult.overallScore}%
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <ScoreGauge score={matchResult.keywordMatch} label="Keywords" />
                <ScoreGauge score={matchResult.skillCoverage} label="Skills" />
                <ScoreGauge score={matchResult.experienceAlignment} label="Experience" />
                <ScoreGauge score={matchResult.formattingScore} label="Formatting" />
              </div>

              <Progress value={matchResult.overallScore} className="h-3" />
            </Card>

            {/* Keywords Analysis */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Matched Keywords */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h4 className="font-medium text-foreground">Matched Keywords</h4>
                  <span className="text-xs bg-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded-full">
                    {matchResult.matchedKeywords.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {matchResult.matchedKeywords.length > 0 ? (
                    matchResult.matchedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded text-xs"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No matching keywords found</p>
                  )}
                </div>
              </Card>

              {/* Missing Keywords */}
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h4 className="font-medium text-foreground">Missing Keywords</h4>
                  <span className="text-xs bg-red-500/20 text-red-600 px-2 py-0.5 rounded-full">
                    {matchResult.missingKeywords.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {matchResult.missingKeywords.length > 0 ? (
                    matchResult.missingKeywords.slice(0, 10).map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-red-500/10 text-red-600 rounded text-xs"
                      >
                        {kw}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-emerald-600">All keywords matched! 🎉</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="p-5">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Recommendations
              </h4>
              <ul className="space-y-2">
                {matchResult.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{rec}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MatchingEngine;
