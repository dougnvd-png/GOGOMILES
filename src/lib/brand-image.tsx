import { appConfig } from '@/config/app';
import { brandColor } from '@/lib/theme';

/** Fundo das imagens geradas (ícone da aba e imagem de compartilhamento). */
export const brandImageBackground = `linear-gradient(135deg, ${brandColor}, #0b0c12)`;

export const brandInitial = appConfig.name.trim().charAt(0).toUpperCase() || 'M';
