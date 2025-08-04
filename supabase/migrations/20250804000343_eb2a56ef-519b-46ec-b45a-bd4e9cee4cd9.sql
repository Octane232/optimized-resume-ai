
-- Create table for user activities (extending the existing one)
-- The existing user_activities table already exists, so we'll add missing columns if needed

-- Create table for billing invoices
CREATE TABLE public.billing_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  invoice_number TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'paid',
  description TEXT NOT NULL,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user usage statistics
CREATE TABLE public.user_usage_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  resumes_created INTEGER DEFAULT 0,
  ai_generations INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  templates_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for connected services
CREATE TABLE public.connected_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  service_name TEXT NOT NULL,
  service_description TEXT,
  is_connected BOOLEAN DEFAULT false,
  icon_name TEXT,
  color_class TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, service_name)
);

-- Create table for subscription plans (for billing component)
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  features JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  icon_name TEXT,
  color_class TEXT,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for billing_invoices
CREATE POLICY "Users can view their own invoices" 
  ON public.billing_invoices 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own invoices" 
  ON public.billing_invoices 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_usage_stats
CREATE POLICY "Users can view their own usage stats" 
  ON public.user_usage_stats 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own usage stats" 
  ON public.user_usage_stats 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage stats" 
  ON public.user_usage_stats 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for connected_services
CREATE POLICY "Users can view their own connected services" 
  ON public.connected_services 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own connected services" 
  ON public.connected_services 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connected services" 
  ON public.connected_services 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for subscription_plans (public read access)
CREATE POLICY "Anyone can view subscription plans" 
  ON public.subscription_plans 
  FOR SELECT 
  TO public
  USING (true);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, price_monthly, price_yearly, features, description, icon_name, color_class, is_popular) VALUES 
('Free', 0, 0, 
 '["3 resumes max", "Basic templates", "Standard support", "PDF download", "Basic customization"]'::jsonb, 
 'Perfect for getting started', 'Shield', 'from-slate-500 to-slate-600', false),
('Pro', 19, 190, 
 '["Unlimited resumes", "AI-powered content generation", "Premium templates", "Priority support", "Advanced customization", "Multiple formats (PDF, DOCX)", "Interview preparation", "Job matching"]'::jsonb, 
 'Most popular for professionals', 'Sparkles', 'from-blue-500 to-purple-600', true),
('Enterprise', 49, 490, 
 '["Everything in Pro", "Team collaboration", "Advanced analytics", "Custom branding", "Dedicated support", "API access", "Bulk resume generation", "Custom integrations"]'::jsonb, 
 'For teams and organizations', 'Users', 'from-emerald-500 to-teal-600', false);

-- Insert default connected services for all users (will be created when user signs up)
INSERT INTO public.connected_services (user_id, service_name, service_description, is_connected, icon_name, color_class)
SELECT 
  u.id,
  service.name,
  service.description,
  false,
  service.icon,
  service.color
FROM auth.users u,
(VALUES 
  ('Gmail', 'Send resumes directly to employers', 'Mail', 'from-red-500 to-red-600'),
  ('Google Drive', 'Backup and sync your resumes', 'Upload', 'from-blue-500 to-blue-600'),
  ('Dropbox', 'Cloud storage integration', 'Download', 'from-indigo-500 to-indigo-600')
) AS service(name, description, icon, color)
ON CONFLICT (user_id, service_name) DO NOTHING;

-- Create trigger to auto-create user usage stats when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_extended()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Create default usage stats
  INSERT INTO public.user_usage_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT DO NOTHING;
  
  -- Create default connected services
  INSERT INTO public.connected_services (user_id, service_name, service_description, is_connected, icon_name, color_class)
  VALUES 
    (NEW.id, 'Gmail', 'Send resumes directly to employers', false, 'Mail', 'from-red-500 to-red-600'),
    (NEW.id, 'Google Drive', 'Backup and sync your resumes', false, 'Upload', 'from-blue-500 to-blue-600'),
    (NEW.id, 'Dropbox', 'Cloud storage integration', false, 'Download', 'from-indigo-500 to-indigo-600')
  ON CONFLICT (user_id, service_name) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user_extended: %', SQLERRM;
    RETURN NEW;
END;
$function$;

-- Create trigger for new user setup
DROP TRIGGER IF EXISTS on_auth_user_created_extended ON auth.users;
CREATE TRIGGER on_auth_user_created_extended
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_extended();
