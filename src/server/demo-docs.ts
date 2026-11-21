import 'server-only';

import type { UserDoc, UserDocKind } from '@/lib/miles/user-data';

const globalForDemo = globalThis as unknown as {
  demoDocsByOwner?: Map<string, Map<string, UserDoc>>;
};
const docsByOwner = (globalForDemo.demoDocsByOwner ??= new Map());

const ownerDocs = (ownerId: string) => {
  const existing = docsByOwner.get(ownerId);
  if (existing) {
    return existing;
  }
  const created = new Map<string, UserDoc>();
  docsByOwner.set(ownerId, created);
  return created;
};

/** Armazenamento em memória dos documentos privados, usado só sem banco conectado. */
export const demoDocs = {
  list: (ownerId: string) => [...ownerDocs(ownerId).values()],
  count: (ownerId: string, kind: UserDocKind) =>
    [...ownerDocs(ownerId).values()].filter((doc) => doc.kind === kind).length,
  has: (ownerId: string, kind: UserDocKind, key: string) =>
    ownerDocs(ownerId).has(`${kind}:${key}`),
  save: (ownerId: string, kind: UserDocKind, key: string, data: Record<string, unknown>) => {
    ownerDocs(ownerId).set(`${kind}:${key}`, {
      kind,
      key,
      data,
      updatedAt: new Date().toISOString(),
    });
  },
  remove: (ownerId: string, kind: UserDocKind, key: string) =>
    ownerDocs(ownerId).delete(`${kind}:${key}`),
};
