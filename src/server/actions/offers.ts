'use server';

import { and, eq } from 'drizzle-orm';

import {
  createOfferSchema,
  deleteOfferSchema,
  updateOfferStatusSchema,
} from '@/lib/offers';
import { failed, succeeded } from '@/lib/result';
import { ownerAction } from '@/server/action';
import { getDb } from '@/server/db';
import { offers } from '@/server/db/schema';
import { demoStore } from '@/server/demo-store';

const notFound = failed('Oferta não encontrada.');

export const createOffer = ownerAction(createOfferSchema, async (input, ownerId) => {
  const db = getDb();
  if (db) {
    await db.insert(offers).values({ ...input, ownerId });
  } else {
    demoStore.create(ownerId, input);
  }
  return succeeded('Oferta salva.');
});

export const updateOfferStatus = ownerAction(
  updateOfferStatusSchema,
  async ({ id, status }, ownerId) => {
    const db = getDb();
    const found = db
      ? (
          await db
            .update(offers)
            .set({ status, issuedAt: status === 'done' ? new Date() : null })
            .where(and(eq(offers.id, id), eq(offers.ownerId, ownerId)))
            .returning({ id: offers.id })
        ).length > 0
      : demoStore.updateStatus(ownerId, id, status);
    return found ? succeeded('Situação atualizada.') : notFound;
  },
  { invalidMessage: 'Confira a oferta e a situação escolhida.' },
);

export const deleteOffer = ownerAction(
  deleteOfferSchema,
  async ({ id }, ownerId) => {
    const db = getDb();
    const found = db
      ? (
          await db
            .delete(offers)
            .where(and(eq(offers.id, id), eq(offers.ownerId, ownerId)))
            .returning({ id: offers.id })
        ).length > 0
      : demoStore.remove(ownerId, id);
    return found ? succeeded('Oferta excluída.') : notFound;
  },
  { invalidMessage: 'Oferta não encontrada.' },
);
