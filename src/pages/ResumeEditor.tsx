import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Download, Share2, Plus, X, FileText, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ResumeData } from '@/types/resume';
import html2pdf from 'html2pdf.js';

// Create a simple preview component since we can't import the original
const ResumeTemplatePreview: React.FC<{ resumeData: ResumeData; templateId: string; templates: any[] }> = ({ 
  resumeData, 
  templateId,
  templates 
}) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    if (!iframeRef.current) return;

    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    let templateHTML = template.html_content || `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
        <h1>{{name}}</h1>
        <h2>{{title}}</h2>
        <p>{{email}} | {{phone}} | {{location}}</p>
        
        <h3>Summary</h3>
        <p>{{summary}}</p>
        
        <h3>Experience</h3>
        {{#experience}}
        <div>
          <h4>{{title}} at {{company}}</h4>
          <p>{{startDate}} - {{endDate}}</p>
          <ul>
            {{#responsibilities}}<li>{{.}}</li>{{/responsibilities}}
          </ul>
        </div>
        {{/experience}}
        
        <h3>Education</h3>
        {{#education}}
        <div>
          <h4>{{degree}}</h4>
          <p>{{institution}} | {{startYear}} - {{endYear}}</p>
        </div>
        {{/education}}
        
        <h3>Projects</h3>
        {{#projects}}
        <div>
          <h4>{{title}}</h4>
          <p>{{description}}</p>
          <p>Technologies: {{technologies}}</p>
          {{#link}}<p>Link: {{link}}</p>{{/link}}
        </div>
        {{/projects}}
        
        <h3>Skills</h3>
        <p>{{#skills}}{{.}}, {{/skills}}</p>
      </div>
    `;

    // Prepare data for template
    const templateData = {
      name: resumeData.contact.name,
      title: resumeData.contact.title,
      email: resumeData.contact.email,
      phone: resumeData.contact.phone,
      location: resumeData.contact.location,
      summary: resumeData.summary,
      experience: resumeData.experience,
      education: resumeData.education,
      projects: resumeData.projects,
      skills: resumeData.skills,
    };

    // Simple template rendering (replace placeholders)
    let renderedHTML = templateHTML;
    Object.entries(templateData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (key === 'experience' || key === 'education' || key === 'projects') {
          let itemsHTML = '';
          value.forEach(item => {
            let itemHTML = `<div style="margin-bottom: 20px;">`;
            Object.entries(item).forEach(([itemKey, itemValue]) => {
              if (Array.isArray(itemValue)) {
                if (itemKey === 'responsibilities') {
                  itemHTML += `<ul>${itemValue.map(v => `<li>${v}</li>`).join('')}</ul>`;
                } else if (itemKey === 'technologies') {
                  itemHTML += `<p><strong>Technologies:</strong> ${itemValue.join(', ')}</p>`;
                }
              } else if (itemValue) {
                if (itemKey === 'title') {
                  itemHTML += `<h4 style="margin-bottom: 5px;">${itemValue}</h4>`;
                } else if (itemKey === 'description') {
                  itemHTML += `<p style="margin-bottom: 8px;">${itemValue}</p>`;
                } else if (itemKey === 'link') {
                  itemHTML += `<p><strong>Link:</strong> <a href="${itemValue}" target="_blank">${itemValue}</a></p>`;
                } else if (itemKey === 'company' || itemKey === 'institution') {
                  itemHTML += `<p style="font-style: italic; margin-bottom: 5px;">${itemValue}</p>`;
                } else if (itemKey === 'startDate' && itemValue && item[itemKey.replace('start', 'end')]) {
                  itemHTML += `<p style="color: #666; margin-bottom: 8px;">${itemValue} - ${item[itemKey.replace('start', 'end')]}</p>`;
                } else if (itemKey === 'startYear' && itemValue && item[itemKey.replace('start', 'end')]) {
                  itemHTML += `<p style="color: #666; margin-bottom: 8px;">${itemValue} - ${item[itemKey.replace('start', 'end')]}</p>`;
                }
              }
            });
            itemHTML += `</div>`;
            itemsHTML += itemHTML;
          });
          renderedHTML = renderedHTML.replace(`{{#${key}}}`, itemsHTML);
        } else if (key === 'skills') {
          renderedHTML = renderedHTML.replace('{{#skills}}', value.join(', '));
        }
      } else {
        renderedHTML = renderedHTML.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
      }
    });

    // Clean up any remaining template tags
    renderedHTML = renderedHTML.replace(/\{\{.*?\}\}/g, '');

    const fullHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; }
          ul { padding-left: 20px; }
          li { margin-bottom: 4px; }
          a { color: #2563eb; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>${renderedHTML}</body>
      </html>
    `;

    const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(fullHTML);
      iframeDoc.close();
    }
  }, [resumeData, templateId, templates]);

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

const ResumeEditor: React.FC = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resumeData, setResumeData] = useState<ResumeData>({
    contact: {
      name: 'John Doe',
      title: 'Senior Software Engineer',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      portfolio: 'johndoe.dev',
      github: 'github.com/johndoe',
    },
    summary: 'Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Passionate about building scalable applications and mentoring junior developers.',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'GraphQL', 'CI/CD'],
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Company Inc.',
        startDate: '2020',
        endDate: 'Present',
        responsibilities: [
          'Led development of microservices architecture serving 1M+ users',
          'Mentored team of 5 junior developers',
          'Reduced API response time by 40% through optimization'
        ],
      },
      {
        title: 'Software Engineer',
        company: 'StartUp Co.',
        startDate: '2017',
        endDate: '2020',
        responsibilities: [
          'Built real-time data processing pipeline using Node.js and Redis',
          'Implemented CI/CD pipeline reducing deployment time by 60%',
          'Developed RESTful APIs serving mobile and web clients'
        ],
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of California, Berkeley',
        startYear: '2012',
        endYear: '2016',
      }
    ],
    projects: [
      {
        title: 'Open Source Contribution',
        description: 'Major contributor to popular React library with 10k+ stars',
        technologies: ['React', 'TypeScript', 'Jest'],
        link: 'github.com/project'
      }
    ],
    certifications: [],
    languages: [],
    awards: [],
  });

  const [newSkill, setNewSkill] = useState('');

  // Load templates and set initial template
  useEffect(() => {
    const templateId = searchParams.get('template');
    loadTemplates(templateId);
    if (resumeId && resumeId !== 'new') {
      loadResume();
    } else {
      setLoading(false);
    }
  }, [resumeId, searchParams]);

  const loadTemplates = async (templateIdFromUrl?: string | null) => {
    try {
      // For demo purposes, create some basic templates
      const demo_templates = [
        {
          id: 'template1',
          name: 'Professional',
          html_content: `
            <div style="font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
              <h1 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">{{name}}</h1>
              <h2 style="color: #7f8c8d; margin-top: 5px;">{{title}}</h2>
              
              <div style="margin: 20px 0;">
                <p>{{email}} | {{phone}} | {{location}}</p>
                {{#linkedin}}<p>LinkedIn: {{linkedin}}</p>{{/linkedin}}
                {{#github}}<p>GitHub: {{github}}</p>{{/github}}
              </div>
              
              <h3 style="color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px;">PROFESSIONAL SUMMARY</h3>
              <p>{{summary}}</p>
              
              <h3 style="color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px;">EXPERIENCE</h3>
              {{#experience}}
              <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 5px;">{{title}} - {{company}}</h4>
                <p style="color: #7f8c8d; font-style: italic;">{{startDate}} - {{endDate}}</p>
                <ul>
                  {{#responsibilities}}<li>{{.}}</li>{{/responsibilities}}
                </ul>
              </div>
              {{/experience}}
              
              <h3 style="color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px;">PROJECTS</h3>
              {{#projects}}
              <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 5px;">{{title}}</h4>
                <p style="margin-bottom: 8px;">{{description}}</p>
                <p style="color: #7f8c8d;"><strong>Technologies:</strong> {{#technologies}}{{.}}, {{/technologies}}</p>
                {{#link}}<p style="color: #7f8c8d;"><strong>Link:</strong> <a href="{{link}}" target="_blank">{{link}}</a></p>{{/link}}
              </div>
              {{/projects}}
              
              <h3 style="color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px;">EDUCATION</h3>
              {{#education}}
              <div style="margin-bottom: 15px;">
                <h4 style="margin-bottom: 5px;">{{degree}}</h4>
                <p style="color: #7f8c8d;">{{institution}}, {{startYear}} - {{endYear}}</p>
              </div>
              {{/education}}
              
              <h3 style="color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px;">SKILLS</h3>
              <p>{{#skills}}{{.}}, {{/skills}}</p>
            </div>
          `
        },
        {
          id: 'template2', 
          name: 'Modern',
          html_content: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; max-width: 800px; margin: 0 auto; background: linear-gradient(to right, #f8f9fa, #ffffff);">
              <div style="background: #2c3e50; color: white; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 2.5em;">{{name}}</h1>
                <h2 style="margin: 5px 0 0 0; font-weight: 300; color: #ecf0f1;">{{title}}</h2>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                <div>
                  <h3 style="color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px;">CONTACT</h3>
                  <p>📧 {{email}}</p>
                  <p>📱 {{phone}}</p>
                  <p>📍 {{location}}</p>
                  {{#linkedin}}<p>🔗 {{linkedin}}</p>{{/linkedin}}
                  
                  <h3 style="color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px; margin-top: 30px;">SKILLS</h3>
                  <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px;">
                    {{#skills}}<span style="background: #e8f4f8; color: #2c3e50; padding: 5px 10px; border-radius: 15px; font-size: 0.9em;">{{.}}</span>{{/skills}}
                  </div>
                </div>
                
                <div>
                  <h3 style="color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px;">SUMMARY</h3>
                  <p>{{summary}}</p>
                  
                  <h3 style="color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px; margin-top: 30px;">EXPERIENCE</h3>
                  {{#experience}}
                  <div style="margin-bottom: 20px;">
                    <h4 style="margin-bottom: 5px; color: #2c3e50;">{{title}}</h4>
                    <p style="color: #7f8c8d; margin: 0;">{{company}} | {{startDate}} - {{endDate}}</p>
                    <ul style="margin-top: 8px;">
                      {{#responsibilities}}<li>{{.}}</li>{{/responsibilities}}
                    </ul>
                  </div>
                  {{/experience}}
                  
                  <h3 style="color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px; margin-top: 30px;">PROJECTS</h3>
                  {{#projects}}
                  <div style="margin-bottom: 20px;">
                    <h4 style="margin-bottom: 5px; color: #2c3e50;">{{title}}</h4>
                    <p style="margin-bottom: 8px;">{{description}}</p>
                    <p style="color: #7f8c8d; margin: 0;"><strong>Technologies:</strong> {{#technologies}}{{.}}, {{/technologies}}</p>
                    {{#link}}<p style="color: #7f8c8d; margin: 0;"><strong>Link:</strong> <a href="{{link}}" target="_blank">{{link}}</a></p>{{/link}}
                  </div>
                  {{/projects}}
                  
                  <h3 style="color: #2c3e50; border-left: 4px solid #3498db; padding-left: 10px; margin-top: 30px;">EDUCATION</h3>
                  {{#education}}
                  <div style="margin-bottom: 15px;">
                    <h4 style="margin-bottom: 5px; color: #2c3e50;">{{degree}}</h4>
                    <p style="color: #7f8c8d; margin: 0;">{{institution}} | {{startYear}} - {{endYear}}</p>
                  </div>
                  {{/education}}
                </div>
              </div>
            </div>
          `
        }
      ];
      
      setTemplates(demo_templates);
      
      // Set initial template based on URL parameter or first available template
      if (templateIdFromUrl && demo_templates.find(t => t.id === templateIdFromUrl)) {
        setSelectedTemplate(templateIdFromUrl);
      } else if (demo_templates.length > 0) {
        setSelectedTemplate(demo_templates[0].id);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadResume = async () => {
    try {
      // For demo purposes, just set some sample data
      const sampleData = {
        contact: {
          name: 'Jane Smith',
          title: 'Frontend Developer',
          email: 'jane.smith@example.com',
          phone: '(555) 987-6543',
          location: 'New York, NY',
          linkedin: 'linkedin.com/in/janesmith',
          portfolio: 'janesmith.dev',
          github: 'github.com/janesmith',
        },
        summary: 'Creative frontend developer with 5+ years of experience building responsive web applications. Specialized in React and modern JavaScript frameworks.',
        skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Redux', 'GraphQL'],
        experience: [
          {
            title: 'Frontend Developer',
            company: 'Digital Solutions Inc.',
            startDate: '2019',
            endDate: 'Present',
            responsibilities: [
              'Developed responsive web applications using React',
              'Collaborated with UX designers to implement user interfaces',
              'Optimized application performance for better user experience'
            ],
          }
        ],
        education: [
          {
            degree: 'Bachelor of Computer Science',
            institution: 'New York University',
            startYear: '2015',
            endYear: '2019',
          }
        ],
        projects: [
          {
            title: 'E-commerce Platform',
            description: 'Built a full-featured e-commerce platform with shopping cart, user authentication, and payment processing',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
            link: 'example-ecommerce.com'
          }
        ],
        certifications: [],
        languages: [],
        awards: [],
      };
      
      setResumeData(sampleData);
    } catch (error) {
      console.error('Error loading resume:', error);
      toast({
        title: "Error",
        description: "Failed to load resume",
        variant: "destructive"
      });
    }
  };

  const updateContact = (field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        responsibilities: [],
      }]
    }));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setResumeData(prev => {
      const newExp = [...prev.experience];
      newExp[index] = { ...newExp[index], [field]: value };
      return { ...prev, experience: newExp };
    });
  };

  const removeExperience = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        degree: '',
        institution: '',
        startYear: '',
        endYear: '',
      }]
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setResumeData(prev => {
      const newEdu = [...prev.education];
      newEdu[index] = { ...newEdu[index], [field]: value };
      return { ...prev, education: newEdu };
    });
  };

  const removeEducation = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        title: '',
        description: '',
        technologies: [],
        link: ''
      }]
    }));
  };

  const updateProject = (index: number, field: string, value: any) => {
    setResumeData(prev => {
      const newProjects = [...prev.projects];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return { ...prev, projects: newProjects };
    });
  };

  const removeProject = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const saveResume = async () => {
    setSaving(true);
    
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: resumeId && resumeId !== 'new' ? 'Resume updated successfully' : 'Resume saved successfully',
      });
      
      if (resumeId === 'new') {
        // Navigate to a new ID in a real app
        navigate('/editor/sample-id');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save resume',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const exportPDF = () => {
    toast({
      title: 'Export PDF',
      description: 'PDF export would be implemented with a proper library',
    });
  };

  const formContent = (
    <div className="space-y-6 p-6">
      {/* Personal Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={resumeData.contact.name}
                onChange={(e) => updateContact('name', e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={resumeData.contact.title}
                onChange={(e) => updateContact('title', e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={resumeData.contact.email}
                onChange={(e) => updateContact('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={resumeData.contact.phone}
                onChange={(e) => updateContact('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={resumeData.contact.location}
                onChange={(e) => updateContact('location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={resumeData.contact.linkedin}
                onChange={(e) => updateContact('linkedin', e.target.value)}
                placeholder="linkedin.com/in/johnsmith"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={resumeData.summary}
            onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
            placeholder="Write a brief summary of your professional background and career objectives..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Work Experience</span>
            <Button onClick={addExperience} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Experience
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumeData.experience.map((exp, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-end">
                <Button
                  onClick={() => removeExperience(index)}
                  size="sm"
                  variant="ghost"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                />
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                />
                <Input
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                />
                <Input
                  placeholder="End Date (or Present)"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                />
              </div>
              <Textarea
                placeholder="Describe your responsibilities and achievements (one per line)..."
                value={exp.responsibilities.join('\n')}
                onChange={(e) => updateExperience(index, 'responsibilities', e.target.value.split('\n').filter(line => line.trim()))}
                rows={3}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Education</span>
            <Button onClick={addEducation} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Education
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumeData.education.map((edu, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-end">
                <Button
                  onClick={() => removeEducation(index)}
                  size="sm"
                  variant="ghost"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                />
                <Input
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                />
                <Input
                  placeholder="Start Year"
                  value={edu.startYear}
                  onChange={(e) => updateEducation(index, 'startYear', e.target.value)}
                />
                <Input
                  placeholder="End Year"
                  value={edu.endYear}
                  onChange={(e) => updateEducation(index, 'endYear', e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Projects</span>
            <Button onClick={addProject} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Project
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumeData.projects.map((project, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-end">
                <Button
                  onClick={() => removeProject(index)}
                  size="sm"
                  variant="ghost"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Project Title</Label>
                  <Input
                    placeholder="Project Title"
                    value={project.title}
                    onChange={(e) => updateProject(index, 'title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Technologies (comma-separated)</Label>
                  <Input
                    placeholder="React, TypeScript, Node.js"
                    value={project.technologies.join(', ')}
                    onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Project Link</Label>
                  <Input
                    placeholder="https://github.com/username/project"
                    value={project.link}
                    onChange={(e) => updateProject(index, 'link', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Project Description</Label>
                <Textarea
                  placeholder="Describe the project, your role, and key achievements..."
                  value={project.description}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill} variant="outline">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full flex items-center gap-2"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(index)}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/dashboard')} variant="ghost">
                ← Back
              </Button>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select template" />
