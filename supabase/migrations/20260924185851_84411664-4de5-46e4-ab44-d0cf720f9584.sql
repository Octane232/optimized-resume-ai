ALTER TABLE public.radar_signals
ADD COLUMN IF NOT EXISTS company_domain TEXT;

COMMENT ON COLUMN public.radar_signals.company_domain IS
'Normalized official company hostname used for verified company branding; null when uncertain.';