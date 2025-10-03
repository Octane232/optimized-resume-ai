-- Insert multiple resume templates with sample data
INSERT INTO resume_templates (name, category, description, is_premium, template, styles, json_content) VALUES
(
  'Modern Professional',
  'Modern',
  'Clean and contemporary design perfect for tech and creative industries',
  false,
  '{"layout": "modern", "sections": ["header", "summary", "experience", "skills", "education"]}',
  '{"primaryColor": "#3B82F6", "fontFamily": "Inter", "layout": "modern"}',
  '{"layout": "modern", "theme": {"primaryColor": "#3B82F6", "secondaryColor": "#1E40AF", "accentColor": "#60A5FA", "backgroundColor": "#FFFFFF", "textColor": "#1F2937", "fontFamily": "Inter"}, "sections": [{"id": "header", "type": "header", "style": {"backgroundColor": "gradient", "padding": "48px", "textAlign": "center"}}, {"id": "summary", "type": "summary"}, {"id": "experience", "type": "experience"}, {"id": "skills", "type": "skills", "style": {"columns": 3}}, {"id": "education", "type": "education"}]}'
),
(
  'Classic Professional',
  'Classic',
  'Traditional and timeless design ideal for corporate and formal industries',
  false,
  '{"layout": "classic", "sections": ["header", "summary", "experience", "education", "skills"]}',
  '{"primaryColor": "#1F2937", "fontFamily": "Georgia", "layout": "classic"}',
  '{"layout": "classic", "theme": {"primaryColor": "#1F2937", "secondaryColor": "#374151", "accentColor": "#6B7280", "backgroundColor": "#FFFFFF", "textColor": "#1F2937", "fontFamily": "Georgia"}, "sections": [{"id": "header", "type": "header", "style": {"padding": "32px", "textAlign": "left"}}, {"id": "summary", "type": "summary"}, {"id": "experience", "type": "experience"}, {"id": "education", "type": "education"}, {"id": "skills", "type": "skills"}]}'
),
(
  'Creative Designer',
  'Creative',
  'Bold and artistic layout perfect for designers and creative professionals',
  false,
  '{"layout": "creative", "sections": ["header", "portfolio", "experience", "skills", "education"]}',
  '{"primaryColor": "#8B5CF6", "fontFamily": "Poppins", "layout": "creative"}',
  '{"layout": "creative", "theme": {"primaryColor": "#8B5CF6", "secondaryColor": "#7C3AED", "accentColor": "#A78BFA", "backgroundColor": "#FFFFFF", "textColor": "#1F2937", "fontFamily": "Poppins"}, "sections": [{"id": "header", "type": "header", "style": {"backgroundColor": "gradient", "padding": "48px", "textAlign": "center"}}, {"id": "summary", "type": "summary"}, {"id": "experience", "type": "experience"}, {"id": "skills", "type": "skills", "style": {"columns": 2}}, {"id": "education", "type": "education"}]}'
),
(
  'Tech Developer',
  'Tech',
  'Technical and sleek design optimized for software engineers and developers',
  false,
  '{"layout": "tech", "sections": ["header", "summary", "skills", "experience", "projects", "education"]}',
  '{"primaryColor": "#10B981", "fontFamily": "Roboto Mono", "layout": "tech"}',
  '{"layout": "tech", "theme": {"primaryColor": "#10B981", "secondaryColor": "#059669", "accentColor": "#34D399", "backgroundColor": "#FFFFFF", "textColor": "#1F2937", "fontFamily": "Roboto Mono"}, "sections": [{"id": "header", "type": "header", "style": {"padding": "32px", "textAlign": "left"}}, {"id": "summary", "type": "summary"}, {"id": "skills", "type": "skills", "style": {"columns": 4}}, {"id": "experience", "type": "experience"}, {"id": "education", "type": "education"}]}'
),
(
  'Executive Leadership',
  'Executive',
  'Premium and sophisticated design for C-level and senior executives',
  true,
  '{"layout": "executive", "sections": ["header", "summary", "leadership", "experience", "education", "board"]}',
  '{"primaryColor": "#DC2626", "fontFamily": "Playfair Display", "layout": "executive"}',
  '{"layout": "executive", "theme": {"primaryColor": "#DC2626", "secondaryColor": "#B91C1C", "accentColor": "#EF4444", "backgroundColor": "#FFFFFF", "textColor": "#1F2937", "fontFamily": "Playfair Display"}, "sections": [{"id": "header", "type": "header", "style": {"padding": "40px", "textAlign": "center"}}, {"id": "summary", "type": "summary"}, {"id": "experience", "type": "experience"}, {"id": "education", "type": "education"}, {"id": "skills", "type": "skills"}]}'
),
(
  'Minimalist Simple',
  'Modern',
  'Ultra-clean minimalist design focusing on content over decoration',
  false,
  '{"layout": "minimalist", "sections": ["header", "experience", "education", "skills"]}',
  '{"primaryColor": "#64748B", "fontFamily": "Inter", "layout": "minimalist"}',
  '{"layout": "minimalist", "theme": {"primaryColor": "#64748B", "secondaryColor": "#475569", "accentColor": "#94A3B8", "backgroundColor": "#FFFFFF", "textColor": "#1F2937", "fontFamily": "Inter"}, "sections": [{"id": "header", "type": "header", "style": {"padding": "24px", "textAlign": "left"}}, {"id": "experience", "type": "experience"}, {"id": "education", "type": "education"}, {"id": "skills", "type": "skills", "style": {"columns": 3}}]}'
)
ON CONFLICT DO NOTHING;