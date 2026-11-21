import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { SignUp } from '@clerk/nextjs';

import { AuthShell } from '@/components/auth-shell';
import { platformHome } from '@/config/navigation';
import { isAuthConfigured } from '@/lib/env';

export const metadata: Metadata = { title: 'Criar conta' };

export default function SignUpPage() {
  if (!isAuthConfigured()) {
    redirect(platformHome);
  }

  return (
    <AuthShell>
      <SignUp />
    </AuthShell>
  );
}
