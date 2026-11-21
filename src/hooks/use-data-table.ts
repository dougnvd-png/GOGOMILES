'use client';

import { useState } from 'react';
import {
  useTable,
  type ColumnFiltersState,
  type ColumnVisibilityState,
  type PaginationState,
  type RowData,
  type SortingState,
} from '@tanstack/react-table';

import { dataTableFeatures } from '@/components/data-table/data-table-features';
import type { DataTableColumnDef } from '@/components/data-table/types';

interface UseDataTableOptions<TData extends RowData> {
  data: TData[];
  columns: DataTableColumnDef<TData>[];
  getRowId?: (row: TData) => string;
  initialSorting?: SortingState;
  /** Filtros já aplicados ao abrir a tela, como uma busca vinda do endereço. */
  initialFilters?: ColumnFiltersState;
  pageSize?: number;
}

export function useDataTable<TData extends RowData>({
  data,
  columns,
  getRowId,
  initialSorting = [],
  initialFilters = [],
  pageSize = 10,
}: UseDataTableOptions<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialFilters);
  const [columnVisibility, setColumnVisibility] =
    useState<ColumnVisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  return useTable({
    features: dataTableFeatures,
    data,
    columns,
    getRowId,
    renderFallbackValue: '-',
    state: { sorting, columnFilters, columnVisibility, pagination },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });
}
