import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
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
    spacing?: number;
    borderRadius?: number;
  };
  css: string;
}

interface MarkdownResumeRendererProps {
  config: MarkdownTemplateConfig;
  data: ResumeData;
  scale?: number;
  className?: string;
}

// Helper functions
function formatDate(date: string): string {
  if (!date) return '';
  try {
    // Handle year-only format
    if (/^\d{4}$/.test(date)) return date;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  } catch {
    return date;
  }
}

function extractYear(date: string): string {
  if (!date) return '';
  try {
    if (/^\d{4}$/.test(date)) return date;
    return new Date(date).getFullYear().toString();
  } catch {
    return date.split('-')[0] || date;
  }
}

const MarkdownResumeRenderer: React.FC<MarkdownResumeRendererProps> = React.memo(({
  config,
  data,
  scale = 1,
  className = ''
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
        startDate: formatDate(exp.startDate) || 'Start',
        endDate: formatDate(exp.endDate) || 'Present',
        responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : [],
        achievements: Array.isArray(exp.achievements) ? exp.achievements : []
      })),
      education: safeEducation.map(edu => ({
        degree: edu.degree || 'Degree',
        institution: edu.institution || 'Institution',
        startYear: extractYear(edu.startYear) || '',
        endYear: extractYear(edu.endYear) || '',
        gpa: edu.gpa || '',
        honors: edu.honors || ''
      })),
      skills: safeSkills,
      projects: safeProjects.map(proj => ({
        title: proj.title || 'Project',
        description: proj.description || '',
        technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
        link: proj.link || '',
        github: proj.github || ''
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
  const processedMarkdown = useMemo(() => {
    try {
      return Mustache.render(config.markdown_template || '', templateData);
    } catch (error) {
      console.error('Error rendering template:', error);
      return '# Error Rendering Template\n\nPlease check your data format.';
    }
  }, [config.markdown_template, templateData]);

  // Generate CSS with scaling
  const scaledCSS = useMemo(() => {
    const baseCSS = config.css || '';
    
    if (scale === 1) return baseCSS;
    
    // Scale font sizes and spacing
    return baseCSS
      .replace(/(\d+(?:\.\d+)?)px/g, (_, value) => `${parseFloat(value) * scale}px`)
      .replace(/(\d+(?:\.\d+)?)rem/g, (_, value) => `${parseFloat(value) * scale}rem`)
      .replace(/(\d+(?:\.\d+)?)em/g, (_, value) => `${parseFloat(value) * scale}em`);
  }, [config.css, scale]);

  // Generate scoped CSS with theme variables
  const scopedCss = useMemo(() => {
    const { theme } = config;
    const themeVars = `
      #${scopeId} {
        --primary-color: ${theme.primaryColor};
        --accent-color: ${theme.accentColor};
        --font-family: ${theme.fontFamily};
        --heading-font: ${theme.headingFont || theme.fontFamily};
        --spacing: ${theme.spacing || 1.5};
        --border-radius: ${theme.borderRadius || 6}px;
        
        font-family: var(--font-family);
        color: var(--primary-color);
        line-height: 1.6;
        padding: 40px;
        background: white;
      }
      #${scopeId} .resume-h1 {
        font-family: var(--heading-font);
        color: var(--primary-color);
        margin-bottom: 0.25rem;
      }
      #${scopeId} .resume-h2 {
        font-family: var(--heading-font);
        color: var(--primary-color);
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
      }
      #${scopeId} .resume-h3 {
        font-family: var(--heading-font);
        color: var(--primary-color);
        margin-top: 1rem;
        margin-bottom: 0.25rem;
      }
      #${scopeId} .resume-p {
        margin-bottom: 0.5rem;
      }
      #${scopeId} .resume-ul {
        margin-left: 1.5rem;
        margin-bottom: 0.5rem;
      }
      #${scopeId} .resume-li {
        margin-bottom: 0.25rem;
      }
      #${scopeId} .resume-hr {
        border: none;
        border-top: 1px solid ${theme.accentColor}40;
        margin: 1rem 0;
      }
      #${scopeId} .resume-strong {
        color: var(--primary-color);
      }
      #${scopeId} .resume-a {
        color: var(--accent-color);
        text-decoration: none;
      }
    `;
    
    // Replace generic selectors in custom CSS with scoped ones
    const customCss = scaledCSS 
      ? scaledCSS.replace(/\.resume-md/g, `#${scopeId}`).replace(/#SCOPE/g, `#${scopeId}`)
      : '';
    
    return themeVars + customCss;
  }, [config, scopeId, scaledCSS]);

  return (
    <div 
      className={`resume-container bg-white ${className}`}
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
      <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
      <div id={scopeId} className="markdown-content">
        <ReactMarkdown 
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ children }) => <h1 className="resume-h1">{children}</h1>,
            h2: ({ children }) => <h2 className="resume-h2">{children}</h2>,
            h3: ({ children }) => <h3 className="resume-h3">{children}</h3>,
            p: ({ children }) => <p className="resume-p">{children}</p>,
            ul: ({ children }) => <ul className="resume-ul">{children}</ul>,
            li: ({ children }) => <li className="resume-li">{children}</li>,
            a: ({ href, children }) => (
              <a href={href} className="resume-a" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
            hr: () => <hr className="resume-hr" />,
            strong: ({ children }) => <strong className="resume-strong">{children}</strong>,
            em: ({ children }) => <em className="resume-em">{children}</em>,
            code: ({ children }) => <code className="resume-code">{children}</code>,
            pre: ({ children }) => <pre className="resume-pre">{children}</pre>,
            blockquote: ({ children }) => <blockquote className="resume-blockquote">{children}</blockquote>
          }}
        >
          {processedMarkdown}
        </ReactMarkdown>
      </div>
    </div>
  );
});

MarkdownResumeRenderer.displayName = 'MarkdownResumeRenderer';

export default MarkdownResumeRenderer;
