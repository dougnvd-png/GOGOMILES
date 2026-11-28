'use client';

import { useSyncExternalStore } from 'react';
import { CloudRain, Snowflake, Sun, Thermometer } from 'lucide-react';

import { Tag } from '@/components/miles/bits';
import { ClimateScene } from '@/components/miles/climate-scene';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { climatePeriod, monthNames, weatherFor } from '@/lib/miles/climate';
import { cityName } from '@/lib/miles/radar';
import { useReducedMotion } from '@/lib/use-reduced-motion';
import { cn } from '@/lib/utils';

// Preferência guardada só neste navegador. Sem armazenamento, vale até recarregar.
const storageKey = 'gogomiles:neve';
const listeners = new Set<() => void>();
let remembered = false;

const readPaused = () => {
  try {
    return window.localStorage.getItem(storageKey) === 'parada';
  } catch {
    return remembered;
  }
};

const savePaused = (paused: boolean) => {
  remembered = paused;
  try {
    window.localStorage.setItem(storageKey, paused ? 'parada' : 'caindo');
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

const icons = { snow: Snowflake, sun: Sun, rain: CloudRain };

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
  const { scene } = weather;
  const Icon = scene ? icons[scene] : Thermometer;
  const animate = !paused && !reducedMotion;
  const city = cityName(code).replace(/ \([A-Z]{3}\)$/, '');

  return (
    <>
      {scene && <ClimateScene scene={scene} place="page" animate={animate} />}
      <Card className={cn('overflow-hidden', scene && 'pt-0')}>
        {scene && (
          <div className="relative h-36">
            <ClimateScene scene={scene} place="banner" animate={animate} />
          </div>
        )}
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="text-brand-ink size-4 shrink-0" aria-hidden />
            {city} em {monthNames[month - 1]}: clima típico
          </CardTitle>
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
                Chance de {scene === 'snow' ? 'chuva ou neve' : 'chuva'}
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
          <p className="text-muted-foreground text-xs">
            Clima típico da época, com base em anos anteriores. Não é previsão do tempo. Fonte: NASA
            POWER, médias de {climatePeriod}.
          </p>
          {scene === 'snow' && !reducedMotion && (
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  savePaused(!paused);
                }}
              >
                {paused ? 'Ligar a neve caindo' : 'Desligar a neve caindo'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
