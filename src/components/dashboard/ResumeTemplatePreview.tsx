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

  // Prepare data for Mustache - UNIVERSAL VARIABLE SUPPORT
const mustacheData = {
  // ===== CONTACT INFO =====
  name: resumeData.contact.name || 'Your Name',
  fullName: resumeData.contact.name || 'Your Name',
  title: resumeData.contact.title || 'Professional Title',
  jobTitle: resumeData.contact.title || 'Professional Title',
  email: resumeData.contact.email || 'email@example.com',
  phone: resumeData.contact.phone || '(555) 123-4567',
  location: resumeData.contact.location || 'City, State',
  linkedin: resumeData.contact.linkedin || 'linkedin.com/in/yourprofile',
  portfolio: resumeData.contact.portfolio || 'yourportfolio.com',
  github: resumeData.contact.github || 'github.com/yourusername',
  address: resumeData.contact.location || 'City, State',
  
  // ===== SUMMARY =====
  summary: resumeData.summary || 'Professional summary goes here...',
  objective: resumeData.summary || 'Professional summary goes here...',
  professionalSummary: resumeData.summary || 'Professional summary goes here...',
  bio: resumeData.summary || 'Professional summary goes here...',
  
  // ===== SKILLS =====
  skills: resumeData.skills.map(skill => typeof skill === 'string' ? skill : String(skill)),
  skillsList: resumeData.skills.join(', '),
  competencies: resumeData.skills,
  technologies: resumeData.skills,
  technicalSkills: resumeData.skills,
  programmingLanguages: resumeData.skills,
  languages: resumeData.skills,
  abilities: resumeData.skills,
  expertise: resumeData.skills,
  hasSkills: resumeData.skills.length > 0,
  hasCompetencies: resumeData.skills.length > 0,
  
  // ===== EXPERIENCE - ALL POSSIBLE VARIATIONS =====
  // Main experience array
  experience: resumeData.experience.map(createExperienceData),
  hasExperience: resumeData.experience.length > 0,
  
  // Alternative names for experience
  workExperience: resumeData.experience.map(createExperienceData),
  hasWorkExperience: resumeData.experience.length > 0,
  
  professionalExperience: resumeData.experience.map(createExperienceData),
  hasProfessionalExperience: resumeData.experience.length > 0,
  
  creativeExperience: resumeData.experience.map(createExperienceData),
  hasCreativeExperience: resumeData.experience.length > 0,
  
  employment: resumeData.experience.map(createExperienceData),
  hasEmployment: resumeData.experience.length > 0,
  
  employmentHistory: resumeData.experience.map(createExperienceData),
  hasEmploymentHistory: resumeData.experience.length > 0,
  
  jobs: resumeData.experience.map(createExperienceData),
  hasJobs: resumeData.experience.length > 0,
  
  workHistory: resumeData.experience.map(createExperienceData),
  hasWorkHistory: resumeData.experience.length > 0,
  
  // ===== EDUCATION =====
  education: resumeData.education.map(createEducationData),
  hasEducation: resumeData.education.length > 0,
  
  educationHistory: resumeData.education.map(createEducationData),
  hasEducationHistory: resumeData.education.length > 0,
  
  academic: resumeData.education.map(createEducationData),
  hasAcademic: resumeData.education.length > 0,
  
  academics: resumeData.education.map(createEducationData),
  hasAcademics: resumeData.education.length > 0,
  
  // ===== PROJECTS =====
  projects: resumeData.projects?.map(createProjectData) || [],
  hasProjects: resumeData.projects?.length > 0,
  
  personalProjects: resumeData.projects?.map(createProjectData) || [],
  hasPersonalProjects: resumeData.projects?.length > 0,
  
  portfolioProjects: resumeData.projects?.map(createProjectData) || [],
  hasPortfolioProjects: resumeData.projects?.length > 0,
  
  // ===== CERTIFICATIONS =====
  certifications: resumeData.certifications?.map(createCertificationData) || [],
  hasCertifications: resumeData.certifications?.length > 0,
  
  certificates: resumeData.certifications?.map(createCertificationData) || [],
  hasCertificates: resumeData.certifications?.length > 0,
  
  // ===== AWARDS =====
  awards: resumeData.awards?.map(createAwardData) || [],
  hasAwards: resumeData.awards?.length > 0,
  
  honors: resumeData.awards?.map(createAwardData) || [],
  hasHonors: resumeData.awards?.length > 0,
  
  achievements: resumeData.awards?.map(createAwardData) || [],
  hasAchievements: resumeData.awards?.length > 0,
};

// Helper function for experience data
function createExperienceData(exp) {
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
    
    // Date variations
    startDate: exp.startDate,
    endDate: exp.endDate,
    start: exp.startDate,
    end: exp.endDate,
    duration: `${exp.startDate} - ${exp.endDate}`,
    period: `${exp.startDate} - ${exp.endDate}`,
    timePeriod: `${exp.startDate} - ${exp.endDate}`,
    
    // Responsibilities variations
    responsibilities: exp.responsibilities.map(r => ({ responsibility: r })),
    achievements: exp.responsibilities.map(r => ({ achievement: r })),
    tasks: exp.responsibilities.map(r => ({ task: r })),
    duties: exp.responsibilities.map(r => ({ duty: r })),
    accomplishments: exp.responsibilities.map(r => ({ accomplishment: r })),
    description: exp.responsibilities.join('. '),
    
    // Boolean flags
    hasResponsibilities: exp.responsibilities.length > 0,
    hasAchievements: exp.responsibilities.length > 0,
    hasTasks: exp.responsibilities.length > 0
  };
}

// Helper function for education data
function createEducationData(edu) {
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
    
    // GPA
    gpa: edu.gpa || '',
    grade: edu.gpa || '',
    
    // Boolean flags
    hasGPA: !!edu.gpa
  };
}

// Helper functions for other sections (add similar ones for projects, certifications, awards)
function createProjectData(proj) {
  return {
    title: proj.title,
    description: proj.description,
    technologies: proj.technologies?.join(', ') || '',
    techStack: proj.technologies?.join(', ') || '',
    link: proj.link || '',
    url: proj.link || ''
  };
}

function createCertificationData(cert) {
  return {
    name: cert.name,
    title: cert.name,
    issuer: cert.issuer,
    organization: cert.issuer,
    date: cert.date,
    issueDate: cert.date
  };
}

function createAwardData(award) {
  return {
    name: award.name,
    title: award.name,
    issuer: award.issuer,
    organization: award.issuer,
    date: award.date,
    year: award.date
  };
}
    
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
