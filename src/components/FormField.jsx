// Wires label, hint and error text to the control for assistive tech.
export default function FormField({ id, label, hint, error, children }) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className={`field${error ? ' field-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {hint && <p id={hintId} className="hint">{hint}</p>}
      {children({ 'aria-describedby': describedBy, 'aria-invalid': error ? 'true' : undefined })}
      {error && (
        <p id={errorId} className="error-text">
          <span aria-hidden="true">⚠ </span>{error}
        </p>
      )}
    </div>
  );
}