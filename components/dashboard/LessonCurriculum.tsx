'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Circle, Menu, X } from 'lucide-react';
import TrackLogo from '@/components/TrackLogo';
import type { TutorialCourse } from '@/lib/tutorials/types';

/** Curriculum sidebar + mobile Lessons drawer for dashboard lesson player. */
export default function LessonCurriculum({
  course,
  trackSlug,
  trackColor,
  trackTitle,
  activeSlug,
  activeTitle,
  doneSlugs,
  pct,
  doneCount,
  totalLessons,
}: {
  course: TutorialCourse;
  trackSlug: string;
  trackColor: string;
  trackTitle: string;
  activeSlug: string;
  activeTitle: string;
  doneSlugs: string[];
  pct: number;
  doneCount: number;
  totalLessons: number;
}) {
  const [open, setOpen] = useState(false);
  const done = new Set(doneSlugs);

  useEffect(() => {
    setOpen(false);
  }, [activeSlug]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const list = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b p-4" style={{ borderColor: 'var(--line)' }}>
        <Link href={`/dashboard/courses/${trackSlug}`} className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <TrackLogo slug={trackSlug} color={trackColor} size={36} className="rounded-lg" />
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-semibold">{trackTitle}</div>
            <div className="text-[11.5px]" style={{ color: 'var(--ink-soft)' }}>
              {pct}% · {doneCount}/{totalLessons} lessons
            </div>
          </div>
        </Link>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--paper-dim)' }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${Math.max(pct, 2)}%`, background: 'var(--green)' }}
          />
        </div>
      </div>
      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
        {course.sections.map((section) => (
          <div key={section.id} className="mb-1">
            <div
              className="mono px-3 pb-1 pt-3 text-[10px] uppercase tracking-[0.14em]"
              style={{ color: 'var(--ink-soft)' }}
            >
              {section.title}
            </div>
            {section.lessons.map((l) => {
              const active = l.slug === activeSlug;
              const isDone = done.has(l.slug);
              return (
                <Link
                  key={l.slug}
                  href={`/dashboard/courses/${trackSlug}/${l.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px]"
                  style={
                    active
                      ? { background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)', fontWeight: 600 }
                      : { color: isDone ? 'var(--ink-soft)' : 'var(--ink)' }
                  }
                >
                  {isDone ? (
                    <CheckCircle2 size={14} style={{ color: 'var(--green)' }} className="shrink-0" />
                  ) : (
                    <Circle size={14} style={{ color: 'var(--line)' }} className="shrink-0" />
                  )}
                  <span className="min-w-0 break-words">{l.title}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop / large tablet sidebar */}
      <aside
        className="sticky top-[88px] hidden h-[calc(100vh-110px)] w-[290px] shrink-0 overflow-hidden rounded-2xl border lg:block"
        style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
      >
        {list}
      </aside>

      {/* Mobile / tablet curriculum bar */}
      <div
        className="sticky top-[64px] z-30 -mx-4 mb-4 border-b px-4 py-2.5 sm:-mx-6 sm:px-6 lg:hidden"
        style={{
          background: 'rgba(255,255,255,0.97)',
          borderColor: 'var(--line)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-semibold text-white"
            style={{ background: 'var(--green)' }}
            aria-expanded={open}
            aria-controls="dashboard-lesson-curriculum"
          >
            <Menu size={16} />
            Lessons
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: 'var(--ink-soft)' }}>
              {trackTitle}
            </div>
            <div className="truncate text-[13px] font-semibold leading-tight">{activeTitle}</div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="dashboard-lesson-curriculum"
            className="fixed inset-0 z-[80] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close lessons menu"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="absolute bottom-0 left-0 top-0 flex w-[min(100vw-2.5rem,340px)] max-w-full flex-col shadow-xl"
              style={{ background: 'var(--paper)' }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Course curriculum"
            >
              <div
                className="flex items-center justify-between border-b px-4 py-3"
                style={{ borderColor: 'var(--line)' }}
              >
                <span className="font-display text-[18px]">Lessons</span>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ background: 'var(--paper-dim)' }}
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden">{list}</div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
