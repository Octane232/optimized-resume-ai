REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.protect_profile_billing_fields() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_usage(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_usage(uuid, text) TO authenticated, service_role;