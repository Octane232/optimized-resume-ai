import React from 'react';
import { ArrowRight } from 'lucide-react';

const BigPictureSection = () => (
  <section className="border-b border-border bg-background py-14 sm:py-20">
    <div className="mx-auto grid max-w-[1200px] gap-10 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 lg:px-10">
      <div>
        <p className="mb-4 text-[10px] font-semibold uppercase text-primary">More than a job search</p>
        <h2 className="text-foreground">
          A smarter way to build what’s next.
        </h2>
      </div>

      <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
        <div className="max-w-xl">
          <p className="text-sm leading-7 text-muted-foreground">
            Whether you are aiming for a bigger title, a better team or a more meaningful career path, Vaylance gives you the insight and support to get there — on your terms.
          </p>
          <a href="#features" className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase text-primary hover:text-primary/80">
            Our approach <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="border-l border-border pl-7 sm:w-36">
          <p className="text-[10px] font-semibold uppercase leading-5 text-muted-foreground">People<br />Potential<br />Progress</p>
        </div>
      </div>
    </div>
  </section>
);

export default BigPictureSection;
