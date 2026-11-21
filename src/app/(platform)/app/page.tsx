import type { Metadata } from 'next';

import { Overview } from '@/components/dashboard/overview';
import { listItems } from '@/server/queries/items';
import { getViewer } from '@/server/queries/viewer';

export const metadata: Metadata = { title: 'Visão geral' };

export default async function OverviewPage() {
  const [items, viewer] = await Promise.all([listItems(), getViewer()]);

  return (
    <Overview
      items={items}
      firstName={viewer.firstName}
      now={new Date().toISOString()}
    />
  );
}
