import 'server-only';

import { cache } from 'react';
import { eq } from 'drizzle-orm';

import { buildUserData, type UserData, type UserDoc, type UserDocKind } from '@/lib/miles/user-data';
import { currentUserId } from '@/server/auth';
import { getDb } from '@/server/db';
import { userDocs } from '@/server/db/schema';
import { demoDocs } from '@/server/demo-docs';

const listLimit = 300;

/** Documentos privados do usuário atual (saldos, perfil, estrelas, vigias, fila e planos). */
export const getUserData = cache(async (): Promise<UserData> => {
  const ownerId = await currentUserId();
  if (!ownerId) {
    return buildUserData([]);
  }
  const db = getDb();
  if (!db) {
    return buildUserData(demoDocs.list(ownerId));
  }
  const rows = await db
    .select()
    .from(userDocs)
    .where(eq(userDocs.ownerId, ownerId))
    .limit(listLimit);
  return buildUserData(
    rows.map(
      (row): UserDoc => ({
        kind: row.kind as UserDocKind,
        key: row.key,
        data: row.data as Record<string, unknown>,
        updatedAt: row.updatedAt.toISOString(),
      }),
    ),
  );
});
