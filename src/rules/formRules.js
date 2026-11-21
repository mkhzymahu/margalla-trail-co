import { LEVELS, MEETING_POINTS } from '../data/config.js';
import { meetsLevel } from './eligibility.js';

export const NAME_MIN = 2;
export const NAME_MAX = 30;
export const NOTES_MAX = 120;

/** Returns an object of field -> message. Empty object means valid. */
export function validateBooking(form, lines) {
  const errors = {};
  const name = form.name.trim();

  if (!name) {
    errors.name = 'Enter a booking name. A nickname is fine.';
  } else if (name.length < NAME_MIN || name.length > NAME_MAX) {
    errors.name = `Booking name must be ${NAME_MIN} to ${NAME_MAX} characters (you entered ${name.length}).`;
  } else if (!/^[A-Za-z][A-Za-z .'-]*$/.test(name)) {
    errors.name = 'Use letters, spaces, apostrophes, dots or hyphens only. No digits or symbols.';
  }

  if (!LEVELS.includes(form.level)) {
    errors.level = 'Select your experience level.';
  } else {
    const blocker = lines.find((l) => l.session && !meetsLevel(form.level, l.session.level));
    if (blocker) {
      errors.level = `"${blocker.session.title}" needs ${blocker.session.level} level. You selected ${form.level}. Change your level or remove that hike from your plan.`;
    }
  }

  if (!MEETING_POINTS.some((p) => p.id === form.meetingPoint)) {
    errors.meetingPoint = 'Choose a meeting point.';
  }

  if (form.notes.length > NOTES_MAX) {
    errors.notes = `Notes can be up to ${NOTES_MAX} characters (currently ${form.notes.length}).`;
  }
  return errors;
}