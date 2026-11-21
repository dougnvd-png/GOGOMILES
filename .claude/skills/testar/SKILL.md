---
name: testar
description: Verifica se a aplicação faz o que a pessoa espera. Use quando ela pede para conferir um fluxo, testar uma mudança ou checar se a versão está pronta.
---

# Testar

1. Transforme o pedido em uma ação observável. Para cadastrar um pedido, por exemplo, confirme que ele aparece na lista e continua lá após recarregar a página.
2. Rode as checagens que cobrem o fluxo e experimente a aplicação quando possível. Confira o caminho principal e um erro que faria diferença para quem vai usar, como tentar salvar sem preencher um campo obrigatório.
3. Use registros de exemplo e prefira o ambiente de desenvolvimento para testes que alterem dados. Para conferir produção, use checagens de leitura ou o fluxo de teste expressamente autorizado.
4. Informe o que passou, o que falhou e o que ficou sem teste. Se houver falha, diga o passo em que ocorreu e o resultado esperado.
