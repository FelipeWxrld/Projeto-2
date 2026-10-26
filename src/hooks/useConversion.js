import { useCallback, useEffect, useState } from 'react'
import { getLatestRates } from '../services/frankfurter'

/**
 * Custom Hook: busca a taxa mais recente entre duas moedas.
 * O valor convertido NÃO é buscado na API: é calculado por quem usa o hook
 * (amount * rate), assim digitar um valor não dispara novas requisições.
 */
export function useConversion({ from, to }) {
  const [rate, setRate] = useState(null)
  const [date, setDate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const refetch = useCallback(() => setReloadKey((k) => k + 1), [])

  useEffect(() => {
    if (!from || !to) return

    // mesma moeda: taxa 1, sem chamar a API (a Frankfurter retornaria erro)
    if (from === to) {
      setRate(1)
      setDate(null)
      setError(null)
      setLoading(false)
      return
    }

    const controller = new AbortController()

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getLatestRates({ base: from, symbols: to }, controller.signal)
        setRate(data.rates[to])
        setDate(data.date)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setRate(null)
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [from, to, reloadKey])

  return { rate, date, loading, error, refetch }
}
