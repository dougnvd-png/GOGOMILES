import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
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
