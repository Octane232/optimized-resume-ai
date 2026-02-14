import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins, Sparkles, Loader2, Briefcase } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCredits } from '@/contexts/CreditsContext';
import { useToast } from '@/hooks/use-toast';
import { ResumeData } from '@/types/resume';

interface AIResumeGeneratorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerated: (data: ResumeData) => void;
  currentName?: string;
  currentEmail?: string;
  currentPhone?: string;
}

const AIResumeGeneratorDialog: React.FC<AIResumeGeneratorDialogProps> = ({
  open,
  onOpenChange,
  onGenerated,
  currentName = '',
  currentEmail = '',
  currentPhone = '',
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const [phone, setPhone] = useState(currentPhone);
  const [generating, setGenerating] = useState(false);
  const { balance, spendCredit } = useCredits();
  const { toast } = useToast();

  const hasCredits = balance > 0;

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast({ title: 'Job description required', description: 'Paste a job description to generate a tailored resume.', variant: 'destructive' });
      return;
    }

    if (!hasCredits) {
      toast({ title: 'No credits remaining', description: "Upgrade your plan for more credits.", variant: 'destructive' });
      return;
    }

    // Spend credit first
    const credited = await spendCredit('ai_resume_generate', 'AI Resume from Job Description');
    if (!credited) {
      toast({ title: 'No credits remaining', description: "Upgrade your plan for more credits.", variant: 'destructive' });
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
        toast({ title: 'Resume generated!', description: 'Your AI-tailored resume is ready. Review and customize it.' });
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

        <div className="space-y-4 pt-2">
          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="gen-name" className="text-xs">Full Name</Label>
              <Input id="gen-name" value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gen-email" className="text-xs">Email</Label>
              <Input id="gen-email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gen-phone" className="text-xs">Phone</Label>
              <Input id="gen-phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 123-4567" className="h-9" />
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-1.5">
            <Label htmlFor="gen-jd" className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-muted-foreground" />
              Job Description
            </Label>
            <Textarea
              id="gen-jd"
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here... The AI will extract key requirements, skills, and keywords to create a perfectly tailored resume."
              rows={10}
              className="resize-none text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Include the full posting — role, requirements, qualifications, and preferred skills for best results.
            </p>
          </div>

          {/* Action */}
          <Button
            onClick={handleGenerate}
            disabled={generating || !hasCredits || !jobDescription.trim()}
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

          {!hasCredits && (
            <p className="text-xs text-destructive text-center">
              You have no credits remaining. Upgrade your plan to continue using AI features.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIResumeGeneratorDialog;
