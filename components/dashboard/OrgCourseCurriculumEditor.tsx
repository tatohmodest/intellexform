'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Plus } from 'lucide-react';

export default function OrgCourseCurriculumEditor({
  slug,
  courseId,
  courseTitle,
  accent = '#00b369',
}: {
  slug: string;
  courseId: string;
  courseTitle: string;
  accent?: string;
}) {
  const [sections, setSections] = useState<
    { id: string; title: string; lessons: { id: string; title: string }[] }[]
  >([]);
  const [sectionTitle, setSectionTitle] = useState('');
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonSectionId, setLessonSectionId] = useState('');
  const [lessonMarkdown, setLessonMarkdown] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const res = await fetch(
      `/api/org/${encodeURIComponent(slug)}/learning?courseId=${encodeURIComponent(courseId)}`,
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed');
    setSections(
      (data.course?.sections || []).map((s: { id: string; title: string; lessons: { id: string; title: string }[] }) => ({
        id: s.id,
        title: s.title,
        lessons: (s.lessons || []).map((l) => ({ id: l.id, title: l.title })),
      })),
    );
  }, [slug, courseId]);

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed'));
  }, [load]);

  async function addSection(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/org/${encodeURIComponent(slug)}/learning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add_section', courseId, title: sectionTitle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setSectionTitle('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  async function addLesson(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`/api/org/${encodeURIComponent(slug)}/learning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_lesson',
          sectionId: lessonSectionId,
          title: lessonTitle,
          contentType: 'MARKDOWN',
          contentMarkdown: lessonMarkdown,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setLessonTitle('');
      setLessonMarkdown('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4 border p-4" style={{ borderColor: 'var(--line)' }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-[18px]">Curriculum · {courseTitle}</h3>
        <Link
          href={`/dashboard/institutions/${slug}/learn/${courseId}`}
          className="text-[13px] font-semibold"
          style={{ color: accent }}
        >
          Open learner player →
        </Link>
      </div>

      {error ? (
        <p className="text-[13px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}

      <ul className="space-y-2 text-[13px]">
        {sections.length === 0 ? (
          <li style={{ color: 'var(--ink-soft)' }}>No sections yet. Add one below.</li>
        ) : (
          sections.map((s) => (
            <li key={s.id}>
              <span className="font-semibold">{s.title}</span>
              <ul className="ml-4 mt-1 list-disc" style={{ color: 'var(--ink-soft)' }}>
                {s.lessons.map((l) => (
                  <li key={l.id}>{l.title}</li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>

      <form onSubmit={addSection} className="flex flex-wrap gap-2">
        <input
          className="form-input !rounded-none"
          required
          placeholder="Section title"
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-1 px-3 py-2 text-[13px] font-semibold text-white"
          style={{ background: accent }}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Add section
        </button>
      </form>

      <form onSubmit={addLesson} className="space-y-2">
        <select
          className="form-input !rounded-none"
          required
          value={lessonSectionId}
          onChange={(e) => setLessonSectionId(e.target.value)}
        >
          <option value="">Select section</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <input
          className="form-input !rounded-none"
          required
          placeholder="Lesson title"
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
        />
        <textarea
          className="form-input !rounded-none"
          rows={3}
          placeholder="Lesson markdown (optional)"
          value={lessonMarkdown}
          onChange={(e) => setLessonMarkdown(e.target.value)}
        />
        <button
          type="submit"
          disabled={busy || !lessonSectionId}
          className="border px-3 py-2 text-[13px] font-semibold"
          style={{ borderColor: 'var(--line)' }}
        >
          Add lesson
        </button>
      </form>
    </div>
  );
}
