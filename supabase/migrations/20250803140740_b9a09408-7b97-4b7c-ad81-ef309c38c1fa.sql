-- Add columns to profiles table for better user data
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_completion INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS website TEXT;

-- Create resume_analytics table
CREATE TABLE public.resume_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  resume_id UUID,
  downloads INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (resume_id) REFERENCES public.resumes(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.resume_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for resume_analytics
CREATE POLICY "Users can view their own analytics" 
ON public.resume_analytics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analytics" 
ON public.resume_analytics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics" 
ON public.resume_analytics 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create user_subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_name TEXT NOT NULL DEFAULT 'Free',
  plan_status TEXT NOT NULL DEFAULT 'active',
  billing_cycle TEXT DEFAULT 'monthly',
  price DECIMAL(10,2) DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_subscriptions
CREATE POLICY "Users can view their own subscription" 
ON public.user_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
ON public.user_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create ai_tips table
CREATE TABLE public.ai_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_global BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_tips ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_tips
CREATE POLICY "Users can view relevant tips" 
ON public.ai_tips 
FOR SELECT 
USING (is_global = true OR auth.uid() = user_id);

-- Create user_activities table
CREATE TABLE public.user_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Create policies for user_activities
CREATE POLICY "Users can view their own activities" 
ON public.user_activities 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
ON public.user_activities 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_resume_analytics_updated_at
BEFORE UPDATE ON public.resume_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_tips_updated_at
BEFORE UPDATE ON public.ai_tips
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample AI tips
INSERT INTO public.ai_tips (title, description, category, is_global) VALUES
('Optimize Your Resume Keywords', 'Use industry-specific keywords that match the job description to improve your ATS score.', 'optimization', true),
('Quantify Your Achievements', 'Include specific numbers and metrics to demonstrate your impact in previous roles.', 'writing', true),
('Keep It Concise', 'Aim for 1-2 pages maximum. Recruiters spend only 6 seconds on initial resume screening.', 'format', true);

-- Insert default subscription for existing users
INSERT INTO public.user_subscriptions (user_id, plan_name, plan_status)
SELECT user_id, 'Free', 'active' 
FROM public.profiles 
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_subscriptions 
  WHERE user_subscriptions.user_id = profiles.user_id
);