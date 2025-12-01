-- Remove Lemon Squeezy specific columns from tables
ALTER TABLE user_subscriptions DROP COLUMN IF EXISTS lemon_squeezy_subscription_id;
ALTER TABLE subscription_plans DROP COLUMN IF EXISTS lemon_squeezy_variant_id;