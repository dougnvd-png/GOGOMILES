import {
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { offerStatuses } from '../../lib/offers';

export const offerStatus = pgEnum('offer_status', offerStatuses);

// enableRLS sem policies fecha a Data API pública do Supabase para esta tabela.
// A aplicação acessa pelo DATABASE_URL e filtra por ownerId em src/server.
export const offers = pgTable(
  'offers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: text('owner_id').notNull(),
    origin: text('origin').notNull(),
    destination: text('destination').notNull(),
    program: text('program').notNull(),
    cabin: text('cabin').notNull(),
    departDate: date('depart_date'),
    returnDate: date('return_date'),
    miles: integer('miles').notNull(),
    taxesCents: integer('taxes_cents').notNull().default(0),
    link: text('link'),
    notes: text('notes'),
    status: offerStatus('status').notNull().default('open'),
    issuedAt: timestamp('issued_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('offers_owner_id_idx').on(table.ownerId)],
).enableRLS();

// Documentos privados de cada pessoa (saldos, perfil, destinos-estrela, rotas
// vigiadas, fila de busca e planos salvos). O tipo e a validação ficam em
// src/lib/miles/user-data.ts. Sempre filtrados por owner_id.
export const userDocs = pgTable(
  'user_docs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: text('owner_id').notNull(),
    kind: text('kind').notNull(),
    key: text('key').notNull(),
    data: jsonb('data').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex('user_docs_owner_kind_key_idx').on(
      table.ownerId,
      table.kind,
      table.key,
    ),
  ],
).enableRLS();

// Leituras de preço em milhas feitas nos sites das companhias. São dados
// compartilhados por todos (não pertencem a uma pessoa) e só são gravados por
// scripts do servidor, nunca pelo navegador. Por isso não há owner_id.
export const priceChecks = pgTable(
  'price_checks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    origin: text('origin').notNull(),
    destination: text('destination').notNull(),
    flightDate: date('flight_date').notNull(),
    program: text('program').notNull(),
    miles: integer('miles').notNull(),
    url: text('url'),
    note: text('note'),
    checkedAt: timestamp('checked_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('price_checks_route_idx').on(table.origin, table.destination),
  ],
).enableRLS();

// O radar (promoções, campanhas, bônus, guias, histórico importado). Dados
// compartilhados por todos, gravados só pelo comando scripts/radar.mjs. Cada
// linha é um item de uma coleção; o formato está em src/lib/miles/radar.ts.
export const radarItems = pgTable(
  'radar_items',
  {
    collection: text('collection').notNull(),
    itemId: text('item_id').notNull(),
    data: jsonb('data').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.collection, table.itemId] })],
).enableRLS();
