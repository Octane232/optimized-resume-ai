import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, Eye } from 'lucide-react';

interface TemplatePreviewProps {
  template: {
    name: string;
    html_content: string;
    category: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate?: () => void;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ 
  template, 
  isOpen, 
  onClose,
  onUseTemplate 
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (template && iframeRef.current) {
      console.log('Template HTML content:', template.html_content);
      
      // Sample data for preview
      const sampleData = {
        fullName: 'John Smith',
        title: 'Senior Software Engineer',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/johnsmith',
        github: 'github.com/johnsmith',
        portfolio: 'johnsmith.dev',
        summary: 'Experienced software engineer with 8+ years developing scalable web applications. Passionate about clean code, system architecture, and mentoring junior developers. Proven track record of leading teams and delivering high-quality software solutions.',
        experiences: [
          {
            position: 'Senior Software Engineer',
            company: 'TechCorp Inc',
            location: 'San Francisco, CA',
            startDate: 'Jan 2020',
            endDate: 'Present',
            achievements: [
              'Led development of microservices architecture serving 2M+ users',
              'Reduced API response time by 60% through optimization',
              'Mentored team of 5 junior developers'
            ]
          },
          {
            position: 'Software Engineer',
            company: 'StartupXYZ',
            location: 'Mountain View, CA',
            startDate: 'Jun 2018',
            endDate: 'Dec 2019',
            achievements: [
              'Built real-time collaboration features using WebSockets',
              'Implemented CI/CD pipeline reducing deployment time by 70%',
              'Developed RESTful APIs serving mobile and web clients'
            ]
          }
        ],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of California, Berkeley',
            graduationDate: '2016'
          }
        ],
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'GraphQL', 'Redis'],
        programmingLanguages: 'JavaScript, TypeScript, Python, Go, Java',
        frameworks: 'React, Next.js, Express, Django, Spring Boot',
        tools: 'Git, Docker, Kubernetes, Jenkins, AWS, GCP',
        databases: 'PostgreSQL, MongoDB, Redis, Elasticsearch',
        projects: [
          {
            name: 'E-commerce Platform',
            technologies: 'React, Node.js, PostgreSQL, Redis',
            description: 'Built a scalable e-commerce platform handling 100K+ daily transactions with real-time inventory management'
          },
          {
            name: 'Real-time Analytics Dashboard',
            technologies: 'React, WebSockets, D3.js, ElasticSearch',
            description: 'Developed analytics dashboard providing real-time insights for business metrics with sub-second latency'
          }
        ],
        portfolioDescription: 'Check out my latest projects including open-source contributions and personal experiments',
        portfolioUrl: 'https://johnsmith.dev'
      };

      // Check if template.html_content is a complete HTML document or just a fragment
      const isCompleteHTML = template.html_content?.includes('<!DOCTYPE') || template.html_content?.includes('<html');
      
      let finalHTML = '';
      
      if (isCompleteHTML) {
        // If it's complete HTML, just replace the placeholders
        finalHTML = template.html_content || '';
        
        // Replace simple placeholders
        Object.entries(sampleData).forEach(([key, value]) => {
          if (typeof value === 'string') {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            finalHTML = finalHTML.replace(regex, value);
          }
        });

        // Handle arrays (experiences, education, skills, projects)
        // Handle experiences array
        finalHTML = finalHTML.replace(/{{#experiences}}[\s\S]*?{{\/experiences}}/g, (match) => {
          let result = '';
          sampleData.experiences.forEach(exp => {
            let expBlock = match
              .replace(/{{#experiences}}/g, '')
              .replace(/{{\/experiences}}/g, '');
            
            Object.entries(exp).forEach(([key, value]) => {
              if (typeof value === 'string') {
                expBlock = expBlock.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
              } else if (Array.isArray(value) && key === 'achievements') {
                expBlock = expBlock.replace(/{{#achievements}}[\s\S]*?{{\/achievements}}/g, (achMatch) => {
                  return value.map(ach => 
                    achMatch
                      .replace(/{{#achievements}}/g, '')
                      .replace(/{{\/achievements}}/g, '')
                      .replace(/{{\.}}/g, ach)
                  ).join('');
                });
              }
            });
            result += expBlock;
          });
          return result;
        });

        // Handle education array
        finalHTML = finalHTML.replace(/{{#education}}[\s\S]*?{{\/education}}/g, (match) => {
          let result = '';
          sampleData.education.forEach(edu => {
            let eduBlock = match
              .replace(/{{#education}}/g, '')
              .replace(/{{\/education}}/g, '');
            
            Object.entries(edu).forEach(([key, value]) => {
              eduBlock = eduBlock.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
            });
            result += eduBlock;
          });
          return result;
        });

        // Handle skills array
        finalHTML = finalHTML.replace(/{{#skills}}[\s\S]*?{{\/skills}}/g, (match) => {
          return sampleData.skills.map(skill => 
            match
              .replace(/{{#skills}}/g, '')
              .replace(/{{\/skills}}/g, '')
              .replace(/{{\.}}/g, skill)
          ).join('');
        });

        // Handle projects array
        finalHTML = finalHTML.replace(/{{#projects}}[\s\S]*?{{\/projects}}/g, (match) => {
          let result = '';
          sampleData.projects.forEach(project => {
            let projBlock = match
              .replace(/{{#projects}}/g, '')
              .replace(/{{\/projects}}/g, '');
            
            Object.entries(project).forEach(([key, value]) => {
              projBlock = projBlock.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
            });
            result += projBlock;
          });
          return result;
        });

        // Clean up any remaining placeholders
        finalHTML = finalHTML.replace(/{{[^}]*}}/g, '');
      } else {
        // If it's just a fragment, wrap it in a complete HTML document
        console.log('Template is a fragment, wrapping in complete HTML');
        
        // Process the fragment first
        let processedFragment = template.html_content || '';
        
        // Replace placeholders (same as above but for fragment)
        Object.entries(sampleData).forEach(([key, value]) => {
          if (typeof value === 'string') {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            processedFragment = processedFragment.replace(regex, value);
          }
        });
        
        // Clean up any remaining placeholders for now
        processedFragment = processedFragment.replace(/{{#\w+}}[\s\S]*?{{\/\w+}}/g, '');
        processedFragment = processedFragment.replace(/{{[^}]*}}/g, '');
        
        // Wrap in complete HTML
        finalHTML = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Resume Preview</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                background: white;
                color: #1a1a1a;
                line-height: 1.6;
                padding: 20px;
              }
            </style>
          </head>
          <body>
            ${processedFragment}
          </body>
          </html>
        `;
      }

      console.log('Final HTML to render:', finalHTML.substring(0, 500) + '...');

      // Write to iframe
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(finalHTML);
        iframeDoc.close();
      }
    }
  }, [template]);

  if (!template) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {template.name} - Preview
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const iframe = iframeRef.current;
                  if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.print();
                  }
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onUseTemplate?.();
                  onClose();
                }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Use This Template
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex-1 bg-slate-100 dark:bg-slate-900 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
            <iframe
              ref={iframeRef}
              className="w-full h-[1200px] border-0 rounded-lg"
              title="Template Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreview;