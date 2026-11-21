import { SectionHeading } from '@/components/marketing/section-heading';
import { landingContent } from '@/config/landing';
import { cycleIndex, revealDelay } from '@/lib/motion';

export const Steps = () => {
  const { steps } = landingContent;

  return (
    <section
      id="como-funciona"
      className="mx-auto grid w-full max-w-6xl scroll-mt-24 gap-12 px-4 py-20 sm:px-6 lg:py-28"
    >
      <SectionHeading
        eyebrow={steps.eyebrow}
        title={steps.title}
        subtitle={steps.subtitle}
      />
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.items.map((step, index) => (
          <li
            key={step.title}
            data-reveal
            style={{ ...revealDelay(index, 140), ...cycleIndex(index) }}
            className="surface step-cycle relative grid gap-4 p-6"
          >
            <span
              aria-hidden
              className="brand-text font-heading text-5xl leading-none font-semibold tabular-nums"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="grid gap-2">
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-pretty">
                {step.description}
              </p>
            </div>
            {index < steps.items.length - 1 && (
              <span
                aria-hidden
                className="connector-grow motion-loop bg-primary absolute top-11 -right-4 hidden h-px w-4 md:block"
              />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
};
