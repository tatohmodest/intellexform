import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Check, Clock, Globe, BadgeCheck, ArrowLeft } from 'lucide-react';
import { getCourseBySlug } from '@/lib/repo';
import { formatXAF } from '@/lib/format';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import PurchasePanel from '@/components/PurchasePanel';
import CourseHeroImage from '@/components/CourseHeroImage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) return { title: 'Course not found — Intellex' };
  return {
    title: `${course.name} — Intellex`,
    description: course.shortDescription,
  };
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();

  return (
    <>
      <TopNav />

      {/* Header band */}
      <section className="py-12" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
        <div className="wrap">
          <Link href="/courses" className="mb-6 inline-flex items-center gap-2 text-sm" style={{ color: 'rgba(251,248,240,0.7)' }}>
            <ArrowLeft size={15} /> All courses
          </Link>
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tab" style={{ background: 'rgba(227,162,58,0.18)', color: 'var(--amber)' }}>{course.type}</span>
              {course.featured && (
                <span className="rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase" style={{ background: 'var(--green)', color: 'var(--ink)' }}>Intellex program</span>
              )}
              {course.bestSeller && !course.featured && (
                <span className="rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase" style={{ background: 'var(--amber)', color: 'var(--ink)' }}>Bestseller</span>
              )}
            </div>
            <h1 className="max-w-[760px] font-display text-[36px] leading-[1.1]">{course.name}</h1>
            <p className="max-w-[680px] text-[16px]" style={{ color: 'rgba(251,248,240,0.82)' }}>{course.shortDescription}</p>
            <div className="mt-2 flex flex-wrap items-center gap-5 text-sm" style={{ color: 'rgba(251,248,240,0.85)' }}>
              {course.instructor && <span>By {course.instructor}</span>}
              {course.courseRating > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Star size={15} style={{ fill: 'var(--amber)', color: 'var(--amber)' }} />
                  {course.courseRating.toFixed(1)}
                  {course.courseNumberOfVotes > 0 && (
                    <span style={{ color: 'rgba(251,248,240,0.6)' }}>({course.courseNumberOfVotes.toLocaleString('en-US')})</span>
                  )}
                </span>
              )}
              {course.courseDuration && <span className="inline-flex items-center gap-1.5"><Clock size={15} /> {course.courseDuration}</span>}
              {course.language && <span className="inline-flex items-center gap-1.5"><Globe size={15} /> {course.language}</span>}
              {course.courseOrigin && <span style={{ color: 'rgba(251,248,240,0.6)' }}>{course.courseOrigin}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-14">
        <div className="wrap grid gap-10 lg:grid-cols-[1.6fr_0.9fr]">
          <div>
            <CourseHeroImage src={course.courseImage} name={course.name} />

            {course.whatYouWillLearn.length > 0 && (
              <div className="mt-10 rounded-[18px] border p-7" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
                <h2 className="mb-5 font-display text-[22px]">What you&apos;ll learn</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {course.whatYouWillLearn.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 text-[14px]">
                      <Check size={17} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--green-deep)' }} />
                      <span style={{ color: 'var(--ink-soft)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {course.courseDetails && (
              <div className="mt-10">
                <h2 className="mb-3 font-display text-[22px]">About this course</h2>
                <p className="text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{course.courseDetails}</p>
              </div>
            )}

            {course.prerequisites && (
              <div className="mt-8">
                <h2 className="mb-3 font-display text-[22px]">Prerequisites</h2>
                <p className="text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{course.prerequisites}</p>
              </div>
            )}

            {course.aboutInstructor && (
              <div className="mt-8 rounded-[18px] border p-7" style={{ borderColor: 'var(--line)' }}>
                <h2 className="mb-2 font-display text-[22px]">Meet your instructor</h2>
                <p className="mb-2 font-semibold">{course.instructor || 'Intellex Mentors'}</p>
                <p className="text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{course.aboutInstructor}</p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-2.5">
              {course.certificateOfCompletion && (
                <span className="pill inline-flex items-center gap-1.5"><BadgeCheck size={14} style={{ color: 'var(--green-deep)' }} /> Certificate</span>
              )}
              {course.accessOnMobileAndTV && <span className="pill">Mobile &amp; TV access</span>}
              {course.downloadable && <span className="pill">Downloadable</span>}
              {course.articleType && <span className="pill">{course.articleType}</span>}
            </div>
          </div>

          {/* Sticky purchase */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <PurchasePanel course={course} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
