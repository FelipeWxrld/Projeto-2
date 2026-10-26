# Documentação do Projeto: Currency Exchange App

**Tipo:** Single Page Application (SPA)
**Tecnologias:** React 19, Vite, JavaScript (JSX), CSS puro
**API:** [Frankfurter](https://frankfurter.dev) (v1), gratuita e sem chave
**Autor:** Felipe (projeto individual)
**Repositório:** https://github.com/FelipeWxrld/Projeto-2

---

## Sumário

1. [Visão geral](#1-visão-geral)
2. [Requisitos](#2-requisitos)
3. [Arquitetura](#3-arquitetura)
4. [Fluxo de dados e gerenciamento de estado](#4-fluxo-de-dados-e-gerenciamento-de-estado)
5. [Componentes](#5-componentes)
6. [Custom Hooks](#6-custom-hooks)
7. [Camada de serviço (API)](#7-camada-de-serviço-api)
8. [Funções utilitárias](#8-funções-utilitárias)
9. [Estados da interface e tratamento de erros](#9-estados-da-interface-e-tratamento-de-erros)
10. [Exportação CSV](#10-exportação-csv)
11. [Interface e estilos](#11-interface-e-estilos)
12. [Decisões de projeto](#12-decisões-de-projeto)
13. [Como executar, gerar build e publicar](#13-como-executar-gerar-build-e-publicar)
14. [Roteiro de testes manuais](#14-roteiro-de-testes-manuais)
15. [Collection do Postman](#15-collection-do-postman)
16. [Histórico de desenvolvimento (Git)](#16-histórico-de-desenvolvimento-git)
17. [Limitações conhecidas](#17-limitações-conhecidas)
18. [Melhorias futuras](#18-melhorias-futuras)

---

## 1. Visão geral

O **Currency Exchange App** permite converter valores entre moedas e analisar como a taxa de câmbio variou ao longo do tempo. Todos os dados vêm da API pública Frankfurter, que publica as taxas de referência do Banco Central Europeu (BCE), atualizadas em dias úteis por volta das 16h (horário da Europa Central).

O projeto foi desenvolvido de forma **incremental**, aplicando os conteúdos vistos em aula: componentização, props, eventos, `useState`, *Lifting State Up*, `useEffect`, Custom Hooks, consumo de API com `fetch` e `async/await`, manipulação de arrays e objetos, gráficos, filtros, ordenação e exportação CSV.

### Funcionalidades

| # | Funcionalidade | Descrição |
| --- | --- | --- |
| 1 | Conversor | Converte um valor entre duas moedas, com botão para inverter origem e destino |
| 2 | Cotação do dia | Mostra a taxa usada (`1 USD = 5,40 BRL`) e a data da cotação |
| 3 | Histórico | Gráfico de linha da taxa nos últimos 7, 30, 90 dias ou 1 ano |
| 4 | Estatísticas | Mínima, máxima, média e variação percentual do período |
| 5 | Tabela de cotações | Todas as moedas em relação à moeda de origem, com valor convertido |
| 6 | Filtro | Busca por código ou nome da moeda (ignora maiúsculas e acentos) |
| 7 | Ordenação | Por código, nome ou taxa, crescente ou decrescente |
| 8 | Exportação CSV | Exporta a tabela (como está na tela) e o histórico |
| 9 | Feedback | Indicadores de carregamento e mensagens de erro com "Tentar novamente" |

---

## 2. Requisitos

### 2.1 Requisitos funcionais

- **RF01**: O usuário deve poder informar um valor numérico e escolher as moedas de origem e destino.
- **RF02**: O sistema deve exibir o valor convertido e a taxa utilizada.
- **RF03**: O usuário deve poder inverter as moedas com um clique.
- **RF04**: O sistema deve exibir o histórico da taxa entre as moedas escolhidas em um gráfico.
- **RF05**: O usuário deve poder alterar o período do histórico (7 dias, 30 dias, 90 dias, 1 ano).
- **RF06**: O sistema deve exibir mínima, máxima, média e variação do período.
- **RF07**: O sistema deve listar as cotações de todas as moedas em relação à moeda de origem.
- **RF08**: O usuário deve poder filtrar e ordenar a lista de cotações.
- **RF09**: O usuário deve poder exportar os dados exibidos em CSV.
- **RF10**: O sistema deve informar claramente quando está carregando ou quando ocorreu um erro.

### 2.2 Requisitos não funcionais

- **RNF01 (Usabilidade)**: interface em português do Brasil, valores formatados no padrão brasileiro.
- **RNF02 (Responsividade)**: funciona em telas de desktop e de celular.
- **RNF03 (Desempenho)**: digitar um valor não gera novas requisições; requisições obsoletas são canceladas.
- **RNF04 (Manutenibilidade)**: código separado em componentes, hooks, serviço e utilitários.
- **RNF05 (Acessibilidade básica)**: `label` nos campos, `aria-label`, `aria-sort`, `aria-live`, `role="status"` e `role="alert"`, foco visível.
- **RNF06 (Portabilidade)**: sem dependências além de React; roda em qualquer navegador moderno.

---

## 3. Arquitetura

O projeto segue uma separação em camadas simples:

```
┌─────────────────────────────────────────────────────────┐
│  Componentes (components/)   → o que aparece na tela    │
├─────────────────────────────────────────────────────────┤
│  Custom Hooks (hooks/)       → estado + efeitos + fetch │
├─────────────────────────────────────────────────────────┤
│  Serviço (services/)         → chamadas HTTP à API      │
├─────────────────────────────────────────────────────────┤
│  Utilitários (utils/)        → funções puras (sem React)│
└─────────────────────────────────────────────────────────┘
```

**Regra de dependência:** componentes usam hooks e utilitários; hooks usam o serviço e utilitários; o serviço não conhece React. Assim, a API pode ser trocada alterando apenas `services/frankfurter.js`.

### 3.1 Estrutura de pastas

```
Projeto-2/
├── index.html                  # página única (container #root)
├── package.json                # scripts e dependências
├── vite.config.js              # configuração do Vite + plugin React
├── .gitignore
├── README.md                   # visão rápida e instruções
├── docs/
│   ├── DOCUMENTACAO.md         # este documento
│   └── PROTOTIPOS.md           # wireframes e guia do Figma
├── postman/
│   └── Frankfurter-API.postman_collection.json
└── src/
    ├── main.jsx                # ponto de entrada (monta o <App />)
    ├── App.jsx                 # estado compartilhado e composição da tela
    ├── index.css               # estilos globais
    ├── components/
    │   ├── Header.jsx
    │   ├── Footer.jsx
    │   ├── Card.jsx
    │   ├── CurrencySelect.jsx
    │   ├── ConversionForm.jsx
    │   ├── ConversionResult.jsx
    │   ├── HistoryChart.jsx
    │   ├── PeriodSelector.jsx
    │   ├── Stats.jsx
    │   ├── LineChart.jsx
    │   ├── RatesTable.jsx
    │   ├── ExportButton.jsx
    │   └── Feedback.jsx        # Loading e ErrorMessage
    ├── hooks/
    │   ├── useCurrencies.js
    │   ├── useConversion.js
    │   ├── useTimeSeries.js
    │   └── useLatestRates.js
    ├── services/
    │   └── frankfurter.js
    └── utils/
        ├── format.js
        ├── stats.js
        ├── table.js
        └── csv.js
```

### 3.2 Árvore de componentes

```
App
├── Header
├── Card "Conversor"
│   ├── Loading / ErrorMessage            (enquanto carrega as moedas)
│   ├── ConversionForm
│   │   └── CurrencySelect (×2: "De" e "Para")
│   └── ConversionResult
│       └── Loading / ErrorMessage
├── HistoryChart
│   └── Card
│       ├── PeriodSelector
│       ├── ExportButton
│       ├── Stats
│       ├── LineChart
│       └── Loading / ErrorMessage
├── RatesTable
│   └── Card
│       ├── input de filtro
│       ├── ExportButton
│       └── Loading / ErrorMessage
└── Footer
```

`HistoryChart` e `RatesTable` só são renderizados depois que a lista de moedas foi carregada com sucesso.

---

## 4. Fluxo de dados e gerenciamento de estado

### 4.1 Estado compartilhado (Lifting State Up)

Três valores são usados por várias partes da tela, por isso ficam no ancestral comum, o `App`:

| Estado | Tipo | Valor inicial | Usado por |
| --- | --- | --- | --- |
| `amount` | `string` | `'100'` | `ConversionForm`, `ConversionResult`, `RatesTable` |
| `from` | `string` | `'USD'` | todos os componentes de dados |
| `to` | `string` | `'BRL'` | `ConversionForm`, `ConversionResult`, `HistoryChart`, `RatesTable` |

`amount` é guardado como **string** para que o campo aceite campo vazio e digitação parcial. A conversão para número acontece apenas na hora do cálculo.

O `ConversionForm` **não tem estado próprio**: recebe valores e funções por props (`onAmountChange`, `onFromChange`, `onToChange`, `onSwap`) e apenas os repassa aos campos.

### 4.2 Estado local

Estados usados por um único componente ficam nele:

| Componente | Estado | Finalidade |
| --- | --- | --- |
| `HistoryChart` | `days` (padrão `30`) | período do histórico |
| `RatesTable` | `query` | texto do filtro |
| `RatesTable` | `sort` = `{ key, dir }` | coluna e direção da ordenação |
| `LineChart` | `hover` | índice do ponto sob o mouse |

### 4.3 Fluxo de uma interação

```
Usuário muda "De" para EUR
   │
   ▼
onFromChange → setFrom('EUR')  (estado no App)
   │
   ├─► useConversion({ from, to })   → useEffect refaz GET /latest?base=EUR&symbols=BRL
   ├─► HistoryChart (props from/to)  → useTimeSeries refaz GET /{início}..{fim}
   └─► RatesTable (prop base)        → useLatestRates refaz GET /latest?base=EUR
```

Digitar no campo **Valor** apenas altera `amount`; nenhum hook de dados depende dele, então **nenhuma requisição é feita**. O valor convertido é calculado na renderização: `amount × taxa`.

---

## 5. Componentes

### 5.1 Layout

**`Header`** · props: `title`, `subtitle`
Cabeçalho com título e subtítulo do aplicativo.

**`Footer`**
Rodapé com a atribuição da fonte dos dados (link para a Frankfurter).

**`Card`** · props: `title`, `actions`, `children`
Contêiner visual reutilizável. Recebe o conteúdo por `children` (composição) e, opcionalmente, elementos de ação alinhados ao título (filtro, botões, seletor de período).

### 5.2 Conversor

**`CurrencySelect`** · props: `id`, `label`, `value`, `onChange`, `currencies`
Componente **controlado**: o valor vive no pai. Lista as moedas ordenadas por código, no formato `USD · United States Dollar`. Chama `onChange` com o código da moeda.

**`ConversionForm`** · props: `amount`, `from`, `to`, `currencies`, `onAmountChange`, `onFromChange`, `onToChange`, `onSwap`
Campo numérico de valor, dois `CurrencySelect` e botão ⇄ para inverter. O envio do formulário é bloqueado (`preventDefault`), pois a conversão é automática.

**`ConversionResult`** · props: `amount`, `from`, `to`, `rate`, `date`, `loading`, `error`, `onRetry`
Exibe `100,00 USD = 540,00 BRL`, a taxa e a data. Mostra `Loading` ou `ErrorMessage` conforme o estado. Se o campo de valor estiver vazio, mostra "—".

### 5.3 Histórico

**`HistoryChart`** · props: `from`, `to`
Orquestra o histórico: guarda o período, chama `useTimeSeries`, calcula as estatísticas com `useMemo` e compõe `PeriodSelector`, `ExportButton`, `Stats` e `LineChart`. Se `from === to`, mostra a mensagem "Escolha moedas diferentes para ver o histórico."

**`PeriodSelector`** · props: `value`, `onChange`
Grupo de botões (7 dias, 30 dias, 90 dias, 1 ano) com `aria-pressed` no ativo. Exporta a constante `PERIODS`.

**`Stats`** · props: `summary`
Quatro cartões: mínima (com data), máxima (com data), média e variação (verde se positiva, vermelha se negativa).

**`LineChart`** · props: `points`, `label`
Gráfico de linha em **SVG puro**. Detalhes:

- `viewBox` de 640 × 280, escalável (`width: 100%`).
- Eixo Y com 5 marcas (mínimo e máximo com 10% de folga); eixo X com 3 datas (início, meio e fim).
- Linha, área preenchida, grade horizontal.
- Ao mover o mouse, o evento `onMouseMove` converte a posição do cursor em índice do ponto mais próximo e exibe cursor vertical, marcador e a leitura "data · valor".
- Com menos de 2 pontos, mostra "Dados insuficientes para desenhar o gráfico."
- `role="img"` e `aria-label` descrevem o gráfico para leitores de tela.

### 5.4 Tabela de cotações

**`RatesTable`** · props: `base`, `amount`, `currencies`, `selected`, `onSelect`
Lista todas as moedas em relação a `base`. Recursos:

- **Filtro** por código ou nome (campo de busca no topo).
- **Ordenação** ao clicar no cabeçalho de *Moeda*, *Nome* ou *Taxa* (alterna crescente/descendente; indicadores ▲ e ▼; `aria-sort`).
- Coluna **Valor convertido**: `amount × taxa` na moeda da linha.
- A linha da moeda de destino atual fica destacada; **clicar numa linha** chama `onSelect` e muda o destino.
- Contador "N moedas · cotação de dd/mm/aaaa".
- Mensagem "Nenhuma moeda encontrada para ..." quando o filtro não retorna nada.
- Cabeçalho fixo (`sticky`) e rolagem vertical (máx. 480 px).

### 5.5 Utilitários de interface

**`ExportButton`** · props: `rows`, `columns`, `filename`, `label`
Botão genérico que gera e baixa um CSV. Fica desabilitado se `rows` estiver vazio.

**`Feedback.jsx`** exporta dois componentes:

- `Loading` · props: `text`. Spinner com texto (`role="status"`).
- `ErrorMessage` · props: `message`, `onRetry`. Faixa de erro (`role="alert"`) com botão opcional "Tentar novamente".

---

## 6. Custom Hooks

Todos seguem o mesmo padrão: `useState` para dados, carregamento e erro; `useEffect` para disparar a busca; `AbortController` para cancelar a requisição no *cleanup*; `try/catch/finally` para tratamento de erros.

### `useCurrencies()`

- **Retorna:** `{ currencies, loading, error }`
- **Busca:** `GET /currencies`, uma única vez ao montar.
- `currencies` é um objeto `{ USD: "United States Dollar", ... }`.

### `useConversion({ from, to })`

- **Retorna:** `{ rate, date, loading, error, refetch }`
- **Busca:** `GET /latest?base={from}&symbols={to}` sempre que `from` ou `to` mudam.
- Se `from === to`, define `rate = 1` sem chamar a API (a API recusa esse caso).
- `refetch` incrementa uma chave (`reloadKey`) que reexecuta o efeito, usada pelo botão "Tentar novamente".
- Não recebe `amount`: o valor convertido é calculado fora do hook.

### `useTimeSeries({ from, to, days })`

- **Retorna:** `{ points, loading, error, refetch }`
- **Busca:** `GET /{início}..{fim}?base={from}&symbols={to}`, onde `fim` é hoje e `início` é hoje menos `days`.
- Converte a resposta em `[{ date, rate }]` ordenado por data (`seriesToPoints`).
- Se `from === to`, retorna lista vazia sem requisição.

### `useLatestRates(base)`

- **Retorna:** `{ rates, date, loading, error, refetch }`
- **Busca:** `GET /latest?base={base}` (todas as moedas) sempre que `base` muda.
- `rates` é um objeto `{ BRL: 5.4, EUR: 0.92, ... }` (não inclui a própria moeda base).

---

## 7. Camada de serviço (API)

Arquivo: `src/services/frankfurter.js`. É o **único** ponto que conhece a URL da API.

**URL base:** `https://api.frankfurter.dev/v1`

| Função | Endpoint | Usada por |
| --- | --- | --- |
| `getCurrencies(signal)` | `GET /currencies` | `useCurrencies` |
| `getLatestRates({ base, symbols }, signal)` | `GET /latest?base=&symbols=` | `useConversion`, `useLatestRates` |
| `getHistoricalRates({ date, base, symbols }, signal)` | `GET /{data}?base=&symbols=` | disponível para uso futuro |
| `getTimeSeries({ start, end, base, symbols }, signal)` | `GET /{início}..{fim}?base=&symbols=` | `useTimeSeries` |

A função interna `request(path, params, signal)`:

1. monta a URL com `URL` e `searchParams` (ignorando parâmetros vazios);
2. chama `fetch` com o `signal` para permitir cancelamento;
3. se a resposta não for `ok`, lança `Error("Erro {status} ao consultar a API: {mensagem}")`, lendo a mensagem do corpo JSON quando existir;
4. retorna `response.json()`.

### Formatos de resposta

`/latest` e `/{data}`:

```json
{ "amount": 1.0, "base": "USD", "date": "2026-10-26", "rates": { "BRL": 5.4 } }
```

`/{início}..{fim}`:

```json
{
  "amount": 1.0,
  "base": "USD",
  "start_date": "2026-09-28",
  "end_date": "2026-10-26",
  "rates": {
    "2026-09-28": { "BRL": 5.4 },
    "2026-09-29": { "BRL": 5.41 }
  }
}
```

> Os valores acima são ilustrativos; mostram apenas o formato.

---

## 8. Funções utilitárias

Todas são funções puras (sem React), o que facilita testar e reutilizar.

### `utils/format.js`

| Função | Descrição |
| --- | --- |
| `formatMoney(value, code)` | Valor monetário no padrão `pt-BR` com a moeda (até 4 casas). Se o `Intl` não reconhecer a moeda, usa o formato "valor CÓDIGO". |
| `formatRate(value)` | Taxa com 2 a 6 casas decimais. |
| `formatDate(iso)` | `"2026-10-26"` → `"26/10/2026"`, sem usar `Date` (evita erro de fuso horário). |
| `toISODate(date, offsetDays)` | Data local em `YYYY-MM-DD`, com deslocamento em dias. |

Valores nulos, indefinidos ou `NaN` retornam `"—"`.

### `utils/stats.js`

| Função | Descrição |
| --- | --- |
| `seriesToPoints(rates, target)` | Converte `{ data: { BRL: n } }` em `[{ date, rate }]`, descarta valores não numéricos e ordena por data. |
| `summarize(points)` | Retorna `{ min, max, avg, first, last, changePct, minDate, maxDate }` ou `null` se não houver pontos. |

A variação percentual é `((último − primeiro) / primeiro) × 100`.

### `utils/table.js`

| Função | Descrição |
| --- | --- |
| `buildRows(rates, currencies)` | Junta taxas e nomes: `[{ code, name, rate }]`. |
| `filterRows(rows, query)` | Filtra por código ou nome, sem diferenciar maiúsculas nem acentos (`normalize('NFD')`). |
| `sortRows(rows, key, dir)` | Ordena por `code`, `name` (com `localeCompare`) ou `rate` (numérico), **sem alterar** o array original. |

### `utils/csv.js`

| Função | Descrição |
| --- | --- |
| `toCSV(rows, columns)` | Gera o texto CSV a partir de linhas e colunas `{ header, value }`. |
| `downloadCSV(filename, csvText)` | Cria um `Blob`, um link temporário e dispara o download. |

---

## 9. Estados da interface e tratamento de erros

| Situação | Comportamento |
| --- | --- |
| Carregando moedas | `Loading` "Carregando moedas..." no cartão do conversor |
| Falha ao carregar moedas | `ErrorMessage` com o motivo; histórico e tabela não aparecem |
| Buscando cotação | `Loading` "Buscando cotação..." no lugar do resultado |
| Falha na cotação | `ErrorMessage` com botão "Tentar novamente" (chama `refetch`) |
| Carregando histórico / tabela | `Loading` no próprio cartão |
| Falha no histórico / tabela | `ErrorMessage` com "Tentar novamente" |
| Origem igual ao destino | Taxa 1 no conversor; histórico informa "Escolha moedas diferentes" |
| Campo de valor vazio | Resultado mostra "—" |
| Filtro sem resultados | Linha "Nenhuma moeda encontrada para ..." |
| Poucos dados no gráfico | "Dados insuficientes para desenhar o gráfico." |

**Cancelamento de requisições:** cada efeito cria um `AbortController` e o cancela no *cleanup*. Isso evita que uma resposta antiga (de uma seleção anterior) sobrescreva a nova. O `AbortError` é ignorado e não aparece como erro para o usuário.

---

## 10. Exportação CSV

Gerada no navegador, sem servidor. Formato pensado para abrir direto no **Excel em português**:

- separador de colunas: `;`
- números com **vírgula** decimal (`5,4321`)
- codificação UTF-8 com **BOM** (acentos corretos)
- quebra de linha `\r\n`
- campos com `;`, aspas ou quebra de linha são colocados entre aspas, com aspas internas duplicadas

### Arquivo da tabela de cotações

Nome: `cotacoes-{BASE}-{data}.csv`. Exporta as linhas **como estão na tela** (já filtradas e ordenadas).

| Coluna | Conteúdo |
| --- | --- |
| Moeda base | moeda de origem |
| Moeda | código da moeda da linha |
| Nome | nome da moeda |
| Taxa | taxa de câmbio |
| Valor convertido (N BASE) | `amount × taxa` |
| Data da cotação | data retornada pela API |

### Arquivo do histórico

Nome: `historico-{DE}-{PARA}-{dias}d.csv`.

| Coluna | Conteúdo |
| --- | --- |
| Data | `YYYY-MM-DD` |
| Moeda base | moeda de origem |
| Moeda destino | moeda de destino |
| Taxa | taxa no dia |

---

## 11. Interface e estilos

- **CSS puro** em `src/index.css`, com variáveis (`:root`) para cores, raio dos cantos e sombra.
- **Layout:** coluna única centralizada (máx. 980 px), seções em cartões.
- **Responsividade:** abaixo de 700 px o formulário vira coluna única e as estatísticas passam a 2 colunas; a tabela rola horizontalmente.
- **Tipografia:** fonte do sistema (`system-ui`, Segoe UI, Roboto).
- **Gráfico:** cores, grade e textos definidos por classes CSS (`.chart-line`, `.chart-area`, etc.).

### Paleta

| Uso | Cor |
| --- | --- |
| Fundo | `#F4F6FB` |
| Cartões | `#FFFFFF` |
| Texto / secundário | `#1C2333` / `#667085` |
| Borda | `#E3E7EF` |
| Destaque | `#0F766E` (hover `#0B5E57`, suave `#CCFBF1`) |
| Erro | `#B42318` (fundo `#FEE4E2`) |

Wireframes e guia para o Figma: [`PROTOTIPOS.md`](PROTOTIPOS.md).

---

## 12. Decisões de projeto

| Decisão | Motivo |
| --- | --- |
| Valor convertido calculado no front | Digitar um valor não faz requisições; só mudar de moeda faz |
| `amount` como string | Permite campo vazio e digitação parcial sem inconsistências |
| Camada `services/` separada | Troca de API sem mexer em componentes e hooks |
| Hooks com `AbortController` | Evita condições de corrida e vazamentos ao desmontar ou trocar seleção |
| Taxa 1 quando origem = destino | A API recusa esse par; evita erro desnecessário |
| `useMemo` para filtro/ordenação/estatísticas | Evita recalcular a cada renderização sem necessidade |
| `sortRows` não altera o array | Estado do React nunca deve ser mutado |
| Gráfico em SVG próprio | Sem dependências, leve, fácil de explicar; trocável por uma biblioteca |
| CSV com `;` e vírgula decimal | Compatível com Excel em português |
| `formatDate` sem `new Date` | Evita que fusos horários mostrem o dia anterior |
| Estado local quando só um componente usa | Mantém o `App` enxuto; só sobe o que é compartilhado |

---

## 13. Como executar, gerar build e publicar

**Requisitos:** Node.js 20 ou superior e npm.

```bash
git clone https://github.com/FelipeWxrld/Projeto-2.git
cd Projeto-2
npm install
npm run dev        # desenvolvimento em http://localhost:5173
```

| Comando | Função |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com recarga automática |
| `npm run build` | Gera a versão de produção na pasta `dist/` |
| `npm run preview` | Serve localmente a build de produção |

### Publicação (Vercel)

1. Acesse vercel.com e entre com a conta do GitHub.
2. **Add New → Project** e escolha o repositório `Projeto-2`.
3. Mantenha as configurações detectadas (Framework: Vite; Build: `npm run build`; Output: `dist`).
4. Clique em **Deploy**. A cada `git push` na `main`, a Vercel publica automaticamente.

Não há variáveis de ambiente: a API não exige chave. A Frankfurter permite chamadas diretas do navegador.

---

## 14. Roteiro de testes manuais

Marque cada item após testar no navegador.

### Conversor
- [ ] Ao abrir, aparece "Carregando moedas..." e depois o formulário com USD → BRL e valor 100.
- [ ] Alterar o valor atualiza o resultado imediatamente (sem recarregar a cotação).
- [ ] Apagar o valor mostra "—" no resultado.
- [ ] Trocar a moeda de origem ou de destino atualiza taxa, data e resultado.
- [ ] O botão ⇄ inverte as moedas.
- [ ] Escolher a mesma moeda nos dois lados mostra taxa 1.

### Histórico
- [ ] O gráfico aparece com período de 30 dias.
- [ ] Cada botão de período (7 dias, 30 dias, 90 dias, 1 ano) recarrega o gráfico e marca o botão ativo.
- [ ] Mínima, máxima, média e variação são exibidas; a variação fica verde ou vermelha.
- [ ] Passar o mouse no gráfico mostra o marcador e "data · valor".
- [ ] Com origem = destino, aparece "Escolha moedas diferentes para ver o histórico."

### Tabela
- [ ] A tabela lista as moedas e o contador mostra a quantidade.
- [ ] Digitar "euro" ou "eur" filtra; digitar um texto inexistente mostra a mensagem de vazio.
- [ ] Clicar em *Moeda*, *Nome* e *Taxa* ordena; clicar de novo inverte a direção.
- [ ] Clicar numa linha muda a moeda de destino e destaca a linha.
- [ ] A coluna "Valor convertido" muda ao alterar o valor no conversor.

### Exportação CSV
- [ ] "Exportar CSV" da tabela baixa um arquivo; com filtro ativo, só as linhas filtradas são exportadas.
- [ ] O arquivo abre no Excel com acentos corretos e colunas separadas.
- [ ] "Exportar CSV" do histórico baixa os pontos do gráfico.

### Erros
- [ ] Desligar a internet e recarregar mostra uma mensagem de erro.
- [ ] Religar a internet e clicar em "Tentar novamente" recupera os dados.

### Responsividade
- [ ] Reduzir a janela (ou usar o modo celular do navegador) empilha o formulário e mantém tudo utilizável.

---

## 15. Collection do Postman

Arquivo: `postman/Frankfurter-API.postman_collection.json` (Postman → **Import**).

**Variáveis da collection:** `baseUrl`, `base` (USD), `target` (BRL), `date`, `start`, `end`. Altere-as para testar outras moedas e datas.

| Requisição | Endpoint | O que o teste automático valida |
| --- | --- | --- |
| Listar moedas | `GET /currencies` | status 200; contém `USD` e `BRL` |
| Taxa atual entre duas moedas | `GET /latest?base&symbols` | status 200; `base`, `date` e taxa numérica |
| Todas as taxas de uma moeda base | `GET /latest?base` | status 200; várias moedas; não inclui a própria base |
| Taxa em uma data específica | `GET /{date}?base&symbols` | status 200; data ≤ data pedida |
| Série temporal | `GET /{start}..{end}?base&symbols` | status 200; datas no formato ISO; contém a moeda alvo |
| Erro: moeda inválida | `GET /latest?base=XXX` | resposta 4xx |

---

## 16. Histórico de desenvolvimento (Git)

O projeto foi construído em etapas, cada uma com seu commit, na ordem em que os conteúdos foram aplicados:

| Etapa | Commit | Conteúdo aplicado |
| --- | --- | --- |
| 1 | `chore: estrutura inicial do projeto com Vite e React` | React, JSX, estrutura de pastas |
| 2 | `feat: componentiza layout com Header, Footer e Card usando props` | Componentização, props, `children` |
| 3 | `feat: consome API Frankfurter com fetch/async-await e cria hook useCurrencies` | `useEffect`, `fetch`, `async/await`, primeiro Custom Hook |
| 4 | `feat: adiciona conversor com eventos, useState, lifting state up e hook useConversion` | Eventos, `useState`, Lifting State Up |
| 5 | `feat: adiciona histórico com série temporal, estatísticas e gráfico de linha em SVG` | Gráficos, arrays e objetos |
| 6 | `feat: adiciona tabela de cotações com filtro, ordenação e seleção de moeda` | Filtros e ordenação, `useMemo` |
| 7 | `feat: adiciona exportação CSV para cotações e histórico` | Exportação CSV |
| 8 | `docs: adiciona collection do Postman com testes` | API documentada e testável |
| 9 | `docs: adiciona wireframes e guia de protótipos para o Figma` | Protótipos |
| 10 | `docs: adiciona README com instruções, estrutura e decisões` | Documentação |

Convenção de mensagens: `feat:` (funcionalidade), `chore:` (infraestrutura), `docs:` (documentação), `fix:` (correção).

---

## 17. Limitações conhecidas

- **Dados do BCE:** as taxas são de referência, atualizadas em dias úteis. Em fins de semana e feriados a API devolve o último dia útil. Não servem para operações financeiras reais.
- **Conjunto de moedas:** a API cobre cerca de 30 moedas; moedas fora da lista do BCE não estão disponíveis.
- **Séries longas:** a API pode agrupar períodos longos (por semana ou mês), então o gráfico de 1 ano pode ter menos pontos que dias.
- **Sem testes automatizados:** a validação é manual (seção 14) e pela collection do Postman.
- **Sem persistência:** as escolhas do usuário (moedas, valor, período) voltam ao padrão ao recarregar a página.
- **Sem cache:** trocar de moeda e voltar refaz as requisições.
- **Dependência de rede:** sem internet, o aplicativo mostra erro, pois não funciona offline.

---

## 18. Melhorias futuras

- Salvar moedas e valor escolhidos no `localStorage`.
- Cache das respostas para evitar requisições repetidas.
- Escolha de data inicial e final personalizadas para o histórico (o serviço `getHistoricalRates` já está pronto).
- Comparação de várias moedas no mesmo gráfico.
- Moedas favoritas fixadas no topo da tabela.
- Tema escuro.
- Testes automatizados com Vitest e React Testing Library.
- Biblioteca de gráficos (ex.: Recharts) para mais interatividade.
- Publicação com domínio próprio e *CI* para rodar o build a cada commit.
