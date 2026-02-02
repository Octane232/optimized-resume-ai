import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Check, X, AlertTriangle, FileText, Building2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ATSAnalysis {
  overall_score: number;
  formatting_score: number;
  keywords_score: number;
  experience_score: number;
  education_score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: { category: string; suggestion: string; priority: string }[];
  missing_keywords?: string[];
}

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
  rawText?: string;
}

interface ATSSimulationViewProps {
  resumeContent: ResumeContent | null;
  uploadedText?: string | null;
  analysisSource?: 'saved' | 'uploaded' | null;
  atsAnalysis?: ATSAnalysis | null;
}

interface ParsedField {
  found: boolean;
  value: string;
}

const ATSSimulationView = ({ 
  resumeContent,
  uploadedText,
  analysisSource,
  atsAnalysis
}: ATSSimulationViewProps) => {
  const [showATSView, setShowATSView] = useState(false);

  // If no content at all, show empty state
  const hasContent = resumeContent || uploadedText;
  
  if (!hasContent) {
    return null;
  }

  // Check if we're showing uploaded text
  const isUploadedContent = analysisSource === 'uploaded' && uploadedText;

  // For uploaded text, try to extract basic info
  const extractFromUploadedText = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim());
    
    // Try to find email
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    // Try to find phone
    const phoneMatch = text.match(/[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}/);
    // First line is usually name
    const possibleName = lines[0]?.trim() || '';
    
    return {
      name: possibleName.length < 50 ? possibleName : '',
      email: emailMatch?.[0] || '',
      phone: phoneMatch?.[0] || '',
      linkedin: text.includes('linkedin') ? 'Found' : '',
      location: '',
    };
  };

  // Normalize contact info based on source
  let normalizedContact: Record<string, string>;
  let normalizedExperience: Array<{ title: string; company: string; startDate: string; endDate: string; bullets: string[] }>;
  let skillsArray: string[];
  let educationArray: Array<{ degree?: string; institution?: string; startYear?: string; endYear?: string }>;
  
  if (isUploadedContent && uploadedText) {
    const extracted = extractFromUploadedText(uploadedText);
    normalizedContact = extracted;
    normalizedExperience = [];
    skillsArray = atsAnalysis?.missing_keywords ? [] : [];
    educationArray = [];
  } else if (resumeContent) {
    // Classic templates use 'contact', modern uses 'personalInfo'
    // Prioritize 'contact' since that's what classic templates use
    const contact = (resumeContent.contact || resumeContent.personalInfo || {}) as Record<string, string | undefined>;
    normalizedContact = {
      name: contact.name || contact.fullName || '',
      email: contact.email || '',
      phone: contact.phone || '',
      linkedin: contact.linkedin || contact.website || '',
      location: contact.location || '',
    };
    // Classic templates use 'responsibilities', others use 'bullets'
    normalizedExperience = (resumeContent.experience || []).map(exp => ({
      title: exp.title || '',
      company: exp.company || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      bullets: exp.responsibilities || exp.bullets || [],
    }));
    skillsArray = resumeContent.skills || [];
    educationArray = resumeContent.education || [];
  } else {
    normalizedContact = { name: '', email: '', phone: '', linkedin: '', location: '' };
    normalizedExperience = [];
    skillsArray = [];
    educationArray = [];
  }

  // Use ATS analysis results if available
  const hasAnalysis = atsAnalysis && atsAnalysis.overall_score > 0;

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
    sections: isUploadedContent && hasAnalysis ? {
      // For uploaded content, use analysis scores to determine if sections exist
      summary: (atsAnalysis?.formatting_score || 0) > 30,
      skills: (atsAnalysis?.keywords_score || 0) > 30,
      experience: (atsAnalysis?.experience_score || 0) > 30,
      education: (atsAnalysis?.education_score || 0) > 30,
      projects: false,
      certifications: false,
    } : {
      summary: !!resumeContent?.summary && resumeContent.summary.length > 10,
      skills: skillsArray.length > 0,
      experience: normalizedExperience.length > 0 && normalizedExperience.some(e => e.title || e.company),
      education: educationArray.length > 0 && educationArray.some(e => e.degree || e.institution),
      projects: (resumeContent?.projects?.length || 0) > 0,
      certifications: (resumeContent?.certifications?.length || 0) > 0,
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
          {isUploadedContent && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              Uploaded
            </span>
          )}
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
                  hasAnalysis && atsAnalysis.overall_score >= 70 ? 'bg-emerald-500' : 
                  hasAnalysis && atsAnalysis.overall_score >= 50 ? 'bg-amber-500' : 
                  foundCount >= totalCount - 1 ? 'bg-emerald-500' : 
                  foundCount >= totalCount / 2 ? 'bg-amber-500' : 'bg-red-500'
                } animate-pulse`} />
                <span className="text-sm text-foreground font-medium">
                  {hasAnalysis 
                    ? `Overall Score: ${atsAnalysis.overall_score}/100`
                    : `${foundCount}/${totalCount} contact fields parsed`
                  }
                </span>
              </div>
            </div>

            {/* Missing Keywords from Analysis */}
            {hasAnalysis && atsAnalysis.missing_keywords && atsAnalysis.missing_keywords.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  Keywords Companies Look For (Missing)
                </p>
                <div className="flex flex-wrap gap-1 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  {atsAnalysis.missing_keywords.slice(0, 10).map((keyword, i) => (
                    <span 
                      key={i}
                      className="px-2 py-0.5 bg-red-500/20 text-red-600 dark:text-red-400 rounded text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info Extraction */}
            {!isUploadedContent && (
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
            )}

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
            {warnings.length > 0 && !isUploadedContent && (
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
            {isATSReady && !isUploadedContent && (
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

            {/* Uploaded content summary */}
            {isUploadedContent && hasAnalysis && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div className="text-xs text-foreground">
                    <span className="font-medium text-primary">Uploaded Resume Analyzed</span>
                    <p className="mt-1 text-muted-foreground">
                      Score: {atsAnalysis.overall_score}/100. 
                      {atsAnalysis.weaknesses?.length > 0 && ` Found ${atsAnalysis.weaknesses.length} areas to improve.`}
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
