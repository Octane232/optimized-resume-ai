
-- Update templates with more distinct header styles
UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections,0,style}',
  '{"padding":"40px","backgroundColor":"#ffffff","borderBottom":"3px double #1e293b","textAlign":"center","color":"#1e293b","fontSize":"2.25rem","fontFamily":"Georgia, serif","letterSpacing":"2px","titleFontSize":"1rem","titleTextTransform":"uppercase","titleLetterSpacing":"3px"}'::jsonb
)
WHERE name = 'Timeless Professional';

UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections,0,style}',
  '{"padding":"32px 40px","backgroundColor":"#f8fafc","borderLeft":"8px solid #334155","textAlign":"left","color":"#0f172a","fontSize":"2rem","fontWeight":"700"}'::jsonb
)
WHERE name = 'Corporate Standard';

UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections,0,style}',
  '{"padding":"48px 40px","backgroundColor":"#000000","color":"#ffffff","fontSize":"2.375rem","fontWeight":"700","borderBottom":"2px solid #d4af37","titleFontSize":"1.125rem","titleFontWeight":"500"}'::jsonb
)
WHERE name = 'Executive Formal';

UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections,0,style}',
  '{"padding":"36px","backgroundColor":"#ffffff","borderBottom":"1px solid #cbd5e1","textAlign":"center","color":"#1e293b","fontSize":"1.75rem","fontWeight":"600","fontFamily":"Times New Roman, serif","titleFontSize":"1rem","titleFontStyle":"italic"}'::jsonb
)
WHERE name = 'Academic CV';

UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections,0,style}',
  '{"padding":"36px 40px","backgroundColor":"#1e3a8a","color":"#ffffff","fontSize":"2.125rem","fontWeight":"700","titleFontSize":"1.125rem","titleOpacity":"0.95"}'::jsonb
)
WHERE name = 'Professional Blue';

UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections,0,style}',
  '{"padding":"44px 50px","backgroundColor":"#ffffff","borderBottom":"1px solid #e2e8f0","color":"#0f172a","fontSize":"2rem","fontWeight":"600","letterSpacing":"0.5px"}'::jsonb
)
WHERE name = 'Minimalist Classic';

UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections,0,style}',
  '{"marginBottom":"32px","padding":"0","backgroundColor":"transparent","color":"#1e293b","fontSize":"1.5rem","fontWeight":"700"}'::jsonb
)
WHERE name = 'Traditional Sidebar';

UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections,0,style}',
  '{"padding":"32px 45px","backgroundColor":"#ffffff","borderBottom":"4px solid #0f172a","color":"#0f172a","fontSize":"1.875rem","fontWeight":"700","textTransform":"uppercase","letterSpacing":"1px"}'::jsonb
)
WHERE name = 'Formal Document';

UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections,0,style}',
  '{"padding":"38px 40px","backgroundColor":"#f8fafb","borderTop":"6px solid #065f46","color":"#064e3b","fontSize":"2.125rem","fontWeight":"700","titleFontSize":"1.0625rem"}'::jsonb
)
WHERE name = 'Banking Professional';

UPDATE resume_templates 
SET json_content = jsonb_set(
  json_content,
  '{sections,0,style}',
  '{"padding":"40px","backgroundColor":"#fef2f2","borderBottom":"3px solid #7f1d1d","textAlign":"center","color":"#7f1d1d","fontSize":"2.1875rem","fontWeight":"700","fontFamily":"Georgia, serif"}'::jsonb
)
WHERE name = 'Refined Elegance';
