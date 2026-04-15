

## Stripe Integration Audit Results

### What's Working
- **`check-subscription` edge function**: Working correctly (returning 200s). It queries Stripe directly and syncs to DB. When a user has no active Stripe subscription, it correctly returns `{ subscribed: false, tier: "free" }`.
- **`stripe-checkout` function**: Properly creates checkout sessions with correct price IDs and metadata.
- **Frontend polling**: `SubscriptionContext` calls `check-subscription` on login, on page load, and every 60 seconds. It also does aggressive retries after checkout return.
- **One user synced correctly**: User `5c40eb05` shows `tier: starter` in DB, matching their active Stripe subscription.

### Issues Found

**1. Stripe webhook has NEVER received events**
The `stripe-webhook` function has zero logs. This means either:
- The webhook endpoint is not configured in Stripe Dashboard, OR
- It's misconfigured (wrong URL or wrong events selected)

This is critical because cancellation (`customer.subscription.deleted`) and payment failure (`invoice.payment_failed`) events only arrive via webhook.

**2. Revert-to-free relies on polling, not webhook**
Since webhooks aren't working, the system depends entirely on `check-subscription` polling. This function DOES correctly check Stripe for active subscriptions and returns `tier: "free"` when none exist. So if a subscription is cancelled in Stripe, the next time the user loads the dashboard (or within 60 seconds), they'll revert to free.

However, if the user doesn't log in, their DB record stays stale until they do.

**3. Second paying user not synced**
Customer `cus_UKrRf65Q8PiCCH` has an active Stripe subscription but no profile link in the DB. This will auto-fix when that user next logs in (via `check-subscription`).

**4. Legacy data in `subscription_plans` table**
Old "Pitchsora Pro", "Pitchsora Premium", etc. rows still exist alongside the new "Starter" and "Pro" rows. This causes no functional issues but is messy.

### Plan

1. **Verify and fix webhook configuration in Stripe Dashboard**
   - Confirm the webhook URL is: `https://xpmhahyvtyvrxryrqane.supabase.co/functions/v1/stripe-webhook`
   - Confirm events: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`, `customer.subscription.deleted`
   - Re-deploy the `stripe-webhook` function to ensure it's active
   - Test by sending a test event from Stripe Dashboard

2. **Clean up legacy subscription plans**
   - Remove the old "Pitchsora Pro", "Pitchsora Premium", "Pitchsora Pro Yearly", "Pitchsora Premium Yearly" rows from `subscription_plans` (keeping Free, Starter, Pro)

3. **Add logging to `check-subscription`** for better debugging
   - Add `logStep` helper similar to the reference implementation so you can trace issues in edge function logs

### Summary

The system **will** revert users to free when they don't pay, but only when they next use the app (via the polling `check-subscription` function). The webhook would make this instant and server-side, but it's not receiving events. The fix is primarily a Stripe Dashboard configuration issue, plus a re-deploy of the webhook function.

