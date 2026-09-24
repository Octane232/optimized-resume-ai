import type { LucideIcon } from 'lucide-react';

interface ToolPageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
}

export function ToolPageHeader({ title, description, icon: Icon, action }: ToolPageHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/10">
          <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-display text-2xl leading-tight text-foreground">{title}</h1>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      {action}
    </div>
  );
}