'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Loader2, ShoppingBag, Sparkles } from 'lucide-react';

export default function GetBookButton({
  bookId,
  priceXAF,
  owned,
  isMember = false,
  compact = false,
}: {
  bookId: string;
  priceXAF: number;
  owned: boolean;
  isMember?: boolean;
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

  // Paid books for non-members → student membership (library included).
  if (priceXAF > 0 && !isMember) {
    return (
      <Link href="/membership" className={cls}>
        <Sparkles size={compact ? 14 : 16} />
        {compact ? 'Student plan' : 'Included with Student plan'}
      </Link>
    );
  }

  async function get() {
    setBusy(true);
    try {
      const res = await fetch(`/api/learn/books/${bookId}/purchase`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (res.status === 402 && data.href) {
        router.push(data.href);
        return;
      }
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
