'use client';

import type { ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

import type { ThemeMode } from '@/config/app';

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode: ThemeMode;
}

export const ThemeProvider = ({ children, defaultMode }: ThemeProviderProps) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme={defaultMode}
    enableSystem={false}
    disableTransitionOnChange
  >
    {children}
  </NextThemesProvider>
);
