import type { Metadata } from 'next';

import { ItemsTable } from '@/components/items/items-table';
import { PageHeader } from '@/components/platform/page-header';
import { formatNumber } from '@/lib/format';
import { listItems } from '@/server/queries/items';

export const metadata: Metadata = { title: 'Itens' };

const searchMaxLength = 80;

export default async function ItemsPage({
  searchParams,
}: PageProps<'/app/itens'>) {
  const [items, { busca }] = await Promise.all([listItems(), searchParams]);
  const initialSearch =
    typeof busca === 'string' ? busca.trim().slice(0, searchMaxLength) : '';

  return (
    <>
      <PageHeader
        eyebrow="Cadastro"
        title="Itens"
        description={`${formatNumber(items.length)} itens cadastrados. Busque pelo nome, filtre e acompanhe a situação de cada um.`}
      />
      <ItemsTable key={initialSearch} items={items} initialSearch={initialSearch} />
    </>
  );
}
