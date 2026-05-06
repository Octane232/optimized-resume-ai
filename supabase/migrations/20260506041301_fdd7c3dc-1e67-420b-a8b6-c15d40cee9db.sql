
-- ============================================
-- 1. Secure spend_credit and add amount param
-- ============================================
DROP FUNCTION IF EXISTS public.spend_credit(uuid, text, text);

CREATE OR REPLACE FUNCTION public.spend_credit(
  p_user_id uuid,
  p_action text,
  p_amount integer DEFAULT 1,
  p_description text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_plan integer;
  v_monthly integer;
  v_amount integer := GREATEST(COALESCE(p_amount, 1), 1);
  v_remaining integer := v_amount;
  v_take integer;
BEGIN
  -- AuthZ: caller must own the user_id
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT plan_credits, balance INTO v_plan, v_monthly
  FROM user_credits WHERE user_id = p_user_id FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO user_credits (user_id, balance, monthly_allowance, plan_credits)
    VALUES (p_user_id, 25, 25, 0);
    v_plan := 0; v_monthly := 25;
  END IF;

  IF (COALESCE(v_plan,0) + COALESCE(v_monthly,0)) < v_amount THEN
    RETURN FALSE;
  END IF;

  -- Take from plan_credits first
  IF COALESCE(v_plan,0) > 0 THEN
    v_take := LEAST(v_plan, v_remaining);
    UPDATE user_credits
       SET plan_credits = plan_credits - v_take,
           total_spent = total_spent + v_take,
           updated_at = now()
     WHERE user_id = p_user_id;
    v_remaining := v_remaining - v_take;
  END IF;

  IF v_remaining > 0 THEN
    UPDATE user_credits
       SET balance = balance - v_remaining,
           total_spent = total_spent + v_remaining,
           updated_at = now()
     WHERE user_id = p_user_id;
  END IF;

  INSERT INTO credit_transactions (user_id, amount, action, description)
  VALUES (p_user_id, -v_amount, p_action, p_description);

  RETURN TRUE;
END;
$$;

-- ============================================
-- 2. Reset everyone's balance to 25
-- ============================================
UPDATE user_credits
   SET balance = 25,
       monthly_allowance = GREATEST(monthly_allowance, 25),
       last_reset_at = now(),
       updated_at = now();

-- Ensure every existing user has a credit row
INSERT INTO user_credits (user_id, balance, monthly_allowance, plan_credits)
SELECT id, 25, 25, 0 FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- 3. Drop feature_usage entirely
-- ============================================
DROP FUNCTION IF EXISTS public.increment_feature_usage(uuid, text);
DROP FUNCTION IF EXISTS public.reset_monthly_usage();
DROP TABLE IF EXISTS public.feature_usage CASCADE;

-- ============================================
-- 4. Fix RLS: webhook_logs / referrals / commissions (restrict to service_role)
-- ============================================
DROP POLICY IF EXISTS "Service role can manage webhook logs" ON public.webhook_logs;
CREATE POLICY "Service role can manage webhook logs" ON public.webhook_logs
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can manage referrals" ON public.referrals;
CREATE POLICY "Service role can manage referrals" ON public.referrals
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can manage commissions" ON public.commissions;
CREATE POLICY "Service role can manage commissions" ON public.commissions
  AS PERMISSIVE FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================
-- 5. Storage policies for 'template preview' bucket (admin/service-managed, read for authed)
-- ============================================
DROP POLICY IF EXISTS "Template previews readable by authed" ON storage.objects;
CREATE POLICY "Template previews readable by authed"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'template preview');

DROP POLICY IF EXISTS "Template previews writable by service" ON storage.objects;
CREATE POLICY "Template previews writable by service"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'template preview') WITH CHECK (bucket_id = 'template preview');

-- ============================================
-- 6. Drop deprecated scouted_jobs (per memory)
-- ============================================
DROP TABLE IF EXISTS public.scouted_jobs CASCADE;
