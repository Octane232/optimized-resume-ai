-- 1. Profile fields used by the Settings page
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS profile_completion INTEGER NOT NULL DEFAULT 0;

-- 2. Per-plan feature limits
CREATE TABLE IF NOT EXISTS public.plan_feature_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tier TEXT NOT NULL,
  feature TEXT NOT NULL,
  monthly_limit INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (tier, feature)
);

GRANT SELECT ON public.plan_feature_limits TO authenticated;
GRANT SELECT ON public.plan_feature_limits TO anon;
GRANT ALL ON public.plan_feature_limits TO service_role;

ALTER TABLE public.plan_feature_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS plan_limits_public_read ON public.plan_feature_limits;
CREATE POLICY plan_limits_public_read
  ON public.plan_feature_limits FOR SELECT
  USING (true);

DROP TRIGGER IF EXISTS update_plan_feature_limits_updated_at ON public.plan_feature_limits;
CREATE TRIGGER update_plan_feature_limits_updated_at
  BEFORE UPDATE ON public.plan_feature_limits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.plan_feature_limits (tier, feature, monthly_limit) VALUES
('free','resume_ats',0),('free','cover_letter',0),('free','linkedin',0),('free','skill_gap',0),
('free','interview_prep',0),('free','salary_intel',0),('free','radar_alert',0),('free','docx_rewrite',0),
('free','resume_parse',0),('free','job_search',0),('free','bullet_rewrite',0),
('pro','resume_ats',30),('pro','cover_letter',30),('pro','linkedin',15),('pro','skill_gap',15),
('pro','interview_prep',30),('pro','salary_intel',10),('pro','radar_alert',15),('pro','docx_rewrite',10),
('pro','resume_parse',100),('pro','job_search',50),('pro','bullet_rewrite',75),
('elite','resume_ats',100),('elite','cover_letter',100),('elite','linkedin',50),('elite','skill_gap',50),
('elite','interview_prep',100),('elite','salary_intel',30),('elite','radar_alert',50),('elite','docx_rewrite',50),
('elite','resume_parse',500),('elite','job_search',120),('elite','bullet_rewrite',300)
ON CONFLICT (tier, feature) DO UPDATE SET monthly_limit = EXCLUDED.monthly_limit;

-- 3. Usage counter routine
CREATE OR REPLACE FUNCTION public.increment_usage(p_user_id uuid, p_feature text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_tier TEXT;
  feature_limit INTEGER;
  usage_row RECORD;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  SELECT CASE
           WHEN plan_status <> 'active' THEN 'free'
           WHEN current_period_end IS NOT NULL AND current_period_end <= now() THEN 'free'
           WHEN tier = 'starter' THEN 'pro'
           WHEN tier = 'premium' THEN 'elite'
           WHEN tier IN ('pro','elite') THEN tier
           ELSE 'free'
         END
    INTO user_tier
  FROM user_subscriptions
  WHERE user_id = p_user_id
  ORDER BY updated_at DESC
  LIMIT 1;

  IF user_tier IS NULL THEN
    user_tier := 'free';
  END IF;

  SELECT monthly_limit INTO feature_limit
  FROM plan_feature_limits
  WHERE tier = user_tier AND feature = p_feature;

  IF feature_limit IS NULL OR feature_limit <= 0 THEN
    RETURN FALSE;
  END IF;

  SELECT * INTO usage_row
  FROM user_usage
  WHERE user_id = p_user_id AND feature = p_feature
  FOR UPDATE;

  IF usage_row IS NULL THEN
    INSERT INTO user_usage (user_id, feature, used, reset_date)
    VALUES (p_user_id, p_feature, 1, NOW() + INTERVAL '30 days');
    RETURN TRUE;
  END IF;

  IF usage_row.reset_date IS NULL OR usage_row.reset_date <= NOW() THEN
    UPDATE user_usage
      SET used = 1, reset_date = NOW() + INTERVAL '30 days', updated_at = NOW()
    WHERE user_id = p_user_id AND feature = p_feature;
    RETURN TRUE;
  END IF;

  IF usage_row.used >= feature_limit THEN
    RETURN FALSE;
  END IF;

  UPDATE user_usage
    SET used = used + 1, updated_at = NOW()
  WHERE user_id = p_user_id AND feature = p_feature;

  RETURN TRUE;
END;
$function$;

REVOKE ALL ON FUNCTION public.increment_usage(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_usage(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_usage(uuid, text) TO service_role;

-- 4. Job search events: let people record their own
DROP POLICY IF EXISTS usage_events_insert_own ON public.usage_events;
CREATE POLICY usage_events_insert_own
  ON public.usage_events FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

GRANT INSERT ON public.usage_events TO authenticated;

-- 5. New sign-ups land on the Free plan record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  free_plan_id uuid;
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (user_id) DO NOTHING;

  SELECT id INTO free_plan_id FROM public.subscription_plans WHERE slug = 'free' LIMIT 1;

  INSERT INTO public.user_subscriptions (user_id, plan_id, tier, plan_status, price)
  VALUES (NEW.id, free_plan_id, 'free', 'inactive', 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$function$;