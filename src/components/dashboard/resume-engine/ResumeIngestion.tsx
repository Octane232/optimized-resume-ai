import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Loader2, X, Link2, Clipboard, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

export interface IngestionResult {
  rawText: string;
  source: 'upload' | 'paste' | 'linkedin';
  fileName?: string;
  fileType?: string;
}

interface ResumeIngestionProps {
  onIngestionComplete: (result: IngestionResult) => void;
  isProcessing?: boolean;
}

const SUPPORTED_TYPES = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'text/plain': 'TXT',
  'application/rtf': 'RTF',
};

const ResumeIngestion: React.FC<ResumeIngestionProps> = ({ onIngestionComplete, isProcessing = false }) => {
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'linkedin'>('upload');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return false;
    }

    const fileName = file.name.toLowerCase();
    const isValidType = Object.keys(SUPPORTED_TYPES).includes(file.type) ||
      fileName.endsWith('.pdf') ||
      fileName.endsWith('.docx') ||
      fileName.endsWith('.txt') ||
      fileName.endsWith('.rtf');

    if (!isValidType) {
      toast({
        title: "Unsupported file type",
        description: "Please upload PDF, DOCX, TXT, or RTF files",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (selectedFile: File) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      setPastedText('');
      setLinkedInUrl('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    // For text files, read directly
    if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      return await file.text();
    }

    // For PDF/DOCX/RTF, use the edge function
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      'https://xpmhahyvtyvrxryrqane.supabase.co/functions/v1/parse-resume-file',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwbWhhaHl2dHl2cnhyeXJxYW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNzk0NTQsImV4cCI6MjA2OTY1NTQ1NH0.-cJ410lQKSLvL43WMGdEpTy0MG6sY9ODLsnQQLYb3x0',
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to parse file');
    }

    return result.text;
  };

  const handleProcess = async () => {
    let resumeText = '';
    let source: IngestionResult['source'] = 'paste';
    let fileName: string | undefined;
    let fileType: string | undefined;

    try {
      if (activeTab === 'upload' && file) {
        setIsExtracting(true);
        resumeText = await extractTextFromFile(file);
        source = 'upload';
        fileName = file.name;
        fileType = file.type;
        setIsExtracting(false);
      } else if (activeTab === 'paste' && pastedText.trim()) {
        resumeText = pastedText.trim();
        source = 'paste';
      } else if (activeTab === 'linkedin' && linkedInUrl.trim()) {
        // LinkedIn import is a placeholder - would need actual API integration
        toast({
          title: "LinkedIn Import",
          description: "LinkedIn import feature coming soon! Please use file upload or paste for now.",
        });
        return;
      } else {
        toast({
          title: "No content provided",
          description: "Please upload a file, paste text, or enter a LinkedIn URL",
          variant: "destructive",
        });
        return;
      }

      if (resumeText.length < 50) {
        toast({
          title: "Content too short",
          description: "Please provide more resume content for accurate analysis",
          variant: "destructive",
        });
        return;
      }

      onIngestionComplete({
        rawText: resumeText,
        source,
        fileName,
        fileType,
      });

    } catch (error: any) {
      console.error('Ingestion error:', error);
      toast({
        title: "Error processing content",
        description: error.message || "Could not process the content. Try a different method.",
        variant: "destructive",
      });
      setIsExtracting(false);
    }
  };

  const hasContent = 
    (activeTab === 'upload' && file) || 
    (activeTab === 'paste' && pastedText.trim().length > 0) ||
    (activeTab === 'linkedin' && linkedInUrl.trim().length > 0);

  const isLoading = isProcessing || isExtracting;

  const getFileTypeLabel = (file: File): string => {
    const ext = file.name.split('.').pop()?.toUpperCase() || 'File';
    return ext;
  };

  return (
    <Card className="overflow-hidden border-primary/20">
      <div className="p-5 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">Resume Ingestion</h3>
            <p className="text-sm text-muted-foreground">
              Upload, paste, or import your resume to begin analysis
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="paste" className="gap-2">
              <Clipboard className="w-4 h-4" />
              Paste
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="gap-2">
              <Link2 className="w-4 h-4" />
              LinkedIn
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <AnimatePresence mode="wait">
              {!file ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragging 
                      ? 'border-primary bg-primary/10' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/30'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt,.rtf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className={`w-12 h-12 mx-auto mb-3 transition-colors ${
                    isDragging ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <p className="text-sm font-medium text-foreground">
                    {isDragging ? 'Drop your resume here' : 'Drag & drop your resume'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {Object.values(SUPPORTED_TYPES).map((type) => (
                      <span 
                        key={type}
                        className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="file-preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                        <span className="text-xs px-1.5 py-0.5 bg-emerald-500/20 text-emerald-600 rounded">
                          {getFileTypeLabel(file)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearFile}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="paste" className="mt-4 space-y-3">
            <div>
              <Label htmlFor="resume-text" className="text-sm mb-2 block">
                Paste your resume content
              </Label>
              <Textarea
                id="resume-text"
                placeholder="Copy and paste your entire resume text here...

Include all sections: contact info, summary, experience, education, skills, etc."
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={10}
                className="resize-none font-mono text-sm"
              />
            </div>
            {pastedText && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{pastedText.split(/\s+/).filter(Boolean).length} words</span>
                <span>{pastedText.length} characters</span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="linkedin" className="mt-4 space-y-3">
            <div>
              <Label htmlFor="linkedin-url" className="text-sm mb-2 block">
                LinkedIn Profile URL
              </Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="linkedin-url"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                We'll extract your profile data to create a structured resume
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-600 dark:text-amber-400">
                ⚠️ LinkedIn import requires a public profile or authentication. Feature coming soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleProcess}
          disabled={!hasContent || isLoading}
          className="w-full gap-2"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {isExtracting ? 'Extracting Text...' : 'Processing...'}
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Process Resume
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};

export default ResumeIngestion;
