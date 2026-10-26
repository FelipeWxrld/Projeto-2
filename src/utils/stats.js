/** Transforma a resposta da série temporal em array ordenado: [{ date, rate }] */
export function seriesToPoints(rates, target) {
  return Object.entries(rates)
    .map(([date, values]) => ({ date, rate: values[target] }))
    .filter((p) => typeof p.rate === 'number')
    .sort((a, b) => a.date.localeCompare(b.date))
}

/** Estatísticas básicas de uma lista de pontos. */
export function summarize(points) {
  if (!points.length) return null

  const values = points.map((p) => p.rate)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const avg = values.reduce((sum, v) => sum + v, 0) / values.length
  const first = values[0]
  const last = values[values.length - 1]
  const changePct = first ? ((last - first) / first) * 100 : 0

  return {
    min,
    max,
    avg,
    first,
    last,
    changePct,
    minDate: points[values.indexOf(min)].date,
    maxDate: points[values.indexOf(max)].date,
  }
}
