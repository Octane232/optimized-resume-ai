## Scan results

### ✅ What's working / ready
- **TypeScript**: clean compile, zero errors.
- **Trial tier system**: fully wired end-to-end
  - `PLAN_LIMITS` includes `trial` in both `src/contexts/UsageLimitContext.tsx` and `supabase/functions/_shared/tierLimits.ts`
  - `requireUser.ts` resolves active trial → `tier='trial'`, expired trial → `'free'`
  - `UsageLimitContext.fetchAll` mirrors the same logic client-side
  - Billing UI (`Billing.tsx`, `PaidManagement.tsx`, `UsageHeader.tsx`, `PricingCards.tsx`) all treat trial as its own display state
  - DB migration installed `trial` rows in `plan_feature_limits` and updated `increment_usage` to stamp `user_tier='trial'` during the active window
- **Security scanners** (agent, connector, supabase, supply-chain): no findings.

### ⚠️ Issues found (Supabase linter)

| # | Level | Issue |
|---|-------|-------|
| 1 | INFO  | Table with RLS enabled but **no policies** (blocks all reads/writes silently) |
| 2 | INFO  | Second table in the same state |
| 3 | WARN  | A `SECURITY DEFINER` function is executable by `authenticated` — potential privilege escalation surface |
| 4 | WARN  | **Leaked-password protection disabled** in Supabase Auth |
| 5 | WARN  | **Postgres has security patches available** — upgrade recommended |

### Proposed fixes (only if you approve)

1. **Identify the two RLS-no-policy tables** via `supabase--read_query` on `pg_policies` / `pg_tables`, then either add proper policies or drop RLS if the table is service-role-only.
2. **Lock down the SECURITY DEFINER function**: identify it, then `REVOKE EXECUTE ... FROM authenticated` (keep `service_role`), unless it's intentionally callable (like `has_role` / `increment_usage`) — in which case we confirm its internal checks are safe and leave it.
3. **Enable leaked-password protection** — dashboard toggle, I'll link you to it (Auth → Providers → Password settings). Not a code change.
4. **Postgres upgrade** — dashboard action, I'll link you to it. Not a code change.

### Out of scope
- No changes to trial/pro/elite limits, pricing UI, or Stripe flows.
- No app feature changes.

Want me to proceed with fixes 1–2 (code/SQL) and hand you links for 3–4?