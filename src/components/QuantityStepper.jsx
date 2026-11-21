export default function QuantityStepper({ id, label, value, min, max, onChange, typed = false, describedBy }) {
  const isNum = Number.isFinite(value);
  const blocked = max < min;
  return (
    <div className="stepper">
      <label htmlFor={id} className="stepper-label">{label}</label>
      <div className="stepper-controls">
        <button
          type="button" className="btn btn-secondary btn-icon"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={blocked || (isNum && value <= min)}
          onClick={() => onChange(isNum ? value - 1 : min)}
        >−</button>
        {typed ? (
          <input
            id={id} className="stepper-input" type="number" inputMode="numeric"
            value={isNum ? value : ''} aria-describedby={describedBy}
            onChange={(e) => onChange(e.target.value === '' ? NaN : Number(e.target.value))}
          />
        ) : (
          <output id={id} className="stepper-value">{value}</output>
        )}
        <button
          type="button" className="btn btn-secondary btn-icon"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={blocked || (isNum && value >= max)}
          onClick={() => onChange(isNum ? value + 1 : min)}
        >+</button>
      </div>
    </div>
  );
}