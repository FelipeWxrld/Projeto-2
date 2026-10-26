// Camada de acesso à API Frankfurter (https://frankfurter.dev)
// Toda comunicação HTTP fica aqui, os componentes e hooks só chamam estas funções.

const BASE_URL = 'https://api.frankfurter.dev/v1'

async function request(path, params = {}, signal) {
  const url = new URL(`${BASE_URL}${path}`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  const response = await fetch(url, { signal })

  if (!response.ok) {
    let detail = ''
    try {
      const body = await response.json()
      detail = body.message ? `: ${body.message}` : ''
    } catch {
      // resposta sem corpo JSON, ignora
    }
    throw new Error(`Erro ${response.status} ao consultar a API${detail}`)
  }

  return response.json()
}

/** GET /currencies -> { USD: "United States Dollar", ... } */
export function getCurrencies(signal) {
  return request('/currencies', {}, signal)
}

/** GET /latest?base=USD&symbols=BRL,EUR */
export function getLatestRates({ base, symbols } = {}, signal) {
  return request(
    '/latest',
    { base, symbols: Array.isArray(symbols) ? symbols.join(',') : symbols },
    signal,
  )
}

/** GET /{data}?base=USD&symbols=BRL  (taxa de um dia específico) */
export function getHistoricalRates({ date, base, symbols }, signal) {
  return request(
    `/${date}`,
    { base, symbols: Array.isArray(symbols) ? symbols.join(',') : symbols },
    signal,
  )
}

/** GET /{inicio}..{fim}?base=USD&symbols=BRL  (série temporal) */
export function getTimeSeries({ start, end, base, symbols }, signal) {
  return request(
    `/${start}..${end ?? ''}`,
    { base, symbols: Array.isArray(symbols) ? symbols.join(',') : symbols },
    signal,
  )
}
