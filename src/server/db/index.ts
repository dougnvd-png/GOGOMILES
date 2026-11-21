import 'server-only';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { env } from '@/lib/env';
import * as schema from '@/server/db/schema';

const globalForDb = globalThis as unknown as {
  databaseClient?: ReturnType<typeof postgres>;
};

const createClient = (url: string) => {
  // prepare: false é exigido pelo pooler do Supabase no modo Transaction.
  const client =
    globalForDb.databaseClient ?? postgres(url, { prepare: false, max: 5 });
  if (process.env.NODE_ENV !== 'production') {
    globalForDb.databaseClient = client;
  }
  return client;
};

export const getDb = () =>
  env.DATABASE_URL
    ? drizzle(createClient(env.DATABASE_URL), { schema })
    : null;
