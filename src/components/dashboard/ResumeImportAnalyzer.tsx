import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Link as LinkIcon, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface AnalysisResult {
  match_score: number;
  is_good_fit: boolean;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  keyword_matches?: string[];
  missing_keywords?: string[];
}

export const ResumeImportAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
          const text = new TextDecoder().decode(typedarray);
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOCX, or TXT file",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload your resume first",
        variant: "destructive",
      });
      return;
    }

    const finalJobDescription = jobDescription || jobUrl;
    if (!finalJobDescription) {
      toast({
        title: "Job description required",
        description: "Please provide either a job description or job URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      let resumeText = "";
      
      if (file.type === 'text/plain') {
        resumeText = await file.text();
      } else {
        resumeText = await extractTextFromPDF(file);
      }

      const { data, error } = await supabase.functions.invoke('analyze-resume-match', {
        body: {
          resumeText,
          jobDescription: finalJobDescription
        }
      });

      if (error) throw error;

      setAnalysis(data);
      toast({
        title: "Analysis complete!",
        description: "Your resume has been analyzed against the job description.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number, isGoodFit: boolean) => {
    if (score >= 75 && isGoodFit) {
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-200"><CheckCircle className="w-3 h-3 mr-1" />Excellent Match</Badge>;
    }
    if (score >= 50) {
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"><AlertCircle className="w-3 h-3 mr-1" />Good Match</Badge>;
    }
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-200"><XCircle className="w-3 h-3 mr-1" />Needs Improvement</Badge>;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2">Import & Analyze Your Resume</h3>
          <p className="text-sm text-muted-foreground">
            Upload your existing resume and see how well it matches a specific job
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="resume-upload">Upload Resume (PDF, DOCX, or TXT)</Label>
            <div className="mt-2">
              <Input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {file && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {file.name}
                </p>
              )}
            </div>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Paste Description</TabsTrigger>
              <TabsTrigger value="url">Job URL</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                className="resize-none"
              />
            </TabsContent>
            <TabsContent value="url" className="space-y-2">
              <Label htmlFor="job-url">Job Posting URL</Label>
              <div className="flex gap-2">
                <LinkIcon className="w-4 h-4 mt-3 text-muted-foreground" />
                <Input
                  id="job-url"
                  type="url"
                  placeholder="https://company.com/jobs/position"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={handleAnalyze} 
            disabled={loading || !file}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Resume Match"
            )}
          </Button>
        </div>

        {analysis && (
          <div className="space-y-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold mb-1">
                  <span className={getScoreColor(analysis.match_score)}>
                    {analysis.match_score}%
                  </span>
                  <span className="text-base font-normal text-muted-foreground ml-2">Match Score</span>
                </h4>
                {getScoreBadge(analysis.match_score, analysis.is_good_fit)}
              </div>
              <Progress value={analysis.match_score} className="w-32" />
            </div>

            {analysis.keyword_matches && analysis.keyword_matches.length > 0 && (
              <div>
                <h5 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Matching Keywords
                </h5>
                <div className="flex flex-wrap gap-2">
                  {analysis.keyword_matches.map((keyword, idx) => (
                    <Badge key={idx} variant="outline" className="bg-green-50">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {analysis.missing_keywords && analysis.missing_keywords.length > 0 && (
              <div>
                <h5 className="font-semibold mb-2 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  Missing Keywords
                </h5>
                <div className="flex flex-wrap gap-2">
                  {analysis.missing_keywords.map((keyword, idx) => (
                    <Badge key={idx} variant="outline" className="bg-red-50">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h5 className="font-semibold mb-2 text-green-700">Strengths</h5>
              <ul className="space-y-1">
                {analysis.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-2 text-yellow-700">Gaps to Address</h5>
              <ul className="space-y-1">
                {analysis.gaps.map((gap, idx) => (
                  <li key={idx} className="text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-2 text-blue-700">Recommendations</h5>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm bg-blue-50 p-3 rounded-lg">
                    <span className="font-medium text-blue-900">#{idx + 1}</span> {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
