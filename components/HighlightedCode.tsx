'use client';

import { highlightCode } from '@/lib/highlight';

/** Colored code for AI tutor / shared use. */
export default function HighlightedCode({
  code,
  language = 'javascript',
}: {
  code: string;
  language?: string;
}) {
  const lang = language.replace(/^\s+/, '').split(/\s+/)[0] || 'javascript';
  const tokens = highlightCode(code.replace(/^\n/, ''), lang);

  return (
    <code className="notranslate font-mono whitespace-pre" translate="no">
      {tokens.map((t, i) =>
        t.className ? (
          <span key={i} className={t.className}>
            {t.text}
          </span>
        ) : (
          <span key={i}>{t.text}</span>
        ),
      )}
    </code>
  );
}
