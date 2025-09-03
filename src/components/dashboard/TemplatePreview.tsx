"use client";

import { useEffect, useRef } from "react";

interface TemplatePreviewProps {
  template: {
    id: string;
    name: string;
    category: string;
    html_content: string | null;
  } | null;
  resumeData: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    summary?: string;
    experiences?: { title: string; company: string; startDate: string; endDate: string; description: string }[];
    education?: { degree: string; school: string; startDate: string; endDate: string }[];
    skills?: string[];
    projects?: { name: string; description: string }[];
  } | null;
}

export default function TemplatePreview({ template, resumeData }: TemplatePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!template || !template.html_content || !iframeRef.current || !resumeData) return;

    let finalHTML = template.html_content;

    // 🔹 Simple placeholder replacements
    finalHTML = finalHTML.replace(/{{\s*fullName\s*}}/g, resumeData.fullName || "");
    finalHTML = finalHTML.replace(/{{\s*email\s*}}/g, resumeData.email || "");
    finalHTML = finalHTML.replace(/{{\s*phone\s*}}/g, resumeData.phone || "");
    finalHTML = finalHTML.replace(/{{\s*address\s*}}/g, resumeData.address || "");
    finalHTML = finalHTML.replace(/{{\s*summary\s*}}/g, resumeData.summary || "");

    // 🔹 Experiences
    if (Array.isArray(resumeData.experiences)) {
      let expHTML = "";
      resumeData.experiences.forEach((exp) => {
        expHTML += `
          <div class="experience">
            <h3>${exp.title || ""} - ${exp.company || ""}</h3>
            <p>${exp.startDate || ""} - ${exp.endDate || ""}</p>
            <p>${exp.description || ""}</p>
          </div>
        `;
      });
      finalHTML = finalHTML.replace(/{{\s*#each experiences\s*}}[\s\S]*{{\s*\/each\s*}}/g, expHTML);
    }

    // 🔹 Education
    if (Array.isArray(resumeData.education)) {
      let eduHTML = "";
      resumeData.education.forEach((edu) => {
        eduHTML += `
          <div class="education">
            <h3>${edu.degree || ""} - ${edu.school || ""}</h3>
            <p>${edu.startDate || ""} - ${edu.endDate || ""}</p>
          </div>
        `;
      });
      finalHTML = finalHTML.replace(/{{\s*#each education\s*}}[\s\S]*{{\s*\/each\s*}}/g, eduHTML);
    }

    // 🔹 Projects
    if (Array.isArray(resumeData.projects)) {
      let projHTML = "";
      resumeData.projects.forEach((proj) => {
        projHTML += `
          <div class="project">
            <h3>${proj.name || ""}</h3>
            <p>${proj.description || ""}</p>
          </div>
        `;
      });
      finalHTML = finalHTML.replace(/{{\s*#each projects\s*}}[\s\S]*{{\s*\/each\s*}}/g, projHTML);
    }

    // 🔹 Skills
    if (Array.isArray(resumeData.skills)) {
      const skillsHTML = resumeData.skills.map((skill) => `<li>${skill}</li>`).join("");
      finalHTML = finalHTML.replace(/{{\s*#each skills\s*}}[\s\S]*{{\s*\/each\s*}}/g, `<ul>${skillsHTML}</ul>`);
    }

    // 🔹 Cleanup remaining placeholders
    finalHTML = finalHTML.replace(/{{[^}]*}}/g, "");

    // 🔹 Write to iframe safely
    const iframe = iframeRef.current;
    if (iframe?.contentDocument) {
      iframe.contentDocument.open();
      iframe.contentDocument.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h3 { margin: 0; }
              p { margin: 2px 0; }
            </style>
          </head>
          <body>
            ${finalHTML}
          </body>
        </html>
      `);
      iframe.contentDocument.close();
    }
  }, [template, resumeData]);

  return (
    <div className="w-full h-full border rounded-lg overflow-hidden shadow-lg">
      {template ? (
        <iframe
          ref={iframeRef}
          title="Template Preview"
          className="w-full h-[600px]"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      ) : (
        <p className="p-4 text-gray-500">Select a template to preview</p>
      )}
    </div>
  );
}
