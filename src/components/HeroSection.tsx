import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, CirclePlay, Sparkles, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import architectureImage from '@/assets/editorial-architecture.jpg';

const advantages = [
  { icon: BarChart3, title: 'Real-time hiring signals', text: 'Spot opportunities before they go public.' },
  { icon: Sparkles, title: 'Tailored career guidance', text: 'Get coaching built around your goals.' },
  { icon: UsersRound, title: 'Ahead of the market', text: 'Move first. Not later.' },
];

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden border-b border-border pt-[68px]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-10">
        <div className="grid min-h-[630px] lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch">
          <div className="flex flex-col justify-center py-14 sm:py-20 lg:pr-14">
            <p className="mb-7 text-[10px] font-semibold uppercase text-primary">Career intelligence for what’s next</p>

            <h1 className="max-w-[670px] text-balance text-foreground">
              Know who’s hiring before the job is posted.
            </h1>

            <p className="mt-6 max-w-[610px] text-base leading-7 text-muted-foreground sm:text-lg">
              Vaylance uses live market signals and AI career coaching to show you which companies are preparing to hire — so you can make your move early, with confidence.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-6 text-sm font-semibold">
                <Link to="/auth">
                  Create free account
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-sm font-semibold">
                <a href="#how-it-works">
                  <CirclePlay className="w-4 h-4 mr-1.5" />
                  See how it works
                </a>
              </Button>
            </div>

            <div className="mt-12 grid gap-6 border-t border-border pt-7 sm:grid-cols-3">
              {advantages.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-3 sm:block">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brass sm:mb-3" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase leading-4 text-foreground">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden border-x border-border lg:min-h-full lg:border-r lg:border-l-0">
            <img src={architectureImage} alt="Calm modern workspace overlooking a city" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute right-5 top-8 max-w-[145px] border-t border-foreground/40 pt-3 text-[9px] font-semibold uppercase leading-4 text-foreground sm:right-8 sm:top-12">
              Opportunity favors ahead thinkers.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
