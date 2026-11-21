import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState.jsx';
import FilterBar from '../components/FilterBar.jsx';
import SessionCard from '../components/SessionCard.jsx';
import { ErrorPanel, LoadingPanel } from '../components/StatusPanels.jsx';
import { useBooking } from '../context/BookingContext.jsx';
import { LEVELS } from '../data/config.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { matchesQuery, querySessions, SORT_OPTIONS } from '../utils/sessionQuery.js';

export default function SessionsPage() {
  usePageTitle('Hikes');
  const { sessions, sessionsById, status, error, retry, plan } = useBooking();
  const [params, setParams] = useSearchParams();
  const location = useLocation();

  // Problem 2 fix: filter state lives in the URL, so Back/Forward and shared links restore it.
  const q = params.get('q') ?? '';
  const level = LEVELS.includes(params.get('level')) ? params.get('level') : 'all';
  const availableOnly = params.get('avail') === '1';
  const sort = SORT_OPTIONS.some((o) => o.value === params.get('sort')) ? params.get('sort') : 'soonest';
  const hasActiveFilters = Boolean(q.trim()) || level !== 'all' || availableOnly;

  const updateParam = (key, value) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === 'all' || (key === 'sort' && value === 'soonest')) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };
  const clearAll = () => setParams({}, { replace: true });

  const results = useMemo(
    () => querySessions(sessions, { q, level, availableOnly, sort }),
    [sessions, q, level, availableOnly, sort],
  );

  // Problem 3 fix: when nothing matches, offer real alternatives with seats.
  const alternatives = useMemo(() => {
    if (results.length > 0) return [];
    const byQuery = sessions.filter((s) => matchesQuery(s, q));
    const pool = byQuery.length > 0 ? byQuery : sessions;
    return querySessions(pool, { q: '', level: 'all', availableOnly: true, sort: 'soonest' }).slice(0, 3);
  }, [results, sessions, q]);

  // Planned hikes that current filters hide, so selections never silently disappear.
  const hiddenPlanned = useMemo(() => {
    const visible = new Set(results.map((s) => s.id));
    return plan.filter((i) => sessionsById.has(i.sessionId) && !visible.has(i.sessionId)).map((i) => sessionsById.get(i.sessionId));
  }, [plan, results, sessionsById]);

  if (status === 'loading') return <LoadingPanel />;
  if (status === 'error') return <ErrorPanel message={error} onRetry={retry} />;

  // Empty dataset is different from "no matches".
  if (sessions.length === 0) {
    return (
      <EmptyState
        title="No hikes are published right now"
        actions={<button type="button" className="btn btn-primary" onClick={retry}>Reload hikes</button>}
      >
        <p>There is nothing to search yet. New hikes are added every week, so check back soon.</p>
      </EmptyState>
    );
  }

  const planned = new Map(plan.map((i) => [i.sessionId, i.groupSize]));
  const backTo = `/sessions${location.search}`;

  return (
    <>
      <h1>Guided hikes</h1>
      <FilterBar
        q={q} level={level} availableOnly={availableOnly} sort={sort}
        onChange={updateParam} onClear={clearAll} hasActiveFilters={hasActiveFilters}
      />
      <p role="status" className="result-count">
        Showing {results.length} of {sessions.length} hikes
      </p>

      {hiddenPlanned.length > 0 && (
        <p className="notice info">
          {hiddenPlanned.length} hike{hiddenPlanned.length === 1 ? '' : 's'} in your plan {hiddenPlanned.length === 1 ? 'is' : 'are'} hidden by
          the current filters: {hiddenPlanned.map((s) => s.title).join(', ')}. Your selection is kept.
        </p>
      )}

      {results.length > 0 ? (
        <ul className="card-grid">
          {results.map((s) => (
            <li key={s.id}>
              <SessionCard session={s} plannedSize={planned.get(s.id)} backTo={backTo} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title="No hikes match your search"
          actions={<button type="button" className="btn btn-primary" onClick={clearAll}>Clear search and filters</button>}
        >
          <p>
            Nothing matches{q.trim() ? ` "${q.trim()}"` : ''}
            {level !== 'all' ? ` at ${level} level` : ''}
            {availableOnly ? ' with seats left' : ''}. Try a broader keyword, another level, or switch off "only hikes with seats left".
          </p>
          {alternatives.length > 0 && (
            <>
              <h3>Hikes you can still book</h3>
              <ul className="card-grid">
                {alternatives.map((s) => (
                  <li key={s.id}>
                    <SessionCard session={s} plannedSize={planned.get(s.id)} backTo={backTo} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </EmptyState>
      )}
    </>
  );
}