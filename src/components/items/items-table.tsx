'use client';

import { SearchX } from 'lucide-react';

import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import type { DataTableColumnDef } from '@/components/data-table/types';
import { EmptyState } from '@/components/empty-state';
import { ItemRowActions } from '@/components/items/item-row-actions';
import { ItemStatusBadge } from '@/components/items/item-status-badge';
import { NewItemDialog } from '@/components/items/new-item-dialog';
import { useDataTable } from '@/hooks/use-data-table';
import { dayKey, formatDate, formatDayKey } from '@/lib/format';
import {
  itemCategories,
  itemStatusLabels,
  itemStatuses,
  type Item,
} from '@/lib/items';

const DueDateCell = ({ item }: { item: Item }) => {
  if (!item.dueDate) {
    return <span className="text-muted-foreground">Sem prazo</span>;
  }
  const isOverdue = item.status !== 'done' && item.dueDate < dayKey(new Date());
  return (
    <span
      className={
        isOverdue
          ? 'text-destructive font-medium tabular-nums'
          : 'text-muted-foreground tabular-nums'
      }
    >
      {formatDayKey(item.dueDate)}
      {isOverdue && <span className="sr-only"> (vencido)</span>}
    </span>
  );
};

const columns: DataTableColumnDef<Item>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nome" />,
    cell: ({ row }) => (
      <span className="block max-w-80 truncate font-medium">
        {row.original.title}
      </span>
    ),
    filterFn: 'includesString',
    sortFn: 'text',
    enableHiding: false,
    meta: { label: 'Nome', variant: 'text', placeholder: 'Buscar pelo nome' },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categoria" />
    ),
    filterFn: 'equals',
    sortFn: 'text',
    meta: {
      label: 'Categoria',
      variant: 'select',
      options: itemCategories.map((category) => ({
        label: category,
        value: category,
      })),
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Situação" />
    ),
    cell: ({ row }) => <ItemStatusBadge status={row.original.status} />,
    filterFn: 'equals',
    sortFn: 'text',
    meta: {
      label: 'Situação',
      variant: 'select',
      options: itemStatuses.map((status) => ({
        label: itemStatusLabels[status],
        value: status,
      })),
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Prazo" />,
    cell: ({ row }) => <DueDateCell item={row.original} />,
    enableColumnFilter: false,
    sortFn: 'alphanumeric',
    sortUndefined: 'last',
    meta: { label: 'Prazo' },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground tabular-nums">
        {formatDate(row.original.createdAt)}
      </span>
    ),
    enableColumnFilter: false,
    sortFn: 'alphanumeric',
    meta: { label: 'Criado em' },
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Ações</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ItemRowActions item={row.original} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
  },
];

interface ItemsTableProps {
  items: Item[];
  /** Texto de busca vindo do endereço, como em /app/itens?busca=ana. */
  initialSearch?: string;
}

export const ItemsTable = ({ items, initialSearch = '' }: ItemsTableProps) => {
  const table = useDataTable({
    data: items,
    columns,
    getRowId: (item) => item.id,
    initialSorting: [{ id: 'createdAt', desc: true }],
    initialFilters: initialSearch
      ? [{ id: 'title', value: initialSearch }]
      : [],
  });

  return (
    <DataTable
      table={table}
      toolbarActions={<NewItemDialog />}
      emptyState={
        <EmptyState
          icon={SearchX}
          title="Nenhum item encontrado"
          description="Ajuste a busca ou os filtros, ou crie um novo item."
        />
      }
    />
  );
};
