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
  name: 'Meu projeto',
  tagline: 'Organize o trabalho do dia a dia em um só lugar.',
  contactEmail: '',
  theme: {
    color: '#7c3aed',
    style: 'glass',
    mode: 'dark',
    font: 'modern',
  },
};
