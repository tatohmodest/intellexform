'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';

export default function NewBookButton({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function create() {
    const title = window.prompt('Book title:');
    if (!title?.trim()) return;
    setBusy(true);
    try {
      const res = await fetch('/api/learn/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.id) {
        router.push(`/dashboard/mentor/books/${data.id}`);
        return;
      }
      window.alert(
        data.error === 'instructor_or_staff_required'
          ? 'Only instructors and staff can upload books to the library.'
          : 'Could not create the book.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={create}
      disabled={busy}
      className={`btn btn-primary !py-2.5 whitespace-nowrap text-[13.5px] ${className}`}
    >
      {busy ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
      Upload a book
    </button>
  );
}
