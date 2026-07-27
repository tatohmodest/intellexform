import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/getUser';
import { getEnrollments, getProgress } from '@/lib/learn/repo';
import { getCatalog, getNextLesson } from '@/lib/learn/catalog';
import CoursesBrowser, { type CourseListItem } from '@/components/dashboard/CoursesBrowser';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/courses');

  const [enrollments, progress] = await Promise.all([
    getEnrollments(session.uid),
    getProgress(session.uid),
  ]);

  const completedByCourse = new Map<string, Set<string>>();
  for (const p of progress) {
    if (!completedByCourse.has(p.courseSlug)) completedByCourse.set(p.courseSlug, new Set());
    completedByCourse.get(p.courseSlug)!.add(p.lessonSlug);
  }
  const enrolledSlugs = new Set(enrollments.map((e) => e.courseSlug));
  const catalog = getCatalog();

  const tracks: CourseListItem[] = catalog.map((t) => {
    const enrolled = enrolledSlugs.has(t.slug);
    const done = completedByCourse.get(t.slug) ?? new Set<string>();
    const next = getNextLesson(t.slug, done);
    const pct = t.totalLessons ? Math.round((done.size / t.totalLessons) * 100) : 0;
    const continueHref = next
      ? `/dashboard/courses/${t.slug}/${next.slug}`
      : `/dashboard/courses/${t.slug}`;
    return {
      slug: t.slug,
      shortTitle: t.shortTitle,
      title: t.title,
      tagline: t.tagline,
      tag: t.tag,
      color: t.color,
      totalLessons: t.totalLessons,
      totalMinutes: t.totalMinutes,
      enrolled,
      doneCount: done.size,
      pct,
      continueHref,
    };
  });

  // Enrolled first, then the rest alphabetically by short title.
  tracks.sort((a, b) => {
    if (a.enrolled !== b.enrolled) return a.enrolled ? -1 : 1;
    return a.shortTitle.localeCompare(b.shortTitle);
  });

  return (
    <div className="mx-auto max-w-[1080px]">
      <header className="mb-2 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'var(--ink-soft)' }}>
          Learning paths
        </p>
        <h1 className="font-display text-[40px] leading-[0.95] tracking-tight sm:text-[52px]">
          My
          <br />
          courses
        </h1>
        <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          Structured tracks with real lessons, progress tracking, XP, and certificates — the same
          clarity as your campus network.
        </p>
      </header>

      <CoursesBrowser tracks={tracks} />
    </div>
  );
}
