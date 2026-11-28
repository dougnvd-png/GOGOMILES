import type { CSSProperties } from 'react';

import type { Scene } from '@/lib/miles/climate';

/**
 * Paisagens do clima no destino, desenhadas aqui mesmo. As cores ficam em
 * `globals.css` (variáveis `--scene-*`). É só decoração: leitores de tela ignoram.
 */

// Posições calculadas pelo índice, para o servidor e o navegador desenharem igual.
const flakes = Array.from({ length: 28 }, (_, index) => ({
  '--x': `${(index * 61.8) % 100}%`,
  '--size': `${4 + (index % 3) * 2}px`,
  '--duration': `${8 + (index % 5) * 1.6}s`,
  '--delay': `${-((index * 1.37) % 12)}s`,
  '--drift': `${((index % 7) - 3) * 8}px`,
}));

const Cloud = ({ className }: { className: string }) => (
  <svg viewBox="0 0 200 90" className={className}>
    <path d="M40 85a35 35 0 0 1-4-70 45 45 0 0 1 80-6 34 34 0 0 1 48 24 27 27 0 0 1-4 52Z" />
  </svg>
);

const Beach = () => (
  <>
    <path className="climate-sea" d="M0 120H1200V240H0Z" />
    <path
      className="climate-wave"
      d="M0 152q100-16 200 0t200 0t200 0t200 0t200 0t200 0V240H0Z"
    />
    <path className="climate-sand" d="M0 206C250 168 480 236 760 204S1100 178 1200 194V240H0Z" />
    <path className="climate-trunk" d="M1032 212q4-70 34-112l9 5q-28 44-29 108Z" />
    <path
      className="climate-leaves"
      d="M1070 103q-48-30-92 6 48-12 84 6-42 4-58 44 30-32 66-38ZM1070 103q40-36 90-8-50-8-82 12 44 6 54 46-26-34-62-42ZM1070 103q-12-48-60-52 34 16 52 54ZM1070 103q18-46 66-44-36 12-56 48Z"
    />
  </>
);

const Mountains = () => (
  <>
    <path
      className="climate-mountain"
      d="M0 185L180 66L300 142L470 34L650 164L820 74L980 152L1100 88L1200 132V240H0Z"
    />
    <path
      className="climate-snowcap"
      d="M141 92L180 66L221 92L198 88L181 104L164 88ZM425 62L470 34L514 66L490 60L472 80L452 60ZM780 98L820 74L856 98L836 94L821 108L802 94Z"
    />
    <path
      className="climate-pine"
      d="M84 214l22-52l22 52ZM122 220l18-42l18 42ZM1040 214l24-58l24 58ZM1084 220l16-38l16 38Z"
    />
    <path className="climate-snow-ground" d="M0 206C200 176 420 230 640 202S1000 180 1200 204V240H0Z" />
  </>
);

export const ClimateScene = ({
  scene,
  place,
  animate,
}: {
  scene: Scene;
  /** `page` cobre o fundo da tela; `banner` fica no topo do quadro. */
  place: 'page' | 'banner';
  animate: boolean;
}) => (
  <div aria-hidden className="climate-scene" data-scene={scene} data-place={place}>
    {scene === 'sun' && <span className="climate-sun" />}
    {scene === 'rain' && (
      <>
        <Cloud className="climate-cloud left-[6%] top-[3%] w-24" />
        <Cloud className="climate-cloud left-[44%] top-0 w-28" />
        <Cloud className="climate-cloud right-[24%] top-[6%] w-20" />
      </>
    )}
    <svg viewBox="0 0 1200 240" preserveAspectRatio="xMidYMax slice" className="climate-land">
      {scene === 'snow' ? <Mountains /> : <Beach />}
    </svg>
    {scene === 'snow' &&
      animate &&
      flakes.map((style) => (
        <span key={style['--x']} className="climate-flake motion-loop" style={style as CSSProperties} />
      ))}
  </div>
);
