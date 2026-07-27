'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, PlayCircle } from 'lucide-react';

export default function EnrollButton({
  courseSlug,
  enrolled,
  continueHref,
  compact = false,
  editorial = false,
}: {
  courseSlug: string;
  enrolled: boolean;
  /** Where "Continue" goes once enrolled (next lesson). */
  continueHref: string;
  compact?: boolean;
  /** Sharp institutions-style CTA (no pill radius). */
  editorial?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleEnroll() {
    setBusy(true);
    try {
      const res = await fetch('/api/learn/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseSlug }),
      });
      if (res.ok) {
        router.push(continueHref);
        router.refresh();
        return;
      }
    } finally {
      setBusy(false);
    }
  }

  const cls = editorial
    ? 'inline-flex w-full items-center justify-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60'
    : compact
      ? 'btn btn-primary !px-4 !py-2 text-[12.5px]'
      : 'btn btn-primary w-full !py-3 text-[14px] sm:w-auto';

  const style = editorial ? { background: 'var(--green)' } : undefined;

  if (enrolled) {
    return (
      <button className={cls} style={style} onClick={() => router.push(continueHref)}>
        <PlayCircle size={compact || editorial ? 14 : 16} />
        Continue
      </button>
    );
  }
  return (
    <button className={cls} style={style} onClick={handleEnroll} disabled={busy}>
      {busy ? (
        <Loader2 size={compact || editorial ? 14 : 16} className="animate-spin" />
      ) : (
        <Plus size={compact || editorial ? 14 : 16} />
      )}
      Enroll free
    </button>
  );
}
