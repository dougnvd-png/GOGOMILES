'use client';

import { useState, useTransition } from 'react';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  itemStatusLabels,
  itemStatuses,
  type Item,
  type ItemStatus,
} from '@/lib/items';
import type { ActionResult } from '@/lib/result';
import { deleteItem, updateItemStatus } from '@/server/actions/items';

export const ItemRowActions = ({ item }: { item: Item }) => {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isPending, startTransition] = useTransition();

  const run = (action: () => Promise<ActionResult>) => {
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        toast.success(result.message);
        return;
      }
      toast.error(result.error);
    });
  };

  const handleStatusChange = (status: string) => {
    run(() => updateItemStatus({ id: item.id, status: status as ItemStatus }));
  };

  const handleDelete = () => {
    run(() => deleteItem({ id: item.id }));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={isPending}
            aria-label={`Ações de ${item.title}`}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Situação</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={item.status}
            onValueChange={handleStatusChange}
          >
            {itemStatuses.map((status) => (
              <DropdownMenuRadioItem key={status} value={status}>
                {itemStatusLabels[status]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => {
              setConfirmingDelete(true);
            }}
          >
            <Trash2 />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={confirmingDelete} onOpenChange={setConfirmingDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir este item?</AlertDialogTitle>
            <AlertDialogDescription>
              “{item.title}” será apagado e não poderá ser recuperado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
