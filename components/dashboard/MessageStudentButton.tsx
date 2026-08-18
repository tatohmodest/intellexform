'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, MessageSquare } from 'lucide-react';

export default function MessageStudentButton({
  studentId,
  studentName,
  courseTitle,
  accent = '#00b369',
}: {
  studentId: string;
  studentName: string;
  courseTitle?: string;
  accent?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function start() {
    setBusy(true);
    try {
      const res = await fetch('/api/learn/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          toUserId: studentId,
          toName: studentName,
          subject: courseTitle ? `${courseTitle} · ${studentName}` : `Chat with ${studentName}`,
          courseContext: courseTitle || null,
          body: `Hi ${studentName.split(/\s+/)[0] || 'there'}, I wanted to check in about your progress.`,
        }),
      });
      const data = await res.json();
      if (res.ok && data.thread?.id) {
        router.push(`/dashboard/messages/${data.thread.id}`);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={start}
      disabled={busy}
      className="inline-flex items-center gap-1.5 border px-3 py-1.5 text-[12.5px] font-semibold disabled:opacity-50"
      style={{ borderColor: 'var(--line)', color: accent }}
    >
      {busy ? <Loader2 size={12} className="animate-spin" /> : <MessageSquare size={12} />}
      Message
    </button>
  );
}
