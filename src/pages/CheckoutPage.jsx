import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import FormField from '../components/FormField.jsx';
import PriceBreakdown from '../components/PriceBreakdown.jsx';
import { ErrorPanel, LoadingPanel } from '../components/StatusPanels.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { LEVELS, MEETING_POINTS } from '../data/config.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { NAME_MAX, NOTES_MAX, validateBooking } from '../rules/formRules.js';
import { findConflicts } from '../rules/planChecks.js';
import { summarisePlan } from '../rules/pricing.js';
import { formatDuration, formatPKR } from '../utils/format.js';

const FOCUS_ID = { name: 'f-name', level: 'f-level', meetingPoint: 'f-meeting-0', notes: 'f-notes' };
const FIELD_LABEL = { name: 'Booking name', level: 'Experience level', meetingPoint: 'Meeting point', notes: 'Notes' };

export default function CheckoutPage() {
  usePageTitle('Booking details');
  const navigate = useNavigate();
  const { status, error, retry, planLines, level, setLevel, clearPlan, setLastBooking } = useBooking();

  const [form, setForm] = useState({ name: '', level, meetingPoint: '', notes: '' });
  const [touched, setTouched] = useState({});
  const [attempts, setAttempts] = useState(0);
  const summaryRef = useRef(null);

  const lines = useMemo(() => planLines.filter((l) => l.session), [planLines]);
  const errors = useMemo(() => validateBooking(form, lines), [form, lines]);
  const planProblems = useMemo(
    () => findConflicts(planLines, form.level).filter((c) => c.type !== 'level'),
    [planLines, form.level],
  );
  const point = MEETING_POINTS.find((p) => p.id === form.meetingPoint);
  const summary = useMemo(() => summarisePlan(lines, point ? point.fee : 0), [lines, point]);

  // Move focus to the error summary after a failed submit.
  useEffect(() => {
    if (attempts > 0) summaryRef.current?.focus();
  }, [attempts]);

  if (status === 'loading') return <LoadingPanel label="Checking availability…" />;
  if (status === 'error') return <ErrorPanel message={error} onRetry={retry} />;
  if (planLines.length === 0) {
    return (
      <EmptyState title="Your plan is empty" actions={<Link className="btn btn-primary" to="/sessions">Browse hikes</Link>}>
        <p>Add a hike before entering booking details.</p>
      </EmptyState>
    );
  }

  const attempted = attempts > 0;
  const shown = (field) => (touched[field] || attempted ? errors[field] : undefined);
  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value })); // valid input in other fields is preserved
    if (field === 'level') setLevel(value);
  };
  const blur = (field) => () => setTouched((prev) => ({ ...prev, [field]: true }));
  const errorFields = Object.keys(errors);
  const hasProblems = errorFields.length > 0 || planProblems.length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setAttempts((n) => n + 1);
    if (hasProblems) return;
    const booking = {
      reference: `MTC-${Date.now().toString(36).toUpperCase()}`,
      name: form.name.trim(),
      level: form.level,
      meetingPoint: point.label,
      items: lines.map((l) => ({ title: l.session.title, date: l.session.date, startTime: l.session.startTime, groupSize: l.groupSize })),
      summary,
    };
    setLastBooking(booking);
    clearPlan();
    navigate('/confirmation');
  };

  const rows = [
    { label: 'Hikes', value: String(summary.sessions) },
    { label: 'Seats', value: String(summary.seats) },
    { label: 'Total hiking time', value: formatDuration(summary.hours) },
    { label: 'Subtotal', value: formatPKR(summary.subtotal) },
    ...(summary.discount > 0 ? [{ label: 'Group discounts', value: `− ${formatPKR(summary.discount)}`, tone: 'ok' }] : []),
    { label: 'Meeting-point fee', value: point ? formatPKR(summary.fee) : 'Choose a meeting point' },
  ];

  return (
    <>
      <h1>Booking details</h1>
      <p className="notice info">Simulated booking: no payment is taken. Please use a nickname and don't enter personal details.</p>

      {attempted && hasProblems && (
        <div ref={summaryRef} tabIndex={-1} className="notice err" role="alert">
          <h2>Please fix {errorFields.length + planProblems.length} problem{errorFields.length + planProblems.length === 1 ? '' : 's'}</h2>
          <ul className="plain-list">
            {errorFields.map((f) => (
              <li key={f}>
                <button type="button" className="link-button" onClick={() => document.getElementById(FOCUS_ID[f])?.focus()}>
                  {FIELD_LABEL[f]}
                </button>: {errors[f]}
              </li>
            ))}
            {planProblems.map((c) => (
              <li key={`${c.sessionId}-${c.type}`}>{c.message} <Link to="/plan">Fix in your plan</Link></li>
            ))}
          </ul>
        </div>
      )}

      <div className="checkout-layout">
        <form onSubmit={handleSubmit} noValidate aria-label="Booking details">
          <FormField id="f-name" label="Booking name" hint={`Nickname is fine. Up to ${NAME_MAX} characters.`} error={shown('name')}>
            {(aria) => <input id="f-name" type="text" autoComplete="off" value={form.name} onChange={update('name')} onBlur={blur('name')} {...aria} />}
          </FormField>

          <FormField id="f-level" label="Experience level" hint="Each hike lists the level it needs." error={shown('level')}>
            {(aria) => (
              <select id="f-level" value={form.level} onChange={update('level')} onBlur={blur('level')} {...aria}>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            )}
          </FormField>

          <fieldset className={shown('meetingPoint') ? 'field-error' : undefined} aria-describedby={shown('meetingPoint') ? 'f-meeting-error' : undefined}>
            <legend>Meeting point</legend>
            {MEETING_POINTS.map((p, i) => (
              <label key={p.id} className="radio" htmlFor={`f-meeting-${i}`}>
                <input
                  id={`f-meeting-${i}`} type="radio" name="meetingPoint" value={p.id}
                  checked={form.meetingPoint === p.id} onChange={update('meetingPoint')} onBlur={blur('meetingPoint')}
                />
                <span>{p.label}: {p.fee === 0 ? 'no fee' : `${formatPKR(p.fee)} shuttle fee per booking`}</span>
              </label>
            ))}
            {shown('meetingPoint') && (
              <p id="f-meeting-error" className="error-text"><span aria-hidden="true">⚠ </span>{errors.meetingPoint}</p>
            )}
          </fieldset>

          <FormField id="f-notes" label="Notes (optional)" hint={`Up to ${NOTES_MAX} characters. Don't include personal details.`} error={shown('notes')}>
            {(aria) => <textarea id="f-notes" rows="3" value={form.notes} onChange={update('notes')} onBlur={blur('notes')} {...aria} />}
          </FormField>

          <div className="actions">
            <button type="submit" className="btn btn-primary">Confirm simulated booking</button>
            <Link className="btn btn-secondary" to="/plan">Back to plan</Link>
          </div>
        </form>

        <aside className="panel" aria-labelledby="review-title">
          <h2 id="review-title">Review summary</h2>
          <PriceBreakdown rows={rows} total={formatPKR(summary.total)} totalLabel="Total (simulated)" />
        </aside>
      </div>
    </>
  );
}