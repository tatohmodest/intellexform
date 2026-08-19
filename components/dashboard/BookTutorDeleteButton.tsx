'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function BookTutorDeleteButton({ pathId, title }: { pathId: string; title: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function remove() {
    if (!window.confirm(`Delete “${title}”? This removes the tutor and your progress.`)) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/learn/book-tutor/${pathId}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not delete that tutor.');
      router.push('/dashboard/library/learn');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete that tutor.');
      setBusy(false);
    }
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="text-[13px] font-semibold"
        style={{ color: '#b91c1c' }}
      >
        {busy ? <Loader2 size={14} className="mr-1 inline animate-spin" /> : null}
        Delete this tutor
      </button>
      {error ? (
        <p className="mt-1 text-[12.5px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
