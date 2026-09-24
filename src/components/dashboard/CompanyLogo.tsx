import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  companyName: string;
  domain?: string | null;
  className?: string;
  imageClassName?: string;
}

const publishableKey = import.meta.env.VITE_LOVABLE_CONNECTOR_LOGO_DEV_API_KEY;

const normalizeDomain = (value?: string | null): string | null => {
  if (!value) return null;
  try {
    const url = new URL(value.includes('://') ? value : `https://${value}`);
    return url.hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return null;
  }
};

export function CompanyLogo({ companyName, domain, className, imageClassName }: CompanyLogoProps) {
  const normalizedDomain = normalizeDomain(domain);
  const logoUrl = normalizedDomain && publishableKey
    ? `https://img.logo.dev/${encodeURIComponent(normalizedDomain)}?token=${encodeURIComponent(publishableKey)}&size=96&format=png`
    : undefined;
  const initial = companyName.trim().charAt(0).toUpperCase() || 'C';

  return (
    <Avatar className={cn('rounded-lg border border-border bg-card', className)}>
      {logoUrl ? (
        <AvatarImage
          src={logoUrl}
          alt={`${companyName} logo`}
          className={cn('object-contain bg-card p-1', imageClassName)}
        />
      ) : null}
      <AvatarFallback
        delayMs={logoUrl ? 300 : 0}
        className="rounded-lg bg-muted font-semibold text-foreground"
        aria-label={`${companyName} logo unavailable`}
      >
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}