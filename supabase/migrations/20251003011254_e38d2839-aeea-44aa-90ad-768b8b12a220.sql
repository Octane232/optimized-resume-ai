-- Delete existing templates and create professional modern templates

DELETE FROM resume_templates;

-- Template 1: Azure Executive
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Azure Executive',
  'Modern',
  'Sophisticated azure design with executive styling and geometric accents',
  false,
  jsonb_build_object(
    'layout', 'executive-modern',
    'theme', jsonb_build_object(
      'primaryColor', '#2563EB',
      'secondaryColor', '#1E40AF',
      'accentColor', '#60A5FA',
      'backgroundColor', '#FFFFFF',
      'textColor', '#1E293B',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '80px 64px', 'background', 'linear-gradient(135deg, #1E40AF 0%, #2563EB 50%, #3B82F6 100%)', 'textAlign', 'left', 'color', '#FFFFFF', 'position', 'relative', 'boxShadow', '0 20px 60px rgba(37, 99, 235, 0.3)')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '48px 64px', 'fontSize', '18px', 'lineHeight', '1.8', 'backgroundColor', '#F8FAFC', 'borderLeft', '6px solid #2563EB', 'fontWeight', '400')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '48px 64px', 'itemSpacing', '40px', 'borderBottom', '1px solid #E2E8F0')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '48px 64px', 'display', 'tags', 'columns', 4, 'gap', '16px')),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '48px 64px', 'itemSpacing', '32px'))
    )
  ),
  jsonb_build_object('primary_color', '#2563EB', 'secondary_color', '#1E40AF', 'accent_color', '#60A5FA', 'font_family', 'Inter', 'layout', 'executive-modern'),
  jsonb_build_object()
);

-- Template 2: Crimson Creative
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Crimson Creative',
  'Modern',
  'Bold crimson design with creative asymmetric layout and dynamic elements',
  true,
  jsonb_build_object(
    'layout', 'creative-asymmetric',
    'theme', jsonb_build_object(
      'primaryColor', '#DC2626',
      'secondaryColor', '#991B1B',
      'accentColor', '#FCA5A5',
      'backgroundColor', '#FFFBFB',
      'textColor', '#1F2937',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '72px 64px 72px 96px', 'background', 'linear-gradient(120deg, #991B1B 0%, #DC2626 100%)', 'textAlign', 'left', 'color', '#FFFFFF', 'clipPath', 'polygon(0 0, 100% 0, 100% 85%, 0 100%)', 'boxShadow', '0 25px 70px rgba(220, 38, 38, 0.4)')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '56px 64px 56px 96px', 'fontSize', '18px', 'lineHeight', '1.9', 'backgroundColor', '#FEF2F2', 'borderRadius', '0 24px 24px 0', 'marginLeft', '32px', 'boxShadow', '0 8px 24px rgba(220, 38, 38, 0.12)')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '56px 64px 56px 96px', 'itemSpacing', '48px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '56px 64px 56px 96px', 'display', 'blocks', 'columns', 3, 'gap', '20px')),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '56px 64px 56px 96px', 'itemSpacing', '36px'))
    )
  ),
  jsonb_build_object('primary_color', '#DC2626', 'secondary_color', '#991B1B', 'accent_color', '#FCA5A5', 'font_family', 'Inter', 'layout', 'creative-asymmetric'),
  jsonb_build_object()
);

-- Template 3: Violet Prestige
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Violet Prestige',
  'Modern',
  'Luxurious violet with floating card design and premium aesthetics',
  true,
  jsonb_build_object(
    'layout', 'prestige-cards',
    'theme', jsonb_build_object(
      'primaryColor', '#7C3AED',
      'secondaryColor', '#5B21B6',
      'accentColor', '#A78BFA',
      'backgroundColor', '#F9F5FF',
      'textColor', '#1F2937',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '88px 72px', 'background', 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #8B5CF6 100%)', 'textAlign', 'center', 'color', '#FFFFFF', 'borderRadius', '0 0 48px 48px', 'boxShadow', '0 30px 80px rgba(124, 58, 237, 0.35)')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '48px 56px', 'fontSize', '18px', 'lineHeight', '1.9', 'backgroundColor', '#FFFFFF', 'margin', '48px 72px', 'borderRadius', '28px', 'boxShadow', '0 12px 40px rgba(124, 58, 237, 0.15)', 'border', '1px solid #EDE9FE')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '48px 56px', 'margin', '24px 72px', 'backgroundColor', '#FFFFFF', 'borderRadius', '28px', 'itemSpacing', '36px', 'boxShadow', '0 12px 40px rgba(124, 58, 237, 0.15)')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '48px 56px', 'margin', '24px 72px', 'backgroundColor', '#FFFFFF', 'borderRadius', '28px', 'display', 'tags', 'columns', 3, 'gap', '18px', 'boxShadow', '0 12px 40px rgba(124, 58, 237, 0.15)')),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '48px 56px', 'margin', '24px 72px 72px', 'backgroundColor', '#FFFFFF', 'borderRadius', '28px', 'itemSpacing', '28px', 'boxShadow', '0 12px 40px rgba(124, 58, 237, 0.15)'))
    )
  ),
  jsonb_build_object('primary_color', '#7C3AED', 'secondary_color', '#5B21B6', 'accent_color', '#A78BFA', 'font_family', 'Inter', 'layout', 'prestige-cards'),
  jsonb_build_object()
);

-- Template 4: Emerald Elite
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Emerald Elite',
  'Modern',
  'Sophisticated emerald with split-section layout and premium finish',
  false,
  jsonb_build_object(
    'layout', 'elite-split',
    'theme', jsonb_build_object(
      'primaryColor', '#059669',
      'secondaryColor', '#047857',
      'accentColor', '#34D399',
      'backgroundColor', '#FFFFFF',
      'textColor', '#1F2937',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '80px 72px', 'background', 'linear-gradient(135deg, #047857 0%, #059669 50%, #10B981 100%)', 'textAlign', 'left', 'color', '#FFFFFF', 'boxShadow', '0 22px 65px rgba(5, 150, 105, 0.35)')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '52px 72px', 'fontSize', '18px', 'lineHeight', '1.85', 'backgroundColor', '#ECFDF5', 'borderLeft', '8px solid #059669', 'borderRadius', '0 20px 20px 0')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '52px 72px', 'itemSpacing', '44px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '52px 72px', 'display', 'tags', 'columns', 4, 'gap', '18px')),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '52px 72px', 'itemSpacing', '32px'))
    )
  ),
  jsonb_build_object('primary_color', '#059669', 'secondary_color', '#047857', 'accent_color', '#34D399', 'font_family', 'Inter', 'layout', 'elite-split'),
  jsonb_build_object()
);

-- Template 5: Rose Elegance
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Rose Elegance',
  'Modern',
  'Refined rose gold with serif typography and elegant borders',
  true,
  jsonb_build_object(
    'layout', 'elegant-serif',
    'theme', jsonb_build_object(
      'primaryColor', '#E11D48',
      'secondaryColor', '#BE123C',
      'accentColor', '#FB7185',
      'backgroundColor', '#FFF1F2',
      'textColor', '#881337',
      'fontFamily', 'Playfair Display'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '96px 80px', 'background', 'linear-gradient(135deg, #BE123C 0%, #E11D48 50%, #F43F5E 100%)', 'textAlign', 'center', 'color', '#FFFFFF', 'borderBottom', '6px solid #FFF1F2')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '56px 80px', 'fontSize', '19px', 'lineHeight', '2.0', 'fontStyle', 'italic', 'textAlign', 'center', 'borderTop', '3px solid #E11D48', 'borderBottom', '3px solid #E11D48', 'margin', '48px 80px')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '56px 80px', 'itemSpacing', '48px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '56px 80px', 'display', 'blocks', 'columns', 3, 'gap', '24px')),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '56px 80px', 'itemSpacing', '40px'))
    )
  ),
  jsonb_build_object('primary_color', '#E11D48', 'secondary_color', '#BE123C', 'accent_color', '#FB7185', 'font_family', 'Playfair Display', 'layout', 'elegant-serif'),
  jsonb_build_object()
);

-- Template 6: Ocean Professional
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Ocean Professional',
  'Modern',
  'Deep ocean blue with wave contours and professional spacing',
  false,
  jsonb_build_object(
    'layout', 'professional-wave',
    'theme', jsonb_build_object(
      'primaryColor', '#0369A1',
      'secondaryColor', '#075985',
      'accentColor', '#38BDF8',
      'backgroundColor', '#FFFFFF',
      'textColor', '#0C4A6E',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '84px 68px', 'background', 'linear-gradient(135deg, #075985 0%, #0369A1 50%, #0284C7 100%)', 'textAlign', 'center', 'color', '#FFFFFF', 'borderRadius', '0 0 60% 60% / 0 0 50px 50px', 'boxShadow', '0 24px 70px rgba(3, 105, 161, 0.35)')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '52px 68px', 'fontSize', '18px', 'lineHeight', '1.85', 'backgroundColor', '#F0F9FF', 'borderRadius', '20px', 'margin', '48px 68px')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '48px 68px', 'itemSpacing', '40px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '48px 68px', 'display', 'tags', 'columns', 3, 'gap', '16px')),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '48px 68px', 'itemSpacing', '32px'))
    )
  ),
  jsonb_build_object('primary_color', '#0369A1', 'secondary_color', '#075985', 'accent_color', '#38BDF8', 'font_family', 'Inter', 'layout', 'professional-wave'),
  jsonb_build_object()
);

-- Template 7: Teal Modern
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Teal Modern',
  'Modern',
  'Contemporary teal with layered sections and shadow depth',
  false,
  jsonb_build_object(
    'layout', 'modern-layered',
    'theme', jsonb_build_object(
      'primaryColor', '#0D9488',
      'secondaryColor', '#0F766E',
      'accentColor', '#5EEAD4',
      'backgroundColor', '#F0FDFA',
      'textColor', '#134E4A',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '76px 64px', 'background', 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)', 'textAlign', 'left', 'color', '#FFFFFF', 'borderRadius', '0 0 40px 0', 'boxShadow', '0 20px 60px rgba(13, 148, 136, 0.3)')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '48px 56px', 'fontSize', '17px', 'lineHeight', '1.85', 'backgroundColor', '#FFFFFF', 'borderRadius', '24px', 'margin', '48px 64px', 'boxShadow', '0 10px 35px rgba(13, 148, 136, 0.12)', 'border', '1px solid #CCFBF1')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '44px 64px', 'itemSpacing', '36px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '44px 64px', 'display', 'tags', 'columns', 4, 'gap', '16px')),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '44px 64px', 'itemSpacing', '28px'))
    )
  ),
  jsonb_build_object('primary_color', '#0D9488', 'secondary_color', '#0F766E', 'accent_color', '#5EEAD4', 'font_family', 'Inter', 'layout', 'modern-layered'),
  jsonb_build_object()
);

-- Template 8: Amber Prestige
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Amber Prestige',
  'Modern',
  'Luxurious amber gold with diagonal accents and premium styling',
  true,
  jsonb_build_object(
    'layout', 'prestige-diagonal',
    'theme', jsonb_build_object(
      'primaryColor', '#D97706',
      'secondaryColor', '#B45309',
      'accentColor', '#FCD34D',
      'backgroundColor', '#FFFBEB',
      'textColor', '#78350F',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '92px 76px', 'background', 'linear-gradient(135deg, #B45309 0%, #D97706 50%, #F59E0B 100%)', 'textAlign', 'left', 'color', '#FFFFFF', 'clipPath', 'polygon(0 0, 100% 0, 100% 88%, 0 100%)', 'boxShadow', '0 28px 75px rgba(217, 119, 6, 0.4)')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '60px 76px', 'fontSize', '19px', 'lineHeight', '1.9', 'backgroundColor', '#FEF3C7', 'borderRadius', '28px', 'margin', '56px 76px', 'boxShadow', '0 14px 45px rgba(217, 119, 6, 0.18)')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '56px 76px', 'itemSpacing', '52px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '56px 76px', 'display', 'blocks', 'columns', 3, 'gap', '24px')),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '56px 76px', 'itemSpacing', '40px'))
    )
  ),
  jsonb_build_object('primary_color', '#D97706', 'secondary_color', '#B45309', 'accent_color', '#FCD34D', 'font_family', 'Inter', 'layout', 'prestige-diagonal'),
  jsonb_build_object()
);

-- Template 9: Slate Professional
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Slate Professional',
  'Modern',
  'Sleek slate gray with minimalist luxury and clean lines',
  false,
  jsonb_build_object(
    'layout', 'professional-minimal',
    'theme', jsonb_build_object(
      'primaryColor', '#475569',
      'secondaryColor', '#334155',
      'accentColor', '#94A3B8',
      'backgroundColor', '#F8FAFC',
      'textColor', '#1E293B',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '88px 72px', 'background', 'linear-gradient(135deg, #1E293B 0%, #334155 50%, #475569 100%)', 'textAlign', 'left', 'color', '#FFFFFF', 'borderBottom', '8px solid #CBD5E1')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '56px 72px', 'fontSize', '18px', 'lineHeight', '1.9', 'backgroundColor', '#FFFFFF', 'borderLeft', '10px solid #475569', 'boxShadow', '0 8px 30px rgba(71, 85, 105, 0.1)')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '52px 72px', 'itemSpacing', '44px', 'borderBottom', '2px solid #E2E8F0')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '52px 72px', 'display', 'tags', 'columns', 4, 'gap', '18px')),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '52px 72px', 'itemSpacing', '36px'))
    )
  ),
  jsonb_build_object('primary_color', '#475569', 'secondary_color', '#334155', 'accent_color', '#94A3B8', 'font_family', 'Inter', 'layout', 'professional-minimal'),
  jsonb_build_object()
);

-- Template 10: Fuchsia Bold
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Fuchsia Bold',
  'Modern',
  'Vibrant fuchsia with bold typography and dynamic card layout',
  true,
  jsonb_build_object(
    'layout', 'bold-dynamic',
    'theme', jsonb_build_object(
      'primaryColor', '#C026D3',
      'secondaryColor', '#A21CAF',
      'accentColor', '#E879F9',
      'backgroundColor', '#FDF4FF',
      'textColor', '#701A75',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '96px 80px', 'background', 'linear-gradient(135deg, #A21CAF 0%, #C026D3 50%, #D946EF 100%)', 'textAlign', 'center', 'color', '#FFFFFF', 'borderRadius', '0 0 50px 50px', 'boxShadow', '0 32px 85px rgba(192, 38, 211, 0.4)')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '52px 64px', 'fontSize', '19px', 'lineHeight', '1.9', 'backgroundColor', '#FFFFFF', 'margin', '56px 80px', 'borderRadius', '32px', 'boxShadow', '0 16px 50px rgba(192, 38, 211, 0.2)', 'border', '2px solid #F5D0FE')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '48px 56px', 'margin', '24px 80px', 'backgroundColor', '#FFFFFF', 'borderRadius', '32px', 'itemSpacing', '40px', 'boxShadow', '0 16px 50px rgba(192, 38, 211, 0.2)')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '48px 56px', 'margin', '24px 80px', 'backgroundColor', '#FFFFFF', 'borderRadius', '32px', 'display', 'tags', 'columns', 3, 'gap', '20px', 'boxShadow', '0 16px 50px rgba(192, 38, 211, 0.2)')),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '48px 56px', 'margin', '24px 80px 80px', 'backgroundColor', '#FFFFFF', 'borderRadius', '32px', 'itemSpacing', '32px', 'boxShadow', '0 16px 50px rgba(192, 38, 211, 0.2)'))
    )
  ),
  jsonb_build_object('primary_color', '#C026D3', 'secondary_color', '#A21CAF', 'accent_color', '#E879F9', 'font_family', 'Inter', 'layout', 'bold-dynamic'),
  jsonb_build_object()
);