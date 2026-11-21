import type { Metadata } from 'next';

import { Overview } from '@/components/dashboard/overview';
import { listOffers } from '@/server/queries/offers';
import { getViewer } from '@/server/queries/viewer';

export const metadata: Metadata = { title: 'Visão geral' };

export default async function OverviewPage() {
  const [offers, viewer] = await Promise.all([listOffers(), getViewer()]);

  return (
    <Overview
      offers={offers}
      firstName={viewer.firstName}
      now={new Date().toISOString()}
    />
  );
}
