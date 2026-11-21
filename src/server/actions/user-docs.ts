'use server';

import { and, count, eq } from 'drizzle-orm';

import { failed, succeeded } from '@/lib/result';
import {
  deleteUserDocSchema,
  maxPlanBytes,
  saveUserDocSchema,
  userDocLimits,
  userDocSchemas,
} from '@/lib/miles/user-data';
import { ownerAction } from '@/server/action';
import { getDb } from '@/server/db';
import { userDocs } from '@/server/db/schema';
import { demoDocs } from '@/server/demo-docs';

/**
 * Grava (cria ou substitui) um documento privado. A validação do conteúdo
 * depende do tipo e roda aqui no servidor.
 */
export const saveUserDoc = ownerAction(
  saveUserDocSchema,
  async ({ kind, key, data }, ownerId) => {
    const parsed = userDocSchemas[kind].safeParse(data);
    if (!parsed.success) {
      return failed(parsed.error.issues[0].message);
    }
    const value = parsed.data as Record<string, unknown>;
    if (kind === 'plano' && JSON.stringify(value).length > maxPlanBytes) {
      return failed('O plano ficou grande demais para salvar.');
    }
    const db = getDb();
    if (db) {
      const exists =
        (
          await db
            .select({ id: userDocs.id })
            .from(userDocs)
            .where(
              and(
                eq(userDocs.ownerId, ownerId),
                eq(userDocs.kind, kind),
                eq(userDocs.key, key),
              ),
            )
            .limit(1)
        ).length > 0;
      if (!exists) {
        const [{ total }] = await db
          .select({ total: count() })
          .from(userDocs)
          .where(and(eq(userDocs.ownerId, ownerId), eq(userDocs.kind, kind)));
        if (total >= userDocLimits[kind]) {
          return failed('Você chegou ao limite desta lista. Remova um item antes.');
        }
      }
      await db
        .insert(userDocs)
        .values({ ownerId, kind, key, data: value })
        .onConflictDoUpdate({
          target: [userDocs.ownerId, userDocs.kind, userDocs.key],
          set: { data: value, updatedAt: new Date() },
        });
    } else {
      if (
        !demoDocs.has(ownerId, kind, key) &&
        demoDocs.count(ownerId, kind) >= userDocLimits[kind]
      ) {
        return failed('Você chegou ao limite desta lista. Remova um item antes.');
      }
      demoDocs.save(ownerId, kind, key, value);
    }
    return succeeded('Salvo.');
  },
  { invalidMessage: 'Confira os dados e tente de novo.' },
);

export const deleteUserDoc = ownerAction(
  deleteUserDocSchema,
  async ({ kind, key }, ownerId) => {
    const db = getDb();
    if (db) {
      await db
        .delete(userDocs)
        .where(
          and(
            eq(userDocs.ownerId, ownerId),
            eq(userDocs.kind, kind),
            eq(userDocs.key, key),
          ),
        );
    } else {
      demoDocs.remove(ownerId, kind, key);
    }
    return succeeded('Removido.');
  },
  { invalidMessage: 'Item não encontrado.' },
);
