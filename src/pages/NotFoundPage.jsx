import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';

export default function NotFoundPage() {
  usePageTitle('Page not found');
  return (
    <EmptyState
      title="We can't find that page"
      actions={<Link className="btn btn-primary" to="/sessions">Browse hikes</Link>}
    >
      <p>The link may be old or mistyped. Head back to the hikes to continue.</p>
    </EmptyState>
  );
}