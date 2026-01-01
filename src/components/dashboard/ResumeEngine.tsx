
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  AlertCircle, 
  CheckCircle,
  Target,
  AlertTriangle,
  Sparkles,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

const ResumeEngine = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [resumeContent, setResumeContent] = useState<any>(null);
  const [analysis, setAnalysis] = useState<{
    matchScore: number;
    atsScore: number;
    matchingKeywords: string[];
    missingKeywords: string[];
    criticalErrors: string[];
    suggestions: string[];
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
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
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
    
    // Simulate analysis (in production, this would call an AI endpoint)
    setTimeout(() => {
      // Mock analysis results
      const mockAnalysis = {
        matchScore: Math.floor(Math.random() * 30) + 60, // 60-90%
        atsScore: Math.floor(Math.random() * 20) + 75, // 75-95%
        matchingKeywords: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'SQL'].slice(0, Math.floor(Math.random() * 3) + 3),
        missingKeywords: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'GraphQL'].slice(0, Math.floor(Math.random() * 3) + 2),
        criticalErrors: Math.random() > 0.5 ? ['Missing contact information section', 'No measurable achievements listed'] : [],
        suggestions: [
          'Add more quantifiable achievements',
          'Include relevant certifications',
          'Tailor your summary to the role'
        ]
      };
      
      setAnalysis(mockAnalysis);
      setAnalyzing(false);
    }, 2000);
  };

  // Empty state when no resume
  if (!hasResume) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="command-card p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Upload a resume first</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Go to The Vault to upload your master resume. This is required before you can analyze job matches.
          </p>
          <Button className="saas-button">
            Go to The Vault
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="grid lg:grid-cols-2 gap-6 h-full max-w-7xl mx-auto">
        {/* Left Panel - Diagnostics */}
        <div className="space-y-6">
          {/* Job Description Input */}
          <div className="command-card p-6">
            <h3 className="font-semibold text-foreground mb-3">Paste Job Description</h3>
            <Textarea 
              placeholder="Paste the job description here to analyze your match..."
              className="min-h-[150px] resize-none bg-background border-border"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <Button 
              className="saas-button mt-4 w-full"
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
          </div>

          {/* Analysis Results */}
          {analysis && (
            <>
              {/* Score Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="command-card p-5">
                  <p className="text-sm text-muted-foreground mb-2">Match Score</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-foreground">{analysis.matchScore}%</span>
                  </div>
                  <Progress value={analysis.matchScore} className="h-2 mt-3" />
                </div>
                <div className="command-card p-5">
                  <p className="text-sm text-muted-foreground mb-2">ATS Readiness</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-foreground">{analysis.atsScore}%</span>
                  </div>
                  <Progress value={analysis.atsScore} className="h-2 mt-3" />
                </div>
              </div>

              {/* Critical Errors */}
              {analysis.criticalErrors.length > 0 && (
                <div className="command-card p-5 border-destructive/30">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <h4 className="font-semibold text-destructive">Critical Errors</h4>
                  </div>
                  <ul className="space-y-2">
                    {analysis.criticalErrors.map((error, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 bg-destructive rounded-full mt-1.5 shrink-0" />
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Keywords */}
              <div className="command-card p-5">
                <h4 className="font-semibold text-foreground mb-4">Keyword Analysis</h4>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-foreground">Matching Keywords ({analysis.matchingKeywords.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matchingKeywords.map((keyword, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-foreground">Missing Keywords ({analysis.missingKeywords.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Rewrite - Locked */}
              <div className="command-card p-5 relative overflow-hidden opacity-75">
                <div className="absolute inset-0 bg-muted/50 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="text-center">
                    <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">Available in Pro — Coming Soon</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-foreground">One-Click AI Rewrite</h4>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Automatically optimize your resume for this job</p>
              </div>
            </>
          )}

          {/* Empty State for Analysis */}
          {!analysis && !analyzing && (
            <div className="command-card p-8 text-center">
              <Target className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Paste a job description to see your match score.
              </p>
            </div>
          )}
        </div>

        {/* Right Panel - Resume Viewer */}
        <div className="command-card p-6 h-fit lg:sticky lg:top-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Your Resume</h3>
            <span className="text-xs text-muted-foreground">Preview mode</span>
          </div>
          
          <div className="bg-background border border-border rounded-lg p-6 min-h-[400px]">
            {resumeContent ? (
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="text-lg font-bold text-foreground">
                    {resumeContent.personalInfo?.fullName || 'Your Name'}
                  </h4>
                  <p className="text-muted-foreground">
                    {resumeContent.personalInfo?.title || 'Professional Title'}
                  </p>
                </div>
                
                {resumeContent.summary && (
                  <div>
                    <h5 className="font-semibold text-foreground mb-1">Summary</h5>
                    <p className="text-muted-foreground text-xs leading-relaxed">{resumeContent.summary}</p>
                  </div>
                )}

                {resumeContent.experience?.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">Experience</h5>
                    {resumeContent.experience.slice(0, 2).map((exp: any, i: number) => (
                      <div key={i} className="mb-2">
                        <p className="font-medium text-foreground text-xs">{exp.title}</p>
                        <p className="text-muted-foreground text-xs">{exp.company}</p>
                      </div>
                    ))}
                  </div>
                )}

                {resumeContent.skills?.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">Skills</h5>
                    <div className="flex flex-wrap gap-1">
                      {resumeContent.skills.slice(0, 8).map((skill: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-secondary text-xs text-foreground">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">Resume preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEngine;
