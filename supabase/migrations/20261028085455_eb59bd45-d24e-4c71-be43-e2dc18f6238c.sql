CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  free_plan_id uuid;
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url',
    'free'
  )
  ON CONFLICT (user_id) DO NOTHING;

  SELECT id INTO free_plan_id FROM public.subscription_plans WHERE slug = 'free' LIMIT 1;

  INSERT INTO public.user_subscriptions (user_id, plan_id, tier, plan_status, price, current_period_end)
  VALUES (NEW.id, free_plan_id, 'free', 'active', 0, NULL)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$function$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

UPDATE public.user_subscriptions
SET tier = 'free', plan_status = 'active', price = 0, current_period_end = NULL,
    plan_id = (SELECT id FROM public.subscription_plans WHERE slug = 'free' LIMIT 1)
WHERE tier = 'pro' AND price = 0 AND stripe_subscription_id IS NULL;

UPDATE public.profiles p SET plan = 'free'
WHERE p.plan = 'pro' AND p.stripe_subscription_id IS NULL;