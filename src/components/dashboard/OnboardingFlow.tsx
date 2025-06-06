
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Briefcase, GraduationCap, Code, Palette, Users, Target } from 'lucide-react';

interface OnboardingFlowProps {
  onClose: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState({
    jobType: '',
    experienceLevel: '',
    industry: '',
    tone: ''
  });

  const steps = [
    {
      title: "What type of role are you targeting?",
      key: 'jobType',
      options: [
        { id: 'tech', label: 'Technology', icon: Code, description: 'Software, Engineering, IT' },
        { id: 'creative', label: 'Creative', icon: Palette, description: 'Design, Marketing, Media' },
        { id: 'business', label: 'Business', icon: Briefcase, description: 'Finance, Sales, Consulting' },
        { id: 'education', label: 'Education', icon: GraduationCap, description: 'Teaching, Research, Academia' },
        { id: 'management', label: 'Management', icon: Users, description: 'Leadership, Operations, Strategy' }
      ]
    },
    {
      title: "What's your experience level?",
      key: 'experienceLevel',
      options: [
        { id: 'entry', label: 'Entry Level', description: '0-2 years experience' },
        { id: 'mid', label: 'Mid Level', description: '3-7 years experience' },
        { id: 'senior', label: 'Senior Level', description: '8-15 years experience' },
        { id: 'executive', label: 'Executive', description: '15+ years, leadership roles' }
      ]
    },
    {
      title: "Which industry best describes your target?",
      key: 'industry',
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
      key: 'tone',
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

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      console.log('Onboarding completed with selections:', selections);
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isCurrentStepComplete = selections[currentStepData.key as keyof typeof selections];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Let's Create Your Perfect Resume
          </DialogTitle>
          <div className="flex items-center justify-center space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 w-8' 
                    : 'bg-slate-200 dark:bg-slate-700 w-6'
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
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  onClick={() => handleSelection(option.id)}
                >
                  <CardContent className="p-6 text-center">
                    {Icon && (
                      <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                        isSelected 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    )}
                    <h4 className="font-semibold mb-2">{option.label}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{option.description}</p>
                    {isSelected && (
                      <Badge className="mt-3 bg-blue-500 hover:bg-blue-600">Selected</Badge>
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
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          <Button
            onClick={handleNext}
            disabled={!isCurrentStepComplete}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {currentStep === steps.length - 1 ? 'Create Resume' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingFlow;
