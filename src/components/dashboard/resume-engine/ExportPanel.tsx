import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, FileSpreadsheet, Copy, Check, Loader2, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import type { ParsedResume } from './ResumeParser';

interface ExportPanelProps {
  parsedResume: ParsedResume | null;
  rawText: string;
  matchScore?: number;
  missingKeywords?: string[];
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  parsedResume,
  rawText,
  matchScore,
  missingKeywords = [],
}) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExportText = async () => {
    setIsExporting('text');
    try {
      // Create a clean text version
      const textContent = generateCleanText(parsedResume, rawText);
      
      const blob = new Blob([textContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume-ats-optimized.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Resume Exported",
        description: "ATS-friendly text file downloaded successfully",
      });
    } catch (e: any) {
      toast({
        title: "Export failed",
        description: e.message || "Could not export the resume",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleExportReport = async () => {
    setIsExporting('report');
    try {
      const reportContent = generateGapReport(parsedResume, matchScore, missingKeywords);
      
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume-gap-analysis.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Report Exported",
        description: "Gap analysis report downloaded successfully",
      });
    } catch (e: any) {
      toast({
        title: "Export failed",
        description: e.message || "Could not generate the report",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const textContent = generateCleanText(parsedResume, rawText);
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to Clipboard",
        description: "Resume text copied successfully",
      });
    } catch (e) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const generateCleanText = (parsed: ParsedResume | null, raw: string): string => {
    if (!parsed) return raw;

    const lines: string[] = [];

    // Header
    if (parsed.contact.name) {
      lines.push(parsed.contact.name.toUpperCase());
      lines.push('');
    }

    // Contact info on separate lines (ATS-friendly)
    const contactParts: string[] = [];
    if (parsed.contact.email) contactParts.push(parsed.contact.email);
    if (parsed.contact.phone) contactParts.push(parsed.contact.phone);
    if (parsed.contact.location) contactParts.push(parsed.contact.location);
    if (parsed.contact.linkedin) contactParts.push(parsed.contact.linkedin);
    
    lines.push(contactParts.join('\n'));
    lines.push('');

    // Summary
    if (parsed.summary) {
      lines.push('SUMMARY');
      lines.push('-'.repeat(40));
      lines.push(parsed.summary);
      lines.push('');
    }

    // Skills
    if (parsed.skills.length > 0) {
      lines.push('SKILLS');
      lines.push('-'.repeat(40));
      const skillNames = parsed.skills.map(s => s.normalizedName);
      lines.push(skillNames.join(', '));
      lines.push('');
    }

    // Experience
    if (parsed.experience.length > 0) {
      lines.push('EXPERIENCE');
      lines.push('-'.repeat(40));
      parsed.experience.forEach(exp => {
        if (exp.title || exp.company) {
          lines.push(`${exp.title}${exp.company ? ` | ${exp.company}` : ''}`);
          if (exp.startDate || exp.endDate) {
            lines.push(`${exp.startDate} - ${exp.endDate}`);
          }
          exp.bullets.forEach(bullet => {
            lines.push(`- ${bullet}`);
          });
          lines.push('');
        }
      });
    }

    // Education
    if (parsed.education.length > 0) {
      lines.push('EDUCATION');
      lines.push('-'.repeat(40));
      parsed.education.forEach(edu => {
        lines.push(`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`);
        if (edu.institution) lines.push(edu.institution);
        if (edu.startYear || edu.endYear) {
          lines.push(`${edu.startYear} - ${edu.endYear}`);
        }
        lines.push('');
      });
    }

    // Certifications
    if (parsed.certifications.length > 0) {
      lines.push('CERTIFICATIONS');
      lines.push('-'.repeat(40));
      parsed.certifications.forEach(cert => {
        lines.push(`- ${cert}`);
      });
      lines.push('');
    }

    return lines.join('\n');
  };

  const generateGapReport = (
    parsed: ParsedResume | null,
    score?: number,
    missing: string[] = []
  ): string => {
    const lines: string[] = [];

    lines.push('RESUME GAP ANALYSIS REPORT');
    lines.push('=' .repeat(50));
    lines.push(`Generated: ${new Date().toLocaleDateString()}`);
    lines.push('');

    // Overall Score
    if (score !== undefined) {
      lines.push('MATCH SCORE');
      lines.push('-'.repeat(40));
      lines.push(`Overall Match: ${score}%`);
      lines.push('');
    }

    // Parsing Summary
    if (parsed) {
      lines.push('RESUME ANALYSIS');
      lines.push('-'.repeat(40));
      lines.push(`Total Years Experience: ${parsed.totalYearsExperience}`);
      lines.push(`Seniority Level: ${parsed.seniorityLevel}`);
      lines.push(`Skills Detected: ${parsed.skills.length}`);
      lines.push(`Parsing Confidence: ${parsed.parsingConfidence}%`);
      lines.push('');

      lines.push('DETECTED SECTIONS');
      lines.push('-'.repeat(40));
      parsed.detectedSections.forEach(section => {
        lines.push(`✓ ${section.charAt(0).toUpperCase() + section.slice(1)}`);
      });
      lines.push('');

      lines.push('SKILLS BREAKDOWN');
      lines.push('-'.repeat(40));
      const technicalSkills = parsed.skills.filter(s => s.category === 'technical');
      const softSkills = parsed.skills.filter(s => s.category === 'soft');
      lines.push(`Technical Skills (${technicalSkills.length}):`);
      lines.push(technicalSkills.map(s => s.normalizedName).join(', '));
      lines.push('');
      lines.push(`Soft Skills (${softSkills.length}):`);
      lines.push(softSkills.map(s => s.normalizedName).join(', '));
      lines.push('');
    }

    // Missing Keywords
    if (missing.length > 0) {
      lines.push('MISSING KEYWORDS');
      lines.push('-'.repeat(40));
      lines.push('Add these keywords to improve your match:');
      missing.forEach((kw, i) => {
        lines.push(`${i + 1}. ${kw}`);
      });
      lines.push('');
    }

    // Recommendations
    lines.push('RECOMMENDATIONS');
    lines.push('-'.repeat(40));
    if (parsed) {
      if (parsed.parsingConfidence < 70) {
        lines.push('- Improve formatting for better ATS parsing');
      }
      if (parsed.skills.length < 10) {
        lines.push('- Add more skills to your skills section');
      }
      if (!parsed.detectedSections.includes('summary')) {
        lines.push('- Add a professional summary section');
      }
      if (missing.length > 0) {
        lines.push(`- Incorporate ${Math.min(5, missing.length)} missing keywords`);
      }
    }
    lines.push('- Quantify achievements with numbers and percentages');
    lines.push('- Use action verbs at the start of bullet points');
    lines.push('- Tailor resume for each job application');

    return lines.join('\n');
  };

  const hasContent = !!rawText || !!parsedResume;

  return (
    <Card className="overflow-hidden">
      <div className="p-5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Export & Share</h3>
            <p className="text-xs text-muted-foreground">Download optimized resume and reports</p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Export Options */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleExportText}
            disabled={!hasContent || isExporting === 'text'}
            className="h-auto py-4 flex-col gap-2"
          >
            {isExporting === 'text' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <FileText className="w-5 h-5" />
            )}
            <span className="text-xs">ATS Text File</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleExportReport}
            disabled={!parsedResume || isExporting === 'report'}
            className="h-auto py-4 flex-col gap-2"
          >
            {isExporting === 'report' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-5 h-5" />
            )}
            <span className="text-xs">Gap Report</span>
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleCopyToClipboard}
            disabled={!hasContent}
            className="flex-1 gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Text
              </>
            )}
          </Button>
        </div>

        {/* Info */}
        {!hasContent && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Process a resume first to enable exports
          </p>
        )}

        {parsedResume && (
          <div className="p-3 bg-muted/30 rounded-lg text-center">
            <p className="text-sm text-foreground">
              {parsedResume.skills.length} skills • {parsedResume.totalYearsExperience} years exp
            </p>
            <p className="text-xs text-muted-foreground">
              Ready for export
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExportPanel;
