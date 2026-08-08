ALTER TABLE public.radar_signals
  ADD COLUMN IF NOT EXISTS signal_type text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS company_size text,
  ADD COLUMN IF NOT EXISTS why_now text,
  ADD COLUMN IF NOT EXISTS outreach_angle text,
  ADD COLUMN IF NOT EXISTS departments text[],
  ADD COLUMN IF NOT EXISTS confidence integer,
  ADD COLUMN IF NOT EXISTS source_name text;

CREATE INDEX IF NOT EXISTS radar_signals_signal_type_idx ON public.radar_signals (signal_type);
CREATE INDEX IF NOT EXISTS radar_signals_industry_idx ON public.radar_signals (industry);