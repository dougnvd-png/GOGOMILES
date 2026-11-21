'use client';

import { useState, useTransition, type FormEvent, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  createOfferSchema,
  offerCabins,
  offerLinkMaxLength,
  offerNotesMaxLength,
  offerPlaceMaxLength,
  offerPrograms,
} from '@/lib/offers';
import { createOffer } from '@/server/actions/offers';

interface NewOfferDialogProps {
  /** Elemento que abre o diálogo. Sem ele, aparece o botão padrão "Nova oferta". */
  children?: ReactNode;
}

type FieldName =
  | 'origin'
  | 'destination'
  | 'program'
  | 'cabin'
  | 'departDate'
  | 'returnDate'
  | 'miles'
  | 'taxesCents'
  | 'link'
  | 'notes';
type FieldErrors = Partial<Record<FieldName, string>>;

/** Converte "320,50" ou "320.50" em centavos. Vazio vale zero. */
const parseTaxesToCents = (text: string) => {
  const normalized = text.trim().replace(/\./g, '').replace(',', '.');
  if (normalized === '') {
    return 0;
  }
  const value = Number(normalized);
  return Number.isFinite(value) ? Math.round(value * 100) : Number.NaN;
};

export const NewOfferDialog = ({ children }: NewOfferDialogProps) => {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [program, setProgram] = useState<string>(offerPrograms[0]);
  const [cabin, setCabin] = useState<string>(offerCabins[0]);
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [miles, setMiles] = useState('');
  const [taxes, setTaxes] = useState('');
  const [link, setLink] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setOrigin('');
    setDestination('');
    setDepartDate('');
    setReturnDate('');
    setMiles('');
    setTaxes('');
    setLink('');
    setNotes('');
    setErrors({});
    setFormError('');
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      reset();
    }
  };

  const clear = (name: FieldName) => {
    setErrors((current) => ({ ...current, [name]: undefined }));
    setFormError('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = createOfferSchema.safeParse({
      origin,
      destination,
      program,
      cabin,
      departDate: departDate || null,
      returnDate: returnDate || null,
      miles: miles.trim() === '' ? undefined : Number(miles.replace(/\./g, '')),
      taxesCents: parseTaxesToCents(taxes),
      link: link.trim() || null,
      notes: notes.trim() || null,
    });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const name = issue.path[0] as FieldName | undefined;
        if (name && !next[name]) {
          next[name] = issue.message;
        }
      }
      setErrors(next);
      return;
    }
    startTransition(async () => {
      const result = await createOffer(parsed.data);
      if (!result.ok) {
        setFormError(result.error);
        return;
      }
      toast.success(result.message);
      handleOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <Plus />
            Nova oferta
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <form onSubmit={handleSubmit} className="grid gap-6" noValidate>
          <DialogHeader>
            <DialogTitle>Nova oferta</DialogTitle>
            <DialogDescription>
              Guarde um voo que vale a pena. Você confere no site do programa e
              marca a situação depois.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.origin)}>
                <FieldLabel htmlFor="offer-origin">Origem</FieldLabel>
                <Input
                  id="offer-origin"
                  value={origin}
                  maxLength={offerPlaceMaxLength}
                  autoFocus
                  aria-invalid={Boolean(errors.origin)}
                  placeholder="Ex.: São Paulo (GRU)"
                  onChange={(event) => {
                    setOrigin(event.target.value);
                    clear('origin');
                  }}
                />
                {errors.origin && <FieldError>{errors.origin}</FieldError>}
              </Field>
              <Field data-invalid={Boolean(errors.destination)}>
                <FieldLabel htmlFor="offer-destination">Destino</FieldLabel>
                <Input
                  id="offer-destination"
                  value={destination}
                  maxLength={offerPlaceMaxLength}
                  aria-invalid={Boolean(errors.destination)}
                  placeholder="Ex.: Lisboa (LIS)"
                  onChange={(event) => {
                    setDestination(event.target.value);
                    clear('destination');
                  }}
                />
                {errors.destination && (
                  <FieldError>{errors.destination}</FieldError>
                )}
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="offer-program">Programa</FieldLabel>
                <Select value={program} onValueChange={setProgram}>
                  <SelectTrigger id="offer-program" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {offerPrograms.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="offer-cabin">Cabine</FieldLabel>
                <Select value={cabin} onValueChange={setCabin}>
                  <SelectTrigger id="offer-cabin" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {offerCabins.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.departDate)}>
                <FieldLabel htmlFor="offer-depart">Ida (opcional)</FieldLabel>
                <Input
                  id="offer-depart"
                  type="date"
                  value={departDate}
                  aria-invalid={Boolean(errors.departDate)}
                  onChange={(event) => {
                    setDepartDate(event.target.value);
                    clear('departDate');
                    clear('returnDate');
                  }}
                />
                {errors.departDate && <FieldError>{errors.departDate}</FieldError>}
              </Field>
              <Field data-invalid={Boolean(errors.returnDate)}>
                <FieldLabel htmlFor="offer-return">Volta (opcional)</FieldLabel>
                <Input
                  id="offer-return"
                  type="date"
                  value={returnDate}
                  aria-invalid={Boolean(errors.returnDate)}
                  onChange={(event) => {
                    setReturnDate(event.target.value);
                    clear('returnDate');
                  }}
                />
                {errors.returnDate && <FieldError>{errors.returnDate}</FieldError>}
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.miles)}>
                <FieldLabel htmlFor="offer-miles">Milhas</FieldLabel>
                <Input
                  id="offer-miles"
                  inputMode="numeric"
                  value={miles}
                  aria-invalid={Boolean(errors.miles)}
                  placeholder="Ex.: 45000"
                  onChange={(event) => {
                    setMiles(event.target.value);
                    clear('miles');
                  }}
                />
                {errors.miles && <FieldError>{errors.miles}</FieldError>}
              </Field>
              <Field data-invalid={Boolean(errors.taxesCents)}>
                <FieldLabel htmlFor="offer-taxes">Taxas em reais</FieldLabel>
                <Input
                  id="offer-taxes"
                  inputMode="decimal"
                  value={taxes}
                  aria-invalid={Boolean(errors.taxesCents)}
                  placeholder="Ex.: 320,50"
                  onChange={(event) => {
                    setTaxes(event.target.value);
                    clear('taxesCents');
                  }}
                />
                {errors.taxesCents && <FieldError>{errors.taxesCents}</FieldError>}
              </Field>
            </div>
            <Field data-invalid={Boolean(errors.link)}>
              <FieldLabel htmlFor="offer-link">
                Link para resgatar (opcional)
              </FieldLabel>
              <Input
                id="offer-link"
                type="url"
                value={link}
                maxLength={offerLinkMaxLength}
                aria-invalid={Boolean(errors.link)}
                placeholder="https://"
                onChange={(event) => {
                  setLink(event.target.value);
                  clear('link');
                }}
              />
              {errors.link && <FieldError>{errors.link}</FieldError>}
            </Field>
            <Field data-invalid={Boolean(errors.notes)}>
              <FieldLabel htmlFor="offer-notes">Observações (opcional)</FieldLabel>
              <Textarea
                id="offer-notes"
                value={notes}
                maxLength={offerNotesMaxLength}
                aria-invalid={Boolean(errors.notes)}
                placeholder="Ex.: bagagem inclusa, promoção até sexta"
                onChange={(event) => {
                  setNotes(event.target.value);
                  clear('notes');
                }}
              />
              {errors.notes && <FieldError>{errors.notes}</FieldError>}
            </Field>
            {formError && <FieldError>{formError}</FieldError>}
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleOpenChange(false);
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando…' : 'Salvar oferta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
