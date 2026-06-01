
-- 1. credit_transactions: remove user INSERT
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.credit_transactions;

-- 2. user_usage: remove user INSERT/UPDATE
DROP POLICY IF EXISTS "Users can insert own usage" ON public.user_usage;
DROP POLICY IF EXISTS "Users can update own usage" ON public.user_usage;

-- 3. profiles: prevent user from modifying stripe_customer_id
CREATE OR REPLACE FUNCTION public.prevent_profile_sensitive_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role' THEN
    IF NEW.stripe_customer_id IS DISTINCT FROM OLD.stripe_customer_id THEN
      NEW.stripe_customer_id := OLD.stripe_customer_id;
    END IF;
    IF NEW.plan IS DISTINCT FROM OLD.plan THEN
      NEW.plan := OLD.plan;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_sensitive_update ON public.profiles;
CREATE TRIGGER profiles_prevent_sensitive_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_sensitive_update();

-- 4. radar_signals: enable RLS (no policies = service_role only)
ALTER TABLE public.radar_signals ENABLE ROW LEVEL SECURITY;

-- 5. plan_feature_limits: add read policy for authenticated
ALTER TABLE public.plan_feature_limits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated can view plan limits" ON public.plan_feature_limits;
CREATE POLICY "Authenticated can view plan limits" ON public.plan_feature_limits
  FOR SELECT TO authenticated USING (true);

-- 6. radar_alerts: explicit service_role manage
DROP POLICY IF EXISTS "Service role manages radar alerts" ON public.radar_alerts;
CREATE POLICY "Service role manages radar alerts" ON public.radar_alerts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 7. resume_templates: restrict manage policy to service_role
DROP POLICY IF EXISTS "Service role can manage templates" ON public.resume_templates;
CREATE POLICY "Service role can manage templates" ON public.resume_templates
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 8. Fix search_path on handle_new_user_trial
CREATE OR REPLACE FUNCTION public.handle_new_user_trial()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
declare
  free_plan_id uuid;
begin
  select id into free_plan_id
  from public.subscription_plans
  where lower(name) = 'free'
  limit 1;

  insert into public.user_subscriptions (
    user_id, plan_id, tier, plan_status, is_trial,
    trial_start, trial_end, created_at, updated_at
  ) values (
    new.id, free_plan_id, 'free', 'trial', true,
    now(), now() + interval '3 days', now(), now()
  )
  on conflict (user_id) do nothing;
  return new;
end;
$function$;

-- 9. Revoke EXECUTE from anon/authenticated on privileged SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.grant_plan_credits(uuid, integer, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.reset_monthly_credits() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_trial() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_profile_sensitive_update() FROM PUBLIC, anon, authenticated;
-- increment_usage stays callable by authenticated (used from client)
