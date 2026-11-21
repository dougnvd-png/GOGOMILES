import { landingContent } from '@/config/landing';

/**
 * Faixa em movimento com os títulos dos benefícios. O texto vem de
 * `src/config/landing.ts`, então acompanha o que a página promete.
 */
export const Ticker = () => {
  const phrases = landingContent.benefits.items.map(
    ({ icon, title }) => ({ icon, title }),
  );
  if (phrases.length < 3) {
    return null;
  }

  return (
    <div aria-hidden className="ticker overflow-hidden py-10 sm:py-14">
      <div className="ticker-track">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {phrases.map(({ icon: Icon, title }) => (
              <li
                key={title}
                className="text-muted-foreground flex items-center gap-2.5 px-7 text-lg font-medium whitespace-nowrap sm:text-xl"
              >
                <Icon className="text-brand-ink size-5 shrink-0" />
                {title}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
};
