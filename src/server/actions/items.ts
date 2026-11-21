'use server';

import { and, eq } from 'drizzle-orm';

import {
  createItemSchema,
  deleteItemSchema,
  updateItemStatusSchema,
} from '@/lib/items';
import { failed, succeeded } from '@/lib/result';
import { ownerAction } from '@/server/action';
import { getDb } from '@/server/db';
import { items } from '@/server/db/schema';
import { demoStore } from '@/server/demo-store';

const notFound = failed('Item não encontrado.');

export const createItem = ownerAction(createItemSchema, async (input, ownerId) => {
  const db = getDb();
  if (db) {
    await db.insert(items).values({ ...input, ownerId });
  } else {
    demoStore.create(ownerId, input);
  }
  return succeeded('Item criado.');
});

export const updateItemStatus = ownerAction(
  updateItemStatusSchema,
  async ({ id, status }, ownerId) => {
    const db = getDb();
    const found = db
      ? (
          await db
            .update(items)
            .set({ status, completedAt: status === 'done' ? new Date() : null })
            .where(and(eq(items.id, id), eq(items.ownerId, ownerId)))
            .returning({ id: items.id })
        ).length > 0
      : demoStore.updateStatus(ownerId, id, status);
    return found ? succeeded('Situação atualizada.') : notFound;
  },
  { invalidMessage: 'Confira o item e a situação escolhida.' },
);

export const deleteItem = ownerAction(
  deleteItemSchema,
  async ({ id }, ownerId) => {
    const db = getDb();
    const found = db
      ? (
          await db
            .delete(items)
            .where(and(eq(items.id, id), eq(items.ownerId, ownerId)))
            .returning({ id: items.id })
        ).length > 0
      : demoStore.remove(ownerId, id);
    return found ? succeeded('Item excluído.') : notFound;
  },
  { invalidMessage: 'Item não encontrado.' },
);
