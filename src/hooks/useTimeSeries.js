import { useCallback, useEffect, useState } from 'react'
import { getTimeSeries } from '../services/frankfurter'
import { seriesToPoints } from '../utils/stats'
import { toISODate } from '../utils/format'

/**
 * Custom Hook: histórico de taxas entre duas moedas nos últimos `days` dias.
 * Retorna { points: [{ date, rate }], loading, error, refetch }.
 */
export function useTimeSeries({ from, to, days }) {
  const [points, setPoints] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const refetch = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    if (!from || !to || from === to) {
      setPoints([])
      setError(null)
      setLoading(false)
      return
    }

    const controller = new AbortController()

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getTimeSeries(
          { start: toISODate(new Date(), -days), end: toISODate(), base: from, symbols: to },
          controller.signal,
        )
        setPoints(seriesToPoints(data.rates, to))
      } catch (err) {
        if (err.name !== 'AbortError') {
          setPoints([])
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [from, to, days, reloadKey])

  return { points, loading, error, refetch }
}
