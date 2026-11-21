export function LoadingPanel({ label = 'Loading hikes…' }) {
  return (
    <div className="status-panel" role="status">
      <span className="spinner" aria-hidden="true" /> {label}
    </div>
  );
}

export function ErrorPanel({ message, onRetry }) {
  return (
    <div className="status-panel notice err" role="alert">
      <h2>Something went wrong</h2>
      <p>{message}</p>
      <button type="button" className="btn btn-primary" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}