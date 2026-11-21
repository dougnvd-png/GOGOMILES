'use client';

import { SearchX } from 'lucide-react';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type { DataTableColumnDef } from '@/components/data-table/types';
import { EmptyState } from '@/components/empty-state';
import { NewOfferDialog } from '@/components/offers/new-offer-dialog';
import { OfferRowActions } from '@/components/offers/offer-row-actions';
import { OfferStatusBadge } from '@/components/offers/offer-status-badge';
import { useDataTable } from '@/hooks/use-data-table';
import { dayKey, formatDate, formatDayKey } from '@/lib/format';
import {
  formatMiles,
  formatMoney,
  offerCabins,
  offerPrograms,
  offerRoute,
  offerStatusLabels,
  offerStatuses,
  type Offer,
} from '@/lib/offers';

const TripCell = ({ offer }: { offer: Offer }) => {
  if (!offer.departDate) {
    return <span className="text-muted-foreground">Datas flexíveis</span>;
  }
  const isPast = offer.status !== 'done' && offer.departDate < dayKey(new Date());
  return (
    <span
      className={
        isPast
          ? 'text-destructive font-medium tabular-nums'
          : 'text-muted-foreground tabular-nums'
      }
    >
      {formatDayKey(offer.departDate)}
      {offer.returnDate ? ` a ${formatDayKey(offer.returnDate)}` : ' (só ida)'}
      {isPast && <span className="sr-only"> (data já passou)</span>}
    </span>
  );
};

const columns: DataTableColumnDef<Offer>[] = [
  {
    id: 'route',
    accessorFn: (offer) => offerRoute(offer),
    header: ({ column }) => <DataTableColumnHeader column={column} title="Rota" />,
    cell: ({ row }) => (
      <span className="block max-w-80 truncate font-medium">
        {offerRoute(row.original)}
      </span>
    ),
    filterFn: 'includesString',
    sortFn: 'text',
    enableHiding: false,
    meta: {
      label: 'Rota',
      variant: 'text',
      placeholder: 'Buscar por origem ou destino',
    },
  },
  {
    accessorKey: 'program',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Programa" />
    ),
    filterFn: 'equals',
    sortFn: 'text',
    meta: {
      label: 'Programa',
      variant: 'select',
      options: offerPrograms.map((program) => ({
        label: program,
        value: program,
      })),
    },
  },
  {
    accessorKey: 'cabin',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cabine" />
    ),
    filterFn: 'equals',
    sortFn: 'text',
    meta: {
      label: 'Cabine',
      variant: 'select',
      options: offerCabins.map((cabin) => ({ label: cabin, value: cabin })),
    },
  },
  {
    accessorKey: 'miles',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Milhas" />
    ),
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">
        {formatMiles(row.original.miles)}
      </span>
    ),
    enableColumnFilter: false,
    sortFn: 'alphanumeric',
    meta: { label: 'Milhas' },
  },
  {
    accessorKey: 'taxesCents',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Taxas" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {formatMoney(row.original.taxesCents)}
      </span>
    ),
    enableColumnFilter: false,
    sortFn: 'alphanumeric',
    meta: { label: 'Taxas' },
  },
  {
    accessorKey: 'departDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Datas" />
    ),
    cell: ({ row }) => <TripCell offer={row.original} />,
    enableColumnFilter: false,
    sortFn: 'alphanumeric',
    sortUndefined: 'last',
    meta: { label: 'Datas' },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Situação" />
    ),
    cell: ({ row }) => <OfferStatusBadge status={row.original.status} />,
    filterFn: 'equals',
    sortFn: 'text',
    meta: {
      label: 'Situação',
      variant: 'select',
      options: offerStatuses.map((status) => ({
        label: offerStatusLabels[status],
        value: status,
      })),
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cadastrada em" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {formatDate(row.original.createdAt)}
      </span>
    ),
    enableColumnFilter: false,
    sortFn: 'alphanumeric',
    meta: { label: 'Cadastrada em' },
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Ações</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <OfferRowActions offer={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  },
];

interface OffersTableProps {
  offers: Offer[];
  /** Texto de busca vindo do endereço, como em /app/ofertas?busca=lisboa. */
  initialSearch?: string;
}

export const OffersTable = ({ offers, initialSearch = '' }: OffersTableProps) => {
  const table = useDataTable({
    data: offers,
    columns,
    getRowId: (offer) => offer.id,
    initialSorting: [{ id: 'createdAt', desc: true }],
    initialFilters: initialSearch
      ? [{ id: 'route', value: initialSearch }]
      : [],
  });

  return (
    <DataTable
      table={table}
      toolbarActions={<NewOfferDialog />}
      emptyState={
        <EmptyState
          icon={SearchX}
          title="Nenhuma oferta encontrada"
          description="Ajuste a busca ou os filtros, ou cadastre uma nova oferta."
        />
      }
    />
  );
};
