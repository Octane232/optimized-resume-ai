-- Create job_applications table for application tracking
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_url TEXT,
  status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'interviewing', 'offer', 'rejected', 'withdrawn')),
  applied_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deadline TIMESTAMP WITH TIME ZONE,
  salary_range TEXT,
  location TEXT,
  notes TEXT,
  contact_person TEXT,
  contact_email TEXT,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create resume_scores table for ATS scoring
CREATE TABLE IF NOT EXISTS public.resume_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  formatting_score INTEGER CHECK (formatting_score >= 0 AND formatting_score <= 100),
  keywords_score INTEGER CHECK (keywords_score >= 0 AND keywords_score <= 100),
  experience_score INTEGER CHECK (experience_score >= 0 AND experience_score <= 100),
  education_score INTEGER CHECK (education_score >= 0 AND education_score <= 100),
  suggestions JSONB DEFAULT '[]'::jsonb,
  missing_keywords TEXT[] DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  weaknesses TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skill_gaps table for skill analysis
CREATE TABLE IF NOT EXISTS public.skill_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  resume_id UUID REFERENCES public.resumes(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  required_skills TEXT[] NOT NULL,
  user_skills TEXT[] NOT NULL,
  missing_skills TEXT[] NOT NULL,
  matching_skills TEXT[] NOT NULL,
  match_percentage INTEGER CHECK (match_percentage >= 0 AND match_percentage <= 100),
  recommendations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resume_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gaps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_applications
CREATE POLICY "Users can view their own applications"
  ON public.job_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
  ON public.job_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
  ON public.job_applications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
  ON public.job_applications FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for resume_scores
CREATE POLICY "Users can view their own resume scores"
  ON public.resume_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume scores"
  ON public.resume_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resume scores"
  ON public.resume_scores FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for skill_gaps
CREATE POLICY "Users can view their own skill gaps"
  ON public.skill_gaps FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own skill gaps"
  ON public.skill_gaps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX idx_job_applications_status ON public.job_applications(status);
CREATE INDEX idx_job_applications_applied_date ON public.job_applications(applied_date DESC);
CREATE INDEX idx_resume_scores_user_id ON public.resume_scores(user_id);
CREATE INDEX idx_resume_scores_resume_id ON public.resume_scores(resume_id);
CREATE INDEX idx_skill_gaps_user_id ON public.skill_gaps(user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_resume_scores_updated_at
  BEFORE UPDATE ON public.resume_scores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();