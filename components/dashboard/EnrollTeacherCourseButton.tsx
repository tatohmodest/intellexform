'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';

export default function EnrollTeacherCourseButton({
  courseId,
  priceXAF,
  accent = '#00b369',
  audience,
}: {
  courseId: string;
  priceXAF: number;
  accent?: string;
  audience?: string;
}) {
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isPaid = priceXAF > 0;
  const allocated = audience === 'allocated';

  useEffect(() => {
    fetch(`/api/learn/teacher-courses/${courseId}/purchase`)
      .then((r) => r.json())
      .then((d) => setEnrolled(Boolean(d.enrolled)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId]);

  async function enrollFree() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/learn/teacher-courses/${courseId}/purchase`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not enrol');
      setEnrolled(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not enrol');
    } finally {
      setBusy(false);
    }
  }

  async function payAndEnrol() {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'teacher_course', teacherCourseId: courseId }),
      });
      const data = await res.json();
      if (!res.ok || !data.transactionUrl) {
        throw new Error(data.error || 'Could not start payment');
      }
      window.location.href = data.transactionUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not start payment');
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <button
        type="button"
        disabled
        className="mt-4 inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-white opacity-70"
        style={{ background: accent }}
      >
        <Loader2 size={14} className="animate-spin" /> Checking access…
      </button>
    );
  }

  if (enrolled) {
    return (
      <p className="mt-4 border px-4 py-2.5 text-center text-[13.5px] font-semibold" style={{ borderColor: accent, color: accent }}>
        You&apos;re enrolled - scroll to lessons
      </p>
    );
  }

  if (allocated) {
    return (
      <p className="mt-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        Your instructor adds students to this course. Ask them to search for you in Course Studio.
      </p>
    );
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        disabled={busy}
        onClick={isPaid ? payAndEnrol : enrollFree}
        className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-white disabled:opacity-70"
        style={{ background: accent }}
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : isPaid ? <Lock size={14} /> : null}
        {isPaid ? `Pay ${priceXAF.toLocaleString()} XAF & enrol` : 'Enrol for free'}
      </button>
      {isPaid && (
        <p className="mt-2 text-center text-[11.5px]" style={{ color: 'var(--ink-soft)' }}>
          PayUnit · MTN MoMo · Orange Money · Card
        </p>
      )}
      {error && (
        <p className="mt-2 text-[13px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      )}
    </div>
  );
}
