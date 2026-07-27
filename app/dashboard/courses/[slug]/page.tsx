import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, BookOpen, CheckCircle2, Circle, Clock, GraduationCap } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getEnrollments, getProgress } from '@/lib/learn/repo';
import { getCatalogTrack, getNextLesson } from '@/lib/learn/catalog';
import { getTutorial } from '@/lib/tutorials';
import EnrollButton from '@/components/dashboard/EnrollButton';
import TrackLogo from '@/components/TrackLogo';

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

  const [enrollments, progress] = await Promise.all([
    getEnrollments(session.uid),
    getProgress(session.uid, params.slug),
  ]);
  const enrolled = enrollments.some((e) => e.courseSlug === params.slug);
  const done = new Set(progress.map((p) => p.lessonSlug));
  const next = getNextLesson(params.slug, done);
  const pct = track.totalLessons ? Math.round((done.size / track.totalLessons) * 100) : 0;
  const continueHref = next
    ? `/dashboard/courses/${params.slug}/${next.slug}`
    : `/dashboard/courses/${params.slug}`;

  return (
    <div className="mx-auto max-w-[900px]">
      <Link
        href="/dashboard/courses"
        className="mb-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold sm:mb-6"
        style={{ color: 'var(--ink-soft)' }}
      >
        <ArrowLeft size={14} /> All courses
      </Link>

      <div
        className="mb-6 rounded-2xl border p-4 sm:mb-8 sm:rounded-3xl sm:p-8"
        style={{ borderColor: 'var(--line)', background: `linear-gradient(135deg, ${track.color}10, transparent 55%)` }}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <TrackLogo slug={track.slug} color={track.color} size={56} className="rounded-2xl sm:h-16 sm:w-16" />
          <div className="min-w-0 flex-1">
            <div className="mono mb-1 text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
              {track.tag} · Self-paced
            </div>
            <h1 className="break-words font-display text-[24px] leading-tight sm:text-[28px]">{track.title}</h1>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed sm:text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
              {track.description}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              <span className="flex items-center gap-1.5">
                <BookOpen size={13} /> {track.totalLessons} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> ~{Math.round(track.totalMinutes / 60)} hours
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap size={13} /> Certificate on completion
              </span>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end sm:gap-3">
            <EnrollButton courseSlug={params.slug} enrolled={enrolled} continueHref={continueHref} />
            {enrolled && (
              <div className="text-[12.5px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                {pct}% complete
              </div>
            )}
          </div>
        </div>
      </div>

      <h2 className="mb-3 font-display text-[19px] sm:mb-4 sm:text-[21px]">Curriculum</h2>
      <div className="space-y-3 sm:space-y-4">
        {course.sections.map((section, si) => {
          const sectionDone = section.lessons.filter((l) => done.has(l.slug)).length;
          return (
            <div
              key={section.id}
              className="overflow-hidden rounded-xl border sm:rounded-2xl"
              style={{ borderColor: 'var(--line)' }}
            >
              <div
                className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 sm:px-5 sm:py-4"
                style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
              >
                <div className="min-w-0">
                  <div className="mono text-[10.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
                    Section {si + 1} · {section.level}
                  </div>
                  <div className="text-[14px] font-semibold sm:text-[15px]">{section.title}</div>
                </div>
                <span className="shrink-0 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
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
                        ) : (
                          <Circle size={17} className="shrink-0" style={{ color: 'var(--line)' }} />
                        )}
                        <span
                          className="min-w-0 flex-1 text-[13.5px] sm:truncate sm:text-[14px]"
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
