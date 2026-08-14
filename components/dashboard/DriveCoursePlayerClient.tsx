'use client';

import { useEffect, useRef, useState } from 'react';
import GoogleDriveCoursePlayer, { type DriveLessonItem } from '@/components/dashboard/GoogleDriveCoursePlayer';
import LessonStudyNotes from '@/components/dashboard/LessonStudyNotes';
import LessonDiscussion from '@/components/dashboard/LessonDiscussion';
import LessonAiAssist from '@/components/dashboard/LessonAiAssist';
import LessonQuizPanel from '@/components/dashboard/LessonQuizPanel';
import VideoWithCaptions from '@/components/dashboard/VideoWithCaptions';

type ProgressRow = {
  lessonSlug: string;
  completedAt?: string | Date | null;
  lastPositionSec?: number;
};

type LessonItem = DriveLessonItem & { captionsUrl?: string | null };

export default function DriveCoursePlayerClient({
  courseSlug,
  courseTitle,
  lessons,
  googleDriveFolderUrl,
  trackColor = '#00b369',
}: {
  courseSlug: string;
  courseTitle: string;
  lessons: LessonItem[];
  googleDriveFolderUrl?: string | null;
  trackColor?: string;
}) {
  const [items, setItems] = useState(lessons);
  const [activeLessonKey, setActiveLessonKey] = useState(String(lessons[0]?.id ?? lessons[0]?.slug ?? '0'));
  const [tab, setTab] = useState<'quiz' | 'notes' | 'resources' | 'discussion' | 'ai'>('quiz');
  const [positions, setPositions] = useState<Record<string, number>>({});
  const [quizPassed, setQuizPassed] = useState(false);
  const lastSaved = useRef(0);

  useEffect(() => {
    setQuizPassed(false);
  }, [activeLessonKey]);

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
    if (!quizPassed) {
      setTab('quiz');
      return;
    }
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
  const nativeUrl =
    activeLesson?.videoUrl &&
    !String(activeLesson.videoUrl).includes('drive.google') &&
    !String(activeLesson.videoUrl).includes('youtube') &&
    !String(activeLesson.videoUrl).includes('youtu.be')
      ? String(activeLesson.videoUrl)
      : null;

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

      {nativeUrl ? (
        <div className="aspect-video overflow-hidden bg-black">
          <VideoWithCaptions
            key={activeLessonKey}
            src={nativeUrl}
            captionsUrl={activeLesson?.captionsUrl}
            startAt={positions[activeLessonKey] || 0}
            onProgress={(sec) => void savePosition(activeLessonKey, sec)}
          />
        </div>
      ) : positions[activeLessonKey] ? (
        <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Last study position saved at {Math.floor(positions[activeLessonKey] / 60)}m{' '}
          {positions[activeLessonKey] % 60}s (Drive embeds resume at the lesson level; captions
          require an HTML5 or VTT-capable source).
        </p>
      ) : null}

      <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {(['quiz', 'notes', 'resources', 'discussion', 'ai'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="shrink-0 border px-3 py-1.5 text-[12.5px] font-semibold capitalize"
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
        {tab === 'quiz' && activeLesson ? (
          <LessonQuizPanel
            courseKey={courseSlug}
            lessonKey={activeLessonKey}
            lessonTitle={activeLesson.title}
            accent={trackColor}
            onPassed={() => setQuizPassed(true)}
          />
        ) : null}
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
