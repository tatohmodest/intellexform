'use client';

import { useEffect } from 'react';
import { ensureServiceWorker } from '@/lib/push/browser';

/** Registers the PWA service worker (needed for install + Web Push). */
export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const register = () => {
      ensureServiceWorker()
        .then((reg) => {
          if (!reg) return;
          if (reg.waiting) {
            reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
          reg.addEventListener('updatefound', () => {
            const installing = reg.installing;
            installing?.addEventListener('statechange', () => {
              if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                installing.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          });
        })
        .catch(() => {
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
