# Next.js (App Router)

Leia `node_modules/next/dist/docs/` antes de escrever código Next. Esta versão tem mudanças em relação ao que você conhece. Um exemplo: o arquivo de interceptação de requisições se chama `src/proxy.ts`.

## Rotas

- A página pública fica em `src/app/(marketing)` e responde em `/`.
- A área logada fica em `src/app/(platform)/app` e responde em `/app`. Uma tela nova entra como `src/app/(platform)/app/<nome>/page.tsx` e ganha um item em `src/config/navigation.ts`.
- O layout da área logada chama `requireUser()`. Toda tela dentro de `/app` herda essa proteção.
- Use nomes de rota em português, sem acento e em minúsculas: `/app/clientes`, `/app/configuracoes`.
- Mantenha `page.tsx` e `layout.tsx` pequenos: eles buscam os dados e montam componentes. A interface fica em `src/components/<assunto>/`.

## Servidor e navegador

- Páginas e componentes rodam no servidor por padrão. Use `'use client'` só no componente que precisa de estado, efeito ou evento, e mantenha esse componente pequeno.
- Busque dados no servidor, dentro da página, chamando funções de `src/server/queries`.
- Para criar, alterar ou apagar, use uma ação do servidor em `src/server/actions`, criada com `ownerAction`. Ele já atualiza as telas depois de salvar.
- Em componentes do navegador, chame a ação com `useTransition`, mostre o estado de espera no botão e avise o resultado com `toast`.
- Arquivos de `src/server` que não são ações começam com `import 'server-only'`.

## Qualidade

- Defina `metadata` com o título de cada página.
- Use `next/link` para navegar e `next/image` para imagens.
- Não desative checagens do Next, do TypeScript ou do ESLint para fazer o build passar.
