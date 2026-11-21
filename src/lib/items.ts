import { z } from 'zod';

export const itemStatuses = ['open', 'in_progress', 'done'] as const;
export type ItemStatus = (typeof itemStatuses)[number];

export const itemStatusLabels: Record<ItemStatus, string> = {
  open: 'Aberto',
  in_progress: 'Em andamento',
  done: 'Concluído',
};

export const itemCategories = [
  'Atendimento',
  'Financeiro',
  'Operação',
  'Vendas',
] as const;
export type ItemCategory = (typeof itemCategories)[number];

export interface Item {
  id: string;
  title: string;
  status: ItemStatus;
  category: string;
  /** Prazo no formato AAAA-MM-DD, ou null quando não há prazo. */
  dueDate: string | null;
  /** Momento em que a situação passou a concluído, ou null enquanto pendente. */
  completedAt: string | null;
  createdAt: string;
}

export const itemTitleMaxLength = 120;

export const createItemSchema = z.strictObject({
  title: z
    .string()
    .trim()
    .min(1, 'Escreva um nome para o item.')
    .max(itemTitleMaxLength, `Use até ${itemTitleMaxLength} caracteres.`),
  category: z.enum(itemCategories, 'Escolha uma categoria.'),
  dueDate: z.iso.date('Escolha uma data válida.').nullable(),
});
export type CreateItemInput = z.infer<typeof createItemSchema>;

export const updateItemStatusSchema = z.strictObject({
  id: z.uuid(),
  status: z.enum(itemStatuses),
});

export const deleteItemSchema = z.strictObject({ id: z.uuid() });
