import { useEffect, useState } from 'react'
import { getCurrencies } from '../services/frankfurter'

/**
 * Custom Hook: carrega a lista de moedas suportadas uma única vez.
 * Retorna { currencies, loading, error }.
 */
export function useCurrencies() {
  const [currencies, setCurrencies] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const data = await getCurrencies(controller.signal)
        setCurrencies(data)
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort() // cleanup: cancela a requisição ao desmontar
  }, [])

  return { currencies, loading, error }
}
