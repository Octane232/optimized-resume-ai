// Helper to detect quota/credit errors from Supabase edge function invocation errors
// Supabase wraps non-2xx as FunctionsHttpError with `context: Response`
export function isCreditError(err: any): boolean {
  const status = err?.context?.status ?? err?.status;
  if (status === 402 || status === 429) return true;
  const msg = (err?.message || '').toLowerCase();
  return msg.includes('limit reached') || msg.includes('does not include') || msg.includes('quota');
}

export function creditErrorToast(remaining = 0) {
  if (remaining <= 0) {
    return {
      title: "You've used all your credits",
      description: 'Upgrade your plan to keep using this feature.',
      variant: 'destructive' as const,
    };
  }
  return {
    title: 'Monthly limit reached',
    description: 'Upgrade your plan to keep using this feature.',
    variant: 'destructive' as const,
  };
}
