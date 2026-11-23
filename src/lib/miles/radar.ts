import { formatDateTime } from '@/lib/format';
import { cities } from '@/lib/miles/cities';

/* ---------- tipos dos dados do radar ---------- */

export interface Achado {
  id: string;
  tipo: 'achado';
  origem: string;
  destino: string;
  programa: string;
  cia?: string;
  milhas: number;
  /** Texto livre. Costuma começar com a data no formato DD/MM/AAAA. */
  quando: string;
  nota?: string;
  url?: string;
  /** Data da consulta ao vivo no formato DD/MM/AAAA. Vazio quando veio de blog. */
  verificado?: string;
  hubs?: string[];
}

export interface Trecho {
  rota: string;
  milhas: number;
  info?: string;
  url?: string;
}

export interface Destaque {
  id: string;
  tipo: 'destaque';
  titulo: string;
  total?: string;
  detalhe?: string;
  dica?: string;
  selo?: string;
  verificado?: string;
  trechos?: Trecho[];
  url?: string;
  ordem?: number;
}

export interface Campanha {
  id: string;
  tipo: 'campanha';
  titulo: string;
  detalhe?: string;
  fim?: string;
  url?: string;
  ordem?: number;
}

export interface Ideia {
  id: string;
  tipo: 'ideia' | 'neve' | 'caribe';
  titulo: string;
  destino?: string;
  emoji?: string;
  hubs?: string[];
  meta?: string;
  porque?: string;
  caminho?: string;
  quando?: string;
  ordem?: number;
}

export type BrasilItem = Achado | Destaque | Campanha | Ideia;

export interface VooMundo {
  id: string;
  tipo: 'voo';
  origem: string;
  destino: string;
  programa: string;
  cia?: string;
  milhas: number;
  regiao?: string;
  quando: string;
  nota?: string;
  url?: string;
  fonte?: string;
  verificado?: string;
}

export interface Parceira {
  id: string;
  tipo: 'parceira';
  programa: string;
  parceiras: string;
  alerta?: string;
  fixa?: boolean;
  regra?: string;
  valores?: { rota: string; hoje?: string; depois?: string }[];
  melhorUso?: string;
  comoEmitir?: string;
  url?: string;
  ordem?: number;
  colDepois?: string;
}

export type MundoItem = VooMundo | Parceira | Destaque | Ideia;

export interface Promo {
  id: string;
  de: string;
  para: string;
  bonusMax?: number;
  inicio?: string;
  fim?: string;
  status?: string;
  seuBonus?: string;
  faixas?: string;
  nota?: string;
  url?: string;
  veredito?: string;
}

export interface Benchmark {
  id: string;
  de: string;
  para: string;
  comum?: string;
  gatilho?: string;
  excelente?: string;
  frequencia?: string;
  ordem?: number;
}

export interface Stopover {
  id: string;
  programa: string;
  cidade: string;
  milhas: 'sim' | 'nao' | string;
  regra?: string;
  dica?: string;
  url?: string;
  ordem?: number;
}

export interface Oportunidade {
  id: string;
  origem: string;
  destino: string;
  programa?: string;
  cia?: string;
  milhas: number;
  datas?: string;
  encontrado?: string;
  nota?: string;
  url?: string;
}

export interface Dica {
  id: string;
  titulo: string;
  texto?: string;
  exemplo?: string;
  emoji?: string;
  tag?: string;
  ordem?: number;
}

export interface Guia {
  id: string;
  nome: string;
  quando?: string;
  recomendacao?: string;
  calendario?: string;
  atualizado?: string;
  aeroportos?: { codigo: string; nome?: string; rota?: string; nota?: string }[];
  planos?: { titulo: string; custo?: string; resumo?: string; pontos?: string[] }[];
  dicas?: string[];
  fontes?: { titulo: string; url: string }[];
}

export interface PontoHistorico {
  consultado: string;
  data_voo: string;
  milhas: number;
  programa: string;
  url?: string;
  /** Momento exato da consulta, quando conhecido (leituras gravadas no banco). */
  consultadoEm?: string;
  /** Observação sobre a leitura, como "preço base" ou "lido com conta logada". */
  nota?: string;
}

export interface Historico {
  /** Rota no formato ORIGEM-DESTINO, como GYN-NAT. */
  id: string;
  pontos?: PontoHistorico[];
}

export interface RadarMeta {
  aoVivo?: string;
  fila?: string;
  resumo?: string;
  ultimaVarredura?: string;
}

/** O que as buscas de preço precisam: histórico ao vivo, achados do Brasil e voos do mundo. */
export type PriceData = Pick<RadarData, 'historico' | 'brasil' | 'mundo'>;

export interface RadarData {
  brasil: BrasilItem[];
  mundo: MundoItem[];
  promos: Promo[];
  benchmarks: Benchmark[];
  stopovers: Stopover[];
  oportunidades: Oportunidade[];
  dicas: Dica[];
  guias: Guia[];
  historico: Historico[];
  meta: RadarMeta;
}

/* ---------- programas e perfil ---------- */

export const programs = [
  { id: 'livelo', nome: 'Livelo', tipo: 'banco', cpm: 30 },
  { id: 'esfera', nome: 'Esfera', tipo: 'banco', cpm: 27 },
  { id: 'atomos', nome: 'C6 Átomos', tipo: 'banco', cpm: 25 },
  { id: 'smiles', nome: 'Smiles', tipo: 'cia', cpm: 16 },
  { id: 'azul', nome: 'Azul Fidelidade', tipo: 'cia', cpm: 13 },
  { id: 'latam', nome: 'LATAM Pass', tipo: 'cia', cpm: 25 },
] as const;
export type ProgramId = (typeof programs)[number]['id'];

export const profileFields = [
  { id: 'clubeSmiles', label: 'Clube Smiles', opts: ['Não', 'Sim'] },
  { id: 'diamanteSmiles', label: 'Smiles Diamante', opts: ['Não', 'Sim'] },
  {
    id: 'clubeAzul',
    label: 'Clube Azul (tempo)',
    opts: ['Não', '< 6 meses', '6–11 meses', '12–35 meses', '36–59 meses', '60+ meses'],
  },
  {
    id: 'azulCategoria',
    label: 'Categoria Azul',
    opts: ['Não sei', 'Safira', 'Topázio', 'Diamante'],
  },
  { id: 'clubeLivelo', label: 'Clube Livelo', opts: ['Não', 'Sim'] },
  { id: 'clubeLatam', label: 'Clube LATAM Pass', opts: ['Não', 'Sim'] },
  {
    id: 'latamCategoria',
    label: 'Categoria LATAM',
    opts: ['Não sei', 'Gold', 'Gold Plus', 'Platinum', 'Black'],
  },
  {
    id: 'esferaCat',
    label: 'Categoria Esfera',
    opts: ['Não sei', 'Esfera', 'Essencial', 'Pro', 'Master', 'VIP'],
  },
  {
    id: 'aeroportoBase',
    label: 'Aeroporto de casa',
    opts: ['—', 'GYN Goiânia', 'BSB Brasília', 'GRU São Paulo', 'VCP Campinas', 'CNF Belo Horizonte', 'GIG Rio', 'Outro'],
  },
] as const;

/* ---------- datas ---------- */

const pad = (value: number) => String(value).padStart(2, '0');

/** Dia local no formato AAAA-MM-DD, a partir de partes de data (sem fuso). */
export const isoDay = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** Extrai AAAA-MM-DD de um texto que contém DD/MM/AAAA. */
export const parseBr = (text: string | undefined | null) => {
  const found = String(text ?? '').match(/(\d{2})\/(\d{2})\/(\d{4})/);
  return found ? `${found[3]}-${found[2]}-${found[1]}` : null;
};

export const brDate = (day: string) => day.split('-').reverse().join('/');

export const daysUntil = (day: string | undefined, today: string) => {
  if (!day) {
    return null;
  }
  const from = Date.parse(`${today.slice(0, 10)}T12:00:00Z`);
  const to = Date.parse(`${day.slice(0, 10)}T12:00:00Z`);
  return Number.isNaN(to) ? null : Math.round((to - from) / 86400000);
};

export const isActivePromo = (promo: Promo, today: string) => {
  const left = daysUntil(promo.fim, today);
  return promo.status !== 'encerrada' && (left === null || left >= 0);
};

/* ---------- aeroportos ---------- */

const codes = cities.map((city) => city.match(/\(([A-Z]{3})\)/)?.[1] ?? '');

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

/** Código de três letras de um texto como "Goiânia (GYN)". */
export const iata = (text: string | undefined) => {
  const found = String(text ?? '').match(/\(([A-Z]{3})\)/);
  return found ? found[1] : String(text ?? '').trim().toUpperCase().slice(0, 3);
};

/** Código a partir do que a pessoa digitou: com parênteses, só o código ou o começo do nome. */
export const codeFrom = (text: string) => {
  const trimmed = text.trim();
  const inside = trimmed.match(/\(([A-Z]{3})\)/);
  if (inside) {
    return inside[1];
  }
  const upper = trimmed.toUpperCase();
  if (/^[A-Z]{3}$/.test(upper) && codes.includes(upper)) {
    return upper;
  }
  const query = normalize(trimmed);
  if (!query) {
    return null;
  }
  const index = cities.findIndex((city) => normalize(city).startsWith(query));
  return index >= 0 ? codes[index] : null;
};

export const cityName = (code: string) =>
  cities.find((city) => city.includes(`(${code})`)) ?? code;

/** Sugestões para o campo de aeroporto, da mais para a menos parecida. */
export const suggestCities = (text: string, limit = 8) => {
  const query = normalize(text.trim());
  if (!query) {
    return [];
  }
  const score = (city: string) => {
    const name = normalize(city);
    const code = normalize(city.match(/\(([A-Z]{3})\)/)?.[1] ?? '');
    if (code === query) {
      return 0;
    }
    if (name.startsWith(query)) {
      return 1;
    }
    if (name.split(/[\s–\-(]+/).some((word) => word.startsWith(query))) {
      return 2;
    }
    return name.includes(query) ? 3 : 9;
  };
  return cities
    .map((city, index) => ({ city, index, rank: score(city) }))
    .filter((entry) => entry.rank < 9)
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.city);
};

/* ---------- régua de viabilidade ---------- */

const northeast = new Set([
  'SSA', 'BPS', 'IOS', 'LEC', 'AJU', 'MCZ', 'REC', 'FEN', 'JPA', 'NAT', 'FOR',
  'JJD', 'PHB', 'THE', 'SLZ', 'BEL', 'STM', 'MAO', 'MCP', 'PVH', 'RBR', 'BVB',
  'PNZ', 'JDO',
]);

const zoneOf = (code: string) => {
  const index = codes.indexOf(code);
  if (index < 0) {
    return '?';
  }
  if (index <= 56) {
    return northeast.has(code) ? 'BR-NNE' : 'BR';
  }
  if (index <= 86) {
    return 'AMS';
  }
  if (index <= 108) {
    return 'CAR';
  }
  if (index <= 134) {
    return 'EUA';
  }
  return index <= 193 ? 'EUR' : 'LONGE';
};

const internationalRuler: Record<string, [number, string]> = {
  AMS: [25000, 'América do Sul'],
  CAR: [40000, 'Caribe, México e América Central'],
  EUA: [45000, 'EUA e Canadá'],
  EUR: [60000, 'Europa'],
  LONGE: [90000, 'Ásia, África, Oriente Médio e Oceania'],
};

export interface Ruler {
  /** Milhas por trecho até onde o preço é considerado bom. */
  ref: number;
  nome: string;
}

export const ruler = (origin: string, destination: string, cabin = ''): Ruler => {
  const a = zoneOf(origin);
  const b = zoneOf(destination);
  let ref: number;
  let nome: string;
  if (a.startsWith('BR') && b.startsWith('BR')) {
    const long = (a === 'BR-NNE') !== (b === 'BR-NNE');
    ref = long ? 15000 : 10000;
    nome = long ? 'nacional longo (Centro-Sul ⇄ Norte/Nordeste)' : 'nacional (mesma região)';
  } else {
    const zone = a.startsWith('BR') ? b : b.startsWith('BR') ? a : b;
    [ref, nome] = internationalRuler[zone] ?? [60000, 'internacional'];
  }
  if (/execut|premium|primeira/i.test(cabin)) {
    ref = Math.round(ref * 2.5);
    nome += ' · executiva';
  }
  return { ref, nome };
};

export type Light = 'ok' | 'warn' | 'bad';

export const light = (miles: number, ref: number): Light =>
  miles <= ref ? 'ok' : miles <= ref * 1.5 ? 'warn' : 'bad';

export const lightText: Record<Light, string> = {
  ok: 'bom preço',
  warn: 'aceitável',
  bad: 'caro',
};

/* ---------- programas e companhias ---------- */

export type ProgramKey = 'LATAM' | 'Azul' | 'Smiles';
export const programKeys = ['LATAM', 'Azul', 'Smiles'] as const;

export const programKey = (program: string | undefined): string => {
  const text = String(program ?? '');
  if (/azul/i.test(text)) {
    return 'Azul';
  }
  if (/smiles/i.test(text)) {
    return 'Smiles';
  }
  return /latam/i.test(text) ? 'LATAM' : text;
};

/** Companhias e programas reconhecidos nos textos, com o nome do selo e a cor. Smiles aparece como GOL. */
export const airlineTable = [
  { re: /\bgol\b|smiles/i, name: 'GOL', cls: 'bg-orange-600 text-white' },
  { re: /azul/i, name: 'AZUL', cls: 'bg-blue-800 text-white' },
  { re: /latam/i, name: 'LATAM', cls: 'bg-fuchsia-900 text-white' },
  { re: /\btap\b/i, name: 'TAP', cls: 'bg-emerald-700 text-white' },
  { re: /copa/i, name: 'COPA', cls: 'bg-sky-700 text-white' },
  { re: /american/i, name: 'AMERICAN', cls: 'bg-red-700 text-white' },
  { re: /iberia/i, name: 'IBERIA', cls: 'bg-rose-700 text-white' },
  { re: /air france/i, name: 'AIR FRANCE', cls: 'bg-indigo-800 text-white' },
  { re: /\bklm\b/i, name: 'KLM', cls: 'bg-cyan-700 text-white' },
  { re: /turkish/i, name: 'TURKISH', cls: 'bg-red-800 text-white' },
  { re: /qatar/i, name: 'QATAR', cls: 'bg-purple-900 text-white' },
  { re: /emirates/i, name: 'EMIRATES', cls: 'bg-red-600 text-white' },
  { re: /delta/i, name: 'DELTA', cls: 'bg-blue-900 text-white' },
  { re: /united/i, name: 'UNITED', cls: 'bg-blue-700 text-white' },
  { re: /japan airlines|\bjal\b/i, name: 'JAL', cls: 'bg-red-900 text-white' },
  { re: /aerom[eé]xico/i, name: 'AEROMÉXICO', cls: 'bg-slate-800 text-white' },
  { re: /avianca/i, name: 'AVIANCA', cls: 'bg-red-500 text-white' },
  { re: /air canada/i, name: 'AIR CANADA', cls: 'bg-red-700 text-white' },
  { re: /\bita\b/i, name: 'ITA', cls: 'bg-teal-700 text-white' },
  { re: /icelandair/i, name: 'ICELANDAIR', cls: 'bg-sky-800 text-white' },
  { re: /south african/i, name: 'SOUTH AFRICAN', cls: 'bg-green-800 text-white' },
  { re: /korean/i, name: 'KOREAN', cls: 'bg-blue-600 text-white' },
  { re: /air europa/i, name: 'AIR EUROPA', cls: 'bg-indigo-600 text-white' },
] as const;

/** Companhias e programas citados em um texto, na ordem em que aparecem, sem repetir. */
export const findAirlines = (text: string | undefined) => {
  const found: { name: string; cls: string; at: number }[] = [];
  for (const entry of airlineTable) {
    const at = String(text ?? '').search(entry.re);
    if (at >= 0 && !found.some((item) => item.name === entry.name)) {
      found.push({ name: entry.name, cls: entry.cls, at });
    }
  }
  return found.sort((a, b) => a.at - b.at);
};

export const airlineOf = (value: string | undefined) => {
  const [first] = findAirlines(value);
  if (first) {
    return first.name;
  }
  return String(value ?? '').replace(/\(.*\)/, '').trim() || '?';
};

/* ---------- links de busca nos sites oficiais (só leitura, a compra é no site) ---------- */

export const latamLink = (o: string, d: string, day: string) =>
  `https://www.latamairlines.com/br/pt/oferta-voos?origin=${o}&destination=${d}&outbound=${day}T12:00:00.000Z&adt=1&chd=0&inf=0&trip=OW&cabin=Economy&redemption=true&sort=RECOMMENDED`;

export const azulLink = (o: string, d: string, day: string) => {
  const [year, month, date] = day.split('-');
  return `https://www.voeazul.com.br/br/pt/home/selecao-voo?c[0].ds=${o}&c[0].std=${month}/${date}/${year}&c[0].as=${d}&p[0].t=ADT&p[0].c=1&p[0].cp=false&f.dl=3&f.dr=3&cc=PTS`;
};

export const smilesLink = (o: string, d: string, day: string, partner = false) => {
  const stamp = Date.parse(`${day}T03:00:00Z`);
  return `https://www.smiles.com.br/mfe/emissao-passagem/?adults=1&cabin=ALL&children=0&departureDate=${stamp}&infants=0&isElegible=false&isFlexibleDateChecked=false&returnDate=&searchType=${partner ? 'congenere' : 'g3'}&segments=1&tripType=2&originAirport=${o}&originCity=&originCountry=&originAirportIsAny=false&destinationAirport=${d}&destinCity=&destinCountry=&destinAirportIsAny=false&novo-resultado-voos=true`;
};

export const programName = (program: string | undefined) => {
  const key = programKey(program);
  return key === 'LATAM' || key === 'Azul' || key === 'Smiles' ? key : 'companhia';
};

export const programLink = (key: string, o: string, d: string, day: string, partner = false) =>
  key === 'Azul' ? azulLink(o, d, day) : key === 'Smiles' ? smilesLink(o, d, day, partner) : latamLink(o, d, day);

/** Link da busca de um achado. Prefere a URL consultada ao vivo. */
export const flightLink = (item: { origem: string; destino: string; programa?: string; quando?: string; cia?: string; url?: string; verificado?: string }) => {
  if (item.verificado && item.url) {
    return item.url;
  }
  const o = iata(item.origem);
  const d = iata(item.destino);
  const day = parseBr(item.quando);
  if (!day || o.length !== 3 || d.length !== 3) {
    return null;
  }
  const key = programKey(item.programa);
  if (key !== 'LATAM' && key !== 'Azul' && key !== 'Smiles') {
    return null;
  }
  return programLink(key, o, d, day, key === 'Smiles' && !!item.cia && !/gol/i.test(item.cia));
};

/* ---------- preços por dia ---------- */

export interface DayPrice {
  milhas: number;
  prog: string;
  /** Origem do dado, em texto para a tela. */
  fonte: string;
  live: boolean;
  url?: string;
}

/** Texto da origem de um ponto do histórico, com a data e, quando existir, a hora da consulta. */
export const pointSource = (point: PontoHistorico) =>
  'consultado em ' +
  (point.consultadoEm ? formatDateTime(point.consultadoEm) : brDate(String(point.consultado))) +
  (point.nota ? ' · ' + point.nota : '');

const lastPoints = (points: PontoHistorico[]) => {
  const last: Record<string, PontoHistorico> = {};
  for (const point of points) {
    const key = `${point.data_voo}|${programKey(point.programa)}`;
    if (!last[key] || String(point.consultado) >= String(last[key].consultado)) {
      last[key] = point;
    }
  }
  return Object.values(last);
};

const publishedFlights = (data: PriceData): (Achado | VooMundo)[] => [
  ...data.brasil.filter((item): item is Achado => item.tipo === 'achado'),
  ...data.mundo.filter((item): item is VooMundo => item.tipo === 'voo'),
];

/** Menores preços por dia de voo para uma rota, vindos do histórico ao vivo e dos alertas de blog. */
export const dayPrices = (
  data: PriceData,
  o: string,
  d: string,
  program: string,
): Record<string, DayPrice[]> => {
  const out: Record<string, DayPrice[]> = {};
  const add = (day: string | null, miles: number, prog: string, fonte: string, live: boolean, url?: string) => {
    if (!day || !miles) {
      return;
    }
    const key = programKey(prog);
    if (program !== 'Todos' && key !== program) {
      return;
    }
    (out[day] ??= []).push({ milhas: miles, prog: key, fonte, live, url });
  };
  const history = data.historico.find((h) => h.id === `${o}-${d}`);
  for (const point of lastPoints(history?.pontos ?? [])) {
    add(point.data_voo, point.milhas, point.programa, `✅ ${pointSource(point)}`, true, point.url);
  }
  for (const item of publishedFlights(data)) {
    if (iata(item.origem) === o && iata(item.destino) === d) {
      add(
        parseBr(item.quando),
        item.milhas,
        item.programa ?? '',
        item.verificado ? `✅ verificado ${item.verificado}` : '📰 alerta de blog',
        !!item.verificado,
        item.url,
      );
    }
  }
  for (const list of Object.values(out)) {
    list.sort((a, b) => a.milhas - b.milhas);
  }
  return out;
};

export interface MonthHit {
  d: string;
  dia: string;
  milhas: number;
  prog: string;
  fonte: string;
  url?: string;
}

/** Todos os destinos e dias de um mês, saindo de `o`, até um teto de milhas. */
export const monthSearch = (
  data: PriceData,
  o: string,
  month: string,
  max: number,
  program: string,
  today: string,
): MonthHit[] => {
  const best: Record<string, MonthHit> = {};
  const add = (d: string, day: string | null, miles: number, prog: string, fonte: string, url?: string) => {
    if (!d || d === o || !day || !miles || day < today || day.slice(0, 7) !== month || miles > max) {
      return;
    }
    const key = programKey(prog);
    if (program !== 'Todos' && key !== program) {
      return;
    }
    const id = `${d}|${day}|${key}`;
    if (!best[id] || miles < best[id].milhas) {
      best[id] = { d, dia: day, milhas: miles, prog: key, fonte, url };
    }
  };
  for (const history of data.historico) {
    const [from, to] = history.id.split('-');
    if (from !== o) {
      continue;
    }
    for (const point of lastPoints(history.pontos ?? [])) {
      add(to, point.data_voo, point.milhas, point.programa, `✅ ${pointSource(point)}`, point.url);
    }
  }
  for (const item of publishedFlights(data)) {
    if (iata(item.origem) === o) {
      add(
        iata(item.destino),
        parseBr(item.quando),
        item.milhas,
        item.programa ?? '',
        item.verificado ? `✅ verificado ${item.verificado}` : '📰 alerta de blog',
        item.verificado ? item.url : undefined,
      );
    }
  }
  return Object.values(best);
};

export interface KnownRoute {
  o: string;
  d: string;
  min: number;
  n: number;
}

/** Rotas que já têm algum preço futuro registrado. */
export const knownRoutes = (data: PriceData, today: string): KnownRoute[] => {
  const routes: Record<string, KnownRoute> = {};
  const add = (o: string, d: string, day: string | null, miles: number) => {
    if (!o || !d || !day || day < today || !miles) {
      return;
    }
    const entry = (routes[`${o}-${d}`] ??= { o, d, min: Infinity, n: 0 });
    entry.n += 1;
    entry.min = Math.min(entry.min, miles);
  };
  for (const history of data.historico) {
    const [o, d] = history.id.split('-');
    for (const point of history.pontos ?? []) {
      add(o, d, point.data_voo, point.milhas);
    }
  }
  for (const item of publishedFlights(data)) {
    add(iata(item.origem), iata(item.destino), parseBr(item.quando), item.milhas);
  }
  return Object.values(routes);
};

/** Tudo que já se sabe de preço para um trecho, do menor para o maior. */
export interface RealPrice {
  dia: string | null;
  quando?: string;
  milhas: number;
  programa: string;
  cia: string;
  fonte: string;
  live: boolean;
  url?: string;
}

export const realPrices = (data: PriceData, o: string, d: string, today: string): RealPrice[] => {
  const list: RealPrice[] = [];
  const history = data.historico.find((h) => h.id === `${o}-${d}`);
  for (const point of history?.pontos ?? []) {
    if (point.data_voo >= today) {
      list.push({
        dia: point.data_voo,
        milhas: point.milhas,
        programa: point.programa,
        cia: airlineOf(point.programa),
        fonte: '✅ ao vivo',
        live: true,
        url: point.url || programLink(programKey(point.programa), o, d, point.data_voo),
      });
    }
  }
  for (const item of publishedFlights(data)) {
    if (iata(item.origem) === o && iata(item.destino) === d) {
      const day = parseBr(item.quando);
      if (day && day < today) {
        continue;
      }
      list.push({
        dia: day,
        quando: item.quando,
        milhas: item.milhas,
        programa: item.programa ?? '',
        cia: airlineOf(item.cia && item.cia !== 'parceira' ? item.cia : item.programa),
        fonte: item.verificado ? '✅ ao vivo' : '📰 alerta de blog',
        live: !!item.verificado,
        url: flightLink(item) ?? item.url,
      });
    }
  }
  return list.sort((a, b) => a.milhas - b.milhas);
};

/** Reduz os dados do radar ao necessário para buscar preços, para enviar menos ao navegador. */
export const toPriceData = (data: RadarData): PriceData => ({
  historico: data.historico,
  brasil: data.brasil.filter((item) => item.tipo === 'achado'),
  mundo: data.mundo.filter((item) => item.tipo === 'voo'),
});

/** O mais recente entre vários momentos (ISO ou AAAA-MM-DD). Vazio quando não há nenhum. */
export const latestOf = (values: (string | null | undefined)[]) => {
  let best: string | null = null;
  for (const value of values) {
    if (value && (best === null || Date.parse(value) > Date.parse(best))) {
      best = value;
    }
  }
  return best;
};

/** Data DD/MM/AAAA de um texto do radar, no formato AAAA-MM-DD. */
export const brToIso = (text: string | undefined) => parseBr(text);
