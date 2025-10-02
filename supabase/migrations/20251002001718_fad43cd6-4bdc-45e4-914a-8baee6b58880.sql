-- Add json_content column to resume_templates
ALTER TABLE resume_templates
ADD COLUMN IF NOT EXISTS json_content jsonb;

-- Update the first template with proper structure and sample resume data
UPDATE resume_templates
SET json_content = jsonb_build_object(
  'layout', 'modern',
  'theme', jsonb_build_object(
    'primaryColor', '#3B82F6',
    'secondaryColor', '#1E40AF',
    'accentColor', '#F59E0B',
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
        'backgroundColor', 'gradient',
        'textAlign', 'center'
      )
    ),
    jsonb_build_object(
      'id', 'summary',
      'type', 'summary',
      'style', jsonb_build_object(
        'padding', '24px',
        'fontSize', '16px'
      )
    ),
    jsonb_build_object(
      'id', 'experience',
      'type', 'experience',
      'style', jsonb_build_object(
        'padding', '24px',
        'itemSpacing', '24px'
      )
    ),
    jsonb_build_object(
      'id', 'skills',
      'type', 'skills',
      'style', jsonb_build_object(
        'padding', '24px',
        'display', 'tags',
        'columns', 3
      )
    ),
    jsonb_build_object(
      'id', 'education',
      'type', 'education',
      'style', jsonb_build_object(
        'padding', '24px',
        'itemSpacing', '16px'
      )
    )
  )
),
template = jsonb_build_object(
  'contact', jsonb_build_object(
    'name', 'Michael Chen',
    'title', 'Regional Sales Director',
    'email', 'michael.chen@email.com',
    'phone', '+1 (555) 852-9630',
    'location', 'Chicago, IL',
    'linkedin', 'linkedin.com/in/michaelchen-sales'
  ),
  'summary', 'Results-driven sales director with 10+ years of experience exceeding revenue targets and building high-performing sales teams. Expert in B2B sales, strategic account management, and developing innovative sales strategies that consistently deliver exceptional results.',
  'skills', jsonb_build_array(
    'B2B Sales',
    'Account Management',
    'Team Leadership',
    'CRM Systems',
    'Negotiation',
    'Strategic Planning',
    'Revenue Growth',
    'Client Relations'
  ),
  'work_experience', jsonb_build_array(
    jsonb_build_object(
      'position', 'Regional Sales Director',
      'company', 'Enterprise Solutions Inc.',
      'period', '2021 - Present',
      'responsibilities', jsonb_build_array(
        'Exceeded annual revenue targets by 135% for 3 consecutive years',
        'Built and led sales team of 15 representatives across 5 states',
        'Closed $12M+ in new business development deals',
        'Implemented data-driven sales strategies increasing conversion rates by 45%'
      )
    ),
    jsonb_build_object(
      'position', 'Senior Account Manager',
      'company', 'TechFlow Systems',
      'period', '2018 - 2021',
      'responsibilities', jsonb_build_array(
        'Managed portfolio of 50+ enterprise accounts worth $25M+ ARR',
        'Achieved 98% customer retention rate through relationship building',
        'Mentored junior sales team members on best practices',
        'Developed strategic partnerships resulting in 40% revenue growth'
      )
    )
  ),
  'education', jsonb_build_array(
    jsonb_build_object(
      'degree', 'Bachelor of Science in Business Administration',
      'institution', 'Northwestern University',
      'period', '2010 - 2014',
      'details', 'GPA: 3.8 | Kellogg School Certificate in Sales & Marketing'
    )
  )
)
WHERE id = '0bdb15fc-8ec0-47ae-a9fd-1cbdb9ab40a4';