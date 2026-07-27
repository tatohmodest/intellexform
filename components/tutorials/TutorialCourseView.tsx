import Link from 'next/link';
import { ArrowRight, Clock, Play } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import TutorialSidebar from '@/components/tutorials/TutorialSidebar';
import type { TutorialCourse } from '@/lib/tutorials/types';

const LEVEL_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  beginner: { label: 'Beginner', color: 'var(--green-deep)', bg: 'rgba(0,179,105,0.10)' },
  intermediate: { label: 'Intermediate', color: 'var(--blue-ink)', bg: 'var(--amber-soft)' },
  advanced: { label: 'Advanced', color: '#8a4b16', bg: 'rgba(196,98,42,0.10)' },
};

export default function TutorialCourseView({
  course,
  eyebrow,
}: {
  course: TutorialCourse;
  eyebrow: string;
}) {
  const first = course.sections[0]?.lessons[0];

  return (
    <>
      <TopNav />
      <div className="flex min-h-[calc(100vh-57px)] flex-col overflow-x-hidden lg:flex-row">
        <TutorialSidebar course={course} activeTitle="Curriculum" />

        <main className="min-w-0 w-full flex-1">
          <section
            className="border-b px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-12 lg:py-12"
            style={{
              borderColor: 'var(--line)',
              background:
                'radial-gradient(ellipse 70% 80% at 0% 0%, rgba(0,179,105,0.10), transparent 50%), radial-gradient(ellipse 60% 70% at 100% 0%, rgba(74,144,226,0.12), transparent 45%), var(--paper)',
            }}
          >
            <div className="max-w-[760px]">
              <div className="tab mb-3 sm:mb-4">{eyebrow}</div>
              <h1 className="mb-3 break-words font-display text-[28px] leading-[1.1] sm:text-[36px] md:text-[42px]">
                {course.title}
              </h1>
              <p className="mb-5 text-[15px] leading-relaxed sm:mb-6 sm:text-[16px]" style={{ color: 'var(--ink-soft)' }}>
                {course.description}
              </p>
              <div className="mb-6 flex flex-wrap gap-2 text-[13px] sm:mb-7">
                <span className="pill">{course.totalLessons} lessons</span>
                <span className="pill">Beginner → Pro</span>
                {course.tag && <span className="pill">{course.tag}</span>}
              </div>
              {first && (
                <Link href={`/tutorials/${course.slug}/${first.slug}`} className="btn btn-primary w-full sm:w-auto">
                  <Play size={16} /> Start from the beginning
                </Link>
              )}
            </div>
          </section>

          <section className="px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-12">
            <div className="mb-6 max-w-[760px]">
              <h2 className="mb-2 font-display text-[22px] sm:text-[26px]">Curriculum</h2>
              <p className="text-[14.5px] sm:text-[15px]" style={{ color: 'var(--ink-soft)' }}>
                Work through each section in order. Every lesson ends with practice and key points so the idea sticks.
              </p>
            </div>

            <div className="mx-auto max-w-[860px] space-y-7 sm:space-y-8">
              {course.sections.map((section) => {
                const style = LEVEL_STYLE[section.level];
                const minutes = section.lessons.reduce((n, l) => n + l.minutes, 0);
                return (
                  <div key={section.id}>
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
                      <div className="min-w-0">
                        <span
                          className="mb-1.5 inline-block rounded-md px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.1em]"
                          style={{ background: style.bg, color: style.color }}
                        >
                          {style.label}
                        </span>
                        <h3 className="break-words font-display text-[20px] sm:text-[22px]">{section.title}</h3>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                        <Clock size={13} /> {section.lessons.length} lessons · ~{minutes} min
                      </span>
                    </div>

                    <ol className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--line)' }}>
                      {section.lessons.map((lesson, idx) => (
                        <li
                          key={lesson.slug}
                          className="border-t first:border-t-0"
                          style={{ borderColor: 'var(--line)' }}
                        >
                          <Link
                            href={`/tutorials/${course.slug}/${lesson.slug}`}
                            className="flex items-start justify-between gap-3 px-3 py-3.5 transition-colors hover:bg-[var(--paper-dim)] sm:px-5"
                          >
                            <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
                              <span
                                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-medium"
                                style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }}
                              >
                                {lesson.order}
                              </span>
                              <div className="min-w-0">
                                <div className="text-[14.5px] font-medium leading-snug sm:truncate sm:text-[15px]">
                                  {lesson.title}
                                </div>
                                <p
                                  className="mt-0.5 line-clamp-2 text-[12.5px] sm:text-[13px]"
                                  style={{ color: 'var(--ink-soft)' }}
                                >
                                  {lesson.description}
                                </p>
                              </div>
                            </div>
                            <div
                              className="flex shrink-0 items-center gap-2 pt-1 text-[12.5px]"
                              style={{ color: 'var(--ink-soft)' }}
                            >
                              <span className="hidden sm:inline">{lesson.minutes} min</span>
                              <ArrowRight size={15} className={idx === 0 ? 'text-[var(--green-deep)]' : ''} />
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
