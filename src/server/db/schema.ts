import {
  date,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { itemStatuses } from '../../lib/items';

export const itemStatus = pgEnum('item_status', itemStatuses);

// enableRLS sem policies fecha a Data API pública do Supabase para esta tabela.
// A aplicação acessa pelo DATABASE_URL e filtra por ownerId em src/server.
export const items = pgTable(
  'items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ownerId: text('owner_id').notNull(),
    title: text('title').notNull(),
    status: itemStatus('status').notNull().default('open'),
    category: text('category').notNull(),
    dueDate: date('due_date'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('items_owner_id_idx').on(table.ownerId)],
).enableRLS();
