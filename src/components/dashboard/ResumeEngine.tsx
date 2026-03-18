import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Sparkles,
  Clipboard,
  Download,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Copy,
  Loader2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUsageLimit } from '@/contexts/UsageLimitContext';

// ===== Type Definitions =====
interface ResumeEngineProps {
  setActiveTab?: (tab: string) => void;
  hasResume?: boolean;
}

interface BundleResult {
  tailoredResume: string;
  coverLetter: string;
  atsData: {
    beforeScore: number;
    afterScore: number;
    foundKeywords: string[];
    missingKeywords: string[];
    improvements: string[];
  };
}

interface StepCard {
  icon: string;
  label: string;
  desc: string;
}

// ===== Constants =====
const STEPS: StepCard[] = [
  { icon: '📄', label: 'Paste resume + job', desc: 'One input, three outputs' },
  { icon: '✨', label: 'AI tailors everything', desc: 'Resume, cover letter, ATS score' },
  { icon: '📈', label: 'See your score jump', desc: 'From 34% to 91% in seconds' },
];

// ===== Helper Functions =====
const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
};

const getProgressColor = (score: number): string => {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
};

// ===== Main Component =====
const ResumeEngine: React.FC<ResumeEngineProps> = () => {
  // ===== Hooks =====
  const { toast } = useToast();
  const { canUse, trackUsage, getRemaining } = useUsageLimit();

  // ===== State =====
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<BundleResult | null>(null);
  const [activeResultTab, setActiveResultTab] = useState('resume');

  // ===== Event Handlers =====
  const handleGenerate = async () => {
    // Validate inputs
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast({
        title: "Missing Input",
        description: "Paste both your resume and the job description.",
        variant: "destructive"
      });
      return;
    }

    // Check credits
    if (!canUse('resume_ats')) {
      toast({
        title: "No Credits",
        description: "You need credits to use this feature.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      // Spend a credit
      const spent = await trackUsage('resume_ats');
      if (!spent) {
        toast({
          title: "No Credits",
          description: "Could not spend credit.",
          variant: "destructive"
        });
        setIsProcessing(false);
        return;
      }

      // Get user profile
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user?.id || '')
        .maybeSingle();

      // Call edge function
      const { data, error } = await supabase.functions.invoke('apply-bundle', {
        body: {
          jobDescription: jobDescription.trim(),
          userResume: resumeText.trim(),
          userName: profile?.full_name || '',
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Update state with results
      setResult(data);
      setActiveResultTab('ats');

      toast({
        title: "Done!",
        description: "Your tailored resume, cover letter, and ATS score are ready."
      });

    } catch (error: any) {
      console.error('Apply bundle error:', error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`
    });
  };

  const handleReset = () => {
    setResult(null);
    setResumeText('');
    setJobDescription('');
  };

  const getWordCount = (text: string): number => {
    return text.split(/\s+/).filter(Boolean).length;
  };

  // ===== Render Results View =====
  if (result) {
    return <ResultsView
      result={result}
      activeTab={activeResultTab}
      onTabChange={setActiveResultTab}
      onCopy={handleCopy}
      onReset={handleReset}
    />;
  }

  // ===== Render Input View =====
  return (
    <InputView
      resumeText={resumeText}
      jobDescription={jobDescription}
      isProcessing={isProcessing}
      canGenerate={canUse('resume_ats')}
      remaining={getRemaining('resume_ats')}
      onResumeChange={setResumeText}
      onJobDescriptionChange={setJobDescription}
      onGenerate={handleGenerate}
    />
  );
};

// ===== Results View Component =====
interface ResultsViewProps {
  result: BundleResult;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCopy: (text: string, label: string) => void;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  activeTab,
  onTabChange,
  onCopy,
  onReset,
}) => {
  const scoreImprovement = result.atsData.afterScore - result.atsData.beforeScore;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Results Ready</h1>
              <p className="text-sm text-muted-foreground">
                Tailored resume, cover letter, and ATS score — all from one paste.
              </p>
            </div>
          </div>

          <Button variant="outline" onClick={onReset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Start Over
          </Button>
        </div>
      </motion.div>

      {/* ATS Score Summary */}
      <ScoreSummary
        beforeScore={result.atsData.beforeScore}
        afterScore={result.atsData.afterScore}
        improvement={scoreImprovement}
      />

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resume" className="gap-2">
              <FileText className="w-4 h-4" />
              Tailored Resume
            </TabsTrigger>
            <TabsTrigger value="cover" className="gap-2">
              <Clipboard className="w-4 h-4" />
              Cover Letter
            </TabsTrigger>
            <TabsTrigger value="ats" className="gap-2">
              <Sparkles className="w-4 h-4" />
              ATS Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume">
            <ResultCard
              title="Tailored Resume"
              content={result.tailoredResume}
              onCopy={() => onCopy(result.tailoredResume, 'Resume')}
              isMonospace
            />
          </TabsContent>

          <TabsContent value="cover">
            <ResultCard
              title="Cover Letter"
              content={result.coverLetter}
              onCopy={() => onCopy(result.coverLetter, 'Cover Letter')}
            />
          </TabsContent>

          <TabsContent value="ats">
            <ATSDetails
              missingKeywords={result.atsData.missingKeywords}
              foundKeywords={result.atsData.foundKeywords}
              improvements={result.atsData.improvements}
            />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

// ===== Score Summary Component =====
interface ScoreSummaryProps {
  beforeScore: number;
  afterScore: number;
  improvement: number;
}

const ScoreSummary: React.FC<ScoreSummaryProps> = ({
  beforeScore,
  afterScore,
  improvement,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
  >
    <Card className="border-0 shadow-lg overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />
      <CardContent className="p-6">
        {/* Score Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScoreDisplay
            label="Before"
            score={beforeScore}
            size="large"
          />

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-emerald-500" />
              <span className="text-2xl font-bold text-emerald-500">
                +{improvement}
              </span>
            </div>
          </div>

          <ScoreDisplay
            label="After"
            score={afterScore}
            size="large"
          />
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>ATS Compatibility</span>
            <span>{afterScore}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${afterScore}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full rounded-full ${getProgressColor(afterScore)}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// ===== Score Display Component =====
interface ScoreDisplayProps {
  label: string;
  score: number;
  size?: 'small' | 'large';
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  label,
  score,
  size = 'large'
}) => {
  const textSize = size === 'large' ? 'text-5xl' : 'text-3xl';

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className={`${textSize} font-black ${getScoreColor(score)}`}>
        {score}%
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        {label === 'Before' ? 'Original ATS Score' : 'Optimized ATS Score'}
      </p>
    </div>
  );
};

// ===== Result Card Component =====
interface ResultCardProps {
  title: string;
  content: string;
  onCopy: () => void;
  isMonospace?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({
  title,
  content,
  onCopy,
  isMonospace = false,
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle className="text-lg">{title}</CardTitle>
      <Button variant="outline" size="sm" onClick={onCopy} className="gap-2">
        <Copy className="w-4 h-4" /> Copy
      </Button>
    </CardHeader>
    <CardContent>
      <div
        className={`
          bg-muted/30 rounded-xl p-6 whitespace-pre-wrap text-sm leading-relaxed
          max-h-[600px] overflow-y-auto
          ${isMonospace ? 'font-mono' : ''}
        `}
      >
        {content}
      </div>
    </CardContent>
  </Card>
);

// ===== ATS Details Component =====
interface ATSDetailsProps {
  missingKeywords: string[];
  foundKeywords: string[];
  improvements: string[];
}

const ATSDetails: React.FC<ATSDetailsProps> = ({
  missingKeywords,
  foundKeywords,
  improvements,
}) => (
  <Card>
    <CardContent className="p-6 space-y-6">
      {/* Missing Keywords */}
      {missingKeywords?.length > 0 && (
        <KeywordSection
          title="Missing Keywords (Added in Tailored Version)"
          icon={AlertTriangle}
          iconColor="text-amber-500"
          keywords={missingKeywords}
          badgeClassName="bg-amber-500/5 text-amber-600 border-amber-500/20"
        />
      )}

      {/* Found Keywords */}
      {foundKeywords?.length > 0 && (
        <KeywordSection
          title="Keywords Already Present"
          icon={CheckCircle2}
          iconColor="text-emerald-500"
          keywords={foundKeywords}
          badgeClassName="bg-emerald-500/5 text-emerald-600 border-emerald-500/20"
          prefix="✓"
        />
      )}

      {/* Improvements */}
      {improvements?.length > 0 && (
        <ImprovementsSection improvements={improvements} />
      )}
    </CardContent>
  </Card>
);

// ===== Keyword Section Component =====
interface KeywordSectionProps {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  keywords: string[];
  badgeClassName: string;
  prefix?: string;
}

const KeywordSection: React.FC<KeywordSectionProps> = ({
  title,
  icon: Icon,
  iconColor,
  keywords,
  badgeClassName,
  prefix = '',
}) => (
  <div>
    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      {title}
    </h4>
    <div className="flex flex-wrap gap-2">
      {keywords.map((keyword, index) => (
        <Badge key={index} variant="outline" className={badgeClassName}>
          {prefix && `${prefix} `}{keyword}
        </Badge>
      ))}
    </div>
  </div>
);

// ===== Improvements Section Component =====
interface ImprovementsSectionProps {
  improvements: string[];
}

const ImprovementsSection: React.FC<ImprovementsSectionProps> = ({
  improvements,
}) => (
  <div>
    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      Improvements Made
    </h4>
    <ul className="space-y-2">
      {improvements.map((improvement, index) => (
        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          {improvement}
        </li>
      ))}
    </ul>
  </div>
);

// ===== Input View Component =====
interface InputViewProps {
  resumeText: string;
  jobDescription: string;
  isProcessing: boolean;
  canGenerate: boolean;
  remaining: number;
  onResumeChange: (text: string) => void;
  onJobDescriptionChange: (text: string) => void;
  onGenerate: () => Promise<void>;
}

const InputView: React.FC<InputViewProps> = ({
  resumeText,
  jobDescription,
  isProcessing,
  canGenerate,
  remaining,
  onResumeChange,
  onJobDescriptionChange,
  onGenerate,
}) => {
  const getWordCount = (text: string): number => {
    return text.split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Resume + ATS</h1>
            <p className="text-sm text-muted-foreground">
              Paste your resume and a job description. Get a tailored resume, cover letter, and ATS score in 60 seconds.
            </p>
          </div>
        </div>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="grid grid-cols-3 gap-4">
          {STEPS.map((step, index) => (
            <StepCard key={index} step={step} />
          ))}
        </div>
      </motion.div>

      {/* Input Fields */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <InputField
          label="Your Resume"
          value={resumeText}
          onChange={onResumeChange}
          placeholder="Paste your full resume text here..."
          helperText={resumeText.length > 0
            ? `${getWordCount(resumeText)} words`
            : 'Copy from your resume document'}
        />

        <InputField
          label="Job Description"
          value={jobDescription}
          onChange={onJobDescriptionChange}
          placeholder="Paste the full job posting here..."
          helperText={jobDescription.length > 0
            ? `${getWordCount(jobDescription)} words`
            : 'Copy the entire posting from LinkedIn, Indeed, etc.'}
        />
      </motion.div>

      {/* Generate Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <Button
          onClick={onGenerate}
          disabled={isProcessing || !resumeText.trim() || !jobDescription.trim() || !canGenerate}
          size="lg"
          className="w-full h-14 text-lg font-semibold gap-3 rounded-2xl"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating... (takes ~30 seconds)
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Tailored Resume + Cover Letter + ATS Score
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground mt-2">
          Application bundles remaining: {remaining}
        </p>
      </motion.div>
    </div>
  );
};

// ===== Step Card Component =====
interface StepCardProps {
  step: StepCard;
}

const StepCard: React.FC<StepCardProps> = ({ step }) => (
  <Card className="border-0 shadow-sm">
    <CardContent className="p-4 text-center">
      <span className="text-2xl">{step.icon}</span>
      <p className="text-sm font-medium mt-2">{step.label}</p>
      <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
    </CardContent>
  </Card>
);

// ===== Input Field Component =====
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  helperText: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  helperText,
}) => (
  <div>
    <label className="text-sm font-medium text-foreground mb-2 block">
      {label}
    </label>
    <Textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[200px] bg-muted/30 resize-y"
    />
    <p className="text-xs text-muted-foreground mt-1">{helperText}</p>
  </div>
);

export default ResumeEngine;
