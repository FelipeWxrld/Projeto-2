# Currency Exchange App

Single Page Application em **React** para **conversão e análise de moedas**, usando a [API Frankfurter](https://frankfurter.dev) (taxas de referência do Banco Central Europeu, gratuita e sem chave de API).

Projeto individual e incremental, desenvolvido aplicando os conteúdos das aulas (o histórico de commits mostra a evolução etapa por etapa).

## Funcionalidades

- **Conversor**: valor, moeda de origem e destino, botão para inverter (⇄) e data da cotação.
- **Histórico**: gráfico de linha da taxa nos últimos 7, 30, 90 dias ou 1 ano, com mínima, máxima, média e variação percentual.
- **Tabela de cotações**: todas as moedas em relação à moeda de origem, com **filtro** (por código ou nome) e **ordenação** (por código, nome ou taxa). Clicar em uma linha define a moeda de destino.
- **Exportação CSV** da tabela (já filtrada e ordenada) e do histórico.
- Estados de **carregamento** e **erro** (com botão "Tentar novamente").
- Layout responsivo (desktop e mobile).

## Como executar

Requisitos: Node.js 20+ e npm.

```bash
git clone <URL-DO-SEU-REPOSITORIO>
cd currency-exchange-app
npm install
npm run dev      # http://localhost:5173
```

Outros comandos:

```bash
npm run build    # gera a versão de produção em dist/
npm run preview  # serve a build localmente
```

## Estrutura

```
src/
├── components/          # Componentes de interface (props, eventos)
│   ├── Header.jsx  Footer.jsx  Card.jsx
│   ├── ConversionForm.jsx  ConversionResult.jsx  CurrencySelect.jsx
│   ├── HistoryChart.jsx  LineChart.jsx  PeriodSelector.jsx  Stats.jsx
│   ├── RatesTable.jsx  ExportButton.jsx  Feedback.jsx
├── hooks/               # Custom Hooks (useState + useEffect + fetch)
│   ├── useCurrencies.js  useConversion.js
│   ├── useTimeSeries.js  useLatestRates.js
├── services/
│   └── frankfurter.js   # Único ponto de contato com a API
├── utils/               # Funções puras (formatação, tabela, estatísticas, CSV)
├── App.jsx              # Estado compartilhado (amount, from, to)
└── main.jsx
postman/                 # Collection do Postman
docs/PROTOTIPOS.md       # Wireframes e guia do protótipo no Figma
```

## Conteúdos aplicados

| Conteúdo | Onde está |
| --- | --- |
| React e JSX | todos os `.jsx` |
| Componentização | `components/` (componentes pequenos e reutilizáveis, ex.: `Card`, `ExportButton`) |
| Props | `Header` (`title`, `subtitle`), `CurrencySelect`, `Card` (`children`, `actions`), `ExportButton` |
| Eventos | `onChange` nos campos, `onClick` em inverter, períodos, ordenação, linhas e exportação, `onMouseMove` no gráfico |
| `useState` | `App.jsx`, `HistoryChart.jsx` (período), `RatesTable.jsx` (filtro e ordenação), `LineChart.jsx` (hover) |
| Lifting State Up | `amount`, `from` e `to` vivem em `App.jsx` e são usados pelo formulário, resultado, histórico e tabela. `ConversionForm` não guarda estado |
| `useEffect` | hooks em `hooks/`, com `AbortController` e função de cleanup |
| Custom Hooks | `useCurrencies`, `useConversion`, `useTimeSeries`, `useLatestRates` |
| `fetch` + `async/await` | `services/frankfurter.js` e `load()` dentro dos hooks, com tratamento de erro via `try/catch/finally` |
| Arrays e objetos | `Object.entries`, `map`, `filter`, `sort` (sem mutar), `reduce`, `useMemo` em `utils/table.js`, `utils/stats.js` e `RatesTable.jsx` |
| Gráficos | `LineChart.jsx` (SVG próprio, sem biblioteca externa) |
| Filtros e ordenação | `RatesTable.jsx` + `utils/table.js` |
| Exportação CSV | `utils/csv.js` + `ExportButton.jsx` |
| Git e GitHub | commits pequenos e semânticos (`feat:`, `chore:`, `docs:`) |

## Endpoints da API usados

Base: `https://api.frankfurter.dev/v1`

| Uso no app | Endpoint |
| --- | --- |
| Lista de moedas | `GET /currencies` |
| Conversor | `GET /latest?base=USD&symbols=BRL` |
| Tabela de cotações | `GET /latest?base=USD` |
| Histórico (gráfico) | `GET /2026-09-26..2026-10-26?base=USD&symbols=BRL` |
| Data específica (disponível no service e na collection) | `GET /2026-01-02?base=USD&symbols=BRL` |

A collection do Postman está em [`postman/Frankfurter-API.postman_collection.json`](postman/Frankfurter-API.postman_collection.json) (Postman → *Import*). Ela usa variáveis (`base`, `target`, `date`, `start`, `end`) e traz testes automáticos de status e formato da resposta.

## Decisões de projeto

- **Valor convertido calculado no front** (`amount × taxa`): digitar um valor não gera novas requisições, só trocar de moeda gera.
- **Mesma moeda de origem e destino**: a API rejeita esse caso, então o app usa taxa 1 sem chamá-la.
- **Requisições canceláveis**: cada `useEffect` cria um `AbortController` e cancela no cleanup, evitando respostas antigas sobrescrevendo as novas.
- **Gráfico em SVG próprio**: sem dependências extras, leve e fácil de explicar na apresentação. Pode ser trocado por uma biblioteca (ex.: Recharts) sem alterar os hooks.
- **CSV pensado para o Excel brasileiro**: separador `;`, vírgula decimal e BOM UTF-8 (acentos corretos).
- **Dados de períodos longos**: a API pode agrupar séries muito longas por semana ou mês, então o gráfico de 1 ano pode ter menos pontos que dias.
- As taxas são de **referência do BCE**, atualizadas em dias úteis (cerca de 16h CET). Não servem para operações financeiras reais.

## Protótipos

Wireframes e guia de design em [`docs/PROTOTIPOS.md`](docs/PROTOTIPOS.md). Link do Figma: _adicionar aqui_.

## Checklist de entrega

- [ ] Repositório público no GitHub
- [ ] Aplicação funcionando (`npm run dev`) e, opcionalmente, publicada (Vercel/Netlify)
- [ ] Documentação (este README)
- [ ] Protótipos no Figma (link em `docs/PROTOTIPOS.md`)
- [ ] Collection do Postman (`postman/`)
- [ ] Histórico de commits mostrando a evolução
