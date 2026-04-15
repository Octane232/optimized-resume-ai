-- Move subscriptions from "Pitchsora Pro" to "Pro"
UPDATE user_subscriptions 
SET plan_id = '7f9e2038-5de8-45f1-bd1b-6dfd3addcb1b' 
WHERE plan_id = 'ed666a08-6ab1-495c-8153-5a3564ee1fd1';

-- Delete legacy plans
DELETE FROM subscription_plans WHERE name ILIKE '%pitchsora%';