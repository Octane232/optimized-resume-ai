import React, { useEffect, useRef } from 'react';
import { ResumeData } from '@/types/resume';
import Mustache from 'mustache';

interface ResumeTemplatePreviewProps {
  resumeData: ResumeData;
  templateId: string;
  templates: any[];
}

const ResumeTemplatePreview: React.FC<ResumeTemplatePreviewProps> = ({ 
  resumeData, 
  templateId,
  templates 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current || !templateId) return;

    const template = templates.find(t => t.id === templateId);
    let templateHTML = '';

    // Use template HTML content from database
    if (template?.html_content) {
      templateHTML = template.html_content;
    } else {
      // Fallback to a basic template if no HTML content
      templateHTML = getDefaultTemplate();
    }

    import React, { useEffect, useRef } from 'react';
import { ResumeData } from '@/types/resume';
import Mustache from 'mustache';

interface ResumeTemplatePreviewProps {
  resumeData: ResumeData;
  templateId: string;
  templates: any[];
}

const ResumeTemplatePreview: React.FC<ResumeTemplatePreviewProps> = ({ 
  resumeData, 
  templateId,
  templates 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current || !templateId) return;

    const template = templates.find(t => t.id === templateId);
    let templateHTML = '';

    // Use template HTML content from database
    if (template?.html_content) {
      templateHTML = template.html_content;
    } else {
      // Fallback to a basic template if no HTML content
      templateHTML = getDefaultTemplate();
    }

    // Musche data
    const mustacheData = {
      // Contact information
      name: resumeData.contact.name || 'Your Name',
      fullName: resumeData.contact.name || 'Your Name',
      title: resumeData.contact.title || 'Professional Title',
      email: resumeData.contact.email || 'email@example.com',
      phone: resumeData.contact.phone || '(555) 123-4567',
      location: resumeData.contact.location || 'City, State',
      linkedin: resumeData.contact.linkedin || 'linkedin.com/in/yourprofile',
      portfolio: resumeData.contact.portfolio || 'yourportfolio.com',
      github: resumeData.contact.github || 'github.com/yourusername',
      
      // Summary
      summary: resumeData.summary || 'Professional summary goes here...',
      
      // Skills - ensure they're properly formatted for Mustache
      skills: resumeData.skills.map(skill => 
        typeof skill === 'string' ? skill : String(skill)
      ),
      skillsList: resumeData.skills.join(', '),
      hasSkills: resumeData.skills.length > 0,
      
      // Experience
      experience: resumeData.experience.map(exp => ({
        title: exp.title,
        company: exp.company,
        startDate: exp.startDate,
        endDate: exp.endDate,
        responsibilities: exp.responsibilities.map(r => ({ responsibility: r })),
        hasResponsibilities: exp.responsibilities.length > 0
      })),
      hasExperience: resumeData.experience.length > 0,
      
      // Education - FIXED: Add formatted date field
      education: resumeData.education.map(edu => ({
        degree: edu.degree,
        institution: edu.institution,
        startYear: edu.startYear,
        endYear: edu.endYear,
        gpa: edu.gpa || '',
        // ADD THIS LINE TO FIX THE DATE ISSUE:
        date: edu.startYear && edu.endYear 
          ? `${edu.startYear} - ${edu.endYear}`
          : edu.startYear || edu.endYear || '',
        graduationDate: edu.startYear && edu.endYear 
          ? `${edu.startYear} - ${edu.endYear}`
          : edu.startYear || edu.endYear || '',
        years: edu.startYear && edu.endYear 
          ? `${edu.startYear} - ${edu.endYear}`
          : edu.startYear || edu.endYear || ''
      })),
      hasEducation: resumeData.education.length > 0,
      
      // Projects (if they exist)
      projects: resumeData.projects?.map(proj => ({
        title: proj.title,
        description: proj.description,
        technologies: proj.technologies?.join(', ') || '',
        link: proj.link || ''
      })) || [],
      hasProjects: resumeData.projects?.length > 0,
      
      // Certifications (if they exist)
      certifications: resumeData.certifications?.map(cert => ({
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date
      })) || [],
      hasCertifications: resumeData.certifications?.length > 0
    };
    
    // Render template with Mustache
    const finalHTML = Mustache.render(templateHTML, mustacheData);

    // Wrap in full HTML document
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 20px;
            background: white;
          }
          .resume-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          h1 {
            font-size: 2em;
            margin-bottom: 5px;
          }
          h2 {
            font-size: 1.5em;
            margin: 20px 0 10px;
            color: #2563eb;
          }
          h3 {
            font-size: 1.2em;
            margin: 10px 0 5px;
          }
          .contact-info {
            margin: 10px 0;
            color: #666;
          }
          .contact-info span {
            margin-right: 15px;
          }
          .section {
            margin: 25px 0;
          }
          .experience-item, .education-item {
            margin: 15px 0;
          }
          .company {
            color: #666;
            font-style: italic;
          }
          ul {
            margin-left: 20px;
            margin-top: 5px;
          }
          .skill {
            display: inline-block;
            background: #f0f0f0;
            padding: 4px 10px;
            margin: 4px;
            border-radius: 4px;
            font-size: 0.9em;
          }
        </style>
      </head>
      <body>
        <div id="resume-preview-content" class="resume-container">
          ${finalHTML}
        </div>
      </body>
      </html>
    `;

    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(fullHTML);
      iframeDoc.close();
    }
  }, [resumeData, templateId, templates]);

  const getDefaultTemplate = () => {
    return `
      <div class="header">
        <h1>{{name}}</h1>
        <p style="font-size: 1.2em; color: #666;">{{title}}</p>
        <div class="contact-info">
          <span>📧 {{email}}</span>
          <span>📱 {{phone}}</span>
          <span>📍 {{location}}</span>
        </div>
      </div>
      
      {{#hasSkills}}
      <div class="section">
        <h2>Skills</h2>
        <div class="skills-container">
          {{#skills}}
            <span class="skill">{{.}}</span>
          {{/skills}}
        </div>
      </div>
      {{/hasSkills}}
      
      <div class="section">
        <h2>Professional Summary</h2>
        <p>{{summary}}</p>
      </div>
      
      {{#hasExperience}}
      <div class="section">
        <h2>Experience</h2>
        {{#experience}}
        <div class="experience-item">
          <h3>{{title}}</h3>
          <p class="company">{{company}} | {{startDate}} - {{endDate}}</p>
          {{#hasResponsibilities}}
          <ul>
            {{#responsibilities}}
              <li>{{responsibility}}</li>
            {{/responsibilities}}
          </ul>
          {{/hasResponsibilities}}
        </div>
        {{/experience}}
      </div>
      {{/hasExperience}}
      
      {{#hasEducation}}
      <div class="section">
        <h2>Education</h2>
        {{#education}}
        <div class="education-item">
          <h3>{{degree}}</h3>
          <p>{{institution}} | {{date}}</p> <!-- CHANGED: Now uses the formatted date -->
          {{#gpa}}<p>GPA: {{gpa}}</p>{{/gpa}}
        </div>
        {{/education}}
      </div>
      {{/hasEducation}}
      
      {{#hasProjects}}
      <div class="section">
        <h2>Projects</h2>
        {{#projects}}
        <div class="project-item">
          <h3>{{title}}</h3>
          <p>{{description}}</p>
          {{#technologies}}<p class="tech">Technologies: {{technologies}}</p>{{/technologies}}
          {{#link}}<a href="{{link}}">View Project</a>{{/link}}
        </div>
        {{/projects}}
      </div>
      {{/hasProjects}}
    `;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <iframe
        ref={iframeRef}
        className="w-full h-[800px] border-0"
        title="Resume Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
};

export default ResumeTemplatePreview;
    
    // Render template with Mustache
    const finalHTML = Mustache.render(templateHTML, mustacheData);

    // Wrap in full HTML document
    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            padding: 20px;
            background: white;
          }
          .resume-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          .header {
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          h1 {
            font-size: 2em;
            margin-bottom: 5px;
          }
          h2 {
            font-size: 1.5em;
            margin: 20px 0 10px;
            color: #2563eb;
          }
          h3 {
            font-size: 1.2em;
            margin: 10px 0 5px;
          }
          .contact-info {
            margin: 10px 0;
            color: #666;
          }
          .contact-info span {
            margin-right: 15px;
          }
          .section {
            margin: 25px 0;
          }
          .experience-item, .education-item {
            margin: 15px 0;
          }
          .company {
            color: #666;
            font-style: italic;
          }
          ul {
            margin-left: 20px;
            margin-top: 5px;
          }
          .skill {
            display: inline-block;
            background: #f0f0f0;
            padding: 4px 10px;
            margin: 4px;
            border-radius: 4px;
            font-size: 0.9em;
          }
        </style>
      </head>
      <body>
        <div id="resume-preview-content" class="resume-container">
          ${finalHTML}
        </div>
      </body>
      </html>
    `;

    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(fullHTML);
      iframeDoc.close();
    }
  }, [resumeData, templateId, templates]);

  const getDefaultTemplate = () => {
    return `
      <div class="header">
        <h1>{{name}}</h1>
        <p style="font-size: 1.2em; color: #666;">{{title}}</p>
        <div class="contact-info">
          <span>📧 {{email}}</span>
          <span>📱 {{phone}}</span>
          <span>📍 {{location}}</span>
        </div>
      </div>
      
      {{#hasSkills}}
      <div class="section">
        <h2>Skills</h2>
        <div class="skills-container">
          {{#skills}}
            <span class="skill">{{.}}</span>
          {{/skills}}
        </div>
      </div>
      {{/hasSkills}}
      
      <div class="section">
        <h2>Professional Summary</h2>
        <p>{{summary}}</p>
      </div>
      
      {{#hasExperience}}
      <div class="section">
        <h2>Experience</h2>
        {{#experience}}
        <div class="experience-item">
          <h3>{{title}}</h3>
          <p class="company">{{company}} | {{startDate}} - {{endDate}}</p>
          {{#hasResponsibilities}}
          <ul>
            {{#responsibilities}}
              <li>{{responsibility}}</li>
            {{/responsibilities}}
          </ul>
          {{/hasResponsibilities}}
        </div>
        {{/experience}}
      </div>
      {{/hasExperience}}
      
      {{#hasEducation}}
      <div class="section">
        <h2>Education</h2>
        {{#education}}
        <div class="education-item">
          <h3>{{degree}}</h3>
          <p>{{institution}} | {{date}}</p> <!-- CHANGED: Now uses the formatted date -->
          {{#gpa}}<p>GPA: {{gpa}}</p>{{/gpa}}
        </div>
        {{/education}}
      </div>
      {{/hasEducation}}
      
      {{#hasProjects}}
      <div class="section">
        <h2>Projects</h2>
        {{#projects}}
        <div class="project-item">
          <h3>{{title}}</h3>
          <p>{{description}}</p>
          {{#technologies}}<p class="tech">Technologies: {{technologies}}</p>{{/technologies}}
          {{#link}}<a href="{{link}}">View Project</a>{{/link}}
        </div>
        {{/projects}}
      </div>
      {{/hasProjects}}
    `;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <iframe
        ref={iframeRef}
        className="w-full h-[800px] border-0"
        title="Resume Preview"
        sandbox="allow-same-origin"
      />
    </div>
  );
};

export default ResumeTemplatePreview;
