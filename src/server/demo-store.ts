import 'server-only';

import type { CreateItemInput, Item, ItemStatus } from '@/lib/items';
import { createSampleItems } from '@/lib/sample-items';

const maxDemoItems = 500;

const globalForDemo = globalThis as unknown as {
  demoItemsByOwner?: Map<string, Item[]>;
};
const itemsByOwner = (globalForDemo.demoItemsByOwner ??= new Map<string, Item[]>());

const ownerItems = (ownerId: string) => {
  const existing = itemsByOwner.get(ownerId);
  if (existing) {
    return existing;
  }
  const created = createSampleItems(new Date());
  itemsByOwner.set(ownerId, created);
  return created;
};

export const demoStore = {
  list: (ownerId: string) => [...ownerItems(ownerId)],
  create: (ownerId: string, input: CreateItemInput) => {
    const list = ownerItems(ownerId);
    // Sem login todos compartilham esta lista. O teto evita crescimento sem limite.
    if (list.length >= maxDemoItems) {
      list.pop();
    }
    list.unshift({
      id: crypto.randomUUID(),
      title: input.title,
      category: input.category,
      dueDate: input.dueDate,
      status: 'open',
      completedAt: null,
      createdAt: new Date().toISOString(),
    });
  },
  updateStatus: (ownerId: string, id: string, status: ItemStatus) => {
    const item = ownerItems(ownerId).find((entry) => entry.id === id);
    if (!item) {
      return false;
    }
    item.status = status;
    item.completedAt = status === 'done' ? new Date().toISOString() : null;
    return true;
  },
  remove: (ownerId: string, id: string) => {
    const list = ownerItems(ownerId);
    const index = list.findIndex((entry) => entry.id === id);
    if (index === -1) {
      return false;
    }
    list.splice(index, 1);
    return true;
  },
};
