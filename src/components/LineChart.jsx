import { useState } from 'react'
import { formatDate, formatRate } from '../utils/format'

const W = 640
const H = 280
const PAD = { top: 16, right: 16, bottom: 32, left: 56 }

/**
 * Gráfico de linha em SVG puro (sem bibliotecas).
 * Props: points = [{ date: 'YYYY-MM-DD', rate: number }]
 */
function LineChart({ points, label }) {
  const [hover, setHover] = useState(null) // índice do ponto sob o mouse

  if (points.length < 2) {
    return <p className="muted">Dados insuficientes para desenhar o gráfico.</p>
  }

  const values = points.map((p) => p.rate)
  const rawMin = Math.min(...values)
  const rawMax = Math.max(...values)
  const margin = (rawMax - rawMin || rawMax * 0.01) * 0.1
  const yMin = rawMin - margin
  const yMax = rawMax + margin

  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const x = (i) => PAD.left + (i / (points.length - 1)) * innerW
  const y = (v) => PAD.top + (1 - (v - yMin) / (yMax - yMin)) * innerH

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.rate).toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${x(points.length - 1).toFixed(1)},${PAD.top + innerH} L${x(0).toFixed(1)},${PAD.top + innerH} Z`

  const yTicks = Array.from({ length: 5 }, (_, i) => yMin + ((yMax - yMin) * i) / 4)
  const xTickIdx = [0, Math.floor((points.length - 1) / 2), points.length - 1]

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * W
    const ratio = (px - PAD.left) / innerW
    const idx = Math.round(ratio * (points.length - 1))
    setHover(Math.max(0, Math.min(points.length - 1, idx)))
  }

  const active = hover !== null ? points[hover] : null

  return (
    <div className="chart-wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="chart"
        role="img"
        aria-label={label}
        onMouseMove={handleMove}
        onMouseLeave={() => setHover(null)}
      >
        {yTicks.map((t) => (
          <g key={t}>
            <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="chart-grid" />
            <text x={PAD.left - 8} y={y(t) + 4} textAnchor="end" className="chart-tick">
              {formatRate(t)}
            </text>
          </g>
        ))}

        {xTickIdx.map((i, k) => (
          <text
            key={i}
            x={x(i)}
            y={H - 10}
            textAnchor={k === 0 ? 'start' : k === xTickIdx.length - 1 ? 'end' : 'middle'}
            className="chart-tick"
          >
            {formatDate(points[i].date)}
          </text>
        ))}

        <path d={areaPath} className="chart-area" />
        <path d={linePath} className="chart-line" />

        {active && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + innerH} className="chart-cursor" />
            <circle cx={x(hover)} cy={y(active.rate)} r="5" className="chart-dot" />
          </g>
        )}
      </svg>

      <p className="chart-readout" aria-live="polite">
        {active
          ? `${formatDate(active.date)} · ${formatRate(active.rate)}`
          : 'Passe o mouse sobre o gráfico para ver os valores'}
      </p>
    </div>
  )
}

export default LineChart
