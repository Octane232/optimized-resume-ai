-- Add lemon_squeezy_product_id to subscription_plans table
ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS lemon_squeezy_product_id text;