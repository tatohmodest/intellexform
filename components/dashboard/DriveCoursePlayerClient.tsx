'use client';

import { useEffect, useRef, useState } from 'react';
import GoogleDriveCoursePlayer, { type DriveLessonItem } from '@/components/dashboard/GoogleDriveCoursePlayer';
import LessonStudyNotes from '@/components/dashboard/LessonStudyNotes';
import LessonDiscussion from '@/components/dashboard/LessonDiscussion';
import LessonAiAssist from '@/components/dashboard/LessonAiAssist';

type ProgressRow = {
  lessonSlug: string;
  completedAt?: string | Date | null;
  lastPositionSec?: number;
};

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
  const [tab, setTab] = useState<'notes' | 'resources' | 'discussion' | 'ai'>('notes');
  const [positions, setPositions] = useState<Record<string, number>>({});
  const lastSaved = useRef(0);

  useEffect(() => {
    fetch(`/api/learn/progress?courseSlug=${encodeURIComponent(courseSlug)}`)
      .then((r) => r.json())
      .then((d) => {
        const rows = (d.progress || []) as ProgressRow[];
        const done = new Set(
          rows.filter((p) => p.completedAt).map((p) => String(p.lessonSlug)),
        );
        const pos: Record<string, number> = {};
        for (const p of rows) {
          if (typeof p.lastPositionSec === 'number') {
            pos[String(p.lessonSlug)] = p.lastPositionSec;
          }
        }
        setPositions(pos);
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
        positionSec: positions[lessonSlug] || 0,
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

  async function savePosition(lessonSlug: string, positionSec: number) {
    const now = Date.now();
    if (now - lastSaved.current < 4000) return;
    lastSaved.current = now;
    setPositions((prev) => ({ ...prev, [lessonSlug]: positionSec }));
    await fetch('/api/learn/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseSlug, lessonSlug, positionSec }),
    }).catch(() => {});
  }

  const initialIndex = Math.max(
    0,
    items.findIndex((l) => String(l.slug || l.id) === activeLessonKey),
  );
  const activeLesson = items.find((l) => String(l.slug || l.id) === activeLessonKey) || items[0];

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

      {activeLesson?.videoUrl && !String(activeLesson.videoUrl).includes('drive.google') ? (
        <NativeVideoResume
          key={activeLessonKey}
          src={String(activeLesson.videoUrl)}
          startAt={positions[activeLessonKey] || 0}
          onProgress={(sec) => void savePosition(activeLessonKey, sec)}
        />
      ) : positions[activeLessonKey] ? (
        <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Last study position saved at {Math.floor(positions[activeLessonKey] / 60)}m{' '}
          {positions[activeLessonKey] % 60}s (Drive embeds resume at the lesson level).
        </p>
      ) : null}

      <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
        <div className="mb-3 flex flex-wrap gap-2">
          {(['notes', 'resources', 'discussion', 'ai'] as const).map((t) => (
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
              {t === 'ai' ? 'AI' : t}
            </button>
          ))}
        </div>
        {tab === 'notes' ? (
          <LessonStudyNotes
            courseKey={courseSlug}
            lessonKey={activeLessonKey}
            accent={trackColor}
            timestampSec={positions[activeLessonKey]}
          />
        ) : null}
        {tab === 'resources' ? (
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
        ) : null}
        {tab === 'discussion' ? (
          <LessonDiscussion courseKey={courseSlug} lessonKey={activeLessonKey} accent={trackColor} />
        ) : null}
        {tab === 'ai' && activeLesson ? (
          <LessonAiAssist
            courseTitle={courseTitle}
            lessonTitle={activeLesson.title}
            courseKey={courseSlug}
            lessonKey={activeLessonKey}
            accent={trackColor}
          />
        ) : null}
      </div>
    </div>
  );
}

function NativeVideoResume({
  src,
  startAt,
  onProgress,
}: {
  src: string;
  startAt: number;
  onProgress: (sec: number) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !startAt) return;
    const onMeta = () => {
      if (startAt > 0 && startAt < (el.duration || Infinity)) {
        el.currentTime = startAt;
      }
    };
    el.addEventListener('loadedmetadata', onMeta);
    return () => el.removeEventListener('loadedmetadata', onMeta);
  }, [startAt]);

  return (
    <video
      ref={ref}
      src={src}
      controls
      className="aspect-video w-full bg-black"
      onTimeUpdate={(e) => onProgress(Math.floor(e.currentTarget.currentTime))}
    />
  );
}
