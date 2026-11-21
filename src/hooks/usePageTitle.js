import { useEffect } from 'react';
import { BUSINESS } from '../data/config.js';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} | ${BUSINESS.name}`;
  }, [title]);
}