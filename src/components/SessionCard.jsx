import { Link } from 'react-router-dom';
import { GROUP_DISCOUNT_MIN_SIZE, GROUP_DISCOUNT_RATE } from '../data/config.js';
import { availability, formatDate, formatDistance, formatDuration, formatPKR, formatTime } from '../utils/format.js';
import TrailArt from './TrailArt.jsx';

export default function SessionCard({ session, plannedSize, backTo }) {
  const avail = availability(session);
  const soldOut = session.seatsLeft <= 0;
  return (
    <article className={`card${soldOut ? ' card-unavailable' : ''}`}>
      <TrailArt category={session.category} />
      <div className="card-body">
        <p className="meta">
          <span className={`badge ${avail.tone}`}>{avail.text}</span>
          {plannedSize ? <span className="badge info">In your plan: {plannedSize}</span> : null}
        </p>
        <h3 className="card-title">{session.title}</h3>
        <p className="meta">
          {session.trail} · {formatDate(session.date)} · {formatTime(session.startTime)}
        </p>
        <ul className="facts">
          <li>{formatDuration(session.durationHours)}</li>
          <li>{formatDistance(session.distanceKm)}</li>
          <li>Level: {session.level}</li>
        </ul>
        <p className="price">
          <strong>{formatPKR(session.pricePerPerson)}</strong> per person
          <span className="muted"> · {GROUP_DISCOUNT_RATE * 100}% off for {GROUP_DISCOUNT_MIN_SIZE}+ hikers</span>
        </p>
        <Link className="btn btn-secondary" to={`/sessions/${session.id}`} state={{ backTo }}>
          View details<span className="visually-hidden"> for {session.title}</span>
        </Link>
      </div>
    </article>
  );
}