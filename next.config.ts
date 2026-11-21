import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

/*
  Cabeçalhos de segurança enviados em todas as respostas.
  A política de conteúdo (CSP) limita enquadramento, <base> e plugins.
  Ela não restringe scripts porque o Clerk carrega o próprio script de um
  domínio que muda por projeto e o Next usa scripts embutidos; restringir
  isso exige nonce por requisição. Faça esse passo depois de conectar o
  Clerk, seguindo a documentação de CSP do Clerk e do Next.
*/
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
  {
    key: 'Content-Security-Policy',
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'",
  },
  ...(isProduction
    ? [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains',
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  devIndicators: { position: 'bottom-right' },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
