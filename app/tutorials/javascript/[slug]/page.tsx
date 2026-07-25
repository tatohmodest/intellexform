import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import TutorialSidebar from '@/components/tutorials/TutorialSidebar';
import LessonBlocks from '@/components/tutorials/LessonBlocks';
import LessonNav from '@/components/tutorials/LessonNav';
import TutorialProgress from '@/components/tutorials/TutorialProgress';
import {
  getAllJsLessons,
  getJsLessonNav,
  javascriptTutorial,
} from '@/lib/tutorials/javascript';

export function generateStaticParams() {
  return getAllJsLessons().map((lesson) => ({ slug: lesson.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const nav = getJsLessonNav(params.slug);
  if (!nav) return { title: 'Lesson not found — Intellex' };
  return {
    title: `${nav.lesson.title} — JavaScript Tutorial | Intellex`,
    description: nav.lesson.description,
  };
}

const LEVEL_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  beginner: { label: 'Beginner', color: 'var(--green-deep)', bg: 'rgba(0,179,105,0.10)' },
  intermediate: { label: 'Intermediate', color: 'var(--blue-ink)', bg: 'var(--amber-soft)' },
  advanced: { label: 'Advanced', color: '#8a4b16', bg: 'rgba(196,98,42,0.10)' },
};

export default function JavaScriptLessonPage({ params }: { params: { slug: string } }) {
  const nav = getJsLessonNav(params.slug);
  if (!nav) notFound();

  const { lesson, prev, next, index } = nav;
  const level = LEVEL_STYLE[lesson.level];
  const total = javascriptTutorial.totalLessons;

  return (
    <>
      <TopNav />
      <div className="flex min-h-[calc(100vh-57px)]">
        <TutorialSidebar course={javascriptTutorial} activeSlug={lesson.slug} />

        <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="mx-auto max-w-[720px]">
            <Link
              href="/tutorials/javascript"
              className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium"
              style={{ color: 'var(--ink-soft)' }}
            >
              <ArrowLeft size={14} /> Curriculum
            </Link>

            <TutorialProgress current={index + 1} total={total} />

            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span
                className="rounded-md px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em]"
                style={{ background: level.bg, color: level.color }}
              >
                {level.label}
              </span>
              <span className="rounded-md px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em]" style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }}>
                {lesson.section}
              </span>
              <span className="inline-flex items-center gap-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                <Clock size={13} /> {lesson.minutes} min read
              </span>
            </div>

            <h1 className="mb-3 font-display text-[30px] leading-[1.12] sm:text-[38px]">{lesson.title}</h1>
            <p className="mb-8 text-[16px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {lesson.description}
            </p>

            <LessonBlocks blocks={lesson.content} />
            <LessonNav courseSlug="javascript" prev={prev} next={next} />
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
