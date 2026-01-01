import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Briefcase, GraduationCap, Code, Palette, Users, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [selections, setSelections] = useState({
    target_role: '',
    experience_level: '',
    target_industry: '',
    preferred_tone: ''
  });

  const steps = [
    {
      title: "What type of role are you targeting?",
      key: 'target_role',
      options: [
        { id: 'technology', label: 'Technology', icon: Code, description: 'Software, Engineering, IT' },
        { id: 'creative', label: 'Creative', icon: Palette, description: 'Design, Marketing, Media' },
        { id: 'business', label: 'Business', icon: Briefcase, description: 'Finance, Sales, Consulting' },
        { id: 'education', label: 'Education', icon: GraduationCap, description: 'Teaching, Research, Academia' },
        { id: 'management', label: 'Management', icon: Users, description: 'Leadership, Operations, Strategy' }
      ]
    },
    {
      title: "What's your experience level?",
      key: 'experience_level',
      options: [
        { id: 'entry', label: 'Entry Level', description: '0-2 years experience' },
        { id: 'mid', label: 'Mid Level', description: '3-7 years experience' },
        { id: 'senior', label: 'Senior Level', description: '8-15 years experience' },
        { id: 'executive', label: 'Executive', description: '15+ years, leadership roles' }
      ]
    },
    {
      title: "Which industry best describes your target?",
      key: 'target_industry',
      options: [
        { id: 'startup', label: 'Startup', description: 'Fast-paced, innovative environment' },
        { id: 'corporate', label: 'Corporate', description: 'Large, established companies' },
        { id: 'nonprofit', label: 'Non-Profit', description: 'Mission-driven organizations' },
        { id: 'government', label: 'Government', description: 'Public sector roles' },
        { id: 'freelance', label: 'Freelance', description: 'Contract and consulting work' }
      ]
    },
    {
      title: "What tone should your resume have?",
      key: 'preferred_tone',
      options: [
        { id: 'professional', label: 'Professional', description: 'Formal, conservative approach' },
        { id: 'modern', label: 'Modern', description: 'Contemporary, innovative style' },
        { id: 'creative', label: 'Creative', description: 'Unique, expressive design' },
        { id: 'minimal', label: 'Minimal', description: 'Clean, simple aesthetic' }
      ]
    }
  ];

  const currentStepData = steps[currentStep];

  const handleSelection = (optionId: string) => {
    setSelections(prev => ({
      ...prev,
      [currentStepData.key]: optionId
    }));
  };

  const handleComplete = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('career_preferences')
        .upsert({
          user_id: user.id,
          target_role: selections.target_role,
          experience_level: selections.experience_level,
          target_industry: selections.target_industry,
          preferred_tone: selections.preferred_tone,
          onboarding_completed: true
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Welcome aboard!",
        description: "Your preferences have been saved. Let's build your career!"
      });
      
      onComplete();
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isCurrentStepComplete = selections[currentStepData.key as keyof typeof selections];

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Welcome to Your Career Command Center
          </DialogTitle>
          <p className="text-center text-muted-foreground mb-4">
            Let's personalize your experience to help you land your dream job
          </p>
          <div className="flex items-center justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-primary w-8' 
                    : 'bg-muted w-6'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="py-6">
          <h3 className="text-xl font-semibold text-center mb-8">{currentStepData.title}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentStepData.options.map((option) => {
              const Icon = option.icon;
              const isSelected = selections[currentStepData.key as keyof typeof selections] === option.id;
              
              return (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
                    isSelected 
                      ? 'ring-2 ring-primary bg-primary/10' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleSelection(option.id)}
                >
                  <CardContent className="p-6 text-center">
                    {Icon && (
                      <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    )}
                    <h4 className="font-semibold mb-2">{option.label}</h4>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                    {isSelected && (
                      <Badge className="mt-3">Selected</Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || saving}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          <Button
            onClick={handleNext}
            disabled={!isCurrentStepComplete || saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingFlow;
