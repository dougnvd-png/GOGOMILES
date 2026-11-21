# Segurança

## Segredos

- Chaves e senhas ficam somente em `.env.local`, no computador, e nas variáveis de ambiente da hospedagem. Nunca em código, README, commit, issue ou mensagem.
- `.env.local` não vai para o Git. Mantenha `.env.example` com os nomes das variáveis e sem valores.
- Só use o prefixo `NEXT_PUBLIC_` em valores que podem aparecer no navegador. `DATABASE_URL`, `CLERK_SECRET_KEY` e `RESEND_API_KEY` nunca recebem esse prefixo.
- Leia variáveis de ambiente por `src/lib/env.ts`. Não importe esse arquivo em componentes com `'use client'`.
- Não peça para a pessoa colar chaves na conversa. Oriente a colocar o valor em `.env.local`.
- Não escreva chaves, tokens ou senhas em logs.

## Arquivo de chaves

- Quando a pessoa falar em "arquivo de chaves" ou "arquivo de chaves locais", ela está falando do `.env.local`.
- Se pedir para abrir, crie o arquivo a partir de `.env.example` caso ainda não exista e abra no editor de texto do computador. Diga em qual linha colar cada valor.
- Para abrir, use `open -t .env.local` no macOS e `notepad .env.local` no Windows. Se o comando for bloqueado, peça a permissão para rodar fora da área restrita e tente de novo.
- Nunca peça o valor na conversa nem mostre o conteúdo do arquivo.
- Quando a pessoa disser que salvou, reinicie o projeto e confira em `/app/configuracoes`.

## Acesso aos dados

- Toda ação do servidor é criada com `ownerAction` (`src/server/action.ts`). Ele exige usuário, valida a entrada com zod e entrega o id do dono. Não escreva uma ação sem ele.
- Toda consulta em `src/server/queries` começa por `currentUserId()` e filtra pelo dono do registro (`ownerId`). Nunca confie em um id de usuário enviado pelo navegador.
- Ao alterar ou apagar, o filtro leva o id do registro e o `ownerId` juntos.
- Toda tabela nova usa `.enableRLS()` no schema do Drizzle. Isso fecha a API pública do Supabase. A aplicação acessa o banco pelo servidor, com `DATABASE_URL`.
- Se o projeto precisar de perfis diferentes (por exemplo, gerente vê tudo), implemente a regra em `src/server` e explique para a pessoa quem vê o quê antes de aplicar.

## Entrada de dados

- Valide no servidor, com zod, tudo o que chega do navegador: formulários, parâmetros de URL e corpo de requisições. A validação no navegador é só conveniência.
- Use schemas estritos e limite o tamanho dos textos.
- Não monte SQL concatenando texto. Use o Drizzle.
- Não use `dangerouslySetInnerHTML` com conteúdo vindo de pessoas.
- Ao montar e-mails, escape os valores vindos de pessoas, como em `src/server/email.ts`.

## Privacidade

- Não registre dados pessoais em logs (nome, e-mail, telefone, documentos).
- Guarde somente os dados de que a função precisa.
- Mensagens de erro para a pessoa são simples e não revelam detalhes internos.

## Cabeçalhos e abuso

- `next.config.ts` envia os cabeçalhos de segurança em todas as respostas. Não remova nenhum. A política de conteúdo ainda não restringe scripts: o motivo e o próximo passo estão no comentário do arquivo.
- Ação que envia e-mail, mensagem ou chama serviço pago passa por `allowAttempt` (`src/server/rate-limit.ts`). O limite é por processo: serve contra repetição e abuso leve, não substitui a proteção da hospedagem.
- Parâmetros de URL são entrada de pessoas. Limite o tamanho e use somente como texto, como em `src/app/(platform)/app/itens/page.tsx`.

## Antes de publicar

Confira cada item e diga à pessoa o resultado:

1. `npm run check` e `npm run build` passam.
2. `git status` não mostra `.env.local` nem outro arquivo com chave. Procure por chaves no código com uma busca por `sk_`, `re_` e `postgres://`.
3. Nenhuma variável secreta usa o prefixo `NEXT_PUBLIC_`.
4. O login está conectado. Sem as chaves do Clerk, a área `/app` fica aberta para qualquer pessoa.
5. Toda tabela do schema tem `.enableRLS()` e toda consulta filtra por `ownerId`.
6. Com dois usuários diferentes, um não vê nem altera os registros do outro.
7. As variáveis de ambiente estão cadastradas na hospedagem, com as chaves de produção do Clerk.
8. A página inicial não promete o que o sistema ainda não faz e não tem número ou depoimento inventado.

## Ações que pedem confirmação

Pergunte antes de:

- apagar registros, tabelas ou colunas;
- rodar `npm run db:push` quando o Drizzle avisar que haverá perda de dados;
- trocar chaves, domínio ou configurações do Clerk, Supabase, Resend ou da hospedagem;
- enviar e-mail para pessoas reais;
- publicar sem pedido. Quando a pessoa pede para publicar, o pedido já é a confirmação: siga a skill `publicar` até o fim.
