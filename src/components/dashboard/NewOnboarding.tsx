import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, Sparkles, Target, Rocket, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface NewOnboardingProps {
  onComplete: (mode: 'hunter' | 'growth') => void;
}

type OnboardingStep = 'upload' | 'scanning' | 'mission';

const NewOnboarding: React.FC<NewOnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanText, setScanText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or DOCX file.",
        variant: "destructive"
      });
      return;
    }

    setStep('scanning');
    
    // Simulate scanning animation
    const scanMessages = [
      'Extracting Skills...',
      'Identifying Experience...',
      'Analyzing Market Value...',
      'Building Your Profile...'
    ];

    for (let i = 0; i < scanMessages.length; i++) {
      setScanText(scanMessages[i]);
      setScanProgress((i + 1) * 25);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Create resume entry
      const { error: resumeError } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title: file.name.replace(/\.[^/.]+$/, ''),
          content: {
            personalInfo: { fullName: '', email: '', phone: '', location: '' },
            summary: '',
            experience: [],
            education: [],
            skills: [],
            uploadedFileName: file.name,
            uploadedAt: new Date().toISOString()
          }
        });

      if (resumeError) throw resumeError;

      // Create career preferences entry
      await supabase
        .from('career_preferences')
        .upsert({
          user_id: user.id,
          onboarding_completed: false
        }, { onConflict: 'user_id' });

      setStep('mission');
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: "Failed to process your resume. Please try again.",
        variant: "destructive"
      });
      setStep('upload');
    }
  };

  const selectMode = async (mode: 'hunter' | 'growth') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await supabase
        .from('career_preferences')
        .upsert({
          user_id: user.id,
          onboarding_completed: true,
          work_style: mode
        }, { onConflict: 'user_id' });

      onComplete(mode);
    } catch (error) {
      console.error('Error saving mode:', error);
      onComplete(mode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      
      <AnimatePresence mode="wait">
        {step === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 w-full max-w-2xl px-6"
          >
            <div className="text-center mb-12">
              <span className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-6 block">
                PitchVaya
              </span>
              <h1 className="text-3xl font-bold mb-2">Welcome to PitchVaya</h1>
              <p className="text-muted-foreground text-lg">
                I'm ready to build your profile. Let's get started.
              </p>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative cursor-pointer rounded-2xl border-2 border-dashed p-16
                transition-all duration-300 text-center
                ${isDragging 
                  ? 'border-primary bg-primary/10 scale-105' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }
              `}
            >
              <div className={`
                w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center
                transition-all duration-300
                ${isDragging ? 'bg-primary animate-pulse' : 'bg-primary/10'}
              `}>
                <Upload className={`w-10 h-10 ${isDragging ? 'text-primary-foreground' : 'text-primary'}`} />
              </div>
              
              <h2 className="text-xl font-semibold mb-2">
                Drag and drop your Resume
              </h2>
              <p className="text-muted-foreground mb-4">
                PDF or DOCX files accepted
              </p>
              <Button variant="outline" className="pointer-events-none">
                Or click to browse
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </motion.div>
        )}

        {step === 'scanning' && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative z-10 w-full max-w-md px-6 text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full border-4 border-muted" />
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="4"
                  strokeDasharray={`${scanProgress * 3.77} 377`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary animate-pulse" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4">{scanText}</h2>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/60"
                initial={{ width: 0 }}
                animate={{ width: `${scanProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}

        {step === 'mission' && (
          <motion.div
            key="mission"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 w-full max-w-4xl px-6"
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Profile Created</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">
                Vaya has analyzed your profile
              </h1>
              <p className="text-muted-foreground text-lg">
                What is our primary mission right now?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hunter Mode */}
              <motion.button
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectMode('hunter')}
                className="group relative overflow-hidden rounded-2xl p-8 text-left transition-all duration-300 bg-gradient-to-br from-[hsl(217,100%,50%)] to-[hsl(230,80%,45%)] text-white shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                    <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Hunter Mode</h3>
                  <p className="text-white/80">
                    I need a new job ASAP. Scout roles and optimize my applications.
                  </p>
                </div>
              </motion.button>

              {/* Growth Mode */}
              <motion.button
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => selectMode('growth')}
                className="group relative overflow-hidden rounded-2xl p-8 text-left transition-all duration-300 bg-gradient-to-br from-[hsl(262,83%,58%)] to-[hsl(280,70%,45%)] text-white shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                    <Rocket className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Growth Mode</h3>
                  <p className="text-white/80">
                    I am employed. I want to track my wins and plan a promotion.
                  </p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewOnboarding;
