import { LOAD_DELAY_MS } from '../data/config.js';
import { SESSIONS } from '../data/sessions.js';

/**
 * Simulated network call. `options` are the labelled demo controls:
 *  fail            -> rejects (loading failure)
 *  empty           -> resolves [] (empty dataset)
 *  lowAvailability -> seats drop to 1, and s-02 sells out (changed availability)
 */
export function loadSessions({ fail = false, empty = false, lowAvailability = false } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error('Could not load hikes (simulated failure).'));
        return;
      }
      if (empty) {
        resolve([]);
        return;
      }
      resolve(
        SESSIONS.map((s) => {
          if (!lowAvailability) return { ...s };
          return { ...s, seatsLeft: s.id === 's-02' ? 0 : Math.min(s.seatsLeft, 1) };
        }),
      );
    }, LOAD_DELAY_MS);
  });
}