-- Add a column to track if user has seen the walkthrough tour
ALTER TABLE public.career_preferences 
ADD COLUMN IF NOT EXISTS walkthrough_completed BOOLEAN DEFAULT false;