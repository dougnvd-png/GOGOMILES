import { SectionHeading } from '@/components/marketing/section-heading';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { landingContent } from '@/config/landing';
import { revealDelay } from '@/lib/motion';

export const Faq = () => {
  const { faq } = landingContent;

  return (
    <section
      id="perguntas"
      className="mx-auto grid w-full max-w-6xl scroll-mt-24 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-28"
    >
      <SectionHeading
        align="start"
        eyebrow={faq.eyebrow}
        title={faq.title}
        subtitle={faq.subtitle}
      />
      <Accordion type="single" collapsible className="grid w-full gap-3">
        {faq.items.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={item.question}
            data-reveal
            style={revealDelay(index, 70)}
            className="surface px-5 last:border-b"
          >
            <AccordionTrigger className="py-4 text-left text-base hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-base leading-relaxed text-pretty">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
