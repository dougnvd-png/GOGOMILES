# Backend e dados

## Onde fica cada coisa

| Arquivo | Papel |
| --- | --- |
| `src/server/db/schema.ts` | Tabelas do banco, em TypeScript. |
| `src/server/db/index.ts` | Conexão. `getDb()` devolve `null` sem `DATABASE_URL`. |
| `src/server/auth.ts` | `currentUserId()` e `requireUser()`. |
| `src/server/action.ts` | `ownerAction`: o caminho único das ações do servidor. |
| `src/server/queries/items.ts` | Exemplo de consulta (leitura). |
| `src/server/actions/items.ts` | Exemplo de ações (criar, alterar, apagar). |
| `src/server/email.ts` | Envio de e-mail com Resend. |
| `src/server/rate-limit.ts` | Limite simples de tentativas por pessoa. |
| `src/lib/items.ts` | Tipos, rótulos e validações do exemplo. |
| `src/lib/insights.ts` | Cálculos da visão geral, sem acesso a banco. |
| `src/lib/result.ts` | Formato de resposta das ações. |
| `src/lib/env.ts` | Leitura validada das variáveis de ambiente. |

## Banco de dados (Supabase com Drizzle)

- O banco é o Postgres do Supabase. A aplicação conecta pelo servidor com `DATABASE_URL` e usa o Drizzle. Não use o cliente JavaScript do Supabase.
- Para criar ou mudar uma tabela: edite `src/server/db/schema.ts` e rode `npm run db:push`. Leia o aviso do Drizzle antes de confirmar e pare se ele indicar perda de dados.
- Toda tabela tem `id` (uuid), `ownerId` (texto com o id do usuário), `createdAt` e `.enableRLS()`.
- A conexão usa `prepare: false`, exigido pelo pooler do Supabase.
- Limite as listagens (`limit`) e ordene de forma explícita.

## Consultas e ações

Leitura e escrita ficam em arquivos separados. Siga o exemplo de itens em cada novo assunto:

1. Tipos, rótulos e schemas zod em `src/lib/<assunto>.ts`.
2. Leitura em `src/server/queries/<assunto>.ts`: começa com `import 'server-only'`, usa `cache` do React, chama `currentUserId()` e filtra por `ownerId`. Limite e ordene a listagem.
3. Escrita em `src/server/actions/<assunto>.ts`, com `'use server'` no topo. Cada ação é `ownerAction(schema, handler)`. O handler recebe a entrada já validada e o `ownerId`, e todo `update` e `delete` filtra pelo id do registro e pelo `ownerId` juntos.
4. A ação devolve `succeeded('...')` ou `failed('...')`, de `src/lib/result.ts`, com texto em português. Erro inesperado vira mensagem genérica dentro do `ownerAction`.
5. O `ownerAction` já atualiza as telas depois de uma ação bem-sucedida. Não chame `revalidatePath` de novo.
6. Não coloque consulta em arquivo com `'use server'`: toda função exportada ali vira um endereço que o navegador pode chamar.

## Modo demonstração

- Sem `DATABASE_URL`, os dados ficam na memória (`src/server/demo-store.ts`) para a pessoa experimentar antes de configurar serviços. Sem as chaves do Clerk, a área `/app` abre sem login.
- Um cadastro novo só precisa de dados de demonstração se a pessoa ainda não conectou o banco. Depois de conectar, não crie novos caminhos em memória.

## E-mail

- Envie por `sendEmail` de `src/server/email.ts`. Sem `RESEND_API_KEY` a função não envia e informa o motivo.
- Monte o HTML com `messageEmail` ou com uma função parecida que escape os valores.
- Só envie para pessoas reais com pedido da dona ou do dono do projeto.

## Login

- O login é do Clerk. Use `currentUserId()` no servidor. Não crie tabela de senhas.
- As telas de login ficam em `/entrar` e `/criar-conta`.
