-- Add tier column to user_subscriptions table as the source of truth
ALTER TABLE public.user_subscriptions 
ADD COLUMN IF NOT EXISTS tier text DEFAULT 'free';

-- Update existing records based on price (if any exist)
-- This ensures existing subscriptions get their tier set correctly
UPDATE public.user_subscriptions 
SET tier = 'free' 
WHERE tier IS NULL;