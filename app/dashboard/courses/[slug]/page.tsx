import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Clock, GraduationCap, Lock } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getEnrollments, getProgress } from '@/lib/learn/repo';
import { getCatalogTrack, getNextLesson } from '@/lib/learn/catalog';
import { getTutorial } from '@/lib/tutorials';
import EnrollButton from '@/components/dashboard/EnrollButton';
import TrackLogo from '@/components/TrackLogo';
import { hasActiveCertSubscription } from '@/lib/learn/certSubscription';
import { CERT_MONTHLY_XAF } from '@/lib/learn/certPricing';

export const dynamic = 'force-dynamic';

export default async function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/courses/${params.slug}`);

  const track = getCatalogTrack(params.slug);
  const course = getTutorial(params.slug);
  if (!track || !course) notFound();

  const [enrollments, progress, hasCert] = await Promise.all([
    getEnrollments(session.uid),
    getProgress(session.uid, params.slug),
    hasActiveCertSubscription(session.uid),
  ]);
  const enrolled = enrollments.some((e) => e.courseSlug === params.slug);
  const done = new Set(progress.map((p) => p.lessonSlug));
  const next = getNextLesson(params.slug, done);
  const pct = track.totalLessons ? Math.round((done.size / track.totalLessons) * 100) : 0;
  const continueHref = next
    ? `/dashboard/courses/${params.slug}/${next.slug}`
    : `/dashboard/courses/${params.slug}`;

  return (
    <div className="mx-auto max-w-[960px] overflow-x-hidden">
      <Link
        href="/dashboard/courses"
        className="mb-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold"
        style={{ color: 'var(--ink-soft)' }}
      >
        <ArrowLeft size={14} /> My courses
      </Link>

      {/* Campus-style hero - stacks on mobile so nothing gets squished */}
      <header className="relative mb-8 overflow-hidden text-white">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(120deg, ${track.color} 0%, #0C1116 72%)`,
          }}
        />
        <div className="relative p-5 sm:p-8 md:p-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <div className="min-w-0 flex-1">
              <div className="mb-4 flex items-center gap-3">
                <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden border border-white/25 bg-white/95 sm:h-16 sm:w-16">
                  <TrackLogo slug={track.slug} color={track.color} size={40} />
                </span>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 sm:text-[11px]">
                  {track.tag} · Self-paced
                </p>
              </div>
              <h1 className="break-words font-display text-[32px] leading-[0.95] tracking-tight sm:text-[40px] md:text-[44px]">
                {track.shortTitle}
              </h1>
              <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/75 sm:text-[15px]">
                {track.tagline || track.description}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white/55 sm:text-[11px]">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen size={12} /> {track.totalLessons} lessons
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={12} /> ~{Math.round(track.totalMinutes / 60)} hours
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap size={12} /> Certificate
                </span>
                {enrolled && <span>{pct}% complete</span>}
              </div>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:min-w-[160px]">
              <EnrollButton
                courseSlug={params.slug}
                enrolled={enrolled}
                continueHref={continueHref}
                editorial
              />
              {enrolled && (
                <div className="h-1.5 overflow-hidden bg-white/15">
                  <div
                    className="h-full"
                    style={{ width: `${Math.max(pct, 2)}%`, background: '#fff' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <p className="mb-8 max-w-2xl text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
        {track.description}
        {!hasCert && (
          <>
            {' '}
            Beginner is free. Intermediate through Pro unlock with Subscribe to get certified (
            {CERT_MONTHLY_XAF.toLocaleString()} XAF/month).
          </>
        )}
      </p>

      <h2 className="mb-4 font-display text-[22px] sm:text-[24px]">Curriculum</h2>
      <div className="space-y-3 sm:space-y-4">
        {course.sections.map((section, si) => {
          const sectionDone = section.lessons.filter((l) => done.has(l.slug)).length;
          const locked =
            !hasCert && (section.level === 'intermediate' || section.level === 'advanced');
          return (
            <div
              key={section.id}
              className="overflow-hidden border"
              style={{ borderColor: 'var(--line)' }}
            >
              <div
                className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-5 sm:py-4"
                style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
              >
                <div className="min-w-0">
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
                    Section {si + 1} · {section.level}
                    {locked ? ' · locked' : ''}
                  </div>
                  <div className="text-[14px] font-semibold sm:text-[15px]">{section.title}</div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                  {locked ? <Lock size={12} /> : null}
                  {sectionDone}/{section.lessons.length} done
                </span>
              </div>
              <ul>
                {section.lessons.map((lesson) => {
                  const isDone = done.has(lesson.slug);
                  return (
                    <li key={lesson.slug} className="border-t first:border-t-0" style={{ borderColor: 'var(--line)' }}>
                      <Link
                        href={`/dashboard/courses/${params.slug}/${lesson.slug}`}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--paper-dim)] sm:px-5 sm:py-3.5"
                      >
                        {isDone ? (
                          <CheckCircle2 size={17} className="shrink-0" style={{ color: 'var(--green)' }} />
                        ) : locked ? (
                          <Lock size={17} className="shrink-0" style={{ color: 'var(--ink-soft)' }} />
                        ) : (
                          <Circle size={17} className="shrink-0" style={{ color: 'var(--line)' }} />
                        )}
                        <span
                          className="min-w-0 flex-1 text-[13.5px] leading-snug sm:text-[14px]"
                          style={{ color: isDone ? 'var(--ink-soft)' : 'var(--ink)' }}
                        >
                          {lesson.title}
                        </span>
                        <span className="shrink-0 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                          {lesson.minutes} min
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
