CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  pro_plan_id uuid;
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url, plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url',
    'pro'
  )
  ON CONFLICT (user_id) DO NOTHING;

  SELECT id INTO pro_plan_id FROM public.subscription_plans WHERE slug = 'pro' LIMIT 1;

  INSERT INTO public.user_subscriptions (user_id, plan_id, tier, plan_status, price, current_period_end)
  VALUES (NEW.id, pro_plan_id, 'pro', 'active', 0, now() + interval '30 days')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$function$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;