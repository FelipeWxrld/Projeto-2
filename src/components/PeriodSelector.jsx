export const PERIODS = [
  { days: 7, label: '7 dias' },
  { days: 30, label: '30 dias' },
  { days: 90, label: '90 dias' },
  { days: 365, label: '1 ano' },
]

function PeriodSelector({ value, onChange }) {
  return (
    <div className="segmented" role="group" aria-label="Período do histórico">
      {PERIODS.map((p) => (
        <button
          key={p.days}
          type="button"
          className={p.days === value ? 'active' : ''}
          aria-pressed={p.days === value}
          onClick={() => onChange(p.days)}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}

export default PeriodSelector
