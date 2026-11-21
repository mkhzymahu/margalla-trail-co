import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import PriceBreakdown from '../components/PriceBreakdown.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import { ErrorPanel, LoadingPanel } from '../components/StatusPanels.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { GROUP_MIN, LEVELS } from '../data/config.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { maxAllowedSize } from '../rules/groupSize.js';
import { findConflicts } from '../rules/planChecks.js';
import { priceLine, summarisePlan } from '../rules/pricing.js';
import { formatDate, formatDuration, formatPKR, formatTime } from '../utils/format.js';

export default function PlanPage() {
  usePageTitle('My plan');
  const { status, error, retry, planLines, setGroupSize, removeFromPlan, level, setLevel } = useBooking();

  if (status === 'loading') return <LoadingPanel label="Checking your plan against current availability…" />;
  if (status === 'error') return <ErrorPanel message={error} onRetry={retry} />;

  if (planLines.length === 0) {
    return (
      <EmptyState title="Your plan is empty" actions={<Link className="btn btn-primary" to="/sessions">Browse hikes</Link>}>
        <p>Add a hike to start planning. Your plan is saved on this device.</p>
      </EmptyState>
    );
  }

  // Saved selections are re-checked against current data and rules every time.
  const conflicts = findConflicts(planLines, level);
  const validLines = planLines.filter((l) => l.session);
  const summary = summarisePlan(validLines, 0);
  const rows = [
    { label: 'Hikes', value: String(summary.sessions) },
    { label: 'Seats', value: String(summary.seats) },
    { label: 'Total hiking time', value: formatDuration(summary.hours) },
    { label: 'Subtotal', value: formatPKR(summary.subtotal) },
    ...(summary.discount > 0 ? [{ label: 'Group discounts', value: `− ${formatPKR(summary.discount)}`, tone: 'ok' }] : []),
  ];

  const applyFix = (c) => (c.fix === 'resize' ? setGroupSize(c.sessionId, c.fixSize) : removeFromPlan(c.sessionId));

  return (
    <>
      <h1>My plan</h1>

      {conflicts.length > 0 && (
        <section className="notice warn" role="alert" aria-labelledby="conflict-title">
          <h2 id="conflict-title">Some hikes need attention</h2>
          <ul className="plain-list">
            {conflicts.map((c) => (
              <li key={`${c.sessionId}-${c.type}`}>
                {c.message}{' '}
                {c.type === 'level' ? (
                  <span>Change your level below, or </span>
                ) : null}
                <button type="button" className="link-button" onClick={() => applyFix(c)}>
                  {c.fix === 'resize' ? `Reduce to ${c.fixSize}` : 'Remove from plan'}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="plan-layout">
        <section aria-labelledby="items-title">
          <h2 id="items-title">Selected hikes</h2>
          <div className="field">
            <label htmlFor="plan-level">Your experience level</label>
            <select id="plan-level" value={level} onChange={(e) => setLevel(e.target.value)}>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <ul className="plan-list">
            {planLines.map((l) =>
              l.session ? (
                <li key={l.sessionId} className="plan-item">
                  <div>
                    <h3 className="long-text"><Link to={`/sessions/${l.sessionId}`}>{l.session.title}</Link></h3>
                    <p className="meta">{formatDate(l.session.date)} · {formatTime(l.session.startTime)} · {l.session.level}</p>
                    <p>{formatPKR(priceLine(l.session.pricePerPerson, l.groupSize).total)} for {l.groupSize}</p>
                  </div>
                  <div className="plan-actions">
                    <QuantityStepper
                      id={`size-${l.sessionId}`} label="Group size" value={l.groupSize}
                      min={GROUP_MIN} max={maxAllowedSize(l.session.seatsLeft)}
                      onChange={(v) => setGroupSize(l.sessionId, v)}
                    />
                    <button type="button" className="btn btn-secondary" onClick={() => removeFromPlan(l.sessionId)}>
                      Remove<span className="visually-hidden"> {l.session.title}</span>
                    </button>
                  </div>
                </li>
              ) : (
                <li key={l.sessionId} className="plan-item plan-item-missing">
                  <p>
                    <span className="badge err">Unavailable</span> Hike "{l.sessionId}" is no longer offered.
                  </p>
                  <button type="button" className="btn btn-secondary" onClick={() => removeFromPlan(l.sessionId)}>Remove</button>
                </li>
              ),
            )}
          </ul>
        </section>

        <aside className="panel" aria-labelledby="summary-title">
          <h2 id="summary-title">Summary</h2>
          <PriceBreakdown rows={rows} total={formatPKR(summary.total)} totalLabel="Estimated total" />
          <p className="hint">A {formatPKR(400)} shuttle fee is added at the next step only if you choose the Saddar Metro meeting point.</p>
          {conflicts.length > 0 ? (
            <>
              <button type="button" className="btn btn-primary btn-block" disabled aria-describedby="blocked-note">Continue to booking details</button>
              <p id="blocked-note" className="error-text">Fix the hikes listed above to continue.</p>
            </>
          ) : (
            <Link className="btn btn-primary btn-block" to="/checkout">Continue to booking details</Link>
          )}
        </aside>
      </div>
    </>
  );
}