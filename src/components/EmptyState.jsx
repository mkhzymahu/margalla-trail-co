export default function EmptyState({ title, children, actions }) {
  return (
    <section className="empty-state" aria-labelledby="empty-title">
      <h2 id="empty-title">{title}</h2>
      {children}
      {actions && <div className="actions">{actions}</div>}
    </section>
  );
}