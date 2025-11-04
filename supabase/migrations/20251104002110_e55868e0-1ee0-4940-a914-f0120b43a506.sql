
-- Insert 10 unique classic resume templates
INSERT INTO resume_templates (name, description, category, json_content, template, styles, is_premium) VALUES
('Timeless Professional', 'Classic serif font with elegant borders - perfect for law and finance', 'classic', 
'{"sections":[{"type":"header","styles":{"padding":"40px","backgroundColor":"#ffffff","borderBottom":"3px double #1e293b","textAlign":"center"},"children":[{"type":"text","content":"{{contact.name}}","styles":{"fontSize":"36px","fontWeight":"700","color":"#1e293b","marginBottom":"8px","fontFamily":"Georgia, serif","letterSpacing":"2px"}},{"type":"text","content":"{{contact.title}}","styles":{"fontSize":"16px","color":"#64748b","marginBottom":"20px","textTransform":"uppercase","letterSpacing":"3px"}},{"type":"contact","styles":{"display":"flex","justifyContent":"center","gap":"20px","fontSize":"13px","color":"#475569"},"children":[{"content":"{{contact.email}}"},{"content":"{{contact.phone}}"},{"content":"{{contact.location}}"}]}]}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false),

('Corporate Standard', 'Traditional left-aligned layout with subtle gray accents', 'classic',
'{"sections":[{"type":"header","styles":{"padding":"32px 40px","backgroundColor":"#f8fafc","borderLeft":"8px solid #334155"},"children":[{"type":"text","content":"{{contact.name}}","styles":{"fontSize":"32px","fontWeight":"700","color":"#0f172a","marginBottom":"6px"}},{"type":"text","content":"{{contact.title}}","styles":{"fontSize":"18px","color":"#475569","marginBottom":"16px"}},{"type":"contact","styles":{"display":"flex","gap":"16px","fontSize":"14px","color":"#64748b"},"children":[{"content":"{{contact.email}}"},{"content":"{{contact.phone}}"}]}]}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false),

('Executive Formal', 'Sophisticated black and white design with gold accents', 'classic',
'{"sections":[{"type":"header","styles":{"padding":"48px 40px","backgroundColor":"#000000","color":"#ffffff"},"children":[{"type":"text","content":"{{contact.name}}","styles":{"fontSize":"38px","fontWeight":"700","marginBottom":"10px","borderBottom":"2px solid #d4af37","display":"inline-block","paddingBottom":"8px"}},{"type":"text","content":"{{contact.title}}","styles":{"fontSize":"18px","color":"#d4af37","marginBottom":"20px","fontWeight":"500"}},{"type":"contact","styles":{"display":"flex","gap":"18px","fontSize":"13px","opacity":"0.9"},"children":[{"content":"{{contact.email}}"},{"content":"{{contact.phone}}"}]}]}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false),

('Academic CV', 'Traditional academic format with clear section headers', 'classic',
'{"sections":[{"type":"header","styles":{"padding":"36px","backgroundColor":"#ffffff","borderBottom":"1px solid #cbd5e1","textAlign":"center"},"children":[{"type":"text","content":"{{contact.name}}","styles":{"fontSize":"28px","fontWeight":"600","color":"#1e293b","marginBottom":"6px","fontFamily":"Times New Roman, serif"}},{"type":"text","content":"{{contact.title}}","styles":{"fontSize":"16px","color":"#64748b","marginBottom":"18px","fontStyle":"italic"}},{"type":"contact","styles":{"display":"flex","justifyContent":"center","gap":"14px","fontSize":"13px","color":"#475569"},"children":[{"content":"{{contact.email}}"},{"content":"{{contact.phone}}"}]}]}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false),

('Professional Blue', 'Clean design with navy blue header and structured layout', 'classic',
'{"sections":[{"type":"header","styles":{"padding":"36px 40px","backgroundColor":"#1e3a8a","color":"#ffffff"},"children":[{"type":"text","content":"{{contact.name}}","styles":{"fontSize":"34px","fontWeight":"700","marginBottom":"8px"}},{"type":"text","content":"{{contact.title}}","styles":{"fontSize":"18px","marginBottom":"18px","opacity":"0.95"}},{"type":"contact","styles":{"display":"flex","gap":"16px","fontSize":"14px","opacity":"0.9"},"children":[{"content":"{{contact.email}}"},{"content":"{{contact.phone}}"},{"content":"{{contact.location}}"}]}]}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false),

('Minimalist Classic', 'Ultra-clean design with maximum white space and subtle lines', 'classic',
'{"sections":[{"type":"header","styles":{"padding":"44px 50px","backgroundColor":"#ffffff","borderBottom":"1px solid #e2e8f0"},"children":[{"type":"text","content":"{{contact.name}}","styles":{"fontSize":"32px","fontWeight":"600","color":"#0f172a","marginBottom":"10px","letterSpacing":"0.5px"}},{"type":"text","content":"{{contact.title}}","styles":{"fontSize":"16px","color":"#64748b","marginBottom":"24px"}},{"type":"contact","styles":{"display":"flex","gap":"20px","fontSize":"13px","color":"#94a3b8"},"children":[{"content":"{{contact.email}}"},{"content":"{{contact.phone}}"}]}]}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false),

('Traditional Sidebar', 'Classic two-column layout with left sidebar for contact info', 'classic',
'{"sections":[{"type":"columns","styles":{"display":"grid","gridTemplateColumns":"280px 1fr"},"children":[{"type":"sidebar","styles":{"backgroundColor":"#f1f5f9","padding":"40px 28px","borderRight":"2px solid #cbd5e1"},"children":[{"type":"text","content":"{{contact.name}}","styles":{"fontSize":"24px","fontWeight":"700","color":"#1e293b","marginBottom":"8px"}},{"type":"text","content":"{{contact.title}}","styles":{"fontSize":"14px","color":"#64748b","marginBottom":"24px"}}]}]}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false),

('Formal Document', 'Document-style resume with clear hierarchy and structure', 'classic',
'{"sections":[{"type":"header","styles":{"padding":"32px 45px","backgroundColor":"#ffffff","borderBottom":"4px solid #0f172a"},"children":[{"type":"text","content":"{{contact.name}}","styles":{"fontSize":"30px","fontWeight":"700","color":"#0f172a","marginBottom":"6px","textTransform":"uppercase","letterSpacing":"1px"}},{"type":"text","content":"{{contact.title}}","styles":{"fontSize":"16px","color":"#475569","marginBottom":"16px"}},{"type":"contact","styles":{"display":"flex","gap":"18px","fontSize":"13px","color":"#64748b"},"children":[{"content":"{{contact.email}}"},{"content":"{{contact.phone}}"},{"content":"{{contact.location}}"}]}]}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false),

('Banking Professional', 'Conservative design with green accents perfect for financial sector', 'classic',
'{"sections":[{"type":"header","styles":{"padding":"38px 40px","backgroundColor":"#f8fafb","borderTop":"6px solid #065f46"},"children":[{"type":"text","content":"{{contact.name}}","styles":{"fontSize":"34px","fontWeight":"700","color":"#064e3b","marginBottom":"8px"}},{"type":"text","content":"{{contact.title}}","styles":{"fontSize":"17px","color":"#047857","marginBottom":"18px"}},{"type":"contact","styles":{"display":"flex","gap":"16px","fontSize":"14px","color":"#6b7280"},"children":[{"content":"{{contact.email}}"},{"content":"{{contact.phone}}"}]}]}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false),

('Refined Elegance', 'Sophisticated design with burgundy accents and refined typography', 'classic',
'{"sections":[{"type":"header","styles":{"padding":"40px","backgroundColor":"#fef2f2","borderBottom":"3px solid #7f1d1d","textAlign":"center"},"children":[{"type":"text","content":"{{contact.name}}","styles":{"fontSize":"35px","fontWeight":"700","color":"#7f1d1d","marginBottom":"10px","fontFamily":"Georgia, serif"}},{"type":"text","content":"{{contact.title}}","styles":{"fontSize":"16px","color":"#991b1b","marginBottom":"20px"}},{"type":"contact","styles":{"display":"flex","justifyContent":"center","gap":"18px","fontSize":"13px","color":"#b91c1c"},"children":[{"content":"{{contact.email}}"},{"content":"{{contact.phone}}"}]}]}]}'::jsonb,
'{}'::jsonb, '{}'::jsonb, false);
