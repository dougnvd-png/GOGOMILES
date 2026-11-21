import 'server-only';

import { cache } from 'react';
import { desc, eq } from 'drizzle-orm';

import type { Item } from '@/lib/items';
import { currentUserId } from '@/server/auth';
import { getDb } from '@/server/db';
import { items } from '@/server/db/schema';
import { demoStore } from '@/server/demo-store';

const listLimit = 1000;

/** Itens do usuário atual, do mais novo para o mais antigo. */
export const listItems = cache(async (): Promise<Item[]> => {
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
    .from(items)
    .where(eq(items.ownerId, ownerId))
    .orderBy(desc(items.createdAt))
    .limit(listLimit);
  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    category: row.category,
    dueDate: row.dueDate,
    completedAt: row.completedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  }));
});
