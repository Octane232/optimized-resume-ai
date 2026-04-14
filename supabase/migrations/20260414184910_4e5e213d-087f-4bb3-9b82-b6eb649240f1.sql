
-- Add stripe_customer_id column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- Insert canonical Starter and Pro plans (skip if they already exist)
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, is_popular, color_class, icon_name, features)
VALUES 
  ('Starter', 'Perfect for getting started with your job search', 12, 115, false, 'from-blue-500 to-blue-600', 'Zap', '["50 AI credits/month", "Unlimited resumes", "ATS scoring", "Cover letter generator"]'::jsonb),
  ('Pro', 'For serious job seekers who want every advantage', 29, 278, true, 'from-purple-500 to-purple-600', 'Crown', '["100 AI credits/month", "Everything in Starter", "Interview prep", "LinkedIn optimizer", "Priority support"]'::jsonb)
ON CONFLICT DO NOTHING;
