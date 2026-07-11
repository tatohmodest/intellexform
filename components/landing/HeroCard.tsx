'use client';

import { useEffect, useState } from 'react';

const LEVELS = [
  { label: 'Level 1 — Variables & data types', state: 'done' },
  { label: 'Level 2 — Control flow & loops', state: 'done' },
  { label: 'Level 3 — Functions & scope', state: 'active' },
  { label: 'Level 4 — Classes & objects', state: 'locked' },
  { label: 'Level 5 — Files & error handling', state: 'locked' },
] as const;

const TAG = 'AI Tutor · Python Crash Course';

export default function HeroCard() {
  const [tag, setTag] = useState('');
  const [display, setDisplay] = useState<string[]>(LEVELS.map(() => ''));
  const [active, setActive] = useState(-1); // -1 while typing the tag
  const [complete, setComplete] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    // 1) type the tag
    const typeTag = (i: number) => {
      if (cancelled) return;
      setTag(TAG.slice(0, i));
      if (i <= TAG.length) wait(() => typeTag(i + 1), 26);
      else wait(() => typeLine(0, 0), 260);
    };

    // 2) type each level line, char by char
    const typeLine = (li: number, ci: number) => {
      if (cancelled) return;
      if (li >= LEVELS.length) {
        setActive(LEVELS.length);
        setComplete(true);
        return;
      }
      setActive(li);
      setDisplay((prev) => {
        const n = [...prev];
        n[li] = LEVELS[li].label.slice(0, ci);
        return n;
      });
      if (ci >= LEVELS[li].label.length) wait(() => typeLine(li + 1, 0), 200);
      else wait(() => typeLine(li, ci + 1), 22);
    };

    wait(() => typeTag(0), 350);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  // animate the progress bar once typing completes
  useEffect(() => {
    if (!complete) return;
    let v = 0;
    const id = setInterval(() => {
      v += 2;
      if (v >= 46) {
        v = 46;
        clearInterval(id);
      }
      setPct(v);
    }, 22);
    return () => clearInterval(id);
  }, [complete]);

  const Caret = () => (
    <span className="ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[2px] animate-pulse" style={{ background: 'var(--green)' }} />
  );

  return (
    <div className="relative overflow-hidden rounded-[20px] p-8 shadow-book" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
      <div className="absolute left-[-10px] top-4 bottom-4 w-2.5 rounded-l-md" style={{ background: 'var(--green)' }} />

      {/* computerized scanline sweep */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, #fff 3px, #fff 4px)' }} />

      <div className="relative mb-5">
        <div className="font-mono text-[11px] uppercase tracking-wide" style={{ color: 'var(--amber)', minHeight: 14 }}>
          {tag}
          {active === -1 && <Caret />}
        </div>
        <h3 className="mt-1.5 font-display text-[22px]">Studying with the author</h3>
      </div>

      <div className="relative my-5 flex flex-col gap-2.5">
        {LEVELS.map((lv, i) => {
          const revealed = i <= active || complete;
          const typed = display[i];
          const isDone = lv.state === 'done' && (i < active || complete);
          const isActiveRow = i === active && !complete;
          const idxBg =
            isDone ? 'var(--green)' : lv.state === 'active' ? 'var(--amber)' : 'rgba(251,248,240,0.14)';
          const idxColor = lv.state === 'locked' && !isDone ? 'rgba(251,248,240,0.5)' : 'var(--ink)';
          return (
            <div
              key={lv.label}
              className="flex items-center gap-3 rounded-[10px] px-3 py-2.5 font-mono text-[13px] transition-all duration-300"
              style={{
                background: 'rgba(251,248,240,0.06)',
                opacity: !revealed ? 0 : lv.state === 'locked' ? 0.55 : 1,
                transform: revealed ? 'translateX(0)' : 'translateX(-8px)',
              }}
            >
              <span
                className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full text-[11px]"
                style={{ background: idxBg, color: idxColor }}
              >
                {isDone ? '✓' : i + 1}
              </span>
              <span>
                {typed}
                {isActiveRow && <Caret />}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative flex items-center gap-3.5 border-t pt-4" style={{ borderColor: 'var(--line-soft)' }}>
        <div className="h-1.5 flex-1 overflow-hidden rounded-[10px]" style={{ background: 'rgba(251,248,240,0.12)' }}>
          <div className="h-full rounded-[10px] transition-[width] duration-200 ease-out" style={{ width: `${pct}%`, background: 'var(--green)' }} />
        </div>
        <div className="font-mono text-[13px]" style={{ minWidth: 34, textAlign: 'right' }}>{pct}%</div>
      </div>
    </div>
  );
}
