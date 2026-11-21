import { GROUP_MAX, GROUP_MIN } from '../data/config.js';
import { meetsLevel } from './eligibility.js';
import { checkGroupSize, maxAllowedSize } from './groupSize.js';

/**
 * lines: [{ sessionId, groupSize, session | null }]
 * Returns conflicts with a suggested fix so the UI can explain and allow correction.
 */
export function findConflicts(lines, level) {
  const conflicts = [];
  for (const line of lines) {
    if (!line.session) {
      conflicts.push({
        sessionId: line.sessionId,
        type: 'missing',
        message: 'A hike in your saved plan is no longer available.',
        fix: 'remove',
      });
      continue;
    }
    const { session, groupSize } = line;
    const size = checkGroupSize(groupSize, session.seatsLeft);
    if (!size.ok) {
      const max = maxAllowedSize(session.seatsLeft);
      conflicts.push({
        sessionId: session.id,
        type: 'seats',
        message: `${session.title}: ${size.message}`,
        fix: max > 0 ? 'resize' : 'remove',
        fixSize: Math.min(Math.max(Number.isInteger(groupSize) ? groupSize : GROUP_MIN, GROUP_MIN), max, GROUP_MAX),
      });
    }
    if (!meetsLevel(level, session.level)) {
      conflicts.push({
        sessionId: session.id,
        type: 'level',
        message: `${session.title} needs ${session.level} level. Your level is ${level}.`,
        fix: 'remove',
      });
    }
  }
  return conflicts;
}