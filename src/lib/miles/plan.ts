import { z } from 'zod';

export const planCabins = ['Econômica', 'Premium economy', 'Executiva'] as const;

export const planRequestSchema = z.strictObject({
  origem: z.string().trim().min(2, 'Escolha a cidade de partida.').max(60),
  destino: z.string().trim().min(2, 'Escolha o destino.').max(60),
  parada: z.string().trim().max(60),
  ida: z.string().trim().max(40),
  volta: z.string().trim().max(40),
  adultos: z.number().int().min(1).max(9),
  criancas: z.number().int().min(0).max(9),
  classe: z.enum(planCabins),
  programas: z.array(z.string().max(40)).max(10),
  sugerirParada: z.boolean(),
  stopover: z.boolean(),
  flex: z.boolean(),
});
export type PlanRequest = z.infer<typeof planRequestSchema>;

export interface PlanAirport {
  codigo?: string;
  nome?: string;
  porque?: string;
}

export interface PlanRoute {
  titulo?: string;
  programa?: string;
  cias?: string;
  trechos?: string[];
  milhasPorTrechoPorPessoa?: string;
  taxas?: string;
  totalEstimado?: string;
  pros?: string[];
  contras?: string[];
  melhor?: boolean;
}

export interface PlanOperator {
  cia?: string;
  opera?: string;
  via?: string;
  programa?: string;
  min?: number;
  tipico?: number;
  max?: number;
  obs?: string;
}

export interface PlanResult {
  resumo?: string;
  aeroportos?: { saida?: PlanAirport[]; chegada?: PlanAirport[] };
  rotas?: PlanRoute[];
  paradas?: { cidade?: string; codigo?: string; porque?: string; comoEncaixar?: string; diasSugeridos?: string }[];
  stopover?: { onde?: string; regra?: string; comoFazer?: string }[];
  bonus?: { acao?: string; detalhe?: string }[];
  datas?: string;
  alternativas?: { rota?: string; porque?: string; economia?: string }[];
  regras?: string[];
  timing?: string;
  valeMilha?: string;
  operadoras?: PlanOperator[];
  passos?: string[];
  alertas?: string[];
}

export type PlanActionResult =
  | { ok: true; plan: PlanResult }
  | { ok: false; error: string };
