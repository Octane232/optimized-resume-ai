import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { 
  Settings2,
  Upload,
  AlertCircle,
  AlertTriangle,
  Plus,
  Sparkles,
  FileText,
  Edit3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

interface ResumeEngineProps {
  setActiveTab?: (tab: string) => void;
  hasResume?: boolean;
}

interface BulletPoint {
  text: string;
  score: number;
}

const ResumeEngine = ({ setActiveTab }: ResumeEngineProps) => {
  const [resumeContent, setResumeContent] = useState<any>(null);
  const [quickEditContent, setQuickEditContent] = useState('');
  const [manualEditMode, setManualEditMode] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [atsScore, setAtsScore] = useState(0);
  const [issues, setIssues] = useState<{ type: 'error' | 'warning'; message: string }[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [bulletPoints, setBulletPoints] = useState<BulletPoint[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

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
        setResumeContent(resumes[0].content);
        analyzeResume(resumes[0].content);
      }
    } catch (error) {
      console.error('Error fetching resume:', error);
    }
  };

  const analyzeResume = (content: any) => {
    if (!content) return;

    // Calculate scores based on content completeness
    let score = 50;
    let ats = 50;
    const foundIssues: { type: 'error' | 'warning'; message: string }[] = [];

    // Check for contact info
    if (!content.personalInfo?.email || !content.personalInfo?.phone) {
      foundIssues.push({ type: 'error', message: 'Missing contact information section' });
    } else {
      score += 10;
      ats += 10;
    }

    // Check for LinkedIn
    if (!content.personalInfo?.website) {
      foundIssues.push({ type: 'warning', message: 'No LinkedIn profile URL' });
    } else {
      score += 5;
    }

    // Check skills
    if (!content.skills || content.skills.length < 5) {
      foundIssues.push({ type: 'warning', message: 'Skills section needs more keywords' });
    } else {
      score += 15;
      ats += 15;
    }

    // Check experience
    if (content.experience?.length > 0) {
      score += 15;
      ats += 10;
    }

    // Check summary
    if (content.summary) {
      score += 5;
      ats += 5;
    }

    setOverallScore(Math.min(score, 100));
    setAtsScore(Math.min(ats, 100));
    setIssues(foundIssues);

    // Extract bullet points from experience
    const bullets: BulletPoint[] = [];
    content.experience?.forEach((exp: any) => {
      if (exp.bullets) {
        exp.bullets.forEach((bullet: string) => {
          // Score bullets based on action verbs and metrics
          let bulletScore = 50;
          if (/^(Led|Managed|Developed|Created|Implemented|Achieved|Increased|Reduced)/i.test(bullet)) {
            bulletScore += 20;
          }
          if (/\d+%|\$\d+|\d+ (users|customers|projects|team)/i.test(bullet)) {
            bulletScore += 25;
          }
          bullets.push({ text: bullet, score: Math.min(bulletScore, 100) });
        });
      }
    });
    setBulletPoints(bullets.slice(0, 5));

    // Common missing keywords
    setMissingKeywords([
      'Agile methodology',
      'Cross-functional collaboration',
      'Data-driven decisions',
      'Stakeholder management',
      'Process optimization'
    ]);
  };

  const handleUploadClick = () => {
    setActiveTab?.('vault');
  };

  const handleQuickAnalyze = async () => {
    if (!quickEditContent.trim()) {
      toast({
        title: "No content",
        description: "Please paste resume content to analyze.",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    
    try {
      // Simulate analysis of pasted content
      setTimeout(() => {
        const mockContent = {
          personalInfo: { fullName: 'User', title: 'Professional' },
          summary: quickEditContent.slice(0, 200),
          skills: quickEditContent.match(/[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g)?.slice(0, 10) || [],
          experience: [{
            title: 'Position',
            company: 'Company',
            bullets: quickEditContent.split('\n').filter(line => line.startsWith('•') || line.startsWith('-')).map(l => l.slice(1).trim())
          }]
        };
        
        setResumeContent(mockContent);
        analyzeResume(mockContent);
        setAnalyzing(false);
        
        toast({
          title: "Analysis complete",
          description: "Your resume has been analyzed."
        });
      }, 1500);
    } catch (error) {
      setAnalyzing(false);
      toast({
        title: "Analysis failed",
        description: "Could not analyze the content.",
        variant: "destructive"
      });
    }
  };

  const addKeywordToResume = (keyword: string) => {
    if (!resumeContent) return;
    
    const updatedSkills = [...(resumeContent.skills || []), keyword];
    const updatedContent = { ...resumeContent, skills: updatedSkills };
    setResumeContent(updatedContent);
    setMissingKeywords(prev => prev.filter(k => k !== keyword));
    analyzeResume(updatedContent);
    
    toast({
      title: "Keyword added",
      description: `"${keyword}" has been added to your skills.`
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-emerald-400';
    if (score >= 60) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border px-6 py-4 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-primary" />
            Resume Engine
          </h1>
          <p className="text-sm text-muted-foreground">Deep-dive diagnostics and optimization</p>
        </div>
        <Button onClick={handleUploadClick} variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Resume
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-6 pb-12 grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Score Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="command-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <h2 className="font-semibold text-foreground">Score Overview</h2>
            </div>
            
            <div className="flex items-center gap-8">
              {/* Circular Score */}
              <div className="relative">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted/20"
                  />
                  <motion.circle
                    cx="56"
                    cy="56"
                    r="48"
                    strokeWidth="8"
                    fill="none"
                    className={`${overallScore >= 60 ? 'stroke-amber-400' : 'stroke-red-500'}`}
                    strokeLinecap="round"
                    strokeDasharray={301.6}
                    initial={{ strokeDashoffset: 301.6 }}
                    animate={{ strokeDashoffset: 301.6 - (overallScore / 100) * 301.6 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}%
                  </span>
                </div>
              </div>

              {/* ATS Readiness */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">ATS Readiness</span>
                </div>
                <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full bg-gradient-to-r ${getScoreGradient(atsScore)} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${atsScore}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{atsScore}% compatible</p>
              </div>
            </div>
          </motion.div>

          {/* Issues Found */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="command-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="font-semibold text-foreground">Issues Found</h2>
            </div>
            
            <div className="space-y-3">
              {issues.length > 0 ? (
                issues.map((issue, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      issue.type === 'error' 
                        ? 'bg-destructive/10 border border-destructive/20' 
                        : 'bg-amber-500/10 border border-amber-500/20'
                    }`}
                  >
                    {issue.type === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm text-foreground">{issue.message}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No issues found. Your resume looks great!
                </p>
              )}
            </div>
          </motion.div>

          {/* Keyword Gap Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="command-card p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Keyword Gap Analysis</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              These keywords are commonly found in job descriptions but missing from your resume:
            </p>
            
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword, i) => (
                <motion.button
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  onClick={() => addKeywordToResume(keyword)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  {keyword}
                </motion.button>
              ))}
              {missingKeywords.length === 0 && (
                <p className="text-sm text-emerald-500">All common keywords are covered!</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Resume Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="command-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Resume Content</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Manual Edit Mode</span>
                <Switch 
                  checked={manualEditMode} 
                  onCheckedChange={setManualEditMode}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              {bulletPoints.length > 0 ? (
                bulletPoints.map((bullet, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border group"
                  >
                    <div 
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                        bullet.score >= 80 
                          ? 'bg-emerald-500/20 text-emerald-500' 
                          : bullet.score >= 60 
                            ? 'bg-amber-500/20 text-amber-500'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {bullet.score}
                    </div>
                    <p className="text-sm text-foreground flex-1 leading-relaxed">{bullet.text}</p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary shrink-0"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Rewrite
                    </Button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Upload a resume to see content analysis
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Edit */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="command-card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Quick Edit</h2>
            </div>
            
            <Textarea 
              placeholder="Paste your resume content here to analyze..."
              className="min-h-[120px] resize-none bg-background border-border text-sm mb-4"
              value={quickEditContent}
              onChange={(e) => setQuickEditContent(e.target.value)}
            />
            
            <Button 
              onClick={handleQuickAnalyze}
              disabled={analyzing || !quickEditContent.trim()}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Content
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEngine;
