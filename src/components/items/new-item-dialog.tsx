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
import {
  createItemSchema,
  itemCategories,
  itemTitleMaxLength,
} from '@/lib/items';
import { createItem } from '@/server/actions/items';

interface NewItemDialogProps {
  /** Elemento que abre o diálogo. Sem ele, aparece o botão padrão "Novo item". */
  children?: ReactNode;
}

export const NewItemDialog = ({ children }: NewItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(itemCategories[0]);
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setTitle('');
      setDueDate('');
      setError('');
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = createItemSchema.safeParse({
      title,
      category,
      dueDate: dueDate || null,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }
    startTransition(async () => {
      const result = await createItem(parsed.data);
      if (!result.ok) {
        setError(result.error);
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
            Novo item
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-6" noValidate>
          <DialogHeader>
            <DialogTitle>Novo item</DialogTitle>
            <DialogDescription>
              Dê um nome, escolha a categoria e, se quiser, um prazo. A situação
              começa como aberto.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field data-invalid={Boolean(error)}>
              <FieldLabel htmlFor="item-title">Nome</FieldLabel>
              <Input
                id="item-title"
                value={title}
                maxLength={itemTitleMaxLength}
                autoFocus
                aria-invalid={Boolean(error)}
                placeholder="Ex.: Pedido da Ana"
                onChange={(event) => {
                  setTitle(event.target.value);
                  setError('');
                }}
              />
              {error && <FieldError>{error}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor="item-category">Categoria</FieldLabel>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="item-category" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {itemCategories.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="item-due-date">Prazo (opcional)</FieldLabel>
              <Input
                id="item-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => {
                  setDueDate(event.target.value);
                  setError('');
                }}
              />
            </Field>
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
              {isPending ? 'Salvando…' : 'Salvar item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
