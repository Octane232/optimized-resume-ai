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
      let processedHtml = htmlContent || '';
      Object.entries(miniData).forEach(([key, value]) => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        processedHtml = processedHtml.replace(regex, value);
      });

      // Remove template syntax for arrays (simplified for thumbnail)
      processedHtml = processedHtml.replace(/{{#\w+}}[\s\S]*?{{\/\w+}}/g, '');
      processedHtml = processedHtml.replace(/{{[^}]+}}/g, '...');

      // Create complete HTML document for thumbnail with scaling
      const thumbnailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            html, body {
              width: 400%;
              height: 400%;
              overflow: hidden;
              transform: scale(0.25);
              transform-origin: top left;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              background: white;
              color: #1a1a1a;
              line-height: 1.6;
              pointer-events: none;
              user-select: none;
            }
          </style>
        </head>
        <body>
          ${processedHtml}
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