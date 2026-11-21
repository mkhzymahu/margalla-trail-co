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
        <div className="hero-copy">
          <p className="eyebrow">Islamabad · Margalla Hills</p>
          <h1 id="hero-title">A little further from the everyday.</h1>
          <p>
            Small-group sunrise, sunset and weekend hikes for university students and young professionals in
            Islamabad and Rawalpindi. Find a trail that fits your day.
          </p>
          <div className="actions">
            <Link className="btn btn-primary" to="/sessions">Browse hikes</Link>
            <Link className="btn btn-secondary" to="/plan">View my plan</Link>
          </div>
        </div>
        <figure className="hero-image">
          <img
            src="/hiking-trail.jpg"
            alt="Two hikers walking along a mountain trail"
          />
          <figcaption>Find your own pace outdoors.</figcaption>
        </figure>
      </section>

      <div className="home-details-grid">
        <section className="home-info" aria-labelledby="how-title">
          <p className="eyebrow">The simple bit</p>
          <h2 id="how-title">A few steps to the trail</h2>
          <ol className="steps">
            <li>Find a hike by date, level or availability.</li>
            <li>Check the details, seats and full price.</li>
            <li>Build your plan, then review before confirming.</li>
          </ol>
          <p className="home-note">Bookings are simulated for this student project. No payment is taken.</p>
        </section>

        <section className="home-info home-info-featured" aria-labelledby="rules-title">
          <p className="eyebrow">Before you set out</p>
          <h2 id="rules-title">Know before you book</h2>
          <ul className="home-rules">
            <li>{GROUP_MIN}–{GROUP_MAX} hikers per hike, subject to seats left.</li>
            <li>Choose a hike at or below your experience level.</li>
            <li>
              Groups of {GROUP_DISCOUNT_MIN_SIZE}+ get {GROUP_DISCOUNT_RATE * 100}% off.
              The {shuttle.label.split(',')[0]} shuttle is {formatPKR(shuttle.fee)} per booking.
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}