# Clima no destino

Aprovado e construído em 28/11/2026. Opção escolhida: fundo temático com quadro de clima.

## Problema

Quem busca uma viagem vê o preço em milhas, mas não sabe como costuma ser o tempo no destino na época escolhida.

## O que entra

Em **Calendário** e **Planejar viagem**, quando há destino e data (ou mês) reconhecidos:

| Situação no mês da viagem | Fundo | Avisos no quadro |
|---|---|---|
| Destino de neve, na temporada | Paisagem de neve com poucos flocos caindo | "Temporada de neve" |
| Cidade em que pode nevar | Fundo normal | "Pode nevar" |
| Praia, época com pouca ou média chuva | Praia com sol | Temperatura e chance de chuva |
| Praia, época chuvosa | Praia com nuvens | "Período chuvoso" |
| Outros destinos | Fundo normal | Temperatura e chance de chuva |
| Região de furacões, junho a novembro | Conforme as linhas acima | "Temporada de furacões" |
| Destino sem informação ou data não reconhecida | Nada muda | Nenhum |

O quadro sempre diz: **"Clima típico da época, com base em anos anteriores. Não é previsão do tempo."**

## Cuidados na tela

- Texto sempre legível, nos modos claro e escuro e no celular.
- Poucos flocos, atrás do conteúdo, sem atrapalhar cliques.
- Sem animação para quem ativou "reduzir movimento" no aparelho.
- Botão para desligar a animação, lembrado naquele navegador.
- Desenhos feitos no próprio sistema, sem fotos de terceiros.

## Dados

- **Temperatura e chuva:** NASA POWER, médias mensais de 2001 a 2025, fonte pública e gratuita. Os números são baixados uma vez por um comando e guardados no projeto. Nenhuma consulta externa quando alguém usa o site.
- **Chance de chuva**, pela média do mês: alta a partir de 5 mm por dia; média de 2,5 a 5; baixa abaixo de 2,5.
- **Temporadas de neve e de furacões:** lista revisada à mão por destino. A fonte da NASA não é precisa em montanhas.
- **Destinos cobertos:** os que já aparecem no radar (cerca de 60). A fonte é citada no quadro.
- Nenhum dado pessoal é usado. Nada muda no banco de dados.

## Para depois

- Previsão real quando faltarem poucos dias para a viagem.
- Efeito em outras telas (Mundo, Visão geral).
- Novos destinos conforme entrarem no radar.

## Passos e como conferir

1. Lista de destinos (coordenadas, tipo, temporadas) e comando que baixa o clima. Conferir: todos os destinos do radar têm 12 meses de dados.
2. Regra que decide o fundo e os avisos. Conferir: Bariloche em julho mostra neve; Bariloche em janeiro não; Cancún em março mostra sol; Cancún em outubro mostra chuva e furacões; destino sem dados não mostra nada.
3. Quadro, fundos e flocos. Conferir no computador e no celular, modo claro e escuro, e com "reduzir movimento".
4. Ligar no Calendário e no Planejar viagem. Conferir com datas escritas como "set/2027" e "10/09/2027".
5. `npm run check` e `npm run build`. Publicar somente depois de um "sim".
