import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { platformHome } from '@/config/navigation';

export const metadata: Metadata = { title: 'Página não encontrada' };

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-16">
      <div aria-hidden className="aurora">
        <span />
        <span />
        <span />
      </div>
      <div className="surface grid w-full max-w-md justify-items-center gap-5 rounded-3xl p-8 text-center sm:p-10">
        <span
          aria-hidden
          className="brand-surface brand-glow grid size-12 place-items-center rounded-2xl"
        >
          <Compass className="size-6" />
        </span>
        <div className="grid gap-2">
          <p className="brand-text font-heading text-6xl leading-none font-semibold tabular-nums">
            404
          </p>
          <h1 className="text-2xl font-semibold text-balance">
            Esta página não existe
          </h1>
          <p className="text-muted-foreground text-pretty">
            O endereço pode ter mudado ou sido digitado com algum erro.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild className="rounded-full px-5">
            <Link href="/">
              <ArrowLeft aria-hidden />
              Página inicial
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-5">
            <Link href={platformHome}>Abrir o painel</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
