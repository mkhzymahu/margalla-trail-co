import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import LeafConfetti from '../components/LeafConfetti.jsx';
import PriceBreakdown from '../components/PriceBreakdown.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { formatDate, formatDuration, formatPKR, formatTime } from '../utils/format.js';

export default function ConfirmationPage() {
  usePageTitle('Booking confirmed');
  const { lastBooking: b } = useBooking();
  const location = useLocation();
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    headingRef.current?.focus(); // announce the result to keyboard and screen-reader users
  }, []);

  useEffect(() => {
    if (!b || !location.state?.celebrateBooking) return;

    navigate(location.pathname, { replace: true, state: null });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setShowConfetti(true);
  }, [b, location.key, location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!showConfetti) return undefined;
    const timeout = window.setTimeout(() => setShowConfetti(false), 3400);
    return () => window.clearTimeout(timeout);
  }, [showConfetti]);

  if (!b) {
    return (
      <EmptyState title="No recent booking" actions={<Link className="btn btn-primary" to="/sessions">Browse hikes</Link>}>
        <p>Once you confirm a plan, the confirmation appears here.</p>
      </EmptyState>
    );
  }

  const s = b.summary;
  const rows = [
    { label: 'Seats', value: String(s.seats) },
    { label: 'Total hiking time', value: formatDuration(s.hours) },
    { label: 'Subtotal', value: formatPKR(s.subtotal) },
    ...(s.discount > 0 ? [{ label: 'Group discounts', value: `− ${formatPKR(s.discount)}`, tone: 'ok' }] : []),
    { label: 'Meeting-point fee', value: formatPKR(s.fee) },
  ];

  return (
    <>
      {showConfetti && <LeafConfetti />}
      <h1 ref={headingRef} tabIndex={-1}>Booking confirmed (simulated)</h1>
      <p className="notice ok" role="status">
        Reference <strong>{b.reference}</strong>. This is a demonstration: no real reservation was made and no payment was taken.
      </p>
      <div className="checkout-layout">
        <section aria-labelledby="conf-items">
          <h2 id="conf-items">Your hikes</h2>
          <ul className="plan-list">
            {b.items.map((i) => (
              <li key={`${i.title}-${i.date}`} className="plan-item">
                <div>
                  <h3 className="long-text">{i.title}</h3>
                  <p className="meta">{formatDate(i.date)} · {formatTime(i.startTime)} · {i.groupSize} hiker{i.groupSize === 1 ? '' : 's'}</p>
                </div>
              </li>
            ))}
          </ul>
          <p>Booked as <strong>{b.name}</strong> ({b.level}). Meeting point: {b.meetingPoint}.</p>
        </section>
        <aside className="panel" aria-labelledby="conf-total">
          <h2 id="conf-total">Summary</h2>
          <PriceBreakdown rows={rows} total={formatPKR(s.total)} totalLabel="Total (simulated)" />
        </aside>
      </div>
      <div className="actions">
        <Link className="btn btn-primary" to="/sessions">Book another hike</Link>
        <Link className="btn btn-secondary" to="/">Back to home</Link>
      </div>
    </>
  );
}