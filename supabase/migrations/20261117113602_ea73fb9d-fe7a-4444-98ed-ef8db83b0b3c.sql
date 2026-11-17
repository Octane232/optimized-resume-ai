DROP POLICY IF EXISTS signals_read_authenticated ON public.radar_signals;
CREATE POLICY signals_read_own_alerts ON public.radar_signals
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.radar_alerts a WHERE a.signal_id = radar_signals.id AND a.user_id = auth.uid()));