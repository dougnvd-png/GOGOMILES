# Interface

Leia `DESIGN.md`, na raiz do projeto, antes de criar ou alterar qualquer tela. Ele define os tokens, os padrões de página e o que evitar. Se a tela pedir algo que não está lá, acrescente ao design system e atualize o `DESIGN.md` no mesmo trabalho.

## Componentes

- Use os componentes de `src/components/ui` (shadcn/ui). Para um componente que ainda não existe, adicione com `npx shadcn@latest add <nome>` e confira se os imports usam `@/lib/utils`.
- Componha os componentes existentes em vez de criar variações parecidas.
- Ícones vêm de `lucide-react`.
- Classes condicionais usam `cn()` de `src/lib/utils.ts`.

## Tema

- A cor, o estilo, o modo e a fonte vêm de `src/config/app.ts`. Não fixe cores em hexadecimal nos componentes.
- Use os tokens do tema: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `bg-brand-soft`, `text-brand-ink`, `text-success`, `text-warning`, `text-destructive`, `text-status-open`, `text-status-progress`, `text-status-done`.
- Agrupe conteúdo em `Card` ou em um elemento com a classe `surface`. Os dois já recebem borda, sombra e o tratamento de cada estilo.
- Para um destaque com a cor do projeto, use a classe `brand-surface` (fundo) ou `brand-text` (texto). Elas já se adaptam aos estilos `clean`, `gradient` e `glass`. Use `brand-glow` em um elemento por bloco, no máximo.
- Toda tela precisa funcionar no modo claro e no escuro.
- Títulos usam `h1`, `h2` e `h3`, que já recebem a fonte de títulos do tema.

## Tabelas

- Toda listagem usa a tabela padrão de `src/components/data-table`, com o hook `useDataTable`. O exemplo é `src/components/items/items-table.tsx`.
- Cada coluna declara em `meta` o `label` e, quando filtrável, o `variant`: `text` cria a busca e `select` cria um filtro com `options`.
- Use `DataTableColumnHeader` no cabeçalho para a coluna poder ser ordenada.
- Ações da linha ficam em uma coluna `actions`, com um menu.

## Páginas da área logada

- Comece cada página com `PageHeader` (rótulo, título, descrição e ação principal).
- Números de resumo usam `MetricCard`, com `Trend` para a variação. Calcule o valor em `src/lib/insights.ts`, nunca dentro do componente.
- Gráficos usam os componentes de `src/components/charts` (`AreaChart`, `BarChart`, `DonutChart`, `Sparkline`) com as cores de `chartColors`.
- Organize os cards em uma grade de 12 colunas (`lg:grid-cols-12`), como em `src/components/dashboard/overview.tsx`.
- Lista vazia usa `EmptyState`. Tela nova com busca de dados ganha `loading.tsx`.
- Confirme exclusões com `AlertDialog`.
- Avise o resultado de cada ação com `toast`.

## Página inicial

- Todo o texto vem de `src/config/landing.ts`. Para mudar a mensagem, edite esse arquivo, não os componentes.
- As seções de planos e de depoimentos só aparecem quando as listas têm conteúdo. Preencha depoimentos somente com falas reais, autorizadas por quem disse.
- A prévia do painel usa os componentes reais com itens de exemplo. Depois de mudar a visão geral, confira a prévia na página inicial.
- Escreva para o cliente do negócio: o problema que resolve, o benefício e o próximo passo. Sem promessas que o sistema não cumpre e sem números inventados.

## Acessibilidade e texto

- Mire em WCAG 2.1 AA: contraste, foco visível, uso por teclado e rótulos em todos os campos.
- Botões só com ícone têm `aria-label`.
- Layout pensado primeiro para celular. Nada pode gerar rolagem horizontal na página.
- Textos curtos, em português do Brasil, falando com a pessoa. Mensagens de erro dizem o que fazer.
- Estados de carregamento e de lista vazia sempre têm um texto.
