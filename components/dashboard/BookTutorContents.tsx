'use client';

import { Check, Circle, MinusCircle } from 'lucide-react';

export type ContentsItem = {
  id: string;
  title: string;
  startIndex: number;
  stepCount: number;
  completedCount: number;
  status: 'completed' | 'in_progress' | 'not_started';
  looksLikeContents?: boolean;
};

export default function BookTutorContents({
  items,
  currentChapterId,
  onOpen,
  busy,
}: {
  items: ContentsItem[];
  currentChapterId?: string;
  onOpen: (chapterId: string) => void;
  busy?: boolean;
}) {
  if (!items.length) return null;
  return (
    <nav className="mb-6 rounded-2xl border p-4" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }} aria-label="Course contents">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
        Course contents
      </p>
      <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
        Jump to any chapter. Skipping does not mark earlier chapters complete.
      </p>
      <ul className="mt-3 max-h-[320px] space-y-1 overflow-y-auto">
        {items.map((item) => {
          const current = item.id === currentChapterId;
          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={busy}
                onClick={() => onOpen(item.id)}
                className="flex w-full items-start gap-2 rounded-xl px-2 py-2 text-left text-[13.5px] leading-snug hover:opacity-90 disabled:opacity-50"
                style={{
                  background: current ? 'var(--paper)' : 'transparent',
                  color: 'var(--ink)',
                }}
              >
                <span className="mt-0.5 shrink-0" style={{ color: item.status === 'completed' ? 'var(--green-deep)' : 'var(--ink-soft)' }}>
                  {item.status === 'completed' ? (
                    <Check size={15} />
                  ) : item.status === 'in_progress' ? (
                    <MinusCircle size={15} />
                  ) : (
                    <Circle size={15} />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={current ? 'font-semibold' : ''}>{item.title}</span>
                  <span className="mt-0.5 block text-[11.5px]" style={{ color: 'var(--ink-soft)' }}>
                    {item.completedCount}/{item.stepCount} steps
                    {item.looksLikeContents ? ' · table of contents' : ''}
                    {current ? ' · here' : ''}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
