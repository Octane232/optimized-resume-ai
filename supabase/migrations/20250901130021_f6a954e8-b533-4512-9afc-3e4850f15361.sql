-- Create table for resume templates
CREATE TABLE public.resume_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  html_content TEXT NOT NULL,
  preview_image TEXT,
  is_popular BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]'::jsonb,
  rating DECIMAL(2,1) DEFAULT 0.0,
  downloads INTEGER DEFAULT 0,
  color_class TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resume_templates ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view templates" 
  ON public.resume_templates 
  FOR SELECT 
  USING (true);

-- Create policy for admin management
CREATE POLICY "Service role can manage templates" 
  ON public.resume_templates 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Insert the 4 ATS-friendly templates
INSERT INTO public.resume_templates (name, category, description, is_popular, features, rating, downloads, color_class, html_content) VALUES 

-- Modern Template
('Modern Professional', 'Modern', 'Clean, ATS-friendly modern design perfect for tech and business roles', true, 
 '["ATS-Optimized", "Modern Design", "Customizable Colors", "Clean Layout"]'::jsonb, 
 4.9, 12300, 'from-blue-500 to-blue-600',
 '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Professional Resume</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ''Calibri'', ''Arial'', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
        .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        h1 { font-size: 32px; color: #1e40af; margin-bottom: 10px; }
        .contact-info { display: flex; flex-wrap: wrap; gap: 15px; color: #64748b; font-size: 14px; }
        .contact-info span { display: flex; align-items: center; }
        h2 { color: #1e40af; font-size: 20px; margin-top: 25px; margin-bottom: 15px; border-bottom: 2px solid #ddd; padding-bottom: 5px; }
        .experience-item, .education-item { margin-bottom: 20px; }
        .job-title { font-weight: bold; font-size: 18px; color: #1f2937; }
        .company { color: #6b7280; font-size: 16px; margin-bottom: 5px; }
        .date { color: #9ca3af; font-size: 14px; margin-bottom: 10px; }
        ul { margin-left: 20px; margin-top: 10px; }
        li { margin-bottom: 8px; color: #4b5563; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
        .skill { background: #eff6ff; color: #1e40af; padding: 5px 12px; border-radius: 15px; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{fullName}}</h1>
        <p style="font-size: 18px; color: #64748b; margin-bottom: 15px;">{{title}}</p>
        <div class="contact-info">
            <span>📧 {{email}}</span>
            <span>📱 {{phone}}</span>
            <span>📍 {{location}}</span>
            <span>🔗 {{linkedin}}</span>
        </div>
    </div>

    <section>
        <h2>Professional Summary</h2>
        <p>{{summary}}</p>
    </section>

    <section>
        <h2>Experience</h2>
        {{#experiences}}
        <div class="experience-item">
            <div class="job-title">{{position}}</div>
            <div class="company">{{company}} | {{location}}</div>
            <div class="date">{{startDate}} - {{endDate}}</div>
            <ul>
                {{#achievements}}
                <li>{{.}}</li>
                {{/achievements}}
            </ul>
        </div>
        {{/experiences}}
    </section>

    <section>
        <h2>Education</h2>
        {{#education}}
        <div class="education-item">
            <div class="job-title">{{degree}}</div>
            <div class="company">{{institution}}</div>
            <div class="date">{{graduationDate}}</div>
        </div>
        {{/education}}
    </section>

    <section>
        <h2>Skills</h2>
        <div class="skills">
            {{#skills}}
            <span class="skill">{{.}}</span>
            {{/skills}}
        </div>
    </section>
</body>
</html>'),

-- Simple Template  
('Simple & Clean', 'Simple', 'Minimalist ATS-friendly design that focuses on content clarity', false,
 '["ATS-Optimized", "Clean Layout", "Easy to Read", "Professional"]'::jsonb,
 4.7, 8900, 'from-slate-500 to-slate-600',
 '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple Resume</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ''Georgia'', ''Times New Roman'', serif; line-height: 1.5; color: #000; max-width: 750px; margin: 0 auto; padding: 40px 20px; }
        h1 { font-size: 28px; font-weight: normal; margin-bottom: 5px; }
        .subtitle { font-size: 16px; color: #555; margin-bottom: 20px; }
        .contact { margin-bottom: 30px; font-size: 14px; }
        h2 { font-size: 18px; margin-top: 25px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .section { margin-bottom: 25px; }
        .entry { margin-bottom: 15px; }
        .entry-title { font-weight: bold; font-size: 16px; }
        .entry-subtitle { color: #666; font-size: 14px; margin-bottom: 5px; }
        .entry-date { color: #888; font-size: 13px; font-style: italic; margin-bottom: 8px; }
        ul { margin-left: 20px; margin-top: 5px; }
        li { margin-bottom: 5px; font-size: 14px; }
        .skills-list { font-size: 14px; line-height: 1.8; }
    </style>
</head>
<body>
    <header>
        <h1>{{fullName}}</h1>
        <div class="subtitle">{{title}}</div>
        <div class="contact">
            {{email}} | {{phone}} | {{location}}
        </div>
    </header>

    <div class="section">
        <h2>Summary</h2>
        <p>{{summary}}</p>
    </div>

    <div class="section">
        <h2>Professional Experience</h2>
        {{#experiences}}
        <div class="entry">
            <div class="entry-title">{{position}}</div>
            <div class="entry-subtitle">{{company}}, {{location}}</div>
            <div class="entry-date">{{startDate}} - {{endDate}}</div>
            <ul>
                {{#achievements}}
                <li>{{.}}</li>
                {{/achievements}}
            </ul>
        </div>
        {{/experiences}}
    </div>

    <div class="section">
        <h2>Education</h2>
        {{#education}}
        <div class="entry">
            <div class="entry-title">{{degree}}</div>
            <div class="entry-subtitle">{{institution}}</div>
            <div class="entry-date">{{graduationDate}}</div>
        </div>
        {{/education}}
    </div>

    <div class="section">
        <h2>Skills</h2>
        <div class="skills-list">{{#skills}}{{.}}, {{/skills}}</div>
    </div>
</body>
</html>'),

-- Tech Template
('Tech Specialist', 'Tech', 'Developer-focused ATS template with technical skills emphasis', true,
 '["ATS-Optimized", "Tech-Focused", "Skills Matrix", "Project Showcase"]'::jsonb,
 4.8, 15700, 'from-emerald-500 to-teal-600',
 '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tech Specialist Resume</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ''Consolas'', ''Monaco'', monospace; line-height: 1.6; color: #1a1a1a; max-width: 800px; margin: 0 auto; padding: 40px 20px; background: white; }
        .header { background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; padding: 30px; margin: -40px -20px 30px; }
        h1 { font-size: 32px; margin-bottom: 10px; }
        .tagline { font-size: 18px; opacity: 0.95; margin-bottom: 15px; }
        .contact-info { font-size: 14px; }
        .contact-info a { color: white; text-decoration: none; }
        h2 { color: #059669; font-size: 20px; margin-top: 30px; margin-bottom: 15px; padding-bottom: 5px; border-bottom: 2px solid #10b981; }
        .tech-stack { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 15px 0; }
        .tech-category { background: #f0fdf4; padding: 15px; border-radius: 8px; }
        .tech-category h3 { color: #059669; font-size: 14px; margin-bottom: 8px; text-transform: uppercase; }
        .tech-items { font-size: 13px; line-height: 1.8; color: #374151; }
        .project { margin-bottom: 20px; padding: 15px; background: #f9fafb; border-left: 4px solid #10b981; }
        .project-title { font-weight: bold; font-size: 16px; color: #1f2937; margin-bottom: 5px; }
        .project-tech { color: #059669; font-size: 13px; margin-bottom: 8px; }
        .experience-item { margin-bottom: 25px; }
        .job-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
        .job-title { font-weight: bold; font-size: 18px; color: #1f2937; }
        .job-date { color: #6b7280; font-size: 14px; }
        .company { color: #059669; font-size: 16px; margin-bottom: 10px; }
        ul { margin-left: 20px; margin-top: 10px; }
        li { margin-bottom: 8px; color: #374151; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{fullName}}</h1>
        <div class="tagline">{{title}}</div>
        <div class="contact-info">
            {{email}} | {{phone}} | {{location}} | <a href="{{github}}">GitHub</a> | <a href="{{linkedin}}">LinkedIn</a>
        </div>
    </div>

    <section>
        <h2>// Technical Skills</h2>
        <div class="tech-stack">
            <div class="tech-category">
                <h3>Languages</h3>
                <div class="tech-items">{{programmingLanguages}}</div>
            </div>
            <div class="tech-category">
                <h3>Frameworks</h3>
                <div class="tech-items">{{frameworks}}</div>
            </div>
            <div class="tech-category">
                <h3>Tools & Platforms</h3>
                <div class="tech-items">{{tools}}</div>
            </div>
            <div class="tech-category">
                <h3>Databases</h3>
                <div class="tech-items">{{databases}}</div>
            </div>
        </div>
    </section>

    <section>
        <h2>// Professional Summary</h2>
        <p>{{summary}}</p>
    </section>

    <section>
        <h2>// Work Experience</h2>
        {{#experiences}}
        <div class="experience-item">
            <div class="job-header">
                <div class="job-title">{{position}}</div>
                <div class="job-date">{{startDate}} - {{endDate}}</div>
            </div>
            <div class="company">{{company}} | {{location}}</div>
            <ul>
                {{#achievements}}
                <li>{{.}}</li>
                {{/achievements}}
            </ul>
        </div>
        {{/experiences}}
    </section>

    <section>
        <h2>// Key Projects</h2>
        {{#projects}}
        <div class="project">
            <div class="project-title">{{name}}</div>
            <div class="project-tech">Technologies: {{technologies}}</div>
            <p>{{description}}</p>
        </div>
        {{/projects}}
    </section>

    <section>
        <h2>// Education</h2>
        {{#education}}
        <div class="experience-item">
            <div class="job-header">
                <div class="job-title">{{degree}}</div>
                <div class="job-date">{{graduationDate}}</div>
            </div>
            <div class="company">{{institution}}</div>
        </div>
        {{/education}}
    </section>
</body>
</html>'),

-- Creative Template
('Creative Designer', 'Creative', 'Eye-catching yet ATS-friendly layout for creative professionals', false,
 '["ATS-Optimized", "Creative Layout", "Visual Appeal", "Portfolio Ready"]'::jsonb,
 4.6, 6200, 'from-purple-500 to-pink-600',
 '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Resume</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: ''Helvetica Neue'', ''Arial'', sans-serif; line-height: 1.7; color: #2d3748; max-width: 800px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; padding: 40px 0; border-top: 5px solid; border-image: linear-gradient(90deg, #a855f7, #ec4899) 1; }
        h1 { font-size: 36px; font-weight: 300; letter-spacing: 2px; margin-bottom: 10px; color: #6b21a8; }
        .title { font-size: 20px; color: #ec4899; font-weight: 400; margin-bottom: 20px; letter-spacing: 1px; }
        .contact { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; font-size: 14px; color: #64748b; }
        .divider { height: 2px; background: linear-gradient(90deg, #a855f7, #ec4899); margin: 30px 0; opacity: 0.3; }
        h2 { color: #6b21a8; font-size: 22px; font-weight: 400; letter-spacing: 1px; margin-bottom: 20px; position: relative; padding-left: 20px; }
        h2:before { content: "◆"; position: absolute; left: 0; color: #ec4899; }
        .summary { font-style: italic; color: #4a5568; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #fdf4ff 0%, #fce7f3 100%); border-radius: 10px; }
        .experience-block { margin-bottom: 30px; padding-left: 20px; border-left: 3px solid #ec4899; }
        .role { font-size: 20px; font-weight: 500; color: #2d3748; margin-bottom: 5px; }
        .company-info { color: #64748b; font-size: 16px; margin-bottom: 10px; }
        .period { color: #94a3b8; font-size: 14px; font-style: italic; }
        ul { margin: 15px 0 0 20px; }
        li { margin-bottom: 10px; color: #4a5568; position: relative; list-style: none; padding-left: 20px; }
        li:before { content: "▸"; position: absolute; left: 0; color: #ec4899; }
        .skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; }
        .skill-item { background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%); padding: 10px 15px; border-radius: 20px; text-align: center; font-size: 14px; color: #6b21a8; border: 1px solid #e9d5ff; }
        .education-item { margin-bottom: 20px; }
        .degree { font-size: 18px; font-weight: 500; color: #2d3748; }
        .institution { color: #64748b; font-size: 16px; }
        .portfolio-section { background: #fdf4ff; padding: 20px; border-radius: 10px; margin-top: 20px; }
        .portfolio-title { color: #6b21a8; font-weight: 500; margin-bottom: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{fullName}}</h1>
        <div class="title">{{title}}</div>
        <div class="contact">
            <span>✉ {{email}}</span>
            <span>☎ {{phone}}</span>
            <span>📍 {{location}}</span>
            <span>🌐 {{portfolio}}</span>
        </div>
    </div>

    <div class="divider"></div>

    <section>
        <h2>About Me</h2>
        <div class="summary">{{summary}}</div>
    </section>

    <section>
        <h2>Creative Experience</h2>
        {{#experiences}}
        <div class="experience-block">
            <div class="role">{{position}}</div>
            <div class="company-info">{{company}} • {{location}}</div>
            <div class="period">{{startDate}} - {{endDate}}</div>
            <ul>
                {{#achievements}}
                <li>{{.}}</li>
                {{/achievements}}
            </ul>
        </div>
        {{/experiences}}
    </section>

    <section>
        <h2>Skills & Expertise</h2>
        <div class="skills-grid">
            {{#skills}}
            <div class="skill-item">{{.}}</div>
            {{/skills}}
        </div>
    </section>

    <section>
        <h2>Education</h2>
        {{#education}}
        <div class="education-item">
            <div class="degree">{{degree}}</div>
            <div class="institution">{{institution}} • {{graduationDate}}</div>
        </div>
        {{/education}}
    </section>

    {{#portfolio}}
    <section>
        <h2>Portfolio Highlights</h2>
        <div class="portfolio-section">
            <div class="portfolio-title">Featured Work:</div>
            <p>{{portfolioDescription}}</p>
            <p style="margin-top: 10px; color: #6b21a8;">View full portfolio at: {{portfolioUrl}}</p>
        </div>
    </section>
    {{/portfolio}}
</body>
</html>');

-- Create trigger for updated_at
CREATE TRIGGER update_resume_templates_updated_at
  BEFORE UPDATE ON public.resume_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();