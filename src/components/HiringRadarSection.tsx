import React from 'react';
import { ArrowRight, FileCheck2, Search, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import deskImage from '@/assets/editorial-desk.jpg';

const rows = [
  { company: 'Anthropic', signal: 'Expanding research team', level: 'HIGH' },
  { company: 'OpenAI', signal: 'New infrastructure roles', level: 'HIGH' },
  { company: 'Stripe', signal: 'Growing go-to-market team', level: 'MEDIUM' },
  { company: 'Figma', signal: 'Product design expansion', level: 'MEDIUM' },
  { company: 'Amazon', signal: 'Increased engineering hiring', level: 'MEDIUM' },
];

const benefits = [
  { icon: Search, title: 'Discover early opportunities', desc: 'See which companies are showing credible signs of future hiring.' },
  { icon: FileCheck2, title: 'Strengthen your positioning', desc: 'Compare your resume with a target role and get clear improvement guidance.' },
  { icon: Target, title: 'Take action with confidence', desc: 'Know when to reach out, what to highlight and how to prepare.' },
];

const HiringRadarSection = () => (
  <section id="hiring-radar" className="border-b border-border bg-card">
    <div className="mx-auto grid max-w-[1280px] lg:grid-cols-2">
      <div className="relative min-h-[570px] overflow-hidden lg:min-h-[650px]">
        <img src={deskImage} alt="Resume and career planning workspace" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-x-4 top-8 mx-auto max-w-[400px] rounded-lg border border-foreground/10 bg-card/95 p-4 shadow-xl backdrop-blur-sm sm:left-12 sm:right-auto sm:top-14 sm:w-[390px]">
          <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
            <div>
              <p className="text-xs font-semibold text-foreground">Vaylance</p>
              <h2 className="!mt-1 !text-xl font-display text-foreground">Hiring Signals</h2>
            </div>
            <span className="text-[9px] font-semibold uppercase text-primary">Live view</span>
          </div>
          <div className="space-y-1.5">
            {rows.map((row) => (
              <div key={row.company} className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md px-2.5 py-2 hover:bg-secondary/55">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-foreground">{row.company}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{row.signal}</p>
                </div>
                <span className="rounded-sm bg-signal-soft px-2 py-1 text-[8px] font-semibold text-primary">{row.level}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-7 left-5 right-5 rounded-md border border-border bg-card/95 p-4 shadow-lg backdrop-blur-sm sm:bottom-10 sm:left-auto sm:right-10 sm:w-[310px]">
          <p className="text-[9px] font-semibold uppercase text-primary">Resume + ATS guidance</p>
          <div className="mt-3 space-y-2 text-[10px] text-muted-foreground">
            <p className="border-l-2 border-primary pl-3">Strengthen impact statement</p>
            <p className="border-l-2 border-brass pl-3">Quantify this result</p>
            <p className="border-l-2 border-primary pl-3">Add a relevant keyword naturally</p>
          </div>
        </div>
      </div>

      <div className="flex bg-ink px-6 py-14 text-ink-foreground sm:px-12 sm:py-20 lg:px-16">
        <div className="my-auto max-w-lg">
          <p className="text-[10px] font-semibold uppercase text-brass">AI career coach</p>
          <h2 className="mt-5 text-ink-foreground">Smarter insights.<br />A more intentional next step.</h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-ink-muted">
            Vaylance combines live market signals, document analysis and practical coaching to help you move with clarity — not just keep up.
          </p>

          <div className="mt-9 space-y-6">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <article key={title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-ink-muted/30"><Icon className="h-4 w-4 text-brass" /></span>
                <div>
                  <h3 className="text-sm font-semibold text-ink-foreground">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-ink-muted">{desc}</p>
                </div>
              </article>
            ))}
          </div>

          <Button asChild size="lg" className="mt-10 h-12 bg-brass px-6 text-brass-foreground hover:bg-brass/90">
            <Link to="/auth">Create free account <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

export default HiringRadarSection;
