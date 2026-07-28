import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowRight, BookOpen, Clock, Video } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { findMentor, getTeacherCourse } from '@/lib/learn/ecosystem';
import { courseDurationHours, deliveryModeLabel } from '@/lib/learn/courseTypes';
import { absoluteUrl, buildShareMetadata } from '@/lib/seo/share';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import ShareCourseButton from '@/components/ShareCourseButton';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const course = await getTeacherCourse(params.id);
  if (!course || !course.published) {
    return { title: 'Course not found - InTelleX' };
  }
  const description =
    course.subtitle ||
    course.description?.slice(0, 200) ||
    `Learn ${course.title} on InTelleX.`;
  return buildShareMetadata({
    title: `${course.title} - InTelleX`,
    description,
    path: `/courses/instructor/${course.id}`,
    image: course.coverUrl,
    imageAlt: course.title,
  });
}

/**
 * Public share / preview page for instructor courses.
 * WhatsApp and other link previews can read Open Graph tags here without auth.
 */
export default async function PublicInstructorCoursePage({
  params,
}: {
  params: { id: string };
}) {
  const course = await getTeacherCourse(params.id);
  if (!course || !course.published) notFound();

  const session = getSessionUser();
  if (session) {
    redirect(`/dashboard/courses/instructor/${course.id}`);
  }

  const instructorId = course.instructorId || course.authorId;
  const mentor = await findMentor(instructorId);
  const hours = courseDurationHours(course);
  const accent = course.accent || '#00b369';
  const isPaid = (course.priceXAF ?? 0) > 0;
  const loginNext = `/dashboard/courses/instructor/${course.id}`;
  const shareUrl = absoluteUrl(`/courses/instructor/${course.id}`);
  const shareText =
    course.subtitle ||
    course.description?.slice(0, 160) ||
    `Learn ${course.title} on InTelleX.`;

  return (
    <>
      <TopNav />
      <section className="py-8 sm:py-12" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
        <div className="wrap max-w-[920px]">
          <div className="mb-4 flex justify-end">
            <ShareCourseButton
              url={shareUrl}
              title={course.title}
              text={shareText}
              variant="dark"
              label="Share course"
            />
          </div>
          {course.category && (
            <p className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: 'rgba(251,248,240,0.55)' }}>
              {course.category}
            </p>
          )}
          <h1 className="mt-1 font-display text-[26px] leading-[1.1] sm:text-[40px]">{course.title}</h1>
          {(course.subtitle || course.description) && (
            <p className="mt-3 max-w-[640px] text-[14.5px] sm:text-[16px]" style={{ color: 'rgba(251,248,240,0.82)' }}>
              {course.subtitle || course.description.slice(0, 220)}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-4 text-[13px]" style={{ color: 'rgba(251,248,240,0.75)' }}>
            <span className="inline-flex items-center gap-1.5">
              <Video size={14} /> {deliveryModeLabel(course.deliveryMode)}
            </span>
            {hours > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={14} /> {hours}h
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <BookOpen size={14} /> {course.lessons?.length || 0} lessons
            </span>
            {(mentor?.name || course.instructorName || course.authorName) && (
              <span>By {mentor?.name || course.instructorName || course.authorName}</span>
            )}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="wrap grid max-w-[920px] gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <div>
            {course.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.coverUrl}
                alt={course.title}
                className="aspect-video w-full object-cover"
                style={{ border: '1px solid var(--line)' }}
              />
            ) : (
              <div
                className="flex aspect-video w-full items-center justify-center"
                style={{ background: `linear-gradient(145deg, ${accent} 0%, #0C1116 100%)` }}
              >
                <Video size={28} className="text-white/70" />
              </div>
            )}
            {course.description && (
              <div className="mt-6">
                <h2 className="font-display text-[20px]">About this course</h2>
                <p className="mt-2 whitespace-pre-wrap text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {course.description}
                </p>
              </div>
            )}
          </div>

          <aside className="border p-5" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
            <p className="font-display text-[28px] leading-none">
              {isPaid ? `${(course.priceXAF ?? 0).toLocaleString()} XAF` : 'Free'}
            </p>
            <p className="mt-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Sign in to enrol and start learning on InTelleX.
            </p>
            <Link
              href={`/login?next=${encodeURIComponent(loginNext)}`}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-[14px] font-semibold text-white"
              style={{ background: accent }}
            >
              Continue <ArrowRight size={16} />
            </Link>
            <Link
              href={`/signup?next=${encodeURIComponent(loginNext)}`}
              className="mt-2 inline-flex w-full items-center justify-center border px-4 py-3 text-[13.5px] font-semibold"
              style={{ borderColor: 'var(--line)' }}
            >
              Create an account
            </Link>
            <ShareCourseButton
              url={shareUrl}
              title={course.title}
              text={shareText}
              accent={accent}
              className="mt-3 w-full"
              label="Share course"
            />
          </aside>
        </div>
      </section>
      <Footer />
    </>
  );
}
