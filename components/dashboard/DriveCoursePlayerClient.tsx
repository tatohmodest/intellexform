'use client';

import { useEffect, useState } from 'react';
import GoogleDriveCoursePlayer, { type DriveLessonItem } from '@/components/dashboard/GoogleDriveCoursePlayer';
import LessonStudyNotes from '@/components/dashboard/LessonStudyNotes';

export default function DriveCoursePlayerClient({
  courseSlug,
  courseTitle,
  lessons,
  googleDriveFolderUrl,
  trackColor = '#00b369',
}: {
  courseSlug: string;
  courseTitle: string;
  lessons: DriveLessonItem[];
  googleDriveFolderUrl?: string | null;
  trackColor?: string;
}) {
  const [items, setItems] = useState(lessons);
  const [activeLessonKey, setActiveLessonKey] = useState(String(lessons[0]?.id ?? lessons[0]?.slug ?? '0'));
  const [tab, setTab] = useState<'notes' | 'resources'>('notes');

  useEffect(() => {
    fetch(`/api/learn/progress?courseSlug=${encodeURIComponent(courseSlug)}`)
      .then((r) => r.json())
      .then((d) => {
        const done = new Set(
          (d.progress || []).map((p: { lessonSlug: string }) => String(p.lessonSlug)),
        );
        setItems((prev) =>
          prev.map((l) => ({
            ...l,
            completed: done.has(String(l.slug || l.id)),
          })),
        );
        const firstIncomplete = lessons.findIndex(
          (l) => !done.has(String(l.slug || l.id)),
        );
        if (firstIncomplete > 0) {
          const lesson = lessons[firstIncomplete];
          setActiveLessonKey(String(lesson.slug || lesson.id));
        }
      })
      .catch(() => {});
  }, [courseSlug, lessons]);

  async function markDone(lessonId: string | number) {
    const lesson = items.find((l) => String(l.id) === String(lessonId));
    const lessonSlug = String(lesson?.slug || lessonId);
    await fetch('/api/learn/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseSlug,
        lessonSlug,
        minutes: lesson?.durationMinutes || 10,
        done: true,
      }),
    });
    setItems((prev) =>
      prev.map((l) =>
        String(l.id) === String(lessonId) || String(l.slug) === lessonSlug
          ? { ...l, completed: true }
          : l,
      ),
    );
  }

  const initialIndex = Math.max(
    0,
    items.findIndex((l) => String(l.slug || l.id) === activeLessonKey),
  );

  return (
    <div className="space-y-6">
      <GoogleDriveCoursePlayer
        courseTitle={courseTitle}
        lessons={items}
        googleDriveFolderUrl={googleDriveFolderUrl}
        initialActiveIndex={initialIndex >= 0 ? initialIndex : 0}
        trackColor={trackColor}
        onLessonComplete={markDone}
        onActiveChange={(lesson) => setActiveLessonKey(String(lesson.slug || lesson.id))}
      />

      <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
        <div className="mb-3 flex gap-2">
          {(['notes', 'resources'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="border px-3 py-1.5 text-[12.5px] font-semibold capitalize"
              style={{
                borderColor: tab === t ? 'var(--ink)' : 'var(--line)',
                background: tab === t ? 'var(--ink)' : 'transparent',
                color: tab === t ? '#fff' : 'var(--ink-soft)',
              }}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === 'notes' ? (
          <LessonStudyNotes
            courseKey={courseSlug}
            lessonKey={activeLessonKey}
            accent={trackColor}
          />
        ) : (
          <div className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            {googleDriveFolderUrl ? (
              <p>
                Course materials live in the Google Drive folder linked above. Open it for PDFs,
                slides, and extra resources.
              </p>
            ) : (
              <p>No shared resource folder for this course yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
