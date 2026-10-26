import { Loading, ErrorMessage } from './Feedback'
import { formatMoney, formatRate, formatDate } from '../utils/format'

function ConversionResult({ amount, from, to, rate, date, loading, error, onRetry }) {
  if (loading) return <Loading text="Buscando cotação..." />
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />
  if (rate === null) return null

  const numericAmount = Number(amount)
  const hasAmount = amount !== '' && !Number.isNaN(numericAmount)

  return (
    <div className="result" aria-live="polite">
      <p className="result-from">
        {hasAmount ? formatMoney(numericAmount, from) : '—'} =
      </p>
      <p className="result-to">{hasAmount ? formatMoney(numericAmount * rate, to) : '—'}</p>
      <p className="muted result-meta">
        1 {from} = {formatRate(rate)} {to}
        {date && ` · cotação de ${formatDate(date)}`}
      </p>
    </div>
  )
}

export default ConversionResult
