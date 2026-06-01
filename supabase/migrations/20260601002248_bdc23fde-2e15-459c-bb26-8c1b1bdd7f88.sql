
REVOKE EXECUTE ON FUNCTION public.increment_usage(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_usage(uuid, text) TO authenticated, service_role;

DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist_signups;
CREATE POLICY "Anyone can join waitlist" ON public.waitlist_signups
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(email) BETWEEN 3 AND 320
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );
