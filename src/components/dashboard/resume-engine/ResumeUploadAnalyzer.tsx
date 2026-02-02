import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Loader2, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ResumeUploadAnalyzerProps {
  onAnalysisComplete: (analysis: any) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
}

const ResumeUploadAnalyzer = ({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: ResumeUploadAnalyzerProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOCX, or TXT file",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      setPastedText('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(droppedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOCX, or TXT file",
          variant: "destructive",
        });
        return;
      }
      setFile(droppedFile);
      setPastedText('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'text/plain') {
      return await file.text();
    }
    
    // For PDF/DOCX, read as text (basic extraction)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = new TextDecoder().decode(new Uint8Array(e.target?.result as ArrayBuffer));
          // Clean up the text - remove non-printable characters
          const cleanText = text.replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s+/g, ' ').trim();
          resolve(cleanText);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleAnalyze = async () => {
    let resumeText = '';

    if (activeTab === 'upload' && file) {
      try {
        resumeText = await extractTextFromFile(file);
      } catch (error) {
        toast({
          title: "Error reading file",
          description: "Could not read the file. Try pasting the content instead.",
          variant: "destructive",
        });
        return;
      }
    } else if (activeTab === 'paste' && pastedText.trim()) {
      resumeText = pastedText.trim();
    } else {
      toast({
        title: "No resume content",
        description: "Please upload a file or paste your resume text",
        variant: "destructive",
      });
      return;
    }

    if (resumeText.length < 100) {
      toast({
        title: "Content too short",
        description: "Please provide more resume content for accurate analysis",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-resume-ats', {
        body: { 
          resumeContent: { rawText: resumeText },
          mode: 'uploaded'
        }
      });

      if (error) throw error;
      
      onAnalysisComplete(data);
      toast({ 
        title: `Score: ${data.overall_score}/100`, 
        description: "AI analyzed your uploaded resume for mistakes and improvements" 
      });
    } catch (error: any) {
      toast({
        title: "Analysis failed",
        description: error.message || "Could not analyze the resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const hasContent = (activeTab === 'upload' && file) || (activeTab === 'paste' && pastedText.trim().length > 0);

  return (
    <Card className="overflow-hidden">
      <div className="p-5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Upload className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Upload Resume for Analysis</h3>
            <p className="text-xs text-muted-foreground">Upload or paste your resume to find mistakes</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'upload' | 'paste')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="paste" className="gap-2">
              <FileText className="w-4 h-4" />
              Paste Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            {!file ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">Drop your resume here</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                <p className="text-xs text-muted-foreground mt-3">Supports PDF, DOCX, TXT</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="paste" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="resume-text" className="text-sm">Paste your resume content</Label>
              <Textarea
                id="resume-text"
                placeholder="Paste your full resume text here..."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={8}
                className="resize-none"
              />
              {pastedText && (
                <p className="text-xs text-muted-foreground">
                  {pastedText.length} characters
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-2 flex items-center gap-3">
          <Button
            onClick={handleAnalyze}
            disabled={!hasContent || isAnalyzing}
            className="flex-1 gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                Find Mistakes
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          AI will scan for formatting issues, missing keywords, and improvement opportunities
        </p>
      </div>
    </Card>
  );
};

export default ResumeUploadAnalyzer;
