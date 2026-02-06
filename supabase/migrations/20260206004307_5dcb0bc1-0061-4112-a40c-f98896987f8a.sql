
-- Update all 6 markdown templates with compact certifications and optimized spacing
-- Template 1: Clean Minimal
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{markdown_template}',
  to_jsonb('# {{contact.name}}
**{{contact.title}}**

{{contact.email}}
{{contact.phone}}
{{contact.location}}{{#contact.linkedin}}
[LinkedIn]({{contact.linkedin}}){{/contact.linkedin}}{{#contact.github}}
[GitHub]({{contact.github}}){{/contact.github}}

---

## Summary

{{summary}}

---

## Experience

{{#experience}}
### {{title}}
**{{company}}** | {{startDate}} - {{endDate}}

{{#responsibilities}}
- {{.}}
{{/responsibilities}}
{{/experience}}

---

## Education

{{#education}}
**{{degree}}** - {{institution}} ({{startYear}} - {{endYear}})
{{/education}}

---

## Skills

{{#skills}}{{.}}{{^last}} • {{/last}}{{/skills}}

{{#hasCertifications}}
---

## Certifications

{{#certifications}}**{{name}}** - {{issuer}}{{#date}} ({{date}}){{/date}}
{{/certifications}}{{/hasCertifications}}'::text)
)
WHERE name = 'Clean Minimal';

-- Template 2: Bold Executive
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{markdown_template}',
  to_jsonb('# {{contact.name}}
### {{contact.title}}

{{contact.email}}
{{contact.phone}}
{{contact.location}}{{#contact.linkedin}}
[LinkedIn]({{contact.linkedin}}){{/contact.linkedin}}{{#contact.github}}
[GitHub]({{contact.github}}){{/contact.github}}

---

## EXECUTIVE SUMMARY

{{summary}}

---

## PROFESSIONAL EXPERIENCE

{{#experience}}
### {{title}}
**{{company}}** | {{startDate}} - {{endDate}}

{{#responsibilities}}
- {{.}}
{{/responsibilities}}
{{/experience}}

---

## EDUCATION

{{#education}}
**{{degree}}**
{{institution}} | {{startYear}} - {{endYear}}
{{/education}}

---

## CORE COMPETENCIES

{{#skills}}{{.}}{{^last}} | {{/last}}{{/skills}}

{{#hasCertifications}}
---

## CERTIFICATIONS

{{#certifications}}**{{name}}** - {{issuer}}{{#date}} ({{date}}){{/date}}
{{/certifications}}{{/hasCertifications}}'::text)
)
WHERE name = 'Bold Executive';

-- Template 3: Modern Gradient
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{markdown_template}',
  to_jsonb('# {{contact.name}}
**{{contact.title}}**

{{contact.email}}
{{contact.phone}}
{{contact.location}}{{#contact.linkedin}}
[LinkedIn]({{contact.linkedin}}){{/contact.linkedin}}{{#contact.github}}
[GitHub]({{contact.github}}){{/contact.github}}

---

## About Me

{{summary}}

---

## Experience

{{#experience}}
### {{title}}
**{{company}}** | {{startDate}} - {{endDate}}

{{#responsibilities}}
- {{.}}
{{/responsibilities}}
{{/experience}}

---

## Education

{{#education}}
**{{degree}}** - {{institution}} ({{startYear}} - {{endYear}})
{{/education}}

---

## Skills

{{#skills}}{{.}}{{^last}} • {{/last}}{{/skills}}

{{#hasCertifications}}
---

## Certifications

{{#certifications}}**{{name}}** - {{issuer}}{{#date}} ({{date}}){{/date}}
{{/certifications}}{{/hasCertifications}}'::text)
)
WHERE name = 'Modern Gradient';

-- Template 4: Classic Professional
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{markdown_template}',
  to_jsonb('# {{contact.name}}
**{{contact.title}}**

{{contact.email}}
{{contact.phone}}
{{contact.location}}{{#contact.linkedin}}
[LinkedIn]({{contact.linkedin}}){{/contact.linkedin}}{{#contact.github}}
[GitHub]({{contact.github}}){{/contact.github}}

---

## Professional Summary

{{summary}}

---

## Work Experience

{{#experience}}
### {{title}}
**{{company}}** | {{startDate}} - {{endDate}}

{{#responsibilities}}
- {{.}}
{{/responsibilities}}
{{/experience}}

---

## Education

{{#education}}
**{{degree}}**
{{institution}} | {{startYear}} - {{endYear}}
{{/education}}

---

## Skills

{{#skills}}{{.}}{{^last}} • {{/last}}{{/skills}}

{{#hasCertifications}}
---

## Certifications

{{#certifications}}**{{name}}** - {{issuer}}{{#date}} ({{date}}){{/date}}
{{/certifications}}{{/hasCertifications}}'::text)
)
WHERE name = 'Classic Professional';

-- Template 5: Tech Terminal
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{markdown_template}',
  to_jsonb('# {{contact.name}}
`{{contact.title}}`

{{contact.email}}
{{contact.phone}}
{{contact.location}}{{#contact.linkedin}}
[LinkedIn]({{contact.linkedin}}){{/contact.linkedin}}{{#contact.github}}
[GitHub]({{contact.github}}){{/contact.github}}

---

## // Summary

{{summary}}

---

## // Experience

{{#experience}}
### {{title}}
**{{company}}** | {{startDate}} - {{endDate}}

{{#responsibilities}}
- {{.}}
{{/responsibilities}}
{{/experience}}

---

## // Education

{{#education}}
**{{degree}}** @ {{institution}} ({{startYear}} - {{endYear}})
{{/education}}

---

## // Skills

{{#skills}}`{{.}}`{{^last}} {{/last}}{{/skills}}

{{#hasCertifications}}
---

## // Certifications

{{#certifications}}`{{name}}` - {{issuer}}{{#date}} ({{date}}){{/date}}
{{/certifications}}{{/hasCertifications}}'::text)
)
WHERE name = 'Tech Terminal';

-- Template 6: Elegant Sidebar
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{markdown_template}',
  to_jsonb('# {{contact.name}}
**{{contact.title}}**

{{contact.email}}
{{contact.phone}}
{{contact.location}}{{#contact.linkedin}}
[LinkedIn]({{contact.linkedin}}){{/contact.linkedin}}{{#contact.github}}
[GitHub]({{contact.github}}){{/contact.github}}

---

## Profile

{{summary}}

---

## Experience

{{#experience}}
### {{title}}
**{{company}}** | {{startDate}} - {{endDate}}

{{#responsibilities}}
- {{.}}
{{/responsibilities}}
{{/experience}}

---

## Education

{{#education}}
**{{degree}}** - {{institution}} ({{startYear}} - {{endYear}})
{{/education}}

---

## Skills

{{#skills}}{{.}}{{^last}} • {{/last}}{{/skills}}

{{#hasCertifications}}
---

## Certifications

{{#certifications}}**{{name}}** - {{issuer}}{{#date}} ({{date}}){{/date}}
{{/certifications}}{{/hasCertifications}}'::text)
)
WHERE name = 'Elegant Sidebar';
