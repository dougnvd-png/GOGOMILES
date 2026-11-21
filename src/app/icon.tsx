import { ImageResponse } from 'next/og';

import { brandImageBackground, brandInitial } from '@/lib/brand-image';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** Ícone da aba do navegador: a inicial do projeto sobre a cor da marca. */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        background: brandImageBackground,
        color: '#ffffff',
        fontSize: 40,
        fontWeight: 700,
      }}
    >
      {brandInitial}
    </div>,
    size,
  );
}
