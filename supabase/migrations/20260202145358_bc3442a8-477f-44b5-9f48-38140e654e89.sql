-- Update remaining modern templates with nested structures to ATS-friendly flat structure

-- Elegant Rose Gold
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "55px 50px", "textAlign": "left", "background": "linear-gradient(135deg, #BE185D 0%, #EC4899 100%)", "boxShadow": "0 12px 40px rgba(190, 24, 93, 0.3)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #EC4899", "backgroundColor": "#FDF2F8"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "borderTop": "3px solid #EC4899"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "backgroundColor": "#FDF2F8"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Elegant Rose Gold';

-- Emerald Business Pro
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "55px 50px", "textAlign": "left", "background": "linear-gradient(135deg, #047857 0%, #10B981 100%)", "boxShadow": "0 12px 40px rgba(4, 120, 87, 0.3)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #10B981", "backgroundColor": "#ECFDF5"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "borderTop": "3px solid #10B981"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "backgroundColor": "#ECFDF5"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Emerald Business Pro';

-- Indigo Executive Prestige
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "55px 50px", "textAlign": "left", "background": "linear-gradient(135deg, #3730A3 0%, #6366F1 100%)", "boxShadow": "0 12px 40px rgba(55, 48, 163, 0.3)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #6366F1", "backgroundColor": "#EEF2FF"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "borderTop": "3px solid #6366F1"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "backgroundColor": "#EEF2FF"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Indigo Executive Prestige';

-- Minimalist Clean
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#111827", "padding": "50px", "textAlign": "left", "backgroundColor": "#FFFFFF", "borderBottom": "2px solid #E5E7EB"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "15px", "lineHeight": "1.7"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px", "borderTop": "1px solid #E5E7EB"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "borderTop": "1px solid #E5E7EB"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "borderTop": "1px solid #E5E7EB"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px", "borderTop": "1px solid #E5E7EB"}}
  ]'::jsonb
)
WHERE name = 'Minimalist Clean';

-- Navy Corporate Elite
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "55px 50px", "textAlign": "left", "background": "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)", "boxShadow": "0 12px 40px rgba(30, 58, 138, 0.3)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #3B82F6", "backgroundColor": "#EFF6FF"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "borderTop": "3px solid #3B82F6"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "backgroundColor": "#EFF6FF"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Navy Corporate Elite';

-- Purple Creative Gradient
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "55px 50px", "textAlign": "left", "background": "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)", "boxShadow": "0 12px 40px rgba(124, 58, 237, 0.3)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #A855F7", "backgroundColor": "#FAF5FF"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "borderTop": "3px solid #A855F7"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "backgroundColor": "#FAF5FF"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Purple Creative Gradient';

-- Red Bold Impact
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "55px 50px", "textAlign": "left", "background": "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)", "boxShadow": "0 12px 40px rgba(220, 38, 38, 0.3)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #EF4444", "backgroundColor": "#FEF2F2"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "borderTop": "3px solid #EF4444"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "backgroundColor": "#FEF2F2"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Red Bold Impact';

-- Teal Tech Modern
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "55px 50px", "textAlign": "left", "background": "linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)", "boxShadow": "0 12px 40px rgba(13, 148, 136, 0.3)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #14B8A6", "backgroundColor": "#F0FDFA"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "borderTop": "3px solid #14B8A6"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "backgroundColor": "#F0FDFA"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Teal Tech Modern';

-- Tech templates
-- Code Editor
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#22D3EE", "padding": "50px", "textAlign": "left", "background": "#1E293B", "fontFamily": "JetBrains Mono, monospace", "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.4)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "14px", "lineHeight": "1.7", "borderLeft": "4px solid #22D3EE", "backgroundColor": "#0F172A", "color": "#94A3B8", "fontFamily": "JetBrains Mono, monospace"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px", "backgroundColor": "#1E293B", "color": "#E2E8F0"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "backgroundColor": "#0F172A", "color": "#94A3B8"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "backgroundColor": "#1E293B"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px", "backgroundColor": "#0F172A", "color": "#94A3B8"}}
  ]'::jsonb
)
WHERE name = 'Code Editor';

-- GitHub Profile
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "50px", "textAlign": "left", "background": "#24292E", "boxShadow": "0 8px 25px rgba(0, 0, 0, 0.3)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #58A6FF", "backgroundColor": "#0D1117", "color": "#C9D1D9"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px", "backgroundColor": "#161B22", "color": "#C9D1D9"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "backgroundColor": "#0D1117", "color": "#C9D1D9"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "backgroundColor": "#161B22"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px", "backgroundColor": "#0D1117", "color": "#C9D1D9"}}
  ]'::jsonb
)
WHERE name = 'GitHub Profile';

-- Gradient Tech
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "55px 50px", "textAlign": "left", "background": "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)", "boxShadow": "0 15px 50px rgba(99, 102, 241, 0.35)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #8B5CF6", "backgroundColor": "#F5F3FF"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "borderTop": "3px solid #8B5CF6"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "backgroundColor": "#F5F3FF"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Gradient Tech';

-- Matrix
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#22C55E", "padding": "50px", "textAlign": "left", "background": "#0A0A0A", "fontFamily": "JetBrains Mono, monospace", "boxShadow": "0 10px 30px rgba(34, 197, 94, 0.2)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "14px", "lineHeight": "1.7", "borderLeft": "4px solid #22C55E", "backgroundColor": "#0F0F0F", "color": "#4ADE80", "fontFamily": "JetBrains Mono, monospace"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px", "backgroundColor": "#0A0A0A", "color": "#22C55E"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "backgroundColor": "#0F0F0F", "color": "#4ADE80"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "backgroundColor": "#0A0A0A"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px", "backgroundColor": "#0F0F0F", "color": "#4ADE80"}}
  ]'::jsonb
)
WHERE name = 'Matrix';

-- Minimal Dev
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#1F2937", "padding": "50px", "textAlign": "left", "background": "#FFFFFF", "borderBottom": "3px solid #3B82F6", "fontFamily": "Inter, sans-serif"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #3B82F6", "backgroundColor": "#F8FAFC"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "borderTop": "1px solid #E5E7EB"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "borderTop": "1px solid #E5E7EB"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px", "borderTop": "1px solid #E5E7EB"}}
  ]'::jsonb
)
WHERE name = 'Minimal Dev';

-- Terminal Pro
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#A3E635", "padding": "50px", "textAlign": "left", "background": "#18181B", "fontFamily": "JetBrains Mono, monospace", "boxShadow": "0 10px 30px rgba(0, 0, 0, 0.4)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "14px", "lineHeight": "1.7", "borderLeft": "4px solid #A3E635", "backgroundColor": "#27272A", "color": "#D4D4D8", "fontFamily": "JetBrains Mono, monospace"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px", "backgroundColor": "#18181B", "color": "#FAFAFA"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "backgroundColor": "#27272A", "color": "#D4D4D8"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "backgroundColor": "#18181B"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px", "backgroundColor": "#27272A", "color": "#D4D4D8"}}
  ]'::jsonb
)
WHERE name = 'Terminal Pro';