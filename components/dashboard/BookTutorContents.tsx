'use client';

import { useEffect } from 'react';
import { Check, Circle, List, MinusCircle, X } from 'lucide-react';

export type ContentsItem = {
  id: string;
  title: string;
  startIndex: number;
  stepCount: number;
  completedCount: number;
  status: 'completed' | 'in_progress' | 'not_started';
  looksLikeContents?: boolean;
};

export function ContentsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn !px-3 !py-1.5 text-[12.5px]"
      style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
      aria-haspopup="dialog"
    >
      <List size={14} />
      Contents
    </button>
  );
}

export default function BookTutorContents({
  items,
  currentChapterId,
  onOpen,
  busy,
  open,
  onClose,
}: {
  items: ContentsItem[];
  currentChapterId?: string;
  onOpen: (chapterId: string) => void;
  busy?: boolean;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return undefined;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !items.length) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/30 p-3 sm:items-center" onClick={onClose}>
      <div
        className="flex w-full max-w-[440px] max-h-[82vh] flex-col rounded-2xl border shadow-card"
        style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}
        role="dialog"
        aria-label="Course contents"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b px-4 py-3" style={{ borderColor: 'var(--line)' }}>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
              Course contents
            </p>
            <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
              Jump to a chapter. Skipping does not mark earlier chapters complete.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5"
            style={{ color: 'var(--ink-soft)' }}
            aria-label="Close contents"
          >
            <X size={18} />
          </button>
        </div>
        <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 py-2">
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
                    background: current ? 'var(--paper-dim)' : 'transparent',
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
      </div>
    </div>
  );
}
