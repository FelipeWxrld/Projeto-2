import { useMemo, useState } from 'react'
import Card from './Card'
import { Loading, ErrorMessage } from './Feedback'
import { useLatestRates } from '../hooks/useLatestRates'
import { buildRows, filterRows, sortRows } from '../utils/table'
import { formatDate, formatRate, formatMoney } from '../utils/format'

const COLUMNS = [
  { key: 'code', label: 'Moeda' },
  { key: 'name', label: 'Nome' },
  { key: 'rate', label: 'Taxa', numeric: true },
]

function RatesTable({ base, amount, currencies, selected, onSelect }) {
  const { rates, date, loading, error, refetch } = useLatestRates(base)

  // Filtro e ordenação são estados locais: só esta tabela usa
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ key: 'code', dir: 'asc' })

  const rows = useMemo(() => {
    const all = buildRows(rates, currencies)
    return sortRows(filterRows(all, query), sort.key, sort.dir)
  }, [rates, currencies, query, sort])

  function toggleSort(key) {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    )
  }

  const numericAmount = Number(amount)
  const hasAmount = amount !== '' && !Number.isNaN(numericAmount)

  return (
    <Card
      title={`Cotações de ${base}`}
      actions={
        <input
          type="search"
          className="search"
          placeholder="Filtrar moeda..."
          aria-label="Filtrar moedas"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      }
    >
      {loading && <Loading text="Carregando cotações..." />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {!loading && !error && (
        <>
          <p className="muted table-meta">
            {rows.length} {rows.length === 1 ? 'moeda' : 'moedas'}
            {date && ` · cotação de ${formatDate(date)}`}
            {' · clique em uma linha para usar como moeda de destino'}
          </p>

          <div className="table-scroll">
            <table className="rates">
              <thead>
                <tr>
                  {COLUMNS.map((col) => {
                    const active = sort.key === col.key
                    return (
                      <th
                        key={col.key}
                        className={col.numeric ? 'num' : ''}
                        aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
                      >
                        <button type="button" onClick={() => toggleSort(col.key)}>
                          {col.label}
                          <span aria-hidden="true">{active ? (sort.dir === 'asc' ? ' ▲' : ' ▼') : ''}</span>
                        </button>
                      </th>
                    )
                  })}
                  <th className="num">Valor convertido</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.code}
                    className={row.code === selected ? 'selected' : ''}
                    onClick={() => onSelect(row.code)}
                  >
                    <td>
                      <strong>{row.code}</strong>
                    </td>
                    <td>{row.name}</td>
                    <td className="num">{formatRate(row.rate)}</td>
                    <td className="num">{hasAmount ? formatMoney(numericAmount * row.rate, row.code) : '—'}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="muted empty">
                      Nenhuma moeda encontrada para “{query}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  )
}

export default RatesTable
