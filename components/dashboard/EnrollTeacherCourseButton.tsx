'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import DirectPayForm from '@/components/payments/DirectPayForm';

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
      {isPaid ? (
        <DirectPayForm
          amountXAF={priceXAF}
          label="Pay & enrol"
          extraBody={{ kind: 'teacher_course', teacherCourseId: courseId }}
          onPaid={() => {
            setEnrolled(true);
            router.refresh();
          }}
        />
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={enrollFree}
          className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-white disabled:opacity-70"
          style={{ background: accent }}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : null}
          Enrol for free
        </button>
      )}
      {error && (
        <p className="mt-2 text-[13px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      )}
    </div>
  );
}
