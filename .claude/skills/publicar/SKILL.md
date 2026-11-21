---
name: publicar
description: Confere o projeto, aplica as tabelas no banco, envia para o GitHub e acompanha a Vercel até a versão nova responder. Use quando a pessoa pede para publicar, colocar no ar ou fazer deploy.
---

# Publicar

O pedido "publicar" já é a confirmação. Faça todos os passos em sequência, sem pedir cliques nem novas confirmações. Só pare nos casos de "Quando parar".

## Como este projeto vai ao ar

- O código fica no GitHub, na branch `main`. A Vercel publica sozinha cada envio para `main`.
- O banco é um só: o `DATABASE_URL` do `.env.local` é o mesmo cadastrado na Vercel. Tabela aplicada com `npm run db:push` já vale para o site no ar, então o banco é atualizado antes do envio do código.
- O endereço do site fica anotado em `docs/publicacao.md`.

## Passos

1. **Veja o estado.** Rode `git status`, `git remote -v` e `git branch --show-current`. Sem repositório no GitHub ou sem `docs/publicacao.md`, siga "Primeira publicação".
2. **Confira o código.** Rode `npm run check` e `npm run build`. Corrija o que falhar e rode de novo.
3. **Confira a segurança.** Siga a lista "Antes de publicar" de `.agents/rules/seguranca.md`. Confirme que `git status` não mostra `.env.local` nem arquivo com chave.
4. **Atualize o banco.** Com `DATABASE_URL` no `.env.local`, rode `npm run db:push`. Mudança que só cria tabela ou coluna segue direto. Se o comando não conectar, use a string **Session pooler** (porta 5432) só para ele, como explica o `README.md`.
5. **Envie o código.** Junte o trabalho em `main` (se estiver em outra branch, faça o merge), crie um commit com uma frase curta em português sobre o que mudou e rode `git push origin main`.
6. **Acompanhe a Vercel.** Com o `gh` disponível, consulte a publicação do commit enviado em `gh api "repos/{owner}/{repo}/deployments?per_page=1"` e nos `statuses` dela, até aparecer `success` ou `failure`. Sem o `gh`, espere cerca de dois minutos e confira o endereço de `docs/publicacao.md` até a mudança aparecer.
7. **Confira no ar.** Abra o endereço do site, veja se a página inicial responde e se a mudança publicada aparece. Só diga "publicado" depois disso. Informe o link, o que conferiu e o que ainda depende da pessoa.

## Quando parar

Pare, explique em uma frase e espere a resposta da pessoa quando:

- o `npm run db:push` avisar que vai apagar tabela, coluna ou dados, ou pedir uma escolha;
- a mudança usar uma variável de ambiente nova, que precisa ser cadastrada na Vercel antes de publicar;
- o envio ao GitHub pedir login ou for recusado;
- a publicação na Vercel falhar: leia o erro, corrija se estiver no código e publique de novo; se for configuração da Vercel, diga o que a pessoa precisa ajustar;
- o login ainda não estiver conectado e a área `/app` for ficar aberta para qualquer pessoa.

## Primeira publicação

Feita uma única vez, com a pessoa ao lado, seguindo "Publicar na Vercel" no `README.md`:

1. Criar o repositório privado no GitHub e enviar o código para `main`.
2. Importar o repositório na Vercel e cadastrar as variáveis do `.env.local`, com as chaves de produção do Clerk.
3. Anotar o endereço do site em `docs/publicacao.md`.

Depois disso, cada "publicar" segue os passos acima sem nenhum clique.
