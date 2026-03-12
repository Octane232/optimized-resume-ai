import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Clipboard, Download, RefreshCw, CheckCircle2, AlertTriangle, TrendingUp, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/contexts/CreditsContext';

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

const ResumeEngine: React.FC<ResumeEngineProps> = () => {
  const { toast } = useToast();
  const { balance, spendCredit } = useCredits();
  
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<BundleResult | null>(null);
  const [activeResultTab, setActiveResultTab] = useState('resume');

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast({ title: "Missing Input", description: "Paste both your resume and the job description.", variant: "destructive" });
      return;
    }

    if (balance <= 0) {
      toast({ title: "No Credits", description: "You need credits to use this feature.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setResult(null);

    try {
      // Spend a credit
      const spent = await spendCredit('apply-bundle', 'Resume + Cover Letter + ATS Score');
      if (!spent) {
        toast({ title: "No Credits", description: "Could not spend credit.", variant: "destructive" });
        setIsProcessing(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user?.id || '')
        .maybeSingle();

      const { data, error } = await supabase.functions.invoke('apply-bundle', {
        body: {
          jobDescription: jobDescription.trim(),
          userResume: resumeText.trim(),
          userName: profile?.full_name || '',
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data);
      setActiveResultTab('ats');
      toast({ title: "Done!", description: "Your tailored resume, cover letter, and ATS score are ready." });
    } catch (error: any) {
      console.error('Apply bundle error:', error);
      toast({ title: "Error", description: error.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const handleReset = () => {
    setResult(null);
    setResumeText('');
    setJobDescription('');
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const progressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Results View
  if (result) {
    return (
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Results Ready</h1>
                <p className="text-sm text-muted-foreground">Tailored resume, cover letter, and ATS score — all from one paste.</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Start Over
            </Button>
          </div>
        </motion.div>

        {/* ATS Score Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" />
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Before Score */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Before</p>
                  <p className={`text-5xl font-black ${scoreColor(result.atsData.beforeScore)}`}>
                    {result.atsData.beforeScore}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Original ATS Score</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-8 h-8 text-emerald-500" />
                    <span className="text-2xl font-bold text-emerald-500">
                      +{result.atsData.afterScore - result.atsData.beforeScore}
                    </span>
                  </div>
                </div>

                {/* After Score */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">After</p>
                  <p className={`text-5xl font-black ${scoreColor(result.atsData.afterScore)}`}>
                    {result.atsData.afterScore}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Optimized ATS Score</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>ATS Compatibility</span>
                  <span>{result.atsData.afterScore}%</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${result.atsData.afterScore}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${progressColor(result.atsData.afterScore)}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs: Resume / Cover Letter / Details */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs value={activeResultTab} onValueChange={setActiveResultTab}>
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Tailored Resume</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(result.tailoredResume, 'Resume')} className="gap-2">
                    <Copy className="w-4 h-4" /> Copy
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-xl p-6 whitespace-pre-wrap text-sm leading-relaxed font-mono max-h-[600px] overflow-y-auto">
                    {result.tailoredResume}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cover">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Cover Letter</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => handleCopy(result.coverLetter, 'Cover Letter')} className="gap-2">
                    <Copy className="w-4 h-4" /> Copy
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-xl p-6 whitespace-pre-wrap text-sm leading-relaxed max-h-[600px] overflow-y-auto">
                    {result.coverLetter}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ats">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Missing Keywords */}
                  {result.atsData.missingKeywords?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Missing Keywords (Added in Tailored Version)
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {result.atsData.missingKeywords.map((kw, i) => (
                          <Badge key={i} variant="outline" className="bg-amber-500/5 text-amber-600 border-amber-500/20">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Improvements */}
                  {result.atsData.improvements?.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        Improvements Made
                      </h4>
                      <ul className="space-y-2">
                        {result.atsData.improvements.map((imp, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    );
  }

  // Input View
  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: '📄', label: 'Paste resume + job', desc: 'One input, three outputs' },
            { icon: '🤖', label: 'AI tailors everything', desc: 'Resume, cover letter, ATS score' },
            { icon: '📊', label: 'See your score jump', desc: 'From 34% to 91% in seconds' },
          ].map((step, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <span className="text-2xl">{step.icon}</span>
                <p className="text-sm font-medium mt-2">{step.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Input Fields */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Your Resume</label>
          <Textarea 
            placeholder="Paste your full resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="min-h-[200px] bg-muted/30 resize-y"
          />
          <p className="text-xs text-muted-foreground mt-1">{resumeText.length > 0 ? `${resumeText.split(/\s+/).filter(Boolean).length} words` : 'Copy from your resume document'}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Job Description</label>
          <Textarea 
            placeholder="Paste the full job posting here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="min-h-[200px] bg-muted/30 resize-y"
          />
          <p className="text-xs text-muted-foreground mt-1">{jobDescription.length > 0 ? `${jobDescription.split(/\s+/).filter(Boolean).length} words` : 'Copy the entire posting from LinkedIn, Indeed, etc.'}</p>
        </div>
      </motion.div>

      {/* Generate Button */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Button 
          onClick={handleGenerate} 
          disabled={isProcessing || !resumeText.trim() || !jobDescription.trim()}
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
              <Badge variant="secondary" className="ml-2 text-xs">1 credit</Badge>
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Credits remaining: {balance}
        </p>
      </motion.div>
    </div>
  );
};

export default ResumeEngine;
