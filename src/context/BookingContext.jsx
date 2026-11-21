import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { LEVELS, STORAGE_KEYS } from '../data/config.js';
import { useLocalStorageState } from '../hooks/useLocalStorageState.js';
import { loadSessions } from '../services/mockLoader.js';

const BookingContext = createContext(null);

const DEFAULT_DEMO = { fail: false, empty: false, lowAvailability: false };
const isValidPlan = (v) =>
  Array.isArray(v) && v.every((i) => i && typeof i.sessionId === 'string' && Number.isInteger(i.groupSize));
const isValidLevel = (v) => LEVELS.includes(v);
const isValidDemo = (v) => v && typeof v === 'object' && Object.keys(DEFAULT_DEMO).every((k) => typeof v[k] === 'boolean');
const isValidBooking = (v) => v === null || (v && typeof v.reference === 'string' && Array.isArray(v.items));

export function BookingProvider({ children }) {
  // Persisted state (FR13)
  const [plan, setPlan] = useLocalStorageState(STORAGE_KEYS.plan, [], isValidPlan);
  const [level, setLevel] = useLocalStorageState(STORAGE_KEYS.level, 'Beginner', isValidLevel);
  const [demo, setDemo] = useLocalStorageState(STORAGE_KEYS.demo, DEFAULT_DEMO, isValidDemo);
  const [lastBooking, setLastBooking] = useLocalStorageState(STORAGE_KEYS.booking, null, isValidBooking);

  // Loaded data (FR14)
  const [sessions, setSessions] = useState([]);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [error, setError] = useState('');
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false; // cleanup: ignore a response that arrives after a newer request started
    setStatus('loading');
    setError('');
    loadSessions(demo)
      .then((data) => {
        if (cancelled) return;
        setSessions(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [demo, reloadCount]);

  // A simulated failure applies until the user presses Retry, which then succeeds.
  const retry = useCallback(() => {
    setDemo((prev) => ({ ...prev, fail: false }));
    setReloadCount((c) => c + 1);
  }, [setDemo]);

  const setGroupSize = useCallback(
    (sessionId, groupSize) => {
      setPlan((prev) =>
        prev.some((i) => i.sessionId === sessionId)
          ? prev.map((i) => (i.sessionId === sessionId ? { ...i, groupSize } : i))
          : [...prev, { sessionId, groupSize }],
      );
    },
    [setPlan],
  );
  const removeFromPlan = useCallback((sessionId) => setPlan((prev) => prev.filter((i) => i.sessionId !== sessionId)), [setPlan]);
  const clearPlan = useCallback(() => setPlan([]), [setPlan]);

  // Derived values
  const sessionsById = useMemo(() => new Map(sessions.map((s) => [s.id, s])), [sessions]);
  const planLines = useMemo(
    () => plan.map((item) => ({ ...item, session: sessionsById.get(item.sessionId) ?? null })),
    [plan, sessionsById],
  );

  const value = useMemo(
    () => ({
      sessions, sessionsById, status, error, retry,
      demo, setDemo,
      plan, planLines, planCount: plan.length, setGroupSize, removeFromPlan, clearPlan,
      level, setLevel,
      lastBooking, setLastBooking,
    }),
    [sessions, sessionsById, status, error, retry, demo, setDemo, plan, planLines, setGroupSize, removeFromPlan, clearPlan, level, setLevel, lastBooking, setLastBooking],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}