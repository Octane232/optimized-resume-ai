-- Update sample templates with proper Mustache syntax
UPDATE resume_templates
SET html_content = '<div class="header">
  <h1>{{name}}</h1>
  <p class="title">{{title}}</p>
  <div class="contact-info">
    <span>{{email}}</span>
    <span>{{phone}}</span>
    <span>{{location}}</span>
  </div>
</div>

{{#hasSkills}}
<div class="section">
  <h2>Skills</h2>
  <div class="skills-container">
    {{#skills}}
      <span class="skill">{{skill}}</span>
    {{/skills}}
  </div>
</div>
{{/hasSkills}}

<div class="section">
  <h2>Professional Summary</h2>
  <p>{{summary}}</p>
</div>

{{#hasExperience}}
<div class="section">
  <h2>Professional Experience</h2>
  {{#experience}}
  <div class="experience-item">
    <h3>{{title}}</h3>
    <p class="company">{{company}} | {{startDate}} - {{endDate}}</p>
    {{#hasResponsibilities}}
    <ul>
      {{#responsibilities}}
        <li>{{responsibility}}</li>
      {{/responsibilities}}
    </ul>
    {{/hasResponsibilities}}
  </div>
  {{/experience}}
</div>
{{/hasExperience}}

{{#hasEducation}}
<div class="section">
  <h2>Education</h2>
  {{#education}}
  <div class="education-item">
    <h3>{{degree}}</h3>
    <p>{{institution}} | {{startYear}} - {{endYear}}</p>
    {{#gpa}}<p>GPA: {{gpa}}</p>{{/gpa}}
  </div>
  {{/education}}
</div>
{{/hasEducation}}'
WHERE name = 'Modern';

UPDATE resume_templates
SET html_content = '<div style="text-align: center; margin-bottom: 30px;">
  <h1 style="margin-bottom: 10px;">{{name}}</h1>
  <p>{{email}} | {{phone}} | {{location}}</p>
</div>

<div class="section">
  <h2 style="border-bottom: 1px solid #333; padding-bottom: 5px;">OBJECTIVE</h2>
  <p>{{summary}}</p>
</div>

{{#hasSkills}}
<div class="section">
  <h2 style="border-bottom: 1px solid #333; padding-bottom: 5px;">SKILLS</h2>
  <p>{{skillsList}}</p>
</div>
{{/hasSkills}}

{{#hasExperience}}
<div class="section">
  <h2 style="border-bottom: 1px solid #333; padding-bottom: 5px;">PROFESSIONAL EXPERIENCE</h2>
  {{#experience}}
  <div class="experience-item">
    <strong>{{title}}</strong><br/>
    <em>{{company}}</em> | {{startDate}} - {{endDate}}<br/>
    {{#hasResponsibilities}}
    <ul style="margin-top: 5px;">
      {{#responsibilities}}
        <li>{{responsibility}}</li>
      {{/responsibilities}}
    </ul>
    {{/hasResponsibilities}}
  </div>
  {{/experience}}
</div>
{{/hasExperience}}

{{#hasEducation}}
<div class="section">
  <h2 style="border-bottom: 1px solid #333; padding-bottom: 5px;">EDUCATION</h2>
  {{#education}}
  <div class="education-item">
    <strong>{{degree}}</strong><br/>
    {{institution}} | {{startYear}} - {{endYear}}
    {{#gpa}}<br/>GPA: {{gpa}}{{/gpa}}
  </div>
  {{/education}}
</div>
{{/hasEducation}}'
WHERE name = 'Classic';

UPDATE resume_templates
SET html_content = '<div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
  <h1 style="margin: 0;">{{name}}</h1>
  <p style="font-size: 1.2em; margin: 10px 0;">{{title}}</p>
  <div class="contact-info">
    <span style="margin-right: 15px;">{{email}}</span>
    <span style="margin-right: 15px;">{{phone}}</span>
    <span>{{location}}</span>
  </div>
</div>

<div style="padding: 30px;">
  <div class="section">
    <h2 style="color: #667eea;">Professional Summary</h2>
    <p>{{summary}}</p>
  </div>

  {{#hasSkills}}
  <div class="section">
    <h2 style="color: #667eea;">Core Competencies</h2>
    <div class="skills-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
      {{#skills}}
        <div style="background: #f7fafc; padding: 8px; border-radius: 5px; text-align: center;">{{skill}}</div>
      {{/skills}}
    </div>
  </div>
  {{/hasSkills}}

  {{#hasExperience}}
  <div class="section">
    <h2 style="color: #667eea;">Professional Experience</h2>
    {{#experience}}
    <div class="experience-item" style="margin-bottom: 20px;">
      <h3 style="color: #4a5568;">{{title}}</h3>
      <p style="color: #718096;">{{company}} | {{startDate}} - {{endDate}}</p>
      {{#hasResponsibilities}}
      <ul>
        {{#responsibilities}}
          <li>{{responsibility}}</li>
        {{/responsibilities}}
      </ul>
      {{/hasResponsibilities}}
    </div>
    {{/experience}}
  </div>
  {{/hasExperience}}

  {{#hasEducation}}
  <div class="section">
    <h2 style="color: #667eea;">Education</h2>
    {{#education}}
    <div class="education-item">
      <h3 style="color: #4a5568;">{{degree}}</h3>
      <p style="color: #718096;">{{institution}} | {{startYear}} - {{endYear}}</p>
      {{#gpa}}<p>GPA: {{gpa}}</p>{{/gpa}}
    </div>
    {{/education}}
  </div>
  {{/hasEducation}}

  {{#hasProjects}}
  <div class="section">
    <h2 style="color: #667eea;">Projects</h2>
    {{#projects}}
    <div class="project-item" style="margin-bottom: 15px;">
      <h3 style="color: #4a5568;">{{title}}</h3>
      <p>{{description}}</p>
      {{#technologies}}<p style="color: #718096; font-size: 0.9em;">Technologies: {{technologies}}</p>{{/technologies}}
    </div>
    {{/projects}}
  </div>
  {{/hasProjects}}
</div>'
WHERE name = 'Creative';

-- Add a new Executive template with Mustache syntax
INSERT INTO resume_templates (name, category, description, html_content, preview_image, color_class, is_popular, rating, downloads)
VALUES (
  'Executive',
  'Professional',
  'Sophisticated template for senior professionals',
  '<div class="executive-header" style="border-bottom: 3px solid #2c3e50; padding-bottom: 20px; margin-bottom: 30px;">
  <h1 style="color: #2c3e50; margin: 0;">{{name}}</h1>
  <p style="color: #7f8c8d; font-size: 1.3em; margin: 10px 0;">{{title}}</p>
  <div style="color: #34495e;">
    {{email}} • {{phone}} • {{location}}
    {{#linkedin}}<br/>LinkedIn: {{linkedin}}{{/linkedin}}
  </div>
</div>

<div class="executive-summary" style="margin-bottom: 30px;">
  <h2 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #ecf0f1; padding-bottom: 5px;">EXECUTIVE SUMMARY</h2>
  <p style="line-height: 1.6;">{{summary}}</p>
</div>

{{#hasSkills}}
<div class="core-competencies" style="margin-bottom: 30px;">
  <h2 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #ecf0f1; padding-bottom: 5px;">CORE COMPETENCIES</h2>
  <div style="columns: 2; column-gap: 30px;">
    {{#skills}}
      <div style="break-inside: avoid;">• {{skill}}</div>
    {{/skills}}
  </div>
</div>
{{/hasSkills}}

{{#hasExperience}}
<div class="professional-experience" style="margin-bottom: 30px;">
  <h2 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #ecf0f1; padding-bottom: 5px;">PROFESSIONAL EXPERIENCE</h2>
  {{#experience}}
  <div style="margin: 20px 0;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h3 style="color: #2c3e50; margin: 0;">{{title}}</h3>
      <span style="color: #7f8c8d;">{{startDate}} - {{endDate}}</span>
    </div>
    <p style="color: #34495e; font-style: italic; margin: 5px 0;">{{company}}</p>
    {{#hasResponsibilities}}
    <ul style="margin-top: 10px;">
      {{#responsibilities}}
        <li>{{responsibility}}</li>
      {{/responsibilities}}
    </ul>
    {{/hasResponsibilities}}
  </div>
  {{/experience}}
</div>
{{/hasExperience}}

{{#hasEducation}}
<div class="education" style="margin-bottom: 30px;">
  <h2 style="color: #2c3e50; font-size: 1.3em; border-bottom: 1px solid #ecf0f1; padding-bottom: 5px;">EDUCATION</h2>
  {{#education}}
  <div style="margin: 15px 0;">
    <strong>{{degree}}</strong><br/>
    {{institution}} | {{startYear}} - {{endYear}}
    {{#gpa}}<br/>GPA: {{gpa}}{{/gpa}}
  </div>
  {{/education}}
</div>
{{/hasEducation}}',
  '/executive-preview.jpg',
  'bg-gradient-to-br from-slate-900 to-slate-700',
  true,
  4.9,
  1250
)
ON CONFLICT (name) DO UPDATE
SET html_content = EXCLUDED.html_content;