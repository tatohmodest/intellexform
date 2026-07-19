import { Suspense } from 'react';
import { getAllCourses } from '@/lib/repo';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import CoursesBrowser from '@/components/CoursesBrowser';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Courses — Intellex',
  description: 'Browse every course on Intellex: web development, data science, cybersecurity, design and more.',
};

export default async function CoursesPage() {
  const courses = await getAllCourses();

  return (
    <>
      <TopNav />
      <section className="py-16" style={{ background: 'var(--paper-dim)' }}>
        <div className="wrap">
          <div className="tab mb-4">Courses</div>
          <h1 className="mb-3 text-[30px] leading-[1.1] sm:text-[40px]">Every skill, one catalogue</h1>
          <p className="max-w-[560px] text-base" style={{ color: 'var(--ink-soft)' }}>
            {courses.length}+ self-paced courses across web development, data, AI, cybersecurity, design
            and more — plus EC-Council, Azure/cloud, and Intellex certification paths.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="wrap">
          <Suspense fallback={<div className="text-sm" style={{ color: 'var(--ink-soft)' }}>Loading catalogue…</div>}>
            <CoursesBrowser courses={courses} />
          </Suspense>
        </div>
      </section>

      <Footer />
    </>
  );
}
