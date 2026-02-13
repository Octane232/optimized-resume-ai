import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Sparkles, Download, Copy, Loader2, Coins } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCredits } from '@/contexts/CreditsContext';

const CoverLetterGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const { balance, spendCredit } = useCredits();
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    yourName: '',
    yourExperience: '',
    keySkills: '',
    whyInterested: ''
  });

  const handleGenerate = async () => {
    // Validate required fields
    if (!formData.jobTitle || !formData.companyName || !formData.yourName) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the job title, company name, and your name.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Spend 1 credit first
      const credited = await spendCredit('cover_letter', `Cover letter for ${formData.jobTitle} at ${formData.companyName}`);
      if (!credited) {
        toast({
          title: "No credits remaining",
          description: "You need 1 credit to generate a cover letter. Upgrade for more credits.",
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-cover-letter', {
        body: formData
      });

      if (error) throw error;

      if (data.coverLetter) {
        setGeneratedLetter(data.coverLetter);
        
        // Save cover letter to database
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error: saveError } = await supabase
            .from('cover_letters')
            .insert({
              user_id: user.id,
              job_title: formData.jobTitle,
              company_name: formData.companyName,
              content: data.coverLetter
            });

          if (saveError) {
            console.error('Error saving cover letter:', saveError);
          }
        }

        // Saved and credited
        
        
        toast({
          title: "Cover Letter Generated!",
          description: "Your personalized cover letter is ready and saved."
        });
      }
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
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    toast({
      title: "Copied!",
      description: "Cover letter copied to clipboard."
    });
  };

  const handleDownload = () => {
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
  };

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-foreground">AI-Powered Cover Letter Generator</span>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground">
          Create Your Perfect Cover Letter
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate a professional, tailored cover letter in seconds using AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="command-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Your Information</h2>
                <p className="text-sm text-muted-foreground">
                  Tell us about yourself and the job
                </p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="yourName">Your Full Name *</Label>
                <Input
                  id="yourName"
                  placeholder="John Doe"
                  value={formData.yourName}
                  onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                  className="form-input-polished"
                />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                placeholder="e.g., Software Engineer, Product Manager"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="form-input-polished"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                placeholder="e.g., Google, Microsoft"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="form-input-polished"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yourExperience">Your Experience</Label>
              <Textarea
                id="yourExperience"
                placeholder="Briefly describe your relevant work experience..."
                value={formData.yourExperience}
                onChange={(e) => setFormData({ ...formData, yourExperience: e.target.value })}
                className="form-input-polished min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keySkills">Key Skills</Label>
              <Input
                id="keySkills"
                placeholder="e.g., Python, React, Team Leadership"
                value={formData.keySkills}
                onChange={(e) => setFormData({ ...formData, keySkills: e.target.value })}
                className="form-input-polished"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whyInterested">Why This Role?</Label>
              <Textarea
                id="whyInterested"
                placeholder="What interests you about this position?"
                value={formData.whyInterested}
                onChange={(e) => setFormData({ ...formData, whyInterested: e.target.value })}
                className="form-input-polished min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || balance <= 0}
              className="w-full h-12 text-base font-semibold saas-button"
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
            </div>
          </div>
        </div>

        {/* Generated Output */}
        <div className="command-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Your Cover Letter</h2>
                  <p className="text-sm text-muted-foreground">
                    AI-generated and ready to use
                  </p>
                </div>
              </div>
              {generatedLetter && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="rounded-xl"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="rounded-xl"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            
            {generatedLetter ? (
              <div className="bg-muted/30 rounded-xl p-6 min-h-[400px] border border-border">
                <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed">
                  {generatedLetter}
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="empty-state-icon">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Cover Letter Yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Fill in the form and click "Generate Cover Letter" to create your personalized cover letter with AI
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
