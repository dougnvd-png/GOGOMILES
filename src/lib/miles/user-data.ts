import { z } from 'zod';

import { programs } from '@/lib/miles/radar';

/** Documentos privados de cada pessoa: saldos, perfil, destinos-estrela, rotas vigiadas, fila e planos. */
export const userDocKinds = [
  'saldo',
  'perfil',
  'estrela',
  'vigia',
  'fila',
  'plano',
] as const;
export type UserDocKind = (typeof userDocKinds)[number];

export const userDocLimits: Record<UserDocKind, number> = {
  saldo: programs.length,
  perfil: 1,
  estrela: 20,
  vigia: 15,
  fila: 12,
  plano: 40,
};

const airportCode = z.string().regex(/^[A-Z]{3}$/, 'Use códigos de 3 letras.');
const shortText = (max: number) => z.string().trim().max(max, `Use até ${max} caracteres.`);

export const saldoSchema = z.strictObject({
  saldo: z.number().min(0).max(1_000_000_000),
  vence: z.union([z.iso.date(), z.literal('')]),
  categoria: shortText(40),
  cpm: z.number().min(0).max(500),
});

export const perfilSchema = z.record(z.string().max(40), z.string().max(40));

export const estrelaSchema = z.strictObject({
  nome: shortText(60).min(1, 'Escreva o nome do destino.'),
  aeroportos: z.array(airportCode).min(1, 'Informe ao menos um aeroporto.').max(6),
  origens: z.array(airportCode).max(6),
  meta: z.number().min(0).max(2_000_000),
});

export const vigiaSchema = z.strictObject({
  origem: shortText(60).min(1, 'Escolha a origem.'),
  destino: shortText(60).min(1, 'Escolha o destino.'),
  datas: shortText(40),
  meta: z.number().min(0).max(2_000_000),
});

export const filaSchema = z.strictObject({
  o: airportCode,
  d: airportCode,
  status: z.enum(['pendente', 'buscando', 'feito']),
  criado: z.iso.datetime(),
  feito: z.iso.datetime().optional(),
  obs: shortText(200).optional(),
});

export const planoSchema = z.strictObject({
  titulo: shortText(120),
  pedido: z.record(z.string(), z.unknown()),
  resultado: z.record(z.string(), z.unknown()),
});

export const userDocSchemas = {
  saldo: saldoSchema,
  perfil: perfilSchema,
  estrela: estrelaSchema,
  vigia: vigiaSchema,
  fila: filaSchema,
  plano: planoSchema,
} as const;

export const maxPlanBytes = 60_000;

export const saveUserDocSchema = z.strictObject({
  kind: z.enum(userDocKinds),
  /** Id do documento dentro do tipo. Para saldos, o id do programa. */
  key: z.string().regex(/^[A-Za-z0-9_-]{1,64}$/, 'Identificador inválido.'),
  data: z.unknown(),
});

export const deleteUserDocSchema = z.strictObject({
  kind: z.enum(userDocKinds),
  key: z.string().regex(/^[A-Za-z0-9_-]{1,64}$/),
});

export interface UserDoc {
  kind: UserDocKind;
  key: string;
  data: Record<string, unknown>;
  updatedAt: string;
}

export interface Estrela {
  key: string;
  nome: string;
  aeroportos: string[];
  origens: string[];
  meta: number;
}

export interface Vigia {
  key: string;
  origem: string;
  destino: string;
  datas: string;
  meta: number;
}

export interface Saldo {
  saldo: number;
  vence: string;
  categoria: string;
  cpm: number;
}

export interface FilaItem {
  key: string;
  o: string;
  d: string;
  status: 'pendente' | 'buscando' | 'feito';
  criado: string;
  feito?: string;
  obs?: string;
}

export interface SavedPlan {
  key: string;
  titulo: string;
  pedido: Record<string, unknown>;
  resultado: Record<string, unknown>;
  criado: string;
}

export interface UserData {
  saldos: Record<string, Saldo>;
  perfil: Record<string, string>;
  estrelas: Estrela[];
  vigias: Vigia[];
  fila: FilaItem[];
  planos: SavedPlan[];
}

export const emptyUserData: UserData = {
  saldos: {},
  perfil: {},
  estrelas: [],
  vigias: [],
  fila: [],
  planos: [],
};

/** Monta os dados tipados a partir dos documentos guardados. */
export const buildUserData = (docs: UserDoc[]): UserData => {
  const result: UserData = {
    saldos: {},
    perfil: {},
    estrelas: [],
    vigias: [],
    fila: [],
    planos: [],
  };
  for (const doc of docs) {
    const data = doc.data;
    if (doc.kind === 'saldo') {
      result.saldos[doc.key] = data as unknown as Saldo;
    } else if (doc.kind === 'perfil') {
      result.perfil = data as Record<string, string>;
    } else if (doc.kind === 'estrela') {
      result.estrelas.push({ key: doc.key, ...(data as Omit<Estrela, 'key'>) });
    } else if (doc.kind === 'vigia') {
      result.vigias.push({ key: doc.key, ...(data as Omit<Vigia, 'key'>) });
    } else if (doc.kind === 'fila') {
      result.fila.push({ key: doc.key, ...(data as Omit<FilaItem, 'key'>) });
    } else {
      result.planos.push({
        key: doc.key,
        titulo: String(data.titulo ?? 'Plano'),
        pedido: (data.pedido ?? {}) as Record<string, unknown>,
        resultado: (data.resultado ?? {}) as Record<string, unknown>,
        criado: doc.updatedAt,
      });
    }
  }
  result.planos.sort((a, b) => b.criado.localeCompare(a.criado));
  return result;
};
