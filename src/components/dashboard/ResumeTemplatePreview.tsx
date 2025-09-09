import React, { useEffect, useRef } from 'react';
import { ResumeData } from '@/types/resume';
import Mustache from 'mustache';

interface ResumeTemplatePreviewProps {
  resumeData: ResumeData;
  templateId: string;
  templates: any[];
}

// ===== Helper functions =====
function createExperienceData(exp: any) {
  return {
    title: exp.title,
    jobTitle: exp.title,
    position: exp.title,
    role: exp.title,
    company: exp.company,
    employer: exp.company,
    companyName: exp.company,
    organization: exp.company,
    startDate: exp.startDate,
    endDate: exp.endDate,
    duration: `${exp.startDate} - ${exp.endDate}`,
    responsibilities: exp.responsibilities.map((r: string) => ({ responsibility: r })),
    description: exp.responsibilities.join('. '),
    hasResponsibilities: exp.responsibilities.length > 0,
  };
}

function createEducationData(edu: any) {
  return {
    degree: edu.degree,
    institution: edu.institution,
    date: edu.startYear && edu.endYear ? `${edu.startYear} - ${edu.endYear}` : edu.startYear || edu.endYear || '',
    gpa: edu.gpa || '',
    hasGPA: !!edu.gpa,
  };
}

function createProjectData(proj: any) {
  return {
    title: proj.title,
    description: proj.description,
    technologies: proj.technologies?.join(', ') || '',
    link: proj.link || '',
  };
}

function createCertificationData(cert: any) {
  return {
    name: cert.name,
    issuer: cert.issuer,
    date: cert.date,
  };
}

function createAwardData(award: any) {
  return {
    name: award.name,
    issuer: award.issuer,
    date: award.date,
  };
}

// ===== Component =====
const ResumeTemplatePreview: React.FC<ResumeTemplatePreviewProps> = ({ resumeData, templateId, templates }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current || !templateId) return;

    const template = templates.find(t => t.id === templateId);
    let templateHTML = template?.html_content || getDefaultTemplate();

    // ✅ mustacheData lives here (inside effect)
    const mustacheData = {
      name: resumeData.contact.name || 'Your Name',
      title: resumeData.contact.title || 'Professional Title',
      email: resumeData.contact.email || 'email@example.com',
      phone: resumeData.contact.phone || '(555) 123-4567',
      location: resumeData.contact.location || 'City, State',
      summary: resumeData.summary || 'Professional summary goes here...',
      skills: resumeData.skills,
      hasSkills: resumeData.skills.length > 0,
      experience: resumeData.experience.map(createExperienceData),
      hasExperience: resumeData.experience.length > 0,
      education: resumeData.education.map(createEducationData),
      hasEducation: resumeData.education.length > 0,
      projects: resumeData.projects?.map(createProjectData) || [],
      hasProjects: resumeData.projects?.length > 0,
      certifications: resumeData.certifications?.map(createCertificationData) || [],
      hasCertifications: resumeData.certifications?.length > 0,
      awards: resumeData.awards?.map(createAwardData) || [],
      hasAwards: resumeData.awards?.length > 0,
    };

    const finalHTML = Mustache.render(templateHTML, mustacheData);

    const fullHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: sans-serif; background: white; padding: 20px; color: #333; }
          .resume-container { max-width: 800px; margin: 0 auto; }
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

  const getDefaultTemplate = () => `
    <div class="header">
      <h1>{{name}}</h1>
      <p>{{title}}</p>
      <p>{{email}} | {{phone}} | {{location}}</p>
    </div>
    {{#hasSkills}}
    <h2>Skills</h2>
    <ul>{{#skills}}<li>{{.}}</li>{{/skills}}</ul>
    {{/hasSkills}}
    {{#hasExperience}}
    <h2>Experience</h2>
    {{#experience}}
      <div><strong>{{title}}</strong> - {{company}} ({{duration}})</div>
      {{#hasResponsibilities}}
      <ul>{{#responsibilities}}<li>{{responsibility}}</li>{{/responsibilities}}</ul>
      {{/hasResponsibilities}}
    {{/experience}}
    {{/hasExperience}}
  `;

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
