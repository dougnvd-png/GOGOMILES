import { landingContent } from '@/config/landing';

export const Highlights = () => (
  <section
    aria-label="Destaques"
    className="mx-auto w-full max-w-6xl px-4 sm:px-6"
  >
    <ul
      data-reveal
      className="surface grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0"
    >
      {landingContent.highlights.map(({ icon: Icon, title, description }) => (
        <li key={title} className="group flex items-start gap-3 p-5 sm:p-6">
          <span
            aria-hidden
            className="bg-brand-soft text-brand-ink grid size-9 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
          >
            <Icon className="size-4" />
          </span>
          <div className="grid gap-0.5">
            <p className="font-medium">{title}</p>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);
