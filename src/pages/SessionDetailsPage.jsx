import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import PriceBreakdown from '../components/PriceBreakdown.jsx';
import QuantityStepper from '../components/QuantityStepper.jsx';
import { ErrorPanel, LoadingPanel } from '../components/StatusPanels.jsx';
import TrailArt from '../components/TrailArt.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import {
  GROUP_DISCOUNT_MIN_SIZE, GROUP_DISCOUNT_RATE, GROUP_MAX, GROUP_MIN, LEVELS, MEETING_POINTS,
} from '../data/config.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { meetsLevel } from '../rules/eligibility.js';
import { checkGroupSize, maxAllowedSize } from '../rules/groupSize.js';
import { priceLine } from '../rules/pricing.js';
import { availability, formatDate, formatDistance, formatDuration, formatPKR, formatTime } from '../utils/format.js';

function SessionDetails({ id }) {
  const { status, error, retry, sessionsById, plan, setGroupSize, level, setLevel } = useBooking();
  const location = useLocation();
  const backTo = location.state?.backTo ?? '/sessions';
  const session = sessionsById.get(id);
  const planned = plan.find((i) => i.sessionId === id);
  const [size, setSize] = useState(planned?.groupSize ?? GROUP_MIN);
  const [added, setAdded] = useState(false);
  usePageTitle(session ? session.title : 'Hike details');

  if (status === 'loading') return <LoadingPanel label="Loading hike details…" />;
  if (status === 'error') return <ErrorPanel message={error} onRetry={retry} />;
  if (!session) {
    return (
      <EmptyState
        title="We can't find that hike"
        actions={<Link className="btn btn-primary" to="/sessions">Browse all hikes</Link>}
      >
        <p>No hike has the code "{id}". It may have been removed or the link may be mistyped.</p>
      </EmptyState>
    );
  }

  const avail = availability(session);
  const check = checkGroupSize(size, session.seatsLeft);
  const eligible = meetsLevel(level, session.level);
  const line = check.ok ? priceLine(session.pricePerPerson, size) : null;
  const canAdd = check.ok && eligible;
  const shuttle = MEETING_POINTS.find((p) => p.fee > 0);
  const limitText = `${GROUP_MIN} to ${GROUP_MAX} hikers per booking. ${session.seatsLeft} seat${session.seatsLeft === 1 ? '' : 's'} left.`;

  const rows = line
    ? [
        { label: `${size} × ${formatPKR(session.pricePerPerson)}`, value: formatPKR(line.subtotal) },
        ...(line.discount > 0
          ? [{ label: `Group discount (${GROUP_DISCOUNT_RATE * 100}%)`, value: `− ${formatPKR(line.discount)}`, tone: 'ok' }]
          : []),
      ]
    : [];

  const handleSize = (value) => {
    setSize(value);
    setAdded(false);
  };
  const handleAdd = () => {
    if (!canAdd) return;
    setGroupSize(session.id, size);
    setAdded(true);
  };

  return (
    <>
      <p><Link to={backTo}>← Back to hikes</Link></p>
      <div className="details-grid">
        <section className="details-intro" aria-labelledby="hike-title">
          <TrailArt category={session.category} />
          <h1 id="hike-title" className="long-text">{session.title}</h1>
          <p className="meta">{session.trail} · {session.area}</p>
          <ul className="facts big">
            <li>{formatDate(session.date)}, {formatTime(session.startTime)}</li>
            <li>{formatDuration(session.durationHours)}</li>
            <li>{formatDistance(session.distanceKm)}</li>
            <li>Level: {session.level}</li>
          </ul>
          <p className="price-hero">
            <strong>{formatPKR(session.pricePerPerson)}</strong> per person
            <span className={`badge ${avail.tone}`}>{avail.text}</span>
          </p>
        </section>

        {/* Problem 1 fix: the full price, discount and fee rules sit beside the quantity, before adding. */}
        <aside className="panel booking-panel" aria-labelledby="book-title">
          <h2 id="book-title">Book this hike</h2>

          <div className="field">
            <label htmlFor="level-select">Your experience level</label>
            <select id="level-select" value={level} onChange={(e) => { setLevel(e.target.value); setAdded(false); }}>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            <p className={eligible ? 'ok-text' : 'error-text'} role="status">
              {eligible
                ? `✓ You meet the ${session.level} requirement.`
                : `✗ This hike needs ${session.level} level or above. Change your level only if it is accurate.`}
            </p>
          </div>

          <QuantityStepper
            id="group-size" label="Group size" typed value={size}
            min={GROUP_MIN} max={maxAllowedSize(session.seatsLeft)}
            onChange={handleSize} describedBy="group-limit group-error"
          />
          <p id="group-limit" className="hint">{limitText}</p>
          {!check.ok && <p id="group-error" className="error-text" role="alert"><span aria-hidden="true">⚠ </span>{check.message}</p>}

          {line ? (
            <PriceBreakdown rows={rows} total={formatPKR(line.total)} totalLabel="Hike total" />
          ) : (
            <p className="hint">Enter a valid group size to see the price.</p>
          )}
          {check.ok && size === GROUP_DISCOUNT_MIN_SIZE - 1 && (
            <p className="notice info">Add one more hiker to get {GROUP_DISCOUNT_RATE * 100}% off this hike.</p>
          )}
          <p className="hint">
            Groups of {GROUP_DISCOUNT_MIN_SIZE}+ get {GROUP_DISCOUNT_RATE * 100}% off. Meeting at {shuttle.label.split(' (')[0]} adds a{' '}
            {formatPKR(shuttle.fee)} shuttle fee once per booking. Other meeting points have no fee.
          </p>

          <button type="button" className="btn btn-primary btn-block" disabled={!canAdd} onClick={handleAdd}>
            {planned ? 'Update plan' : 'Add to plan'}
          </button>
          {added && (
            <p className="notice ok" role="status">
              Saved to your plan ({size} hiker{size === 1 ? '' : 's'}). <Link to="/plan">Review plan</Link> or <Link to={backTo}>keep browsing</Link>.
            </p>
          )}
        </aside>

        <section className="details-more">
          <h2>About this hike</h2>
          <p>{session.summary}</p>
          <h3>Included</h3>
          <ul>{session.includes.map((i) => <li key={i}>{i}</li>)}</ul>
          <h3>What to bring</h3>
          <ul>{session.bring.map((i) => <li key={i}>{i}</li>)}</ul>
        </section>
      </div>
    </>
  );
}

// key={id} resets the local form state when the URL param changes.
export default function SessionDetailsPage() {
  const { id } = useParams();
  return <SessionDetails key={id} id={id} />;
}