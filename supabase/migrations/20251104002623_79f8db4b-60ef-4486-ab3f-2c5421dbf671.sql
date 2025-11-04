
-- Delete the incomplete classic templates we just added
DELETE FROM resume_templates 
WHERE name IN (
  'Timeless Professional',
  'Corporate Standard',
  'Executive Formal',
  'Academic CV',
  'Professional Blue',
  'Minimalist Classic',
  'Traditional Sidebar',
  'Formal Document',
  'Banking Professional',
  'Refined Elegance'
);

-- Insert complete classic templates with all sections
INSERT INTO resume_templates (name, description, category, json_content, template, styles, is_premium) VALUES
('Timeless Professional', 'Classic serif font with elegant borders - perfect for law and finance', 'classic',
'{"theme":{"primaryColor":"#1e293b","secondaryColor":"#64748b","accentColor":"#475569","backgroundColor":"#ffffff","textColor":"#0f172a","fontFamily":"Georgia, serif"},"sections":[{"type":"header","id":"header","style":{"padding":"40px","backgroundColor":"#ffffff","borderBottom":"3px double #1e293b","textAlign":"center"}},{"type":"summary","id":"summary","style":{"padding":"30px 50px","backgroundColor":"#f8fafc","borderLeft":"4px solid #1e293b","margin":"0 50px 30px"}},{"type":"grid","id":"main-grid","style":{"display":"grid","gridTemplateColumns":"1fr 2fr","gap":"30px","padding":"0 50px"},"children":[{"type":"skills","id":"skills","style":{"padding":"20px","backgroundColor":"#f8fafc","borderRadius":"8px"}},{"type":"experience","id":"experience","style":{"padding":"0"}}]},{"type":"education","id":"education","style":{"padding":"30px 50px"}}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false),

('Corporate Standard', 'Traditional left-aligned layout with subtle gray accents', 'classic',
'{"theme":{"primaryColor":"#334155","secondaryColor":"#64748b","accentColor":"#475569","backgroundColor":"#ffffff","textColor":"#0f172a","fontFamily":"Inter, sans-serif"},"sections":[{"type":"header","id":"header","style":{"padding":"32px 40px","backgroundColor":"#f8fafc","borderLeft":"8px solid #334155"}},{"type":"summary","id":"summary","style":{"padding":"24px 40px","backgroundColor":"#ffffff"}},{"type":"experience","id":"experience","style":{"padding":"24px 40px","borderTop":"1px solid #e2e8f0"}},{"type":"grid","id":"bottom-grid","style":{"display":"grid","gridTemplateColumns":"1fr 1fr","gap":"40px","padding":"24px 40px","backgroundColor":"#f8fafc"},"children":[{"type":"skills","id":"skills"},{"type":"education","id":"education"}]}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false),

('Executive Formal', 'Sophisticated black and white design with gold accents', 'classic',
'{"theme":{"primaryColor":"#000000","secondaryColor":"#d4af37","accentColor":"#6b7280","backgroundColor":"#ffffff","textColor":"#1f2937","fontFamily":"Times New Roman, serif"},"sections":[{"type":"header","id":"header","style":{"padding":"48px 40px","backgroundColor":"#000000","color":"#ffffff"}},{"type":"summary","id":"summary","style":{"padding":"32px 40px","backgroundColor":"#fafaf9","borderTop":"3px solid #d4af37","borderBottom":"3px solid #d4af37"}},{"type":"experience","id":"experience","style":{"padding":"32px 40px"}},{"type":"grid","id":"bottom-grid","style":{"display":"grid","gridTemplateColumns":"1fr 1fr","gap":"40px","padding":"32px 40px","backgroundColor":"#fafaf9"},"children":[{"type":"education","id":"education"},{"type":"skills","id":"skills"}]}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false),

('Academic CV', 'Traditional academic format with clear section headers', 'classic',
'{"theme":{"primaryColor":"#1e293b","secondaryColor":"#64748b","accentColor":"#94a3b8","backgroundColor":"#ffffff","textColor":"#0f172a","fontFamily":"Times New Roman, serif"},"sections":[{"type":"header","id":"header","style":{"padding":"36px","backgroundColor":"#ffffff","borderBottom":"1px solid #cbd5e1","textAlign":"center"}},{"type":"summary","id":"summary","style":{"padding":"28px 60px","textAlign":"center","fontStyle":"italic"}},{"type":"education","id":"education","style":{"padding":"28px 60px","borderTop":"1px solid #e2e8f0"}},{"type":"experience","id":"experience","style":{"padding":"28px 60px","borderTop":"1px solid #e2e8f0"}},{"type":"skills","id":"skills","style":{"padding":"28px 60px","borderTop":"1px solid #e2e8f0"}}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false),

('Professional Blue', 'Clean design with navy blue header and structured layout', 'classic',
'{"theme":{"primaryColor":"#1e3a8a","secondaryColor":"#3b82f6","accentColor":"#60a5fa","backgroundColor":"#ffffff","textColor":"#1f2937","fontFamily":"Arial, sans-serif"},"sections":[{"type":"header","id":"header","style":{"padding":"36px 40px","backgroundColor":"#1e3a8a","color":"#ffffff"}},{"type":"summary","id":"summary","style":{"padding":"28px 40px","backgroundColor":"#eff6ff"}},{"type":"columns","id":"main-columns","style":{"display":"grid","gridTemplateColumns":"300px 1fr","gap":"0"},"children":[{"type":"sidebar","style":{"backgroundColor":"#f0f9ff","padding":"28px 24px"},"children":[{"type":"skills","id":"skills"},{"type":"education","id":"education","style":{"marginTop":"28px"}}]},{"type":"experience","id":"experience","style":{"padding":"28px 40px"}}]}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false);
