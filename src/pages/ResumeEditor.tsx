import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [templates, setTemplates] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    contact: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      github: '',
    },
    summary: '',
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    languages: [],
    awards: [],
  });

  const [newSkill, setNewSkill] = useState('');

  // Load templates
  useEffect(() => {
    loadTemplates();
    if (resumeId && resumeId !== 'new') {
      loadResume();
    }
  }, [resumeId]);

  const loadTemplates = async () => {
    const { data, error } = await supabase
      .from('resume_templates')
      .select('*')
      .order('name');
    
    if (data) {
      setTemplates(data);
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
      setResumeData(data.content as unknown as ResumeData);
      setSelectedTemplate(data.template_name || 'modern');
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

    const resumeRecord = {
      user_id: userData.user.id,
      title: resumeData.contact.name ? `${resumeData.contact.name}'s Resume` : 'Untitled Resume',
      content: resumeData as unknown as any, // Cast to any for JSON storage
      template_name: selectedTemplate,
    };

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
      const opt = {
        margin: 0,
        filename: `${resumeData.contact.name || 'resume'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    }
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
                  <SelectItem value="modern">Modern Template</SelectItem>
                  <SelectItem value="classic">Classic Template</SelectItem>
                  <SelectItem value="creative">Creative Template</SelectItem>
                  <SelectItem value="executive">Executive Template</SelectItem>
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
        <div className="overflow-y-auto bg-muted/20 p-6">
          <div className="max-w-4xl mx-auto">
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-0">
            {formContent}
          </TabsContent>
          <TabsContent value="preview" className="mt-0 p-4">
            <ResumeTemplatePreview
              resumeData={resumeData}
              templateId={selectedTemplate}
              templates={templates}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResumeEditor;