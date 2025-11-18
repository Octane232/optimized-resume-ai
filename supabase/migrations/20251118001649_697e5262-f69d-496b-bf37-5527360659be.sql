-- Add Lemon Squeezy subscription ID to user_subscriptions
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS lemon_squeezy_subscription_id text UNIQUE;

-- Rename expires_at to current_period_end for standard naming
ALTER TABLE public.user_subscriptions 
RENAME COLUMN expires_at TO current_period_end;

-- Add index for faster webhook lookups
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_ls_id 
ON public.user_subscriptions(lemon_squeezy_subscription_id);

-- Add comments for documentation
COMMENT ON COLUMN public.user_subscriptions.lemon_squeezy_subscription_id 
IS 'Lemon Squeezy subscription ID from webhook data';

COMMENT ON COLUMN public.user_subscriptions.current_period_end 
IS 'End date of current billing period (renewal date)';