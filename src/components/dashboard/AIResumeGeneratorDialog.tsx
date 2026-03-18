import React, { useState } from 'react';
import { Coins, Sparkles, Loader2, Briefcase } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useUsageLimit } from '@/contexts/UsageLimitContext';
import { useToast } from '@/hooks/use-toast';
import { ResumeData } from '@/types/resume';

// ===== Type Definitions =====
interface AIResumeGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerated: (data: ResumeData) => void;
  currentName?: string;
  currentEmail?: string;
  currentPhone?: string;
}

// ===== Main Component =====
const AIResumeGeneratorDialog: React.FC<AIResumeGeneratorDialogProps> = ({
  open,
  onOpenChange,
  onGenerated,
  currentName = '',
  currentEmail = '',
  currentPhone = '',
}) => {
  // ===== Hooks =====
  const { canUse, trackUsage } = useUsageLimit();
  const { toast } = useToast();

  // ===== State =====
  const [jobDescription, setJobDescription] = useState('');
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const [phone, setPhone] = useState(currentPhone);
  const [generating, setGenerating] = useState(false);

  // ===== Derived Values =====
  const hasCredits = canUse('resume_ats');
  const isFormValid = jobDescription.trim().length > 0;

  // ===== Event Handlers =====
  const handleGenerate = async () => {
    // Validate input
    if (!isFormValid) {
      toast({
        title: 'Job description required',
        description: 'Paste a job description to generate a tailored resume.',
        variant: 'destructive'
      });
      return;
    }

    // Check credits
    if (!hasCredits) {
      toast({
        title: 'No credits remaining',
        description: "Upgrade your plan for more credits.",
        variant: 'destructive'
      });
      return;
    }

    // Spend credit first
    const credited = await trackUsage('resume_ats');
    if (!credited) {
      toast({
        title: 'No credits remaining',
        description: "Upgrade your plan for more credits.",
        variant: 'destructive'
      });
      return;
    }

    setGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-resume-content', {
        body: {
          name: name || 'Your Name',
          email: email || '',
          phone: phone || '',
          targetRole: '',
          jobDescription: jobDescription.trim(),
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.data) {
        onGenerated(data.data as ResumeData);
        onOpenChange(false);
        toast({
          title: 'Resume generated!',
          description: 'Your AI-tailored resume is ready. Review and customize it.'
        });
        setJobDescription('');
      }
    } catch (error: any) {
      console.error('AI generation error:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleInputChange = (field: 'name' | 'email' | 'phone', value: string) => {
    switch (field) {
      case 'name':
        setName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        setPhone(value);
        break;
    }
  };

  // ===== Render =====
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            AI Resume Generator
          </DialogTitle>
          <DialogDescription>
            Paste a job description and we'll generate a tailored, ATS-optimized resume that matches the role's requirements.
          </DialogDescription>
        </DialogHeader>

        <FormContent
          name={name}
          email={email}
          phone={phone}
          jobDescription={jobDescription}
          generating={generating}
          hasCredits={hasCredits}
          isFormValid={isFormValid}
          onInputChange={handleInputChange}
          onJobDescriptionChange={setJobDescription}
          onGenerate={handleGenerate}
        />
      </DialogContent>
    </Dialog>
  );
};

// ===== Form Content Component =====
interface FormContentProps {
  name: string;
  email: string;
  phone: string;
  jobDescription: string;
  generating: boolean;
  hasCredits: boolean;
  isFormValid: boolean;
  onInputChange: (field: 'name' | 'email' | 'phone', value: string) => void;
  onJobDescriptionChange: (value: string) => void;
  onGenerate: () => Promise<void>;
}

const FormContent: React.FC<FormContentProps> = ({
  name,
  email,
  phone,
  jobDescription,
  generating,
  hasCredits,
  isFormValid,
  onInputChange,
  onJobDescriptionChange,
  onGenerate,
}) => (
  <div className="space-y-4 pt-2">
    {/* Basic Info Grid */}
    <BasicInfoGrid
      name={name}
      email={email}
      phone={phone}
      onInputChange={onInputChange}
    />

    {/* Job Description */}
    <JobDescriptionField
      value={jobDescription}
      onChange={onJobDescriptionChange}
    />

    {/* Action Button */}
    <GenerateButton
      generating={generating}
      hasCredits={hasCredits}
      isFormValid={isFormValid}
      onClick={onGenerate}
    />

    {/* No Credits Warning */}
    {!hasCredits && <NoCreditsWarning />}
  </div>
);

// ===== Basic Info Grid Component =====
interface BasicInfoGridProps {
  name: string;
  email: string;
  phone: string;
  onInputChange: (field: 'name' | 'email' | 'phone', value: string) => void;
}

const BasicInfoGrid: React.FC<BasicInfoGridProps> = ({
  name,
  email,
  phone,
  onInputChange,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    <InputField
      id="gen-name"
      label="Full Name"
      value={name}
      onChange={(value) => onInputChange('name', value)}
      placeholder="Your Name"
    />

    <InputField
      id="gen-email"
      label="Email"
      value={email}
      onChange={(value) => onInputChange('email', value)}
      placeholder="you@email.com"
      type="email"
    />

    <InputField
      id="gen-phone"
      label="Phone"
      value={phone}
      onChange={(value) => onInputChange('phone', value)}
      placeholder="(555) 123-4567"
      type="tel"
    />
  </div>
);

// ===== Input Field Component =====
interface InputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={id} className="text-xs">{label}</Label>
    <Input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-9"
    />
  </div>
);

// ===== Job Description Field Component =====
interface JobDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const JobDescriptionField: React.FC<JobDescriptionFieldProps> = ({ value, onChange }) => (
  <div className="space-y-1.5">
    <Label htmlFor="gen-jd" className="flex items-center gap-1.5">
      <Briefcase className="w-4 h-4 text-muted-foreground" />
      Job Description
    </Label>

    <Textarea
      id="gen-jd"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste the full job description here... The AI will extract key requirements, skills, and keywords to create a perfectly tailored resume."
      rows={10}
      className="resize-none text-sm"
    />

    <p className="text-xs text-muted-foreground">
      Tip: Include the full posting — role, requirements, qualifications, and preferred skills for best results.
    </p>
  </div>
);

// ===== Generate Button Component =====
interface GenerateButtonProps {
  generating: boolean;
  hasCredits: boolean;
  isFormValid: boolean;
  onClick: () => Promise<void>;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  generating,
  hasCredits,
  isFormValid,
  onClick,
}) => (
  <Button
    onClick={onClick}
    disabled={generating || !hasCredits || !isFormValid}
    className="w-full gap-2"
    size="lg"
  >
    {generating ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin" />
        Generating Resume...
      </>
    ) : (
      <>
        <Sparkles className="w-4 h-4" />
        Generate Tailored Resume
        <span className="ml-1 inline-flex items-center gap-1 text-xs opacity-80 bg-white/20 px-1.5 py-0.5 rounded">
          <Coins className="w-3 h-3" />1
        </span>
      </>
    )}
  </Button>
);

// ===== No Credits Warning Component =====
const NoCreditsWarning: React.FC = () => (
  <p className="text-xs text-destructive text-center">
    You have no credits remaining. Upgrade your plan to continue using AI features.
  </p>
);

export default AIResumeGeneratorDialog;
