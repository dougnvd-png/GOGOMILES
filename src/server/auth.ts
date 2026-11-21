import 'server-only';

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';

import { isAuthConfigured } from '@/lib/env';

export const demoUserId = 'demo';

export const currentUserId = async () => {
  if (!isAuthConfigured()) {
    await connection();
    return demoUserId;
  }
  const { userId } = await auth();
  return userId;
};

export const requireUser = async () => {
  const userId = await currentUserId();
  if (!userId) {
    redirect('/entrar');
  }
  return userId;
};
