'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

type Lesson = {
  id: string;
  slug: string;
  title: string;
  contentType: string;
  contentMarkdown?: string | null;
  videoUrl?: string | null;
  durationSeconds?: number;
};

type Section = {
  id: string;
  title: string;
  lessons: Lesson[];
};

type CourseTree = {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  sections: Section[];
};

export default function OrgCoursePlayer({
  slug,
  courseId,
  accent = '#00b369',
}: {
  slug: string;
  courseId: string;
  accent?: string;
}) {
  const [course, setCourse] = useState<CourseTree | null>(null);
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/org/${encodeURIComponent(slug)}/learning?courseId=${encodeURIComponent(courseId)}`,
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load course');
      setCourse(data.course);
      const map: Record<string, boolean> = {};
      for (const p of data.progress || []) {
        if (p.completed) map[p.lessonId] = true;
      }
      setProgress(map);
      setProgressPercent(Number(data.progressPercent || 0));
      const firstLesson = data.course?.sections?.[0]?.lessons?.[0];
      setActiveLessonId((prev) => prev || firstLesson?.id || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  }, [slug, courseId]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const activeLesson = useMemo(() => {
    if (!course || !activeLessonId) return null;
    for (const s of course.sections) {
      const hit = s.lessons.find((l) => l.id === activeLessonId);
      if (hit) return hit;
    }
    return null;
  }, [course, activeLessonId]);

  async function markComplete() {
    if (!activeLesson) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/org/${encodeURIComponent(slug)}/learning`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'mark_progress',
          courseId,
          lessonId: activeLesson.id,
          completed: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setProgress((p) => ({ ...p, [activeLesson.id]: true }));
      if (typeof data.progressPercent === 'number') setProgressPercent(data.progressPercent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
        <Loader2 size={16} className="animate-spin" /> Loading course…
      </p>
    );
  }

  if (!course) {
    return (
      <div className="space-y-3">
        <p className="text-[14px]" style={{ color: '#b91c1c' }}>
          {error || 'Course not found'}
        </p>
        <Link href={`/dashboard/institutions/${slug}?tab=courses`} className="text-[13px] font-semibold">
          ← Back to courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--line)' }}>
        <div>
          <Link
            href={`/dashboard/institutions/${slug}?tab=courses`}
            className="mb-2 inline-flex items-center gap-1 text-[12px] font-semibold"
            style={{ color: 'var(--ink-soft)' }}
          >
            <ArrowLeft size={12} /> Courses
          </Link>
          <h1 className="font-display text-[28px] leading-tight">{course.title}</h1>
          {course.description ? (
            <p className="mt-2 max-w-2xl text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              {course.description}
            </p>
          ) : null}
        </div>
        <div className="min-w-[140px] text-right">
          <p className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
            Progress
          </p>
          <p className="font-display text-2xl font-bold" style={{ color: accent }}>
            {progressPercent}%
          </p>
        </div>
      </div>

      {error ? (
        <p className="text-[13px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4 border p-3" style={{ borderColor: 'var(--line)' }}>
          {course.sections.length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              No lessons yet.
            </p>
          ) : (
            course.sections.map((section) => (
              <div key={section.id}>
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                  {section.title}
                </p>
                <ul className="space-y-1">
                  {section.lessons.map((lesson) => {
                    const active = lesson.id === activeLessonId;
                    const done = progress[lesson.id];
                    return (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => setActiveLessonId(lesson.id)}
                          className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-[13px]"
                          style={{
                            background: active ? `${accent}18` : 'transparent',
                            color: active ? 'var(--ink)' : 'var(--ink-soft)',
                            fontWeight: active ? 600 : 500,
                          }}
                        >
                          {done ? (
                            <CheckCircle2 size={14} style={{ color: accent }} />
                          ) : (
                            <span className="inline-block h-3.5 w-3.5 border" style={{ borderColor: 'var(--line)' }} />
                          )}
                          <span className="line-clamp-2">{lesson.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </aside>

        <section className="min-w-0 border p-5" style={{ borderColor: 'var(--line)' }}>
          {!activeLesson ? (
            <p style={{ color: 'var(--ink-soft)' }}>Select a lesson to begin.</p>
          ) : (
            <>
              <h2 className="font-display text-[24px]">{activeLesson.title}</h2>
              <p className="mt-1 text-[12px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                {activeLesson.contentType}
              </p>

              {activeLesson.videoUrl ? (
                <div className="mt-5 aspect-video w-full overflow-hidden bg-black">
                  {activeLesson.videoUrl.includes('youtube') || activeLesson.videoUrl.includes('youtu.be') ? (
                    <iframe
                      title={activeLesson.title}
                      src={activeLesson.videoUrl.replace('watch?v=', 'embed/')}
                      className="h-full w-full"
                      allowFullScreen
                    />
                  ) : (
                    <video src={activeLesson.videoUrl} controls className="h-full w-full" />
                  )}
                </div>
              ) : null}

              {activeLesson.contentMarkdown ? (
                <div
                  className="prose prose-sm mt-5 max-w-none whitespace-pre-wrap text-[15px] leading-relaxed"
                  style={{ color: 'var(--ink)' }}
                >
                  {activeLesson.contentMarkdown}
                </div>
              ) : !activeLesson.videoUrl ? (
                <p className="mt-5 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                  Lesson content coming soon.
                </p>
              ) : null}

              <div className="mt-8">
                <button
                  type="button"
                  disabled={busy || progress[activeLesson.id]}
                  onClick={markComplete}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
                  style={{ background: accent }}
                >
                  {busy ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  {progress[activeLesson.id] ? 'Completed' : 'Mark complete'}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
