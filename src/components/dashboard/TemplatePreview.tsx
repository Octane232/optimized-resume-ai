import React, { useEffect, useRef, useCallback, memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Download, X } from 'lucide-react';

interface TemplatePreviewProps {
  template: {
    id?: string;
    name?: string;
    html_content?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = memo(({ 
  template, 
  isOpen, 
  onClose, 
  onUseTemplate 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const writeToIframe = useCallback(() => {
    if (!iframeRef.current || !template?.html_content) return;
    
    try {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (!iframeDoc) return;
      
      // Sample data to replace placeholders - CORRECTED VERSION
const sampleData = {
  // Contact Info (matches template)
  fullName: "John Smith",
  title: "Senior Software Engineer",
  email: "john.smith@example.com",
  phone: "(555) 123-4567",
  location: "San Francisco, CA",
  // summary (matches template)
  summary: "Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, Node.js, and cloud architecture. Passionate about building scalable solutions and mentoring teams.",

  // experiences (matches template loop {{#experiences}})
  experiences: [
    {
      position: "Senior Software Engineer", // Changed from 'title'
      company: "Tech Solutions Inc.", 
      startDate: "2020", // Changed from 'dates'
      endDate: "Present", // Changed from 'dates'
      achievements: [ // Changed from 'description' and made an array
        "Led development of microservices architecture serving 1M+ users",
        "Mentored a team of 5 junior developers",
        "Reduced API response time by 40% through optimization"
      ]
    }
  ],

  // education (matches template loop {{#education}})
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "Stanford University", // Changed from 'school'
      startYear: "2012", // Added for formatting
      endYear: "2016"    // Added for formatting
    }
  ],

  // skills (matches template loop {{#skills}})
  skills: ["React", "TypeScript", "Node.js", "AWS", "Docker", "PostgreSQL"]
};

      let finalHTML = template.html_content;

      // --- 1. FIRST: Handle Loops (BEFORE simple replacements) ---
// Handle experiences loop {{#experiences}}...{{/experiences}}
finalHTML = finalHTML.replace(
  /{{#experiences}}([\s\S]*?){{\/experiences}}/g,
  (match, loopTemplate) => {
    if (!sampleData.experiences) return '';
    return sampleData.experiences.map(exp => {
      let expHtml = loopTemplate;
      // Replace all simple placeholders inside the loop (position, company, etc.)
      expHtml = expHtml.replace(/{{(\w+)}}/g, (m, key) => exp[key] || '');
      // Handle the achievements list {{#achievements}}...{{/achievements}}
      expHtml = expHtml.replace(
        /{{#achievements}}([\s\S]*?){{\/achievements}}/g,
        (achievementMatch, achievementListTemplate) => {
          if (!exp.achievements) return '';
          const listItems = exp.achievements.map(ach =>
            achievementListTemplate.replace('{{.}}', ach)
          ).join('');
          return listItems;
        }
      );
      return expHtml;
    }).join('');
  }
);

// Handle education loop {{#education}}...{{/education}}
finalHTML = finalHTML.replace(
  /{{#education}}([\s\S]*?){{\/education}}/g,
  (match, loopTemplate) => {
    if (!sampleData.education) return '';
    return sampleData.education.map(edu => {
      let eduHtml = loopTemplate;
      // Format the graduation date from startYear and endYear
      const graduationDate = edu.startYear && edu.endYear 
        ? `${edu.startYear} - ${edu.endYear}`
        : edu.startYear || edu.endYear || '';
      // Replace placeholders, including the formatted date
      eduHtml = eduHtml.replace(/{{(\w+)}}/g, (m, key) => {
        if (key === 'graduationDate') return graduationDate;
        return edu[key] || '';
      });
      return eduHtml;
    }).join('');
  }
);

// Handle skills loop {{#skills}}...{{/skills}}
finalHTML = finalHTML.replace(
  /{{#skills}}([\s\S]*?){{\/skills}}/g,
  (match, loopTemplate) => {
    if (!sampleData.skills) return '';
    // For the simple comma-separated list
    return loopTemplate.replace('{{.}}', sampleData.skills.join(', '));
  }
);

// --- 2. SECOND: Replace simple top-level variables ---
// Replace {{fullName}}, {{title}}, {{email}}, etc.
Object.entries(sampleData).forEach(([key, value]) => {
  // Skip arrays and objects, we handled loops above
  if (typeof value === "string") {
    finalHTML = finalHTML.replace(
      new RegExp(`{{\\s*${key}\\s*}}`, "g"),
      value
    );
  }
});

// --- 3. Clean up any remaining unfilled placeholders ---
finalHTML = finalHTML.replace(/{{\s*[\w.]+\s*}}/g, "");

      // Ensure proper HTML structure if it's a fragment
      if (!finalHTML.includes("<html")) {
        finalHTML = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                color: #1a1a1a;
                padding: 20px;
                margin: 0;
                background: white;
              }
            </style>
          </head>
          <body>
            ${finalHTML}
          </body>
          </html>
        `;
      }
      
      iframeDoc.open();
      iframeDoc.write(finalHTML);
      iframeDoc.close();
    } catch (error) {
      console.error('Error writing to iframe:', error);
    }
  }, [template?.html_content]);

  useEffect(() => {
    if (isOpen && template?.html_content) {
      // Use requestAnimationFrame to ensure smooth rendering
      requestAnimationFrame(() => {
        writeToIframe();
      });
    }
  }, [isOpen, template, writeToIframe]);

  if (!isOpen || !template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>{template.name || 'Template Preview'}</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onUseTemplate}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Use Template
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-auto max-w-4xl">
            <iframe
              ref={iframeRef}
              className="w-full h-[calc(90vh-100px)] border-0 rounded-lg"
              title="Resume Template Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

TemplatePreview.displayName = 'TemplatePreview';

export default TemplatePreview;
