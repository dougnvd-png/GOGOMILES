# Instruções para agentes

Este projeto é de uma pessoa que não programa. Você constrói, ela decide. Fale em português simples, sem jargão, e diga sempre o que mudou e onde ver.

Antes de alterar qualquer arquivo, leia as regras em `.agents/rules/` e, para qualquer trabalho de interface, o `DESIGN.md`:

- `como-trabalhar.md`: como conversar, tamanho das mudanças e o que conferir antes de dizer que terminou.
- `seguranca.md`: segredos, acesso aos dados e ações que pedem confirmação.
- `nextjs.md`: organização das rotas e o que roda no servidor ou no navegador.
- `typescript-react.md`: estilo de código e de componentes.
- `backend-e-dados.md`: banco de dados com Drizzle, ações do servidor e e-mail.
- `interface.md`: componentes, tema, tabela padrão e acessibilidade.
- `DESIGN.md` (na raiz): o design system. Tokens, estilos, padrões de página e o que evitar.

Estas regras valem mais do que hábitos genéricos de framework.

## Converse antes de construir

Um pedido novo começa por entender o problema, não por escrever código. Siga `.agents/rules/como-trabalhar.md` e use a skill `planejar`: faça as perguntas que faltam, aponte o que pode dar errado, sugira o caminho mais simples e só construa depois que a pessoa concordar com o plano.

## Esta versão do Next.js é nova

As APIs, convenções e a estrutura de pastas podem ser diferentes do que você conhece. Leia o guia correspondente em `node_modules/next/dist/docs/` antes de escrever código Next. O mesmo vale para Clerk, Drizzle e TanStack Table: confira os tipos e a documentação dentro de `node_modules` antes de usar uma API de memória.

## Mapa do projeto

| Onde | O que fica |
| --- | --- |
| `src/config/app.ts` | Nome, frase, e-mail de contato e tema (cor, estilo, modo e fonte). |
| `src/config/landing.ts` | Todo o texto da página inicial. |
| `src/config/navigation.ts` | Itens do menu da área logada. |
| `src/app/(marketing)` | Página inicial pública, em `/`. |
| `src/app/(platform)/app` | Área logada, em `/app`. |
| `src/app/icon.tsx` e `opengraph-image.tsx` | Ícone da aba e imagem de compartilhamento, gerados do nome e da cor. |
| `src/components/ui` | Componentes shadcn/ui. |
| `src/components/data-table` | Tabela padrão com busca, filtros, ordenação e paginação. |
| `src/components/motion` | Movimento da página inicial: revelação ao rolar e luz do cursor. |
| `src/components/charts` | Gráficos padrão: área, barras, rosca e mini gráfico. |
| `src/components/dashboard` | Visão geral: cards de número e variação. |
| `src/server/queries` | Leitura de dados. |
| `src/server/actions` | Ações que criam, alteram ou apagam. |
| `src/server` | Banco, login, e-mail e o caminho único das ações. |
| `src/lib` | Validações, tipos, cálculos e funções compartilhadas. |
| `DESIGN.md` | Design system do projeto: identidade, tokens e padrões de página. |
| `src/app/(platform)/app/design-system` | Página viva do design system, em `/app/design-system`. |

## Skills

O projeto traz seis skills em `.claude/skills/` e `.agents/skills/`: `planejar`, `construir`, `testar`, `corrigir`, `publicar` e `retomar`. Use a que corresponde ao pedido da pessoa.

## Comandos

- `npm run dev`: abre o projeto no computador.
- `npm run check`: confere o código (lint e tipos). Rode antes de dizer que terminou.
- `npm run build`: confere se o projeto está pronto para publicar.
- `npm run db:push`: aplica as tabelas de `src/server/db/schema.ts` no banco.

## Economia de contexto

- Leia só os arquivos necessários para a tarefa. Procure pelo nome ou por um trecho antes de abrir um arquivo inteiro.
- Não abra `package-lock.json`, `.next/` nem pastas inteiras de `node_modules/`. Em `node_modules/next/dist/docs/`, abra apenas a página que responde à dúvida.
- Ao rodar um comando, traga para a conversa só o trecho que importa: o erro e as linhas ao redor.
- Responda de forma curta. Em vez de repetir arquivos inteiros, cite o caminho e o que mudou.
- Trabalhe em uma funcionalidade por vez. Rode `npm run check` e `npm run build` ao concluir a funcionalidade, não a cada edição pequena.
- Ao concluir e validar uma funcionalidade, sugira começar uma conversa nova (`/clear` no Claude Code, `/new` no Codex) e entregue um resumo de três linhas para a pessoa colar nela.
