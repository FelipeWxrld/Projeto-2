# Protótipos (Figma)

> Cole aqui o link do arquivo Figma publicado: **`https://www.figma.com/design/<SEU-ARQUIVO>`**
> (deixe o link com permissão de visualização para quem tiver o link).

Este documento descreve as telas que devem ser desenhadas no Figma. Os wireframes abaixo seguem a interface implementada, então servem de base direta para o protótipo.

## Frames sugeridos

| Frame | Tamanho | Conteúdo |
| --- | --- | --- |
| Desktop - Home | 1280 × 900 | Conversor, histórico e tabela |
| Mobile - Home | 390 × 844 | Mesmas seções empilhadas em coluna única |
| Estados | 1280 × 600 | Carregando, erro, sem resultados na busca |

## Wireframe: Desktop

```
┌──────────────────────────────────────────────────────────────┐
│ Currency Exchange App                                        │
│ Converta e analise moedas com dados atualizados              │
├──────────────────────────────────────────────────────────────┤
│ Conversor                                                    │
│ ┌────────┐ ┌──────────────────┐  ┌───┐ ┌──────────────────┐  │
│ │ 100    │ │ USD · US Dollar ▾│  │ ⇄ │ │ BRL · Real      ▾│  │
│ └────────┘ └──────────────────┘  └───┘ └──────────────────┘  │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ US$ 100,00 =                                             │ │
│ │ R$ 540,00                                                │ │
│ │ 1 USD = 5,40 BRL · cotação de 26/10/2026                 │ │
│ └──────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────┤
│ Histórico USD → BRL      [7d][30d][90d][1a]  [Exportar CSV]  │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                  │
│ │ Mínima │ │ Máxima │ │ Média  │ │Variação│                  │
│ └────────┘ └────────┘ └────────┘ └────────┘                  │
│   gráfico de linha (tooltip ao passar o mouse)               │
├──────────────────────────────────────────────────────────────┤
│ Cotações de USD               [Filtrar moeda...] [Exportar]  │
│ Moeda ▲ │ Nome │ Taxa │ Valor convertido                     │
│ AUD     │ ...  │ ...  │ ...                                  │
│ BRL ◄ selecionada                                            │
└──────────────────────────────────────────────────────────────┘
```

## Wireframe: Mobile

```
┌──────────────────────┐
│ Currency Exchange    │
├──────────────────────┤
│ Valor  [ 100        ]│
│ De     [ USD       ▾]│
│          [ ⇄ ]       │
│ Para   [ BRL       ▾]│
│ ┌──────────────────┐ │
│ │ R$ 540,00        │ │
│ └──────────────────┘ │
├──────────────────────┤
│ Histórico            │
│ [7d][30d][90d][1a]   │
│ Mín │ Máx             │
│ Méd │ Var             │
│ gráfico              │
├──────────────────────┤
│ Cotações (tabela com │
│ rolagem horizontal)  │
└──────────────────────┘
```

## Estados a prototipar

- **Carregando**: spinner com texto ("Carregando moedas...", "Buscando cotação...").
- **Erro**: faixa vermelha clara com a mensagem e botão "Tentar novamente".
- **Sem resultados**: linha única na tabela: "Nenhuma moeda encontrada para ...".
- **Mesma moeda** (De = Para): histórico mostra "Escolha moedas diferentes para ver o histórico."

## Design tokens (iguais ao `src/index.css`)

| Token | Valor |
| --- | --- |
| Fundo | `#F4F6FB` |
| Superfície (cards) | `#FFFFFF` |
| Texto | `#1C2333` |
| Texto secundário | `#667085` |
| Borda | `#E3E7EF` |
| Cor de destaque | `#0F766E` (hover `#0B5E57`, suave `#CCFBF1`) |
| Erro | `#B42318` (fundo `#FEE4E2`) |
| Raio dos cantos | 14 px (cards), 10 px (inputs/botões) |
| Tipografia | system-ui / Segoe UI / Roboto |

## Fluxo de interação (para o protótipo clicável)

1. Usuário altera valor ou moedas → resultado, histórico e tabela atualizam.
2. Clica em **⇄** → De e Para são invertidos.
3. Clica em um período (7d / 30d / 90d / 1a) → gráfico recarrega.
4. Digita no filtro ou clica no cabeçalho da coluna → tabela filtra/ordena.
5. Clica em uma linha da tabela → ela vira a moeda de destino.
6. Clica em **Exportar CSV** → download do arquivo.
