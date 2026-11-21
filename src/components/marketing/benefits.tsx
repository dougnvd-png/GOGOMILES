import { BenefitVisual } from '@/components/marketing/benefit-visual';
import { SectionHeading } from '@/components/marketing/section-heading';
import { landingContent } from '@/config/landing';
import { revealDelay } from '@/lib/motion';
import { cn } from '@/lib/utils';

/** Largura de cada card na grade de seis colunas, conforme a quantidade de itens. */
const spansByTotal: Record<number, string[]> = {
  3: ['lg:col-span-2', 'lg:col-span-2', 'lg:col-span-2'],
  4: ['lg:col-span-4', 'lg:col-span-2', 'lg:col-span-2', 'lg:col-span-4'],
  5: [
    'lg:col-span-4',
    'lg:col-span-2',
    'lg:col-span-2',
    'lg:col-span-2',
    'lg:col-span-2',
  ],
  6: [
    'lg:col-span-4',
    'lg:col-span-2',
    'lg:col-span-2',
    'lg:col-span-4',
    'lg:col-span-3',
    'lg:col-span-3',
  ],
};

export const Benefits = () => {
  const { benefits } = landingContent;
  const spans = spansByTotal[benefits.items.length] ?? [];

  return (
    <section
      id="beneficios"
      className="mx-auto grid w-full max-w-6xl scroll-mt-24 gap-12 px-4 py-20 sm:px-6 lg:py-28"
    >
      <SectionHeading
        eyebrow={benefits.eyebrow}
        title={benefits.title}
        subtitle={benefits.subtitle}
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {benefits.items.map(
          ({ icon: Icon, title, description, visual }, index) => (
            <li
              key={title}
              data-reveal
              data-spotlight
              style={revealDelay(index)}
              className={cn(
                'surface surface-interactive grid content-start gap-5 p-5 sm:p-6',
                spans[index] ?? 'lg:col-span-2',
              )}
            >
              {visual && <BenefitVisual kind={visual} />}
              <div className="grid gap-2">
                <h3 className="flex items-center gap-2.5 text-lg font-semibold">
                  <Icon aria-hidden className="text-brand-ink size-5 shrink-0" />
                  {title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  {description}
                </p>
              </div>
            </li>
          ),
        )}
      </ul>
    </section>
  );
};
