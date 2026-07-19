'use client';

import { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';

const STORAGE_KEY = 'intellex_cookie_consent';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setShow(true), 800);
        return () => clearTimeout(t);
      }
    } catch {
      /* ignore */
    }
  }, []);

  function decide(value: 'accepted' | 'declined') {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] px-4 pb-4 sm:px-6 sm:pb-6">
      <div
        className="mx-auto flex max-w-3xl flex-col gap-4 rounded-[18px] border p-5 shadow-book sm:flex-row sm:items-center"
        style={{ background: 'var(--ink)', color: 'var(--paper)', borderColor: 'var(--line-soft)' }}
      >
        <div className="flex flex-1 items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(0,179,105,0.2)', color: 'var(--green)' }}>
            <Cookie size={18} />
          </span>
          <p className="text-[13.5px] leading-relaxed" style={{ color: 'rgba(251,248,240,0.82)' }}>
            We use cookies to keep you signed in, remember your choices, and understand how the
            academy is used — so we can keep making it better. See our{' '}
            <a href="#" className="underline" style={{ color: 'var(--green)' }}>cookie policy</a>.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => decide('declined')} className="btn btn-ghost" style={{ padding: '10px 18px', color: 'var(--paper)', borderColor: 'rgba(251,248,240,0.3)' }}>
            Decline
          </button>
          <button onClick={() => decide('accepted')} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            Accept all
          </button>
          <button onClick={() => decide('declined')} aria-label="Dismiss" className="flex h-9 w-9 items-center justify-center rounded-full sm:hidden" style={{ background: 'rgba(251,248,240,0.12)', color: 'var(--paper)' }}>
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
