
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
  -- AuthZ: when called by an end-user JWT, they may only spend their own credits.
  -- Service role calls (auth.uid() IS NULL) are trusted and pass through.
  IF auth.uid() IS NOT NULL AND auth.uid() <> p_user_id THEN
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
