-- Add ATS compatibility fields to resume_templates table
ALTER TABLE public.resume_templates 
ADD COLUMN IF NOT EXISTS ats_score integer DEFAULT 85 CHECK (ats_score >= 0 AND ats_score <= 100),
ADD COLUMN IF NOT EXISTS ats_friendly boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS ats_features jsonb DEFAULT '[]'::jsonb;

-- Add comment explaining the columns
COMMENT ON COLUMN public.resume_templates.ats_score IS 'ATS compatibility score from 0-100';
COMMENT ON COLUMN public.resume_templates.ats_friendly IS 'Whether template is optimized for ATS';
COMMENT ON COLUMN public.resume_templates.ats_features IS 'Array of ATS-friendly features like ["simple-formatting", "standard-fonts", "clear-sections"]';

-- Update existing templates with ATS scores based on their characteristics
UPDATE public.resume_templates
SET 
  ats_score = CASE 
    WHEN category = 'professional' THEN 95
    WHEN category = 'modern' THEN 90
    WHEN category = 'classic' THEN 98
    WHEN category = 'creative' THEN 70
    WHEN category = 'technical' THEN 92
    ELSE 85
  END,
  ats_friendly = CASE 
    WHEN category IN ('professional', 'classic', 'modern', 'technical') THEN true
    ELSE false
  END,
  ats_features = CASE 
    WHEN category = 'classic' THEN '["standard-fonts", "clear-sections", "simple-formatting", "no-graphics", "single-column"]'::jsonb
    WHEN category = 'professional' THEN '["standard-fonts", "clear-sections", "simple-formatting", "keyword-optimized"]'::jsonb
    WHEN category = 'modern' THEN '["standard-fonts", "clear-sections", "minimal-design"]'::jsonb
    WHEN category = 'technical' THEN '["standard-fonts", "clear-sections", "skills-focused", "simple-formatting"]'::jsonb
    ELSE '["basic-formatting"]'::jsonb
  END;