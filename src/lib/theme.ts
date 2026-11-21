import type { CSSProperties } from 'react';

import { appConfig } from '@/config/app';

const fallbackColor = '#7c3aed';
const lightBackground = '#f6f7fb';
const darkBackground = '#06070b';

type Rgb = [number, number, number];

const toRgb = (hex: string): Rgb => [
  Number.parseInt(hex.slice(1, 3), 16),
  Number.parseInt(hex.slice(3, 5), 16),
  Number.parseInt(hex.slice(5, 7), 16),
];

const toHex = (rgb: Rgb) =>
  `#${rgb.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;

const luminance = (rgb: Rgb) => {
  const [r, g, b] = rgb.map((value) => {
    const channel = value / 255;
    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (first: Rgb, second: Rgb) => {
  const [lighter, darker] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
};

const mix = (from: Rgb, to: Rgb, amount: number): Rgb => [
  from[0] + (to[0] - from[0]) * amount,
  from[1] + (to[1] - from[1]) * amount,
  from[2] + (to[2] - from[2]) * amount,
];

const ensureContrast = (color: Rgb, against: Rgb, toward: Rgb, ratio: number) => {
  for (let step = 0; step <= 20; step += 1) {
    const candidate = mix(color, toward, step / 20);
    if (contrast(candidate, against) >= ratio) {
      return candidate;
    }
  }
  return toward;
};

const readableOn = (color: Rgb) =>
  contrast(color, [255, 255, 255]) >= contrast(color, [17, 24, 39])
    ? '#ffffff'
    : '#111827';

export const brandColor = /^#[0-9a-fA-F]{6}$/.test(appConfig.theme.color)
  ? appConfig.theme.color
  : fallbackColor;

export const buildThemeVariables = () => {
  const brand = toRgb(brandColor);
  const white: Rgb = [255, 255, 255];
  const black: Rgb = [0, 0, 0];
  const primaryDark = ensureContrast(brand, toRgb(darkBackground), white, 3);

  return {
    '--brand': brandColor,
    '--brand-primary-light': brandColor,
    '--brand-on-primary-light': readableOn(brand),
    '--brand-ink-light': toHex(
      ensureContrast(brand, toRgb(lightBackground), black, 4.5),
    ),
    '--brand-primary-dark': toHex(primaryDark),
    '--brand-on-primary-dark': readableOn(primaryDark),
    '--brand-ink-dark': toHex(
      ensureContrast(brand, toRgb(darkBackground), white, 6),
    ),
  } as CSSProperties;
};

export const themeStyleLabels = {
  clean: 'Limpo',
  gradient: 'Degradê',
  glass: 'Vidro',
} as const;

export const themeModeLabels = { light: 'Claro', dark: 'Escuro' } as const;

export const themeFontLabels = {
  modern: 'Moderna',
  friendly: 'Amigável',
  elegant: 'Elegante',
} as const;
