import { downloadCSV, toCSV } from '../utils/csv'

/**
 * Botão reutilizável de exportação.
 * Props: rows, columns (ver utils/csv), filename, label
 */
function ExportButton({ rows, columns, filename, label = 'Exportar CSV' }) {
  function handleClick() {
    downloadCSV(filename, toCSV(rows, columns))
  }

  return (
    <button
      type="button"
      className="btn btn-ghost"
      onClick={handleClick}
      disabled={rows.length === 0}
    >
      {label}
    </button>
  )
}

export default ExportButton
