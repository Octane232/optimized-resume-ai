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

  IF usage_row.reset_date <= NOW() THEN
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