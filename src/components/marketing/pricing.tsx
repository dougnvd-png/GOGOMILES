import Link from 'next/link';
import { Check } from 'lucide-react';

import { SectionHeading } from '@/components/marketing/section-heading';
import { Button } from '@/components/ui/button';
import { landingContent } from '@/config/landing';
import { revealDelay } from '@/lib/motion';
import { cn } from '@/lib/utils';

export const Pricing = () => {
  const { pricing } = landingContent;
  if (pricing.plans.length === 0) {
    return null;
  }

  return (
    <section
      id="planos"
      className="mx-auto grid w-full max-w-6xl scroll-mt-24 gap-12 px-4 py-20 sm:px-6 lg:py-28"
    >
      <SectionHeading
        eyebrow={pricing.eyebrow}
        title={pricing.title}
        subtitle={pricing.subtitle}
      />
      <ul className="mx-auto grid w-full max-w-5xl gap-4 md:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]">
        {pricing.plans.map((plan, index) => (
          <li
            key={plan.name}
            data-reveal
            data-spotlight
            style={revealDelay(index, 120)}
            className={cn(
              'surface grid content-start gap-6 p-6 sm:p-7',
              plan.featured && 'border-primary/50 shadow-glow',
            )}
          >
            <div className="grid gap-2">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {plan.featured && (
                  <span className="bg-brand-soft text-brand-ink rounded-full px-2.5 py-0.5 text-xs font-medium">
                    Recomendado
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm text-pretty">
                {plan.description}
              </p>
            </div>
            <p className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold tracking-tight tabular-nums">
                {plan.price}
              </span>
              <span className="text-muted-foreground text-sm">
                {plan.period}
              </span>
            </p>
            <Button
              asChild
              variant={plan.featured ? 'default' : 'outline'}
              className="h-11 rounded-full"
            >
              <Link href={plan.action.href}>{plan.action.label}</Link>
            </Button>
            <ul className="grid gap-2.5 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <Check
                    aria-hidden
                    className="text-brand-ink mt-0.5 size-4 shrink-0"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
};
