export const SORT_OPTIONS = [
  { value: 'soonest', label: 'Soonest first', compare: (a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`) },
  { value: 'price-asc', label: 'Price: low to high', compare: (a, b) => a.pricePerPerson - b.pricePerPerson },
  { value: 'price-desc', label: 'Price: high to low', compare: (a, b) => b.pricePerPerson - a.pricePerPerson },
  { value: 'shortest', label: 'Shortest first', compare: (a, b) => a.durationHours - b.durationHours },
];

export function matchesQuery(session, query) {
  const text = query.trim().toLowerCase();
  if (!text) return true;
  return [session.title, session.trail, session.area, session.category, session.summary]
    .join(' ')
    .toLowerCase()
    .includes(text);
}

export function querySessions(sessions, { q, level, availableOnly, sort }) {
  const compare = (SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0]).compare;
  return sessions
    .filter((s) => matchesQuery(s, q))
    .filter((s) => level === 'all' || s.level === level)
    .filter((s) => !availableOnly || s.seatsLeft > 0)
    .sort(compare); // filter() already made a new array, so this does not mutate state
}