import { Link } from 'react-router-dom';
import { GROUP_DISCOUNT_MIN_SIZE, GROUP_DISCOUNT_RATE, GROUP_MAX, GROUP_MIN, MEETING_POINTS } from '../data/config.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { formatPKR } from '../utils/format.js';

export default function HomePage() {
  usePageTitle('Guided Margalla hikes');
  const shuttle = MEETING_POINTS.find((p) => p.fee > 0);
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">Guided hikes in the Margalla Hills, built around your timetable</h1>
        <p>
          Small-group sunrise, sunset and weekend hikes for university students and young professionals in
          Islamabad and Rawalpindi. Pick a hike, set your group size and reserve seats in a few steps.
        </p>
        <div className="actions">
          <Link className="btn btn-primary" to="/sessions">Browse hikes</Link>
          <Link className="btn btn-secondary" to="/plan">View my plan</Link>
        </div>
      </section>

      <section aria-labelledby="how-title">
        <h2 id="how-title">How booking works</h2>
        <ol className="steps">
          <li>Search and filter the hikes.</li>
          <li>Open a hike to see the full price, conditions and seats left.</li>
          <li>Add it to your plan and adjust group sizes.</li>
          <li>Enter booking details and review the calculated total.</li>
          <li>Confirm. The booking is simulated.</li>
        </ol>
      </section>

      <section aria-labelledby="rules-title">
        <h2 id="rules-title">Know before you book</h2>
        <ul>
          <li>A booking takes {GROUP_MIN} to {GROUP_MAX} hikers, and never more than the seats left.</li>
          <li>Each hike has a required experience level. You can only book hikes at or below your level.</li>
          <li>
            Groups of {GROUP_DISCOUNT_MIN_SIZE} or more on one hike get {GROUP_DISCOUNT_RATE * 100}% off.
            The {shuttle.label.split(',')[0]} shuttle adds {formatPKR(shuttle.fee)} once per booking.
          </li>
        </ul>
      </section>
    </>
  );
}