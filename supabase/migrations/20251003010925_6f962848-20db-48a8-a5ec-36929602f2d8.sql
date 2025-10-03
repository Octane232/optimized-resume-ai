-- Insert 10 modern Canva-themed resume templates

-- Template 1: Gradient Sky
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Gradient Sky',
  'Modern',
  'Beautiful sky-blue gradient header with clean modern layout',
  false,
  jsonb_build_object(
    'layout', 'modern-gradient',
    'theme', jsonb_build_object(
      'primaryColor', '#0EA5E9',
      'secondaryColor', '#3B82F6',
      'accentColor', '#6366F1',
      'backgroundColor', '#FFFFFF',
      'textColor', '#1E293B',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '56px 48px', 'background', 'linear-gradient(135deg, #0EA5E9 0%, #3B82F6 50%, #6366F1 100%)', 'textAlign', 'center', 'color', '#FFFFFF')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '40px', 'fontSize', '16px', 'lineHeight', '1.7', 'backgroundColor', '#F8FAFC', 'margin', '32px', 'borderRadius', '16px')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '32px 48px', 'itemSpacing', '32px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '32px 48px', 'display', 'tags', 'columns', 4)),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '32px 48px', 'itemSpacing', '20px'))
    )
  ),
  jsonb_build_object('primary_color', '#0EA5E9', 'secondary_color', '#3B82F6', 'accent_color', '#6366F1', 'font_family', 'Inter', 'layout', 'modern-gradient'),
  jsonb_build_object()
);

-- Template 2: Coral Sunset
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Coral Sunset',
  'Modern',
  'Warm coral and orange tones with elegant typography',
  false,
  jsonb_build_object(
    'layout', 'modern-warm',
    'theme', jsonb_build_object(
      'primaryColor', '#F97316',
      'secondaryColor', '#FB923C',
      'accentColor', '#FDBA74',
      'backgroundColor', '#FFFFFF',
      'textColor', '#292524',
      'fontFamily', 'Poppins'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '64px 48px', 'background', 'linear-gradient(120deg, #F97316 0%, #FB923C 100%)', 'textAlign', 'left', 'color', '#FFFFFF', 'borderRadius', '0 0 32px 0')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '40px', 'fontSize', '15px', 'lineHeight', '1.8', 'borderLeft', '4px solid #F97316', 'marginLeft', '48px')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '32px 48px', 'itemSpacing', '28px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '32px 48px', 'display', 'blocks', 'columns', 3)),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '32px 48px', 'itemSpacing', '20px'))
    )
  ),
  jsonb_build_object('primary_color', '#F97316', 'secondary_color', '#FB923C', 'accent_color', '#FDBA74', 'font_family', 'Poppins', 'layout', 'modern-warm'),
  jsonb_build_object()
);

-- Template 3: Purple Dream
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Purple Dream',
  'Modern',
  'Elegant purple gradient with modern card-based layout',
  true,
  jsonb_build_object(
    'layout', 'modern-cards',
    'theme', jsonb_build_object(
      'primaryColor', '#8B5CF6',
      'secondaryColor', '#A78BFA',
      'accentColor', '#C4B5FD',
      'backgroundColor', '#FAF5FF',
      'textColor', '#1F2937',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '48px', 'background', 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', 'textAlign', 'center', 'color', '#FFFFFF', 'clipPath', 'polygon(0 0, 100% 0, 100% 85%, 0 100%)')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '32px', 'fontSize', '16px', 'backgroundColor', '#FFFFFF', 'margin', '32px', 'borderRadius', '20px', 'boxShadow', '0 4px 20px rgba(139, 92, 246, 0.1)')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '32px', 'margin', '0 32px', 'backgroundColor', '#FFFFFF', 'borderRadius', '20px', 'itemSpacing', '24px', 'boxShadow', '0 4px 20px rgba(139, 92, 246, 0.1)')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '32px', 'margin', '32px', 'backgroundColor', '#FFFFFF', 'borderRadius', '20px', 'display', 'tags', 'columns', 3, 'boxShadow', '0 4px 20px rgba(139, 92, 246, 0.1)')),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '32px', 'margin', '0 32px 32px', 'backgroundColor', '#FFFFFF', 'borderRadius', '20px', 'itemSpacing', '16px', 'boxShadow', '0 4px 20px rgba(139, 92, 246, 0.1)'))
    )
  ),
  jsonb_build_object('primary_color', '#8B5CF6', 'secondary_color', '#A78BFA', 'accent_color', '#C4B5FD', 'font_family', 'Inter', 'layout', 'modern-cards'),
  jsonb_build_object()
);

-- Template 4: Emerald Professional
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Emerald Professional',
  'Modern',
  'Fresh emerald green with sophisticated layout',
  false,
  jsonb_build_object(
    'layout', 'modern-professional',
    'theme', jsonb_build_object(
      'primaryColor', '#10B981',
      'secondaryColor', '#059669',
      'accentColor', '#34D399',
      'backgroundColor', '#FFFFFF',
      'textColor', '#1F2937',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '56px 48px', 'background', 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 'textAlign', 'left', 'color', '#FFFFFF')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '40px 48px', 'fontSize', '16px', 'lineHeight', '1.7', 'backgroundColor', '#ECFDF5', 'borderLeft', '6px solid #10B981')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '40px 48px', 'itemSpacing', '32px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '40px 48px', 'display', 'tags', 'columns', 4)),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '40px 48px', 'itemSpacing', '20px'))
    )
  ),
  jsonb_build_object('primary_color', '#10B981', 'secondary_color', '#059669', 'accent_color', '#34D399', 'font_family', 'Inter', 'layout', 'modern-professional'),
  jsonb_build_object()
);

-- Template 5: Rose Gold
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Rose Gold',
  'Modern',
  'Elegant rose gold with luxury styling',
  true,
  jsonb_build_object(
    'layout', 'modern-luxury',
    'theme', jsonb_build_object(
      'primaryColor', '#EC4899',
      'secondaryColor', '#F472B6',
      'accentColor', '#FBCFE8',
      'backgroundColor', '#FFF7FB',
      'textColor', '#1F2937',
      'fontFamily', 'Playfair Display'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '64px 48px', 'background', 'linear-gradient(135deg, #EC4899 0%, #F472B6 50%, #FBCFE8 100%)', 'textAlign', 'center', 'color', '#FFFFFF')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '48px', 'fontSize', '17px', 'lineHeight', '1.8', 'fontStyle', 'italic', 'textAlign', 'center', 'borderTop', '2px solid #EC4899', 'borderBottom', '2px solid #EC4899')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '40px 48px', 'itemSpacing', '36px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '40px 48px', 'display', 'blocks', 'columns', 3)),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '40px 48px', 'itemSpacing', '24px'))
    )
  ),
  jsonb_build_object('primary_color', '#EC4899', 'secondary_color', '#F472B6', 'accent_color', '#FBCFE8', 'font_family', 'Playfair Display', 'layout', 'modern-luxury'),
  jsonb_build_object()
);

-- Template 6: Ocean Blue
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Ocean Blue',
  'Modern',
  'Deep ocean blue with wave-inspired design',
  false,
  jsonb_build_object(
    'layout', 'modern-wave',
    'theme', jsonb_build_object(
      'primaryColor', '#1E40AF',
      'secondaryColor', '#3B82F6',
      'accentColor', '#60A5FA',
      'backgroundColor', '#FFFFFF',
      'textColor', '#1E293B',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '60px 48px', 'background', 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)', 'textAlign', 'center', 'color', '#FFFFFF', 'borderRadius', '0 0 50% 50% / 0 0 40px 40px')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '40px 48px', 'fontSize', '16px', 'lineHeight', '1.7')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '32px 48px', 'itemSpacing', '28px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '32px 48px', 'display', 'tags', 'columns', 3)),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '32px 48px', 'itemSpacing', '20px'))
    )
  ),
  jsonb_build_object('primary_color', '#1E40AF', 'secondary_color', '#3B82F6', 'accent_color', '#60A5FA', 'font_family', 'Inter', 'layout', 'modern-wave'),
  jsonb_build_object()
);

-- Template 7: Mint Fresh
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Mint Fresh',
  'Modern',
  'Cool mint green with clean minimalist design',
  false,
  jsonb_build_object(
    'layout', 'modern-minimal',
    'theme', jsonb_build_object(
      'primaryColor', '#14B8A6',
      'secondaryColor', '#5EEAD4',
      'accentColor', '#99F6E4',
      'backgroundColor', '#F0FDFA',
      'textColor', '#134E4A',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '48px', 'background', '#14B8A6', 'textAlign', 'left', 'color', '#FFFFFF', 'borderBottom', '8px solid #5EEAD4')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '40px', 'fontSize', '16px', 'lineHeight', '1.7', 'backgroundColor', '#FFFFFF', 'borderRadius', '12px', 'margin', '32px')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '32px 40px', 'itemSpacing', '28px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '32px 40px', 'display', 'tags', 'columns', 4)),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '32px 40px', 'itemSpacing', '20px'))
    )
  ),
  jsonb_build_object('primary_color', '#14B8A6', 'secondary_color', '#5EEAD4', 'accent_color', '#99F6E4', 'font_family', 'Inter', 'layout', 'modern-minimal'),
  jsonb_build_object()
);

-- Template 8: Sunset Orange
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Sunset Orange',
  'Modern',
  'Vibrant sunset orange with bold modern aesthetic',
  true,
  jsonb_build_object(
    'layout', 'modern-bold',
    'theme', jsonb_build_object(
      'primaryColor', '#EA580C',
      'secondaryColor', '#F97316',
      'accentColor', '#FB923C',
      'backgroundColor', '#FFFFFF',
      'textColor', '#292524',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '72px 48px', 'background', 'linear-gradient(135deg, #EA580C 0%, #F97316 50%, #FB923C 100%)', 'textAlign', 'left', 'color', '#FFFFFF', 'clipPath', 'polygon(0 0, 100% 0, 100% 100%, 0 85%)')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '48px', 'fontSize', '17px', 'lineHeight', '1.8', 'backgroundColor', '#FFF7ED', 'borderRadius', '16px', 'margin', '40px')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '40px 48px', 'itemSpacing', '36px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '40px 48px', 'display', 'blocks', 'columns', 3)),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '40px 48px', 'itemSpacing', '24px'))
    )
  ),
  jsonb_build_object('primary_color', '#EA580C', 'secondary_color', '#F97316', 'accent_color', '#FB923C', 'font_family', 'Inter', 'layout', 'modern-bold'),
  jsonb_build_object()
);

-- Template 9: Indigo Night
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Indigo Night',
  'Modern',
  'Deep indigo with starry night inspiration',
  false,
  jsonb_build_object(
    'layout', 'modern-night',
    'theme', jsonb_build_object(
      'primaryColor', '#4338CA',
      'secondaryColor', '#6366F1',
      'accentColor', '#818CF8',
      'backgroundColor', '#F5F3FF',
      'textColor', '#1E1B4B',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '64px 48px', 'background', 'linear-gradient(135deg, #1E1B4B 0%, #4338CA 50%, #6366F1 100%)', 'textAlign', 'center', 'color', '#FFFFFF')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '40px', 'fontSize', '16px', 'lineHeight', '1.7', 'backgroundColor', '#FFFFFF', 'margin', '32px', 'borderRadius', '16px', 'boxShadow', '0 4px 16px rgba(67, 56, 202, 0.1)')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '32px 48px', 'itemSpacing', '28px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '32px 48px', 'display', 'tags', 'columns', 4)),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '32px 48px', 'itemSpacing', '20px'))
    )
  ),
  jsonb_build_object('primary_color', '#4338CA', 'secondary_color', '#6366F1', 'accent_color', '#818CF8', 'font_family', 'Inter', 'layout', 'modern-night'),
  jsonb_build_object()
);

-- Template 10: Cherry Blossom
INSERT INTO resume_templates (name, category, description, is_premium, json_content, styles, template) VALUES (
  'Cherry Blossom',
  'Modern',
  'Soft cherry blossom pink with delicate modern design',
  true,
  jsonb_build_object(
    'layout', 'modern-soft',
    'theme', jsonb_build_object(
      'primaryColor', '#DB2777',
      'secondaryColor', '#EC4899',
      'accentColor', '#F9A8D4',
      'backgroundColor', '#FDF2F8',
      'textColor', '#831843',
      'fontFamily', 'Inter'
    ),
    'sections', jsonb_build_array(
      jsonb_build_object('id', 'header', 'type', 'header', 'style', jsonb_build_object('padding', '56px 48px', 'background', 'linear-gradient(135deg, #DB2777 0%, #EC4899 50%, #F9A8D4 100%)', 'textAlign', 'center', 'color', '#FFFFFF', 'borderRadius', '0 0 40px 40px')),
      jsonb_build_object('id', 'summary', 'type', 'summary', 'style', jsonb_build_object('padding', '40px', 'fontSize', '16px', 'lineHeight', '1.8', 'backgroundColor', '#FFFFFF', 'margin', '32px', 'borderRadius', '20px', 'border', '2px solid #FBCFE8')),
      jsonb_build_object('id', 'experience', 'type', 'experience', 'style', jsonb_build_object('padding', '32px 48px', 'itemSpacing', '32px')),
      jsonb_build_object('id', 'skills', 'type', 'skills', 'style', jsonb_build_object('padding', '32px 48px', 'display', 'tags', 'columns', 3)),
      jsonb_build_object('id', 'education', 'type', 'education', 'style', jsonb_build_object('padding', '32px 48px', 'itemSpacing', '20px'))
    )
  ),
  jsonb_build_object('primary_color', '#DB2777', 'secondary_color', '#EC4899', 'accent_color', '#F9A8D4', 'font_family', 'Inter', 'layout', 'modern-soft'),
  jsonb_build_object()
);