'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

interface DataTableSkeletonProps {
  columnCount: number;
  rowCount?: number;
}

export const DataTableSkeleton = ({
  columnCount,
  rowCount = 8,
}: DataTableSkeletonProps) => {
  const rowIds = Array.from(
    { length: rowCount },
    (_, index) => `skeleton-${index}`,
  );

  return (
    <>
      {rowIds.map((rowId) => (
        <TableRow key={rowId}>
          {Array.from({ length: columnCount }, (_, columnIndex) => (
            <TableCell key={`${rowId}-${columnIndex}`}>
              <Skeleton className="h-5 w-full max-w-[220px]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
