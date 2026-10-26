/** Junta { BRL: 5.4 } com { BRL: "Brazilian Real" } -> [{ code, name, rate }] */
export function buildRows(rates, currencies) {
  return Object.entries(rates).map(([code, rate]) => ({
    code,
    name: currencies[code] ?? code,
    rate,
  }))
}

/** Filtra por código ou nome da moeda (sem diferenciar maiúsculas/acentos). */
export function filterRows(rows, query) {
  const normalize = (s) =>
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim()

  const q = normalize(query)
  if (!q) return rows
  return rows.filter((r) => normalize(r.code).includes(q) || normalize(r.name).includes(q))
}

/** Ordena sem mutar o array original. key: 'code' | 'name' | 'rate'; dir: 'asc' | 'desc' */
export function sortRows(rows, key, dir) {
  const factor = dir === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => {
    if (key === 'rate') return (a.rate - b.rate) * factor
    return String(a[key]).localeCompare(String(b[key])) * factor
  })
}
