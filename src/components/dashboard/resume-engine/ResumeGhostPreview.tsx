import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Edit3, Check, X, MapPin, Mail, Phone, Globe, Briefcase, GraduationCap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface ResumeContent {
  personalInfo?: {
    fullName?: string;
    title?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
  };
  summary?: string;
  experience?: Array<{
    title: string;
    company: string;
    dates?: string;
    description?: string;
    bullets?: string[];
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    dates?: string;
  }>;
  skills?: string[];
  certifications?: string[];
}

interface ResumeGhostPreviewProps {
  content: ResumeContent | null;
  matchingKeywords?: string[];
  missingKeywords?: string[];
  onEdit?: (section: string, value: any) => void;
  onDownload?: () => void;
}

const ResumeGhostPreview = ({ 
  content, 
  matchingKeywords = [], 
  missingKeywords = [],
  onEdit,
  onDownload 
}: ResumeGhostPreviewProps) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>(null);

  const highlightKeyword = (text: string) => {
    if (!text) return text;
    
    let result = text;
    matchingKeywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, 'gi');
      result = result.replace(regex, `<span class="bg-emerald-500/20 text-emerald-400 px-0.5 rounded">$1</span>`);
    });
    return result;
  };

  const openEditDialog = (section: string, value: any) => {
    setEditingSection(section);
    setEditValue(value);
  };

  const saveEdit = () => {
    if (editingSection && onEdit) {
      onEdit(editingSection, editValue);
    }
    setEditingSection(null);
    setEditValue(null);
  };

  if (!content) {
    return (
      <div className="command-card p-8 h-full flex flex-col items-center justify-center text-center">
        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Resume Data</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Upload your master resume in The Vault to see a live preview here.
        </p>
      </div>
    );
  }

  return (
    <div className="command-card h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-foreground">Live Preview</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={onDownload}
        >
          <Download className="w-3 h-3 mr-1" />
          Export PDF
        </Button>
      </div>

      {/* Resume Content - Styled like a document */}
      <div className="flex-1 overflow-auto p-6 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-card border border-border rounded-lg shadow-lg overflow-hidden"
        >
          {/* Resume Paper */}
          <div className="p-8 space-y-6">
            {/* Header Section */}
            <div 
              className="text-center pb-6 border-b border-border group cursor-pointer relative"
              onClick={() => openEditDialog('personalInfo', content.personalInfo)}
            >
              <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-primary flex items-center gap-1">
                  <Edit3 className="w-3 h-3" /> Edit
                </span>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {content.personalInfo?.fullName || 'Your Name'}
              </h1>
              <p className="text-primary font-medium mb-3">
                {content.personalInfo?.title || 'Professional Title'}
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground flex-wrap">
                {content.personalInfo?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {content.personalInfo.email}
                  </span>
                )}
                {content.personalInfo?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {content.personalInfo.phone}
                  </span>
                )}
                {content.personalInfo?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {content.personalInfo.location}
                  </span>
                )}
              </div>
            </div>

            {/* Summary */}
            {content.summary && (
              <div 
                className="group cursor-pointer relative"
                onClick={() => openEditDialog('summary', content.summary)}
              >
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-primary flex items-center gap-1">
                    <Edit3 className="w-3 h-3" /> Edit
                  </span>
                </div>
                <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full" />
                  Professional Summary
                </h2>
                <p 
                  className="text-sm text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: highlightKeyword(content.summary) }}
                />
              </div>
            )}

            {/* Experience */}
            {content.experience && content.experience.length > 0 && (
              <div 
                className="group cursor-pointer relative"
                onClick={() => openEditDialog('experience', content.experience)}
              >
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-primary flex items-center gap-1">
                    <Edit3 className="w-3 h-3" /> Edit
                  </span>
                </div>
                <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full" />
                  <Briefcase className="w-3 h-3" />
                  Experience
                </h2>
                <div className="space-y-4">
                  {content.experience.map((exp, i) => (
                    <div key={i} className="pl-3 border-l-2 border-border">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground text-sm">{exp.title}</h3>
                          <p className="text-primary text-xs font-medium">{exp.company}</p>
                        </div>
                        {exp.dates && (
                          <span className="text-xs text-muted-foreground shrink-0">{exp.dates}</span>
                        )}
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {exp.bullets.map((bullet, j) => (
                            <li 
                              key={j} 
                              className="text-xs text-muted-foreground flex items-start gap-2"
                            >
                              <span className="text-primary mt-1">•</span>
                              <span dangerouslySetInnerHTML={{ __html: highlightKeyword(bullet) }} />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {content.skills && content.skills.length > 0 && (
              <div 
                className="group cursor-pointer relative"
                onClick={() => openEditDialog('skills', content.skills)}
              >
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-primary flex items-center gap-1">
                    <Edit3 className="w-3 h-3" /> Edit
                  </span>
                </div>
                <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full" />
                  <Award className="w-3 h-3" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {content.skills.map((skill, i) => {
                    const isMatching = matchingKeywords.some(k => 
                      k.toLowerCase() === skill.toLowerCase()
                    );
                    const isMissing = missingKeywords.some(k => 
                      k.toLowerCase() === skill.toLowerCase()
                    );
                    
                    return (
                      <span 
                        key={i}
                        className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                          isMatching 
                            ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' 
                            : isMissing
                              ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30'
                              : 'bg-secondary text-foreground'
                        }`}
                      >
                        {isMatching && <Check className="w-3 h-3 inline mr-1" />}
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Education */}
            {content.education && content.education.length > 0 && (
              <div 
                className="group cursor-pointer relative"
                onClick={() => openEditDialog('education', content.education)}
              >
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-primary flex items-center gap-1">
                    <Edit3 className="w-3 h-3" /> Edit
                  </span>
                </div>
                <h2 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1 h-4 bg-primary rounded-full" />
                  <GraduationCap className="w-3 h-3" />
                  Education
                </h2>
                <div className="space-y-2">
                  {content.education.map((edu, i) => (
                    <div key={i} className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-foreground text-sm">{edu.degree}</h3>
                        <p className="text-xs text-muted-foreground">{edu.institution}</p>
                      </div>
                      {edu.dates && (
                        <span className="text-xs text-muted-foreground">{edu.dates}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingSection} onOpenChange={() => setEditingSection(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="capitalize">Edit {editingSection}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {editingSection === 'summary' && (
              <Textarea
                value={editValue || ''}
                onChange={(e) => setEditValue(e.target.value)}
                className="min-h-[150px]"
                placeholder="Enter your professional summary..."
              />
            )}
            {editingSection === 'skills' && (
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Skills are comma-separated
                </p>
                <Textarea
                  value={Array.isArray(editValue) ? editValue.join(', ') : ''}
                  onChange={(e) => setEditValue(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="min-h-[100px]"
                  placeholder="JavaScript, React, Python..."
                />
              </div>
            )}
            {editingSection === 'personalInfo' && editValue && (
              <div className="space-y-3">
                <Input
                  placeholder="Full Name"
                  value={editValue.fullName || ''}
                  onChange={(e) => setEditValue({ ...editValue, fullName: e.target.value })}
                />
                <Input
                  placeholder="Professional Title"
                  value={editValue.title || ''}
                  onChange={(e) => setEditValue({ ...editValue, title: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  value={editValue.email || ''}
                  onChange={(e) => setEditValue({ ...editValue, email: e.target.value })}
                />
                <Input
                  placeholder="Phone"
                  value={editValue.phone || ''}
                  onChange={(e) => setEditValue({ ...editValue, phone: e.target.value })}
                />
                <Input
                  placeholder="Location"
                  value={editValue.location || ''}
                  onChange={(e) => setEditValue({ ...editValue, location: e.target.value })}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingSection(null)}>
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={saveEdit}>
              <Check className="w-4 h-4 mr-1" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeGhostPreview;
