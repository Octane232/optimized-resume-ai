import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Download, Share2, Plus, X, FileText, Palette, Award, FileCode, Printer, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import Mustache from 'mustache';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ResumeData } from '@/types/resume';
import ResumeTemplatePreview from '@/components/dashboard/ResumeTemplatePreview';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { useSubscription } from '@/contexts/SubscriptionContext';

const ResumeEditor: React.FC = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { canDownloadPDF, incrementUsage } = useSubscription();
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

  // Load templates with useCallback for optimization
  const loadTemplates = useCallback(async (templateIdFromUrl?: string | null) => {
    // This function is no longer used - keeping for backwards compatibility
  }, []);

  const loadResume = useCallback(async (loadedTemplates?: any[]) => {
    // This function is no longer used - keeping for backwards compatibility
  }, []);

  // Load templates first, then load resume
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const templateId = searchParams.get('template');
        
        // Load only classic templates
        const { data: templatesData, error } = await supabase
          .from('resume_templates')
          .select('*')
          .eq('category', 'classic')
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        if (templatesData && templatesData.length > 0) {
          setTemplates(templatesData);

          const usable = templatesData.filter((t: any) => t.json_content);
          const getFallbackTemplate = () => (usable[0] || templatesData[0]);

          // Set initial template - match by id or by name containing the template param
          let initialTemplate = getFallbackTemplate();
          if (templateId) {
            const urlTemplate = templatesData.find((t: any) => 
              t.id === templateId || 
              t.name.toLowerCase().includes(templateId.toLowerCase())
            );
            if (urlTemplate && urlTemplate.json_content) {
              initialTemplate = urlTemplate;
            }
          }

          // Load existing resume if not new
          if (resumeId && resumeId !== 'new') {
            const { data: resumeData, error: resumeError } = await supabase
              .from('resumes')
              .select('*')
              .eq('id', resumeId)
              .single();
            
            if (resumeError) throw resumeError;
            
            if (resumeData && resumeData.content) {
              const loadedData = resumeData.content as unknown as ResumeData;
              setResumeData(prev => ({
                ...prev,
                ...loadedData,
                contact: { ...prev.contact, ...loadedData.contact },
              }));
              setSelectedTemplate(resumeData.template_name || initialTemplate.id);
              setResumeTitle(resumeData.title || 'My Resume');
            }
          } else {
            // New resume - use template
            setSelectedTemplate(initialTemplate.id);
            setResumeTitle(initialTemplate.name);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load resume",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [resumeId, searchParams, toast]);

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

  const addCertification = () => {
    setResumeData(prev => ({
      ...prev,
      certifications: [...(prev.certifications || []), {
        name: '',
        issuer: '',
        date: ''
      }]
    }));
  };

  const updateCertification = (index: number, field: string, value: string) => {
    setResumeData(prev => {
      const newCerts = [...(prev.certifications || [])];
      newCerts[index] = { ...newCerts[index], [field]: value };
      return { ...prev, certifications: newCerts };
    });
  };

  const removeCertification = (index: number) => {
    setResumeData(prev => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== index)
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

  const exportDOCX = async () => {
    // Check if user can download
    if (!canDownloadPDF()) {
      toast({
        title: "Download limit reached",
        description: "Please upgrade your plan to download more resumes.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the selected template
      const selectedTemplateObj = templates.find((t: any) => t.id === selectedTemplate);
      const templateContent = selectedTemplateObj?.json_content;
      
      const sections: Paragraph[] = [];

      // Helper function to format dates
      const formatDate = (date: string): string => {
        if (!date) return '';
        if (/^\d{4}$/.test(date)) return date;
        try {
          return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        } catch {
          return date;
        }
      };

      // Check if using markdown template - generate styled content matching preview
      if (templateContent?.type === 'markdown') {
        const theme = templateContent.theme || {};
        const primaryColor = theme.primaryColor?.replace('#', '') || '1a1a1a';
        const accentColor = theme.accentColor?.replace('#', '') || '3b82f6';

        // Header - Name (styled to match template)
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.contact.name,
                bold: true,
                size: 36,
                color: primaryColor,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
          })
        );

        // Title
        if (resumeData.contact.title) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.contact.title,
                  size: 24,
                  color: '666666',
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 },
            })
          );
        }

        // Contact Info - Line breaks instead of pipes for ATS optimization
        const contactLines: string[] = [];
        if (resumeData.contact.email) contactLines.push(resumeData.contact.email);
        if (resumeData.contact.phone) contactLines.push(resumeData.contact.phone);
        if (resumeData.contact.location) contactLines.push(resumeData.contact.location);
        if (resumeData.contact.linkedin) contactLines.push(resumeData.contact.linkedin);
        if (resumeData.contact.github) contactLines.push(resumeData.contact.github);
        if (resumeData.contact.portfolio) contactLines.push(resumeData.contact.portfolio);

        if (contactLines.length > 0) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: contactLines.join(' • '),
                  size: 20,
                  color: '555555',
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            })
          );
        }

        // Summary Section
        if (resumeData.summary) {
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: 'Summary', bold: true, size: 26, color: primaryColor })],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: accentColor } },
              spacing: { before: 240, after: 120 },
            })
          );
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: resumeData.summary, size: 22 })],
              spacing: { after: 160 },
            })
          );
        }

        // Experience Section
        if (resumeData.experience && resumeData.experience.length > 0) {
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: 'Experience', bold: true, size: 26, color: primaryColor })],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: accentColor } },
              spacing: { before: 240, after: 120 },
            })
          );

          resumeData.experience.forEach((exp) => {
            // Job title and company
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: exp.title, bold: true, size: 22 }),
                  new TextRun({ text: ` - ${exp.company}`, size: 22 }),
                ],
                spacing: { before: 120 },
              })
            );
            // Dates
            if (exp.startDate || exp.endDate) {
              sections.push(
                new Paragraph({
                  children: [
                    new TextRun({ 
                      text: `${formatDate(exp.startDate)} - ${exp.endDate === 'Present' ? 'Present' : formatDate(exp.endDate)}`, 
                      size: 20, 
                      italics: true, 
                      color: '666666' 
                    }),
                  ],
                  spacing: { after: 60 },
                })
              );
            }
            // Responsibilities as bullets
            exp.responsibilities?.forEach((resp) => {
              sections.push(
                new Paragraph({
                  children: [new TextRun({ text: `- ${resp}`, size: 22 })],
                  indent: { left: 280 },
                  spacing: { before: 40 },
                })
              );
            });
          });
        }

        // Education Section
        if (resumeData.education && resumeData.education.length > 0) {
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: 'Education', bold: true, size: 26, color: primaryColor })],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: accentColor } },
              spacing: { before: 240, after: 120 },
            })
          );

          resumeData.education.forEach((edu) => {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: edu.degree, bold: true, size: 22 }),
                ],
                spacing: { before: 100 },
              })
            );
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: edu.institution, size: 22 }),
                  new TextRun({ text: ` (${edu.startYear} - ${edu.endYear})`, size: 20, color: '666666' }),
                ],
                spacing: { after: 60 },
              })
            );
            if (edu.gpa) {
              sections.push(
                new Paragraph({
                  children: [new TextRun({ text: `GPA: ${edu.gpa}`, size: 20, italics: true })],
                })
              );
            }
          });
        }

        // Skills Section
        if (resumeData.skills && resumeData.skills.length > 0) {
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: 'Skills', bold: true, size: 26, color: primaryColor })],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: accentColor } },
              spacing: { before: 240, after: 120 },
            })
          );
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: resumeData.skills.join(', '), size: 22 })],
              spacing: { after: 160 },
            })
          );
        }

        // Certifications Section (compact 2-line format)
        if (resumeData.certifications && resumeData.certifications.length > 0) {
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: 'Certifications', bold: true, size: 26, color: primaryColor })],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: accentColor } },
              spacing: { before: 240, after: 120 },
            })
          );

          resumeData.certifications.forEach((cert) => {
            const certText = cert.date 
              ? `${cert.name} - ${cert.issuer} (${cert.date})`
              : `${cert.name} - ${cert.issuer}`;
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `- `, size: 22 }),
                  new TextRun({ text: cert.name, bold: true, size: 22 }),
                  new TextRun({ text: ` - ${cert.issuer}`, size: 22 }),
                  cert.date ? new TextRun({ text: ` (${cert.date})`, size: 20, color: '666666' }) : new TextRun({ text: '' }),
                ],
                spacing: { before: 40 },
              })
            );
          });
        }

        // Projects Section
        if (resumeData.projects && resumeData.projects.length > 0) {
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: 'Projects', bold: true, size: 26, color: primaryColor })],
              border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: accentColor } },
              spacing: { before: 240, after: 120 },
            })
          );

          resumeData.projects.forEach((proj) => {
            sections.push(
              new Paragraph({
                children: [new TextRun({ text: proj.title, bold: true, size: 22 })],
                spacing: { before: 100 },
              })
            );
            if (proj.description) {
              sections.push(
                new Paragraph({
                  children: [new TextRun({ text: proj.description, size: 22 })],
                })
              );
            }
            if (proj.technologies && proj.technologies.length > 0) {
              sections.push(
                new Paragraph({
                  children: [new TextRun({ text: `Technologies: ${proj.technologies.join(', ')}`, size: 20, italics: true })],
                  spacing: { after: 60 },
                })
              );
            }
          });
        }

      } else {
        // Fallback: Original generic DOCX export for non-markdown templates
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.contact.name,
                bold: true,
                size: 32,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          })
        );

        if (resumeData.contact.title) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: resumeData.contact.title,
                  size: 24,
                  color: "666666",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            })
          );
        }

        const contactParts = [
          resumeData.contact.email,
          resumeData.contact.phone,
          resumeData.contact.location,
          resumeData.contact.linkedin,
        ].filter(Boolean);

        if (contactParts.length > 0) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: contactParts.join(' | '),
                  size: 20,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            })
          );
        }

        if (resumeData.summary) {
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_2,
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" } },
              spacing: { before: 300, after: 150 },
            })
          );
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: resumeData.summary, size: 22 })],
              spacing: { after: 200 },
            })
          );
        }

        if (resumeData.skills && resumeData.skills.length > 0) {
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: 'SKILLS', bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_2,
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" } },
              spacing: { before: 300, after: 150 },
            })
          );
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: resumeData.skills.join(', '), size: 22 })],
              spacing: { after: 200 },
            })
          );
        }

        if (resumeData.experience && resumeData.experience.length > 0) {
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: 'PROFESSIONAL EXPERIENCE', bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_2,
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" } },
              spacing: { before: 300, after: 150 },
            })
          );

          resumeData.experience.forEach((exp) => {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: exp.title, bold: true, size: 22 }),
                  new TextRun({ text: ` at ${exp.company}`, size: 22 }),
                ],
                spacing: { before: 150 },
              })
            );
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `${exp.startDate} - ${exp.endDate}`, size: 20, italics: true, color: "666666" }),
                ],
                spacing: { after: 100 },
              })
            );
            exp.responsibilities?.forEach((resp) => {
              sections.push(
                new Paragraph({
                  children: [new TextRun({ text: `• ${resp}`, size: 22 })],
                  indent: { left: 360 },
                })
              );
            });
          });
        }

        if (resumeData.education && resumeData.education.length > 0) {
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: 'EDUCATION', bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_2,
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" } },
              spacing: { before: 300, after: 150 },
            })
          );

          resumeData.education.forEach((edu) => {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: edu.degree, bold: true, size: 22 }),
                ],
                spacing: { before: 150 },
              })
            );
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: edu.institution, size: 22 }),
                  new TextRun({ text: ` | ${edu.startYear} - ${edu.endYear}`, size: 20, color: "666666" }),
                ],
                spacing: { after: 100 },
              })
            );
          });
        }

        if (resumeData.projects && resumeData.projects.length > 0) {
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: 'PROJECTS', bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_2,
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" } },
              spacing: { before: 300, after: 150 },
            })
          );

          resumeData.projects.forEach((proj) => {
            sections.push(
              new Paragraph({
                children: [new TextRun({ text: proj.title, bold: true, size: 22 })],
                spacing: { before: 150 },
              })
            );
            if (proj.description) {
              sections.push(
                new Paragraph({
                  children: [new TextRun({ text: proj.description, size: 22 })],
                })
              );
            }
            if (proj.technologies && proj.technologies.length > 0) {
              sections.push(
                new Paragraph({
                  children: [new TextRun({ text: `Technologies: ${proj.technologies.join(', ')}`, size: 20, italics: true })],
                  spacing: { after: 100 },
                })
              );
            }
          });
        }

        if (resumeData.certifications && resumeData.certifications.length > 0) {
          sections.push(
            new Paragraph({
              children: [new TextRun({ text: 'CERTIFICATIONS', bold: true, size: 24 })],
              heading: HeadingLevel.HEADING_2,
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "000000" } },
              spacing: { before: 300, after: 150 },
            })
          );

          resumeData.certifications.forEach((cert) => {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: `• ${cert.name}`, size: 22 }),
                  cert.issuer ? new TextRun({ text: ` - ${cert.issuer}`, size: 20, color: "666666" }) : new TextRun({ text: '' }),
                  cert.date ? new TextRun({ text: ` (${cert.date})`, size: 20, color: "666666" }) : new TextRun({ text: '' }),
                ],
              })
            );
          });
        }
      }

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 720, // 0.5 inch
                  right: 720,
                  bottom: 720,
                  left: 720,
                },
              },
            },
            children: sections,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${resumeTitle || 'resume'}.docx`);

      // Track download usage
      await incrementUsage('download');

      toast({
        title: "Success",
        description: "Resume downloaded as DOCX",
      });
    } catch (error) {
      console.error('DOCX export error:', error);
      toast({
        title: "Error",
        description: "Failed to export DOCX",
        variant: "destructive",
      });
    }
  };

  // Helper to format date for exports
  const formatDateExport = (date: string): string => {
    if (!date) return '';
    if (/^\d{4}$/.test(date)) return date;
    try {
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch {
      return date;
    }
  };

  // Generate styled HTML that matches the preview exactly
  const generateStyledHTML = (): string => {
    const selectedTemplateObj = templates.find((t: any) => t.id === selectedTemplate);
    const templateContent = selectedTemplateObj?.json_content;
    
    if (!templateContent || templateContent.type !== 'markdown') {
      return generateGenericHTML();
    }

    const theme = templateContent.theme || {};
    const markdownTemplate = templateContent.markdown_template || '';
    const templateCSS = templateContent.css || '';

    // Prepare template data for Mustache (same as MarkdownResumeRenderer)
    const templateData = {
      contact: {
        name: resumeData.contact.name || 'Your Name',
        title: resumeData.contact.title || 'Professional Title',
        email: resumeData.contact.email || '',
        phone: resumeData.contact.phone || '',
        location: resumeData.contact.location || '',
        linkedin: resumeData.contact.linkedin || '',
        portfolio: resumeData.contact.portfolio || '',
        github: resumeData.contact.github || ''
      },
      summary: resumeData.summary || '',
      experience: resumeData.experience.map(exp => ({
        title: exp.title || 'Job Title',
        company: exp.company || 'Company Name',
        startDate: formatDateExport(exp.startDate) || 'Start',
        endDate: exp.endDate === 'Present' ? 'Present' : formatDateExport(exp.endDate) || 'Present',
        responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : []
      })),
      education: resumeData.education.map(edu => ({
        degree: edu.degree || 'Degree',
        institution: edu.institution || 'Institution',
        startYear: edu.startYear || '',
        endYear: edu.endYear || '',
        gpa: edu.gpa || ''
      })),
      skills: resumeData.skills || [],
      projects: (resumeData.projects || []).map(proj => ({
        title: proj.title || 'Project',
        description: proj.description || '',
        technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
        link: proj.link || ''
      })),
      certifications: (resumeData.certifications || []).map(cert => ({
        name: cert.name || 'Certification',
        issuer: cert.issuer || '',
        date: cert.date || ''
      })),
      hasExperience: resumeData.experience.length > 0,
      hasEducation: resumeData.education.length > 0,
      hasSkills: resumeData.skills.length > 0,
      hasProjects: (resumeData.projects || []).length > 0,
      hasCertifications: (resumeData.certifications || []).length > 0
    };

    // Render markdown with Mustache
    let renderedMarkdown = '';
    try {
      renderedMarkdown = Mustache.render(markdownTemplate, templateData);
    } catch (error) {
      console.error('Mustache render error:', error);
      renderedMarkdown = '# Error rendering template';
    }

    // Convert markdown to proper HTML
    let htmlContent = renderedMarkdown
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // Bold and italic
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr>')
      // Lists - process line by line
      .split('\n')
      .map(line => {
        if (line.trim().startsWith('- ')) {
          return `<li>${line.trim().substring(2)}</li>`;
        }
        return line;
      })
      .join('\n')
      // Wrap consecutive li elements in ul
      .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, '<ul>$&</ul>')
      // Paragraphs for remaining text
      .replace(/\n\n+/g, '</p><p>')
      .replace(/\n/g, '<br>');

    // Wrap content in paragraph if needed
    if (!htmlContent.startsWith('<')) {
      htmlContent = '<p>' + htmlContent + '</p>';
    }

    // Replace #SCOPE with #resume in template CSS
    const scopedCSS = templateCSS.replace(/#SCOPE/g, '#resume');

    // Build the complete HTML with EXACT template styling
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resumeTitle || 'Resume'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;600;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      background: #f5f5f5;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      padding: 20px;
    }
    
    #resume {
      font-family: ${theme.fontFamily || 'Inter, sans-serif'};
      color: ${theme.primaryColor || '#1a1a1a'};
      line-height: 1.6;
      padding: 40px 50px;
      background: white;
      max-width: 850px;
      width: 100%;
      min-height: 1100px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    
    #resume h1 {
      font-family: ${theme.headingFont || theme.fontFamily || 'Inter, sans-serif'};
      margin-bottom: 0.25rem;
    }
    
    #resume h2 {
      font-family: ${theme.headingFont || theme.fontFamily || 'Inter, sans-serif'};
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }
    
    #resume h3 {
      font-family: ${theme.headingFont || theme.fontFamily || 'Inter, sans-serif'};
      margin-top: 1rem;
      margin-bottom: 0.25rem;
    }
    
    #resume p {
      margin-bottom: 0.5rem;
    }
    
    #resume ul {
      margin-left: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    #resume li {
      margin-bottom: 0.25rem;
    }
    
    #resume hr {
      border: none;
      margin: 1rem 0;
    }
    
    #resume strong {
      font-weight: 600;
    }
    
    #resume a {
      color: ${theme.accentColor || '#3b82f6'};
      text-decoration: none;
    }
    
    /* Template-specific styles from database */
    ${scopedCSS}
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      #resume {
        box-shadow: none;
        max-width: none;
        min-height: auto;
        padding: 0.5in;
      }
      
      @page {
        margin: 0;
        size: letter;
      }
      
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  </style>
</head>
<body>
  <div id="resume">
    ${htmlContent}
  </div>
</body>
</html>`;
  };

  // Fallback generic HTML for non-markdown templates
  const generateGenericHTML = (): string => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${resumeTitle || 'Resume'}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 850px; margin: 0 auto; padding: 40px; }
    h1 { text-align: center; margin-bottom: 8px; }
    h2 { border-bottom: 2px solid #333; padding-bottom: 4px; margin-top: 24px; }
    .contact { text-align: center; color: #666; margin-bottom: 20px; }
    ul { margin-left: 20px; }
    li { margin-bottom: 4px; }
  </style>
</head>
<body>
  <h1>${resumeData.contact.name}</h1>
  <p style="text-align: center; color: #666;">${resumeData.contact.title}</p>
  <p class="contact">${[resumeData.contact.email, resumeData.contact.phone, resumeData.contact.location].filter(Boolean).join(' • ')}</p>
  
  ${resumeData.summary ? `<h2>Summary</h2><p>${resumeData.summary}</p>` : ''}
  
  ${resumeData.experience.length > 0 ? `
  <h2>Experience</h2>
  ${resumeData.experience.map(exp => `
    <p><strong>${exp.title}</strong> - ${exp.company}</p>
    <p style="color: #666; font-size: 12px;">${exp.startDate} - ${exp.endDate}</p>
    <ul>${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>
  `).join('')}` : ''}
  
  ${resumeData.education.length > 0 ? `
  <h2>Education</h2>
  ${resumeData.education.map(edu => `
    <p><strong>${edu.degree}</strong></p>
    <p>${edu.institution} (${edu.startYear} - ${edu.endYear})</p>
  `).join('')}` : ''}
  
  ${resumeData.skills.length > 0 ? `<h2>Skills</h2><p>${resumeData.skills.join(', ')}</p>` : ''}
  
  ${(resumeData.certifications || []).length > 0 ? `
  <h2>Certifications</h2>
  <ul>${resumeData.certifications?.map(c => `<li><strong>${c.name}</strong> - ${c.issuer}${c.date ? ` (${c.date})` : ''}</li>`).join('')}</ul>
  ` : ''}
</body>
</html>`;
  };

  // Export as HTML file
  const exportHTML = async () => {
    if (!canDownloadPDF()) {
      toast({
        title: "Download limit reached",
        description: "Please upgrade your plan to download more resumes.",
        variant: "destructive",
      });
      return;
    }

    try {
      const htmlContent = generateStyledHTML();
      const blob = new Blob([htmlContent], { type: 'text/html' });
      saveAs(blob, `${resumeTitle || 'resume'}.html`);
      
      await incrementUsage('download');
      
      toast({
        title: "Success",
        description: "Resume downloaded as HTML with full styling",
      });
    } catch (error) {
      console.error('HTML export error:', error);
      toast({
        title: "Error",
        description: "Failed to export HTML",
        variant: "destructive",
      });
    }
  };

  // Print to PDF using browser print dialog
  const printToPDF = () => {
    const htmlContent = generateStyledHTML();
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for fonts to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
      
      toast({
        title: "Print Dialog Opened",
        description: "Save as PDF from your browser's print dialog",
      });
    } else {
      toast({
        title: "Popup Blocked",
        description: "Please allow popups to use Print to PDF",
        variant: "destructive",
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

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certifications
            </span>
            <Button onClick={addCertification} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Add Certification
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(resumeData.certifications || []).length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No certifications added yet. Click "Add Certification" to get started.
            </p>
          ) : (
            (resumeData.certifications || []).map((cert, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-end">
                  <Button
                    onClick={() => removeCertification(index)}
                    size="sm"
                    variant="ghost"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Certification Name (e.g., AWS Solutions Architect)"
                    value={cert.name}
                    onChange={(e) => updateCertification(index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Issuer (e.g., Amazon Web Services)"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                  />
                  <Input
                    placeholder="Date (e.g., 2024)"
                    value={cert.date || ''}
                    onChange={(e) => updateCertification(index, 'date', e.target.value)}
                  />
                </div>
              </div>
            ))
          )}
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
              
              {/* Export Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={printToPDF} className="cursor-pointer">
                    <Printer className="w-4 h-4 mr-2" />
                    <div>
                      <p className="font-medium">Print / Save as PDF</p>
                      <p className="text-xs text-muted-foreground">Exact styling via browser</p>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={exportHTML} className="cursor-pointer">
                    <FileCode className="w-4 h-4 mr-2" />
                    <div>
                      <p className="font-medium">Download HTML</p>
                      <p className="text-xs text-muted-foreground">Full styled template</p>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={exportDOCX} className="cursor-pointer">
                    <FileText className="w-4 h-4 mr-2" />
                    <div>
                      <p className="font-medium">Download DOCX</p>
                      <p className="text-xs text-muted-foreground">ATS-optimized Word file</p>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
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
