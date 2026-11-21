import Link from 'next/link';

import { BrandMark } from '@/components/brand-mark';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { landingContent } from '@/config/landing';
import { platformHome } from '@/config/navigation';

const sections = [
  { label: 'Benefícios', href: '#beneficios', visible: true },
  { label: 'Como funciona', href: '#como-funciona', visible: true },
  {
    label: 'Planos',
    href: '#planos',
    visible: landingContent.pricing.plans.length > 0,
  },
  { label: 'Perguntas', href: '#perguntas', visible: true },
].filter((section) => section.visible);

export const SiteHeader = () => (
  <header className="sticky top-3 z-30 px-3 sm:top-4 sm:px-6">
    <div className="surface bg-card/80 mx-auto flex h-14 w-full max-w-5xl items-center gap-4 rounded-full pr-2 pl-4 backdrop-blur-xl">
      <Link href="/" aria-label="Página inicial" className="min-w-0">
        <BrandMark />
      </Link>
      <nav
        aria-label="Seções da página"
        className="text-muted-foreground mx-auto hidden items-center gap-1 text-sm font-medium md:flex"
      >
        {sections.map((section) => (
          <a
            key={section.href}
            href={section.href}
            className="hover:bg-accent hover:text-foreground rounded-full px-3 py-1.5 transition-colors"
          >
            {section.label}
          </a>
        ))}
      </nav>
      <div className="ml-auto flex shrink-0 items-center gap-1 md:ml-0">
        <ThemeToggle />
        <Button asChild className="rounded-full px-5">
          <Link href={platformHome}>Entrar</Link>
        </Button>
      </div>
    </div>
  </header>
);
