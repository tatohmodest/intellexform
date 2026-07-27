'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export default function LessonActions({
  courseSlug,
  lessonSlug,
  initiallyDone,
  prevHref,
  nextHref,
}: {
  courseSlug: string;
  lessonSlug: string;
  initiallyDone: boolean;
  prevHref: string | null;
  nextHref: string | null;
}) {
  const router = useRouter();
  const [done, setDone] = useState(initiallyDone);
  const [busy, setBusy] = useState(false);

  async function toggleDone(goNext: boolean) {
    setBusy(true);
    try {
      const res = await fetch('/api/learn/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug, lessonSlug, done: !done || goNext }),
      });
      if (res.ok) {
        setDone(!done || goNext);
        if (goNext && nextHref) {
          router.push(nextHref);
        }
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="mt-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
      style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
    >
      {prevHref ? (
        <Link href={prevHref} className="btn btn-ghost !px-5 !py-2.5 text-[13.5px]">
          <ArrowLeft size={15} /> Previous
        </Link>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-2.5">
        <button
          onClick={() => toggleDone(false)}
          disabled={busy}
          className="btn !px-5 !py-2.5 text-[13.5px]"
          style={
            done
              ? { background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }
              : { background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }
          }
        >
          {busy ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <CheckCircle2 size={15} />
          )}
          {done ? 'Completed · +20 XP' : 'Mark complete'}
        </button>
        {nextHref && (
          <button
            onClick={() => toggleDone(true)}
            disabled={busy}
            className="btn btn-primary !px-5 !py-2.5 text-[13.5px]"
          >
            Complete & next <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
