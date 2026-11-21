import type { Metadata } from 'next';

import { OffersTable } from '@/components/offers/offers-table';
import { PageHeader } from '@/components/platform/page-header';
import { formatNumber } from '@/lib/format';
import { listOffers } from '@/server/queries/offers';

export const metadata: Metadata = { title: 'Ofertas' };

const searchMaxLength = 80;

export default async function OffersPage({
  searchParams,
}: PageProps<'/app/ofertas'>) {
  const [offers, { busca }] = await Promise.all([listOffers(), searchParams]);
  const initialSearch =
    typeof busca === 'string' ? busca.trim().slice(0, searchMaxLength) : '';

  return (
    <>
      <PageHeader
        eyebrow="Passagens em milhas"
        title="Ofertas"
        description={`${formatNumber(offers.length)} ofertas guardadas. Busque pela rota, filtre por programa e cabine e acompanhe cada uma.`}
      />
      <OffersTable
        key={initialSearch}
        offers={offers}
        initialSearch={initialSearch}
      />
    </>
  );
}
