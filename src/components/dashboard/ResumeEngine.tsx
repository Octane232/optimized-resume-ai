import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Target,
  Sparkles,
  Clipboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

// Import sub-components
import MatchMeter from './resume-engine/MatchMeter';
import KeywordGap from './resume-engine/KeywordGap';
import FixItChecklist from './resume-engine/FixItChecklist';
import ResumeGhostPreview from './resume-engine/ResumeGhostPreview';
import TargetJobHeader from './resume-engine/TargetJobHeader';

interface ResumeEngineProps {
  setActiveTab?: (tab: string) => void;
  hasResume?: boolean;
}

interface AnalysisResult {
  match_score: number;
  is_good_fit: boolean;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  keyword_matches?: string[];
  missing_keywords?: string[];
}

interface FixItItem {
  id: string;
  message: string;
  severity: 'critical' | 'warning' | 'suggestion';
  fixed?: boolean;
}

const ResumeEngine = ({ setActiveTab }: ResumeEngineProps) => {
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [resumeContent, setResumeContent] = useState<any>(null);
  const [resumeTitle, setResumeTitle] = useState('Master Resume');
  const [tailoring, setTailoring] = useState(false);
  
  const [analysis, setAnalysis] = useState<{
    matchScore: number;
    matchingKeywords: string[];
    missingKeywords: { keyword: string; reason: string }[];
    fixItItems: FixItItem[];
    targetJob?: string;
    company?: string;
  } | null>(null);

  useEffect(() => {
    fetchUserResume();
  }, []);

  const fetchUserResume = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: resumes } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (resumes && resumes.length > 0) {
        setHasResume(true);
        setResumeContent(resumes[0].content);
        setResumeTitle(resumes[0].title || 'Master Resume');
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const extractJobInfo = (jd: string): { title?: string; company?: string } => {
    // Simple extraction - look for common patterns
    const lines = jd.split('\n').filter(l => l.trim());
    const titlePatterns = [
      /^(senior|junior|lead|principal|staff)?\s*(software|frontend|backend|full[\s-]?stack|data|product|project|marketing|sales|hr|ux|ui)?\s*(engineer|developer|manager|designer|analyst|specialist|coordinator)/i,
      /position:\s*(.+)/i,
      /job\s*title:\s*(.+)/i,
      /role:\s*(.+)/i
    ];
    
    let title = '';
    for (const line of lines.slice(0, 5)) {
      for (const pattern of titlePatterns) {
        const match = line.match(pattern);
        if (match) {
          title = match[0].replace(/^(position|job\s*title|role):\s*/i, '').trim();
          break;
        }
      }
      if (title) break;
    }

    // Company extraction
    const companyPatterns = [
      /company:\s*(.+)/i,
      /at\s+([A-Z][a-zA-Z0-9\s&]+)/,
      /^([A-Z][a-zA-Z0-9\s&]+)\s+(is|are)\s+(hiring|looking)/i
    ];
    
    let company = '';
    for (const line of lines.slice(0, 10)) {
      for (const pattern of companyPatterns) {
        const match = line.match(pattern);
        if (match && match[1]) {
          company = match[1].trim();
          break;
        }
      }
      if (company) break;
    }

    return { title: title || 'Target Position', company };
  };

  const generateResumeText = (content: any): string => {
    if (!content) return '';
    
    let text = '';
    
    if (content.personalInfo) {
      text += `${content.personalInfo.fullName || ''}\n`;
      text += `${content.personalInfo.title || ''}\n`;
    }
    
    if (content.summary) {
      text += `\nSummary: ${content.summary}\n`;
    }
    
    if (content.experience?.length) {
      text += '\nExperience:\n';
      content.experience.forEach((exp: any) => {
        text += `- ${exp.title} at ${exp.company}\n`;
        if (exp.bullets?.length) {
          exp.bullets.forEach((b: string) => text += `  • ${b}\n`);
        }
      });
    }
    
    if (content.skills?.length) {
      text += `\nSkills: ${content.skills.join(', ')}\n`;
    }
    
    if (content.education?.length) {
      text += '\nEducation:\n';
      content.education.forEach((edu: any) => {
        text += `- ${edu.degree} from ${edu.institution}\n`;
      });
    }
    
    if (content.certifications?.length) {
      text += `\nCertifications: ${content.certifications.join(', ')}\n`;
    }
    
    return text;
  };

  const analyzeMatch = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: "Job description required",
        description: "Please paste a job description to analyze.",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    
    try {
      const resumeText = generateResumeText(resumeContent);
      const jobInfo = extractJobInfo(jobDescription);
      
      const { data, error } = await supabase.functions.invoke('analyze-resume-match', {
        body: { 
          resumeText,
          jobDescription 
        }
      });

      if (error) throw error;

      const result = data as AnalysisResult;
      
      // Convert gaps to fix-it items
      const fixItItems: FixItItem[] = [
        ...result.gaps.slice(0, 3).map((gap, i) => ({
          id: `gap-${i}`,
          message: gap,
          severity: 'critical' as const
        })),
        ...result.recommendations.slice(0, 3).map((rec, i) => ({
          id: `rec-${i}`,
          message: rec,
          severity: 'suggestion' as const
        }))
      ];

      // Build missing keywords with reasons
      const missingKeywords = (result.missing_keywords || []).map(keyword => ({
        keyword,
        reason: `This skill is mentioned in the job description and adding it could improve your match.`
      }));

      setAnalysis({
        matchScore: result.match_score,
        matchingKeywords: result.keyword_matches || result.strengths.slice(0, 5),
        missingKeywords,
        fixItItems,
        targetJob: jobInfo.title,
        company: jobInfo.company
      });
      
      toast({
        title: "Analysis complete",
        description: `Your resume has a ${result.match_score}% match score.`
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze resume match.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAddKeywordsToVault = async (keywords: string[]) => {
    if (!keywords.length) return;
    
    setTailoring(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get current skills from resume content
      const currentSkills = resumeContent?.skills || [];
      const newSkills = [...new Set([...currentSkills, ...keywords])];

      // Update the resume with new skills
      const { data: resumes } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (resumes && resumes.length > 0) {
        await supabase
          .from('resumes')
          .update({
            content: {
              ...resumeContent,
              skills: newSkills
            }
          })
          .eq('id', resumes[0].id);

        // Update local state
        setResumeContent({
          ...resumeContent,
          skills: newSkills
        });

        // Update analysis to reflect added keywords
        if (analysis) {
          const addedKeywords = keywords.filter(k => 
            analysis.missingKeywords.some(mk => mk.keyword === k)
          );
          
          setAnalysis({
            ...analysis,
            matchingKeywords: [...analysis.matchingKeywords, ...addedKeywords],
            missingKeywords: analysis.missingKeywords.filter(mk => 
              !addedKeywords.includes(mk.keyword)
            ),
            matchScore: Math.min(100, analysis.matchScore + (addedKeywords.length * 3))
          });
        }

        toast({
          title: "Skills added to Vault",
          description: `Added ${keywords.length} keywords to your resume.`
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to update",
        description: error.message || "Could not add keywords to vault.",
        variant: "destructive"
      });
    } finally {
      setTailoring(false);
    }
  };

  const handleEditResume = async (section: string, value: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const updatedContent = {
        ...resumeContent,
        [section]: value
      };

      const { data: resumes } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (resumes && resumes.length > 0) {
        await supabase
          .from('resumes')
          .update({ content: updatedContent })
          .eq('id', resumes[0].id);

        setResumeContent(updatedContent);
        
        toast({
          title: "Resume updated",
          description: "Your changes have been saved."
        });
      }
    } catch (error) {
      console.error('Error updating resume:', error);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJobDescription(text);
      toast({
        title: "Pasted from clipboard",
        description: "Job description has been pasted."
      });
    } catch (error) {
      toast({
        title: "Paste failed",
        description: "Could not read from clipboard.",
        variant: "destructive"
      });
    }
  };

  // Empty state when no resume
  if (!hasResume) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="command-card p-12 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Upload Your Resume First</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Go to The Vault to upload your master resume. This powers the diagnostic engine.
          </p>
          <Button 
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            onClick={() => setActiveTab?.('vault')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Go to The Vault
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="max-w-7xl mx-auto space-y-6 h-full">
        {/* Target Job Header */}
        <TargetJobHeader
          masterResumeTitle={resumeTitle}
          targetJobTitle={analysis?.targetJob}
          companyName={analysis?.company}
          onTailor={() => handleAddKeywordsToVault(analysis?.missingKeywords.map(k => k.keyword) || [])}
          isTailoring={tailoring}
          hasAnalysis={!!analysis && analysis.missingKeywords.length > 0}
        />

        {/* Main Split Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Diagnostics */}
          <div className="space-y-5">
            {/* Job Description Input */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="command-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground text-sm">Target Job Description</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handlePaste}
                >
                  <Clipboard className="w-3 h-3 mr-1" />
                  Paste
                </Button>
              </div>
              <Textarea 
                placeholder="Paste the job description here to analyze your match..."
                className="min-h-[120px] resize-none bg-background border-border text-sm"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <Button 
                className="mt-4 w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                onClick={analyzeMatch}
                disabled={analyzing || !jobDescription.trim()}
              >
                {analyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Analyze Match
                  </>
                )}
              </Button>
            </motion.div>

            {/* Analysis Results */}
            {(analysis || analyzing) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                {/* Match Meter */}
                <MatchMeter 
                  score={analysis?.matchScore || 0}
                  missingCount={analysis?.missingKeywords.length || 0}
                  isAnalyzing={analyzing}
                />

                {/* Keyword Gap */}
                {analysis && !analyzing && (
                  <KeywordGap
                    matchingKeywords={analysis.matchingKeywords}
                    missingKeywords={analysis.missingKeywords}
                    onAddToVault={handleAddKeywordsToVault}
                  />
                )}

                {/* Fix-It Checklist */}
                {analysis && !analyzing && analysis.fixItItems.length > 0 && (
                  <FixItChecklist
                    items={analysis.fixItItems}
                  />
                )}
              </motion.div>
            )}

            {/* Empty State */}
            {!analysis && !analyzing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="command-card p-10 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Diagnose</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Paste a job description to see your match score, keyword gaps, and improvement suggestions.
                </p>
              </motion.div>
            )}
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:sticky lg:top-6 h-fit">
            <ResumeGhostPreview
              content={resumeContent}
              matchingKeywords={analysis?.matchingKeywords || []}
              missingKeywords={analysis?.missingKeywords.map(k => k.keyword) || []}
              onEdit={handleEditResume}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEngine;
