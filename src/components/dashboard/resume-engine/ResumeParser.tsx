import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileSearch, Check, X, AlertTriangle, User, Briefcase, GraduationCap, Wrench, FileText, Award, Loader2, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Parsed resume structure following standard taxonomy
export interface ParsedContact {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ParsedExperience {
  title: string;
  normalizedTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  duration: number;
  isCurrent: boolean;
  bullets: string[];
  keywords: string[];
}

export interface ParsedEducation {
  degree: string;
  field: string;
  institution: string;
  startYear: string;
  endYear: string;
  gpa?: string;
}

export interface ParsedSkill {
  name: string;
  normalizedName: string;
  category: 'technical' | 'soft' | 'tool' | 'language';
  confidence: number;
  isExplicit: boolean;
}

export interface ParsedResume {
  contact: ParsedContact;
  summary: string;
  skills: ParsedSkill[];
  experience: ParsedExperience[];
  education: ParsedEducation[];
  certifications: string[];
  projects: { title: string; description: string; technologies: string[] }[];
  totalYearsExperience: number;
  seniorityLevel: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  detectedSections: string[];
  parsingConfidence: number;
}

interface ResumeParserProps {
  rawText: string;
  onParsingComplete?: (parsed: ParsedResume) => void;
}

const ResumeParser: React.FC<ResumeParserProps> = ({ rawText, onParsingComplete }) => {
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parseWithAI = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fnError } = await supabase.functions.invoke('parse-resume-ai', {
          body: { resumeText: rawText },
        });

        if (fnError) {
          throw new Error(fnError.message || 'Failed to parse resume');
        }

        if (data.error) {
          throw new Error(data.error);
        }

        // Ensure all required fields have defaults
        const result: ParsedResume = {
          contact: {
            name: data.contact?.name || '',
            email: data.contact?.email || '',
            phone: data.contact?.phone || '',
            location: data.contact?.location || '',
            linkedin: data.contact?.linkedin || '',
            github: data.contact?.github || '',
            portfolio: data.contact?.portfolio || '',
          },
          summary: data.summary || '',
          skills: (data.skills || []).map((s: any) => ({
            name: s.name || '',
            normalizedName: s.normalizedName || s.name || '',
            category: s.category || 'technical',
            confidence: s.confidence || 50,
            isExplicit: s.isExplicit ?? true,
          })),
          experience: (data.experience || []).map((e: any) => ({
            title: e.title || '',
            normalizedTitle: e.normalizedTitle || e.title || '',
            company: e.company || '',
            startDate: e.startDate || '',
            endDate: e.endDate || '',
            duration: e.duration || 0,
            isCurrent: e.isCurrent ?? false,
            bullets: e.bullets || [],
            keywords: e.keywords || [],
          })),
          education: (data.education || []).map((ed: any) => ({
            degree: ed.degree || '',
            field: ed.field || '',
            institution: ed.institution || '',
            startYear: ed.startYear || '',
            endYear: ed.endYear || '',
            gpa: ed.gpa,
          })),
          certifications: data.certifications || [],
          projects: (data.projects || []).map((p: any) => ({
            title: p.title || '',
            description: p.description || '',
            technologies: p.technologies || [],
          })),
          totalYearsExperience: data.totalYearsExperience || 0,
          seniorityLevel: data.seniorityLevel || 'entry',
          detectedSections: data.detectedSections || [],
          parsingConfidence: data.parsingConfidence || 0,
        };

        setParsed(result);
        onParsingComplete?.(result);

        toast({
          title: "Resume parsed successfully",
          description: `Detected ${result.skills.length} skills and ${result.experience.length} work experiences`,
        });

      } catch (err: any) {
        console.error('Resume parsing error:', err);
        setError(err.message || 'Failed to parse resume');
        toast({
          title: "Parsing failed",
          description: err.message || 'Could not parse resume. Please try again.',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (rawText?.trim()) {
      parseWithAI();
    }
  }, [rawText, onParsingComplete]);

  const SectionStatus = ({ 
    found, 
    label, 
    critical = false,
    icon: Icon 
  }: { 
    found: boolean; 
    label: string; 
    critical?: boolean;
    icon: React.ElementType;
  }) => (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${
      found ? 'bg-emerald-500/10' : critical ? 'bg-red-500/10' : 'bg-amber-500/10'
    }`}>
      {found ? (
        <Check className="w-4 h-4 text-emerald-500" />
      ) : critical ? (
        <X className="w-4 h-4 text-red-500" />
      ) : (
        <AlertTriangle className="w-4 h-4 text-amber-500" />
      )}
      <Icon className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-foreground">{label}</span>
    </div>
  );

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="command-card p-8"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <Sparkles className="w-5 h-5 text-primary absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-foreground">AI Parsing in Progress</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Analyzing your resume with advanced AI...
            </p>
          </div>
          <div className="w-full max-w-xs">
            <Progress value={45} className="h-2 animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="command-card p-6"
      >
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <X className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Parsing Failed</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!parsed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="command-card p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <FileSearch className="w-5 h-5 text-primary" />
            <Sparkles className="w-3 h-3 text-primary absolute -top-1 -right-1" />
          </div>
          <h3 className="font-semibold text-foreground">AI Parsing Results</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Confidence</span>
          <div className="flex items-center gap-2">
            <Progress value={parsed.parsingConfidence} className="w-20 h-2" />
            <span className="text-sm font-medium text-foreground">{parsed.parsingConfidence}%</span>
          </div>
        </div>
      </div>

      {/* Sections Detected */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Detected Sections
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <SectionStatus found={parsed.detectedSections.includes('summary')} label="Summary" critical icon={FileText} />
          <SectionStatus found={parsed.detectedSections.includes('experience')} label="Experience" critical icon={Briefcase} />
          <SectionStatus found={parsed.detectedSections.includes('education')} label="Education" critical icon={GraduationCap} />
          <SectionStatus found={parsed.detectedSections.includes('skills')} label="Skills" critical icon={Wrench} />
          <SectionStatus found={parsed.detectedSections.includes('projects')} label="Projects" icon={FileText} />
          <SectionStatus found={parsed.detectedSections.includes('certifications')} label="Certifications" icon={Award} />
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Contact Information
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(parsed.contact).map(([key, value]) => (
            <div 
              key={key}
              className={`flex items-center gap-2 p-2 rounded ${
                value ? 'bg-muted/50' : 'bg-red-500/10'
              }`}
            >
              {value ? (
                <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              ) : (
                <X className="w-3 h-3 text-red-400 flex-shrink-0" />
              )}
              <span className="text-muted-foreground capitalize">{key}:</span>
              <span className="truncate text-foreground">{value || 'Not found'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Summary */}
      {parsed.skills.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Top Skills ({parsed.skills.length} detected)
          </p>
          <div className="flex flex-wrap gap-2">
            {parsed.skills.slice(0, 15).map((skill, i) => (
              <span 
                key={i}
                className={`px-2 py-1 text-xs rounded-full ${
                  skill.category === 'technical' 
                    ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                    : skill.category === 'soft'
                    ? 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {skill.normalizedName}
                {skill.confidence >= 80 && <span className="ml-1 opacity-60">✓</span>}
              </span>
            ))}
            {parsed.skills.length > 15 && (
              <span className="px-2 py-1 text-xs bg-muted rounded-full text-muted-foreground">
                +{parsed.skills.length - 15} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Experience Summary */}
      {parsed.experience.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Work Experience ({parsed.totalYearsExperience.toFixed(1)} years)
          </p>
          <div className="space-y-2">
            {parsed.experience.slice(0, 3).map((exp, i) => (
              <div key={i} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-sm text-foreground">{exp.normalizedTitle}</p>
                    <p className="text-xs text-muted-foreground">{exp.company}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                {exp.bullets.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    • {exp.bullets[0]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seniority Level */}
      <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">Detected Seniority Level</span>
        </div>
        <span className="text-sm font-semibold text-primary capitalize">
          {parsed.seniorityLevel}
        </span>
      </div>
    </motion.div>
  );
};

export default ResumeParser;
