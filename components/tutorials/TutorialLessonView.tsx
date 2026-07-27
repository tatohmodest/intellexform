import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import TutorialSidebar from '@/components/tutorials/TutorialSidebar';
import LessonBlocks from '@/components/tutorials/LessonBlocks';
import LessonNav from '@/components/tutorials/LessonNav';
import TutorialProgress from '@/components/tutorials/TutorialProgress';
import type { TutorialCourse, TutorialLesson } from '@/lib/tutorials/types';

const LEVEL_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  beginner: { label: 'Beginner', color: 'var(--green-deep)', bg: 'rgba(0,179,105,0.10)' },
  intermediate: { label: 'Intermediate', color: 'var(--blue-ink)', bg: 'var(--amber-soft)' },
  advanced: { label: 'Advanced', color: '#8a4b16', bg: 'rgba(196,98,42,0.10)' },
};

export default function TutorialLessonView({
  course,
  lesson,
  prev,
  next,
  index,
}: {
  course: TutorialCourse;
  lesson: TutorialLesson;
  prev: TutorialLesson | null;
  next: TutorialLesson | null;
  index: number;
}) {
  const level = LEVEL_STYLE[lesson.level];

  return (
    <>
      <TopNav />
      {/*
        Desktop: viewport-locked row so the lesson pane scrolls independently.
        Avoid overflow-x-hidden here — it forces overflow-y:auto and breaks page scroll.
      */}
      <div className="flex flex-col lg:h-[calc(100vh-57px)] lg:flex-row lg:overflow-hidden">
        <TutorialSidebar
          course={course}
          activeSlug={lesson.slug}
          activeTitle={lesson.title}
        />

        <main className="min-w-0 w-full flex-1 lg:overflow-y-auto lg:overscroll-contain">
          <div className="mx-auto w-full max-w-[720px] px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-12 lg:py-10">
            <Link
              href={`/tutorials/${course.slug}`}
              className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium sm:mb-5"
              style={{ color: 'var(--ink-soft)' }}
            >
              <ArrowLeft size={14} /> Curriculum
            </Link>

            <TutorialProgress current={index + 1} total={course.totalLessons} />

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span
                className="rounded-md px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em]"
                style={{ background: level.bg, color: level.color }}
              >
                {level.label}
              </span>
              <span
                className="rounded-md px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em]"
                style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }}
              >
                {lesson.section}
              </span>
              <span className="inline-flex items-center gap-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                <Clock size={13} /> {lesson.minutes} min read
              </span>
            </div>

            <h1 className="mb-3 break-words font-display text-[26px] leading-[1.15] sm:text-[32px] md:text-[38px]">
              {lesson.title}
            </h1>
            <p className="mb-6 text-[15px] leading-relaxed sm:mb-8 sm:text-[16px]" style={{ color: 'var(--ink-soft)' }}>
              {lesson.description}
            </p>

            <div className="max-w-full">
              <LessonBlocks blocks={lesson.content} />
            </div>
            <LessonNav courseSlug={course.slug} prev={prev} next={next} />
          </div>
          <div className="lg:hidden">
            <Footer />
          </div>
        </main>
      </div>
    </>
  );
}
