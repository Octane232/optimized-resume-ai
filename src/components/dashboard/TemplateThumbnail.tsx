import React, { useEffect, useRef } from 'react';

interface TemplateThumbnailProps {
  htmlContent: string;
  className?: string;
}

const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({ htmlContent, className = '' }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (htmlContent && iframeRef.current) {
      // Mini sample data for thumbnail
      const miniData = {
        fullName: 'John Smith',
        title: 'Software Engineer',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/john',
        github: 'github.com/john',
        portfolio: 'johnsmith.dev',
        summary: 'Experienced software engineer with expertise in web development.',
        programmingLanguages: 'JavaScript, Python',
        frameworks: 'React, Node.js',
        tools: 'Git, Docker',
        databases: 'PostgreSQL, MongoDB'
      };

      // Simple replacement for thumbnail
      let processedHtml = htmlContent;
      Object.entries(miniData).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processedHtml = processedHtml.replace(regex, value);
      });

      // Remove template syntax for arrays (simplified for thumbnail)
      processedHtml = processedHtml.replace(/{{#\w+}}[\s\S]*?{{\/\w+}}/g, '');
      processedHtml = processedHtml.replace(/{{[^}]+}}/g, '...');

      // Add scale transform for thumbnail
      const thumbnailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              transform: scale(0.25);
              transform-origin: top left;
              width: 400%;
              height: 400%;
              overflow: hidden;
              pointer-events: none;
            }
          </style>
        </head>
        <body>
          ${processedHtml.replace(/<html[^>]*>|<\/html>|<head>[\s\S]*?<\/head>|<body[^>]*>|<\/body>/gi, '')}
        </body>
        </html>
      `;

      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
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
};

export default TemplateThumbnail;