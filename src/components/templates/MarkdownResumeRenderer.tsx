import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import Mustache from 'mustache';
import { ResumeData } from '@/types/resume';

export interface MarkdownTemplateConfig {
  type: 'markdown';
  markdown_template: string;
  theme: {
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    headingFont?: string;
  };
  css: string;
}

interface MarkdownResumeRendererProps {
  config: MarkdownTemplateConfig;
  data: ResumeData;
  scale?: number;
}

const MarkdownResumeRenderer: React.FC<MarkdownResumeRendererProps> = React.memo(({ 
  config, 
  data, 
  scale = 1 
}) => {
  // Generate unique ID for scoped styles
  const scopeId = useMemo(() => `resume-md-${Math.random().toString(36).substr(2, 9)}`, []);

  // Transform ResumeData to template-friendly format
  const templateData = useMemo(() => {
    const safeContact = data.contact || { name: '', title: '', email: '', phone: '', location: '' };
    const safeExperience = Array.isArray(data.experience) ? data.experience : [];
    const safeEducation = Array.isArray(data.education) ? data.education : [];
    const safeSkills = Array.isArray(data.skills) ? data.skills : [];
    const safeProjects = Array.isArray(data.projects) ? data.projects : [];
    const safeCertifications = Array.isArray(data.certifications) ? data.certifications : [];

    return {
      contact: {
        name: safeContact.name || 'Your Name',
        title: safeContact.title || 'Professional Title',
        email: safeContact.email || '',
        phone: safeContact.phone || '',
        location: safeContact.location || '',
        linkedin: safeContact.linkedin || '',
        portfolio: safeContact.portfolio || '',
        github: safeContact.github || ''
      },
      summary: data.summary || 'Professional summary goes here...',
      experience: safeExperience.map(exp => ({
        title: exp.title || 'Job Title',
        company: exp.company || 'Company Name',
        startDate: exp.startDate || 'Start',
        endDate: exp.endDate || 'Present',
        responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : []
      })),
      education: safeEducation.map(edu => ({
        degree: edu.degree || 'Degree',
        institution: edu.institution || 'Institution',
        startYear: edu.startYear || '',
        endYear: edu.endYear || ''
      })),
      skills: safeSkills,
      projects: safeProjects.map(proj => ({
        title: proj.title || 'Project',
        description: proj.description || '',
        technologies: Array.isArray(proj.technologies) ? proj.technologies : []
      })),
      certifications: safeCertifications.map(cert => ({
        name: cert.name || 'Certification',
        issuer: cert.issuer || '',
        date: cert.date || ''
      })),
      // Helper flags for conditional rendering
      hasExperience: safeExperience.length > 0,
      hasEducation: safeEducation.length > 0,
      hasSkills: safeSkills.length > 0,
      hasProjects: safeProjects.length > 0,
      hasCertifications: safeCertifications.length > 0
    };
  }, [data]);

  // Process markdown template with Mustache
  const renderedMarkdown = useMemo(() => {
    try {
      return Mustache.render(config.markdown_template || '', templateData);
    } catch (error) {
      console.error('Mustache render error:', error);
      return '# Error rendering template';
    }
  }, [config.markdown_template, templateData]);

  // Generate scoped CSS
  const scopedCss = useMemo(() => {
    const { theme, css } = config;
    const baseStyles = `
      #${scopeId} {
        font-family: ${theme.fontFamily};
        color: ${theme.primaryColor};
        line-height: 1.6;
        padding: 40px;
        background: white;
      }
      #${scopeId} h1 {
        font-family: ${theme.headingFont || theme.fontFamily};
        color: ${theme.primaryColor};
        margin-bottom: 0.25rem;
      }
      #${scopeId} h2 {
        font-family: ${theme.headingFont || theme.fontFamily};
        color: ${theme.primaryColor};
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
      }
      #${scopeId} h3 {
        font-family: ${theme.headingFont || theme.fontFamily};
        color: ${theme.primaryColor};
        margin-top: 1rem;
        margin-bottom: 0.25rem;
      }
      #${scopeId} p {
        margin-bottom: 0.5rem;
      }
      #${scopeId} ul {
        margin-left: 1.5rem;
        margin-bottom: 0.5rem;
      }
      #${scopeId} li {
        margin-bottom: 0.25rem;
      }
      #${scopeId} hr {
        border: none;
        border-top: 1px solid ${theme.accentColor}40;
        margin: 1rem 0;
      }
      #${scopeId} strong {
        color: ${theme.primaryColor};
      }
      #${scopeId} a {
        color: ${theme.accentColor};
        text-decoration: none;
      }
    `;
    
    // Replace generic selectors in custom CSS with scoped ones
    const customCss = css ? css.replace(/\.resume-md/g, `#${scopeId}`) : '';
    
    return baseStyles + customCss;
  }, [config, scopeId]);

  return (
    <div 
      className="resume-container bg-white"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: '100%',
        maxWidth: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <style>{scopedCss}</style>
      <div id={scopeId} className="resume-md-content">
        <ReactMarkdown>{renderedMarkdown}</ReactMarkdown>
      </div>
    </div>
  );
});

MarkdownResumeRenderer.displayName = 'MarkdownResumeRenderer';

export default MarkdownResumeRenderer;
