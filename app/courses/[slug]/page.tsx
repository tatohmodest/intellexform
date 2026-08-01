import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Check, Clock, Globe, BadgeCheck, ArrowLeft } from 'lucide-react';
import { getCourseBySlug } from '@/lib/repo';
import { formatXAF } from '@/lib/format';
import { absoluteUrl, buildShareMetadata } from '@/lib/seo/share';
import { breadcrumbJsonLd, courseJsonLd } from '@/lib/seo/schema';
import { geoImageAlt } from '@/lib/seo/keywords';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import PurchasePanel from '@/components/PurchasePanel';
import CourseHeroImage from '@/components/CourseHeroImage';
import ShareCourseButton from '@/components/ShareCourseButton';
import JsonLd from '@/components/seo/JsonLd';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) return { title: 'Course not found - Intellex' };
  const description =
    course.shortDescription ||
    course.courseDetails?.slice(0, 200) ||
    `Learn ${course.name} on InTelleX - online tech courses in Cameroon (Douala, Yaounde, Bamenda, Buea).`;
  return buildShareMetadata({
    title: `${course.name} - InTelleX Cameroon`,
    description,
    path: `/courses/${course.slug}`,
    image: course.courseImage,
    imageAlt: geoImageAlt(course.name),
    keywords: [
      course.name,
      `${course.name} Cameroon`,
      `${course.name} Douala`,
      'online course Cameroon',
    ],
  });
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) notFound();

  const shareUrl = absoluteUrl(`/courses/${course.slug}`);
  const shareText =
    course.shortDescription ||
    `Learn ${course.name} on InTelleX.`;

  return (
    <>
      <JsonLd
        data={[
          courseJsonLd({
            name: course.name,
            description: shareText,
            url: shareUrl,
            image: course.courseImage,
            instructorName: course.instructor,
            priceXAF: course.currentPrice,
          }),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Courses', path: '/courses' },
            { name: course.name, path: `/courses/${course.slug}` },
          ]),
        ]}
      />
      <TopNav />

      {/* Header band */}
      <section className="py-8 sm:py-12" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
        <div className="wrap">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
            <Link href="/courses" className="inline-flex items-center gap-2 text-sm" style={{ color: 'rgba(251,248,240,0.7)' }}>
              <ArrowLeft size={15} /> All courses
            </Link>
            <ShareCourseButton
              url={shareUrl}
              title={course.name}
              text={shareText}
              variant="dark"
              label="Share course"
            />
          </div>
          <div className="grid gap-2.5 sm:gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tab" style={{ background: 'rgba(74,144,226,0.18)', color: '#8fc0ff' }}>{course.type}</span>
              {course.featured && (
                <span className="rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase" style={{ background: 'var(--green)', color: 'var(--ink)' }}>Intellex program</span>
              )}
              {course.bestSeller && !course.featured && (
                <span className="rounded-full px-2.5 py-1 font-mono text-[10.5px] uppercase" style={{ background: 'var(--amber)', color: 'var(--ink)' }}>Bestseller</span>
              )}
            </div>
            <h1 className="max-w-[760px] font-display text-[22px] leading-[1.18] sm:text-[36px] sm:leading-[1.1]">{course.name}</h1>
            <p className="max-w-[680px] text-[14.5px] sm:text-[16px]" style={{ color: 'rgba(251,248,240,0.82)' }}>{course.shortDescription}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] sm:mt-2 sm:gap-5 sm:text-sm" style={{ color: 'rgba(251,248,240,0.85)' }}>
              {course.instructor && <span className="min-w-0">By {course.instructor}</span>}
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
      <section className="py-8 sm:py-14">
        <div className="wrap grid gap-8 lg:grid-cols-[1.6fr_0.9fr] lg:gap-10">
          <div className="min-w-0">
            <CourseHeroImage src={course.courseImage} name={course.name} />

            {course.whatYouWillLearn.length > 0 && (
              <div className="mt-8 rounded-[18px] border p-5 sm:mt-10 sm:p-7" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
                <h2 className="mb-4 font-display text-[20px] sm:mb-5 sm:text-[22px]">What you&apos;ll learn</h2>
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
                <div
                  className="max-h-[360px] overflow-y-auto border p-3"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <p className="text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{course.courseDetails}</p>
                </div>
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
            <PurchasePanel course={course} shareUrl={shareUrl} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
