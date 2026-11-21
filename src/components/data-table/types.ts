import type {
  Column,
  ColumnDef,
  ReactTable,
  RowData,
} from '@tanstack/react-table';

import type { dataTableFeatures } from '@/components/data-table/data-table-features';

export type DataTableColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<typeof dataTableFeatures, TData, TValue>;

export type DataTableColumn<TData extends RowData, TValue = unknown> = Column<
  typeof dataTableFeatures,
  TData,
  TValue
>;

export type DataTableInstance<TData extends RowData> = ReactTable<
  typeof dataTableFeatures,
  TData
>;
