import 'server-only';

import { cache } from 'react';
import { currentUser } from '@clerk/nextjs/server';

import { isAuthConfigured } from '@/lib/env';

export interface Viewer {
  name: string;
  firstName: string;
  email: string;
  imageUrl: string | null;
}

const demoViewer: Viewer = {
  name: 'Visitante',
  firstName: '',
  email: 'Modo demonstração',
  imageUrl: null,
};

/** Dados de exibição de quem está usando o painel. */
export const getViewer = cache(async (): Promise<Viewer> => {
  if (!isAuthConfigured()) {
    return demoViewer;
  }
  const user = await currentUser();
  if (!user) {
    return demoViewer;
  }
  const email = user.primaryEmailAddress?.emailAddress ?? '';
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || email;
  return {
    name,
    firstName: user.firstName ?? '',
    email,
    imageUrl: user.imageUrl || null,
  };
});
