-- Update variant IDs to correct Lemon Squeezy values
UPDATE subscription_plans 
SET lemon_squeezy_variant_id = '1065978' 
WHERE name = 'Pitchsora Pro' AND price_monthly = 9;

UPDATE subscription_plans 
SET lemon_squeezy_variant_id = '1065979' 
WHERE name = 'Pitchsora Pro Yearly' AND price_yearly = 90;

UPDATE subscription_plans 
SET lemon_squeezy_variant_id = '1065981' 
WHERE name = 'Pitchsora Premium' AND price_monthly = 19.99;

UPDATE subscription_plans 
SET lemon_squeezy_variant_id = '1065987' 
WHERE name = 'Pitchsora Premium Yearly' AND price_yearly = 199.99;