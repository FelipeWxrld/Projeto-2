import { formatDate, formatRate } from '../utils/format'

function Stat({ label, value, hint, tone }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className={`stat-value ${tone ?? ''}`}>{value}</span>
      {hint && <span className="stat-hint">{hint}</span>}
    </div>
  )
}

function Stats({ summary }) {
  if (!summary) return null
  const up = summary.changePct >= 0

  return (
    <div className="stats">
      <Stat label="Mínima" value={formatRate(summary.min)} hint={formatDate(summary.minDate)} />
      <Stat label="Máxima" value={formatRate(summary.max)} hint={formatDate(summary.maxDate)} />
      <Stat label="Média" value={formatRate(summary.avg)} />
      <Stat
        label="Variação"
        value={`${up ? '+' : ''}${summary.changePct.toFixed(2).replace('.', ',')}%`}
        tone={up ? 'up' : 'down'}
        hint="no período"
      />
    </div>
  )
}

export default Stats
