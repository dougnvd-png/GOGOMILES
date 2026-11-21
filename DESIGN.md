# Design system

Este documento descreve a aparência do projeto e como mantê-la ao criar telas novas. Vale para pessoas e para agentes. Tudo aqui corresponde ao que está em `src/app/globals.css`, `src/lib/theme.ts` e nos componentes.

Leia antes de qualquer trabalho de interface. Se uma tela nova precisar de algo que não está aqui, acrescente ao sistema (token ou componente) e atualize este arquivo no mesmo trabalho.

## Identidade deste projeto

Preencha esta seção ao montar o projeto e mantenha atualizada. Os quatro últimos campos repetem o tema de `src/config/app.ts`.

| Campo | Valor |
| --- | --- |
| Nome | Meu projeto |
| Para quem é | A definir |
| Tom de voz | Direto, próximo e sem jargão |
| Cor | `#7c3aed` |
| Estilo | Vidro (`glass`) |
| Modo inicial | Escuro (`dark`) |
| Fonte | Moderna (`modern`) |

A página `/app/design-system` mostra tudo isto funcionando: cores, tipografia, botões, selos, campos, superfícies, gráficos e estados. Ao criar um componente padrão novo, acrescente um exemplo lá no mesmo trabalho.

## Princípios

1. **Uma cor, muitas superfícies.** A identidade vem de uma única cor (`theme.color`). O resto é neutro, levemente tingido por ela. Cor forte só aparece em ação principal, item ativo e dado em destaque.
2. **Profundidade por camadas.** Fundo, luz ambiente, superfície e conteúdo. A hierarquia vem de borda fina, sombra difusa e transparência, não de caixas pesadas.
3. **Números legíveis.** Todo número que muda usa algarismos tabulares e vem de um cálculo, nunca de um valor fixo no componente.
4. **Calmo por padrão.** Brilho e degradê são reservados a poucos pontos por tela. Movimento é curto e some para quem pede menos movimento.
5. **Claro e escuro no mesmo nível.** Cada modo tem valores próprios. O claro não é o escuro invertido.

## Tema

O tema fica em `src/config/app.ts`:

| Campo | Valores | Efeito |
| --- | --- | --- |
| `color` | hexadecimal de 6 dígitos | Cor da marca. Valor inválido cai em `#7c3aed`. |
| `style` | `clean`, `gradient`, `glass` | Tratamento das superfícies e dos destaques. |
| `mode` | `light`, `dark` | Modo inicial. Cada pessoa pode alternar. |
| `font` | `modern`, `friendly`, `elegant` | Família tipográfica. |

`src/app/layout.tsx` aplica `data-style` e `data-font` no `<html>` e injeta as variáveis de cor calculadas por `buildThemeVariables()`.

### Como a cor é derivada

`src/lib/theme.ts` calcula, a partir de `color`:

- `--brand`: a cor como foi escolhida. Tinge fundos e bordas.
- `--primary`: cor de preenchimento. No claro é a própria cor. No escuro ela é clareada até ter contraste 3:1 com o fundo.
- `--primary-foreground`: branco ou quase preto, o que tiver mais contraste sobre `--primary`.
- `--brand-ink`: versão da cor para texto e ícones, ajustada para 4,5:1 no claro e 6:1 no escuro.

`globals.css` deriva o restante:

- `--brand-accent`: a cor com o matiz girado 40 graus. Segunda ponta dos degradês.
- `--brand-soft`: a cor a 11% (claro) ou 16% (escuro). Fundo de selos e de ícones.
- `--brand-gradient`: sólido no `clean`, `--primary` para `--brand-accent` no `gradient` e no `glass`.
- `--chart-1`, `--chart-2`, `--chart-3`: cor, matiz +40 e matiz -40.

Nunca escreva uma cor em hexadecimal dentro de um componente. Use os tokens.

## Tokens

### Cores

| Token (classe Tailwind) | Uso |
| --- | --- |
| `bg-background`, `text-foreground` | Fundo da página e texto principal. |
| `bg-card` | Superfícies: cards, painéis, menu lateral. |
| `bg-popover` | Menus, seletores e diálogos. |
| `bg-muted`, `text-muted-foreground` | Áreas de apoio e texto secundário. |
| `border-border`, `border-input` | Bordas de superfície e de campo. |
| `bg-primary`, `text-primary-foreground` | Ação principal. |
| `text-brand-ink`, `bg-brand-soft` | Ícones, rótulos e selos com a cor da marca. |
| `text-success`, `text-warning`, `text-destructive` | Resultado bom, atenção e erro. |
| `text-status-open`, `text-status-progress`, `text-status-done` | Situação de um registro, em selos e gráficos. |
| `text-chart-1`, `text-chart-2`, `text-chart-3` | Séries de gráfico. |

### Superfícies, sombra e brilho

| Token | Valor resumido |
| --- | --- |
| `--surface-shadow` (`shadow-surface`) | Sombra difusa e baixa. No escuro, mais profunda. |
| `--surface-highlight` | Luz fina no topo de cada superfície. |
| `--surface-blur` | Desfoque de fundo. Só existe no estilo `glass`. |
| `--glow` (`shadow-glow`) | Contorno e halo com a cor da marca, para o elemento ativo. |
| `--ambient-1`, `-2`, `-3` | Manchas de luz atrás do conteúdo. Intensidade varia por estilo e modo. |

Todo `Card`, o menu lateral e qualquer elemento com a classe `surface` recebem borda, sombra, luz de topo e desfoque automaticamente. Para um painel que não seja `Card`, use a classe `surface`.

### Raios

`--radius` é 14px. Dele saem `rounded-sm` (8px), `rounded-md` (10px), `rounded-lg` (14px), `rounded-xl` (18px) e `rounded-2xl` (24px).

- Campos e botões: `rounded-md`. Botões de chamada na página inicial: `rounded-full`.
- Cards e painéis: `rounded-xl`.
- Blocos grandes da página inicial: `rounded-3xl`.
- Selos e pílulas: `rounded-full`.

### Tipografia

| Fonte (`font`) | Texto | Títulos |
| --- | --- | --- |
| `modern` | Geist | Geist |
| `friendly` | Nunito | Nunito |
| `elegant` | Geist | Playfair Display |

- `h1`, `h2` e `h3` recebem a fonte de títulos e o espaçamento negativo entre letras.
- Escala usada: `text-xs` (rótulos e legendas), `text-sm` (apoio), base (corpo), `text-lg` (subtítulo), `text-3xl` a `text-4xl` (título de página), `text-6xl` a `text-7xl` (título da página inicial).
- Números que mudam usam `tabular-nums`.
- Títulos usam `text-balance`. Parágrafos usam `text-pretty`.

### Espaçamento

- Entre cards de uma grade: `gap-4`. Entre blocos de uma página: `gap-6`.
- Dentro de um card: `p-5` ou `p-6`.
- Seções da página inicial: `py-20` no celular, `py-28` em telas grandes, largura máxima `max-w-6xl`.
- Área logada: largura máxima `max-w-7xl`.

## Os três estilos

| | `clean` | `gradient` | `glass` |
| --- | --- | --- | --- |
| Superfície | Sólida | Sólida, com um véu da cor no canto | Translúcida, com desfoque de fundo |
| Luz ambiente | Uma mancha discreta | Duas manchas médias | Três manchas fortes |
| Destaque (`brand-surface`) | Cor sólida | Degradê | Degradê com luz no topo |
| Texto em destaque (`brand-text`) | Cor sólida | Degradê | Degradê |

Uma tela nova não precisa de código por estilo. Usando `Card`, `surface`, `brand-surface` e `brand-text`, ela se adapta sozinha.

## Classes utilitárias do projeto

| Classe | Para quê |
| --- | --- |
| `surface` | Painel com a aparência de card. |
| `surface-interactive` | Painel clicável: sobe 2px e realça a borda ao passar o cursor. |
| `brand-surface` | Fundo com a cor da marca. |
| `brand-glow` | Halo da cor. Use junto de `brand-surface` no elemento mais importante do bloco. |
| `brand-text` | Texto com a cor da marca. |
| `eyebrow` | Rótulo pequeno, em maiúsculas, acima de um título. |
| `grid-backdrop` | Grade fina decorativa que some nas bordas. |
| `animate-rise` | Entrada suave de um bloco. |

## Movimento

A página inicial se move; a área logada fica calma. Toda animação usa só `transform`, `opacity` e `clip-path`, e fica parada no estado final para quem pede menos movimento. Não instale biblioteca de animação: o que está aqui resolve.

| Recurso | Como usar |
| --- | --- |
| Revelar ao rolar | `data-reveal` no bloco. Para entrar em sequência, `style={revealDelay(index)}` de `src/lib/motion.ts`. |
| Luz que segue o cursor | `data-spotlight` em um painel. |
| Entrada do topo | Classes `hero-word` e `hero-fade`, com a ordem em `--order`. |
| Texto com brilho | `brand-text brand-shimmer`. |
| Luz ambiente em movimento | Bloco `aurora` com três `<span>`. |
| Reflexo no botão principal | `sheen`. |
| Borda luminosa | `spin-border` em um painel com `relative`. |
| Flutuar | `float-a` ou `float-b`. |
| Linha que se desenha | `draw-in` (uma vez) ou `draw-loop` (em ciclo). O mini gráfico já usa `draw-in`. |
| Peças em ciclo | `cycle`, `cycle-turn` ou `step-cycle`, com a posição em `style={cycleIndex(index)}`. |
| Faixa de frases | Componente `Ticker`. |

`MotionObserver`, em `src/components/motion`, liga a revelação e a luz do cursor. Ele já está na página inicial. Toda animação em ciclo leva também a classe `motion-loop`, que pausa fora da tela. Os gráficos animam ao entrar e respeitam o pedido de menos movimento.

## Padrões de página

### Cabeçalho de página

`PageHeader` (`src/components/platform/page-header.tsx`): rótulo opcional (`eyebrow`), título, descrição de uma linha e ações à direita. Toda tela da área logada começa com ele. A visão geral usa a mesma estrutura com a saudação no lugar do título.

### Grade bento

A visão geral usa `grid gap-4 lg:grid-cols-12`. Cada card declara a largura com `lg:col-span-*`. Combinações usadas: 8 + 4 e 4 + 4 + 4. No celular tudo vira uma coluna. Dê mais largura ao que a pessoa precisa ler primeiro.

### Card de número

`MetricCard` (`src/components/dashboard/metric-card.tsx`): rótulo, ícone, valor grande, linha de detalhe e um elemento visual no rodapé.

- A variação contra o período anterior usa `Trend`. Verde quando melhorou, vermelho quando piorou. Para medidas em que diminuir é bom, passe `lowerIsBetter`.
- O rodapé leva um `Sparkline` ou um `Progress`. É apoio visual: o número já diz o essencial.
- Os valores vêm de `src/lib/insights.ts`. Um número novo começa por uma função nova ali.

### Card de gráfico

`Card` com título, descrição curta dizendo o que é medido e, quando há mais de uma série, `ChartLegend` na ação do cabeçalho. Gráficos ficam em `src/components/charts`:

| Componente | Uso |
| --- | --- |
| `AreaChart` | Evolução no tempo, uma ou mais séries. |
| `BarChart` | Comparação entre poucas categorias. A maior barra fica em destaque. |
| `DonutChart` | Partes de um total, com o total no centro. |
| `Sparkline` | Tendência em miniatura, sem eixos. |

As cores vêm de `chartColors` (`src/components/charts/chart-theme.ts`). Não passe cores fixas.

### Tabela

Toda listagem usa `DataTable` com `useDataTable`. Cabeçalho discreto, linhas com realce ao passar o cursor, selo de situação com ponto colorido (`ItemStatusBadge`) e ações em um menu no fim da linha. O exemplo completo é `src/components/items/items-table.tsx`.

### Formulário

Campos dentro de `FieldGroup` e `Field`, com `FieldLabel` em todo campo e `FieldError` logo abaixo do campo com problema. A mesma validação zod roda no navegador e no servidor. O botão de envio mostra o estado de espera no próprio texto.

### Diálogo

`Dialog` para criar ou editar, `AlertDialog` para confirmar algo que não tem volta. Título em forma de ação ou de pergunta, descrição de uma frase, ação principal à direita.

### Estado vazio, carregando e erro

- Vazio: `EmptyState` (`src/components/empty-state.tsx`) com ícone, título, uma frase e, se fizer sentido, a ação que resolve.
- Carregando: `loading.tsx` com `Skeleton` no formato do conteúdo que vai chegar.
- Erro: `error.tsx` com uma mensagem simples e o botão "Tentar de novo".

### Página inicial

Seções em `src/components/marketing`, todas alimentadas por `src/config/landing.ts`: cabeçalho flutuante, chamada principal com a prévia do painel, faixa de destaques, benefícios em grade, três passos, planos e depoimentos (aparecem só quando há conteúdo), perguntas, chamada final e rodapé. Cada seção começa com `SectionHeading` (rótulo, título e subtítulo).

A prévia do painel (`dashboard-preview.tsx`) usa os componentes reais da área logada com os itens de exemplo. Ao mudar o painel, confira a prévia.

## Texto da interface

- Português do Brasil, direto, falando com a pessoa: "Novo item", "Tentar de novo".
- Botão diz a ação. Evite "OK" e "Enviar" sozinhos.
- Mensagem de erro diz o que aconteceu e o que fazer, sem termo técnico.
- Sem emoji e sem ponto de exclamação.
- Datas no formato brasileiro e fuso `America/Sao_Paulo`, pelas funções de `src/lib/format.ts`.

## Acessibilidade

- Contraste mínimo AA. As cores derivadas em `theme.ts` já garantem isso para texto e botões com qualquer `color`.
- Foco sempre visível: os componentes de `src/components/ui` já trazem o anel de foco. Elemento clicável feito à mão precisa de `focus-visible:ring-[3px] focus-visible:ring-ring/50`.
- Botão só com ícone tem `aria-label`. Ícone decorativo tem `aria-hidden`.
- Cor nunca é o único sinal: situação tem texto, variação tem seta e sinal.
- `prefers-reduced-motion` desliga animações e transições em `globals.css`.
- Nenhuma tela gera rolagem horizontal em 375px de largura.

## Faça e evite

Faça:

- Use `Card` ou `surface` para qualquer agrupamento.
- Reserve `brand-surface` com `brand-glow` para um elemento por bloco.
- Confira cada tela nova no claro, no escuro e no celular.
- Escreva a descrição do card dizendo o que o número ou o gráfico mede.

Evite:

- Cor fixa em componente, inclusive em `style`.
- Mais de duas séries no mesmo gráfico.
- Degradê em texto corrido, em bordas ou em mais de um título por tela.
- Sombra, borda e fundo fortes ao mesmo tempo no mesmo elemento.
- Número, depoimento ou cliente inventado na página inicial.
- Novo componente parecido com um que já existe. Estenda o existente.
