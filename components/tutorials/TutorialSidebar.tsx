'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronDown, Menu, X } from 'lucide-react';
import type { TutorialCourse } from '@/lib/tutorials/types';

const LEVEL_LABEL: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export default function TutorialSidebar({
  course,
  activeSlug,
}: {
  course: TutorialCourse;
  activeSlug?: string;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      for (const section of course.sections) {
        if (next[section.id] === undefined) {
          next[section.id] = section.level === 'beginner';
        }
        if (section.lessons.some((l) => l.slug === activeSlug)) {
          next[section.id] = true;
        }
      }
      return next;
    });
  }, [activeSlug, course.sections]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function toggleSection(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const nav = (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-4" style={{ borderColor: 'var(--line)' }}>
        <Link
          href={`/tutorials/${course.slug}`}
          onClick={() => setOpen(false)}
          className="mb-1 inline-flex items-center gap-2 text-[13px] font-semibold"
          style={{ color: 'var(--green-deep)' }}
        >
          <BookOpen size={15} />
          {course.shortTitle} Tutorial
        </Link>
        <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
          {course.totalLessons} lessons · beginner to pro
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {course.sections.map((section) => {
          const isOpen = expanded[section.id] !== false;
          return (
            <div key={section.id} className="mb-1">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-[var(--paper-dim)]"
              >
                <span>
                  <span
                    className="mb-0.5 block font-mono text-[10px] uppercase tracking-[0.1em]"
                    style={{ color: section.level === 'beginner' ? 'var(--green-deep)' : section.level === 'intermediate' ? 'var(--blue-ink)' : '#8a4b16' }}
                  >
                    {LEVEL_LABEL[section.level]}
                  </span>
                  <span className="block text-[13.5px] font-semibold">{section.title}</span>
                </span>
                <ChevronDown
                  size={15}
                  className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  style={{ color: 'var(--ink-soft)' }}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden pb-2 pl-2"
                  >
                    {section.lessons.map((lesson) => {
                      const active = lesson.slug === activeSlug;
                      return (
                        <li key={lesson.slug}>
                          <Link
                            href={`/tutorials/${course.slug}/${lesson.slug}`}
                            onClick={() => setOpen(false)}
                            className="flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-[13px] leading-snug transition-colors"
                            style={{
                              background: active ? 'rgba(0,179,105,0.10)' : 'transparent',
                              color: active ? 'var(--ink)' : 'var(--ink-soft)',
                              fontWeight: active ? 600 : 400,
                            }}
                          >
                            <span className="mt-[2px] w-5 shrink-0 font-mono text-[11px]" style={{ color: active ? 'var(--green-deep)' : 'var(--ink-soft)' }}>
                              {String(lesson.order).padStart(2, '0')}
                            </span>
                            <span>{lesson.title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-[300px] shrink-0 border-r lg:block"
        style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
      >
        {nav}
      </aside>

      {/* Mobile toggle */}
      <div
        className="sticky top-[57px] z-30 flex items-center justify-between border-b px-4 py-2.5 lg:hidden"
        style={{ background: 'rgba(255,255,255,0.96)', borderColor: 'var(--line)', backdropFilter: 'blur(8px)' }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-[13px] font-semibold"
          style={{ background: 'var(--paper-dim)' }}
        >
          <Menu size={16} />
          Lessons
        </button>
        <span className="truncate text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
          {course.shortTitle} path
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/35"
              aria-label="Close lessons menu"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="absolute bottom-0 left-0 top-0 flex w-[min(92vw,340px)] flex-col"
              style={{ background: 'var(--paper)' }}
              initial={{ x: -24, opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--line)' }}>
                <span className="font-display text-[18px]">Curriculum</span>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full"
                  style={{ background: 'var(--paper-dim)' }}
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-hidden">{nav}</div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
