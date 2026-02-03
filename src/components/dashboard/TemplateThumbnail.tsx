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
      <CardContent className="p-3">
        {/* Template Preview - A4 aspect ratio (1:1.414) */}
        <div className="mb-3 border rounded-lg overflow-hidden bg-white aspect-[1/1.4]">
          <div className="relative w-full h-full overflow-hidden bg-white">
            {template.json_content ? (
              <div 
                className="absolute inset-0 origin-top-left"
                style={{ 
                  transform: 'scale(0.40)',
                  width: '250%',
                  height: '250%'
                }}
              >
                <CanvaStyleRenderer
                  template={template.json_content}
                  data={sampleData}
                  scale={1}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <FileText className="w-10 h-10 text-primary/30 mb-2" />
                <p className="text-xs text-muted-foreground">Preview</p>
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
