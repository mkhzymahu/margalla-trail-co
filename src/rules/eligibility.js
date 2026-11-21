import { LEVELS } from '../data/config.js';

/** R2: your level must be at least the level the hike requires. */
export function meetsLevel(userLevel, requiredLevel) {
  const user = LEVELS.indexOf(userLevel);
  const required = LEVELS.indexOf(requiredLevel);
  return user !== -1 && required !== -1 && user >= required;
}