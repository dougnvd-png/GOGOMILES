# GO GO MILES: primeira versão

Plano fechado na reunião com o AI Squad e aprovado pela dona ou dono do projeto.

## O que é

Sistema para encontrar e organizar oportunidades de passagens aéreas baratas em milhas. Quem usa: a dona ou o dono, a equipe e os clientes. Cada cliente vê apenas os seus dados, buscas e informações.

## Primeira versão: busca de viagens em promoção

- Cadastro de **ofertas** (`/app/ofertas`): origem, destino, programa de milhas, cabine, ida e volta, milhas, taxas, link para resgatar e observações.
- Situações: Nova, Em análise e Emitida.
- Tabela com busca por rota, filtros por programa, cabine e situação, ordenação e paginação.
- Visão geral com números do período, movimento por dia, situação, ofertas por programa e próximas viagens.
- Página inicial com o texto do negócio.

## Visual

Nome GO GO MILES, cor `#0401d0`, estilo degradê, modo claro, fonte moderna. A logomarca `GO GO MILES LOGO.png` vai em `public/` quando for enviada.

## Login e dados (próximos passos)

1. Clerk (login) e Supabase (banco), seguindo o README, chaves só em `.env.local`.
2. `npm run db:push` e conferência de que as ofertas continuam após recarregar.
3. Teste com dois usuários: cada um vê só as suas ofertas (já filtrado por `ownerId`).

## Para depois

- Resend (e-mails) e as demais integrações: WhatsApp, agenda e sites das companhias.
- Ideias escolhidas na reunião, uma de cada vez: destacar voos abaixo do preço habitual em milhas, testar uma fonte autorizada de ofertas, compartilhar achados pelo WhatsApp.
