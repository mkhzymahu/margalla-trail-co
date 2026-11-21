export function readJSON(key, fallback, isValid) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    const value = JSON.parse(raw);
    return isValid && !isValid(value) ? fallback : value;
  } catch {
    return fallback; // corrupted JSON or storage blocked
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: the app still works without persistence */
  }
}