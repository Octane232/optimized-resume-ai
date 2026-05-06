
DROP TABLE IF EXISTS public.payouts CASCADE;
DROP TABLE IF EXISTS public.commissions CASCADE;
DROP TABLE IF EXISTS public.referrals CASCADE;
DROP TABLE IF EXISTS public.affiliates CASCADE;
DROP TYPE IF EXISTS public.affiliate_status CASCADE;
DROP TYPE IF EXISTS public.payout_status CASCADE;
DROP FUNCTION IF EXISTS public.generate_affiliate_code() CASCADE;
DROP FUNCTION IF EXISTS public.set_affiliate_code() CASCADE;
