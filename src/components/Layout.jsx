import { Link, NavLink, Outlet } from 'react-router-dom';
import { useBooking } from '../context/BookingContext.jsx';
import { BUSINESS } from '../data/config.js';
import DemoPanel from './DemoPanel.jsx';

export default function Layout() {
  const { planCount } = useBooking();
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand">
            <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
              <path d="M2 26 11 9l6 10 4-7 9 14H2Z" fill="currentColor" />
              <path d="m12 26 7-11 3 4-5 7h-5Z" fill="#d87950" />
            </svg>
            {BUSINESS.name}
          </Link>
          <nav aria-label="Main">
            <ul className="nav-list">
              <li><NavLink to="/" end>Home</NavLink></li>
              <li><NavLink to="/sessions">Hikes</NavLink></li>
              <li>
                <NavLink to="/plan">
                  My plan <span className="count-badge">{planCount}<span className="visually-hidden"> hikes in plan</span></span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="container">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          <p>Student demo project for CS4032. Bookings are simulated: no payment is taken and no personal data is stored or sent.</p>
          <DemoPanel />
        </div>
      </footer>
    </>
  );
}