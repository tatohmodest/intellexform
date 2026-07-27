'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, PlayCircle } from 'lucide-react';

export default function EnrollButton({
  courseSlug,
  enrolled,
  continueHref,
  compact = false,
}: {
  courseSlug: string;
  enrolled: boolean;
  /** Where "Continue" goes once enrolled (next lesson). */
  continueHref: string;
  compact?: boolean;
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

  const cls = compact
    ? 'btn btn-primary !px-4 !py-2 text-[12.5px]'
    : 'btn btn-primary !py-3 text-[14px]';

  if (enrolled) {
    return (
      <button className={cls} onClick={() => router.push(continueHref)}>
        <PlayCircle size={compact ? 14 : 16} />
        Continue
      </button>
    );
  }
  return (
    <button className={cls} onClick={handleEnroll} disabled={busy}>
      {busy ? <Loader2 size={compact ? 14 : 16} className="animate-spin" /> : <Plus size={compact ? 14 : 16} />}
      Enroll free
    </button>
  );
}
