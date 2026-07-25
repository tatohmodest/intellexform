'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Loader2,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import {
  filterCourses,
  filterTutorialSearchIndex,
  type CourseSearchItem,
  type TutorialSearchItem,
} from '@/lib/tutorials/searchFilter';
import { TUTORIAL_NAV } from '@/lib/tutorials/nav';

export type { CourseSearchItem };

type Suggestion =
  | { key: string; kind: 'course'; href: string; title: string; meta: string }
  | { key: string; kind: 'tutorial'; href: string; title: string; meta: string }
  | { key: string; kind: 'lesson'; href: string; title: string; meta: string }
  | { key: string; kind: 'action'; href: string; title: string; meta: string };

const POPULAR = [
  { label: 'JavaScript', q: 'JavaScript' },
  { label: 'Python', q: 'Python' },
  { label: 'Next.js', q: 'Next.js' },
  { label: 'Docker', q: 'Docker' },
  { label: 'NestJS', q: 'NestJS' },
  { label: 'Data Analysis', q: 'Data Analysis' },
  { label: 'Cybersecurity', q: 'Cybersecurity' },
  { label: 'Flutter', q: 'Flutter' },
];

function buildSuggestions(
  courses: CourseSearchItem[],
  tutorials: TutorialSearchItem[],
  query: string,
): Suggestion[] {
  const courseHits = filterCourses(courses, query, 5);
  const tutorialHits = filterTutorialSearchIndex(tutorials, query, 10);
  const tutorialCourses = tutorialHits.filter((i) => i.kind === 'tutorial');
  const tutorialLessons = tutorialHits.filter((i) => i.kind === 'lesson').slice(0, 5);

  const items: Suggestion[] = [
    ...courseHits.map((c) => ({
      key: `course-${c.slug}`,
      kind: 'course' as const,
      href: `/courses/${c.slug}`,
      title: c.name,
      meta: c.type || 'Course',
    })),
    ...tutorialCourses.map((item) => ({
      key: `tutorial-${item.href}`,
      kind: 'tutorial' as const,
      href: item.href,
      title: item.title,
      meta: item.tag || 'Free tutorial path',
    })),
    ...tutorialLessons.map((item) => ({
      key: `lesson-${item.href}`,
      kind: 'lesson' as const,
      href: item.href,
      title: item.title,
      meta: `${item.courseTitle}${item.level ? ` · ${item.level}` : ''}`,
    })),
  ];

  if (query.trim()) {
    items.push({
      key: `action-all-${query}`,
      kind: 'action',
      href: `/search?q=${encodeURIComponent(query.trim())}`,
      title: `View all results for “${query.trim()}”`,
      meta: 'Courses, tutorials & lessons',
    });
  }

  return items;
}

function SuggestionIcon({ kind }: { kind: Suggestion['kind'] }) {
  if (kind === 'course') {
    return (
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }}
      >
        <GraduationCap size={16} />
      </span>
    );
  }
  if (kind === 'tutorial') {
    return (
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: 'var(--amber-soft)', color: 'var(--blue-ink)' }}
      >
        <BookOpen size={16} />
      </span>
    );
  }
  if (kind === 'action') {
    return (
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
        style={{ background: 'var(--paper-dim)', color: 'var(--ink)' }}
      >
        <ArrowRight size={16} />
      </span>
    );
  }
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
      style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }}
    >
      <BookOpen size={16} />
    </span>
  );
}

export default function SiteSearch({
  tutorialIndex,
  courses = [],
  placeholder = 'Search courses, tutorials, skills…',
  className = '',
  compact = false,
  variant = 'page',
  loading = false,
  onFocusSearch,
  onNavigate,
  autoFocus = false,
}: {
  tutorialIndex: TutorialSearchItem[];
  courses?: CourseSearchItem[];
  placeholder?: string;
  className?: string;
  compact?: boolean;
  variant?: 'page' | 'header';
  loading?: boolean;
  onFocusSearch?: () => void;
  onNavigate?: () => void;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [panelBox, setPanelBox] = useState<{ top: number; left: number; width: number } | null>(null);

  const suggestions = useMemo(
    () => (q.trim() ? buildSuggestions(courses, tutorialIndex, q) : []),
    [courses, tutorialIndex, q],
  );

  const showPanel = open && (q.trim().length >= 1 || variant === 'header');
  const isHeader = variant === 'header';

  const updatePanelBox = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = isHeader ? Math.min(Math.max(rect.width, 320), 448) : rect.width;
    const left = isHeader
      ? Math.min(Math.max(8, rect.right - width), window.innerWidth - width - 8)
      : Math.max(8, rect.left);
    setPanelBox({
      top: rect.bottom + 8,
      left,
      width,
    });
  }, [isHeader]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActive(0);
  }, [q]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useLayoutEffect(() => {
    if (!showPanel) return;
    updatePanelBox();
    function onReposition() {
      updatePanelBox();
    }
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);
    return () => {
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [showPanel, updatePanelBox, q]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        inputRef.current?.blur();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onFocusSearch?.();
        inputRef.current?.focus();
        setOpen(true);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [onFocusSearch]);

  function go(href: string) {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (suggestions[active]) {
      go(suggestions[active].href);
      return;
    }
    setOpen(false);
    onNavigate?.();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!showPanel) return;
    const max = Math.max(suggestions.length - 1, 0);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (suggestions.length ? (i + 1) % suggestions.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (suggestions.length ? (i - 1 + suggestions.length) % suggestions.length : 0));
    } else if (e.key === 'Enter' && suggestions[active] && q.trim()) {
      e.preventDefault();
      go(suggestions[active].href);
    } else if (e.key === 'Home') {
      setActive(0);
    } else if (e.key === 'End') {
      setActive(max);
    }
  }

  const grouped = useMemo(() => {
    const coursesGroup = suggestions.filter((s) => s.kind === 'course');
    const tutorialsGroup = suggestions.filter((s) => s.kind === 'tutorial');
    const lessonsGroup = suggestions.filter((s) => s.kind === 'lesson');
    const actions = suggestions.filter((s) => s.kind === 'action');
    return { coursesGroup, tutorialsGroup, lessonsGroup, actions };
  }, [suggestions]);

  function renderRow(item: Suggestion, index: number) {
    const selected = index === active;
    return (
      <Link
        key={item.key}
        id={`${listId}-opt-${index}`}
        href={item.href}
        role="option"
        aria-selected={selected}
        onMouseEnter={() => setActive(index)}
        onClick={() => {
          setOpen(false);
          onNavigate?.();
        }}
        className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors"
        style={{
          background: selected ? 'var(--paper-dim)' : 'transparent',
        }}
      >
        <SuggestionIcon kind={item.kind} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium">{item.title}</span>
          <span className="block truncate text-[12px]" style={{ color: 'var(--ink-soft)' }}>
            {item.meta}
          </span>
        </span>
        {item.kind !== 'action' ? (
          <span
            className="hidden shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] sm:inline"
            style={{
              background: item.kind === 'course' ? 'rgba(0,179,105,0.1)' : 'var(--amber-soft)',
              color: item.kind === 'course' ? 'var(--green-deep)' : 'var(--blue-ink)',
            }}
          >
            {item.kind}
          </span>
        ) : (
          <ArrowRight size={16} style={{ color: 'var(--green-deep)' }} />
        )}
      </Link>
    );
  }

  function absoluteIndex(kind: Suggestion['kind'], localIndex: number) {
    let offset = 0;
    if (kind === 'course') return localIndex;
    offset += grouped.coursesGroup.length;
    if (kind === 'tutorial') return offset + localIndex;
    offset += grouped.tutorialsGroup.length;
    if (kind === 'lesson') return offset + localIndex;
    offset += grouped.lessonsGroup.length;
    return offset + localIndex;
  }

  const panel = (
    <AnimatePresence>
      {showPanel && panelBox ? (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 8, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.99 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="fixed z-[200] overflow-hidden rounded-2xl border shadow-card"
          style={{
            top: panelBox.top,
            left: panelBox.left,
            width: panelBox.width,
            background: 'var(--paper)',
            borderColor: 'var(--line)',
            boxShadow: '0 22px 60px rgba(12,17,22,0.18), 0 4px 14px rgba(12,17,22,0.08)',
          }}
          role="listbox"
          id={listId}
        >
          {!q.trim() ? (
            <div className="p-3 sm:p-4">
              <div className="mb-3 flex items-center gap-2 px-1">
                <Sparkles size={14} style={{ color: 'var(--green-deep)' }} />
                <span className="font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                  Popular right now
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setQ(p.q);
                      setOpen(true);
                      inputRef.current?.focus();
                    }}
                    className="rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition hover:-translate-y-0.5"
                    style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="mt-4 border-t pt-3" style={{ borderColor: 'var(--line)' }}>
                <div className="mb-2 px-1 font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                  Free tutorial paths
                </div>
                <div className="grid gap-0.5 sm:grid-cols-2">
                  {TUTORIAL_NAV.slice(0, 8).map((t) => (
                    <Link
                      key={t.href}
                      href={t.href}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-[13px] transition-colors hover:bg-[var(--paper-dim)]"
                    >
                      <BookOpen size={14} style={{ color: 'var(--blue-ink)' }} />
                      <span className="truncate font-medium">{t.label}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/tutorials"
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className="mt-2 inline-flex items-center gap-1 px-2.5 text-[13px] font-semibold"
                  style={{ color: 'var(--green-deep)' }}
                >
                  Browse all tutorials <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="px-4 py-5 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Loading catalogue…
                </span>
              ) : (
                <>
                  No matches for “{q.trim()}”. Try another skill or browse free paths.
                  <div className="mt-3 flex flex-wrap gap-3">
                    <Link
                      href={`/courses?q=${encodeURIComponent(q.trim())}`}
                      className="text-[13px] font-semibold"
                      style={{ color: 'var(--green-deep)' }}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                    >
                      Search courses
                    </Link>
                    <Link
                      href="/tutorials"
                      className="text-[13px] font-semibold"
                      style={{ color: 'var(--blue-ink)' }}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                    >
                      Browse tutorials
                    </Link>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="max-h-[min(70vh,440px)] overflow-y-auto py-2">
              {grouped.coursesGroup.length > 0 && (
                <div className="px-2 pb-1">
                  <div className="px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ color: 'var(--ink-soft)' }}>
                    Courses
                  </div>
                  {grouped.coursesGroup.map((item, i) => renderRow(item, absoluteIndex('course', i)))}
                </div>
              )}
              {grouped.tutorialsGroup.length > 0 && (
                <div className="px-2 pb-1">
                  <div className="px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ color: 'var(--ink-soft)' }}>
                    Tutorials
                  </div>
                  {grouped.tutorialsGroup.map((item, i) => renderRow(item, absoluteIndex('tutorial', i)))}
                </div>
              )}
              {grouped.lessonsGroup.length > 0 && (
                <div className="px-2 pb-1">
                  <div className="px-2.5 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ color: 'var(--ink-soft)' }}>
                    Lessons
                  </div>
                  {grouped.lessonsGroup.map((item, i) => renderRow(item, absoluteIndex('lesson', i)))}
                </div>
              )}
              {grouped.actions.map((item, i) => (
                <div key={item.key} className="border-t px-2 pt-1" style={{ borderColor: 'var(--line)' }}>
                  {renderRow(item, absoluteIndex('action', i))}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <div
      ref={rootRef}
      className={`relative ${showPanel ? 'z-[120]' : 'z-10'} ${className}`}
    >
      <form
        onSubmit={onSubmit}
        className={`relative transition-all duration-200 ${
          isHeader && open ? 'scale-[1.01]' : ''
        }`}
      >
        <Search
          size={compact || isHeader ? 16 : 18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
          style={{ color: open ? 'var(--green-deep)' : 'var(--ink-soft)' }}
        />
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            onFocusSearch?.();
          }}
          onKeyDown={onKeyDown}
          className={`form-input w-full !rounded-full ${
            compact || isHeader ? '!py-2.5 !pl-10 !pr-16 text-[13.5px]' : '!py-3 !pl-11 !pr-4'
          }`}
          style={
            isHeader
              ? {
                  background: open ? 'var(--paper)' : 'var(--paper-dim)',
                  borderColor: open ? 'var(--green)' : 'transparent',
                  boxShadow: open ? '0 0 0 3px rgba(0,179,105,0.14)' : 'none',
                }
              : undefined
          }
          placeholder={placeholder}
          aria-label="Search courses and tutorials"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-activedescendant={showPanel && suggestions[active] ? `${listId}-opt-${active}` : undefined}
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
        />
        {isHeader ? (
          <div className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-1.5 sm:flex">
            {q ? (
              <button
                type="button"
                className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full"
                style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }}
                aria-label="Clear search"
                onClick={() => {
                  setQ('');
                  inputRef.current?.focus();
                }}
              >
                <X size={14} />
              </button>
            ) : (
              <kbd
                className="rounded-md border px-1.5 py-0.5 font-mono text-[10px]"
                style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)', background: 'var(--paper)' }}
              >
                ⌘K
              </kbd>
            )}
          </div>
        ) : null}
        {q && !isHeader ? (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1"
            style={{ color: 'var(--ink-soft)' }}
            aria-label="Clear search"
            onClick={() => {
              setQ('');
              inputRef.current?.focus();
            }}
          >
            <X size={14} />
          </button>
        ) : null}
      </form>
      {mounted ? createPortal(panel, document.body) : null}
    </div>
  );
}
