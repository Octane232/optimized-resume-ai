-- Update modern templates to have ATS-friendly flat structure
-- Converting sidebar/column layouts to simple linear layouts for better ATS parsing

-- Blue Modern Professional - flatten to linear structure
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "60px 50px", "boxShadow": "0 10px 40px rgba(30, 64, 175, 0.3)", "textAlign": "left", "background": "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)", "borderRadius": "0 0 40px 0"}},
    {"id": "summary", "type": "summary", "style": {"padding": "40px 50px", "fontSize": "15px", "lineHeight": "1.7"}},
    {"id": "experience", "type": "experience", "style": {"padding": "40px 50px", "itemSpacing": "30px"}},
    {"id": "education", "type": "education", "style": {"padding": "40px 50px", "itemSpacing": "20px", "backgroundColor": "#F1F5F9"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "40px 50px", "fontSize": "14px", "backgroundColor": "#F1F5F9"}},
    {"id": "projects", "type": "projects", "style": {"padding": "40px 50px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Blue Modern Professional';

-- Bold Orange Creative - flatten grid to linear
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "70px 60px", "boxShadow": "0 20px 60px rgba(234, 88, 12, 0.35)", "textAlign": "left", "background": "linear-gradient(135deg, #EA580C 0%, #F97316 50%, #FB923C 100%)", "borderRadius": "0 0 35px 35px"}},
    {"id": "summary", "type": "summary", "style": {"border": "2px solid #FED7AA", "padding": "30px 60px", "boxShadow": "0 8px 25px rgba(234, 88, 12, 0.08)", "borderRadius": "20px", "backgroundColor": "#FFF7ED", "margin": "45px 60px"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 60px", "itemSpacing": "28px"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 60px", "itemSpacing": "20px", "backgroundColor": "#FFFFFF"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 60px", "borderRadius": "20px", "backgroundColor": "#FFF7ED"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 60px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Bold Orange Creative';

-- Elegant Slate - flatten to linear
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "55px 50px", "textAlign": "left", "background": "linear-gradient(135deg, #334155 0%, #475569 100%)", "boxShadow": "0 8px 30px rgba(51, 65, 85, 0.25)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "35px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #64748B", "backgroundColor": "#F8FAFC", "margin": "30px 50px"}},
    {"id": "experience", "type": "experience", "style": {"padding": "35px 50px", "itemSpacing": "28px"}},
    {"id": "education", "type": "education", "style": {"padding": "35px 50px", "itemSpacing": "20px", "borderTop": "3px solid #64748B"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "35px 50px", "backgroundColor": "#F8FAFC"}},
    {"id": "projects", "type": "projects", "style": {"padding": "35px 50px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Elegant Slate';

-- Fresh Mint - flatten to linear
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "55px 50px", "textAlign": "left", "background": "linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)", "boxShadow": "0 12px 35px rgba(5, 150, 105, 0.3)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderRadius": "16px", "backgroundColor": "#ECFDF5", "margin": "30px 50px"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "borderTop": "3px solid #10B981"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "backgroundColor": "#ECFDF5"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Fresh Mint';

-- Modern Gradient - flatten to linear
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "60px 50px", "textAlign": "left", "background": "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)", "boxShadow": "0 15px 50px rgba(99, 102, 241, 0.35)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "35px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #8B5CF6", "backgroundColor": "#F5F3FF"}},
    {"id": "experience", "type": "experience", "style": {"padding": "35px 50px", "itemSpacing": "28px"}},
    {"id": "education", "type": "education", "style": {"padding": "35px 50px", "itemSpacing": "20px", "borderTop": "3px solid #8B5CF6"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "35px 50px", "backgroundColor": "#F5F3FF"}},
    {"id": "projects", "type": "projects", "style": {"padding": "35px 50px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Modern Gradient';

-- Sunset Coral - flatten to linear
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "60px 55px", "textAlign": "left", "background": "linear-gradient(135deg, #DC2626 0%, #F97316 100%)", "boxShadow": "0 15px 45px rgba(220, 38, 38, 0.3)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "35px 55px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #F97316", "backgroundColor": "#FEF2F2"}},
    {"id": "experience", "type": "experience", "style": {"padding": "35px 55px", "itemSpacing": "26px"}},
    {"id": "education", "type": "education", "style": {"padding": "35px 55px", "itemSpacing": "20px", "borderTop": "3px solid #F97316"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "35px 55px", "backgroundColor": "#FEF2F2"}},
    {"id": "projects", "type": "projects", "style": {"padding": "35px 55px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Sunset Coral';

-- Tech Innovator - flatten to linear
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#A5F3FC", "padding": "60px 50px", "textAlign": "left", "background": "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", "boxShadow": "0 15px 50px rgba(15, 23, 42, 0.4)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "35px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #22D3EE", "backgroundColor": "#F0FDFA"}},
    {"id": "experience", "type": "experience", "style": {"padding": "35px 50px", "itemSpacing": "28px"}},
    {"id": "education", "type": "education", "style": {"padding": "35px 50px", "itemSpacing": "20px", "borderTop": "3px solid #22D3EE"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "35px 50px", "backgroundColor": "#F0FDFA"}},
    {"id": "projects", "type": "projects", "style": {"padding": "35px 50px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Tech Innovator';

-- Warm Earth Tones - flatten to linear
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections}',
  '[
    {"id": "header", "type": "header", "style": {"color": "#FFFFFF", "padding": "55px 50px", "textAlign": "left", "background": "linear-gradient(135deg, #78350F 0%, #92400E 50%, #B45309 100%)", "boxShadow": "0 12px 40px rgba(120, 53, 15, 0.3)"}},
    {"id": "summary", "type": "summary", "style": {"padding": "30px 50px", "fontSize": "15px", "lineHeight": "1.7", "borderLeft": "4px solid #D97706", "backgroundColor": "#FFFBEB"}},
    {"id": "experience", "type": "experience", "style": {"padding": "30px 50px", "itemSpacing": "25px"}},
    {"id": "education", "type": "education", "style": {"padding": "30px 50px", "itemSpacing": "20px", "borderTop": "3px solid #D97706"}},
    {"id": "skills", "type": "skills", "style": {"display": "tags", "columns": 3, "padding": "30px 50px", "backgroundColor": "#FFFBEB"}},
    {"id": "projects", "type": "projects", "style": {"padding": "30px 50px", "itemSpacing": "20px"}}
  ]'::jsonb
)
WHERE name = 'Warm Earth Tones';