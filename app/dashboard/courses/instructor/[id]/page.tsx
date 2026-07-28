import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Globe2,
  Radio,
  Users,
  Video,
} from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { findMentor, getTeacherCourse, isEnrolledInCourse } from '@/lib/learn/ecosystem';
import { courseDurationHours, deliveryModeLabel } from '@/lib/learn/courseTypes';
import { isDirectVideo, toEmbedUrl } from '@/lib/learn/videoEmbed';
import { buildShareMetadata } from '@/lib/seo/share';
import EnrollTeacherCourseButton from '@/components/dashboard/EnrollTeacherCourseButton';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const course = await getTeacherCourse(params.id);
  if (!course) return { title: 'Course not found - InTelleX' };
  const description =
    course.subtitle ||
    course.description?.slice(0, 200) ||
    `Learn ${course.title} on InTelleX.`;
  // Canonical share URL is the public page so WhatsApp can scrape without auth.
  return buildShareMetadata({
    title: `${course.title} - InTelleX`,
    description,
    path: `/courses/instructor/${course.id}`,
    image: course.coverUrl,
    imageAlt: course.title,
  });
}

export default async function InstructorCoursePage({
  params,
}: {
  params: { id: string };
}) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/courses/instructor/${params.id}`);

  const course = await getTeacherCourse(params.id);
  if (!course) notFound();

  const isTeacher =
    course.authorId === session.uid || course.instructorId === session.uid;
  if (!course.published && !isTeacher) notFound();

  const instructorId = course.instructorId || course.authorId;
  const mentor = await findMentor(instructorId);
  const hours = courseDurationHours(course);
  const accent = course.accent || '#00b369';
  const isPaid = (course.priceXAF ?? 0) > 0;
  const isLive = course.deliveryMode === 'live' || course.deliveryMode === 'hybrid';
  const enrolled = isTeacher || (await isEnrolledInCourse(course.id, session.uid));

  // Non-teachers see preview lessons until enrolled (purchase or instructor add).
  const visibleLessons = enrolled
    ? course.lessons || []
    : (course.lessons || []).filter((l) => l.preview || !isPaid);
  const lockedCount = (course.lessons?.length || 0) - visibleLessons.length;

  return (
    <div className="mx-auto max-w-[980px] overflow-x-hidden">
      <Link
        href="/dashboard/courses"
        className="mb-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold"
        style={{ color: 'var(--ink-soft)' }}
      >
        <ArrowLeft size={14} /> My Courses
      </Link>

      <header className="mb-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <div className="min-w-0">
          {course.category && (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--ink-soft)' }}>
              {course.category}
            </p>
          )}
          <h1 className="mt-1 font-display text-[30px] leading-[1.02] sm:text-[38px]">
            {course.title}
          </h1>
          {course.subtitle && (
            <p className="mt-2 text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {course.subtitle}
            </p>
          )}

          <div
            className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10.5px] uppercase tracking-[0.12em]"
            style={{ color: 'var(--ink-soft)' }}
          >
            <span className="inline-flex items-center gap-1.5">
              {isLive ? <Radio size={12} /> : <Video size={12} />}
              {deliveryModeLabel(course.deliveryMode)}
            </span>
            {hours > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} /> {hours}h
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <BookOpen size={12} /> {course.lessons?.length || 0} lessons
            </span>
            {course.level && course.level !== 'all' && (
              <span className="capitalize">{course.level}</span>
            )}
            {course.language && (
              <span className="inline-flex items-center gap-1.5">
                <Globe2 size={12} /> {course.language}
              </span>
            )}
            {course.certificate && (
              <span className="inline-flex items-center gap-1.5" style={{ color: 'var(--green-deep)' }}>
                <Award size={12} /> Certificate
              </span>
            )}
            {typeof course.seats === 'number' && course.seats > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Users size={12} /> {course.seats} seats
              </span>
            )}
          </div>

          {mentor && (
            <Link
              href={`/dashboard/mentorship/${mentor.id}`}
              className="mt-5 inline-flex items-center gap-3"
            >
              {mentor.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mentor.avatarUrl}
                  alt={mentor.name}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-bold text-white"
                  style={{ background: accent }}
                >
                  {mentor.initials}
                </span>
              )}
              <span className="min-w-0">
                <span className="block text-[14px] font-semibold">{mentor.name}</span>
                <span className="block text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                  {mentor.title} · View instructor →
                </span>
              </span>
            </Link>
          )}
        </div>

        <div className="border" style={{ borderColor: 'var(--line)' }}>
          {course.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={course.coverUrl} alt="" className="aspect-video w-full object-cover" />
          ) : (
            <div
              className="flex aspect-video w-full items-center justify-center"
              style={{ background: `linear-gradient(145deg, ${accent} 0%, #0C1116 100%)` }}
            >
              <Video size={26} className="text-white/70" />
            </div>
          )}
          <div className="p-4">
            <p className="font-display text-[26px] leading-none">
              {isPaid ? `${(course.priceXAF ?? 0).toLocaleString()} XAF` : 'Free'}
            </p>
            <p className="mt-1.5 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              {course.audience === 'allocated'
                ? 'Free for students allocated to this instructor.'
                : course.audience === 'institution'
                  ? 'Available to members of the owning institution.'
                  : 'Open enrolment on InTelleX.'}
            </p>
            {isTeacher ? (
              <Link
                href="/dashboard/teach/courses"
                className="mt-4 inline-flex w-full items-center justify-center px-4 py-2.5 text-[13.5px] font-semibold text-white"
                style={{ background: accent }}
              >
                Edit in Course Studio
              </Link>
            ) : (
              <EnrollTeacherCourseButton
                courseId={course.id}
                priceXAF={course.priceXAF ?? 0}
                accent={accent}
                audience={course.audience}
              />
            )}
            {mentor && !isTeacher && (
              <Link
                href={`/dashboard/mentorship/${mentor.id}`}
                className="mt-2 inline-flex w-full items-center justify-center px-4 py-2 text-[13px] font-semibold"
                style={{ color: accent }}
              >
                View instructor profile →
              </Link>
            )}
          </div>
        </div>
      </header>

      {isLive && course.liveSchedule && (
        <section className="mb-8 border p-4" style={{ borderColor: 'var(--line)' }}>
          <h2 className="mb-2 inline-flex items-center gap-2 font-display text-[19px]">
            <Calendar size={16} /> Live schedule
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
            {course.liveSchedule.startDate && <span>Starts {course.liveSchedule.startDate}</span>}
            {course.liveSchedule.endDate && <span>Ends {course.liveSchedule.endDate}</span>}
            {course.liveSchedule.sessionsPerWeek ? (
              <span>{course.liveSchedule.sessionsPerWeek} session(s) / week</span>
            ) : null}
            {course.liveSchedule.sessionTime && <span>At {course.liveSchedule.sessionTime}</span>}
          </div>
        </section>
      )}

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0 space-y-8">
          {course.description && (
            <section>
              <h2 className="font-display text-[21px]">About this course</h2>
              <p className="mt-3 whitespace-pre-wrap text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {course.description}
              </p>
            </section>
          )}

          <section>
            <h2 className="mb-3 font-display text-[21px]">Lessons</h2>
            {visibleLessons.length === 0 ? (
              <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                Lessons are published as the course runs.
              </p>
            ) : (
              <div className="space-y-6">
                {visibleLessons.map((lesson, i) => {
                  const hasVideo = Boolean(lesson.videoUrl?.trim());
                  const embed = hasVideo
                    ? toEmbedUrl(lesson.videoUrl, lesson.videoProvider)
                    : '';
                  const direct = hasVideo
                    ? isDirectVideo(lesson.videoUrl, lesson.videoProvider)
                    : false;
                  return (
                    <div key={lesson.id} className="border-t pt-4" style={{ borderColor: 'var(--line)' }}>
                      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-[15px] font-semibold">
                          {i + 1}. {lesson.title}
                        </h3>
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                          {lesson.preview ? 'Free preview' : ''}
                          {lesson.durationMinutes ? ` · ${lesson.durationMinutes} min` : ''}
                        </span>
                      </div>
                      {hasVideo && embed ? (
                        <div className="overflow-hidden" style={{ background: '#0C1116' }}>
                          {direct ? (
                            // eslint-disable-next-line jsx-a11y/media-has-caption
                            <video src={embed} controls className="aspect-video w-full" />
                          ) : (
                            <iframe
                              title={lesson.title}
                              src={embed}
                              className="aspect-video w-full"
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                            />
                          )}
                        </div>
                      ) : (
                        <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                          Video link coming soon.
                        </p>
                      )}
                      {lesson.notes && (
                        <p className="mt-2 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                          {lesson.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {lockedCount > 0 && (
              <p className="mt-4 border border-dashed px-4 py-3 text-[13.5px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
                {lockedCount} more lesson{lockedCount === 1 ? '' : 's'} unlock after you enrol.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-8">
          {(course.outcomes || []).length > 0 && (
            <section>
              <h2 className="font-display text-[19px]">What you will learn</h2>
              <ul className="mt-3 space-y-2">
                {course.outcomes!.map((o) => (
                  <li key={o} className="flex gap-2 text-[13.5px] leading-relaxed">
                    <Check size={15} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {(course.requirements || []).length > 0 && (
            <section>
              <h2 className="font-display text-[19px]">Requirements</h2>
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                {course.requirements!.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
