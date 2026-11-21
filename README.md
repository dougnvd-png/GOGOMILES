# Meu projeto

Base de aplicação com página inicial, área logada, tabela de cadastros e configurações. Feita com Next.js, shadcn/ui, Tailwind, Clerk (login), Supabase (banco de dados) com Drizzle e Resend (e-mail).

## Como rodar

1. Instale o Node.js 26 (versão LTS atual).
2. Na pasta do projeto, rode `npm ci` e depois `npm run dev`.
3. Abra o endereço que aparece no terminal, normalmente `http://localhost:3000`.

Sem nenhuma chave configurada, o projeto abre em **modo demonstração**: a página inicial e a área em `/app` funcionam com itens de exemplo guardados na memória. Você pode criar, alterar e excluir à vontade. Os exemplos voltam ao reiniciar.

## Onde personalizar

| Arquivo | O que muda |
| --- | --- |
| `src/config/app.ts` | Nome, frase, e-mail de contato e tema. |
| `src/config/landing.ts` | Todo o texto da página inicial. |
| `src/config/navigation.ts` | Itens do menu da área logada. |

O tema tem quatro escolhas em `src/config/app.ts`:

- `color`: a cor principal, em hexadecimal, como `#7c3aed`.
- `style`: `clean` (superfícies sólidas), `gradient` (degradês da cor nos destaques) ou `glass` (transparência com desfoque).
- `mode`: `light` ou `dark`. É o modo inicial. Cada pessoa pode alternar no botão de sol e lua.
- `font`: `modern` (Geist), `friendly` (Nunito) ou `elegant` (títulos em Playfair Display).

## Estrutura

```
src/
  app/
    (marketing)/         página inicial, em /
    (platform)/app/      área logada, em /app
    entrar/              tela de login
    criar-conta/         tela de cadastro
  components/
    ui/                  componentes shadcn/ui
    charts/              gráficos de área, barras, rosca e mini gráfico
    dashboard/           visão geral: cards de número e variação
    data-table/          tabela com busca, filtros, ordenação e paginação
    marketing/           seções da página inicial
    platform/            menu lateral, cabeçalho e avisos da área logada
    items/               exemplo de cadastro
  config/                nome, tema, textos e menu
  server/
    queries/             leitura de dados
    actions/             ações que criam, alteram ou apagam
    db/                  tabelas e conexão com o banco
  lib/                   validações, cálculos e funções compartilhadas
DESIGN.md                design system: cores, estilos e padrões de tela
```

O cadastro de Itens (`/app/itens`) é o exemplo a copiar para criar os seus próprios cadastros.

## Conectar os serviços

Copie `.env.example` para `.env.local` e preencha conforme os passos abaixo. Reinicie o `npm run dev` depois de cada alteração. A tela `/app/configuracoes` mostra o que já está conectado.

Nunca envie o arquivo `.env.local` para o GitHub nem cole as chaves em conversas.

### 1. Login com Clerk

1. Crie uma conta em [clerk.com](https://clerk.com) e uma aplicação.
2. Em **API Keys**, copie as duas chaves para `.env.local`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. Reinicie o projeto. A área `/app` passa a pedir login, nas telas `/entrar` e `/criar-conta`.

### 2. Banco de dados com Supabase

1. Crie uma conta em [supabase.com](https://supabase.com) e um projeto. Guarde a senha do banco.
2. No projeto, clique em **Connect** e copie a string de conexão **Transaction pooler** (porta 6543).
3. Cole em `DATABASE_URL` no `.env.local`, trocando `[YOUR-PASSWORD]` pela senha do banco.
4. Rode `npm run db:push` para criar as tabelas.
5. Reinicie o projeto. Os itens passam a ficar guardados no seu banco, separados por usuário.

Se o `npm run db:push` não conseguir conectar, use a string **Session pooler** (porta 5432) só para esse comando e volte para a Transaction pooler em seguida.

As tabelas ficam em `src/server/db/schema.ts`. Depois de mudar esse arquivo, rode `npm run db:push` de novo. O comando `npm run db:studio` abre uma tela para ver os dados.

### 3. E-mail com Resend

1. Crie uma conta em [resend.com](https://resend.com) e uma chave em **API Keys**.
2. Cole em `RESEND_API_KEY` no `.env.local`.
3. Para enviar a outras pessoas, verifique um domínio no Resend e preencha `EMAIL_FROM` com um endereço desse domínio. Sem isso, o Resend só entrega para o e-mail da sua própria conta.
4. Reinicie o projeto e use o botão **Enviar e-mail de teste** em `/app/configuracoes`.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Abre o projeto no computador. |
| `npm run check` | Confere o código (lint e tipos). |
| `npm run build` | Confere se o projeto está pronto para publicar. |
| `npm run db:push` | Aplica as tabelas do schema no banco. |
| `npm run db:generate` | Gera arquivos de migração em `drizzle/`. |
| `npm run db:studio` | Abre uma tela para ver os dados do banco. |

## Publicar na Vercel

1. Crie um repositório no seu GitHub e envie o código.
2. Em [vercel.com](https://vercel.com), importe o repositório.
3. Em **Environment Variables**, cadastre as mesmas variáveis do `.env.local`. No Clerk, use as chaves da instância de produção.
4. Publique. Para usar um domínio próprio, siga os registros DNS indicados pela Vercel e pelo Clerk.
5. Anote o endereço do site em `docs/publicacao.md`.

Depois da primeira vez, basta dizer "publicar" ao agente. Ele confere o projeto, aplica as tabelas novas no banco, envia para o GitHub e acompanha a Vercel até a versão nova responder.

- [Conectar um domínio na Vercel](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
- [Colocar o Clerk em produção](https://clerk.com/docs/guides/development/deployment/production)

## Trabalhar com um agente de IA

O projeto traz instruções em `AGENTS.md`, regras em `.agents/rules/` e o design system em `DESIGN.md`. A página `/app/design-system` mostra as cores, a tipografia e os componentes padrão funcionando. As skills `planejar`, `construir`, `testar`, `corrigir`, `publicar` e `retomar` já estão instaladas em `.claude/skills/` e `.agents/skills/`.

## Como gastar menos

O projeto já vem ajustado para a IA gastar menos do seu plano (`.claude/settings.json` e `.codex/config.toml`). No Codex, aceite confiar na pasta do projeto quando ele perguntar. Sem isso, a configuração não vale.

- **Uma conversa por funcionalidade.** Terminou e conferiu? Comece outra: `/clear` no Claude Code, `/new` no Codex.
- **Antes de uma pausa longa, resuma.** Digite `/compact` para a conversa voltar mais leve.
- **Confira o consumo.** `/usage` no Claude Code, `/status` no Codex.
- **Não troque de modelo no meio de uma tarefa.** Termine a tarefa primeiro.
