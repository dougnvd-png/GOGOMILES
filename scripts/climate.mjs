/**
 * Baixa o clima típico de cada destino e grava em src/data/climate.json.
 *
 *   npm run clima:baixar
 *
 * Fonte: NASA POWER, médias mensais de vários anos. Pública, gratuita e sem chave.
 * Só as coordenadas dos destinos são enviadas.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const placesFile = new URL('../src/data/climate-places.json', import.meta.url);
const outputFile = new URL('../src/data/climate.json', import.meta.url);
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const together = 4;

const places = JSON.parse(readFileSync(placesFile, 'utf8'));

const monthly = (values, code, name) =>
  months.map((month) => {
    const value = values?.[month];
    // A NASA usa -999 quando não há dado.
    if (typeof value !== 'number' || value <= -900) {
      throw new Error(`${code}: sem dado de ${name} em ${month}`);
    }
    return Math.round(value * 10) / 10;
  });

const download = async (code) => {
  const { lat, lon } = places[code];
  const url = new URL('https://power.larc.nasa.gov/api/temporal/climatology/point');
  url.search = new URLSearchParams({
    parameters: 'T2M,PRECTOTCORR',
    community: 'RE',
    latitude: String(lat),
    longitude: String(lon),
    format: 'JSON',
  }).toString();
  const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) {
    throw new Error(`${code}: a NASA respondeu ${response.status}`);
  }
  const body = await response.json();
  const { T2M, PRECTOTCORR } = body.properties?.parameter ?? {};
  return {
    period: body.header?.range ?? '',
    data: {
      temperature: monthly(T2M, code, 'temperatura'),
      rain: monthly(PRECTOTCORR, code, 'chuva'),
    },
  };
};

const codes = Object.keys(places).sort();
const result = {};
let period = '';
for (let start = 0; start < codes.length; start += together) {
  const group = codes.slice(start, start + together);
  const answers = await Promise.all(group.map(download));
  group.forEach((code, index) => {
    result[code] = answers[index].data;
    period ||= answers[index].period;
  });
  console.log(`${Math.min(start + together, codes.length)} de ${codes.length} destinos`);
}

// Uma linha por destino mantém o arquivo curto e fácil de conferir.
const lines = codes.map((code) => `    "${code}": ${JSON.stringify(result[code])}`);
writeFileSync(
  outputFile,
  `{
  "source": "NASA POWER",
  "period": ${JSON.stringify(period)},
  "downloadedAt": ${JSON.stringify(new Date().toISOString())},
  "places": {
${lines.join(',\n')}
  }
}
`,
);
console.log(`Clima de ${codes.length} destinos gravado.`);
