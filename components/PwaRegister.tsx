'use client';

import { useEffect } from 'react';

/** Registers the service worker so Chrome/Android can offer Install. */
export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV === 'development') return;

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* ignore registration failures */
      });
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register, { once: true });
    }
  }, []);

  return null;
}
