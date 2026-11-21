export const formatPKR = (n) => `PKR ${n.toLocaleString('en-US')}`;

export function formatDate(iso) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'pm' : 'am'}`;
}

export const formatDuration = (h) => `${h} hour${h === 1 ? '' : 's'}`;

// Missing data gets a clear fallback instead of "null km".
export const formatDistance = (km) => (km == null ? 'Distance to be confirmed' : `${km} km`);

// Availability is always text plus a tone, never colour alone.
export function availability(session) {
  const n = session.seatsLeft;
  if (n <= 0) return { tone: 'err', text: 'Full: no seats left' };
  if (n <= 3) return { tone: 'warn', text: `Only ${n} seat${n === 1 ? '' : 's'} left` };
  return { tone: 'ok', text: `${n} seats left` };
}