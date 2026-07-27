'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CodeBlock({
  code,
  title,
  language = 'javascript',
}: {
  code: string;
  title?: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be unavailable; fail quietly.
    }
  }

  return (
    <div className="tutorial-code my-5 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--line)' }}>
      <div
        className="flex items-center justify-between gap-3 border-b px-4 py-2.5"
        style={{ background: 'var(--paper-dim)', borderColor: 'var(--line)' }}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="shrink-0 rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]"
            style={{ background: 'var(--amber-soft)', color: 'var(--blue-ink)' }}
          >
            {language}
          </span>
          {title && (
            <span className="truncate text-[13px] font-medium" style={{ color: 'var(--ink-soft)' }}>
              {title}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium transition-opacity hover:opacity-80"
          style={{ background: 'var(--paper)', color: 'var(--ink-soft)', border: '1px solid var(--line)' }}
          aria-label="Copy code"
        >
          {copied ? <Check size={13} style={{ color: 'var(--green-deep)' }} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        className="max-w-full overflow-x-auto p-3 text-[12.5px] leading-[1.65] sm:p-4 sm:text-[13.5px]"
        style={{ background: '#0C1116', color: '#E8EEF5' }}
      >
        <code className="font-mono whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
