'use client';

import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';

type Variant = 'light' | 'dark' | 'outline';

/**
 * Native share sheet when available (WhatsApp, etc.), otherwise copy link.
 * Pass the public absolute URL so link previews resolve correctly.
 */
export default function ShareCourseButton({
  url,
  title,
  text,
  variant = 'outline',
  accent,
  className = '',
  label = 'Share',
}: {
  url: string;
  title: string;
  text?: string;
  variant?: Variant;
  accent?: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function share() {
    if (busy) return;
    setBusy(true);
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
          await navigator.share({
            title,
            text: text || title,
            url,
          });
          return;
        } catch (err) {
          // User cancelled the sheet - don't fall through to copy.
          if (err instanceof DOMException && err.name === 'AbortError') return;
        }
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } finally {
      setBusy(false);
    }
  }

  const base =
    'inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-[13px] font-semibold transition-opacity disabled:opacity-60';

  const style =
    variant === 'dark'
      ? {
          border: '1px solid rgba(251,248,240,0.28)',
          color: 'rgba(251,248,240,0.92)',
          background: 'transparent',
        }
      : variant === 'light'
        ? {
            border: 'none' as const,
            color: '#fff',
            background: accent || 'var(--green)',
          }
        : {
            border: '1px solid var(--line)',
            color: 'var(--ink)',
            background: 'var(--paper)',
          };

  return (
    <button
      type="button"
      onClick={share}
      disabled={busy}
      className={`${base} ${className}`}
      style={style}
      aria-label={copied ? 'Link copied' : `Share ${title}`}
    >
      {copied ? <Check size={15} /> : <Share2 size={15} />}
      {copied ? 'Link copied' : label}
    </button>
  );
}
