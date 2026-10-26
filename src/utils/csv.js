// Exportação CSV pensada para abrir direto no Excel/Sheets em pt-BR:
// separador ";" (padrão do Excel brasileiro), vírgula decimal e BOM UTF-8 (acentos).

const SEPARATOR = ';'

function formatCell(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') return String(value).replace('.', ',')

  const text = String(value)
  // escapa aspas e protege campos com separador, aspas ou quebra de linha
  if (/[";\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

/**
 * columns: [{ header: 'Moeda', value: (row) => row.code }, ...]
 * rows:    array de objetos
 */
export function toCSV(rows, columns) {
  const head = columns.map((c) => formatCell(c.header)).join(SEPARATOR)
  const body = rows.map((row) => columns.map((c) => formatCell(c.value(row))).join(SEPARATOR))
  return [head, ...body].join('\r\n')
}

/** Dispara o download de um arquivo CSV no navegador. */
export function downloadCSV(filename, csvText) {
  const blob = new Blob(['﻿' + csvText], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}
