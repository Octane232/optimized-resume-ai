
-- Insert trial-tier feature limits
INSERT INTO public.plan_feature_limits (tier, feature, monthly_limit) VALUES
  ('trial', 'resume_ats', 3),
  ('trial', 'cover_letter', 3),
  ('trial', 'linkedin', 3),
  ('trial', 'skill_gap', 3),
  ('trial', 'interview_prep', 5),
  ('trial', 'salary_intel', 2),
  ('trial', 'radar_alert', 3),
  ('trial', 'docx_rewrite', 2),
  ('trial', 'resume_parse', 10)
ON CONFLICT (tier, feature) DO UPDATE SET monthly_limit = EXCLUDED.monthly_limit;

-- Update increment_usage: active trial -> 'trial' tier (not 'elite')
CREATE OR REPLACE FUNCTION public.increment_usage(p_user_id uuid, p_feature text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_used INTEGER;
  user_tier TEXT;
  feature_limit INTEGER;
  user_sub RECORD;
BEGIN
  SELECT tier, plan_status, trial_end INTO user_sub
  FROM user_subscriptions
  WHERE user_id = p_user_id;

  IF user_sub IS NULL THEN
    user_tier := 'free';
  ELSE
    IF user_sub.plan_status = 'trial' AND user_sub.trial_end IS NOT NULL AND NOW() < user_sub.trial_end THEN
      user_tier := 'trial';
    ELSIF user_sub.plan_status = 'active' THEN
      user_tier := user_sub.tier;
    ELSE
      user_tier := 'free';
    END IF;
  END IF;

  SELECT monthly_limit INTO feature_limit
  FROM plan_feature_limits
  WHERE tier = user_tier AND feature = p_feature;

  IF feature_limit IS NULL THEN
    feature_limit := 0;
  END IF;

  SELECT used INTO current_used
  FROM user_usage
  WHERE user_id = p_user_id AND feature = p_feature;

  IF current_used IS NULL THEN
    IF feature_limit <= 0 THEN
      RETURN FALSE;
    END IF;
    INSERT INTO user_usage (user_id, feature, used, reset_date)
    VALUES (p_user_id, p_feature, 1, NOW() + INTERVAL '30 days');
    RETURN TRUE;
  END IF;

  IF current_used >= feature_limit THEN
    RETURN FALSE;
  END IF;

  UPDATE user_usage
  SET used = used + 1, updated_at = NOW()
  WHERE user_id = p_user_id AND feature = p_feature;

  RETURN TRUE;
END;
$function$;
