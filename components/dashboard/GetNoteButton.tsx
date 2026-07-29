'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, Loader2 } from 'lucide-react';

export default function GetNoteButton({
  noteId,
  priceXAF,
  owned = false,
  compact = false,
}: {
  noteId: string;
  priceXAF: number;
  owned?: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const cls = compact
    ? 'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold text-white'
    : 'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-semibold text-white';

  if (owned) {
    return (
      <Link href={`/dashboard/notes/${noteId}`} className={cls} style={{ background: 'var(--green)' }}>
        <FileText size={compact ? 13 : 14} /> Open
      </Link>
    );
  }

  async function buy() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch(`/api/learn/notes/${noteId}/purchase`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data.error || 'Could not add note');
        return;
      }
      router.push(`/dashboard/notes/${noteId}`);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={() => void buy()}
        className={cls}
        style={{ background: 'var(--green)' }}
      >
        {busy ? <Loader2 size={compact ? 13 : 14} className="animate-spin" /> : <FileText size={compact ? 13 : 14} />}
        {priceXAF > 0 ? `Get · ${priceXAF.toLocaleString()} XAF` : 'Add to shelf'}
      </button>
      {err && (
        <p className="mt-2 text-[12.5px]" style={{ color: '#b42318' }}>
          {err}
        </p>
      )}
    </div>
  );
}
