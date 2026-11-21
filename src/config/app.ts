export type ThemeStyle = 'clean' | 'gradient' | 'glass';
export type ThemeMode = 'light' | 'dark';
export type ThemeFont = 'modern' | 'friendly' | 'elegant';

interface AppConfig {
  name: string;
  tagline: string;
  contactEmail: string;
  theme: {
    color: string;
    style: ThemeStyle;
    mode: ThemeMode;
    font: ThemeFont;
  };
}

export const appConfig: AppConfig = {
  name: 'GO GO MILES',
  tagline: 'Encontre voos baratos em milhas antes que a oportunidade acabe.',
  contactEmail: '',
  theme: {
    color: '#0401d0',
    style: 'gradient',
    mode: 'light',
    font: 'modern',
  },
};
