import Link from 'next/link';

import { BrandMark } from '@/components/brand-mark';
import { appConfig } from '@/config/app';
import { landingContent } from '@/config/landing';
import { platformHome } from '@/config/navigation';

interface FooterLink {
  label: string;
  href: string;
}

const pageLinks: FooterLink[] = [
  { label: 'Benefícios', href: '#beneficios' },
  { label: 'Como funciona', href: '#como-funciona' },
  ...(landingContent.pricing.plans.length > 0
    ? [{ label: 'Planos', href: '#planos' }]
    : []),
  { label: 'Perguntas', href: '#perguntas' },
];

const accessLinks: FooterLink[] = [
  { label: 'Entrar no painel', href: platformHome },
  { label: 'Criar conta', href: '/criar-conta' },
];

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) => (
  <div className="grid content-start gap-3">
    <p className="text-sm font-medium">{title}</p>
    <ul className="text-muted-foreground grid gap-2 text-sm">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="hover:text-foreground transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export const SiteFooter = () => (
  <footer className="border-t">
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div className="grid content-start gap-3">
        <BrandMark />
        <p className="text-muted-foreground max-w-xs text-sm text-pretty">
          {appConfig.tagline}
        </p>
      </div>
      <FooterColumn title="Nesta página" links={pageLinks} />
      <FooterColumn title="Acesso" links={accessLinks} />
      <div className="grid content-start gap-3">
        <p className="text-sm font-medium">Contato</p>
        {appConfig.contactEmail ? (
          <a
            href={`mailto:${appConfig.contactEmail}`}
            className="text-muted-foreground hover:text-foreground text-sm break-all transition-colors"
          >
            {appConfig.contactEmail}
          </a>
        ) : (
          <p className="text-muted-foreground text-sm">
            Defina o e-mail de contato em src/config/app.ts.
          </p>
        )}
      </div>
    </div>
    <div className="border-t">
      <p className="text-muted-foreground mx-auto w-full max-w-6xl px-4 py-5 text-xs sm:px-6">
        © {new Date().getFullYear()} {appConfig.name}. Todos os direitos
        reservados.
      </p>
    </div>
  </footer>
);
