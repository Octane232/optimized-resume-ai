import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const path = ['Company signal', 'Hiring potential', 'Likely roles', 'Prepare and build', 'Reach out', 'Job opens', 'Apply'];

const BigPictureSection = () => (
  <section className="bg-foreground text-background py-16 sm:py-24">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
      <div>
        <p className="text-[11px] font-semibold uppercase text-background/60 mb-4">The big picture</p>
        <h2 className="text-[26px] leading-tight sm:text-4xl font-bold mb-4">
          The job board is where everyone arrives.
          <span className="block text-signal">Vaylance starts earlier.</span>
        </h2>
        <p className="text-background/70 leading-relaxed mb-7 max-w-md">
          While others react to job postings, you are already prepared — with the context, the documents and the contacts to move first.
        </p>
        <Button asChild size="lg" variant="secondary" className="h-12 px-6 font-semibold">
          <Link to="/auth">
            Explore the full platform
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-background/15 bg-background/5 p-5 sm:p-7">
        <ol className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-5">
          {path.map((step, i) => (
            <li key={step} className="flex flex-col gap-2">
              <span className="w-8 h-8 rounded-full border border-background/25 flex items-center justify-center tabular text-xs">{i + 1}</span>
              <span className="text-[13px] leading-snug text-background/85">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 pt-5 border-t border-background/15 text-xs text-background/60">
          By the time the role is public, you are already prepared.
        </p>
      </div>
    </div>
  </section>
);

export default BigPictureSection;
