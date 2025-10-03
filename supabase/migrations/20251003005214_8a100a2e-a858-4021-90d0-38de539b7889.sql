-- Update all templates that don't have json_content with proper template data

-- Gradient Waves template
UPDATE resume_templates
SET json_content = jsonb_build_object(
  'layout', 'modern',
  'theme', jsonb_build_object(
    'primaryColor', '#8B5CF6',
    'secondaryColor', '#7C3AED',
    'accentColor', '#A78BFA',
    'backgroundColor', '#FFFFFF',
    'textColor', '#1F2937',
    'fontFamily', 'Inter'
  ),
  'sections', jsonb_build_array(
    jsonb_build_object(
      'id', 'header',
      'type', 'header',
      'style', jsonb_build_object(
        'padding', '48px',
        'background', 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        'textAlign', 'center',
        'color', '#FFFFFF'
      )
    ),
    jsonb_build_object(
      'id', 'summary',
      'type', 'summary',
      'style', jsonb_build_object(
        'padding', '32px',
        'fontSize', '16px',
        'lineHeight', '1.6'
      )
    ),
    jsonb_build_object(
      'id', 'experience',
      'type', 'experience',
      'style', jsonb_build_object(
        'padding', '32px',
        'itemSpacing', '24px'
      )
    ),
    jsonb_build_object(
      'id', 'skills',
      'type', 'skills',
      'style', jsonb_build_object(
        'padding', '32px',
        'display', 'tags',
        'columns', 3
      )
    ),
    jsonb_build_object(
      'id', 'education',
      'type', 'education',
      'style', jsonb_build_object(
        'padding', '32px',
        'itemSpacing', '16px'
      )
    )
  )
)
WHERE name = 'Gradient Waves';

-- Minimalist Lines template
UPDATE resume_templates
SET json_content = jsonb_build_object(
  'layout', 'minimal',
  'theme', jsonb_build_object(
    'primaryColor', '#374151',
    'secondaryColor', '#6B7280',
    'accentColor', '#111827',
    'backgroundColor', '#FFFFFF',
    'textColor', '#1F2937',
    'fontFamily', 'Georgia'
  ),
  'sections', jsonb_build_array(
    jsonb_build_object(
      'id', 'header',
      'type', 'header',
      'style', jsonb_build_object(
        'padding', '40px 32px',
        'borderBottom', '2px solid #374151',
        'textAlign', 'left'
      )
    ),
    jsonb_build_object(
      'id', 'summary',
      'type', 'summary',
      'style', jsonb_build_object(
        'padding', '24px 32px',
        'fontSize', '15px',
        'lineHeight', '1.7'
      )
    ),
    jsonb_build_object(
      'id', 'experience',
      'type', 'experience',
      'style', jsonb_build_object(
        'padding', '24px 32px',
        'itemSpacing', '20px'
      )
    ),
    jsonb_build_object(
      'id', 'skills',
      'type', 'skills',
      'style', jsonb_build_object(
        'padding', '24px 32px',
        'display', 'list',
        'columns', 2
      )
    ),
    jsonb_build_object(
      'id', 'education',
      'type', 'education',
      'style', jsonb_build_object(
        'padding', '24px 32px',
        'itemSpacing', '16px'
      )
    )
  )
)
WHERE name = 'Minimalist Lines';

-- Bold Header template
UPDATE resume_templates
SET json_content = jsonb_build_object(
  'layout', 'bold',
  'theme', jsonb_build_object(
    'primaryColor', '#EF4444',
    'secondaryColor', '#DC2626',
    'accentColor', '#FCA5A5',
    'backgroundColor', '#FFFFFF',
    'textColor', '#1F2937',
    'fontFamily', 'Inter'
  ),
  'sections', jsonb_build_array(
    jsonb_build_object(
      'id', 'header',
      'type', 'header',
      'style', jsonb_build_object(
        'padding', '56px 40px',
        'background', 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
        'textAlign', 'left',
        'color', '#FFFFFF'
      )
    ),
    jsonb_build_object(
      'id', 'summary',
      'type', 'summary',
      'style', jsonb_build_object(
        'padding', '32px',
        'fontSize', '16px',
        'backgroundColor', '#FEF2F2'
      )
    ),
    jsonb_build_object(
      'id', 'experience',
      'type', 'experience',
      'style', jsonb_build_object(
        'padding', '32px',
        'itemSpacing', '24px'
      )
    ),
    jsonb_build_object(
      'id', 'skills',
      'type', 'skills',
      'style', jsonb_build_object(
        'padding', '32px',
        'display', 'tags',
        'columns', 4
      )
    ),
    jsonb_build_object(
      'id', 'education',
      'type', 'education',
      'style', jsonb_build_object(
        'padding', '32px',
        'itemSpacing', '16px'
      )
    )
  )
)
WHERE name = 'Bold Header';

-- Layered Modern template
UPDATE resume_templates
SET json_content = jsonb_build_object(
  'layout', 'layered',
  'theme', jsonb_build_object(
    'primaryColor', '#0EA5E9',
    'secondaryColor', '#0284C7',
    'accentColor', '#7DD3FC',
    'backgroundColor', '#F8FAFC',
    'textColor', '#1E293B',
    'fontFamily', 'Inter'
  ),
  'sections', jsonb_build_array(
    jsonb_build_object(
      'id', 'header',
      'type', 'header',
      'style', jsonb_build_object(
        'padding', '48px',
        'background', '#0EA5E9',
        'textAlign', 'center',
        'color', '#FFFFFF',
        'borderRadius', '0 0 24px 24px'
      )
    ),
    jsonb_build_object(
      'id', 'summary',
      'type', 'summary',
      'style', jsonb_build_object(
        'padding', '32px',
        'fontSize', '16px',
        'backgroundColor', '#FFFFFF',
        'margin', '24px',
        'borderRadius', '12px',
        'boxShadow', '0 2px 8px rgba(0,0,0,0.1)'
      )
    ),
    jsonb_build_object(
      'id', 'experience',
      'type', 'experience',
      'style', jsonb_build_object(
        'padding', '32px',
        'margin', '24px',
        'backgroundColor', '#FFFFFF',
        'borderRadius', '12px',
        'itemSpacing', '24px'
      )
    ),
    jsonb_build_object(
      'id', 'skills',
      'type', 'skills',
      'style', jsonb_build_object(
        'padding', '32px',
        'margin', '24px',
        'backgroundColor', '#FFFFFF',
        'borderRadius', '12px',
        'display', 'tags',
        'columns', 3
      )
    ),
    jsonb_build_object(
      'id', 'education',
      'type', 'education',
      'style', jsonb_build_object(
        'padding', '32px',
        'margin', '24px',
        'backgroundColor', '#FFFFFF',
        'borderRadius', '12px',
        'itemSpacing', '16px'
      )
    )
  )
)
WHERE name = 'Layered Modern';

-- Geometric Blocks template
UPDATE resume_templates
SET json_content = jsonb_build_object(
  'layout', 'geometric',
  'theme', jsonb_build_object(
    'primaryColor', '#F59E0B',
    'secondaryColor', '#D97706',
    'accentColor', '#FCD34D',
    'backgroundColor', '#FFFFFF',
    'textColor', '#1F2937',
    'fontFamily', 'Inter'
  ),
  'sections', jsonb_build_array(
    jsonb_build_object(
      'id', 'header',
      'type', 'header',
      'style', jsonb_build_object(
        'padding', '48px',
        'background', 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'textAlign', 'center',
        'color', '#FFFFFF',
        'clipPath', 'polygon(0 0, 100% 0, 100% 85%, 0 100%)'
      )
    ),
    jsonb_build_object(
      'id', 'summary',
      'type', 'summary',
      'style', jsonb_build_object(
        'padding', '32px',
        'fontSize', '16px',
        'borderLeft', '4px solid #F59E0B',
        'marginLeft', '32px'
      )
    ),
    jsonb_build_object(
      'id', 'experience',
      'type', 'experience',
      'style', jsonb_build_object(
        'padding', '32px',
        'itemSpacing', '24px'
      )
    ),
    jsonb_build_object(
      'id', 'skills',
      'type', 'skills',
      'style', jsonb_build_object(
        'padding', '32px',
        'display', 'blocks',
        'columns', 3
      )
    ),
    jsonb_build_object(
      'id', 'education',
      'type', 'education',
      'style', jsonb_build_object(
        'padding', '32px',
        'itemSpacing', '16px'
      )
    )
  )
)
WHERE name = 'Geometric Blocks';