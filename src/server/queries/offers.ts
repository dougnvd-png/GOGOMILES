import 'server-only';

import { cache } from 'react';
import { desc, eq } from 'drizzle-orm';

import type { Offer } from '@/lib/offers';
import { currentUserId } from '@/server/auth';
import { getDb } from '@/server/db';
import { offers } from '@/server/db/schema';
import { demoStore } from '@/server/demo-store';

const listLimit = 1000;

/** Ofertas do usuário atual, do mais novo para o mais antigo. */
export const listOffers = cache(async (): Promise<Offer[]> => {
  const ownerId = await currentUserId();
  if (!ownerId) {
    return [];
  }
  const db = getDb();
  if (!db) {
    return demoStore.list(ownerId);
  }
  const rows = await db
    .select()
    .from(offers)
    .where(eq(offers.ownerId, ownerId))
    .orderBy(desc(offers.createdAt))
    .limit(listLimit);
  return rows.map((row) => ({
    id: row.id,
    origin: row.origin,
    destination: row.destination,
    program: row.program,
    cabin: row.cabin,
    departDate: row.departDate,
    returnDate: row.returnDate,
    miles: row.miles,
    taxesCents: row.taxesCents,
    link: row.link,
    notes: row.notes,
    status: row.status,
    issuedAt: row.issuedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  }));
});
