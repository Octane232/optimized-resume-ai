
-- Add plan_credits column for credits granted by paid plans
ALTER TABLE public.user_credits
  ADD COLUMN IF NOT EXISTS plan_credits INTEGER NOT NULL DEFAULT 0;

-- Update spend_credit: spend plan_credits first, then balance
CREATE OR REPLACE FUNCTION public.spend_credit(
  p_user_id uuid,
  p_action text,
  p_description text DEFAULT NULL::text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_plan INTEGER;
  v_monthly INTEGER;
BEGIN
  SELECT plan_credits, balance INTO v_plan, v_monthly
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO user_credits (user_id, balance, monthly_allowance, plan_credits)
    VALUES (p_user_id, 5, 5, 0);
    v_plan := 0;
    v_monthly := 5;
  END IF;

  IF (COALESCE(v_plan, 0) + COALESCE(v_monthly, 0)) <= 0 THEN
    RETURN FALSE;
  END IF;

  IF COALESCE(v_plan, 0) > 0 THEN
    UPDATE user_credits
       SET plan_credits = plan_credits - 1,
           total_spent = total_spent + 1,
           updated_at = now()
     WHERE user_id = p_user_id;
  ELSE
    UPDATE user_credits
       SET balance = balance - 1,
           total_spent = total_spent + 1,
           updated_at = now()
     WHERE user_id = p_user_id;
  END IF;

  INSERT INTO credit_transactions (user_id, amount, action, description)
  VALUES (p_user_id, -1, p_action, p_description);

  RETURN TRUE;
END;
$function$;

-- Grant plan credits (additive, never overwrites)
CREATE OR REPLACE FUNCTION public.grant_plan_credits(
  p_user_id uuid,
  p_amount integer,
  p_description text DEFAULT 'Plan credits granted'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO user_credits (user_id, balance, monthly_allowance, plan_credits)
  VALUES (p_user_id, 5, 5, GREATEST(p_amount, 0))
  ON CONFLICT (user_id) DO UPDATE
    SET plan_credits = user_credits.plan_credits + GREATEST(p_amount, 0),
        updated_at = now();

  INSERT INTO credit_transactions (user_id, amount, action, description)
  VALUES (p_user_id, GREATEST(p_amount, 0), 'plan_grant', p_description);
END;
$function$;

-- Monthly reset of free balance only (plan credits untouched)
CREATE OR REPLACE FUNCTION public.reset_monthly_credits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE user_credits
     SET balance = GREATEST(monthly_allowance, 5),
         last_reset_at = now(),
         updated_at = now();
END;
$function$;

-- Allow users to also see plan_credits via existing select policy (already present)
