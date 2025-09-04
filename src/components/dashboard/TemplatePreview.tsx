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
      
      // Sample data to replace placeholders
      const sampleData = {
        fullName: "John Smith",
        title: "Senior Software Engineer",
        email: "john.smith@example.com",
        phone: "(555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/johnsmith",
        github: "github.com/johnsmith",
        portfolio: "johnsmith.dev",
        summary: "Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, Node.js, and cloud architecture. Passionate about building scalable solutions and mentoring teams.",
        skills: ["React", "TypeScript", "Node.js", "AWS", "Docker", "PostgreSQL"],
        experience: [{
          title: "Senior Software Engineer",
          company: "Tech Solutions Inc.",
          dates: "2020 - Present",
          description: "Led development of microservices architecture serving 1M+ users"
        }],
        education: [{
          degree: "Bachelor of Science in Computer Science",
          school: "Stanford University",
          dates: "2012 - 2016"
        }]
      };

      let finalHTML = template.html_content;

      // Replace placeholders like {{fullName}}
      Object.entries(sampleData).forEach(([key, value]) => {
        if (typeof value === "string") {
          finalHTML = finalHTML.replace(
            new RegExp(`{{\\s*${key}\\s*}}`, "g"),
            value
          );
        } else if (Array.isArray(value) && typeof value[0] === "string") {
          // Handle skills array
          finalHTML = finalHTML.replace(
            new RegExp(`{{\\s*${key}\\s*}}`, "g"),
            value.join(", ")
          );
        }
      });

      // Clean up any remaining unfilled placeholders
      finalHTML = finalHTML.replace(/{{[^}]+}}/g, "");

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