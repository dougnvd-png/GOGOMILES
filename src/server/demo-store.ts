import 'server-only';

import type { CreateOfferInput, Offer, OfferStatus } from '@/lib/offers';
import { createSampleOffers } from '@/lib/sample-offers';

const maxDemoItems = 500;

const globalForDemo = globalThis as unknown as {
  demoItemsByOwner?: Map<string, Offer[]>;
};
const itemsByOwner = (globalForDemo.demoItemsByOwner ??= new Map<string, Offer[]>());

const ownerItems = (ownerId: string) => {
  const existing = itemsByOwner.get(ownerId);
  if (existing) {
    return existing;
  }
  const created = createSampleOffers(new Date());
  itemsByOwner.set(ownerId, created);
  return created;
};

export const demoStore = {
  list: (ownerId: string) => [...ownerItems(ownerId)],
  create: (ownerId: string, input: CreateOfferInput) => {
    const list = ownerItems(ownerId);
    // Sem login todos compartilham esta lista. O teto evita crescimento sem limite.
    if (list.length >= maxDemoItems) {
      list.pop();
    }
    list.unshift({
      id: crypto.randomUUID(),
      ...input,
      status: 'open',
      issuedAt: null,
      createdAt: new Date().toISOString(),
    });
  },
  updateStatus: (ownerId: string, id: string, status: OfferStatus) => {
    const offer = ownerItems(ownerId).find((entry) => entry.id === id);
    if (!offer) {
      return false;
    }
    offer.status = status;
    offer.issuedAt = status === 'done' ? new Date().toISOString() : null;
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
