import React, { useEffect, useRef, memo } from "react";

interface TemplateThumbnailProps {
  htmlContent: string;
  className?: string;
}

const TemplateThumbnail: React.FC<TemplateThumbnailProps> = memo(({
  htmlContent,
  className = "",
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (htmlContent && iframeRef.current) {
      // Mini sample data for thumbnail
      const miniData = {
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
        programmingLanguages: "JavaScript, Python",
        frameworks: "React, Node.js",
        tools: "Git, Docker",
        databases: "PostgreSQL, MongoDB",
      };

      // Replace placeholders
      let processedHtml = htmlContent || "";
      Object.entries(miniData).forEach(([key, value]) => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
        processedHtml = processedHtml.replace(regex, value);
      });

      // Replace arrays with simple placeholders
      processedHtml = processedHtml.replace(
        /{{#\w+}}[\s\S]*?{{\/\w+}}/g,
        "<div>...</div>"
      );
      processedHtml = processedHtml.replace(/{{[^}]+}}/g, "...");

      // Wrap in scaling container
      const thumbnailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              margin: 0;
              font-family: system-ui, sans-serif;
              background: white;
              color: #1a1a1a;
              line-height: 1.4;
              pointer-events: none;
              user-select: none;
            }
            .scale-wrapper {
              transform: scale(0.25);
              transform-origin: top left;
              width: 400%;
              height: 400%;
            }
          </style>
        </head>
        <body>
          <div class="scale-wrapper">
            ${processedHtml}
          </div>
        </body>
        </html>
      `;

      const iframeDoc =
        iframeRef.current.contentDocument ||
        iframeRef.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(thumbnailHtml);
        iframeDoc.close();
      }
    }
  }, [htmlContent]);

  return (
    <iframe
      ref={iframeRef}
      className={`w-full h-full border-0 pointer-events-none ${className}`}
      title="Template Thumbnail"
      sandbox="allow-same-origin"
    />
  );
});

TemplateThumbnail.displayName = 'TemplateThumbnail';

export default TemplateThumbnail;