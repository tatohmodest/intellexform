'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Loader2, ShoppingBag } from 'lucide-react';

export default function GetBookButton({
  bookId,
  priceXAF,
  owned,
  compact = false,
}: {
  bookId: string;
  priceXAF: number;
  owned: boolean;
  compact?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const cls = compact ? 'btn btn-primary !px-4 !py-2 text-[12.5px]' : 'btn btn-primary !py-3 text-[14px]';

  if (owned) {
    return (
      <button className={cls} onClick={() => router.push(`/dashboard/library/${bookId}`)}>
        <BookOpen size={compact ? 14 : 16} /> Read
      </button>
    );
  }

  async function get() {
    setBusy(true);
    try {
      const res = await fetch(`/api/learn/books/${bookId}/purchase`, { method: 'POST' });
      if (res.ok) {
        router.push(`/dashboard/library/${bookId}`);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button className={cls} onClick={get} disabled={busy}>
      {busy ? (
        <Loader2 size={compact ? 14 : 16} className="animate-spin" />
      ) : priceXAF > 0 ? (
        <ShoppingBag size={compact ? 14 : 16} />
      ) : (
        <BookOpen size={compact ? 14 : 16} />
      )}
      {priceXAF > 0 ? `Buy · ${priceXAF.toLocaleString()} XAF` : 'Read free'}
    </button>
  );
}
