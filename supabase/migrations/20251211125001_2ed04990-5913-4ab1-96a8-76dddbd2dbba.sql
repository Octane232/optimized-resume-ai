-- Add usage tracking columns to user_usage_stats
ALTER TABLE public.user_usage_stats 
ADD COLUMN IF NOT EXISTS monthly_template_selections integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_pdf_downloads integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_ai_generations integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS usage_cycle_reset_date timestamp with time zone DEFAULT now();

-- Update existing rows to have reset date if null
UPDATE public.user_usage_stats 
SET usage_cycle_reset_date = now() 
WHERE usage_cycle_reset_date IS NULL;