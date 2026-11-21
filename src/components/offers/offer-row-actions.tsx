'use client';

import { useState, useTransition } from 'react';
import { ExternalLink, MoreHorizontal, Trash2 } from 'lucide-react';
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
  offerRoute,
  offerStatusLabels,
  offerStatuses,
  type Offer,
  type OfferStatus,
} from '@/lib/offers';
import type { ActionResult } from '@/lib/result';
import { deleteOffer, updateOfferStatus } from '@/server/actions/offers';

export const OfferRowActions = ({ offer }: { offer: Offer }) => {
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
    run(() =>
      updateOfferStatus({ id: offer.id, status: status as OfferStatus }),
    );
  };

  const handleDelete = () => {
    run(() => deleteOffer({ id: offer.id }));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={isPending}
            aria-label={`Ações da oferta ${offerRoute(offer)}`}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Situação</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={offer.status}
            onValueChange={handleStatusChange}
          >
            {offerStatuses.map((status) => (
              <DropdownMenuRadioItem key={status} value={status}>
                {offerStatusLabels[status]}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          {offer.link && (
            <DropdownMenuItem asChild>
              <a href={offer.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                Abrir no site
              </a>
            </DropdownMenuItem>
          )}
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
            <AlertDialogTitle>Excluir esta oferta?</AlertDialogTitle>
            <AlertDialogDescription>
              A oferta {offerRoute(offer)} será apagada e não poderá ser
              recuperada.
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
