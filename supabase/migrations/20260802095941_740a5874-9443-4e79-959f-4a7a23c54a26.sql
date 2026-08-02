DROP TRIGGER IF EXISTS on_auth_user_created_trial ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_trial();

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

  SELECT tier, plan_status INTO user_sub
  FROM user_subscriptions
  WHERE user_id = p_user_id;

  IF user_sub IS NULL OR user_sub.plan_status <> 'active' THEN
    user_tier := 'free';
  ELSE
    user_tier := user_sub.tier;
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

UPDATE public.user_subscriptions
SET plan_status = 'inactive', is_trial = false, trial_start = NULL, trial_end = NULL, tier = 'free', updated_at = now()
WHERE plan_status = 'trial' OR is_trial = true;

DELETE FROM public.plan_feature_limits WHERE tier = 'trial';