// ─── Deprecated shim ──────────────────────────────────────────────────────────
// This file exists only to prevent import errors in components that haven't
// been migrated yet. All real logic now lives in UsageLimitContext.
// 
// Safe to delete once all imports are updated to UsageLimitContext.

export { useUsageLimit as useSubscription, UsageLimitProvider as SubscriptionProvider } from './UsageLimitContext';
export type { SubscriptionTier } from './UsageLimitContext';
