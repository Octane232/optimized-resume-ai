import React, { useEffect, useRef } from 'react';
import { ResumeData } from '@/types/resume';
import Mustache from 'mustache';

interface ResumeTemplatePreviewProps {
  resumeData: ResumeData;
  templateId: string;
  templates: any[];
}

// ===== HELPER FUNCTIONS =====
function createExperienceData(exp: any) {
  return {
    // Title variations
    title: exp.title,
    jobTitle: exp.title,
    position: exp.title,
    role: exp.title,
    
    // Company variations
    company: exp.company,
    employer: exp.company,
    companyName: exp.company,
    organization: exp.company,
    
    // Location
    location: exp.location || 'Remote',
    
    // Date variations
    startDate: exp.startDate,
    endDate: exp.endDate,
    start: exp.startDate,
    end: exp.endDate,
    duration: `${exp.startDate} - ${exp.endDate}`,
    period: `${exp.startDate} - ${exp.endDate}`,
    timePeriod: `${exp.startDate} - ${exp.endDate}`,
    
    // Responsibilities variations - KEEP AS STRINGS, NOT OBJECTS
    responsibilities: exp.responsibilities,
    achievements: exp.responsibilities,
    tasks: exp.responsibilities,
    duties: exp.responsibilities,
    accomplishments: exp.responsibilities,
    description: exp.responsibilities.join('. '),
    
    // Boolean flags
    hasResponsibilities: exp.responsibilities.length > 0,
    hasAchievements: exp.responsibilities.length > 0,
    hasTasks: exp.responsibilities.length > 0
  };
}

function createEducationData(edu: any) {
  return {
    // Degree variations
    degree: edu.degree,
    qualification: edu.degree,
    program: edu.degree,
    
    // Institution variations
    institution: edu.institution,
    school: edu.institution,
    university: edu.institution,
    college: edu.institution,
    
    // Year variations
    startYear: edu.startYear,
    endYear: edu.endYear,
    graduationYear: edu.endYear,
    
    // Date variations
    date: edu.startYear && edu.endYear ? `${edu.startYear} - ${edu.endYear}` : edu.startYear || edu.endYear || '',
    graduationDate: edu.startYear && edu.endYear ? `${edu.startYear} - ${edu.endYear}` : edu.startYear || edu.endYear || '',
    years: edu.startYear && edu.endYear ? `${edu.startYear} - ${edu.endYear}` : edu.startYear || edu.endYear || '',
    period: edu.startYear && edu.endYear ? `${edu.startYear} - ${edu.endYear}` : edu.startYear || edu.endYear || '',
    
    // Boolean flags
    hasYears: !!edu.startYear || !!edu.endYear
  };
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
    if (!template) return;

    let templateHTML = '';
    if (template?.html_content) {
      templateHTML = template.html_content;
    } else {
      templateHTML = getDefaultTemplate();
    }

    // Prepare data for Mustache
    const mustacheData = {
      // ===== CONTACT INFO =====
      name: resumeData.contact.name,
      fullName: resumeData.contact.name,
      title: resumeData.contact.title,
      jobTitle: resumeData.contact.title,
      email: resumeData.contact.email,
      phone: resumeData.contact.phone,
      location: resumeData.contact.location,
      linkedin: resumeData.contact.linkedin,
      portfolio: resumeData.contact.portfolio,
      github: resumeData.contact.github,
      address: resumeData.contact.location,
      
      // ===== SUMMARY =====
      summary: resumeData.summary,
      objective: resumeData.summary,
      professionalSummary: resumeData.summary,
      bio: resumeData.summary,
      
      // ===== SKILLS =====
      skills: resumeData.skills,
      skillsList: resumeData.skills.join(', '),
      competencies: resumeData.skills,
      technologies: resumeData.skills,
      hasSkills: resumeData.skills.length > 0,
      
      // ===== EXPERIENCE =====
      experience: resumeData.experience.map(createExperienceData),
      hasExperience: resumeData.experience.length > 0,
      experiences: resumeData.experience.map(createExperienceData),
      hasExperiences: resumeData.experience.length > 0,
      workExperience: resumeData.experience.map(createExperienceData),
      hasWorkExperience: resumeData.experience.length > 0,
      professionalExperience: resumeData.experience.map(createExperienceData),
      employment: resumeData.experience.map(createExperienceData),
      jobs: resumeData.experience.map(createExperienceData),
      workHistory: resumeData.experience.map(createExperienceData),
      work: resumeData.experience.map(createExperienceData),
      hasWork: resumeData.experience.length > 0,
      
      // ===== EDUCATION =====
      education: resumeData.education.map(createEducationData),
      hasEducation: resumeData.education.length > 0,
      educationHistory: resumeData.education.map(createEducationData),
      academic: resumeData.education.map(createEducationData),
      academics: resumeData.education.map(createEducationData),
      
      // ===== PROJECTS =====
      projects: resumeData.projects || [],
      hasProjects: (resumeData.projects?.length || 0) > 0,
    };

    // Render template with Mustache
    try {
      const finalHTML = Mustache.render(templateHTML, mustacheData);
      
      // Wrap in full HTML document
      const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6; color: #333; padding: 20px; background: white;
            }
            .resume-container { 
              max-width: 800px; margin: 0 auto; background: white; 
              padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <div class="resume-container">${finalHTML}</div>
        </body>
        </html>
      `;

      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(fullHTML);
        iframeDoc.close();
      }
    } catch (error) {
      console.error('Template rendering error:', error);
      
      // Fallback: Show raw data in iframe
      const errorHTML = `
        <!DOCTYPE html>
        <html>
        <body>
          <h1>Resume Preview</h1>
          <h2>Experience</h2>
          ${resumeData.experience.map(exp => `
            <div style="margin: 20px; padding: 15px; border: 1px solid #ccc; border-radius: 5px;">
              <h3>${exp.title} at ${exp.company}</h3>
              <p>${exp.startDate} - ${exp.endDate}</p>
              <ul>
                ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </body>
        </html>
      `;
      
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(errorHTML);
        iframeDoc.close();
      }
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
          {{#skills}}<span class="skill">{{.}}</span>{{/skills}}
        </div>
      </div>
      {{/hasSkills}}
      
      <div class="section">
        <h2>Professional Summary</h2>
        <p>{{summary}}</p>
      </div>
      
      {{#hasExperiences}}
      <div class="section">
        <h2>Experience</h2>
        {{#experiences}}
        <div class="experience-item">
          <h3>{{position}}</h3>
          <p class="company">{{company}} • {{location}}</p>
          <p class="period">{{startDate}} - {{endDate}}</p>
          {{#hasAchievements}}
          <ul>
            {{#achievements}}<li>{{.}}</li>{{/achievements}}
          </ul>
          {{/hasAchievements}}
        </div>
        {{/experiences}}
      </div>
      {{/hasExperiences}}
      
      {{#hasEducation}}
      <div class="section">
        <h2>Education</h2>
        {{#education}}
        <div class="education-item">
          <h3>{{degree}}</h3>
          <p>{{institution}} | {{graduationDate}}</p>
        </div>
        {{/education}}
      </div>
      {{/hasEducation}}
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
