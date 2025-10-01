import React from "react";
import CanvaStyleRenderer from '@/components/templates/CanvaStyleRenderer';
import { ResumeData } from '@/types/resume';

interface TemplateThumbnailProps {
  template: {
    json_content?: any;
    html_content?: string;
    name?: string;
  };
  className?: string;
}

const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({
  template,
  className = "",
}) => {
  // Mini sample data for thumbnail
  const miniData: ResumeData = {
    contact: {
      name: "John Smith",
      title: "Software Engineer",
      email: "john@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/john",
      portfolio: "johnsmith.dev",
      github: "github.com/john"
    },
    summary: "Experienced software engineer with expertise in web development.",
    skills: ["JavaScript", "React", "Node.js", "Python"],
    experience: [
      {
        title: "Senior Developer",
        company: "Tech Corp",
        startDate: "2020",
        endDate: "Present",
        responsibilities: ["Led development team", "Built scalable solutions"]
      }
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        institution: "University",
        startYear: "2012",
        endYear: "2016"
      }
    ]
  };

  if (template.json_content) {
    return (
      <div className={`overflow-hidden ${className}`} style={{ height: '300px' }}>
        <div style={{ transform: 'scale(0.3)', transformOrigin: 'top left', width: '333%' }}>
          <CanvaStyleRenderer 
            template={template.json_content}
            data={miniData}
            scale={1}
          />
        </div>
      </div>
    );
  }

  // Fallback for templates without json_content
  return (
    <div className={`flex items-center justify-center h-full bg-gray-100 ${className}`}>
      <div className="text-center p-4">
        <div className="text-2xl font-bold text-gray-700 mb-2">{template.name || 'Template'}</div>
        <div className="text-sm text-gray-500">Preview not available</div>
      </div>
    </div>
  );
};

export default TemplateThumbnail;