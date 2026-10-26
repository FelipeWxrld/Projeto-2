import { useMemo, useState } from 'react'
import Card from './Card'
import LineChart from './LineChart'
import PeriodSelector from './PeriodSelector'
import Stats from './Stats'
import { Loading, ErrorMessage } from './Feedback'
import { useTimeSeries } from '../hooks/useTimeSeries'
import { summarize } from '../utils/stats'

function HistoryChart({ from, to }) {
  // O período só interessa a este componente, então o estado fica local
  const [days, setDays] = useState(30)
  const { points, loading, error, refetch } = useTimeSeries({ from, to, days })
  const summary = useMemo(() => summarize(points), [points])

  return (
    <Card
      title={`Histórico ${from} → ${to}`}
      actions={<PeriodSelector value={days} onChange={setDays} />}
    >
      {from === to && <p className="muted">Escolha moedas diferentes para ver o histórico.</p>}
      {loading && <Loading text="Carregando histórico..." />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}
      {!loading && !error && from !== to && (
        <>
          <Stats summary={summary} />
          <LineChart points={points} label={`Gráfico da taxa de ${from} para ${to}`} />
        </>
      )}
    </Card>
  )
}

export default HistoryChart
