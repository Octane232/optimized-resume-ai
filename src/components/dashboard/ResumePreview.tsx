import React, { useEffect, useRef } from "react";

interface TemplatePreviewProps {
  template: {
    html_content: string;
  } | null;
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ template }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!template?.html_content || !iframeRef.current) {
      console.warn("Missing template or iframe");
      return;
    }

    // Sample data to replace placeholders
    const sampleData = {
      fullName: "John Smith",
      title: "Software Engineer",
      email: "john@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/john",
      github: "github.com/john",
      portfolio: "johnsmith.dev",
      summary:
        "Experienced software engineer with expertise in web development.",
      skills: ["React", "Node.js", "TypeScript"],
    };

    let finalHTML = template.html_content;

    // Replace placeholders like {{fullName}}
    Object.entries(sampleData).forEach(([key, value]) => {
      if (typeof value === "string") {
        finalHTML = finalHTML.replace(
          new RegExp(`{{\\s*${key}\\s*}}`, "g"),
          value
        );
      }
    });

    // Clean up unfilled placeholders
    finalHTML = finalHTML.replace(/{{[^}]+}}/g, "");

    // Wrap in full HTML if it’s a fragment
    if (!finalHTML.includes("<html")) {
      finalHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #1a1a1a;
              padding: 20px;
            }
          </style>
        </head>
        <body>
          ${finalHTML}
        </body>
        </html>
      `;
    }

    const iframeDoc =
      iframeRef.current.contentDocument ||
      iframeRef.current.contentWindow?.document;

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(finalHTML);
      iframeDoc.close();
    }
  }, [template]);

  if (!template) return null;

  return (
    <iframe
      ref={iframeRef}
      title="Template Preview"
      className="w-full h-[600px] border rounded"
      // 👇 NO sandbox here, so scripts and CSS will run
      style={{ background: "white" }}
    />
  );
};

export default TemplatePreview;
