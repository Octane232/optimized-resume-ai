
-- 1. Lock down backend-only tables (webhook_events, radar_signals) with explicit deny-all policies for anon/authenticated.
-- service_role bypasses RLS, so edge functions continue to work.
CREATE POLICY "Deny client access" ON public.webhook_events
  FOR ALL TO anon, authenticated
  USING (false) WITH CHECK (false);

CREATE POLICY "Deny client access" ON public.radar_signals
  FOR ALL TO anon, authenticated
  USING (false) WITH CHECK (false);

-- 2. Harden increment_usage: enforce that the caller can only increment their own usage.
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
  -- Prevent one user from incrementing another user's usage.
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized' USING ERRCODE = '42501';
  END IF;

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
