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
  children?: TemplateSection[];
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
  // Provide default theme if not defined
  const defaultTheme: TemplateTheme = {
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    accentColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    fontFamily: 'Inter, sans-serif'
  };

  const theme = template.theme || defaultTheme;
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
    // Use the theme from parent scope (with default fallback)
    
    // Helper function to apply advanced styling
    const getAdvancedStyles = (sectionStyle: any) => {
      const styles: React.CSSProperties = {
        ...sectionStyle,
        fontFamily: theme.fontFamily
      };
      
      // Handle background gradients
      if (sectionStyle?.background && sectionStyle.background.includes('gradient')) {
        styles.background = sectionStyle.background;
      }
      
      // Handle box shadows
      if (sectionStyle?.boxShadow) {
        styles.boxShadow = sectionStyle.boxShadow;
      }
      
      // Handle border radius
      if (sectionStyle?.borderRadius) {
        styles.borderRadius = sectionStyle.borderRadius;
      }
      
      // Handle borders
      if (sectionStyle?.border) {
        styles.border = sectionStyle.border;
      }
      
      // Handle grid column span
      if (sectionStyle?.gridColumn) {
        styles.gridColumn = sectionStyle.gridColumn;
      }
      
      // Handle transforms
      if (sectionStyle?.transform) {
        styles.transform = sectionStyle.transform;
      }
      
      if (sectionStyle?.transformOrigin) {
        styles.transformOrigin = sectionStyle.transformOrigin;
      }
      
      // Handle clip path
      if (sectionStyle?.clipPath) {
        styles.clipPath = sectionStyle.clipPath;
      }
      
      return styles;
    };

    switch (section.type) {
      case 'header':
        const headerStyles = getAdvancedStyles(section.style);
        return (
          <div 
            key={section.id}
            className="resume-section resume-header"
            style={{
              ...headerStyles,
              background: section.style?.background || `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              color: section.style?.color || '#FFFFFF',
              padding: section.style?.padding || '20px 24px',
              textAlign: section.style?.textAlign as any || 'center'
            }}
          >
            <h1 style={{ 
              fontSize: '1.75rem', 
              fontWeight: 'bold', 
              marginBottom: '0.25rem',
              color: 'inherit'
            }}>{data.contact.name}</h1>
            <h2 style={{ 
              fontSize: '1rem', 
              marginBottom: '0.5rem',
              color: 'inherit',
              opacity: 0.9
            }}>{data.contact.title}</h2>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: section.style?.textAlign === 'left' ? 'flex-start' : 'center',
              gap: '0.75rem', 
              fontSize: '0.75rem',
              color: 'inherit'
            }}>
              <span>{data.contact.email}</span>
              <span>{data.contact.phone}</span>
              <span>{data.contact.location}</span>
              {data.contact.linkedin && <span>{data.contact.linkedin}</span>}
            </div>
          </div>
        );

      case 'summary':
        const summaryStyles = getAdvancedStyles(section.style);
        return (
          <div 
            key={section.id}
            className="resume-section resume-summary"
            style={{
              ...summaryStyles,
              padding: section.style?.padding || '16px 24px',
              fontSize: section.style?.fontSize || '0.875rem',
              color: section.style?.color || theme.textColor
            }}
          >
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem', 
              color: theme.primaryColor 
            }}>
              Professional Summary
            </h3>
            <p style={{ 
              lineHeight: section.style?.lineHeight || '1.4',
              fontStyle: section.style?.fontStyle || 'normal'
            }}>{data.summary}</p>
          </div>
        );

      case 'experience':
        const experienceStyles = getAdvancedStyles(section.style);
        return (
          <div 
            key={section.id}
            className="resume-section resume-experience"
            style={{
              ...experienceStyles,
              padding: section.style?.padding || '16px 24px',
              color: section.style?.color || theme.textColor
            }}
          >
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem', 
              color: theme.primaryColor 
            }}>
              Experience
            </h3>
            {data.experience.map((exp, idx) => (
              <div key={idx} className="experience-item" style={{ 
                marginBottom: section.style?.itemSpacing || '12px',
                paddingBottom: section.style?.divider ? '0.5rem' : '0',
                borderBottom: section.style?.divider || 'none'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  marginBottom: '0.25rem' 
                }}>
                  <div>
                    <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{exp.title}</h4>
                    <p style={{ color: '#6B7280', fontSize: '0.75rem' }}>{exp.company}</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <ul style={{ 
                  listStyleType: 'disc', 
                  paddingLeft: '1.25rem', 
                  lineHeight: '1.3' 
                }}>
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} style={{ fontSize: '0.75rem', marginBottom: '0.125rem' }}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );

      case 'skills':
        const skillsStyles = getAdvancedStyles(section.style);
        const displayType = section.style?.display || 'tags';
        
        return (
          <div 
            key={section.id}
            className="resume-section resume-skills"
            style={{
              ...skillsStyles,
              padding: section.style?.padding || '16px 24px',
              color: section.style?.color || theme.textColor
            }}
          >
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem', 
              color: theme.primaryColor 
            }}>
              Skills & Expertise
            </h3>
            
            {displayType === 'tags' ? (
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: `repeat(${section.style?.columns || 3}, 1fr)`,
                gap: '0.375rem'
              }}>
                {data.skills.map((skill, idx) => (
                  <span 
                    key={idx}
                    style={{ 
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      backgroundColor: theme.accentColor + '20',
                      color: theme.primaryColor,
                      border: `1px solid ${theme.accentColor}`
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : displayType === 'list' ? (
              <ul style={{ 
                listStyleType: section.style?.listStyle || 'disc',
                paddingLeft: '1.25rem',
                lineHeight: '1.4'
              }}>
                {data.skills.map((skill, idx) => (
                  <li key={idx} style={{ 
                    fontSize: section.style?.fontSize || '0.75rem',
                    marginBottom: '0.125rem'
                  }}>{skill}</li>
                ))}
              </ul>
            ) : (
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.375rem'
              }}>
                {data.skills.map((skill, idx) => (
                  <span key={idx} style={{ fontSize: '0.75rem' }}>
                    {skill}{idx < data.skills.length - 1 && (section.style?.separator || ' •')}
                  </span>
                ))}
              </div>
            )}
          </div>
        );

      case 'education':
        const educationStyles = getAdvancedStyles(section.style);
        return (
          <div 
            key={section.id}
            className="resume-section resume-education"
            style={{
              ...educationStyles,
              padding: section.style?.padding || '16px 24px',
              color: section.style?.color || theme.textColor
            }}
          >
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem', 
              color: theme.primaryColor 
            }}>
              Education
            </h3>
            {data.education.map((edu, idx) => (
              <div key={idx} className="education-item" style={{ 
                marginBottom: section.style?.itemSpacing || '10px'
              }}>
                {section.style?.tableLayout ? (
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 2fr',
                    gap: '0.5rem',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      {edu.startYear} - {edu.endYear}
                    </span>
                    <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{edu.institution}</span>
                    <span style={{ fontSize: '0.875rem' }}>{edu.degree}</span>
                  </div>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start' 
                  }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{edu.degree}</h4>
                      <p style={{ color: '#6B7280', fontSize: '0.75rem' }}>{edu.institution}</p>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {edu.startYear} - {edu.endYear}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'columns':
        const sidebarWidth = section.style?.sidebarWidth || '35%';
        const columnGap = section.style?.columnGap || '16px';
        
        return (
          <div key={section.id} style={{ 
            display: 'flex', 
            gap: columnGap,
            width: '100%',
            position: 'relative',
            ...getAdvancedStyles(section.style)
          }}>
            {section.children?.map((child: TemplateSection, idx: number) => {
              const width = child.type === 'sidebar' ? sidebarWidth : `calc(100% - ${sidebarWidth} - ${columnGap})`;
              const childStyles = getAdvancedStyles(child.style);
              return (
                <div key={child.id || idx} style={{ 
                  width, 
                  flexShrink: 0,
                  position: 'relative',
                  ...childStyles
                }}>
                  {child.children?.map((innerSection: TemplateSection) => renderSection(innerSection))}
                </div>
              );
            })}
          </div>
        );

      case 'grid':
        const gridColumns = section.style?.columns || 2;
        const gridGap = section.style?.gap || '16px';
        const gridPadding = section.style?.padding || '16px 24px';
        const gridStyles = getAdvancedStyles(section.style);
        
        return (
          <div 
            key={section.id}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
              gap: gridGap,
              padding: gridPadding,
              width: '100%',
              position: 'relative',
              ...gridStyles
            }}
          >
            {section.children?.map((child: TemplateSection) => renderSection(child))}
          </div>
        );

      case 'contact':
        const contactStyles = getAdvancedStyles(section.style);
        return (
          <div 
            key={section.id}
            className="resume-contact"
            style={{
              ...contactStyles,
              padding: section.style?.padding || '16px 24px',
              color: section.style?.color || theme.textColor
            }}
          >
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem', 
              color: theme.primaryColor 
            }}>
              Contact
            </h3>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '0.375rem',
              fontSize: section.style?.fontSize || '0.75rem',
              lineHeight: section.style?.lineHeight || '1.4'
            }}>
              <div>{data.contact.email}</div>
              <div>{data.contact.phone}</div>
              <div>{data.contact.location}</div>
              {data.contact.linkedin && <div>{data.contact.linkedin}</div>}
              {data.contact.portfolio && <div>{data.contact.portfolio}</div>}
              {data.contact.github && <div>{data.contact.github}</div>}
            </div>
          </div>
        );

      case 'sidebar':
      case 'main':
        const containerStyles = getAdvancedStyles(section.style);
        return (
          <div key={section.id} style={{ 
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            ...containerStyles
          }}>
            {section.children?.map((child: TemplateSection) => renderSection(child))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="resume-container bg-white"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
        width: '100%',
        maxWidth: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {template.sections.map(section => renderSection(section))}
    </div>
  );
};

export default CanvaStyleRenderer;