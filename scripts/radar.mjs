/**
 * Grava o radar no banco.
 *
 *   npm run radar:importar                    copia src/data/radar.json para o banco vazio
 *   npm run radar:atualizar -- arquivo.json   grava novidades (veja docs/radar.md)
 *
 * Tudo o que vem de sites passa por validação antes de entrar. Nada é apagado.
 */
import { readFileSync } from 'node:fs';

import postgres from 'postgres';
import { z } from 'zod';

const link = z.url({ protocol: /^https?$/ }).max(2000);
const day = z.iso.date();
const text = z.string().max(2000);
const id = z.string().regex(/^[A-Za-z0-9_-]{1,100}$/, 'id com letras, números, - ou _');
const miles = z.number().int().positive().max(5_000_000);

const base = z.looseObject({ id, url: link.optional() });

const collections = {
  promos: base.extend({
    de: text,
    para: text,
    bonusMax: z.number().min(0).max(1000).optional(),
    inicio: day.optional(),
    fim: day.optional(),
  }),
  brasil: base.extend({
    tipo: z.enum(['achado', 'campanha', 'destaque', 'ideia']),
    milhas: miles.optional(),
    fim: day.optional(),
  }),
  mundo: base.extend({
    tipo: z.enum(['voo', 'destaque', 'parceira', 'neve', 'caribe']),
    milhas: miles.optional(),
  }),
  benchmarks: base.extend({ de: text, para: text }),
  stopovers: base.extend({ programa: text, cidade: text }),
  oportunidades: base.extend({ origem: text, destino: text, milhas: miles }),
  dicas: base.extend({ titulo: text }),
  guias: base.extend({ nome: text }),
  historico: base.extend({
    pontos: z
      .array(
        z.looseObject({
          data_voo: day,
          consultado: day,
          milhas: miles,
          programa: text,
          url: link.optional(),
        }),
      )
      .max(500)
      .optional(),
  }),
};

const airport = z.string().regex(/^[A-Z]{3}$/, 'use o código de 3 letras');

const priceSchema = z.strictObject({
  origin: airport,
  destination: airport,
  flightDate: day,
  program: z.string().min(2).max(40),
  miles,
  url: link.optional(),
  note: z.string().max(300).optional(),
});

const metaSchema = z.strictObject({
  ultimaVarredura: z.iso.datetime().optional(),
  aoVivo: z.iso.datetime().optional(),
  fila: z.iso.datetime().optional(),
  resumo: z.string().max(600).optional(),
});

const updateSchema = z.strictObject({
  meta: metaSchema.optional(),
  itens: z.partialRecord(z.enum(Object.keys(collections)), z.array(z.unknown())).optional(),
  precos: z.array(priceSchema).max(2000).optional(),
});

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const validateItems = (itens) => {
  const valid = [];
  const problems = [];
  for (const [collection, list] of Object.entries(itens)) {
    list.forEach((item, index) => {
      const parsed = collections[collection].safeParse(item);
      if (parsed.success) {
        valid.push({ collection, item: parsed.data });
      } else {
        const issue = parsed.error.issues[0];
        problems.push(`${collection}[${index}] ${issue.path.join('.')}: ${issue.message}`);
      }
    });
  }
  if (problems.length > 0) {
    fail(`Nada foi gravado. Corrija estes itens:\n${problems.slice(0, 20).join('\n')}`);
  }
  return valid;
};

const createTables = async (sql) => {
  await sql`create table if not exists radar_items (
    collection text not null,
    item_id text not null,
    data jsonb not null,
    updated_at timestamptz not null default now(),
    primary key (collection, item_id)
  )`;
  await sql`alter table radar_items enable row level security`;
};

const upsert = (sql, collection, itemId, data) =>
  sql`insert into radar_items (collection, item_id, data)
      values (${collection}, ${itemId}, ${sql.json(data)})
      on conflict (collection, item_id)
      do update set data = excluded.data, updated_at = now()`;

const saveItems = async (sql, entries) => {
  for (const { collection, item } of entries) {
    const { id: itemId, ...data } = item;
    await upsert(sql, collection, itemId, data);
  }
};

const importBundled = async (sql, force) => {
  const [{ total }] = await sql`select count(*)::int as total from radar_items`;
  if (total > 0 && !force) {
    fail(`O banco já tem ${total} itens do radar. Nada foi alterado.`);
  }
  const radar = JSON.parse(
    readFileSync(new URL('../src/data/radar.json', import.meta.url), 'utf8'),
  );
  const { meta, ...itens } = radar;
  const entries = validateItems(itens);
  await sql.begin(async (transaction) => {
    await saveItems(transaction, entries);
    await upsert(transaction, 'meta', 'meta', meta);
  });
  console.log(`Importados ${entries.length} itens do radar.`);
};

const applyUpdate = async (sql, file) => {
  if (!file) {
    fail('Informe o arquivo: npm run radar:atualizar -- arquivo.json');
  }
  const parsed = updateSchema.safeParse(JSON.parse(readFileSync(file, 'utf8')));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    fail(`Arquivo inválido em ${issue.path.join('.')}: ${issue.message}`);
  }
  const { meta, itens = {}, precos = [] } = parsed.data;
  const entries = validateItems(itens);
  const now = new Date().toISOString();

  await sql.begin(async (transaction) => {
    await saveItems(transaction, entries);
    for (const price of precos) {
      await transaction`insert into price_checks
        (origin, destination, flight_date, program, miles, url, note)
        values (${price.origin}, ${price.destination}, ${price.flightDate},
                ${price.program}, ${price.miles}, ${price.url ?? null}, ${price.note ?? null})`;
    }
    const [current] =
      await transaction`select data from radar_items where collection = 'meta' and item_id = 'meta'`;
    const nextMeta = {
      ...(current?.data ?? {}),
      ...(entries.length > 0 ? { ultimaVarredura: now } : {}),
      ...(precos.length > 0 ? { aoVivo: now } : {}),
      ...meta,
    };
    await upsert(transaction, 'meta', 'meta', nextMeta);
  });
  console.log(`Gravados ${entries.length} itens e ${precos.length} preços.`);
};

const [command, argument] = process.argv.slice(2);
if (!process.env.DATABASE_URL) {
  fail('Falta DATABASE_URL no arquivo .env.local.');
}
if (command !== 'importar' && command !== 'atualizar') {
  fail('Use: importar ou atualizar arquivo.json');
}

const sql = postgres(process.env.DATABASE_URL, {
  prepare: false,
  max: 1,
  connect_timeout: 20,
  onnotice: () => {},
});
try {
  await createTables(sql);
  if (command === 'importar') {
    await importBundled(sql, argument === '--forcar');
  } else {
    await applyUpdate(sql, argument);
  }
} catch (error) {
  console.error('Não foi possível gravar o radar:', error.code ?? error.name, error.message);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
