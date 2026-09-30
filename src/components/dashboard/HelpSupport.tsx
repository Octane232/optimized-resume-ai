import { BookOpen, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolPageHeader } from './ToolPageHeader';

const HelpSupport = () => (
  <div className="mx-auto max-w-5xl space-y-6">
    <ToolPageHeader
      title="Help & Support"
      description="Find an answer or contact the Vaylance team."
      icon={BookOpen}
    />
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-lg border border-border bg-card p-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-foreground">Email support</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">Get help with your account, billing, or career tools within one business day.</p>
        <Button asChild className="mt-5">
          <a href="mailto:contact-us@vaylance.com">Contact support</a>
        </Button>
      </section>
      <section className="rounded-lg border border-border bg-card p-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-base font-semibold text-foreground">Product guides</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">Learn how Job Radar, Resume + ATS, interview practice, and the tracker work.</p>
        <Button asChild variant="outline" className="mt-5">
          <a href="/documentation">Open documentation</a>
        </Button>
      </section>
    </div>
  </div>
);

export default HelpSupport;