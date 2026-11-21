import { GROUP_MAX, GROUP_MIN } from '../data/config.js';

/**
 * R1: a booking accepts GROUP_MIN to GROUP_MAX hikers and never more than the seats left.
 * Returns a plain object so it can be checked without any UI.
 */
export function checkGroupSize(size, seatsLeft, min = GROUP_MIN, max = GROUP_MAX) {
  if (seatsLeft <= 0) {
    return { ok: false, code: 'sold-out', message: 'This hike is full.' };
  }
  if (!Number.isInteger(size)) {
    return { ok: false, code: 'not-integer', message: 'Enter a whole number of hikers.' };
  }
  if (size < min) {
    return { ok: false, code: 'below-min', message: `A booking needs at least ${min} hiker.` };
  }
  if (size > max) {
    return { ok: false, code: 'above-max', message: `A booking accepts ${min} to ${max} hikers. Choose ${max} or fewer.` };
  }
  if (size > seatsLeft) {
    return {
      ok: false,
      code: 'not-enough-seats',
      message: `Only ${seatsLeft} seat${seatsLeft === 1 ? '' : 's'} left on this hike.`,
    };
  }
  return { ok: true, code: 'ok', message: '' };
}

/** Largest group size currently allowed for a hike. */
export function maxAllowedSize(seatsLeft, max = GROUP_MAX) {
  return Math.max(0, Math.min(max, seatsLeft));
}