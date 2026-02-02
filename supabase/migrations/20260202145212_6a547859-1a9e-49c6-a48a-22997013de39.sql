-- Update all classic templates to have consistent ATS-friendly section ordering
-- The key fix: Ensure all essential sections (header, summary, experience, education, skills) are present
-- and properly structured for ATS parsers to recognize them

-- Academic CV - already has good structure, just ensure consistent order
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#1e3a5f", "padding": "40px 50px 32px", "fontSize": "2rem", "textAlign": "center", "fontFamily": "Georgia, serif", "fontWeight": "700", "borderBottom": "3px solid #1e3a5f", "letterSpacing": "1px", "titleFontSize": "1.125rem", "backgroundColor": "#ffffff", "titleFontWeight": "400", "titleLetterSpacing": "2px", "titleTextTransform": "uppercase"}},
    {"id": "summary", "type": "summary", "style": {"margin": "0 40px 24px", "padding": "28px 50px", "fontSize": "0.875rem", "fontStyle": "normal", "borderLeft": "4px solid #1e3a5f", "lineHeight": "1.6", "backgroundColor": "#f8fafc"}},
    {"id": "experience", "type": "experience", "style": {"divider": "1px solid #f1f5f9", "padding": "24px 50px", "borderTop": "1px solid #e2e8f0", "itemSpacing": "20px"}},
    {"id": "education", "type": "education", "style": {"padding": "24px 50px", "borderTop": "1px solid #e2e8f0", "itemSpacing": "16px"}},
    {"id": "skills", "type": "skills", "style": {"columns": 4, "display": "tags", "padding": "24px 50px", "borderTop": "1px solid #e2e8f0"}},
    {"id": "projects", "type": "projects", "style": {"padding": "24px 50px", "borderTop": "1px solid #e2e8f0", "itemSpacing": "16px"}}
  ]'::jsonb
)
WHERE name = 'Academic CV';

-- Banking Professional - flatten the grid structure for better ATS parsing
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#ffffff", "padding": "44px 48px", "fontSize": "2.25rem", "textAlign": "left", "fontWeight": "700", "titleOpacity": 0.9, "titleFontSize": "1.125rem", "backgroundColor": "#064e3b", "titleFontWeight": "400"}},
    {"id": "summary", "type": "summary", "style": {"margin": "28px 40px", "padding": "28px 40px", "fontSize": "0.9rem", "borderLeft": "5px solid #10b981", "lineHeight": "1.65", "backgroundColor": "#f0fdf4"}},
    {"id": "experience", "type": "experience", "style": {"divider": "1px solid #e5e7eb", "padding": "28px 48px", "itemSpacing": "24px"}},
    {"id": "education", "type": "education", "style": {"padding": "28px 48px", "borderTop": "2px solid #10b981", "itemSpacing": "16px", "backgroundColor": "#f9fafb"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "28px 48px", "backgroundColor": "#f9fafb"}},
    {"id": "projects", "type": "projects", "style": {"padding": "28px 48px", "itemSpacing": "16px"}}
  ]'::jsonb
)
WHERE name = 'Banking Professional';

-- Corporate Standard - flatten the grid structure
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#ffffff", "padding": "40px 48px", "fontSize": "2.125rem", "textAlign": "left", "fontWeight": "700", "letterSpacing": "0.5px", "titleOpacity": 0.85, "titleFontSize": "1.0625rem", "backgroundColor": "#1e293b", "titleFontWeight": "400"}},
    {"id": "summary", "type": "summary", "style": {"padding": "28px 48px", "fontSize": "0.9rem", "lineHeight": "1.7", "backgroundColor": "#ffffff", "borderBottom": "1px solid #e2e8f0"}},
    {"id": "experience", "type": "experience", "style": {"divider": "1px solid #f1f5f9", "padding": "28px 48px", "itemSpacing": "24px"}},
    {"id": "education", "type": "education", "style": {"padding": "28px 48px", "borderTop": "3px solid #1e293b", "itemSpacing": "16px", "backgroundColor": "#f8fafc"}},
    {"id": "skills", "type": "skills", "style": {"columns": 3, "display": "tags", "padding": "28px 48px", "backgroundColor": "#f8fafc"}},
    {"id": "projects", "type": "projects", "style": {"padding": "28px 48px", "itemSpacing": "16px"}}
  ]'::jsonb
)
WHERE name = 'Corporate Standard';

-- Executive Formal - flatten the grid structure
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#ffffff", "padding": "52px 48px", "fontSize": "2.5rem", "textAlign": "center", "fontWeight": "700", "letterSpacing": "2px", "titleOpacity": 0.9, "titleFontSize": "1.25rem", "backgroundColor": "#000000", "borderBottom": "4px solid #d4af37", "titleFontWeight": "400"}},
    {"id": "summary", "type": "summary", "style": {"margin": "0", "padding": "36px 56px", "fontSize": "0.95rem", "fontStyle": "italic", "lineHeight": "1.75", "textAlign": "center", "backgroundColor": "#fafaf9", "borderTop": "3px solid #d4af37", "borderBottom": "3px solid #d4af37"}},
    {"id": "experience", "type": "experience", "style": {"divider": "1px solid #e5e7eb", "padding": "36px 56px", "itemSpacing": "28px"}},
    {"id": "education", "type": "education", "style": {"padding": "36px 56px", "borderTop": "2px solid #d4af37", "itemSpacing": "16px", "backgroundColor": "#fafaf9"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "36px 56px", "backgroundColor": "#fafaf9"}},
    {"id": "projects", "type": "projects", "style": {"padding": "36px 56px", "itemSpacing": "16px"}}
  ]'::jsonb
)
WHERE name = 'Executive Formal';

-- Formal Document - flatten the grid structure
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#0f172a", "padding": "40px 50px", "fontSize": "1.875rem", "textAlign": "left", "fontWeight": "700", "letterSpacing": "3px", "textTransform": "uppercase", "borderBottom": "4px solid #0f172a", "backgroundColor": "#ffffff", "titleFontSize": "1rem", "titleFontWeight": "500", "titleLetterSpacing": "1px"}},
    {"id": "summary", "type": "summary", "style": {"padding": "28px 50px", "fontSize": "0.9rem", "lineHeight": "1.7", "borderLeft": "4px solid #334155", "backgroundColor": "#f8fafc"}},
    {"id": "experience", "type": "experience", "style": {"divider": "1px solid #e5e7eb", "padding": "28px 50px", "itemSpacing": "24px"}},
    {"id": "education", "type": "education", "style": {"padding": "28px 50px", "borderTop": "2px solid #334155", "itemSpacing": "16px", "backgroundColor": "#f8fafc"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "28px 50px", "backgroundColor": "#f8fafc"}},
    {"id": "projects", "type": "projects", "style": {"padding": "28px 50px", "itemSpacing": "16px"}}
  ]'::jsonb
)
WHERE name = 'Formal Document';

-- Minimalist Classic
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#111827", "padding": "48px 60px 40px", "fontSize": "2.25rem", "textAlign": "left", "fontWeight": "300", "letterSpacing": "4px", "borderBottom": "1px solid #e5e7eb", "backgroundColor": "#ffffff", "titleFontSize": "1rem", "titleFontWeight": "400", "titleLetterSpacing": "3px", "titleTextTransform": "uppercase"}},
    {"id": "summary", "type": "summary", "style": {"padding": "32px 60px", "fontSize": "0.9rem", "lineHeight": "1.8"}},
    {"id": "experience", "type": "experience", "style": {"divider": "none", "padding": "32px 60px", "borderTop": "1px solid #e5e7eb", "itemSpacing": "28px"}},
    {"id": "education", "type": "education", "style": {"padding": "32px 60px", "borderTop": "1px solid #e5e7eb", "itemSpacing": "20px"}},
    {"id": "skills", "type": "skills", "style": {"display": "inline", "separator": " / ", "padding": "32px 60px", "borderTop": "1px solid #e5e7eb"}},
    {"id": "projects", "type": "projects", "style": {"padding": "32px 60px", "borderTop": "1px solid #e5e7eb", "itemSpacing": "16px"}}
  ]'::jsonb
)
WHERE name = 'Minimalist Classic';

-- Professional Blue
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#ffffff", "padding": "44px 48px", "fontSize": "2.25rem", "textAlign": "left", "fontWeight": "700", "titleOpacity": 0.9, "titleFontSize": "1.125rem", "backgroundColor": "#1e40af", "titleFontWeight": "400"}},
    {"id": "summary", "type": "summary", "style": {"padding": "28px 48px", "fontSize": "0.9rem", "lineHeight": "1.7", "borderLeft": "5px solid #3b82f6", "backgroundColor": "#eff6ff"}},
    {"id": "experience", "type": "experience", "style": {"divider": "1px solid #e5e7eb", "padding": "28px 48px", "itemSpacing": "24px"}},
    {"id": "education", "type": "education", "style": {"padding": "28px 48px", "borderTop": "3px solid #1e40af", "itemSpacing": "16px", "backgroundColor": "#f8fafc"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "28px 48px", "backgroundColor": "#f8fafc"}},
    {"id": "projects", "type": "projects", "style": {"padding": "28px 48px", "itemSpacing": "16px"}}
  ]'::jsonb
)
WHERE name = 'Professional Blue';

-- Refined Elegance
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#1c1917", "padding": "56px 60px 44px", "fontSize": "2.5rem", "textAlign": "center", "fontFamily": "Playfair Display, Georgia, serif", "fontWeight": "400", "letterSpacing": "6px", "borderBottom": "2px solid #a16207", "backgroundColor": "#ffffff", "titleFontSize": "1.125rem", "titleFontWeight": "300", "titleLetterSpacing": "4px", "titleTextTransform": "uppercase"}},
    {"id": "summary", "type": "summary", "style": {"margin": "0", "padding": "36px 64px", "fontSize": "0.9rem", "fontStyle": "italic", "lineHeight": "1.85", "textAlign": "center"}},
    {"id": "experience", "type": "experience", "style": {"divider": "1px solid #d6d3d1", "padding": "36px 60px", "itemSpacing": "28px", "borderTop": "1px solid #e7e5e4"}},
    {"id": "education", "type": "education", "style": {"padding": "36px 60px", "borderTop": "2px solid #a16207", "itemSpacing": "20px", "backgroundColor": "#fafaf9"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "36px 60px", "backgroundColor": "#fafaf9"}},
    {"id": "projects", "type": "projects", "style": {"padding": "36px 60px", "itemSpacing": "16px"}}
  ]'::jsonb
)
WHERE name = 'Refined Elegance';

-- Timeless Professional
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#1f2937", "padding": "44px 50px 36px", "fontSize": "2rem", "textAlign": "left", "fontWeight": "700", "borderBottom": "4px solid #374151", "backgroundColor": "#ffffff", "titleFontSize": "1.0625rem", "titleFontWeight": "500"}},
    {"id": "summary", "type": "summary", "style": {"padding": "28px 50px", "fontSize": "0.9rem", "lineHeight": "1.7", "borderBottom": "1px solid #e5e7eb", "backgroundColor": "#f9fafb"}},
    {"id": "experience", "type": "experience", "style": {"divider": "1px solid #f3f4f6", "padding": "28px 50px", "itemSpacing": "24px"}},
    {"id": "education", "type": "education", "style": {"padding": "28px 50px", "borderTop": "1px solid #e5e7eb", "itemSpacing": "16px"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "28px 50px", "borderTop": "1px solid #e5e7eb"}},
    {"id": "projects", "type": "projects", "style": {"padding": "28px 50px", "itemSpacing": "16px"}}
  ]'::jsonb
)
WHERE name = 'Timeless Professional';

-- Traditional Sidebar - convert to flat structure for ATS
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#ffffff", "padding": "44px 48px", "fontSize": "2rem", "textAlign": "left", "fontWeight": "700", "titleOpacity": 0.9, "titleFontSize": "1.0625rem", "backgroundColor": "#4338ca", "titleFontWeight": "400"}},
    {"id": "summary", "type": "summary", "style": {"padding": "28px 48px", "fontSize": "0.9rem", "lineHeight": "1.7", "backgroundColor": "#eef2ff", "borderLeft": "4px solid #6366f1"}},
    {"id": "experience", "type": "experience", "style": {"divider": "1px solid #e5e7eb", "padding": "28px 48px", "itemSpacing": "24px"}},
    {"id": "education", "type": "education", "style": {"padding": "28px 48px", "borderTop": "3px solid #4338ca", "itemSpacing": "16px", "backgroundColor": "#f8fafc"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "28px 48px", "backgroundColor": "#f8fafc"}},
    {"id": "projects", "type": "projects", "style": {"padding": "28px 48px", "itemSpacing": "16px"}}
  ]'::jsonb
)
WHERE name = 'Traditional Sidebar';