import React from 'react';
import { ResumeData } from '@/types/resume';
import Mustache from 'mustache';

interface TemplateTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

interface TemplateSection {
  id: string;
  type: string;
  style?: any;
  content?: any;
  sections?: string[];
  columns?: any;
  width?: string;
  position?: string;
  backgroundColor?: string;
  textColor?: string;
  gap?: string | number;
}

interface CanvasTemplate {
  layout: string;
  theme: TemplateTheme;
  sections: TemplateSection[];
}

interface CanvaStyleRendererProps {
  template: CanvasTemplate;
  data: ResumeData;
  scale?: number;
}

const CanvaStyleRenderer: React.FC<CanvaStyleRendererProps> = ({ template, data, scale = 1 }) => {
  const renderContent = (content: string | any) => {
    if (typeof content === 'string') {
      // Convert data to template-friendly format
      const templateData = {
        fullName: data.contact.name,
        title: data.contact.title,
        email: data.contact.email,
        phone: data.contact.phone,
        location: data.contact.location,
        linkedin: data.contact.linkedin,
        portfolio: data.contact.portfolio,
        github: data.contact.github,
        summary: data.summary,
        skills: data.skills,
        experiences: data.experience.map(exp => ({
          position: exp.title,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate,
          achievements: exp.responsibilities
        })),
        education: data.education.map(edu => ({
          degree: edu.degree,
          institution: edu.institution,
          graduationDate: `${edu.startYear} - ${edu.endYear}`
        })),
        projects: data.projects,
        certifications: data.certifications
      };

      return Mustache.render(content, templateData);
    }
    return content;
  };

  const renderSection = (section: TemplateSection): React.ReactNode => {
    const { theme } = template;
    const baseStyle: React.CSSProperties = {
      ...section.style,
      fontFamily: theme.fontFamily
    };

    switch (section.type) {
      case 'header':
        return (
          <div 
            key={section.id}
            className="resume-header"
            style={{
              ...baseStyle,
              background: section.style?.backgroundColor === 'gradient' 
                ? `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                : section.style?.backgroundColor || theme.backgroundColor,
              color: section.style?.backgroundColor === 'gradient' ? '#FFFFFF' : theme.textColor,
              padding: section.style?.padding || '48px',
              textAlign: section.style?.textAlign as any || 'center'
            }}
          >
            <h1 className="text-4xl font-bold mb-2">{data.contact.name}</h1>
            <h2 className="text-xl mb-4">{data.contact.title}</h2>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span>{data.contact.email}</span>
              <span>{data.contact.phone}</span>
              <span>{data.contact.location}</span>
              {data.contact.linkedin && <span>{data.contact.linkedin}</span>}
            </div>
          </div>
        );

      case 'summary':
        return (
          <div 
            key={section.id}
            className="resume-summary"
            style={{
              ...baseStyle,
              padding: section.style?.padding || '24px',
              fontSize: section.style?.fontSize || '16px',
              color: theme.textColor
            }}
          >
            <h3 className="text-lg font-bold mb-3" style={{ color: theme.primaryColor }}>
              Professional Summary
            </h3>
            <p className="leading-relaxed">{data.summary}</p>
          </div>
        );

      case 'experience':
        return (
          <div 
            key={section.id}
            className="resume-experience"
            style={{
              ...baseStyle,
              padding: section.style?.padding || '24px',
              color: theme.textColor
            }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: theme.primaryColor }}>
              Experience
            </h3>
            {data.experience.map((exp, idx) => (
              <div key={idx} className="mb-4" style={{ marginBottom: section.style?.itemSpacing || '24px' }}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">{exp.title}</h4>
                    <p className="text-gray-600">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="text-sm">{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      case 'skills':
        return (
          <div 
            key={section.id}
            className="resume-skills"
            style={{
              ...baseStyle,
              padding: section.style?.padding || '24px',
              color: theme.textColor
            }}
          >
            <h3 className="text-lg font-bold mb-3" style={{ color: theme.primaryColor }}>
              Skills & Expertise
            </h3>
            <div 
              className={`grid gap-2`}
              style={{ 
                gridTemplateColumns: `repeat(${section.style?.columns || 3}, 1fr)` 
              }}
            >
              {data.skills.map((skill, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 rounded-full text-sm text-center"
                  style={{ 
                    backgroundColor: theme.accentColor + '20',
                    color: theme.primaryColor,
                    border: `1px solid ${theme.accentColor}`
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );

      case 'education':
        return (
          <div 
            key={section.id}
            className="resume-education"
            style={{
              ...baseStyle,
              padding: section.style?.padding || '24px',
              color: theme.textColor
            }}
          >
            <h3 className="text-lg font-bold mb-3" style={{ color: theme.primaryColor }}>
              Education
            </h3>
            {data.education.map((edu, idx) => (
              <div key={idx} className="mb-3" style={{ marginBottom: section.style?.itemSpacing || '16px' }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{edu.degree}</h4>
                    <p className="text-gray-600">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-600">
                    {edu.startYear} - {edu.endYear}
                  </span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'columns':
        return (
          <div key={section.id} className="flex gap-4">
            {section.columns?.map((col: any, idx: number) => (
              <div 
                key={idx} 
                style={{ width: col.width }}
                className="space-y-4"
              >
                {col.sections.map((sectionName: string) => {
                  const sectionData = template.sections.find(s => s.id === sectionName);
                  if (!sectionData) return null;
                  return renderSection({ ...sectionData, id: `${sectionName}-${idx}` });
                })}
              </div>
            ))}
          </div>
        );

      case 'grid':
        return (
          <div 
            key={section.id}
            className={`grid grid-cols-${section.columns || 2} gap-${section.gap || '32'}px`}
          >
            {section.sections?.map((sectionName: string) => {
              const sectionData = template.sections.find(s => s.id === sectionName);
              if (!sectionData) return null;
              return renderSection({ ...sectionData, id: `${sectionName}-grid` });
            })}
          </div>
        );

      case 'sidebar':
        const isLeft = section.position === 'left';
        return (
          <div
            key={section.id}
            className={`absolute ${isLeft ? 'left-0' : 'right-0'} top-0 h-full`}
            style={{
              width: section.width || '35%',
              backgroundColor: section.backgroundColor || theme.secondaryColor,
              color: section.textColor || '#FFFFFF',
              padding: '32px'
            }}
          >
            <div className="space-y-6">
              {section.sections?.map((sectionName: string) => {
                // Render sidebar-specific sections
                if (sectionName === 'contact') {
                  return (
                    <div key="contact">
                      <h3 className="font-bold mb-3">Contact</h3>
                      <div className="space-y-2 text-sm">
                        <p>{data.contact.email}</p>
                        <p>{data.contact.phone}</p>
                        <p>{data.contact.location}</p>
                        {data.contact.linkedin && <p>{data.contact.linkedin}</p>}
                      </div>
                    </div>
                  );
                }
                if (sectionName === 'skills') {
                  return (
                    <div key="skills">
                      <h3 className="font-bold mb-3">Skills</h3>
                      <div className="space-y-2">
                        {data.skills.map((skill, idx) => (
                          <div key={idx} className="text-sm">
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                if (sectionName === 'certifications' && data.certifications) {
                  return (
                    <div key="certifications">
                      <h3 className="font-bold mb-3">Certifications</h3>
                      <div className="space-y-2">
                        {data.certifications.map((cert, idx) => (
                          <div key={idx} className="text-sm">
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-xs opacity-80">{cert.issuer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        );

      case 'main':
        const hasSidebar = template.sections.some(s => s.type === 'sidebar');
        const sidebarSection = template.sections.find(s => s.type === 'sidebar');
        const marginLeft = hasSidebar && sidebarSection?.position === 'left' 
          ? sidebarSection.width || '35%' 
          : '0';
        const marginRight = hasSidebar && sidebarSection?.position === 'right'
          ? sidebarSection.width || '35%'
          : '0';

        return (
          <div
            key={section.id}
            style={{
              marginLeft,
              marginRight,
              padding: '32px'
            }}
          >
            <div className="space-y-6">
              {section.sections?.map((sectionName: string) => {
                if (sectionName === 'header') {
                  return (
                    <div key="header" className="mb-6">
                      <h1 className="text-3xl font-bold mb-2">{data.contact.name}</h1>
                      <h2 className="text-xl text-gray-600">{data.contact.title}</h2>
                    </div>
                  );
                }
                const sectionData = template.sections.find(s => s.id === sectionName);
                if (!sectionData) return null;
                return renderSection({ ...sectionData, id: `${sectionName}-main` });
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="resume-container bg-white relative"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        backgroundColor: template.theme.backgroundColor,
        fontFamily: template.theme.fontFamily,
        minHeight: '800px',
        maxWidth: '800px',
        margin: '0 auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      {template.sections.map(section => renderSection(section))}
    </div>
  );
};

export default CanvaStyleRenderer;