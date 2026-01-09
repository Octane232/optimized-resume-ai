import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Check, X, AlertTriangle, FileText, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface ResumeContent {
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    website?: string;
    location?: string;
  };
  summary?: string;
  skills?: string[];
  experience?: Array<{
    title?: string;
    company?: string;
    bullets?: string[];
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
  }>;
}

interface ATSSimulationViewProps {
  resumeContent: ResumeContent | null;
  isPremium: boolean;
  onUpgrade: () => void;
}

const ATSSimulationView = ({ 
  resumeContent, 
  isPremium,
  onUpgrade 
}: ATSSimulationViewProps) => {
  const [showATSView, setShowATSView] = useState(false);

  if (!resumeContent) {
    return null;
  }

  const parseResults = {
    contact: {
      name: { found: !!resumeContent.personalInfo?.fullName, value: resumeContent.personalInfo?.fullName },
      email: { found: !!resumeContent.personalInfo?.email, value: resumeContent.personalInfo?.email },
      phone: { found: !!resumeContent.personalInfo?.phone, value: resumeContent.personalInfo?.phone },
      linkedin: { found: !!resumeContent.personalInfo?.website, value: resumeContent.personalInfo?.website },
      location: { found: !!resumeContent.personalInfo?.location, value: resumeContent.personalInfo?.location },
    },
    sections: {
      summary: !!resumeContent.summary,
      skills: (resumeContent.skills?.length || 0) > 0,
      experience: (resumeContent.experience?.length || 0) > 0,
      education: (resumeContent.education?.length || 0) > 0,
    }
  };

  const contactItems = Object.entries(parseResults.contact);
  const foundCount = contactItems.filter(([_, v]) => v.found).length;
  const totalCount = contactItems.length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="command-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">ATS Parser View</h3>
          {!isPremium && (
            <span className="px-2 py-0.5 text-xs font-medium bg-amber-500/20 text-amber-500 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Pro
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Show ATS View</span>
          <Switch 
            checked={showATSView} 
            onCheckedChange={setShowATSView}
            disabled={!isPremium}
          />
        </div>
      </div>

      {isPremium ? (
        <AnimatePresence mode="wait">
          {showATSView ? (
            <motion.div
              key="ats-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* Parser Status */}
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                  ATS Parser Status
                </p>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    foundCount >= totalCount - 1 ? 'bg-emerald-500' : 
                    foundCount >= totalCount / 2 ? 'bg-amber-500' : 'bg-red-500'
                  } animate-pulse`} />
                  <span className="text-sm text-foreground font-medium">
                    {foundCount}/{totalCount} contact fields parsed successfully
                  </span>
                </div>
              </div>

              {/* Contact Info Extraction */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                  Contact Information
                </p>
                <div className="space-y-1">
                  {contactItems.map(([key, value]) => (
                    <div 
                      key={key}
                      className={`flex items-center gap-2 p-2 rounded text-sm ${
                        value.found 
                          ? 'bg-emerald-500/10 text-foreground' 
                          : 'bg-destructive/10 text-muted-foreground'
                      }`}
                    >
                      {value.found ? (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-destructive shrink-0" />
                      )}
                      <span className="capitalize text-xs text-muted-foreground w-16">
                        {key}:
                      </span>
                      <span className="font-mono text-xs truncate">
                        {value.value || 'Not found'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sections Detection */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                  Detected Sections
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(parseResults.sections).map(([section, found]) => (
                    <div 
                      key={section}
                      className={`flex items-center gap-2 p-2 rounded ${
                        found ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                      }`}
                    >
                      {found ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      <span className="text-xs capitalize text-foreground">{section}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Extraction */}
              {resumeContent.skills && resumeContent.skills.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                    Extracted Skills ({resumeContent.skills.length})
                  </p>
                  <div className="flex flex-wrap gap-1 p-3 rounded-lg bg-muted/30 border border-border font-mono text-xs">
                    {resumeContent.skills.map((skill, i) => (
                      <span 
                        key={i}
                        className="px-2 py-0.5 bg-primary/10 text-primary rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {(!parseResults.contact.email.found || !parseResults.contact.phone.found) && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium text-amber-500">Missing critical info:</span>
                      <p className="mt-1">
                        ATS systems prioritize resumes with complete contact information. 
                        Add your {!parseResults.contact.email.found ? 'email' : ''} 
                        {!parseResults.contact.email.found && !parseResults.contact.phone.found ? ' and ' : ''}
                        {!parseResults.contact.phone.found ? 'phone number' : ''} to improve parsing.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="normal-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center py-8"
            >
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">
                Toggle "Show ATS View" to see how an ATS parser reads your resume
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        /* Locked State */
        <div className="relative">
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-lg">
            <div className="text-center p-4">
              <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground mb-1">
                ATS Parser Preview
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                See exactly what ATS bots extract from your resume
              </p>
              <Button size="sm" onClick={onUpgrade} className="gap-2">
                <Sparkles className="w-4 h-4" />
                Unlock with Pro
              </Button>
            </div>
          </div>
          <div className="blur-sm opacity-50 pointer-events-none space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                <div className="w-4 h-4 rounded bg-muted" />
                <div className="h-3 bg-muted rounded flex-1" />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ATSSimulationView;
