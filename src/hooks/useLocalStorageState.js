import { useEffect, useState } from 'react';
import { readJSON, writeJSON } from '../utils/storage.js';

export function useLocalStorageState(key, initialValue, isValid) {
  const [value, setValue] = useState(() => readJSON(key, initialValue, isValid));
  useEffect(() => {
    writeJSON(key, value);
  }, [key, value]);
  return [value, setValue];
}