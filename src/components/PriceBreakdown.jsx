export default function PriceBreakdown({ rows, total, totalLabel = 'Total' }) {
  return (
    <dl className="price-breakdown">
      {rows.map((r) => (
        <div key={r.label} className={`pb-row ${r.tone ?? ''}`}>
          <dt>{r.label}</dt>
          <dd>{r.value}</dd>
        </div>
      ))}
      <div className="pb-row pb-total">
        <dt>{totalLabel}</dt>
        <dd>{total}</dd>
      </div>
    </dl>
  );
}