'use client';

import type { ReactNode } from 'react';
import { flexRender, type RowData } from '@tanstack/react-table';

import { DataTablePagination } from '@/components/data-table/data-table-pagination';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import type { DataTableInstance } from '@/components/data-table/types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData extends RowData> {
  table: DataTableInstance<TData>;
  toolbarActions?: ReactNode;
  /** Conteúdo mostrado quando nenhum registro corresponde à busca e aos filtros. */
  emptyState?: ReactNode;
  loading?: boolean;
}

export function DataTable<TData extends RowData>({
  table,
  toolbarActions,
  emptyState = 'Nenhum resultado.',
  loading = false,
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows;
  const columnCount = table.getVisibleLeafColumns().length;

  const renderBody = () => {
    if (loading) {
      return <DataTableSkeleton columnCount={columnCount} />;
    }
    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell
            colSpan={columnCount}
            className="text-muted-foreground h-28 text-center whitespace-normal"
          >
            {emptyState}
          </TableCell>
        </TableRow>
      );
    }
    return rows.map((row) => (
      <TableRow key={row.id}>
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id} className="h-13 first:pl-5 last:pr-4">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar table={table}>{toolbarActions}</DataTableToolbar>
      <Card className="overflow-hidden py-0">
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}
                    className="bg-muted/40 hover:bg-muted/40"
                  >
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="text-muted-foreground h-11 text-xs font-medium first:pl-5 last:pr-4"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>{renderBody()}</TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <DataTablePagination table={table} />
    </div>
  );
}
