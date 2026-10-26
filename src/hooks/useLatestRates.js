import { useCallback, useEffect, useState } from 'react'
import { getLatestRates } from '../services/frankfurter'

/**
 * Custom Hook: taxas mais recentes de TODAS as moedas em relação a `base`.
 * Retorna { rates: { BRL: 5.43, ... }, date, loading, error, refetch }.
 */
export function useLatestRates(base) {
  const [rates, setRates] = useState({})
  const [date, setDate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const refetch = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    if (!base) return
    const controller = new AbortController()

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getLatestRates({ base }, controller.signal)
        setRates(data.rates)
        setDate(data.date)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setRates({})
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [base, reloadKey])

  return { rates, date, loading, error, refetch }
}
