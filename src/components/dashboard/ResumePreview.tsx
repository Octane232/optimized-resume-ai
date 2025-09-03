import React, { useEffect, useRef } from 'react';

interface TemplatePreviewProps {
  template: {
    html_content?: string;
  } | null;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!template || !template.html_content || !iframeRef.current) {
      console.log("Missing data for preview:", {
        hasTemplate: !!template,
        hasHtmlContent: !!template?.html_content,
        hasIframe: !!iframeRef.current,
      });
      return;
    }

    // Sample data for placeholders
    const sampleData = {
      fullName: 'John Smith',
      title: 'Software Engineer',
      email: 'john@example.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/john',
      github: 'github.com/john',
      portfolio: 'johnsmith.dev',
      summary: 'Experienced software engineer with expertise in web development.',
      programmingLanguages: 'JavaScript, Python',
      frameworks: 'React, Node.js',
      tools: 'Git, Docker',
      databases: 'PostgreSQL, MongoDB',
      experiences: [
        {
          position: 'Frontend Developer',
          company: 'Tech Corp',
          location: 'NY',
          startDate: '2020',
          endDate: '2023',
          achievements: ['Built scalable UI', 'Improved performance'],
        },
      ],
      education: [
        {
          degree: 'BSc Computer Science',
          institution: 'MIT',
          graduationDate: '2019',
        },
      ],
      skills: ['Problem Solving', 'Teamwork'],
      projects: [
        {
          name: 'Portfolio Website',
          technologies: 'React, Tailwind',
          description: 'Personal portfolio showcasing projects.',
        },
      ],
    };

    let finalHTML = template.html_content;

    // Replace placeholders (simple values)
    Object.entries(sampleData).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        finalHTML = finalHTML.replace(regex, value);
      }
    });

    // Handle experiences array
    finalHTML = finalHTML.replace(/{{#experiences}}[\s\S]*?{{\/experiences}}/g, (match) => {
      return sampleData.experiences
        .map((exp) => {
          let expBlock = match.replace(/{{#experiences}}|{{\/experiences}}/g, '');
          Object.entries(exp).forEach(([key, value]) => {
            if (typeof value === 'string') {
              expBlock = expBlock.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
            } else if (Array.isArray(value) && key === 'achievements') {
              expBlock = expBlock.replace(/{{#achievements}}[\s\S]*?{{\/achievements}}/g, (achMatch) =>
                value
                  .map((ach) =>
                    achMatch.replace(/{{#achievements}}|{{\/achievements}}/g, '').replace(/{{\.}}/g, ach)
                  )
                  .join('')
              );
            }
          });
          return expBlock;
        })
        .join('');
    });

    // Handle education array
    finalHTML = finalHTML.replace(/{{#education}}[\s\S]*?{{\/education}}/g, (match) => {
      return sampleData.education
        .map((edu) => {
          let eduBlock = match.replace(/{{#education}}|{{\/education}}/g, '');
          Object.entries(edu).forEach(([key, value]) => {
            eduBlock = eduBlock.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
          });
          return eduBlock;
        })
        .join('');
    });

    // Handle skills array
    finalHTML = finalHTML.replace(/{{#skills}}[\s\S]*?{{\/skills}}/g, (match) => {
      return sampleData.skills
        .map((skill) => match.replace(/{{#skills}}|{{\/skills}}/g, '').replace(/{{\.}}/g, skill))
        .join('');
    });

    // Handle projects array
    finalHTML = finalHTML.replace(/{{#projects}}[\s\S]*?{{\/projects}}/g, (match) => {
      return sampleData.projects
        .map((proj) => {
          let projBlock = match.replace(/{{#projects}}|{{\/projects}}/g, '');
          Object.entries(proj).forEach(([key, value]) => {
            projBlock = projBlock.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
          });
          return projBlock;
        })
        .join('');
    });

    // Remove any leftover {{placeholders}}
    finalHTML = finalHTML.replace(/{{[^}]+}}/g, '');

    // Write final HTML to iframe
    try {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (!iframeDoc) {
        console.error('❌ Could not access iframe document');
        return;
      }
      iframeDoc.open();
      iframeDoc.write(finalHTML);
      iframeDoc.close();
      console.log('✅ Template rendered successfully');
    } catch (err) {
      console.error('❌ Error writing to iframe:', err);
    }
  }, [template]);

  if (!template) return null;

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-[600px] border rounded"
      title="Template Preview"
    />
  );
};

export default TemplatePreview;
