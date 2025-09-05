import React, { useEffect, useRef } from 'react';
import { ResumeData } from '@/types/resume';

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

    // Replace placeholders with actual data
    let finalHTML = templateHTML;
    
    // Contact info replacements
    finalHTML = finalHTML.replace(/{{fullName}}/g, resumeData.contact.name || '');
    finalHTML = finalHTML.replace(/{{name}}/g, resumeData.contact.name || '');
    finalHTML = finalHTML.replace(/{{title}}/g, resumeData.contact.title || '');
    finalHTML = finalHTML.replace(/{{email}}/g, resumeData.contact.email || '');
    finalHTML = finalHTML.replace(/{{phone}}/g, resumeData.contact.phone || '');
    finalHTML = finalHTML.replace(/{{location}}/g, resumeData.contact.location || '');
    finalHTML = finalHTML.replace(/{{linkedin}}/g, resumeData.contact.linkedin || '');
    finalHTML = finalHTML.replace(/{{portfolio}}/g, resumeData.contact.portfolio || '');
    finalHTML = finalHTML.replace(/{{github}}/g, resumeData.contact.github || '');
    
    // Summary
    finalHTML = finalHTML.replace(/{{summary}}/g, resumeData.summary || '');
    
    // Skills
    const skillsHTML = resumeData.skills.length > 0 
      ? resumeData.skills.map(s => `<span class="skill">${s}</span>`).join(' ')
      : '';
    finalHTML = finalHTML.replace(/{{skills}}/g, skillsHTML);
    
    // Experience
    const experienceHTML = resumeData.experience.map(exp => `
      <div class="experience-item">
        <h3>${exp.title}</h3>
        <p class="company">${exp.company} | ${exp.startDate} - ${exp.endDate}</p>
        <ul>
          ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    `).join('');
    finalHTML = finalHTML.replace(/{{experience}}/g, experienceHTML);
    
    // Education
    const educationHTML = resumeData.education.map(edu => `
      <div class="education-item">
        <h3>${edu.degree}</h3>
        <p>${edu.institution} | ${edu.startYear} - ${edu.endYear}</p>
      </div>
    `).join('');
    finalHTML = finalHTML.replace(/{{education}}/g, educationHTML);

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
      
      <div class="section">
        <h2>Professional Summary</h2>
        <p>{{summary}}</p>
      </div>
      
      <div class="section">
        <h2>Skills</h2>
        <div>{{skills}}</div>
      </div>
      
      <div class="section">
        <h2>Experience</h2>
        {{experience}}
      </div>
      
      <div class="section">
        <h2>Education</h2>
        {{education}}
      </div>
    `;
  };

  const getBuiltInTemplate = (templateName: string) => {
    switch(templateName) {
      case 'modern':
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
          
          <div class="section">
            <h2>Professional Summary</h2>
            <p>{{summary}}</p>
          </div>
          
          <div class="section">
            <h2>Skills</h2>
            <div>{{skills}}</div>
          </div>
          
          <div class="section">
            <h2>Experience</h2>
            {{experience}}
          </div>
          
          <div class="section">
            <h2>Education</h2>
            {{education}}
          </div>
        `;
      
      case 'classic':
        return `
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="margin-bottom: 10px;">{{name}}</h1>
            <p>{{email}} | {{phone}} | {{location}}</p>
          </div>
          
          <div class="section">
            <h2 style="border-bottom: 1px solid #333; padding-bottom: 5px;">OBJECTIVE</h2>
            <p>{{summary}}</p>
          </div>
          
          <div class="section">
            <h2 style="border-bottom: 1px solid #333; padding-bottom: 5px;">SKILLS</h2>
            <div>{{skills}}</div>
          </div>
          
          <div class="section">
            <h2 style="border-bottom: 1px solid #333; padding-bottom: 5px;">PROFESSIONAL EXPERIENCE</h2>
            {{experience}}
          </div>
          
          <div class="section">
            <h2 style="border-bottom: 1px solid #333; padding-bottom: 5px;">EDUCATION</h2>
            {{education}}
          </div>
        `;
      
      default:
        return getBuiltInTemplate('modern');
    }
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