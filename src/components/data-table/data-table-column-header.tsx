'use client';

import type { RowData } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import type { DataTableColumn } from '@/components/data-table/types';
import { Button } from '@/components/ui/button';

interface DataTableColumnHeaderProps<TData extends RowData, TValue> {
  column: DataTableColumn<TData, TValue>;
  title: string;
}

const sortIcons = { asc: ArrowUp, desc: ArrowDown, none: ArrowUpDown };
const sortLabels = {
  asc: 'ordenado do menor para o maior',
  desc: 'ordenado do maior para o menor',
  none: 'sem ordenação',
};

export function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <span className="font-medium">{title}</span>;
  }

  const direction = column.getIsSorted() || 'none';
  const Icon = sortIcons[direction];

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8"
      aria-label={`${title}, ${sortLabels[direction]}. Clique para mudar a ordem.`}
      onClick={() => {
        column.toggleSorting(direction === 'asc');
      }}
    >
      <span className="font-medium">{title}</span>
      <Icon className="text-muted-foreground size-3.5" />
    </Button>
  );
}
