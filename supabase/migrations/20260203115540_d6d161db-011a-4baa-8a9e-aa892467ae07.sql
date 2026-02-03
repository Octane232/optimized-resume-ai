-- Clear existing templates and insert 6 ATS-optimized markdown-based resume templates
DELETE FROM public.resume_templates;

-- Template 1: Clean Minimal
INSERT INTO public.resume_templates (name, description, category, ats_friendly, ats_score, is_premium, template, styles, json_content)
VALUES (
  'Clean Minimal',
  'Ultra-clean design with generous whitespace and subtle dividers. Perfect for professionals seeking a modern, uncluttered look.',
  'classic',
  true,
  98,
  false,
  '{}',
  '{}',
  '{
    "type": "markdown",
    "markdown_template": "# {{contact.name}}\n\n**{{contact.title}}**\n\n{{contact.email}}\n{{contact.phone}}\n{{contact.location}}{{#contact.linkedin}}\n{{contact.linkedin}}{{/contact.linkedin}}\n\n---\n\n## Summary\n\n{{summary}}\n\n---\n\n## Experience\n\n{{#experience}}\n### {{title}}\n\n**{{company}}** | {{startDate}} - {{endDate}}\n\n{{#responsibilities}}\n- {{.}}\n{{/responsibilities}}\n\n{{/experience}}\n\n---\n\n## Education\n\n{{#education}}\n**{{degree}}**\n\n{{institution}}, {{startYear}} - {{endYear}}\n\n{{/education}}\n\n---\n\n## Skills\n\n{{#skills}}\n- {{.}}\n{{/skills}}",
    "theme": {
      "primaryColor": "#1e293b",
      "accentColor": "#3b82f6",
      "fontFamily": "Inter, system-ui, sans-serif",
      "headingFont": "Inter, system-ui, sans-serif"
    },
    "css": "#SCOPE h1 { font-size: 2.25rem; font-weight: 700; letter-spacing: -0.02em; } #SCOPE h2 { font-size: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 0.5rem; } #SCOPE h3 { font-size: 1.1rem; font-weight: 600; } #SCOPE hr { margin: 1.5rem 0; } #SCOPE ul { list-style-type: disc; } #SCOPE li { font-size: 0.9rem; line-height: 1.5; }"
  }'::jsonb
);

-- Template 2: Bold Executive
INSERT INTO public.resume_templates (name, description, category, ats_friendly, ats_score, is_premium, template, styles, json_content)
VALUES (
  'Bold Executive',
  'Strong headers with bordered sections. Ideal for executives and senior professionals making a powerful impression.',
  'classic',
  true,
  98,
  false,
  '{}',
  '{}',
  '{
    "type": "markdown",
    "markdown_template": "# {{contact.name}}\n\n**{{contact.title}}**\n\n{{contact.email}}\n{{contact.phone}}\n{{contact.location}}\n\n---\n\n## Summary\n\n{{summary}}\n\n---\n\n## Experience\n\n{{#experience}}\n### {{title}}\n\n**{{company}}** | {{startDate}} - {{endDate}}\n\n{{#responsibilities}}\n- {{.}}\n{{/responsibilities}}\n\n{{/experience}}\n\n---\n\n## Education\n\n{{#education}}\n**{{degree}}**\n\n{{institution}}, {{startYear}} - {{endYear}}\n\n{{/education}}\n\n---\n\n## Skills\n\n{{#skills}}\n- {{.}}\n{{/skills}}",
    "theme": {
      "primaryColor": "#0f172a",
      "accentColor": "#b45309",
      "fontFamily": "Georgia, serif",
      "headingFont": "Georgia, serif"
    },
    "css": "#SCOPE { padding: 48px; } #SCOPE h1 { font-size: 2.5rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 4px solid #b45309; padding-bottom: 0.75rem; } #SCOPE h2 { font-size: 1.1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; color: #0f172a; background: #fef3c7; padding: 0.5rem 1rem; margin-left: -1rem; margin-right: -1rem; } #SCOPE h3 { font-size: 1.15rem; font-weight: 700; color: #0f172a; } #SCOPE hr { border-top: 2px solid #0f172a; margin: 2rem 0; } #SCOPE ul { list-style-type: square; } #SCOPE li { font-size: 0.95rem; }"
  }'::jsonb
);

-- Template 3: Modern Gradient
INSERT INTO public.resume_templates (name, description, category, ats_friendly, ats_score, is_premium, template, styles, json_content)
VALUES (
  'Modern Gradient',
  'Contemporary design with gradient accents. Great for creative professionals and tech roles.',
  'classic',
  true,
  98,
  false,
  '{}',
  '{}',
  '{
    "type": "markdown",
    "markdown_template": "# {{contact.name}}\n\n**{{contact.title}}**\n\n{{contact.email}}\n{{contact.phone}}\n{{contact.location}}\n\n---\n\n## Summary\n\n{{summary}}\n\n---\n\n## Experience\n\n{{#experience}}\n### {{title}}\n\n**{{company}}** | {{startDate}} - {{endDate}}\n\n{{#responsibilities}}\n- {{.}}\n{{/responsibilities}}\n\n{{/experience}}\n\n---\n\n## Education\n\n{{#education}}\n**{{degree}}**\n\n{{institution}}, {{startYear}} - {{endYear}}\n\n{{/education}}\n\n---\n\n## Skills\n\n{{#skills}}\n- {{.}}\n{{/skills}}",
    "theme": {
      "primaryColor": "#312e81",
      "accentColor": "#7c3aed",
      "fontFamily": "Poppins, system-ui, sans-serif",
      "headingFont": "Poppins, system-ui, sans-serif"
    },
    "css": "#SCOPE { background: linear-gradient(180deg, #eef2ff 0%, #ffffff 100px); } #SCOPE h1 { font-size: 2.5rem; font-weight: 700; background: linear-gradient(135deg, #4f46e5, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; } #SCOPE h2 { font-size: 1.1rem; font-weight: 600; color: #7c3aed; display: inline-block; background: #ede9fe; padding: 0.4rem 1rem; border-radius: 2rem; } #SCOPE h3 { font-size: 1.05rem; font-weight: 600; color: #312e81; } #SCOPE hr { border: none; height: 2px; background: linear-gradient(90deg, #4f46e5, #7c3aed, #a78bfa); margin: 1.5rem 0; border-radius: 1rem; } #SCOPE ul { list-style-type: disc; padding-left: 1.5rem; } #SCOPE li { font-size: 0.9rem; line-height: 1.5; }"
  }'::jsonb
);

-- Template 4: Classic Professional
INSERT INTO public.resume_templates (name, description, category, ats_friendly, ats_score, is_premium, template, styles, json_content)
VALUES (
  'Classic Professional',
  'Traditional serif fonts with underlined sections. Timeless design perfect for law, finance, and corporate roles.',
  'classic',
  true,
  98,
  false,
  '{}',
  '{}',
  '{
    "type": "markdown",
    "markdown_template": "# {{contact.name}}\n\n**{{contact.title}}**\n\n{{contact.email}}\n{{contact.phone}}\n{{contact.location}}\n\n---\n\n## Summary\n\n{{summary}}\n\n---\n\n## Experience\n\n{{#experience}}\n### {{title}}\n\n**{{company}}** | {{startDate}} - {{endDate}}\n\n{{#responsibilities}}\n- {{.}}\n{{/responsibilities}}\n\n{{/experience}}\n\n---\n\n## Education\n\n{{#education}}\n**{{degree}}**\n\n{{institution}}, {{startYear}} - {{endYear}}\n\n{{/education}}\n\n---\n\n## Skills\n\n{{#skills}}\n- {{.}}\n{{/skills}}",
    "theme": {
      "primaryColor": "#000000",
      "accentColor": "#881337",
      "fontFamily": "Times New Roman, Georgia, serif",
      "headingFont": "Times New Roman, Georgia, serif"
    },
    "css": "#SCOPE { padding: 50px 60px; } #SCOPE h1 { font-size: 2rem; font-weight: 700; text-align: center; border-bottom: 2px solid #000; padding-bottom: 0.5rem; margin-bottom: 0.25rem; } #SCOPE h1 + p { text-align: center; font-style: italic; color: #881337; } #SCOPE h2 { font-size: 1.1rem; font-weight: 700; text-transform: uppercase; color: #881337; border-bottom: 1px solid #881337; padding-bottom: 0.25rem; margin-top: 1.5rem; } #SCOPE h3 { font-size: 1rem; font-weight: 700; font-style: italic; } #SCOPE hr { display: none; } #SCOPE ul { list-style-type: disc; margin-left: 1.25rem; } #SCOPE li { font-size: 0.95rem; line-height: 1.6; }"
  }'::jsonb
);

-- Template 5: Tech Terminal
INSERT INTO public.resume_templates (name, description, category, ats_friendly, ats_score, is_premium, template, styles, json_content)
VALUES (
  'Tech Terminal',
  'Monospace font with code-style formatting. Perfect for developers, engineers, and technical professionals.',
  'classic',
  true,
  98,
  false,
  '{}',
  '{}',
  '{
    "type": "markdown",
    "markdown_template": "# {{contact.name}}\n\n**{{contact.title}}**\n\n{{contact.email}}\n{{contact.phone}}\n{{contact.location}}\n\n---\n\n## Summary\n\n{{summary}}\n\n---\n\n## Experience\n\n{{#experience}}\n### {{title}}\n\n**{{company}}** | {{startDate}} - {{endDate}}\n\n{{#responsibilities}}\n- {{.}}\n{{/responsibilities}}\n\n{{/experience}}\n\n---\n\n## Education\n\n{{#education}}\n**{{degree}}**\n\n{{institution}}, {{startYear}} - {{endYear}}\n\n{{/education}}\n\n---\n\n## Skills\n\n{{#skills}}\n- {{.}}\n{{/skills}}",
    "theme": {
      "primaryColor": "#1f2937",
      "accentColor": "#22c55e",
      "fontFamily": "JetBrains Mono, Fira Code, monospace",
      "headingFont": "JetBrains Mono, Fira Code, monospace"
    },
    "css": "#SCOPE { background: #f8fafc; padding: 40px; } #SCOPE h1 { font-size: 2rem; font-weight: 700; color: #22c55e; } #SCOPE h2 { font-size: 1rem; font-weight: 600; color: #22c55e; background: #1f2937; display: inline-block; padding: 0.4rem 0.8rem; border-radius: 4px; } #SCOPE h3 { font-size: 0.95rem; font-weight: 600; color: #1f2937; } #SCOPE hr { border-top: 1px dashed #22c55e; margin: 1.5rem 0; } #SCOPE ul { list-style-type: disc; padding-left: 1.5rem; } #SCOPE li { font-size: 0.9rem; line-height: 1.5; }"
  }'::jsonb
);

-- Template 6: Elegant Sidebar
INSERT INTO public.resume_templates (name, description, category, ats_friendly, ats_score, is_premium, template, styles, json_content)
VALUES (
  'Elegant Sidebar',
  'Contemporary layout with left color bar accent. Modern geometric feel ideal for marketing and design roles.',
  'classic',
  true,
  98,
  false,
  '{}',
  '{}',
  '{
    "type": "markdown",
    "markdown_template": "# {{contact.name}}\n\n**{{contact.title}}**\n\n{{contact.email}}\n{{contact.phone}}\n{{contact.location}}{{#contact.linkedin}}\n{{contact.linkedin}}{{/contact.linkedin}}\n\n---\n\n## Summary\n\n{{summary}}\n\n---\n\n## Experience\n\n{{#experience}}\n### {{title}}\n\n**{{company}}** | {{startDate}} - {{endDate}}\n\n{{#responsibilities}}\n- {{.}}\n{{/responsibilities}}\n\n{{/experience}}\n\n---\n\n## Education\n\n{{#education}}\n**{{degree}}**\n\n{{institution}}, {{startYear}} - {{endYear}}\n\n{{/education}}\n\n---\n\n## Skills\n\n{{#skills}}\n- {{.}}\n{{/skills}}",
    "theme": {
      "primaryColor": "#0f172a",
      "accentColor": "#0d9488",
      "fontFamily": "Lato, system-ui, sans-serif",
      "headingFont": "Lato, system-ui, sans-serif"
    },
    "css": "#SCOPE { border-left: 6px solid #0d9488; padding: 40px 40px 40px 44px; } #SCOPE h1 { font-size: 2.25rem; font-weight: 700; color: #0d9488; margin-bottom: 0.25rem; } #SCOPE h2 { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0f172a; background: linear-gradient(90deg, #ccfbf1, transparent); padding: 0.5rem 1rem; margin-left: -44px; padding-left: 44px; border-left: 4px solid #f97316; } #SCOPE h3 { font-size: 1.05rem; font-weight: 600; color: #0d9488; } #SCOPE hr { border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0; } #SCOPE ul { list-style-type: disc; padding-left: 1.5rem; } #SCOPE li { font-size: 0.9rem; line-height: 1.5; }"
  }'::jsonb
);