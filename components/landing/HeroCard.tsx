import { Check } from 'lucide-react';

const LEVELS = [
  'Level 1 — Variables & data types',
  'Level 2 — Control flow & loops',
  'Level 3 — Functions & scope',
  'Level 4 — Classes & objects',
  'Level 5 — Files & error handling',
];

/**
 * Hero "AI tutor" card. The checklist runs a continuous, looping computerized
 * process — levels tick one-by-one, the progress bar fills, then it resets and
 * repeats. Driven entirely by CSS keyframes (see globals.css `hc-*`) so it stays
 * smooth and never stalls.
 */
export default function HeroCard() {
  return (
    <div className="relative overflow-hidden rounded-[20px] p-8 shadow-book" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
      <div className="absolute left-[-10px] top-4 bottom-4 w-2.5 rounded-l-md" style={{ background: 'var(--green)' }} />

      {/* computerized scanline overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, #fff 3px, #fff 4px)' }} />

      <div className="relative mb-5 flex items-start justify-between">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wide" style={{ color: 'var(--amber)' }}>
            AI Tutor · Python Crash Course
          </div>
          <h3 className="mt-1.5 font-display text-[22px]">Studying with the author</h3>
        </div>
        <span className="mt-1 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wide" style={{ color: 'rgba(251,248,240,0.6)' }}>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: 'var(--green)' }} />
          running
        </span>
      </div>

      <div className="relative my-5 flex flex-col gap-2.5">
        {LEVELS.map((label, i) => (
          <div
            key={label}
            className={`hc-row hc-row-${i + 1} flex items-center gap-3 rounded-[10px] px-3 py-2.5 font-mono text-[13px]`}
            style={{ background: 'rgba(251,248,240,0.06)' }}
          >
            <span className="relative flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full text-[11px]" style={{ background: 'rgba(251,248,240,0.14)', color: 'var(--paper)' }}>
              <span>{i + 1}</span>
              <span
                className={`hc-check hc-check-${i + 1} absolute inset-0 flex items-center justify-center rounded-full`}
                style={{ background: 'var(--green)', color: 'var(--ink)', opacity: 0 }}
              >
                <Check size={13} strokeWidth={3.5} />
              </span>
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="relative flex items-center gap-3.5 border-t pt-4" style={{ borderColor: 'var(--line-soft)' }}>
        <div className="h-1.5 flex-1 overflow-hidden rounded-[10px]" style={{ background: 'rgba(251,248,240,0.12)' }}>
          <div className="hc-bar h-full rounded-[10px]" style={{ background: 'var(--green)' }} />
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px]" style={{ color: 'rgba(251,248,240,0.6)' }}>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: 'var(--amber)' }} />
          auto-grading
        </span>
      </div>
    </div>
  );
}
