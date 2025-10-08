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
import ResumeTemplatePreview from '@/components/dashboard/ResumeTemplatePreview';
import html2pdf from 'html2pdf.js';

const ResumeEditor: React.FC = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templates, setTemplates] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resumeTitle, setResumeTitle] = useState('My Resume');
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
        gpa: '3.8',
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
    }
  }, [resumeId, searchParams]);

  const loadTemplates = async (templateIdFromUrl?: string | null) => {
    try {
      const { data, error } = await supabase
        .from('resume_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
        if (data && data.length > 0) {
          setTemplates(data);

          const usable = data.filter((t: any) => t.json_content);
          const getFallbackId = () => (usable[0]?.id || data[0].id);
          const getFallbackTemplate = () => (usable[0] || data[0]);

          if (templateIdFromUrl) {
            const urlTemplate = data.find((t: any) => t.id === templateIdFromUrl);
            if (urlTemplate && urlTemplate.json_content) {
              setSelectedTemplate(urlTemplate.id);
              // Set resume title to template name for new resumes
              if (resumeId === 'new') {
                setResumeTitle(urlTemplate.name);
              }
            } else {
              const fallbackTemplate = getFallbackTemplate();
              setSelectedTemplate(fallbackTemplate.id);
              if (resumeId === 'new') {
                setResumeTitle(fallbackTemplate.name);
              }
            }
          } else {
            const fallbackTemplate = getFallbackTemplate();
            setSelectedTemplate(fallbackTemplate.id);
            if (resumeId === 'new') {
              setResumeTitle(fallbackTemplate.name);
            }
          }
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
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .single();
    
    if (data && data.content) {
      // Cast through unknown first for proper type conversion
      const loadedData = data.content as unknown as ResumeData;
      // Merge with default data to ensure all fields have values
      setResumeData(prev => ({
        ...prev,
        ...loadedData,
        contact: { ...prev.contact, ...loadedData.contact },
      }));
      setSelectedTemplate(data.template_name || templates[0]?.id || '');
      setResumeTitle(data.title || 'My Resume');
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
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      toast({
        title: 'Error',
        description: 'Please sign in to save your resume',
        variant: 'destructive',
      });
      setSaving(false);
      return;
    }

    const selectedTemplateObj = templates.find((t: any) => t.id === selectedTemplate);
    const computedTitle = (!resumeTitle || resumeTitle.trim() === '' || resumeTitle === 'My Resume')
      ? (selectedTemplateObj?.name || 'Untitled Resume')
      : resumeTitle.trim();

    const resumeRecord = {
      user_id: userData.user.id,
      title: computedTitle,
      content: resumeData as unknown as any, // Cast to any for JSON storage
      template_name: selectedTemplate,
    };

    // Keep UI in sync with what will be saved
    setResumeTitle(computedTitle);
    if (resumeId && resumeId !== 'new') {
      const { error } = await supabase
        .from('resumes')
        .update(resumeRecord)
        .eq('id', resumeId);
      
      if (!error) {
        toast({
          title: 'Success',
          description: 'Resume saved successfully',
        });
      }
    } else {
      const { data, error } = await supabase
        .from('resumes')
        .insert(resumeRecord)
        .select()
        .single();
      
      if (data) {
        toast({
          title: 'Success',
          description: 'Resume created successfully',
        });
        navigate(`/editor/${data.id}`);
      }
    }
    setSaving(false);
  };

  const exportPDF = () => {
    const element = document.getElementById('resume-preview-content');
    if (element) {
      // Clone the element to avoid modifying the original
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Create a temporary container
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '210mm'; // A4 width
      container.appendChild(clone);
      document.body.appendChild(container);

      const opt = {
        margin: [10, 10, 10, 10], // Top, Right, Bottom, Left margins in mm
        filename: `${resumeTitle || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 794, // A4 width in pixels at 96 DPI (210mm)
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['avoid-all', 'css', 'legacy'],
          avoid: ['.resume-section', '.experience-item', '.education-item']
        }
      };

      html2pdf()
        .set(opt)
        .from(clone)
        .save()
        .then(() => {
          // Clean up
          document.body.removeChild(container);
          toast({
            title: "Success",
            description: "Resume downloaded successfully",
          });
        })
        .catch((error) => {
          console.error('PDF export error:', error);
          document.body.removeChild(container);
          toast({
            title: "Error",
            description: "Failed to export PDF",
            variant: "destructive",
          });
        });
    }
  };

  const formContent = (
    <div className="space-y-6 p-6">
      {/* Resume Title */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Title</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            placeholder="e.g., Software Engineer Resume, Marketing Manager CV"
            className="text-lg font-semibold"
          />
        </CardContent>
      </Card>

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
                placeholder="Describe your responsibilities and achievements..."
                value={exp.responsibilities.join('\n')}
                onChange={(e) => updateExperience(index, 'responsibilities', e.target.value.split('\n'))}
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

  // Show loading state while templates are being loaded
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading editor...</p>
        </div>
      </div>
    );
  }

  // Show error if no templates available
  if (templates.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No templates available</p>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
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
                </SelectTrigger>
                <SelectContent>
                  {templates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={saveResume} disabled={saving} variant="default">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button onClick={exportPDF} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-2 h-[calc(100vh-65px)]">
        {/* Left Panel - Form */}
        <div className="overflow-y-auto border-r">
          {formContent}
        </div>

        {/* Right Panel - Preview */}
        <div className="overflow-y-auto bg-muted/20 p-6 flex items-start justify-center">
          <div className="w-full" style={{ maxWidth: '850px' }}>
            <ResumeTemplatePreview
              resumeData={resumeData}
              templateId={selectedTemplate}
              templates={templates}
            />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sticky top-0 z-10 bg-background">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-0">
            {formContent}
          </TabsContent>
          <TabsContent value="preview" className="mt-0 p-4 overflow-x-auto">
            <div className="min-w-[320px]">
              <ResumeTemplatePreview
                resumeData={resumeData}
                templateId={selectedTemplate}
                templates={templates}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResumeEditor;
