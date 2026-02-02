import React, { useMemo } from 'react';
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
  title?: string;
  titlePrefix?: string;
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

const CanvaStyleRenderer: React.FC<CanvaStyleRendererProps> = React.memo(({ template, data, scale = 1 }) => {
  // Memoize theme to prevent recalculation
  const theme = useMemo(() => {
    const defaultTheme: TemplateTheme = {
      primaryColor: '#2563eb',
      secondaryColor: '#64748b',
      accentColor: '#3b82f6',
      backgroundColor: '#ffffff',
      textColor: '#1e293b',
      fontFamily: 'Inter, sans-serif'
    };
    return template.theme || defaultTheme;
  }, [template.theme]);
  // Safe accessors to handle missing or malformed data
  const safeContact = data.contact || { name: '', title: '', email: '', phone: '', location: '' };
  const safeExperience = Array.isArray(data.experience) ? data.experience : [];
  const safeEducation = Array.isArray(data.education) ? data.education : [];
  const safeSkills = Array.isArray(data.skills) ? data.skills : [];
  const safeProjects = Array.isArray(data.projects) ? data.projects : [];
  const safeCertifications = Array.isArray(data.certifications) ? data.certifications : [];

  const renderContent = (content: string | any) => {
    if (typeof content === 'string') {
      // Convert data to template-friendly format
      const templateData = {
        fullName: safeContact.name || '',
        title: safeContact.title || '',
        email: safeContact.email || '',
        phone: safeContact.phone || '',
        location: safeContact.location || '',
        linkedin: safeContact.linkedin || '',
        portfolio: safeContact.portfolio || '',
        github: safeContact.github || '',
        summary: data.summary || '',
        skills: safeSkills,
        experiences: safeExperience.map(exp => ({
          position: exp.title || '',
          company: exp.company || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          achievements: Array.isArray(exp.responsibilities) ? exp.responsibilities : []
        })),
        education: safeEducation.map(edu => ({
          degree: edu.degree || '',
          institution: edu.institution || '',
          graduationDate: `${edu.startYear || ''} - ${edu.endYear || ''}`
        })),
        projects: safeProjects,
        certifications: safeCertifications
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
            style={headerStyles}
          >
            <h1 style={{ 
              fontSize: section.style?.fontSize || '1.75rem', 
              fontWeight: section.style?.fontWeight || 'bold', 
              marginBottom: '0.25rem',
              color: section.style?.color || theme.textColor,
              fontFamily: section.style?.fontFamily || 'inherit',
              letterSpacing: section.style?.letterSpacing || 'normal',
              textTransform: section.style?.textTransform as any || 'none'
            }}>{safeContact.name || 'Your Name'}</h1>
            <h2 style={{ 
              fontSize: section.style?.titleFontSize || '1rem', 
              marginBottom: '0.5rem',
              color: section.style?.color || theme.textColor,
              opacity: section.style?.titleOpacity || 0.9,
              fontWeight: section.style?.titleFontWeight || 'normal',
              textTransform: section.style?.titleTextTransform as any || 'none',
              letterSpacing: section.style?.titleLetterSpacing || 'normal',
              fontStyle: section.style?.titleFontStyle as any || 'normal'
            }}>{safeContact.title || 'Professional Title'}</h2>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              justifyContent: section.style?.textAlign === 'left' ? 'flex-start' : section.style?.textAlign === 'right' ? 'flex-end' : 'center',
              gap: '0.75rem', 
              fontSize: '0.75rem',
              color: section.style?.color || theme.textColor
            }}>
              {safeContact.email && <span>{safeContact.email}</span>}
              {safeContact.phone && <span>{safeContact.phone}</span>}
              {safeContact.location && <span>{safeContact.location}</span>}
              {safeContact.linkedin && <span>{safeContact.linkedin}</span>}
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
            }}>{data.summary || 'Professional summary goes here...'}</p>
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
            {safeExperience.length > 0 ? safeExperience.map((exp, idx) => (
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
                    <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{exp.title || 'Job Title'}</h4>
                    <p style={{ color: '#6B7280', fontSize: '0.75rem' }}>{exp.company || 'Company Name'}</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {exp.startDate || 'Start'} - {exp.endDate || 'End'}
                  </span>
                </div>
                {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                  <ul style={{ 
                    listStyleType: 'disc', 
                    paddingLeft: '1.25rem', 
                    lineHeight: '1.3' 
                  }}>
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} style={{ fontSize: '0.75rem', marginBottom: '0.125rem' }}>{resp}</li>
                    ))}
                  </ul>
                )}
              </div>
            )) : (
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>No experience entries added yet.</p>
            )}
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
            
            {safeSkills.length > 0 ? (
              displayType === 'tags' ? (
                <div style={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  {safeSkills.map((skill, idx) => (
                    <span 
                      key={idx}
                      style={{ 
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        backgroundColor: theme.accentColor + '15',
                        color: theme.primaryColor,
                        border: `1px solid ${theme.accentColor}40`,
                        whiteSpace: 'nowrap'
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
                  {safeSkills.map((skill, idx) => (
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
                  {safeSkills.map((skill, idx) => (
                    <span key={idx} style={{ fontSize: '0.75rem' }}>
                      {skill}{idx < safeSkills.length - 1 && (section.style?.separator || ' •')}
                    </span>
                  ))}
                </div>
              )
            ) : (
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>No skills added yet.</p>
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
            {safeEducation.length > 0 ? safeEducation.map((edu, idx) => (
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
                      {edu.startYear || ''} - {edu.endYear || ''}
                    </span>
                    <span style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{edu.institution || 'Institution'}</span>
                    <span style={{ fontSize: '0.875rem' }}>{edu.degree || 'Degree'}</span>
                  </div>
                ) : (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start' 
                  }}>
                    <div>
                      <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{edu.degree || 'Degree'}</h4>
                      <p style={{ color: '#6B7280', fontSize: '0.75rem' }}>{edu.institution || 'Institution'}</p>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {edu.startYear || ''} - {edu.endYear || ''}
                    </span>
                  </div>
                )}
              </div>
            )) : (
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>No education entries added yet.</p>
            )}
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
              {safeContact.email && <div>{safeContact.email}</div>}
              {safeContact.phone && <div>{safeContact.phone}</div>}
              {safeContact.location && <div>{safeContact.location}</div>}
              {safeContact.linkedin && <div>{safeContact.linkedin}</div>}
              {safeContact.portfolio && <div>{safeContact.portfolio}</div>}
              {safeContact.github && <div>{safeContact.github}</div>}
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

      case 'projects':
        const projectsStyles = getAdvancedStyles(section.style);
        return (
          <div 
            key={section.id}
            className="resume-section resume-projects"
            style={{
              ...projectsStyles,
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
              Projects
            </h3>
            {safeProjects.length > 0 ? safeProjects.map((project, idx) => (
              <div key={idx} className="project-item" style={{ 
                marginBottom: section.style?.itemSpacing || '12px'
              }}>
                <h4 style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{project.title || 'Project Title'}</h4>
                {project.description && (
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.25rem' }}>
                    {project.description}
                  </p>
                )}
                {Array.isArray(project.technologies) && project.technologies.length > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.25rem', 
                    marginTop: '0.375rem' 
                  }}>
                    {project.technologies.map((tech, i) => (
                      <span 
                        key={i}
                        style={{ 
                          fontSize: '0.65rem',
                          padding: '0.125rem 0.375rem',
                          backgroundColor: theme.accentColor + '20',
                          color: theme.primaryColor,
                          borderRadius: '4px'
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )) : (
              <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>No projects added yet.</p>
            )}
          </div>
        );

      case 'text':
        const textStyles = getAdvancedStyles(section.style);
        const textContent = section.content ? renderContent(section.content) : '';
        return (
          <div 
            key={section.id}
            style={{
              ...textStyles,
              color: section.style?.color || theme.textColor
            }}
          >
            {textContent}
          </div>
        );

      case 'section':
        const sectionStyles = getAdvancedStyles(section.style);
        return (
          <div 
            key={section.id}
            style={{
              ...sectionStyles,
              marginBottom: section.style?.marginBottom || '16px'
            }}
          >
            {section.title && (
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem', 
                color: theme.primaryColor 
              }}>
                {section.title}
              </h3>
            )}
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
});

CanvaStyleRenderer.displayName = 'CanvaStyleRenderer';

export default CanvaStyleRenderer;