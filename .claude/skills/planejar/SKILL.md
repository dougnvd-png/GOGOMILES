---
name: planejar
description: Conversa com a pessoa antes de construir. Use sempre que ela pedir uma tela, função ou regra nova, ou quando a ideia ainda estiver vaga. Faz perguntas, aponta lacunas, propõe opções e registra um plano curto para aprovação.
---

# Planejar

Nenhum código é escrito nesta skill. O objetivo é terminar a conversa com um plano curto que a pessoa entendeu e aprovou.

1. Leia o que já existe: o plano do AI Squad, os planos em `docs/planos/`, as regras do projeto e as telas parecidas. Não pergunte o que já está respondido ali.
2. Entenda o pedido com uma pergunta por vez, em linguagem simples e, quando der, com opções para escolher. Descubra quem vai usar, como a pessoa resolve isso hoje, qual resultado ela espera ver na tela e como vai saber que funcionou. Pare quando as respostas deixarem de mudar o que será construído. Quatro ou cinco perguntas costumam bastar.
3. Procure as lacunas que a pessoa não mencionou e traga só as que importam: quem pode ver ou alterar cada informação, o que acontece com os dados que já existem, o que aparece quando não há nada cadastrado ou quando algo dá errado, e o que depende de conta, chave ou serviço externo.
4. Proponha duas ou três formas de resolver, da mais simples à mais completa. Recomende uma e explique a escolha em termos de tempo, valor para quem usa e risco. Sugira deixar para depois o que não é necessário agora.
5. Escreva o plano em `docs/planos/AAAA-MM-DD-nome-curto.md` com o problema, o que entra, o que fica para depois, as telas e os dados envolvidos, os passos em ordem e como conferir cada um. Mostre um resumo e espere a aprovação antes de construir.

Para um ajuste pequeno e sem risco, como trocar um texto ou uma cor, confirme o entendimento em uma frase e siga direto.
