# TypeScript e React

## Código

- Nomes de arquivos, funções e variáveis em inglês. Textos que a pessoa lê na tela em português.
- Arquivos em kebab-case: `new-item-dialog.tsx`.
- Use os atalhos `@/` para importar de `src`.
- Sem `any`. Tipos que vêm do banco ou do zod são derivados (`z.infer`, tipos do Drizzle), não reescritos à mão.
- Sempre use chaves em `if`, `else` e laços. Prefira retornos antecipados a blocos aninhados.
- Sem ternários aninhados. Use `if` ou um objeto de mapeamento.
- Comentários só quando algo não óbvio precisa ser preservado. Bons nomes vêm primeiro.

## Componentes

- Componentes são funções de seta com exportação nomeada. Exportação padrão só nos arquivos de rota (`page.tsx`, `layout.tsx`).
- Funções de evento começam com `handle`: `handleSubmit`, `handleDelete`.
- Props tipadas com uma `interface` acima do componente.
- Um arquivo passa de cerca de 200 linhas ou um componente tem mais de três regiões visuais: divida.
- Lógica repetida duas vezes vira função, hook ou componente.
- Use `useState` para estado local simples. Evite `useEffect` para buscar dados ou sincronizar estado.

## Formulários

- Valide com o mesmo schema zod no navegador e no servidor. Os schemas ficam em `src/lib`.
- Mostre o erro ao lado do campo, em português, dizendo como corrigir.
- Use os componentes `Field`, `FieldLabel` e `FieldError` de `src/components/ui/field.tsx`.
