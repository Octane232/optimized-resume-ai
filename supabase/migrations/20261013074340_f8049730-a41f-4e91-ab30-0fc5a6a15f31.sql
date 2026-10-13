ALTER TABLE public.radar_signals
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'lead',
  ADD COLUMN IF NOT EXISTS trust_tier text NOT NULL DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS workplace_type text NOT NULL DEFAULT 'onsite',
  ADD COLUMN IF NOT EXISTS remote_region text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS sector text,
  ADD COLUMN IF NOT EXISTS check_flags jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS expires_at timestamptz;
CREATE INDEX IF NOT EXISTS radar_signals_trust_expiry_idx ON public.radar_signals (trust_tier, expires_at);
UPDATE public.radar_signals SET expires_at = COALESCE(published_at, created_at) + interval '30 days' WHERE expires_at IS NULL;