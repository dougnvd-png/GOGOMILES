import { ImageResponse } from 'next/og';

import { appConfig } from '@/config/app';
import { brandImageBackground, brandInitial } from '@/lib/brand-image';

export const alt = appConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Imagem que aparece quando o link do projeto é compartilhado. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: brandImageBackground,
        color: '#ffffff',
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 28,
          background: 'rgba(255, 255, 255, 0.16)',
          fontSize: 56,
          fontWeight: 700,
        }}
      >
        {brandInitial}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>
          {appConfig.name}
        </div>
        <div style={{ fontSize: 36, opacity: 0.82, lineHeight: 1.3 }}>
          {appConfig.tagline}
        </div>
      </div>
    </div>,
    size,
  );
}
