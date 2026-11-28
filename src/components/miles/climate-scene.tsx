import type { CSSProperties } from 'react';

import type { Land, Sky } from '@/lib/miles/climate';

/**
 * Cenários do clima no destino, desenhados aqui mesmo. Cores e movimentos ficam
 * em `globals.css` (variáveis `--scene-*`). É só decoração: leitores de tela ignoram.
 */

/** `page` cobre o fundo da tela, `front` passa na frente e `banner` abre o quadro. */
type Place = 'page' | 'front' | 'banner';

const flakeCount: Record<Place, number> = { page: 110, front: 36, banner: 64 };
const dropCount: Record<Place, number> = { page: 100, front: 28, banner: 56 };

// Posições calculadas pelo índice, para o servidor e o navegador desenharem igual.
const spread = (count: number, offset: number, seconds: number, step: number) =>
  Array.from({ length: count }, (_, index) => {
    const n = index + offset;
    return {
      key: n,
      // Metade some em telas pequenas.
      extra: index % 2 === 1,
      style: {
        '--x': `${((n * 61.803) % 104).toFixed(2)}%`,
        '--size': `${3 + (n % 4) * 2}px`,
        '--duration': `${(seconds + (n % 7) * step).toFixed(2)}s`,
        '--delay': `${(-((n * 1.37) % (seconds + 6 * step))).toFixed(2)}s`,
        '--drift': `${((n % 9) - 4) * 11}px`,
      } as CSSProperties,
    };
  });

const Particles = ({ sky, place }: { sky: 'snow' | 'rain'; place: Place }) => {
  const offset = { page: 0, front: 211, banner: 97 }[place];
  const items =
    sky === 'snow'
      ? spread(flakeCount[place], offset, 6, 1.4)
      : spread(dropCount[place], offset, 0.7, 0.09);
  return items.map((item) => (
    <span
      key={item.key}
      className={`${sky === 'snow' ? 'climate-flake' : 'climate-drop'}${item.extra ? ' climate-extra' : ''}`}
      style={item.style}
    />
  ));
};

const Cloud = ({ className }: { className: string }) => (
  <svg viewBox="0 0 200 90" className={`climate-cloud ${className}`}>
    <path d="M40 85a35 35 0 0 1-4-70 45 45 0 0 1 80-6 34 34 0 0 1 48 24 27 27 0 0 1-4 52Z" />
  </svg>
);

const Bird = ({ className }: { className: string }) => (
  <svg viewBox="0 0 40 16" className={`climate-bird ${className}`}>
    <path d="M0 12Q10-2 20 10Q30-2 40 12Q30 5 20 15Q10 5 0 12Z" />
  </svg>
);

const clouds: Record<Sky, string[]> = {
  sun: ['left-[12%] top-[12%] w-20 opacity-70'],
  clouds: [
    'left-[4%] top-[6%] w-32',
    'left-[34%] top-[2%] w-24',
    'right-[20%] top-[9%] w-36',
    'left-[62%] top-[26%] w-20 opacity-80',
  ],
  rain: [
    'left-[-2%] top-0 w-40',
    'left-[20%] top-[3%] w-32',
    'left-[42%] top-0 w-44',
    'right-[16%] top-[5%] w-36',
    'right-[-2%] top-0 w-40',
  ],
  snow: ['left-[8%] top-[4%] w-32 opacity-80', 'right-[14%] top-[2%] w-40 opacity-80'],
};

const palm =
  'M1070 103q-48-30-92 6 48-12 84 6-42 4-58 44 30-32 66-38ZM1070 103q40-36 90-8-50-8-82 12 44 6 54 46-26-34-62-42ZM1070 103q-12-48-60-52 34 16 52 54ZM1070 103q18-46 66-44-36 12-56 48Z';

const Palm = () => (
  <g className="climate-palm">
    <path className="climate-trunk" d="M1032 212q4-70 34-112l9 5q-28 44-29 108Z" />
    <path className="climate-leaves" d={palm} />
  </g>
);

// A onda repete a cada 400 unidades, e por isso pode andar sem emenda.
const wave = 'q100-16 200 0t200 0t200 0t200 0t200 0t200 0t200 0t200 0V240H0Z';

const Beach = ({ sky }: { sky: Sky }) => (
  <>
    <path className="climate-sea" d="M0 118H1200V240H0Z" />
    {sky !== 'rain' && (
      <g className="climate-boat">
        <path className="climate-sail" d="M366 92v44h-30ZM371 102l26 34h-26Z" />
        <path className="climate-hull" d="M332 140h72l-13 13h-46Z" />
      </g>
    )}
    <path className="climate-wave-back" d={`M0 146${wave}`} />
    <path className="climate-wave" d={`M0 168${wave}`} />
    <path className="climate-sand" d="M0 206C250 168 480 236 760 204S1100 178 1200 194V240H0Z" />
    <Palm />
    <g transform="translate(-720 40) scale(0.82)">
      <Palm />
    </g>
  </>
);

const farBlocks = [
  [0, 150, 70], [84, 104, 52], [150, 132, 66], [300, 96, 46], [366, 144, 80],
  [520, 112, 58], [640, 90, 40], [700, 138, 74], [850, 108, 60], [960, 148, 70],
  [1060, 92, 44], [1120, 130, 80],
];
const nearBlocks = [
  [30, 176, 70], [132, 150, 56], [236, 184, 80], [420, 164, 60], [570, 152, 54],
  [744, 186, 76], [890, 158, 66], [1020, 178, 56], [1130, 166, 70],
];
const windows = nearBlocks.flatMap(([x, top, width]) =>
  Array.from({ length: Math.floor((width - 10) / 16) }, (_, column) =>
    [0, 1].map((row) => [x + 8 + column * 16, top + 8 + row * 15]),
  ).flat(),
);

const City = () => (
  <>
    {farBlocks.map(([x, top, width]) => (
      <rect key={x} className="climate-city-far" x={x} y={top} width={width} height={240 - top} />
    ))}
    <path className="climate-city-far" d="M222 240V122q28-46 56 0v118ZM248 100h4V72h-4Z" />
    {nearBlocks.map(([x, top, width]) => (
      <rect key={x} className="climate-city" x={x} y={top} width={width} height={240 - top} />
    ))}
    {windows.map(([x, y]) => (
      <rect key={`${x}-${y}`} className="climate-window" x={x} y={y} width="6" height="8" />
    ))}
    <path className="climate-park" d="M0 218C260 204 520 230 800 214S1100 206 1200 216V240H0Z" />
    {[114, 205, 340, 505, 690, 835, 985, 1095].map((x) => (
      <circle key={x} className="climate-pine" cx={x} cy="212" r="13" />
    ))}
  </>
);

const Mountains = ({ sky }: { sky: Sky }) => (
  <>
    <path
      className="climate-mountain-far"
      d="M0 160L110 96L250 150L380 70L560 150L720 52L900 140L1040 66L1200 130V240H0Z"
    />
    <path
      className="climate-mountain"
      d="M0 192L180 78L300 150L470 46L650 172L820 86L980 160L1100 100L1200 142V240H0Z"
    />
    <path
      className="climate-snowcap"
      d="M141 103L180 78L221 103L198 99L181 115L164 99ZM425 74L470 46L514 78L490 72L472 92L452 72ZM780 110L820 86L856 110L836 106L821 120L802 106Z"
    />
    <path
      className="climate-ground"
      d="M0 206C200 176 420 230 640 202S1000 180 1200 204V240H0Z"
    />
    <path
      className="climate-pine"
      d="M62 222l24-58l24 58ZM104 230l20-48l20 48ZM250 226l16-38l16 38ZM1034 220l26-64l26 64ZM1084 228l18-44l18 44ZM1140 224l14-34l14 34Z"
    />
    {sky === 'snow' && (
      <g>
        <path className="climate-trunk" d="M842 190h64v32h-64Z" />
        <path className="climate-snowcap" d="M832 192l42-28l42 28Z" />
        <path className="climate-light" d="M854 200h12v12h-12ZM882 200h12v12h-12Z" />
      </g>
    )}
  </>
);

const stars = Array.from({ length: 46 }, (_, index) => ({
  key: index,
  style: {
    '--x': `${((index * 61.803) % 100).toFixed(2)}%`,
    '--y': `${((index * 23.7) % 62).toFixed(2)}%`,
    '--size': `${1 + (index % 3)}px`,
    '--delay': `${(-((index * 0.83) % 4)).toFixed(2)}s`,
  } as CSSProperties,
}));

const ribbons = [
  {
    name: 'climate-ribbon-c',
    path: 'M-80 120C140 20 330 150 520 80S860-30 1040 60S1230 70 1300 20',
  },
  {
    name: 'climate-ribbon-b',
    path: 'M-80 190C90 250 300 90 500 150S820 250 1000 140S1200 120 1300 170',
  },
  {
    name: 'climate-ribbon-a',
    path: 'M-80 230C120 110 290 260 470 180S760 60 930 170S1170 240 1300 110',
  },
];

/** Cortinas de luz da aurora boreal, com estrelas por trás. */
const Aurora = () => (
  <>
    {stars.map((star) => (
      <span key={star.key} className="climate-star" style={star.style} />
    ))}
    {ribbons.map(({ name, path }) => (
      <span key={name} className={`climate-aurora ${name}`}>
        <svg viewBox="0 0 1200 300" preserveAspectRatio="none">
          <path className="climate-glow" d={path} />
          <path className="climate-streaks" d={path} transform="translate(0 -48)" />
          <path className="climate-core" d={path} />
        </svg>
      </span>
    ))}
  </>
);

export const ClimateScene = ({
  sky,
  land,
  aurora,
  place,
  animate,
}: {
  sky: Sky;
  land: Land;
  aurora: boolean;
  place: Place;
  animate: boolean;
}) => {
  const falling = sky === 'snow' || sky === 'rain' ? sky : null;
  return (
    <div
      aria-hidden
      className="climate-scene"
      data-sky={sky}
      data-aurora={aurora}
      data-place={place}
      data-animate={animate}
    >
      {place !== 'front' && (
        <>
          {aurora && <Aurora />}
          {!aurora && (sky === 'sun' || sky === 'clouds') && (
            <span className="climate-sun">
              <span className="climate-rays" />
              <span className="climate-disc" />
            </span>
          )}
          {!aurora &&
            clouds[sky].map((className) => <Cloud key={className} className={className} />)}
          {!aurora && sky === 'sun' && (
            <>
              <Bird className="left-[18%] top-[22%] w-7" />
              <Bird className="left-[24%] top-[15%] w-5" />
              <Bird className="left-[11%] top-[31%] w-4" />
            </>
          )}
          <svg
            viewBox="0 0 1200 240"
            preserveAspectRatio="xMidYMax slice"
            className="climate-land"
          >
            {land === 'beach' && <Beach sky={sky} />}
            {land === 'city' && <City />}
            {land === 'mountains' && <Mountains sky={sky} />}
          </svg>
        </>
      )}
      {falling && animate && <Particles sky={falling} place={place} />}
    </div>
  );
};
