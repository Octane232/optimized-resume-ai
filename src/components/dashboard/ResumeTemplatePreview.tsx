import React, { useEffect, useRef } from 'react';
import { ResumeData } from '@/types/resume';
import Mustache from 'mustache';

interface ResumeTemplatePreviewProps {
  resumeData: ResumeData;
  templateId: string;
  templates: any[];
}

// ===== HELPER FUNCTIONS MUST BE DEFINED FIRST =====
// Helper function for experience data
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
    
    // Date variations
    startDate: exp.startDate,
    endDate: exp.endDate,
    start: exp.startDate,
    end: exp.endDate,
    duration: `${exp.startDate} - ${exp.endDate}`,
    period: `${exp.startDate} - ${exp.endDate}`,
    timePeriod: `${exp.startDate} - ${exp.endDate}`,
    
    // Responsibilities variations
    responsibilities: exp.responsibilities.map((r: string) => ({ responsibility: r })),
    achievements: exp.responsibilities.map((r: string) => ({ achievement: r })),
    tasks: exp.responsibilities.map((r: string) => ({ task: r })),
    duties: exp.responsibilities.map((r: string) => ({ duty: r })),
    accomplishments: exp.responsibilities.map((r: string) => ({ accomplishment: r })),
    description: exp.responsibilities.join('. '),
    
    // Boolean flags
    hasResponsibilities: exp.responsibilities.length > 0,
    hasAchievements: exp.responsibilities.length > 0,
    hasTasks: exp.responsibilities.length > 0
  };
}

// Helper function for education data
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
    
    // GPA
    gpa: edu.gpa || '',
    grade: edu.gpa || '',
    
    // Boolean flags
    hasGPA: !!edu.gpa
  };
}

// Helper function for projects
function createProjectData(proj: any) {
  return {
    title: proj.title,
    description: proj.description,
    technologies: proj.technologies?.join(', ') || '',
    techStack: proj.technologies?.join(', ') || '',
    link: proj.link || '',
    url: proj.link || ''
  };
}

// Helper function for certifications
function createCertificationData(cert: any) {
  return {
    name: cert.name,
    title: cert.name,
    issuer: cert.issuer,
    organization: cert.issuer,
    date: cert.date,
    issueDate: cert.date
  };
}

// Helper function for awards
function createAwardData(award: any) {
  return {
    name: award.name,
    title: award.name,
    issuer: award.issuer,
    organization: award.issuer,
    date: award.date,
    year: award.date
  };
}

const ResumeTemplatePreview: React.FC<ResumeTemplatePreviewProps> = ({ 
  resumeData, 
  templateId,
  templates 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
  // ===== ADD DEBUG CODE HERE =====
  console.log('=== DEBUG: ResumeTemplatePreview ===');
  console.log('Template ID:', templateId);
  console.log('Resume Data:', resumeData);
  console.log('Experience array:', resumeData.experience);
  console.log('Experience length:', resumeData.experience.length);
  if (resumeData.experience.length > 0) {
    console.log('First experience item:', resumeData.experience[0]);
  }
  
  const template = templates.find(t => t.id === templateId);
  console.log('Selected template:', template);
  console.log('Template HTML contains "experience":', template?.html_content?.includes('experience'));
  console.log('Template HTML contains "workExperience":', template?.html_content?.includes('workExperience'));
  console.log('==================================');
  // ===== END DEBUG CODE =====

  if (!iframeRef.current || !templateId) return;

  // ... the rest of your existing code continues here
  let templateHTML = '';
  if (template?.html_content) {
    templateHTML = template.html_content;
  } else {
    templateHTML = getDefaultTemplate();
  }
  // ... etc
}, [resumeData, templateId, templates]);

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
      experience: resumeData.experience.map(createExperienceData),
      hasExperience: resumeData.experience.length > 0,
      
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
      hasProjects: (resumeData.projects?.length || 0) > 0,
      
      personalProjects: resumeData.projects?.map(createProjectData) || [],
      hasPersonalProjects: (resumeData.projects?.length || 0) > 0,
      
      portfolioProjects: resumeData.projects?.map(createProjectData) || [],
      hasPortfolioProjects: (resumeData.projects?.length || 0) > 0,
      
      // ===== CERTIFICATIONS =====
      certifications: resumeData.certifications?.map(createCertificationData) || [],
      hasCertifications: (resumeData.certifications?.length || 0) > 0,
      
      certificates: resumeData.certifications?.map(createCertificationData) || [],
      hasCertificates: (resumeData.certifications?.length || 0) > 0,
      
      // ===== AWARDS =====
      awards: resumeData.awards?.map(createAwardData) || [],
      hasAwards: (resumeData.awards?.length || 0) > 0,
      
      honors: resumeData.awards?.map(createAwardData) || [],
      hasHonors: (resumeData.awards?.length || 0) > 0,
      
      achievements: resumeData.awards?.map(createAwardData) || [],
      hasAchievements: (resumeData.awards?.length || 0) > 0,
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
  }, [resumeData, templateId, templates];

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
          <p>{{institution}} | {{date}}</p>
          {{#gpa}}<p>GPA: {{gpa}}</p>{{/gpa}}
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
