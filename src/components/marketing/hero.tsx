import { Fragment, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { DashboardPreview } from '@/components/marketing/dashboard-preview';
import { Button } from '@/components/ui/button';
import { landingContent } from '@/config/landing';

/** Posição do elemento na sequência de entrada do topo. */
const order = (position: number) => ({ '--order': position }) as CSSProperties;

export const Hero = () => {
  const { hero } = landingContent;
  const titleWords = hero.title.split(' ').filter(Boolean);
  const afterTitle = titleWords.length + 1;

  return (
    <section className="relative overflow-x-clip px-4 pt-16 sm:px-6 sm:pt-24">
      <div aria-hidden className="aurora">
        <span />
        <span />
        <span />
      </div>
      <div
        aria-hidden
        className="grid-backdrop grid-pan absolute inset-0 -top-24 -z-10"
      />
      <div className="mx-auto grid max-w-4xl justify-items-center gap-6 text-center">
        <p
          style={order(0)}
          className="hero-fade border-primary/25 bg-brand-soft text-brand-ink inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-sm font-medium"
        >
          <span aria-hidden className="relative flex size-2">
            <span className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-60" />
            <span className="bg-primary relative inline-flex size-2 rounded-full" />
          </span>
          {hero.eyebrow}
        </p>
        <h1 className="text-[2.6rem] leading-[1.04] font-semibold text-balance sm:text-6xl lg:text-7xl">
          {titleWords.map((word, index) => (
            <Fragment key={`${word}-${index}`}>
              <span style={order(index + 1)} className="hero-word">
                {word}
              </span>{' '}
            </Fragment>
          ))}
          <span
            style={order(afterTitle)}
            className="hero-word brand-text brand-shimmer"
          >
            {hero.highlight}
          </span>
        </h1>
        <p
          style={order(afterTitle + 2)}
          className="hero-fade text-muted-foreground max-w-2xl text-lg leading-relaxed text-pretty sm:text-xl"
        >
          {hero.subtitle}
        </p>
        <div
          style={order(afterTitle + 4)}
          className="hero-fade flex flex-wrap justify-center gap-3 pt-2"
        >
          <Button
            asChild
            size="lg"
            className="sheen h-12 rounded-full px-7 text-base"
          >
            <Link href={hero.primaryAction.href}>
              {hero.primaryAction.label}
              <ArrowRight />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 rounded-full px-7 text-base"
          >
            <a href={hero.secondaryAction.href}>{hero.secondaryAction.label}</a>
          </Button>
        </div>
        {hero.note && (
          <p
            style={order(afterTitle + 5)}
            className="hero-fade text-muted-foreground text-sm"
          >
            {hero.note}
          </p>
        )}
      </div>
      <div style={order(afterTitle + 6)} className="hero-fade">
        <DashboardPreview />
      </div>
    </section>
  );
};
