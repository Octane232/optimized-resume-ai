## Critical scaling bug: Unauthenticated, unmetered AI edge functions

### The bug

Every expensive AI edge function in your project is **publicly callable by anyone on the internet, with no authentication and no usage tracking server-side**. A single attacker (or a curious user with browser devtools) can drain your OpenAI budget in minutes, and there is nothing in the code to stop them.

This will not just hurt you at scale — it can bankrupt the project on day one of going viral.

### Evidence

In `supabase/config.toml`, all AI functions are set to `verify_jwt = false`:

```
[functions.apply-bundle]        verify_jwt = false
[functions.optimize-linkedin]   verify_jwt = false
[functions.analyze-resume-ats]  verify_jwt = false
[functions.generate-cover-letter] verify_jwt = false
[functions.analyze-skill-gap]   verify_jwt = false
[functions.salary-intel]        verify_jwt = false
[functions.vaylance-chat]       verify_jwt = false
[functions.parse-resume-ai]     verify_jwt = false
[functions.rewrite-bullet]      verify_jwt = false
[functions.generate-resume-content] verify_jwt = false
```

And inside those functions there is **no `supabase.auth.getUser(token)` call, no usage limit check, and no credit deduction**. The only `Authorization` headers in the files are the ones being sent *out* to OpenAI. Example — `apply-bundle` (the most expensive: 3 parallel GPT calls per request):

```ts
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  const { jobDescription, userResume } = await req.json();
  // → 3x fetch to OpenAI. No auth. No rate limit. No usage check.
});
```

CORS is also `Access-Control-Allow-Origin: *`, so this can be called from any website, not just yours.

### Why this is the #1 scaling blocker

- **Cost runaway**: each `apply-bundle` call = ~3 GPT-4o-mini completions. A trivial script in a loop = hundreds of dollars/hour to OpenAI on your card.
- **No attribution**: even if you notice the bill, you cannot tell which user did it because the function doesn't know who the caller is.
- **`TIER_LIMITS` in `UsageLimitContext.tsx` are client-side only** — they gate the UI button but do nothing server-side. Anyone calling the function directly bypasses them entirely.
- **`spend_credit` RPC exists but is never called** by any AI function. Same for `increment_feature_usage`. The whole monetization layer is decorative.

### The fix (to implement after approval)

For every AI/expensive edge function (`apply-bundle`, `optimize-linkedin`, `analyze-resume-ats`, `analyze-resume-match`, `analyze-skill-gap`, `generate-cover-letter`, `generate-resume-content`, `rewrite-bullet`, `salary-intel`, `vaylance-chat`, `parse-resume-ai`, `parse-resume-file`, `radar-scan`, `interview-feedback`):

1. **Require auth in code**. Read `Authorization` header, call `supabase.auth.getUser(token)` with the anon-key client, reject with 401 if missing/invalid. (Keep `verify_jwt = false` since Lovable's signing-keys system needs in-code validation.)

2. **Enforce server-side usage limits**. Before calling OpenAI:
   - Look up the user's tier from `user_subscriptions`.
   - Look up current `feature_usage.count` for the action this month.
   - Compare against the same `TIER_LIMITS` table (move it to a shared file `supabase/functions/_shared/tierLimits.ts` so client and server agree).
   - Reject with 429 if over limit.

3. **Record usage AFTER success only**. Call `increment_feature_usage(p_user_id, p_action)` only when the OpenAI call returned a usable result, so failed calls don't burn quota.

4. **Add a per-user rate limit** (e.g. max 5 requests / 10 seconds per user per function) using a small `rate_limits` table or an in-memory token bucket keyed by `user.id`. Stops scripted abuse even within quota.

5. **Tighten CORS** to your production origin(s) instead of `*` for these functions.

6. **Delete the dead `CreditsContext` references**. `CreditGate.tsx` still imports and calls `useCredits().spendCredit()` from a stub that always returns `false` — meaning the "1 credit" buttons in the UI are silently broken. Either wire `CreditGate` to `useUsageLimit` or remove the component and its callers.

### Out of scope for this plan
- Migrating to Lovable AI Gateway (you're on direct OpenAI; same fix applies either way).
- Changing pricing tiers or limits.
- Frontend redesign.

### Files that will change
- `supabase/functions/_shared/tierLimits.ts` (new)
- `supabase/functions/_shared/requireUser.ts` (new — auth + usage gate helper)
- All 14 edge functions listed above (add 5–10 lines at the top of each `serve` handler)
- `src/components/dashboard/CreditGate.tsx` (rewire to `useUsageLimit` or remove)
- `supabase/config.toml` — no change (keep `verify_jwt = false`, validate in code)

### Result
After the fix: an unauthenticated request to any AI function returns `401` instantly with zero OpenAI cost. An authenticated user over their monthly quota returns `429`. Every successful call is attributed to a `user_id` in `feature_usage`, which means you can actually scale, bill, and debug.
