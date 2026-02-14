import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Download, Share2, Plus, X, FileText, FileCode, Printer, ChevronDown, Award, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import Mustache from "mustache";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/types/resume";
import ResumeTemplatePreview from "@/components/dashboard/ResumeTemplatePreview";
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from "docx";
import { saveAs } from "file-saver";
import { useSubscription } from "@/contexts/SubscriptionContext";
import AIResumeGeneratorDialog from "@/components/dashboard/AIResumeGeneratorDialog";

const ResumeEditor: React.FC = () => {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { canDownloadPDF, incrementUsage } = useSubscription();
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [templates, setTemplates] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [resumeTitle, setResumeTitle] = useState("My Resume");
  const [resumeData, setResumeData] = useState<ResumeData>({
    contact: {
      name: "John Doe",
      title: "Senior Software Engineer",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/johndoe",
      portfolio: "johndoe.dev",
      github: "github.com/johndoe",
    },
    summary:
      "Experienced software engineer with 8+ years of expertise in full-stack development, cloud architecture, and team leadership. Passionate about building scalable applications and mentoring junior developers.",
    skills: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Python",
      "AWS",
      "Docker",
      "PostgreSQL",
      "GraphQL",
      "CI/CD",
    ],
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Company Inc.",
        startDate: "2020",
        endDate: "Present",
        responsibilities: [
          "Led development of microservices architecture serving 1M+ users",
          "Mentored team of 5 junior developers",
          "Reduced API response time by 40% through optimization",
        ],
      },
      {
        title: "Software Engineer",
        company: "StartUp Co.",
        startDate: "2017",
        endDate: "2020",
        responsibilities: [
          "Built real-time data processing pipeline using Node.js and Redis",
          "Implemented CI/CD pipeline reducing deployment time by 60%",
          "Developed RESTful APIs serving mobile and web clients",
        ],
      },
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of California, Berkeley",
        startYear: "2012",
        endYear: "2016",
        gpa: "3.8",
      },
    ],
    projects: [
      {
        title: "Open Source Contribution",
        description: "Major contributor to popular React library with 10k+ stars",
        technologies: ["React", "TypeScript", "Jest"],
        link: "github.com/project",
      },
    ],
    certifications: [],
    languages: [],
    awards: [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  
  // Debounced resume data for preview - prevents excessive re-renders
  const [debouncedResumeData, setDebouncedResumeData] = useState<ResumeData>(resumeData);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Debounce resume data updates for preview
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedResumeData(resumeData);
    }, 300);
    
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [resumeData]);
  
  // Memoize templates for the preview
  const memoizedTemplates = useMemo(() => templates, [templates]);

  // Load templates and resume data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const templateId = searchParams.get("template");

        const { data: templatesData, error } = await supabase
          .from("resume_templates")
          .select("*")
          .eq("category", "classic")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (templatesData && templatesData.length > 0) {
          setTemplates(templatesData);

          const usable = templatesData.filter((t: any) => t.json_content);
          const getFallbackTemplate = () => usable[0] || templatesData[0];

          let initialTemplate = getFallbackTemplate();
          if (templateId) {
            const urlTemplate = templatesData.find(
              (t: any) => t.id === templateId || t.name.toLowerCase().includes(templateId.toLowerCase()),
            );
            if (urlTemplate && urlTemplate.json_content) {
              initialTemplate = urlTemplate;
            }
          }

          if (resumeId && resumeId !== "new") {
            const { data: resumeData, error: resumeError } = await supabase
              .from("resumes")
              .select("*")
              .eq("id", resumeId)
              .single();

            if (resumeError) throw resumeError;

            if (resumeData && resumeData.content) {
              const loadedData = resumeData.content as unknown as ResumeData;
              setResumeData((prev) => ({
                ...prev,
                ...loadedData,
                contact: { ...prev.contact, ...loadedData.contact },
              }));
              setSelectedTemplate(resumeData.template_name || initialTemplate.id);
              setResumeTitle(resumeData.title || "My Resume");
            }
          } else {
            setSelectedTemplate(initialTemplate.id);
            setResumeTitle(initialTemplate.name);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load resume",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [resumeId, searchParams, toast]);

  // Helper functions for updating resume data
  const updateContact = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          title: "",
          company: "",
          startDate: "",
          endDate: "",
          responsibilities: [],
        },
      ],
    }));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setResumeData((prev) => {
      const newExp = [...prev.experience];
      newExp[index] = { ...newExp[index], [field]: value };
      return { ...prev, experience: newExp };
    });
  };

  const removeExperience = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: "",
          institution: "",
          startYear: "",
          endYear: "",
        },
      ],
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setResumeData((prev) => {
      const newEdu = [...prev.education];
      newEdu[index] = { ...newEdu[index], [field]: value };
      return { ...prev, education: newEdu };
    });
  };

  const removeEducation = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "",
          description: "",
          technologies: [],
          link: "",
        },
      ],
    }));
  };

  const updateProject = (index: number, field: string, value: any) => {
    setResumeData((prev) => {
      const newProjects = [...prev.projects];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return { ...prev, projects: newProjects };
    });
  };

  const removeProject = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        {
          name: "",
          issuer: "",
          date: "",
        },
      ],
    }));
  };

  const updateCertification = (index: number, field: string, value: string) => {
    setResumeData((prev) => {
      const newCerts = [...(prev.certifications || [])];
      newCerts[index] = { ...newCerts[index], [field]: value };
      return { ...prev, certifications: newCerts };
    });
  };

  const removeCertification = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_, i) => i !== index),
    }));
  };

  const saveResume = async () => {
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      toast({
        title: "Error",
        description: "Please sign in to save your resume",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    const selectedTemplateObj = templates.find((t: any) => t.id === selectedTemplate);
    const computedTitle =
      !resumeTitle || resumeTitle.trim() === "" || resumeTitle === "My Resume"
        ? selectedTemplateObj?.name || "Untitled Resume"
        : resumeTitle.trim();

    const resumeRecord = {
      user_id: userData.user.id,
      title: computedTitle,
      content: resumeData as unknown as any,
      template_name: selectedTemplate,
    };

    setResumeTitle(computedTitle);
    if (resumeId && resumeId !== "new") {
      const { error } = await supabase.from("resumes").update(resumeRecord).eq("id", resumeId);

      if (!error) {
        toast({
          title: "Success",
          description: "Resume saved successfully",
        });
      }
    } else {
      const { data, error } = await supabase.from("resumes").insert(resumeRecord).select().single();

      if (data) {
        toast({
          title: "Success",
          description: "Resume created successfully",
        });
        navigate(`/editor/${data.id}`);
      }
    }
    setSaving(false);
  };

  // =============================
  // ATS-OPTIMIZED DOCX EXPORT
  // =============================
  const exportDOCX = async () => {
    if (!canDownloadPDF()) {
      toast({
        title: "Download limit reached",
        description: "Please upgrade your plan to download more resumes.",
        variant: "destructive",
      });
      return;
    }

    try {
      const sections: Paragraph[] = [];

      // ===== CONTACT INFORMATION =====
      // Name - Large and bold (ATS recognizes this as candidate name)
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.contact.name,
              bold: true,
              size: 32, // Larger for name recognition
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 100 },
        }),
      );

      // Title
      if (resumeData.contact.title) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.contact.title,
                size: 24,
                color: "444444", // Dark gray, not black for slight styling
              }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { after: 150 },
          }),
        );
      }

      // Contact Info - SEPARATE LINES for ATS parsing (not pipes!)
      const contactInfo = [resumeData.contact.email, resumeData.contact.phone, resumeData.contact.location].filter(
        Boolean,
      );

      contactInfo.forEach((info) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: info,
                size: 20,
              }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { after: 40 },
          }),
        );
      });

      // Additional links on separate lines
      const additionalLinks = [
        resumeData.contact.linkedin ? `LinkedIn: ${resumeData.contact.linkedin}` : "",
        resumeData.contact.github ? `GitHub: ${resumeData.contact.github}` : "",
        resumeData.contact.portfolio ? `Portfolio: ${resumeData.contact.portfolio}` : "",
      ].filter(Boolean);

      additionalLinks.forEach((link, index) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: link,
                size: 20,
              }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { after: index === additionalLinks.length - 1 ? 200 : 40 },
          }),
        );
      });

      // ===== PROFESSIONAL SUMMARY =====
      if (resumeData.summary) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "PROFESSIONAL SUMMARY",
                bold: true,
                size: 24,
                allCaps: true,
              }),
            ],
            alignment: AlignmentType.LEFT,
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 3,
                color: "000000",
              },
            },
            spacing: { after: 120 },
          }),
        );

        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.summary,
                size: 22,
              }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { after: 200 },
          }),
        );
      }

      // ===== SKILLS SECTION =====
      // Skills should be comma-separated for ATS keyword extraction
      if (resumeData.skills && resumeData.skills.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "SKILLS",
                bold: true,
                size: 24,
                allCaps: true,
              }),
            ],
            alignment: AlignmentType.LEFT,
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 3,
                color: "000000",
              },
            },
            spacing: { after: 120 },
          }),
        );

        // Join skills with commas - ATS parses this best
        const skillsText = resumeData.skills.join(", ");
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: skillsText,
                size: 22,
              }),
            ],
            alignment: AlignmentType.LEFT,
            spacing: { after: 200 },
          }),
        );
      }

      // ===== EXPERIENCE SECTION =====
      if (resumeData.experience && resumeData.experience.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "PROFESSIONAL EXPERIENCE",
                bold: true,
                size: 24,
                allCaps: true,
              }),
            ],
            alignment: AlignmentType.LEFT,
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 3,
                color: "000000",
              },
            },
            spacing: { after: 120 },
          }),
        );

        resumeData.experience.forEach((exp, expIndex) => {
          // Job title and company on same line, comma separated
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.title,
                  bold: true,
                  size: 22,
                }),
                new TextRun({
                  text: `, ${exp.company}`,
                  size: 22,
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { before: expIndex === 0 ? 0 : 120, after: 60 },
            }),
          );

          // Dates in italics
          if (exp.startDate || exp.endDate) {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${exp.startDate || ""} - ${exp.endDate || ""}`,
                    size: 20,
                    italics: true,
                    color: "666666",
                  }),
                ],
                alignment: AlignmentType.LEFT,
                spacing: { after: 80 },
              }),
            );
          }

          // Responsibilities as bullet points (standard bullets for ATS)
          if (exp.responsibilities && exp.responsibilities.length > 0) {
            exp.responsibilities.forEach((resp) => {
              sections.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${resp}`,
                      size: 22,
                    }),
                  ],
                  alignment: AlignmentType.LEFT,
                  indent: { left: 400 }, // Indent for bullets
                  spacing: { before: 40, after: 40 },
                }),
              );
            });
          }
        });
      }

      // ===== EDUCATION SECTION =====
      if (resumeData.education && resumeData.education.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "EDUCATION",
                bold: true,
                size: 24,
                allCaps: true,
              }),
            ],
            alignment: AlignmentType.LEFT,
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 3,
                color: "000000",
              },
            },
            spacing: { before: 240, after: 120 },
          }),
        );

        resumeData.education.forEach((edu, eduIndex) => {
          // Degree
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree,
                  bold: true,
                  size: 22,
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { before: eduIndex === 0 ? 0 : 120 },
            }),
          );

          // Institution and dates
          const institutionLine = [
            edu.institution,
            edu.startYear || edu.endYear
              ? `(${edu.startYear || ""}${edu.startYear && edu.endYear ? " - " : ""}${edu.endYear || ""})`
              : "",
          ]
            .filter(Boolean)
            .join(" ");

          if (institutionLine) {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: institutionLine,
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.LEFT,
                spacing: { after: 80 },
              }),
            );
          }

          // GPA if provided
          if (edu.gpa) {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `GPA: ${edu.gpa}`,
                    size: 20,
                    italics: true,
                  }),
                ],
                alignment: AlignmentType.LEFT,
                spacing: { after: 80 },
              }),
            );
          }
        });
      }

      // ===== PROJECTS SECTION =====
      if (resumeData.projects && resumeData.projects.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "PROJECTS",
                bold: true,
                size: 24,
                allCaps: true,
              }),
            ],
            alignment: AlignmentType.LEFT,
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 3,
                color: "000000",
              },
            },
            spacing: { before: 240, after: 120 },
          }),
        );

        resumeData.projects.forEach((proj, projIndex) => {
          // Project title
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: proj.title,
                  bold: true,
                  size: 22,
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { before: projIndex === 0 ? 0 : 120 },
            }),
          );

          // Description
          if (proj.description) {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: proj.description,
                    size: 22,
                  }),
                ],
                alignment: AlignmentType.LEFT,
                spacing: { after: 40 },
              }),
            );
          }

          // Technologies
          if (proj.technologies && proj.technologies.length > 0) {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Technologies: ${proj.technologies.join(", ")}`,
                    size: 20,
                    italics: true,
                  }),
                ],
                alignment: AlignmentType.LEFT,
                spacing: { after: 80 },
              }),
            );
          }
        });
      }

      // ===== CERTIFICATIONS SECTION =====
      if (resumeData.certifications && resumeData.certifications.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "CERTIFICATIONS",
                bold: true,
                size: 24,
                allCaps: true,
              }),
            ],
            alignment: AlignmentType.LEFT,
            border: {
              bottom: {
                style: BorderStyle.SINGLE,
                size: 3,
                color: "000000",
              },
            },
            spacing: { before: 240, after: 120 },
          }),
        );

        resumeData.certifications.forEach((cert) => {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `• ${cert.name}`,
                  size: 22,
                }),
                cert.issuer
                  ? new TextRun({
                      text: ` - ${cert.issuer}`,
                      size: 20,
                      color: "666666",
                    })
                  : new TextRun({ text: "" }),
                cert.date
                  ? new TextRun({
                      text: ` (${cert.date})`,
                      size: 20,
                      color: "666666",
                      italics: true,
                    })
                  : new TextRun({ text: "" }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { before: 40 },
            }),
          );
        });
      }

      // ===== CREATE DOCUMENT =====
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
      const fileName = `${(resumeTitle || "resume").replace(/[^a-z0-9]/gi, "_")}.docx`;
      saveAs(blob, fileName);

      await incrementUsage("download");

      toast({
        title: "Success",
        description: "ATS-optimized DOCX downloaded",
      });
    } catch (error) {
      console.error("DOCX export error:", error);
      toast({
        title: "Error",
        description: "Failed to export DOCX",
        variant: "destructive",
      });
    }
  };

  // =============================
  // HTML GENERATION (FOR PREVIEW/PRINT)
  // =============================
  const formatDateExport = useCallback((date: string): string => {
    if (!date) return "";
    if (/^\d{4}$/.test(date)) return date;
    try {
      return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" });
    } catch {
      return date;
    }
  }, []);

  // Generic HTML must be defined BEFORE generateStyledHTML since it's used as a fallback
  const generateGenericHTML = useCallback((): string => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${resumeTitle || "Resume"}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0.5in; max-width: 8.5in; }
    h1 { text-align: center; margin-bottom: 0.5rem; }
    h2 { border-bottom: 2px solid #333; padding-bottom: 0.25rem; margin-top: 1.5rem; }
    .contact { text-align: center; color: #666; margin-bottom: 1rem; }
    ul { margin-left: 1.5rem; }
    li { margin-bottom: 0.25rem; }
    @media print { @page { margin: 0.5in; } }
  </style>
</head>
<body>
  <h1>${resumeData.contact.name}</h1>
  <p class="contact">${[resumeData.contact.title, resumeData.contact.email, resumeData.contact.phone, resumeData.contact.location].filter(Boolean).join(" • ")}</p>
  
  ${resumeData.summary ? `<h2>Summary</h2><p>${resumeData.summary}</p>` : ""}
  ${resumeData.skills.length > 0 ? `<h2>Skills</h2><p>${resumeData.skills.join(", ")}</p>` : ""}
  ${
    resumeData.experience.length > 0
      ? `
  <h2>Experience</h2>
  ${resumeData.experience
    .map(
      (exp) => `
    <p><strong>${exp.title}</strong> - ${exp.company}</p>
    <p><em>${exp.startDate} - ${exp.endDate}</em></p>
    <ul>${exp.responsibilities.map((r) => `<li>${r}</li>`).join("")}</ul>
  `,
    )
    .join("")}`
      : ""
  }
</body>
</html>`;
  }, [resumeTitle, resumeData]);

  const generateStyledHTML = useCallback((): string => {
    const selectedTemplateObj = templates.find((t: any) => t.id === selectedTemplate);
    const templateContent = selectedTemplateObj?.json_content;

    if (!templateContent || templateContent.type !== "markdown") {
      return generateGenericHTML();
    }

    const theme = templateContent.theme || {};
    const markdownTemplate = templateContent.markdown_template || "";
    const templateCSS = templateContent.css || "";

    // Prepare template data
    const templateData = {
      contact: {
        name: resumeData.contact.name || "Your Name",
        title: resumeData.contact.title || "Professional Title",
        email: resumeData.contact.email || "",
        phone: resumeData.contact.phone || "",
        location: resumeData.contact.location || "",
        linkedin: resumeData.contact.linkedin || "",
        portfolio: resumeData.contact.portfolio || "",
        github: resumeData.contact.github || "",
      },
      summary: resumeData.summary || "",
      experience: resumeData.experience.map((exp) => ({
        title: exp.title || "Job Title",
        company: exp.company || "Company Name",
        startDate: formatDateExport(exp.startDate) || "Start",
        endDate: exp.endDate === "Present" ? "Present" : formatDateExport(exp.endDate) || "Present",
        responsibilities: Array.isArray(exp.responsibilities) ? exp.responsibilities : [],
      })),
      education: resumeData.education.map((edu) => ({
        degree: edu.degree || "Degree",
        institution: edu.institution || "Institution",
        startYear: edu.startYear || "",
        endYear: edu.endYear || "",
        gpa: edu.gpa || "",
      })),
      skills: resumeData.skills || [],
      projects: (resumeData.projects || []).map((proj) => ({
        title: proj.title || "Project",
        description: proj.description || "",
        technologies: Array.isArray(proj.technologies) ? proj.technologies : [],
        link: proj.link || "",
      })),
      certifications: (resumeData.certifications || []).map((cert) => ({
        name: cert.name || "Certification",
        issuer: cert.issuer || "",
        date: cert.date || "",
      })),
      hasExperience: resumeData.experience.length > 0,
      hasEducation: resumeData.education.length > 0,
      hasSkills: resumeData.skills.length > 0,
      hasProjects: (resumeData.projects || []).length > 0,
      hasCertifications: (resumeData.certifications || []).length > 0,
    };

    // Render markdown
    let renderedMarkdown = "";
    try {
      renderedMarkdown = Mustache.render(markdownTemplate, templateData);
    } catch (error) {
      console.error("Mustache render error:", error);
      renderedMarkdown = "# Resume\n\nError rendering template. Please try a different template.";
    }

    // Convert markdown to HTML with proper structure
    const htmlContent = renderedMarkdown
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/^---$/gm, "<hr>")
      .split("\n")
      .map((line) => {
        line = line.trim();
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return `<li>${line.substring(2)}</li>`;
        }
        if (line.startsWith("• ")) {
          return `<li>${line.substring(2)}</li>`;
        }
        return line;
      })
      .join("\n")
      .replace(/(<li>[\s\S]*?<\/li>\n?)+/g, (match) => {
        // Wrap consecutive li elements in ul
        if (match.includes("</li>")) {
          return `<ul>${match}</ul>`;
        }
        return match;
      })
      .replace(/\n\n+/g, "</p><p>")
      .replace(/\n/g, "<br>");

    // Wrap content if needed
    const finalContent = htmlContent.startsWith("<") ? htmlContent : `<p>${htmlContent}</p>`;

    // Replace #SCOPE with #resume in template CSS
    const scopedCSS = templateCSS.replace(/#SCOPE/g, "#resume");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resumeTitle || "Resume"} - ${resumeData.contact.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Playfair+Display:wght@400;600;700&family=Roboto+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      background: #f5f5f5;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      font-family: ${theme.fontFamily || "Inter, sans-serif"};
    }
    
    #resume {
      background: white;
      width: 8.5in;
      min-height: 11in;
      padding: 0.75in;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      color: ${theme.primaryColor || "#1a1a1a"};
      line-height: 1.6;
    }
    
    #resume h1 { 
      font-family: ${theme.headingFont || theme.fontFamily || "Inter, sans-serif"};
      margin-bottom: 0.5rem;
      color: ${theme.primaryColor || "#1a1a1a"};
    }
    
    #resume h2 { 
      font-family: ${theme.headingFont || theme.fontFamily || "Inter, sans-serif"};
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      color: ${theme.primaryColor || "#1a1a1a"};
    }
    
    #resume h3 { 
      font-family: ${theme.headingFont || theme.fontFamily || "Inter, sans-serif"};
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      color: ${theme.primaryColor || "#1a1a1a"};
    }
    
    #resume p { margin-bottom: 0.75rem; }
    #resume ul { margin-left: 1.5rem; margin-bottom: 0.75rem; }
    #resume li { margin-bottom: 0.5rem; }
    #resume strong { font-weight: 600; }
    #resume a { 
      color: ${theme.accentColor || "#3b82f6"};
      text-decoration: none;
    }
    #resume hr { 
      border: none;
      border-top: 2px solid ${theme.accentColor || "#3b82f6"};
      margin: 1.5rem 0;
    }
    
    /* Template-specific styles */
    ${scopedCSS}
    
    /* Print styles */
    @media print {
      body {
        background: white !important;
        padding: 0 !important;
      }
      
      #resume {
        width: 100% !important;
        min-height: auto !important;
        padding: 0.5in !important;
        box-shadow: none !important;
        margin: 0 !important;
      }
      
      @page {
        margin: 0.5in;
        size: letter;
      }
      
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <div id="resume">
    ${finalContent}
  </div>
</body>
</html>`;
  }, [templates, selectedTemplate, resumeData, resumeTitle, formatDateExport, generateGenericHTML]);

  // =============================
  // EXPORT FUNCTIONS
  // =============================
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
      const blob = new Blob([htmlContent], { type: "text/html" });
      const fileName = `${(resumeTitle || "resume").replace(/[^a-z0-9]/gi, "_")}.html`;
      saveAs(blob, fileName);

      await incrementUsage("download");

      toast({
        title: "Success",
        description: "HTML resume downloaded. Open in browser and use 'Print' > 'Save as PDF' for best quality.",
      });
    } catch (error) {
      console.error("HTML export error:", error);
      toast({
        title: "Error",
        description: "Failed to export HTML",
        variant: "destructive",
      });
    }
  };

  const printToPDF = useCallback(() => {
    const htmlContent = generateStyledHTML();
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast({
        title: "Popup Blocked",
        description: "Please allow popups to generate PDF",
        variant: "destructive",
      });
      return;
    }

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Auto-print after a delay, then close window to prevent memory leak
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      // Close the window after printing to free memory
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    }, 500);

    toast({
      title: "Opening Print Dialog",
      description: "Select 'Save as PDF' to download your styled resume",
    });
  }, [generateStyledHTML, toast]);

  // =============================
  // FORM CONTENT
  // =============================
  const formContent = (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Resume Title</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            placeholder="e.g., Software Engineer Resume"
            className="text-lg font-semibold"
          />
        </CardContent>
      </Card>

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
                onChange={(e) => updateContact("name", e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={resumeData.contact.title}
                onChange={(e) => updateContact("title", e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={resumeData.contact.email}
                onChange={(e) => updateContact("email", e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={resumeData.contact.phone}
                onChange={(e) => updateContact("phone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={resumeData.contact.location}
                onChange={(e) => updateContact("location", e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                value={resumeData.contact.linkedin}
                onChange={(e) => updateContact("linkedin", e.target.value)}
                placeholder="linkedin.com/in/johnsmith"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={resumeData.summary}
            onChange={(e) => setResumeData((prev) => ({ ...prev, summary: e.target.value }))}
            placeholder="Briefly describe your professional background, skills, and career objectives..."
            rows={4}
          />
        </CardContent>
      </Card>

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
                <Button onClick={() => removeExperience(index)} size="sm" variant="ghost">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => updateExperience(index, "title", e.target.value)}
                />
                <Input
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                />
                <Input
                  placeholder="Start Date (e.g., 2020)"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                />
                <Input
                  placeholder="End Date or 'Present'"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                />
              </div>
              <Textarea
                placeholder="Describe your responsibilities and achievements (one per line)..."
                value={exp.responsibilities.join("\n")}
                onChange={(e) => updateExperience(index, "responsibilities", e.target.value.split("\n"))}
                rows={3}
              />
            </div>
          ))}
        </CardContent>
      </Card>

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
                <Button onClick={() => removeEducation(index)} size="sm" variant="ghost">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(index, "degree", e.target.value)}
                />
                <Input
                  placeholder="Institution"
                  value={edu.institution}
                  onChange={(e) => updateEducation(index, "institution", e.target.value)}
                />
                <Input
                  placeholder="Start Year"
                  value={edu.startYear}
                  onChange={(e) => updateEducation(index, "startYear", e.target.value)}
                />
                <Input
                  placeholder="End Year"
                  value={edu.endYear}
                  onChange={(e) => updateEducation(index, "endYear", e.target.value)}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a skill (e.g., JavaScript, AWS, React)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
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
                <button onClick={() => removeSkill(index)} className="hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
            <p className="text-sm text-muted-foreground text-center py-4">No certifications added yet</p>
          ) : (
            (resumeData.certifications || []).map((cert, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-end">
                  <Button onClick={() => removeCertification(index)} size="sm" variant="ghost">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Certification Name"
                    value={cert.name}
                    onChange={(e) => updateCertification(index, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Issuer"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                  />
                  <Input
                    placeholder="Date"
                    value={cert.date || ""}
                    onChange={(e) => updateCertification(index, "date", e.target.value)}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );

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

  if (templates.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No templates available</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate("/dashboard")} variant="ghost">
                ← Back
              </Button>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowAIGenerator(true)} variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/10">
                <Sparkles className="w-4 h-4" />
                AI Generate
              </Button>
              <Button onClick={saveResume} disabled={saving} variant="default">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>

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
                      <p className="font-medium">Download PDF</p>
                      <p className="text-xs text-muted-foreground">Best quality (browser print)</p>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={exportHTML} className="cursor-pointer">
                    <FileCode className="w-4 h-4 mr-2" />
                    <div>
                      <p className="font-medium">Download HTML</p>
                      <p className="text-xs text-muted-foreground">Styled template for web/email</p>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={exportDOCX} className="cursor-pointer">
                    <FileText className="w-4 h-4 mr-2" />
                    <div>
                      <p className="font-medium">Download DOCX</p>
                      <p className="text-xs text-muted-foreground">ATS-optimized for job applications</p>
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

      <div className="hidden lg:grid lg:grid-cols-2 h-[calc(100vh-65px)]">
        <div className="overflow-y-auto border-r">{formContent}</div>
        <div className="overflow-y-auto bg-muted/20 p-6 flex items-start justify-center">
          <div className="w-full" style={{ maxWidth: "850px" }}>
            <ResumeTemplatePreview resumeData={debouncedResumeData} templateId={selectedTemplate} templates={memoizedTemplates} />
          </div>
        </div>
      </div>

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
              <ResumeTemplatePreview resumeData={debouncedResumeData} templateId={selectedTemplate} templates={memoizedTemplates} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Resume Generator Dialog */}
      <AIResumeGeneratorDialog
        open={showAIGenerator}
        onOpenChange={setShowAIGenerator}
        onGenerated={(data) => setResumeData(data)}
        currentName={resumeData.contact.name}
        currentEmail={resumeData.contact.email}
        currentPhone={resumeData.contact.phone}
      />
    </div>
  );
};

export default ResumeEditor;
