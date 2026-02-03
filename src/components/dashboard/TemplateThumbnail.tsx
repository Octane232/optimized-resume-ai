import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Check, Code } from 'lucide-react';
import CanvaStyleRenderer from '../templates/CanvaStyleRenderer';
import { ResumeData } from '@/types/resume';

interface TemplateThumbnailProps {
  template: {
    json_content?: any;
    html_content?: string;
    name?: string;
    description?: string;
  };
  className?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({
  template,
  className = "",
  isSelected = false,
  onClick
}) => {
  // Sample data for thumbnail preview
  const sampleData: ResumeData = {
    contact: {
      name: "Alex Johnson",
      title: "Senior Developer",
      email: "alex@example.com",
      phone: "(123) 456-7890",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/alexjohnson",
      portfolio: "alexjohnson.dev",
      github: "github.com/alexjohnson"
    },
    summary: "Experienced developer with 5+ years in full-stack development and team leadership.",
    skills: ["JavaScript", "React", "Node.js", "Python", "TypeScript", "AWS"],
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Corp",
        startDate: "2020",
        endDate: "Present",
        responsibilities: [
          "Reduced latency by 40%",
          "Mentored 3 junior developers",
          "Implemented CI/CD pipeline"
        ]
      }
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        institution: "Stanford University",
        startYear: "2012",
        endYear: "2016"
      }
    ]
  };

  const isMarkdown = template.json_content?.type === 'markdown';

  return (
    <Card
      className={`relative cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary border-primary' : ''
      } ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Template Preview */}
        <div className="mb-4 border rounded-lg overflow-hidden bg-white">
          <div className="h-48 overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            {template.json_content ? (
              <div className="w-full h-full overflow-hidden" style={{ transform: 'scale(0.3)', transformOrigin: 'top left', width: '333%' }}>
                <CanvaStyleRenderer
                  template={template.json_content}
                  data={sampleData}
                  scale={1}
                />
              </div>
            ) : (
              <div className="text-center">
                <FileText className="w-12 h-12 text-primary/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Template Preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Template Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm truncate">{template.name || 'Template'}</h3>
            {isMarkdown && (
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Code className="w-3 h-3" />
                MD
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {template.description || 'Professional resume template'}
          </p>
          
          {/* Features / Color swatches */}
          <div className="flex items-center gap-2">
            {template.json_content?.theme && (
              <div className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full border border-gray-200" 
                  style={{ backgroundColor: template.json_content.theme.primaryColor }}
                  title="Primary color"
                />
                <div 
                  className="w-3 h-3 rounded-full border border-gray-200" 
                  style={{ backgroundColor: template.json_content.theme.accentColor }}
                  title="Accent color"
                />
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {isMarkdown ? 'ATS-Optimized' : 'Custom Design'}
            </span>
          </div>
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateThumbnail;
