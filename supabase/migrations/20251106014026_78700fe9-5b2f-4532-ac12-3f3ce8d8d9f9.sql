-- Create table for tracking cover letters
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_title TEXT NOT NULL,
  company_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

-- Create policies for cover letters
CREATE POLICY "Users can view their own cover letters"
  ON public.cover_letters
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cover letters"
  ON public.cover_letters
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cover letters"
  ON public.cover_letters
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cover letters"
  ON public.cover_letters
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create table for tracking saved jobs
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  salary TEXT,
  job_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for saved jobs
CREATE POLICY "Users can view their own saved jobs"
  ON public.saved_jobs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved jobs"
  ON public.saved_jobs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved jobs"
  ON public.saved_jobs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for cover letters updated_at
CREATE TRIGGER update_cover_letters_updated_at
  BEFORE UPDATE ON public.cover_letters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();