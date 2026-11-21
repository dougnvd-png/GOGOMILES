import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignIn } from '@clerk/nextjs';

import { AuthShell } from '@/components/auth-shell';
import { platformHome } from '@/config/navigation';
import { isAuthConfigured } from '@/lib/env';

export const metadata: Metadata = { title: 'Entrar' };

export default function SignInPage() {
  if (!isAuthConfigured()) {
    redirect(platformHome);
  }

  return (
    <AuthShell>
      <SignIn />
    </AuthShell>
  );
}
