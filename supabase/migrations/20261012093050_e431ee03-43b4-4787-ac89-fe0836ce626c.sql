UPDATE public.plan_feature_limits SET monthly_limit = 1, updated_at = now() WHERE tier = 'free' AND feature = 'radar_alert';
UPDATE public.plan_feature_limits SET monthly_limit = 2, updated_at = now() WHERE tier = 'free' AND feature IN ('interview_prep', 'docx_rewrite');
INSERT INTO public.plan_feature_limits (tier, feature, monthly_limit)
SELECT 'free', f, l FROM (VALUES ('radar_alert', 1), ('interview_prep', 2), ('docx_rewrite', 2)) v(f, l)
WHERE NOT EXISTS (SELECT 1 FROM public.plan_feature_limits p WHERE p.tier = 'free' AND p.feature = v.f);