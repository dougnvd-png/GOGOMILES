# Como trabalhar

## Converse antes de construir

A pessoa descreve o que quer do jeito dela, e quase sempre falta alguma coisa. Escrever código em cima de um pedido incompleto gera retrabalho e telas que ninguém pediu. Por isso, toda tela, função ou regra nova começa por uma conversa, com a skill `planejar`.

1. **Entenda.** Uma pergunta por vez, em palavras simples, com opções quando der. Pare quando as respostas deixarem de mudar o que será construído.
2. **Aponte o que falta.** Quem pode ver ou alterar cada informação, o que acontece com os dados que já existem, o que aparece quando não há nada cadastrado ou quando algo dá errado, e o que depende de conta ou serviço externo.
3. **Sugira.** Duas ou três formas de resolver, com uma recomendação e o motivo. Proponha deixar para depois o que não é necessário agora.
4. **Registre.** Um plano curto em `docs/planos/AAAA-MM-DD-nome-curto.md`, com os passos em ordem e como conferir cada um.
5. **Espere o sim.** Só construa depois que a pessoa aprovar o plano.

Quando não souber, pergunte. Não preencha uma lacuna com um palpite sem dizer que é um palpite.

Ajustes pequenos e sem risco, como trocar um texto, uma cor ou a ordem de uma coluna, dispensam o plano: confirme o entendimento em uma frase e faça.

## Conversa

- Responda em português do Brasil, com frases curtas e palavras do dia a dia. Explique um termo técnico na primeira vez em que ele for inevitável.
- Ao terminar, diga o que mudou, em qual endereço a pessoa vê a mudança e o que ficou pendente.
- Quando houver duas opções viáveis, recomende uma e explique o motivo em uma frase. Pergunte só o que muda o resultado.
- Não use travessão nos textos da interface nem na documentação.

## Tamanho das mudanças

- Faça uma mudança pequena por vez, que a pessoa consiga abrir e experimentar.
- Reaproveite o que já existe: componentes de `src/components`, a tabela padrão e os padrões de `src/server`. Copie o exemplo de Itens ao criar um novo cadastro.
- Não instale uma biblioteca nova se o projeto já resolve o problema. Se precisar instalar, diga qual e por quê.
- Não reorganize pastas nem renomeie arquivos sem pedido.

## Antes de dizer que terminou

1. Rode `npm run check` e corrija os erros.
2. Abra a tela alterada com `npm run dev` e experimente o fluxo como a pessoa faria.
3. Confira o claro e o escuro e a largura de celular quando mexer em interface.
4. Informe o que foi testado e o que não foi.

## Limites

- Publicar é um passo separado. Só publique com pedido explícito, seguindo a skill `publicar`.
- Não faça commit nem push sem pedido.
- Não apague dados, tabelas ou arquivos da pessoa sem confirmar antes.
- Se faltar uma chave ou um acesso, explique o que falta e como a pessoa consegue. Não invente valores.
