'use client';

import type { RowData } from '@tanstack/react-table';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { DataTableInstance } from '@/components/data-table/types';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DataTablePaginationProps<TData extends RowData> {
  table: DataTableInstance<TData>;
  pageSizeOptions?: number[];
}

export function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions = [10, 25, 50],
}: DataTablePaginationProps<TData>) {
  const pageCount = table.getPageCount();
  const pageIndex = table.state.pagination.pageIndex;
  const pageSize = table.state.pagination.pageSize;
  const currentPage = Math.max(1, Math.min(pageCount, pageIndex + 1));
  const firstPage = Math.max(1, Math.min(currentPage - 1, pageCount - 2));
  const pageNumbers = Array.from(
    { length: Math.min(3, pageCount) },
    (_, index) => firstPage + index,
  );

  const totalRowCount =
    table.options.rowCount ?? table.getFilteredRowModel().rows.length;

  if (totalRowCount === 0) {
    return null;
  }

  const firstRecord = pageIndex * pageSize + 1;
  const lastRecord = Math.min((pageIndex + 1) * pageSize, totalRowCount);

  return (
    <div className="flex flex-col gap-4 px-2 md:flex-row md:flex-wrap md:items-center md:justify-between">
      <div
        role="group"
        aria-label="Resumo e linhas por página"
        className="flex flex-wrap items-center gap-x-8 gap-y-3"
      >
        <div className="text-muted-foreground text-sm">
          Mostrando {firstRecord} a {lastRecord} de {totalRowCount} resultados
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">Linhas por página</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger
              size="sm"
              className="h-8 w-[82px]"
              aria-label="Linhas por página"
            >
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {pageSizeOptions.map((option) => (
                  <SelectItem key={option} value={`${option}`}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center justify-between gap-2 sm:justify-normal">
          <div className="flex w-[120px] items-center justify-center text-sm font-medium">
            Página {pageIndex + 1} de {pageCount}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => {
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
              aria-label="Ir para página anterior"
            >
              <ChevronLeft />
            </Button>
            {pageNumbers.map((pageNumber) => (
              <Button
                key={pageNumber}
                type="button"
                variant={pageNumber === pageIndex + 1 ? 'secondary' : 'ghost'}
                size="icon-sm"
                aria-label={`Página ${pageNumber}`}
                aria-current={pageNumber === pageIndex + 1 ? 'page' : undefined}
                onClick={() => {
                  table.setPageIndex(pageNumber - 1);
                }}
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => {
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
              aria-label="Ir para próxima página"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
