import places from '@/data/climate-places.json';
import climate from '@/data/climate.json';

/**
 * Clima típico de um destino em um mês. As médias vêm de `npm run clima:baixar`;
 * temporadas de neve e de furacões são revisadas à mão em `climate-places.json`.
 */

export type Sky = 'sun' | 'clouds' | 'rain' | 'snow';
export type Land = 'beach' | 'city' | 'mountains';
export type RainLevel = 'alta' | 'média' | 'baixa';

interface Place {
  kind: string;
  snow?: number[];
  snowNote?: string;
  maySnow?: number[];
  /** Região com temporada de tempestades; veja `storms`. */
  storm?: string;
  /** Meses de noites escuras em que a aurora boreal pode aparecer. */
  aurora?: number[];
}

export interface ClimateNote {
  tone: 'blue' | 'warn' | 'bad';
  text: string;
}

export interface DestinationWeather {
  /** Céu e paisagem do fundo da tela, de acordo com a época. */
  sky: Sky;
  land: Land;
  /** Época em que a aurora boreal pode aparecer. Nunca é garantia. */
  aurora: boolean;
  /** Temperatura média do mês, em graus Celsius. */
  temperature: number;
  /** Chuva média do mês, em milímetros por dia. */
  rain: number;
  rainLevel: RainLevel;
  notes: ClimateNote[];
}

const catalog: Record<string, Place> = places;
const averages: Record<string, { temperature: number[]; rain: number[] }> = climate.places;

const heavyRain = 5;
const someRain = 2.5;
/** Temporadas de tempestades tropicais por região. */
const storms: Record<string, { text: string; months: number[] }> = {
  atlantic: { text: 'Temporada de furacões', months: [6, 7, 8, 9, 10, 11] },
  pacific: { text: 'Temporada de furacões', months: [6, 7, 8, 9, 10] },
  typhoon: { text: 'Temporada de tufões', months: [7, 8, 9, 10] },
  south: { text: 'Temporada de ciclones', months: [11, 12, 1, 2, 3, 4] },
};

export const monthNames = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const;

const shortMonths = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

/** Anos usados nas médias, como "2001 a 2025". */
export const climatePeriod = (climate.period.match(/\b(19|20)\d{2}\b/g) ?? []).slice(-2).join(' a ');

export const rainLevel = (rain: number): RainLevel =>
  rain >= heavyRain ? 'alta' : rain >= someRain ? 'média' : 'baixa';

const validMonth = (value: number) => (value >= 1 && value <= 12 ? value : null);

/**
 * Mês escrito pela pessoa: "10/09/2027", "09/2027", "2027-09-10", "set/2027"
 * ou "setembro". Devolve de 1 a 12, ou nulo quando não reconhece.
 */
export const monthFromText = (text: string) => {
  const value = text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();
  const iso = value.match(/^\d{4}-(\d{1,2})(-\d{1,2})?$/);
  if (iso) {
    return validMonth(Number(iso[1]));
  }
  const monthYear = value.match(/^(\d{1,2})[/.-](\d{4})$/);
  if (monthYear) {
    return validMonth(Number(monthYear[1]));
  }
  const dayMonth = value.match(/^\d{1,2}[/.-](\d{1,2})([/.-](\d{2}|\d{4}))?$/);
  if (dayMonth) {
    return validMonth(Number(dayMonth[1]));
  }
  const word = value.match(
    /\b(jan(eiro)?|fev(ereiro)?|mar(co)?|abr(il)?|mai(o)?|jun(ho)?|jul(ho)?|ago(sto)?|set(embro)?|out(ubro)?|nov(embro)?|dez(embro)?)\b/,
  );
  if (!word) {
    return null;
  }
  const start = word[1].slice(0, 3);
  return validMonth(shortMonths.indexOf(start) + 1);
};

export const weatherFor = (code: string, month: number): DestinationWeather | null => {
  const place = catalog[code];
  const data = averages[code];
  if (!place || !data || !validMonth(month)) {
    return null;
  }
  const temperature = data.temperature[month - 1];
  const rain = data.rain[month - 1];
  const level = rainLevel(rain);
  const snowing = place.snow?.includes(month) ?? false;
  const beach = place.kind === 'praia';
  const notes: ClimateNote[] = [];
  const aurora = place.aurora?.includes(month) ?? false;

  if (aurora) {
    notes.push({ tone: 'blue', text: 'Temporada de aurora boreal' });
  }
  if (snowing) {
    notes.push({
      tone: 'blue',
      text: ['Temporada de neve', place.snowNote].filter(Boolean).join(' '),
    });
  }
  if (place.maySnow?.includes(month)) {
    notes.push({ tone: 'blue', text: 'Pode nevar' });
  }
  if (!snowing && level === 'alta') {
    notes.push({ tone: 'warn', text: 'Período chuvoso' });
  }
  const storm = place.storm ? storms[place.storm] : undefined;
  if (storm?.months.includes(month)) {
    notes.push({ tone: 'bad', text: storm.text });
  }

  const byRain: Record<RainLevel, Sky> = { alta: 'rain', 'média': 'clouds', baixa: 'sun' };
  // Onde pode nevar, a época é fria: céu fechado mesmo com pouca chuva.
  const cold = (place.maySnow?.includes(month) ?? false) && level !== 'alta';
  const mountains = place.kind === 'neve' || place.kind === 'montanha';
  const land: Land = beach ? 'beach' : mountains ? 'mountains' : 'city';
  return {
    sky: snowing ? 'snow' : cold ? 'clouds' : byRain[level],
    land,
    aurora,
    temperature,
    rain,
    rainLevel: level,
    notes,
  };
};
