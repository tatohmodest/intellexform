import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

/**
 * Lightweight markdown-ish renderer for book chapters and posts:
 * code fences, headings (#/##), bold, inline code, bullets, numbered lists.
 */
export default function MarkdownLite({ text }: { text: string }) {
  const parts = text.split(/```/);
  return (
    <div>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <pre
            key={i}
            className="mono my-4 overflow-x-auto rounded-xl p-4 text-[13px] leading-relaxed"
            style={{ background: '#0C1116', color: '#d7e2ec' }}
          >
            <code>{part.replace(/^[a-z]*\n/, '')}</code>
          </pre>
        ) : (
          <Block key={i} text={part} />
        ),
      )}
    </div>
  );
}

function LessonLink({ href, children }: { href: string; children: ReactNode }) {
  const external = /^https?:\/\//i.test(href);
  const className =
    'font-semibold underline decoration-[1.5px] underline-offset-[3px] hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  const style = { color: 'var(--green-deep)', cursor: 'pointer' as const, textDecorationColor: 'var(--green-deep)' };
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}

function linkLabel(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host.charAt(0).toUpperCase() + host.slice(1);
  } catch {
    return url;
  }
}

function Inline({ text }: { text: string }) {
  const tokens = text.split(/(\[[^\]]+\]\(https?:\/\/[^)]+\)|https?:\/\/[^\s<>)"']+|\/dashboard\/[\w/-]+|\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <>
      {tokens.map((tok, ti) => {
        if (!tok) return null;
        const md = tok.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
        if (md) {
          return (
            <LessonLink key={ti} href={md[2]}>
              {md[1]}
            </LessonLink>
          );
        }
        if (/^https?:\/\//i.test(tok)) {
          const href = tok.replace(/[.,;:!?)]+$/g, '');
          return (
            <LessonLink key={ti} href={href}>
              {linkLabel(href)}
            </LessonLink>
          );
        }
        if (tok.startsWith('**') && tok.endsWith('**')) {
          return <strong key={ti}>{tok.slice(2, -2)}</strong>;
        }
        if (tok.startsWith('`') && tok.endsWith('`')) {
          return (
            <code
              key={ti}
              className="mono rounded px-1.5 py-0.5 text-[13px]"
              style={{ background: 'var(--paper-dim)' }}
            >
              {tok.slice(1, -1)}
            </code>
          );
        }
        if (tok.startsWith('/dashboard/')) {
          return (
            <LessonLink key={ti} href={tok}>
              {tok}
            </LessonLink>
          );
        }
        return <Fragment key={ti}>{tok}</Fragment>;
      })}
    </>
  );
}

function Block({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, li) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={li} className="h-3" />;
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={li} className="mb-2 mt-6 font-display text-[19px] leading-snug">
              <Inline text={trimmed.slice(3)} />
            </h3>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={li} className="mb-3 mt-8 font-display text-[23px] leading-tight">
              <Inline text={trimmed.slice(2)} />
            </h2>
          );
        }
        if (/^[-•]\s/.test(trimmed)) {
          return (
            <p key={li} className="mb-1.5 flex gap-2.5 pl-1 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: 'var(--green)' }} />
              <span><Inline text={trimmed.slice(2)} /></span>
            </p>
          );
        }
        if (/^\d+\.\s/.test(trimmed)) {
          const n = trimmed.match(/^(\d+)\./)?.[1];
          return (
            <p key={li} className="mb-1.5 flex gap-2.5 pl-1 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              <span className="font-semibold" style={{ color: 'var(--green-deep)' }}>{n}.</span>
              <span><Inline text={trimmed.replace(/^\d+\.\s/, '')} /></span>
            </p>
          );
        }
        return (
          <p key={li} className="mb-3 text-[15.5px] leading-[1.8]" style={{ color: 'var(--ink-soft)' }}>
            <Inline text={trimmed} />
          </p>
        );
      })}
    </>
  );
}
