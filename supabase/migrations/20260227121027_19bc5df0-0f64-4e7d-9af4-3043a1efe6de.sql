
CREATE TABLE public.waitlist_signups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public signup)
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist_signups
FOR INSERT
WITH CHECK (true);

-- No one can read (admin only via service role)
CREATE POLICY "Service role can read waitlist"
ON public.waitlist_signups
FOR SELECT
USING (false);
