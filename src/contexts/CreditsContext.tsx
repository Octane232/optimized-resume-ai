// ─── Deprecated shim ──────────────────────────────────────────────────────────
// CreditsContext has been removed. All credit/usage tracking is now handled
// by UsageLimitContext. This file exists to prevent import errors.

import React from 'react';

export const CreditsProvider = ({ children }: { children: React.ReactNode }) => children;
export const useCredits = () => ({
  balance: 0,
  loading: false,
  spendCredit: async () => false,
  refresh: async () => {},
});
