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

      // Process template with sample data (simple replacement for preview)
      let processedHtml = template.html_content;
      
      // Replace simple placeholders
      Object.entries(sampleData).forEach(([key, value]) => {
        if (typeof value === 'string') {
          const regex = new RegExp(`{{${key}}}`, 'g');
          processedHtml = processedHtml.replace(regex, value);
        }
      });

      // Handle arrays (simple version for preview)
      processedHtml = processedHtml.replace(/{{#experiences}}[\s\S]*?{{\/experiences}}/g, (match) => {
        let result = '';
        sampleData.experiences.forEach(exp => {
          let expBlock = match
            .replace('{{#experiences}}', '')
            .replace('{{/experiences}}', '');
          
          Object.entries(exp).forEach(([key, value]) => {
            if (typeof value === 'string') {
              expBlock = expBlock.replace(new RegExp(`{{${key}}}`, 'g'), value);
            } else if (Array.isArray(value) && key === 'achievements') {
              expBlock = expBlock.replace(/{{#achievements}}[\s\S]*?{{\/achievements}}/g, (achMatch) => {
                return value.map(ach => 
                  achMatch
                    .replace('{{#achievements}}', '')
                    .replace('{{/achievements}}', '')
                    .replace('{{.}}', ach)
                ).join('');
              });
            }
          });
          result += expBlock;
        });
        return result;
      });

      // Handle education
      processedHtml = processedHtml.replace(/{{#education}}[\s\S]*?{{\/education}}/g, (match) => {
        let result = '';
        sampleData.education.forEach(edu => {
          let eduBlock = match
            .replace('{{#education}}', '')
            .replace('{{/education}}', '');
          
          Object.entries(edu).forEach(([key, value]) => {
            eduBlock = eduBlock.replace(new RegExp(`{{${key}}}`, 'g'), value);
          });
          result += eduBlock;
        });
        return result;
      });

      // Handle skills
      processedHtml = processedHtml.replace(/{{#skills}}[\s\S]*?{{\/skills}}/g, (match) => {
        return sampleData.skills.map(skill => 
          match
            .replace('{{#skills}}', '')
            .replace('{{/skills}}', '')
            .replace('{{.}}', skill)
        ).join('');
      });

      // Handle projects
      processedHtml = processedHtml.replace(/{{#projects}}[\s\S]*?{{\/projects}}/g, (match) => {
        let result = '';
        sampleData.projects.forEach(project => {
          let projBlock = match
            .replace('{{#projects}}', '')
            .replace('{{/projects}}', '');
          
          Object.entries(project).forEach(([key, value]) => {
            projBlock = projBlock.replace(new RegExp(`{{${key}}}`, 'g'), value);
          });
          result += projBlock;
        });
        return result;
      });

      // Handle portfolio section
      processedHtml = processedHtml.replace(/{{#portfolio}}[\s\S]*?{{\/portfolio}}/g, (match) => {
        return match
          .replace('{{#portfolio}}', '')
          .replace('{{/portfolio}}', '')
          .replace('{{portfolioDescription}}', sampleData.portfolioDescription)
          .replace('{{portfolioUrl}}', sampleData.portfolioUrl);
      });

      // Write to iframe
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(processedHtml);
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