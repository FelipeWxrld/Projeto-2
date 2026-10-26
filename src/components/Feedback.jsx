export function Loading({ text = 'Carregando...' }) {
  return (
    <div className="loading" role="status">
      <span className="spinner" aria-hidden="true" />
      {text}
    </div>
  )
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn btn-ghost" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  )
}
