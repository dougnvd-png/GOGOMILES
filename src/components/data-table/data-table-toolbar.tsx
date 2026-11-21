'use client';

import type { ChangeEvent, ReactNode } from 'react';
import type { RowData } from '@tanstack/react-table';
import { Search, X } from 'lucide-react';

import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import type {
  DataTableColumn,
  DataTableInstance,
} from '@/components/data-table/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const allValue = 'all';

interface DataTableToolbarProps<TData extends RowData> {
  table: DataTableInstance<TData>;
  children?: ReactNode;
}

export function DataTableToolbar<TData extends RowData>({
  table,
  children,
}: DataTableToolbarProps<TData>) {
  const filterableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanFilter());
  const searchColumn = filterableColumns.find(
    (column) => column.columnDef.meta?.variant === 'text',
  );
  const selectColumns = filterableColumns.filter(
    (column) => column.columnDef.meta?.variant === 'select',
  );
  const isFiltered = table.state.columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {searchColumn && <DataTableSearch column={searchColumn} />}
        {selectColumns.map((column) => (
          <DataTableSelectFilter key={column.id} column={column} />
        ))}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
            }}
          >
            <X />
            Limpar
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOptions table={table} />
        {children}
      </div>
    </div>
  );
}

interface DataTableFilterProps<TData extends RowData> {
  column: DataTableColumn<TData>;
}

function DataTableSearch<TData extends RowData>({
  column,
}: DataTableFilterProps<TData>) {
  const label = column.columnDef.meta?.label ?? column.id;
  const placeholder = column.columnDef.meta?.placeholder ?? `Buscar ${label}`;
  const filterValue = column.getFilterValue();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    column.setFilterValue(value.trim() === '' ? undefined : value);
  };

  return (
    <div className="relative w-full md:max-w-xs">
      <Search
        aria-hidden
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
      />
      <Input
        type="search"
        value={typeof filterValue === 'string' ? filterValue : ''}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-9"
      />
    </div>
  );
}

function DataTableSelectFilter<TData extends RowData>({
  column,
}: DataTableFilterProps<TData>) {
  const meta = column.columnDef.meta;
  const label = meta?.label ?? column.id;
  const options = meta?.options ?? [];

  if (options.length === 0) {
    return null;
  }

  return (
    <Select
      value={String(column.getFilterValue() ?? allValue)}
      onValueChange={(value) => {
        column.setFilterValue(value === allValue ? undefined : value);
      }}
    >
      <SelectTrigger className="w-full md:w-[190px]" aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={allValue}>{label}: todas</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
