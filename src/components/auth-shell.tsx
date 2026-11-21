import type { ReactNode } from 'react';
import Link from 'next/link';

import { BrandMark } from '@/components/brand-mark';

/** Moldura das telas de login e de cadastro. */
export const AuthShell = ({ children }: { children: ReactNode }) => (
  <main className="relative grid min-h-svh place-items-center overflow-hidden p-4">
    <div aria-hidden className="grid-backdrop absolute inset-0 -z-10" />
    <div className="grid justify-items-center gap-8">
      <Link href="/" aria-label="Página inicial">
        <BrandMark className="text-lg" />
      </Link>
      {children}
    </div>
  </main>
);
