import { SectionHeading } from '@/components/marketing/section-heading';
import { landingContent } from '@/config/landing';
import { revealDelay } from '@/lib/motion';

export const Testimonials = () => {
  const { testimonials } = landingContent;
  if (testimonials.items.length === 0) {
    return null;
  }

  return (
    <section
      id="depoimentos"
      className="mx-auto grid w-full max-w-6xl scroll-mt-24 gap-12 px-4 py-20 sm:px-6 lg:py-28"
    >
      <SectionHeading eyebrow={testimonials.eyebrow} title={testimonials.title} />
      <ul className="grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
        {testimonials.items.map((testimonial, index) => (
          <li
            key={testimonial.name}
            data-reveal
            style={revealDelay(index, 120)}
          >
            <figure className="surface grid h-full content-between gap-6 p-6">
              <blockquote className="leading-relaxed text-pretty">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="grid gap-0.5 text-sm">
                <span className="font-medium">{testimonial.name}</span>
                <span className="text-muted-foreground">{testimonial.role}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
};
