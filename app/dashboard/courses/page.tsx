import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BookOpen, Clock, GraduationCap, Layers } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getEnrollments, getProgress } from '@/lib/learn/repo';
import { getCatalog, getNextLesson } from '@/lib/learn/catalog';
import EnrollButton from '@/components/dashboard/EnrollButton';
import TrackLogo from '@/components/TrackLogo';

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
  const myTracks = catalog.filter((t) => enrolledSlugs.has(t.slug));
  const browseTracks = catalog.filter((t) => !enrolledSlugs.has(t.slug));

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-8">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <Layers size={11} />
          Self-paced learning
        </div>
        <h1 className="font-display text-[30px] leading-tight">My Courses</h1>
        <p className="mt-1 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Structured tracks with real lessons, progress tracking, XP and certificates.
        </p>
      </div>

      {myTracks.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 font-display text-[21px]">In progress</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {myTracks.map((t) => {
              const done = completedByCourse.get(t.slug) ?? new Set<string>();
              const next = getNextLesson(t.slug, done);
              const pct = t.totalLessons ? Math.round((done.size / t.totalLessons) * 100) : 0;
              const continueHref = next
                ? `/dashboard/courses/${t.slug}/${next.slug}`
                : `/dashboard/courses/${t.slug}`;
              return (
                <div
                  key={t.slug}
                  className="flex flex-col rounded-2xl border p-5"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <Link href={`/dashboard/courses/${t.slug}`} className="mb-4 flex items-center gap-3">
                    <TrackLogo slug={t.slug} color={t.color} size={44} />
                    <div className="min-w-0">
                      <div className="truncate text-[15px] font-semibold">{t.shortTitle}</div>
                      <div className="mono text-[11px] uppercase tracking-[0.1em]" style={{ color: 'var(--ink-soft)' }}>
                        {t.tag}
                      </div>
                    </div>
                  </Link>
                  <div className="mb-2 flex justify-between text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    <span>
                      {done.size}/{t.totalLessons} lessons
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <div className="mb-4 h-2 overflow-hidden rounded-full" style={{ background: 'var(--paper-dim)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.max(pct, 2)}%`, background: 'var(--green)' }}
                    />
                  </div>
                  <div className="mt-auto">
                    <EnrollButton
                      courseSlug={t.slug}
                      enrolled
                      continueHref={continueHref}
                      compact
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center gap-2.5">
          <h2 className="font-display text-[21px]">
            {myTracks.length > 0 ? 'Explore more tracks' : 'Choose your first track'}
          </h2>
          <span
            className="rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
            style={{ background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)' }}
          >
            {browseTracks.length} available
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {browseTracks.map((t) => {
            const lessons = t.totalLessons;
            const firstHref = `/dashboard/courses/${t.slug}`;
            return (
              <div
                key={t.slug}
                className="flex flex-col rounded-2xl border p-5 transition-shadow hover:shadow-card"
                style={{ borderColor: 'var(--line)' }}
              >
                <Link href={firstHref} className="mb-3 flex items-center gap-3">
                  <TrackLogo slug={t.slug} color={t.color} size={44} />
                  <div className="min-w-0">
                    <div className="truncate text-[15px] font-semibold">{t.shortTitle}</div>
                    <div className="mono text-[11px] uppercase tracking-[0.1em]" style={{ color: 'var(--ink-soft)' }}>
                      {t.tag}
                    </div>
                  </div>
                </Link>
                <p className="mb-4 line-clamp-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {t.tagline}
                </p>
                <div className="mb-4 flex items-center gap-4 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={12} /> {lessons} lessons
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} /> ~{Math.round(t.totalMinutes / 60)}h
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GraduationCap size={12} /> Certificate
                  </span>
                </div>
                <div className="mt-auto">
                  <EnrollButton
                    courseSlug={t.slug}
                    enrolled={false}
                    continueHref={firstHref}
                    compact
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
