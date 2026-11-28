'use client';

import { useSyncExternalStore } from 'react';
import { CloudRain, CloudSun, Snowflake, Sparkles, Sun } from 'lucide-react';

import { Tag } from '@/components/miles/bits';
import { ClimateScene } from '@/components/miles/climate-scene';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { climatePeriod, monthNames, weatherFor } from '@/lib/miles/climate';
import { cityName } from '@/lib/miles/radar';
import { useReducedMotion } from '@/lib/use-reduced-motion';

// Preferência guardada só neste navegador. Sem armazenamento, vale até recarregar.
const storageKey = 'gogomiles:clima';
const listeners = new Set<() => void>();
let remembered = false;

const readPaused = () => {
  try {
    return window.localStorage.getItem(storageKey) === 'parado';
  } catch {
    return remembered;
  }
};

const savePaused = (paused: boolean) => {
  remembered = paused;
  try {
    window.localStorage.setItem(storageKey, paused ? 'parado' : 'animado');
  } catch {
    // Janela anônima ou armazenamento bloqueado.
  }
  listeners.forEach((notify) => {
    notify();
  });
};

const subscribe = (notify: () => void) => {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
};

const icons = { sun: Sun, clouds: CloudSun, rain: CloudRain, snow: Snowflake };

const skyNames = {
  sun: 'Época de sol',
  clouds: 'Sol entre nuvens',
  rain: 'Época de chuva',
  snow: 'Época de neve',
};

/** Fundo temático e quadro com o clima típico do destino no mês da viagem. */
export const DestinationClimate = ({
  code,
  month,
}: {
  code: string | null;
  month: number | null;
}) => {
  const paused = useSyncExternalStore(subscribe, readPaused, () => false);
  const reducedMotion = useReducedMotion();
  const weather = code && month ? weatherFor(code, month) : null;
  if (!code || !month || !weather) {
    return null;
  }
  const { sky, land, aurora } = weather;
  const Icon = aurora ? Sparkles : icons[sky];
  const animate = !paused && !reducedMotion;
  const scene = { sky, land, aurora, animate };
  const city = cityName(code).replace(/ \([A-Z]{3}\)$/, '');

  return (
    <>
      <ClimateScene {...scene} place="page" />
      {animate && (sky === 'snow' || sky === 'rain') && (
        <ClimateScene {...scene} place="front" />
      )}
      <Card className="overflow-hidden pt-0">
        <div className="relative h-52">
          <ClimateScene {...scene} place="banner" />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="text-brand-ink size-4 shrink-0" aria-hidden />
            {city} em {monthNames[month - 1]}: clima típico
          </CardTitle>
          <p className="text-brand-ink text-sm font-medium">
            {aurora ? 'Noites de aurora boreal' : skyNames[sky]}
          </p>
        </CardHeader>
        <CardContent className="grid gap-3">
          <dl className="flex flex-wrap gap-x-8 gap-y-2">
            <div>
              <dt className="text-muted-foreground text-xs">Temperatura média</dt>
              <dd className="text-lg font-semibold tabular-nums">
                {Math.round(weather.temperature)} °C
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">
                Chance de {sky === 'snow' ? 'chuva ou neve' : 'chuva'}
              </dt>
              <dd className="text-lg font-semibold">
                {weather.rainLevel}
                <span className="text-muted-foreground ml-2 text-xs font-normal tabular-nums">
                  {weather.rain.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mm por dia em
                  média
                </span>
              </dd>
            </div>
          </dl>
          {weather.notes.length > 0 && (
            <div className="flex flex-wrap gap-2" role="status">
              {weather.notes.map((note) => (
                <Tag key={note.text} tone={note.tone}>
                  {note.text}
                </Tag>
              ))}
            </div>
          )}
          {aurora && (
            <p className="text-sm">
              A aurora depende de céu limpo, noite escura e atividade do Sol. Não há garantia de ver.
            </p>
          )}
          <p className="text-muted-foreground text-xs">
            Clima típico da época, com base em anos anteriores. Não é previsão do tempo. Fonte: NASA
            POWER, médias de {climatePeriod}.
          </p>
          {!reducedMotion && (
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  savePaused(!paused);
                }}
              >
                {paused ? 'Ligar animação' : 'Pausar animação'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
