import React, { useState, useCallback, useMemo } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Loader2,
  Coins
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUsageLimit } from '@/contexts/UsageLimitContext';

// ===== Type Definitions =====
interface FormData {
  jobTitle: string;
  companyName: string;
  yourName: string;
  yourExperience: string;
  keySkills: string;
  whyInterested: string;
}

// ===== Main Component =====
const CoverLetterGenerator = () => {
  // ===== Hooks =====
  const { toast } = useToast();
  const { canUse, trackUsage, loading: usageLoading } = useUsageLimit();

  // ===== State =====
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [formData, setFormData] = useState<FormData>({
    jobTitle: '',
    companyName: '',
    yourName: '',
    yourExperience: '',
    keySkills: '',
    whyInterested: ''
  });

  // ===== Derived Values =====
  const canGenerate = useMemo(() => {
    return canUse('cover_letter') && !usageLoading;
  }, [canUse, usageLoading]);

  const isFormValid = useMemo((): boolean => {
    return !!(formData.jobTitle && formData.companyName && formData.yourName);
  }, [formData.jobTitle, formData.companyName, formData.yourName]);

  // ===== Helper Functions =====
  const saveCoverLetter = useCallback(async (content: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { error: saveError } = await supabase
        .from('cover_letters')
        .insert({
          user_id: user.id,
          job_title: formData.jobTitle,
          company_name: formData.companyName,
          content: content
        });

      if (saveError) {
        console.error('Error saving cover letter:', saveError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in saveCoverLetter:', error);
      return false;
    }
  }, [formData.jobTitle, formData.companyName]);

  // ===== Event Handlers =====
  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleGenerate = useCallback(async () => {
    // Validate required fields
    if (!isFormValid) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the job title, company name, and your name.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    let generatedContent = '';

    try {
      // Step 1: Call edge function to generate cover letter
      const { data, error } = await supabase.functions.invoke('generate-cover-letter', {
        body: formData
      });

      if (error) throw error;

      if (!data.coverLetter) {
        throw new Error('No cover letter generated');
      }

      generatedContent = data.coverLetter;

      // Step 2: Attempt to save to database (non-critical)
      const saveSuccess = await saveCoverLetter(generatedContent);
      
      if (!saveSuccess) {
        toast({
          title: "Save Failed",
          description: "Cover letter was generated but could not be saved. You can still copy or download it.",
          variant: "destructive"
        });
      }

      // Step 3: Deduct credit ONLY after successful generation
      const credited = await trackUsage('cover_letter');
      
      if (!credited) {
        // No credit deducted - do NOT show the letter
        toast({
          title: "Credit Required",
          description: "You need 1 credit to generate a cover letter. Please upgrade your plan.",
          variant: "destructive"
        });
        return;
      }

      // Step 4: Only show the letter if credit was successfully deducted
      setGeneratedLetter(generatedContent);

      toast({
        title: "Success!",
        description: saveSuccess 
          ? "Your cover letter has been generated and saved." 
          : "Your cover letter has been generated. Copy or download it to save locally.",
      });

    } catch (error) {
      console.error('Error generating cover letter:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate cover letter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [formData, isFormValid, saveCoverLetter, toast, trackUsage]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copied!",
      description: "Cover letter copied to clipboard."
    });
  }, [generatedLetter, toast]);

  const handleDownload = useCallback(() => {
    const element = document.createElement('a');
    const file = new Blob([generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `cover-letter-${formData.companyName || 'new'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Downloaded!",
      description: "Cover letter downloaded successfully."
    });
  }, [generatedLetter, formData.companyName, toast]);

  const handleReset = useCallback(() => {
    setFormData({
      jobTitle: '',
      companyName: '',
      yourName: '',
      yourExperience: '',
      keySkills: '',
      whyInterested: ''
    });
    setGeneratedLetter('');
    toast({
      title: "Reset",
      description: "Form has been cleared."
    });
  }, [toast]);

  // ===== Render =====
  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <HeaderSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InputForm
          formData={formData}
          isGenerating={isGenerating}
          canGenerate={canGenerate}
          usageLoading={usageLoading}
          onInputChange={handleInputChange}
          onGenerate={handleGenerate}
          onReset={handleReset}
        />

        <OutputSection
          generatedLetter={generatedLetter}
          companyName={formData.companyName}
          onCopy={handleCopy}
          onDownload={handleDownload}
        />
      </div>
    </div>
  );
};

// ===== Header Section =====
const HeaderSection: React.FC = () => (
  <div className="text-center space-y-4">
    <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10">
      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
        <FileText className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm font-medium text-foreground">
        AI-Powered Cover Letter Generator
      </span>
    </div>

    <h1 className="text-3xl font-bold text-foreground">
      Create Your Perfect Cover Letter
    </h1>

    <p className="text-muted-foreground max-w-2xl mx-auto">
      Generate a professional, tailored cover letter in seconds using AI
    </p>
  </div>
);

// ===== Input Form Component =====
interface InputFormProps {
  formData: FormData;
  isGenerating: boolean;
  canGenerate: boolean;
  usageLoading: boolean;
  onInputChange: (field: keyof FormData, value: string) => void;
  onGenerate: () => Promise<void>;
  onReset: () => void;
}

const InputForm: React.FC<InputFormProps> = ({
  formData,
  isGenerating,
  canGenerate,
  usageLoading,
  onInputChange,
  onGenerate,
  onReset,
}) => (
  <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
    <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />

    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Your Information</h2>
            <p className="text-sm text-muted-foreground">
              Tell us about yourself and the job
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          disabled={isGenerating}
        >
          Reset
        </Button>
      </div>

      <div className="space-y-5">
        <FormField
          id="yourName"
          label="Your Full Name *"
          value={formData.yourName}
          onChange={(value) => onInputChange('yourName', value)}
          placeholder="John Doe"
        />

        <FormField
          id="jobTitle"
          label="Job Title *"
          value={formData.jobTitle}
          onChange={(value) => onInputChange('jobTitle', value)}
          placeholder="e.g., Software Engineer, Product Manager"
        />

        <FormField
          id="companyName"
          label="Company Name *"
          value={formData.companyName}
          onChange={(value) => onInputChange('companyName', value)}
          placeholder="e.g., Google, Microsoft"
        />

        <FormTextArea
          id="yourExperience"
          label="Your Experience"
          value={formData.yourExperience}
          onChange={(value) => onInputChange('yourExperience', value)}
          placeholder="Briefly describe your relevant work experience..."
        />

        <FormField
          id="keySkills"
          label="Key Skills"
          value={formData.keySkills}
          onChange={(value) => onInputChange('keySkills', value)}
          placeholder="e.g., Python, React, Team Leadership"
        />

        <FormTextArea
          id="whyInterested"
          label="Why This Role?"
          value={formData.whyInterested}
          onChange={(value) => onInputChange('whyInterested', value)}
          placeholder="What interests you about this position?"
        />

        <GenerateButton
          isGenerating={isGenerating}
          canGenerate={canGenerate}
          usageLoading={usageLoading}
          onClick={onGenerate}
        />
      </div>
    </div>
  </div>
);

// ===== Form Field Component =====
interface FormFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text'
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// ===== Form TextArea Component =====
interface FormTextAreaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Textarea
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-h-[100px]"
    />
  </div>
);

// ===== Generate Button Component =====
interface GenerateButtonProps {
  isGenerating: boolean;
  canGenerate: boolean;
  usageLoading: boolean;
  onClick: () => Promise<void>;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  isGenerating,
  canGenerate,
  usageLoading,
  onClick,
}) => (
  <Button
    onClick={onClick}
    disabled={isGenerating || !canGenerate || usageLoading}
    className="w-full h-12 text-base font-semibold"
  >
    {isGenerating ? (
      <>
        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
        Generating...
      </>
    ) : (
      <>
        <Sparkles className="w-5 h-5 mr-3" />
        Generate Cover Letter
        <span className="ml-2 inline-flex items-center gap-1 text-xs opacity-80">
          <Coins className="w-3 h-3" />1
        </span>
      </>
    )}
  </Button>
);

// ===== Output Section Component =====
interface OutputSectionProps {
  generatedLetter: string;
  companyName: string;
  onCopy: () => void;
  onDownload: () => void;
}

const OutputSection: React.FC<OutputSectionProps> = ({
  generatedLetter,
  companyName,
  onCopy,
  onDownload,
}) => (
  <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
    <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Your Cover Letter</h2>
            <p className="text-sm text-muted-foreground">
              AI-generated and ready to use
            </p>
          </div>
        </div>

        {generatedLetter && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCopy}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDownload}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {generatedLetter ? (
        <div className="bg-muted/30 rounded-xl p-6 min-h-[400px] border">
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
            {generatedLetter}
          </pre>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            No Cover Letter Yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Fill in the form and click "Generate Cover Letter" to create your personalized cover letter with AI
          </p>
        </div>
      )}
    </div>
  </div>
);

export default CoverLetterGenerator;
