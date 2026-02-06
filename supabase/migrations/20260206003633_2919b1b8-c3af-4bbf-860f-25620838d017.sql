-- Update Clean Minimal template with certifications and optional github
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{markdown_template}',
  '"# {{contact.name}}\n\n**{{contact.title}}**\n\n{{contact.email}}\n{{contact.phone}}\n{{contact.location}}{{#contact.linkedin}}\n{{contact.linkedin}}{{/contact.linkedin}}{{#contact.github}}\n{{contact.github}}{{/contact.github}}\n\n---\n\n## Summary\n\n{{summary}}\n\n---\n\n## Experience\n\n{{#experience}}\n### {{title}}\n\n**{{company}}** | {{startDate}} - {{endDate}}\n\n{{#responsibilities}}\n- {{.}}\n{{/responsibilities}}\n\n{{/experience}}\n\n---\n\n## Education\n\n{{#education}}\n**{{degree}}**\n\n{{institution}}, {{startYear}} - {{endYear}}\n\n{{/education}}\n\n---\n\n## Skills\n\n{{#skills}}\n- {{.}}\n{{/skills}}\n\n{{#certifications}}\n---\n\n## Certifications\n\n{{#certifications}}\n- **{{name}}** - {{issuer}}{{#date}} ({{date}}){{/date}}\n{{/certifications}}\n{{/certifications}}"'::jsonb
)
WHERE name = 'Clean Minimal';

-- Update Bold Executive template
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{markdown_template}',
  '"# {{contact.name}}\n\n**{{contact.title}}**\n\n{{contact.email}}\n{{contact.phone}}\n{{contact.location}}{{#contact.linkedin}}\n{{contact.linkedin}}{{/contact.linkedin}}{{#contact.github}}\n{{contact.github}}{{/contact.github}}\n\n---\n\n## Summary\n\n{{summary}}\n\n---\n\n## Experience\n\n{{#experience}}\n### {{title}}\n\n**{{company}}** | {{startDate}} - {{endDate}}\n\n{{#responsibilities}}\n- {{.}}\n{{/responsibilities}}\n\n{{/experience}}\n\n---\n\n## Education\n\n{{#education}}\n**{{degree}}**\n\n{{institution}}, {{startYear}} - {{endYear}}\n\n{{/education}}\n\n---\n\n## Skills\n\n{{#skills}}\n- {{.}}\n{{/skills}}\n\n{{#certifications}}\n---\n\n## Certifications\n\n{{#certifications}}\n- **{{name}}** - {{issuer}}{{#date}} ({{date}}){{/date}}\n{{/certifications}}\n{{/certifications}}"'::jsonb
)
WHERE name = 'Bold Executive';

-- Update Modern Gradient template
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{markdown_template}',
  '"# {{contact.name}}\n\n**{{contact.title}}**\n\n{{contact.email}}\n{{contact.phone}}\n{{contact.location}}{{#contact.linkedin}}\n{{contact.linkedin}}{{/contact.linkedin}}{{#contact.github}}\n{{contact.github}}{{/contact.github}}\n\n---\n\n## Summary\n\n{{summary}}\n\n---\n\n## Experience\n\n{{#experience}}\n### {{title}}\n\n**{{company}}** | {{startDate}} - {{endDate}}\n\n{{#responsibilities}}\n- {{.}}\n{{/responsibilities}}\n\n{{/experience}}\n\n---\n\n## Education\n\n{{#education}}\n**{{degree}}**\n\n{{institution}}, {{startYear}} - {{endYear}}\n\n{{/education}}\n\n---\n\n## Skills\n\n{{#skills}}\n- {{.}}\n{{/skills}}\n\n{{#certifications}}\n---\n\n## Certifications\n\n{{#certifications}}\n- **{{name}}** - {{issuer}}{{#date}} ({{date}}){{/date}}\n{{/certifications}}\n{{/certifications}}"'::jsonb
)
WHERE name = 'Modern Gradient';

-- Update Classic Professional template
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{markdown_template}',
  '"# {{contact.name}}\n\n**{{contact.title}}**\n\n{{contact.email}}\n{{contact.phone}}\n{{contact.location}}{{#contact.linkedin}}\n{{contact.linkedin}}{{/contact.linkedin}}{{#contact.github}}\n{{contact.github}}{{/contact.github}}\n\n---\n\n## Summary\n\n{{summary}}\n\n---\n\n## Experience\n\n{{#experience}}\n### {{title}}\n\n**{{company}}** | {{startDate}} - {{endDate}}\n\n{{#responsibilities}}\n- {{.}}\n{{/responsibilities}}\n\n{{/experience}}\n\n---\n\n## Education\n\n{{#education}}\n**{{degree}}**\n\n{{institution}}, {{startYear}} - {{endYear}}\n\n{{/education}}\n\n---\n\n## Skills\n\n{{#skills}}\n- {{.}}\n{{/skills}}\n\n{{#certifications}}\n---\n\n## Certifications\n\n{{#certifications}}\n- **{{name}}** - {{issuer}}{{#date}} ({{date}}){{/date}}\n{{/certifications}}\n{{/certifications}}"'::jsonb
)
WHERE name = 'Classic Professional';

-- Update Tech Terminal template
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{markdown_template}',
  '"# {{contact.name}}\n\n**{{contact.title}}**\n\n{{contact.email}}\n{{contact.phone}}\n{{contact.location}}{{#contact.linkedin}}\n{{contact.linkedin}}{{/contact.linkedin}}{{#contact.github}}\n{{contact.github}}{{/contact.github}}\n\n---\n\n## Summary\n\n{{summary}}\n\n---\n\n## Experience\n\n{{#experience}}\n### {{title}}\n\n**{{company}}** | {{startDate}} - {{endDate}}\n\n{{#responsibilities}}\n- {{.}}\n{{/responsibilities}}\n\n{{/experience}}\n\n---\n\n## Education\n\n{{#education}}\n**{{degree}}**\n\n{{institution}}, {{startYear}} - {{endYear}}\n\n{{/education}}\n\n---\n\n## Skills\n\n{{#skills}}\n- {{.}}\n{{/skills}}\n\n{{#certifications}}\n---\n\n## Certifications\n\n{{#certifications}}\n- **{{name}}** - {{issuer}}{{#date}} ({{date}}){{/date}}\n{{/certifications}}\n{{/certifications}}"'::jsonb
)
WHERE name = 'Tech Terminal';

-- Update Elegant Sidebar template
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{markdown_template}',
  '"# {{contact.name}}\n\n**{{contact.title}}**\n\n{{contact.email}}\n{{contact.phone}}\n{{contact.location}}{{#contact.linkedin}}\n{{contact.linkedin}}{{/contact.linkedin}}{{#contact.github}}\n{{contact.github}}{{/contact.github}}\n\n---\n\n## Summary\n\n{{summary}}\n\n---\n\n## Experience\n\n{{#experience}}\n### {{title}}\n\n**{{company}}** | {{startDate}} - {{endDate}}\n\n{{#responsibilities}}\n- {{.}}\n{{/responsibilities}}\n\n{{/experience}}\n\n---\n\n## Education\n\n{{#education}}\n**{{degree}}**\n\n{{institution}}, {{startYear}} - {{endYear}}\n\n{{/education}}\n\n---\n\n## Skills\n\n{{#skills}}\n- {{.}}\n{{/skills}}\n\n{{#certifications}}\n---\n\n## Certifications\n\n{{#certifications}}\n- **{{name}}** - {{issuer}}{{#date}} ({{date}}){{/date}}\n{{/certifications}}\n{{/certifications}}"'::jsonb
)
WHERE name = 'Elegant Sidebar';