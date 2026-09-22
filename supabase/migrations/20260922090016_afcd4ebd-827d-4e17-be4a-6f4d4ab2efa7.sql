UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'vaylance.test.1790067477@gmail.com' AND email_confirmed_at IS NULL;