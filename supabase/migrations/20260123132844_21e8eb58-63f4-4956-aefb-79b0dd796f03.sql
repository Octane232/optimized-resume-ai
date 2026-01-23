-- Create user_vault table for skills, certifications, projects, and tags
CREATE TABLE public.user_vault (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  skills TEXT[] DEFAULT '{}',
  certifications JSONB DEFAULT '[]',
  projects JSONB DEFAULT '[]',
  resume_tags TEXT[] DEFAULT '{General}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create career_streaks table for tracking user activity and achievements
CREATE TABLE public.career_streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_days_active INTEGER DEFAULT 0,
  weekly_goal INTEGER DEFAULT 5,
  weekly_goal_progress INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  xp_earned INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  achievements JSONB DEFAULT '[]',
  week_activity BOOLEAN[] DEFAULT '{false,false,false,false,false,false,false}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create career_wins table for logging weekly wins (growth mode)
CREATE TABLE public.career_wins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  formatted_content TEXT,
  category TEXT DEFAULT 'general',
  week_number INTEGER,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create linkedin_optimizations table for saving optimizations
CREATE TABLE public.linkedin_optimizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('headline', 'summary')),
  original_content TEXT,
  optimized_content TEXT NOT NULL,
  target_role TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_wins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.linkedin_optimizations ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_vault
CREATE POLICY "Users can view their own vault" ON public.user_vault FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own vault" ON public.user_vault FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own vault" ON public.user_vault FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for career_streaks
CREATE POLICY "Users can view their own streaks" ON public.career_streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own streaks" ON public.career_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own streaks" ON public.career_streaks FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for career_wins
CREATE POLICY "Users can view their own wins" ON public.career_wins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own wins" ON public.career_wins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own wins" ON public.career_wins FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for linkedin_optimizations
CREATE POLICY "Users can view their own optimizations" ON public.linkedin_optimizations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own optimizations" ON public.linkedin_optimizations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own optimizations" ON public.linkedin_optimizations FOR DELETE USING (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER update_user_vault_updated_at BEFORE UPDATE ON public.user_vault FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_career_streaks_updated_at BEFORE UPDATE ON public.career_streaks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();