import React, { memo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import CanvaStyleRenderer from '@/components/templates/CanvaStyleRenderer';
import { ResumeData } from '@/types/resume';

interface TemplatePreviewProps {
  template: {
    id?: string;
    name?: string;
    json_content?: any;
    style_settings?: any;
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
  // Sample data for preview
  const sampleData: ResumeData = {
    contact: {
      name: "John Smith",
      title: "Senior Software Engineer",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johnsmith",
      portfolio: "johnsmith.dev",
      github: "github.com/johnsmith"
    },
    summary: "Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, Node.js, and cloud architecture. Passionate about building scalable solutions and mentoring teams.",
    skills: ["React", "TypeScript", "Node.js", "AWS", "Docker", "PostgreSQL", "GraphQL", "Python"],
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Solutions Inc.",
        startDate: "2020",
        endDate: "Present",
        responsibilities: [
          "Led development of microservices architecture serving 1M+ users",
          "Mentored a team of 5 junior developers",
          "Reduced API response time by 40% through optimization"
        ],
        achievements: [
          "Increased system performance by 60%",
          "Launched 3 major product features"
        ]
      },
      {
        title: "Software Engineer",
        company: "StartupXYZ",
        startDate: "2017",
        endDate: "2020",
        responsibilities: [
          "Built RESTful APIs and microservices",
          "Implemented CI/CD pipelines",
          "Collaborated with cross-functional teams"
        ]
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "Stanford University",
        startYear: "2012",
        endYear: "2016",
        gpa: "3.8",
        honors: "Magna Cum Laude"
      }
    ],
    projects: [
      {
        title: "Open Source Contribution",
        description: "Contributed to major open source project with 10k+ stars",
        technologies: ["React", "TypeScript"],
        link: "github.com/project",
        github: "github.com/project"
      }
    ],
    certifications: [
      {
        name: "AWS Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023"
      }
    ]
  };

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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mx-auto max-w-4xl p-8">
            {template.json_content ? (
              <CanvaStyleRenderer 
                template={template.json_content}
                data={sampleData}
                scale={0.9}
              />
            ) : (
              <div className="text-center py-16 text-gray-500">
                Template preview not available
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

TemplatePreview.displayName = 'TemplatePreview';

export default TemplatePreview;