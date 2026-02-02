import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Check, X, AlertTriangle, FileText } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ResumeContent {
  personalInfo?: {
    fullName?: string;
    email?: string;
    phone?: string;
    website?: string;
    location?: string;
    linkedin?: string;
  };
  contact?: {
    name?: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    portfolio?: string;
    github?: string;
  };
  summary?: string;
  skills?: string[];
  experience?: Array<{
    title?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    responsibilities?: string[];
    bullets?: string[];
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
    startYear?: string;
    endYear?: string;
  }>;
  projects?: Array<{
    title?: string;
    description?: string;
    technologies?: string[];
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
  }>;
}

interface ATSSimulationViewProps {
  resumeContent: ResumeContent | null;
}

interface ParsedField {
  found: boolean;
  value: string;
}

const ATSSimulationView = ({ 
  resumeContent
}: ATSSimulationViewProps) => {
  const [showATSView, setShowATSView] = useState(false);

  if (!resumeContent) {
    return null;
  }

  // Normalize contact info from either personalInfo or contact object
  const normalizedContact = {
    name: resumeContent.personalInfo?.fullName || resumeContent.contact?.name || '',
    email: resumeContent.personalInfo?.email || resumeContent.contact?.email || '',
    phone: resumeContent.personalInfo?.phone || resumeContent.contact?.phone || '',
    linkedin: resumeContent.personalInfo?.website || resumeContent.personalInfo?.linkedin || resumeContent.contact?.linkedin || '',
    location: resumeContent.personalInfo?.location || resumeContent.contact?.location || '',
    title: resumeContent.contact?.title || '',
  };

  // Normalize experience data
  const normalizedExperience = (resumeContent.experience || []).map(exp => ({
    title: exp.title || '',
    company: exp.company || '',
    startDate: exp.startDate || '',
    endDate: exp.endDate || '',
    bullets: exp.responsibilities || exp.bullets || [],
  }));

  // Safely check arrays
  const skillsArray = resumeContent.skills || [];
  const educationArray = resumeContent.education || [];
  const projectsArray = resumeContent.projects || [];
  const certificationsArray = resumeContent.certifications || [];

  // Parse results with normalized data
  const parseResults: {
    contact: Record<string, ParsedField>;
    sections: Record<string, boolean>;
  } = {
    contact: {
      name: { found: !!normalizedContact.name, value: normalizedContact.name },
      email: { found: !!normalizedContact.email, value: normalizedContact.email },
      phone: { found: !!normalizedContact.phone, value: normalizedContact.phone },
      linkedin: { found: !!normalizedContact.linkedin, value: normalizedContact.linkedin },
      location: { found: !!normalizedContact.location, value: normalizedContact.location },
    },
    sections: {
      summary: !!resumeContent.summary && resumeContent.summary.length > 10,
      skills: skillsArray.length > 0,
      experience: normalizedExperience.length > 0 && normalizedExperience.some(e => e.title || e.company),
      education: educationArray.length > 0 && educationArray.some(e => e.degree || e.institution),
      projects: projectsArray.length > 0,
      certifications: certificationsArray.length > 0,
    }
  };

  const contactItems = Object.entries(parseResults.contact) as [string, ParsedField][];
  const foundCount = contactItems.filter(([, v]) => v.found).length;
  const totalCount = contactItems.length;

  // Generate warnings
  const warnings: string[] = [];
  if (!parseResults.contact.email?.found) warnings.push('email address');
  if (!parseResults.contact.phone?.found) warnings.push('phone number');
  if (!parseResults.contact.name?.found) warnings.push('full name');
  if (!parseResults.sections.summary) warnings.push('professional summary');
  if (!parseResults.sections.experience) warnings.push('work experience');
  if (!parseResults.sections.education) warnings.push('education');
  if (!parseResults.sections.skills) warnings.push('skills section');

  const isATSReady = warnings.length === 0;

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
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Show ATS View</span>
          <Switch 
            checked={showATSView} 
            onCheckedChange={setShowATSView}
          />
        </div>
      </div>

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
                Detected Sections (ATS Critical)
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(parseResults.sections).map(([section, found]) => {
                  const isCritical = ['summary', 'experience', 'education', 'skills'].includes(section);
                  return (
                    <div 
                      key={section}
                      className={`flex items-center gap-2 p-2 rounded ${
                        found ? 'bg-emerald-500/10' : isCritical ? 'bg-red-500/10' : 'bg-amber-500/10'
                      }`}
                    >
                      {found ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : isCritical ? (
                        <X className="w-4 h-4 text-red-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      <span className="text-xs capitalize text-foreground">
                        {section}
                        {isCritical && !found && <span className="text-red-500 ml-1">*</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                * Critical sections required for ATS parsing
              </p>
            </div>

            {/* Skills Extraction */}
            {skillsArray.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                  Extracted Skills ({skillsArray.length})
                </p>
                <div className="flex flex-wrap gap-1 p-3 rounded-lg bg-muted/30 border border-border font-mono text-xs">
                  {skillsArray.map((skill, i) => (
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

            {/* Experience Details Check */}
            {normalizedExperience.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                  Experience Parsing ({normalizedExperience.length} entries)
                </p>
                <div className="space-y-2">
                  {normalizedExperience.slice(0, 3).map((exp, i) => (
                    <div key={i} className="p-2 rounded-lg bg-muted/30 border border-border text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        {exp.title && exp.company ? (
                          <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-amber-500" />
                        )}
                        <span className="font-medium">{exp.title || 'Missing title'}</span>
                        <span className="text-muted-foreground">at</span>
                        <span>{exp.company || 'Missing company'}</span>
                      </div>
                      <div className="text-muted-foreground ml-5">
                        {exp.bullets && exp.bullets.length > 0 ? (
                          <span className="text-emerald-600">{exp.bullets.length} bullet points found</span>
                        ) : (
                          <span className="text-amber-600">No bullet points - ATS may rank lower</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-start gap-2">
                  <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-red-500">ATS Parsing Issues Found:</span>
                    <p className="mt-1">
                      Missing or incomplete: {warnings.join(', ')}.
                      These are critical fields that ATS systems scan for. Your resume may be filtered out.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Success message when all critical sections pass */}
            {isATSReady && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div className="text-xs text-foreground">
                    <span className="font-medium text-emerald-600">ATS Ready!</span>
                    <p className="mt-1 text-muted-foreground">
                      All critical sections detected. This resume structure is optimized for ATS parsing.
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
    </motion.div>
  );
};

export default ATSSimulationView;
