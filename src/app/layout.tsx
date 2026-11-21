import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/nextjs';

import '@fontsource-variable/geist/wght.css';
import '@fontsource-variable/nunito/wght.css';
import '@fontsource-variable/playfair-display/wght.css';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { appConfig } from '@/config/app';
import { platformHome } from '@/config/navigation';
import { isAuthConfigured } from '@/lib/env';
import { buildThemeVariables } from '@/lib/theme';

// Endereço público do projeto. Na Vercel vem pronto; no computador é o local.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: appConfig.name, template: `%s | ${appConfig.name}` },
  description: appConfig.tagline,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: appConfig.name,
    title: appConfig.name,
    description: appConfig.tagline,
  },
};

const AuthProvider = ({ children }: { children: ReactNode }) =>
  isAuthConfigured() ? (
    <ClerkProvider
      signInUrl="/entrar"
      signUpUrl="/criar-conta"
      signInFallbackRedirectUrl={platformHome}
      signUpFallbackRedirectUrl={platformHome}
    >
      {children}
    </ClerkProvider>
  ) : (
    children
  );

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pt-BR"
      data-style={appConfig.theme.style}
      data-font={appConfig.theme.font}
      style={buildThemeVariables()}
      suppressHydrationWarning
    >
      <body>
        <AuthProvider>
          <ThemeProvider defaultMode={appConfig.theme.mode}>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
