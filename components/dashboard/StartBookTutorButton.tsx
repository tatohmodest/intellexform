'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';

export default function StartBookTutorButton({
  bookId,
  compact = false,
}: {
  bookId: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function start() {
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch(`/api/learn/books/${bookId}/tutor`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not start the book tutor.');
      router.push(`/dashboard/library/learn/${data.id}`);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not start the book tutor.');
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={start}
        disabled={busy}
        className={compact ? 'btn btn-ghost !px-3 !py-1.5 text-[12.5px]' : 'btn btn-primary !px-5 !py-3 text-[14px]'}
      >
        {busy ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
        {busy ? 'Preparing…' : 'Learn with AI'}
      </button>
      {msg ? (
        <span className="max-w-[260px] text-[12px]" style={{ color: '#b91c1c' }}>
          {msg}
        </span>
      ) : null}
    </span>
  );
}
