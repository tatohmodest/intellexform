'use client';

import { useState } from 'react';
import {
  Play,
  ExternalLink,
  Folder,
  CheckCircle2,
  ListVideo,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { toGoogleDriveEmbedUrl, extractGoogleDriveFolderId } from '@/lib/googleDrive';

export interface DriveLessonItem {
  id: string | number;
  slug?: string;
  title: string;
  videoUrl?: string | null;
  googleDriveUrl?: string | null;
  durationMinutes?: number | null;
  description?: string | null;
  completed?: boolean;
}

export default function GoogleDriveCoursePlayer({
  courseTitle,
  lessons,
  googleDriveFolderUrl,
  initialActiveIndex = 0,
  trackColor = '#00b369',
  onLessonComplete,
  onActiveChange,
}: {
  courseTitle: string;
  lessons: DriveLessonItem[];
  googleDriveFolderUrl?: string | null;
  initialActiveIndex?: number;
  trackColor?: string;
  onLessonComplete?: (lessonId: string | number) => void;
  onActiveChange?: (lesson: DriveLessonItem, index: number) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activeLesson = lessons[activeIndex] || lessons[0];

  function selectLesson(idx: number) {
    setActiveIndex(idx);
    const lesson = lessons[idx];
    if (lesson && onActiveChange) onActiveChange(lesson, idx);
  }

  // Determine active video embed URL
  const rawVideoUrl = activeLesson?.googleDriveUrl || activeLesson?.videoUrl || googleDriveFolderUrl || '';
  const embedUrl = toGoogleDriveEmbedUrl(rawVideoUrl);
  const folderId = googleDriveFolderUrl ? extractGoogleDriveFolderId(googleDriveFolderUrl) : null;
  const folderDirectLink = googleDriveFolderUrl || (folderId ? `https://drive.google.com/drive/folders/${folderId}` : null);

  const nextLesson = activeIndex < lessons.length - 1 ? lessons[activeIndex + 1] : null;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Main Video Player Section */}
      <div className="min-w-0 flex-1">
        {/* Top bar with Drive Folder link */}
        <div
          className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3 sm:px-4"
          style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
              style={{ background: trackColor }}
            >
              <ListVideo size={16} />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-[14px] font-semibold">{activeLesson?.title || courseTitle}</h2>
              <p className="truncate font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                {courseTitle} · Lesson {activeIndex + 1} of {lessons.length}
              </p>
            </div>
          </div>

          {folderDirectLink && (
            <a
              href={folderDirectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[11px] font-semibold transition-all hover:bg-white"
              style={{ borderColor: 'var(--line)', color: 'var(--ink)' }}
            >
              <Folder size={13} className="text-amber-500" />
              <span>View Google Drive Folder</span>
              <ExternalLink size={11} className="opacity-60" />
            </a>
          )}
        </div>

        {/* Video Frame */}
        <div
          className="relative aspect-video w-full overflow-hidden rounded-2xl border shadow-lg"
          style={{ borderColor: 'var(--line)', background: '#000' }}
        >
          {embedUrl ? (
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={activeLesson?.title || 'Google Drive Course Video'}
              className="h-full w-full border-0"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center text-white/70">
              <Folder size={48} className="mb-3 opacity-40" />
              <p className="text-[15px] font-medium">No direct video preview link configured</p>
              {folderDirectLink && (
                <a
                  href={folderDirectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
                >
                  <Folder size={16} /> Open Course Google Drive Folder
                </a>
              )}
            </div>
          )}
        </div>

        {/* Lesson Metadata & Next Controls */}
        <div className="mt-4 rounded-2xl border p-4 sm:p-5" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
                <Clock size={12} /> {activeLesson?.durationMinutes || 10} minutes
              </span>
              <h1 className="mt-1 font-display text-[20px] font-semibold sm:text-[22px]">{activeLesson?.title}</h1>
            </div>

            <div className="flex items-center gap-2">
              {onLessonComplete && (
                <button
                  type="button"
                  onClick={() => onLessonComplete(activeLesson.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[13px] font-medium transition-colors hover:bg-[var(--paper-dim)]"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <CheckCircle2 size={15} className="text-emerald-500" /> Mark as Done
                </button>
              )}
              {nextLesson && (
                <button
                  type="button"
                  onClick={() => selectLesson(Math.min(lessons.length - 1, activeIndex + 1))}
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: trackColor }}
                >
                  <span>Next Lesson</span>
                  <ChevronRight size={15} />
                </button>
              )}
            </div>
          </div>

          {activeLesson?.description && (
            <p className="mt-3 text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {activeLesson.description}
            </p>
          )}
        </div>
      </div>

      {/* Sidebar: Playlist & "Coming Up Next" */}
      <aside
        className="w-full shrink-0 rounded-2xl border lg:w-[340px]"
        style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
      >
        <div
          className="flex items-center justify-between border-b p-4"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="flex items-center gap-2">
            <ListVideo size={17} style={{ color: trackColor }} />
            <h3 className="font-display text-[16px] font-semibold">Course Lessons</h3>
          </div>
          <span className="rounded-full px-2.5 py-0.5 font-mono text-[10.5px] uppercase" style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }}>
            {lessons.length} items
          </span>
        </div>

        {/* Next Up Highlight Box */}
        {nextLesson && (
          <div
            className="m-3 rounded-xl border p-3"
            style={{
              borderColor: 'rgba(0,179,105,0.3)',
              background: 'rgba(0,179,105,0.06)',
            }}
          >
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
              <Sparkles size={12} /> Coming up next
            </div>
            <p className="mt-1 font-semibold text-[13.5px] text-gray-900 truncate">{nextLesson.title}</p>
            <button
              type="button"
              onClick={() => selectLesson(activeIndex + 1)}
              className="mt-2 text-[12px] font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
            >
              Play next <ChevronRight size={12} />
            </button>
          </div>
        )}

        {/* Playlist Items */}
        <div className="max-h-[520px] overflow-y-auto p-2">
          {lessons.map((lesson, idx) => {
            const isActive = idx === activeIndex;
            const isNext = idx === activeIndex + 1;

            return (
              <button
                key={lesson.id || idx}
                type="button"
                onClick={() => selectLesson(idx)}
                className={`mb-1 flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all ${
                  isActive
                    ? 'border bg-emerald-50/70 text-emerald-950 font-medium'
                    : 'hover:bg-[var(--paper-dim)] text-gray-700'
                }`}
                style={isActive ? { borderColor: 'rgba(0,179,105,0.4)' } : undefined}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold">
                  {isActive ? (
                    <Play size={13} className="text-emerald-600 fill-emerald-600 animate-pulse" />
                  ) : (
                    <span className="font-mono text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                      {idx + 1}
                    </span>
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="truncate text-[13.5px] leading-snug">{lesson.title}</span>
                    {isNext && (
                      <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-amber-800">
                        Next
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 font-mono text-[10.5px]" style={{ color: 'var(--ink-soft)' }}>
                    <span>{lesson.durationMinutes || 10} min</span>
                    {lesson.completed && (
                      <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold">
                        <CheckCircle2 size={10} /> Completed
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
