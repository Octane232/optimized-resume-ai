
-- Profiles cascade from auth users
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_user_id_auth_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE NOT VALID;

-- Other user tables cascade from profiles
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['user_subscriptions','user_usage','resumes','cover_letters','job_applications','interview_sessions','linkedin_optimizations','skill_gaps','career_preferences','radar_alerts','usage_events']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT VALID', t, t || '_user_id_profile_fkey');
  END LOOP;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_plan_id ON public.user_subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_usage_events_user ON public.usage_events(user_id, created_at DESC);

-- Lock down security definer function
REVOKE EXECUTE ON FUNCTION public.increment_usage(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_usage(uuid, text) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_profile_billing_fields() FROM PUBLIC, anon, authenticated;

-- Expired subscriptions -> free
UPDATE public.user_subscriptions
SET tier = 'free', plan_status = 'inactive', price = 0,
    plan_id = (SELECT id FROM public.subscription_plans WHERE slug = 'free')
WHERE current_period_end IS NOT NULL AND current_period_end <= now()
  AND plan_status IN ('active','trialing');
