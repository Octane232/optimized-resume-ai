
# Add a Dedicated `trial` Tier

## Goal
Stop granting trial users full Elite access. Create a separate `trial` tier with sensible, cost-controlled limits that still feel generous for 3 days. After trial ends, users fall to `free` (all zeros → paywall).

## New Tier Limits

Proposed `trial` limits (tuned for a 3-day window — enough to experience every feature, not enough to abuse):

| Feature              | Trial | Pro  | Elite |
| -------------------- | ----- | ---- | ----- |
| resume_ats           | 3     | 15   | 40    |
| cover_letter         | 3     | 15   | 40    |
| linkedin             | 3     | 10   | 30    |
| skill_gap            | 3     | 10   | 30    |
| interview_prep       | 5     | 20   | 60    |
| salary_intel         | 2     | 5    | 15    |
| radar_alert          | 3     | 10   | 30    |
| docx_rewrite         | 2     | 5    | 20    |
| resume_parse         | 10    | 50   | 200   |

These match the "3-day trial" features you originally showed on the pricing card.

## Changes

### 1. Type updates (frontend + edge)
- Add `'trial'` to `SubscriptionTier` union in:
  - `src/contexts/UsageLimitContext.tsx`
  - `supabase/functions/_shared/tierLimits.ts`
- Add `trial: { ... }` block to `PLAN_LIMITS` in both files using the table above.
- `displayTier` mapping: `trial → 'Free'` (still shows "Free" on UI badges since they haven't paid) OR add `'Trial'` label — your call. Default to `'Trial'` so users see what they're on.

### 2. Tier resolution logic
- **`src/contexts/UsageLimitContext.tsx`** `fetchAll`: when `plan_status === 'trial'` and `trial_end > now()`, set `resolvedTier = 'trial'` (was `'elite'`).
- **`supabase/functions/_shared/requireUser.ts`**: same change — active trial → `tier = 'trial'` (was `'elite'`).
- Expired trial behavior stays the same: → `'free'` (paywall).

### 3. Database
- Insert `trial` rows into `plan_feature_limits` (one row per feature with the limits above).
- Update `increment_usage` function: when `plan_status = 'trial'` and `NOW() < trial_end`, set `user_tier := 'trial'` (was `'elite'`). Lookup against `plan_feature_limits` continues to work since we're adding the rows.

### 4. UI copy (optional polish)
- `PricingCards.tsx` `FREE_FEATURES`: update counts so they match the new trial limits exactly (3 resumes, 3 cover letters, 3 LinkedIn, 5 interviews, 3 radar scans, 3 skill gaps, etc.) so the pricing card and runtime limits agree.
- `UsageHeader` / badges: optionally show "Trial — X days left" when `tier === 'trial'`.

## Out of Scope
- No Stripe/billing changes.
- No new tables.
- Pro/Elite limits unchanged.

## Why This Is Better Than "Trial = Elite"
- **API cost control:** trial caps ~80% lower than Elite ceiling → predictable spend per signup.
- **Preserves Elite's reason to exist:** Elite still feels like a meaningful upgrade.
- **Clear conversion signal:** when a trial user hits the cap, you know they're engaged → that's your upgrade trigger.
- **Honest pricing card:** the numbers shown on the pricing card become the actual enforced limits.

## Confirm Before I Build
1. Are the proposed trial limits good, or do you want different numbers?
2. Should the UI badge say **"Trial"** or keep showing **"Free"** during the trial?
