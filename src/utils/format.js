/** Formata um valor monetário no padrão brasileiro, com o código da moeda. */
export function formatMoney(value, code) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 4,
    }).format(value)
  } catch {
    // código de moeda que o Intl não reconhece
    return `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 4 }).format(value)} ${code}`
  }
}

/** Formata uma taxa de câmbio com até 6 casas decimais. */
export function formatRate(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value)
}

/** "2026-10-26" -> "26/10/2026" (sem passar por Date, evita problemas de fuso). */
export function formatDate(isoDate) {
  if (!isoDate) return ''
  const [y, m, d] = isoDate.split('-')
  return `${d}/${m}/${y}`
}

/** Data local no formato YYYY-MM-DD, com deslocamento opcional em dias. */
export function toISODate(date = new Date(), offsetDays = 0) {
  const d = new Date(date)
  d.setDate(d.getDate() + offsetDays)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
