import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Layers } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import { TUTORIALS } from '@/lib/tutorials/javascript';

export const metadata = {
  title: 'Tutorials — Intellex',
  description:
    'Free step-by-step tutorials from Intellex. Start with the complete frontend JavaScript path from beginner to pro.',
};

export default function TutorialsHubPage() {
  return (
    <>
      <TopNav />

      <section
        className="relative overflow-hidden border-b py-16 sm:py-20"
        style={{
          borderColor: 'var(--line)',
          background:
            'radial-gradient(ellipse 80% 60% at 10% 0%, rgba(0,179,105,0.12), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 20%, rgba(74,144,226,0.14), transparent 50%), var(--paper-dim)',
        }}
      >
        <div className="wrap relative">
          <div className="tab mb-4">Free tutorials</div>
          <h1 className="mb-4 max-w-[720px] font-display text-[34px] leading-[1.08] sm:text-[48px]">
            Learn by doing, section by section
          </h1>
          <p className="max-w-[560px] text-[16px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Clean, guided tutorials designed like the guides you love — but built for real frontend skill.
            Start with JavaScript and move from beginner to advanced at your own pace.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="wrap">
          <div className="grid gap-5">
            {TUTORIALS.map((course) => {
              const beginnerCount = course.sections.filter((s) => s.level === 'beginner').reduce((n, s) => n + s.lessons.length, 0);
              const intermediateCount = course.sections.filter((s) => s.level === 'intermediate').reduce((n, s) => n + s.lessons.length, 0);
              const advancedCount = course.sections.filter((s) => s.level === 'advanced').reduce((n, s) => n + s.lessons.length, 0);
              const minutes = course.sections.flatMap((s) => s.lessons).reduce((n, l) => n + l.minutes, 0);

              return (
                <article
                  key={course.slug}
                  className="overflow-hidden rounded-[22px] border"
                  style={{
                    borderColor: 'var(--line)',
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(242,246,251,0.9) 100%)',
                  }}
                >
                  <div className="grid lg:grid-cols-[1.4fr_0.9fr]">
                    <div className="p-7 sm:p-9">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="tab">Frontend</span>
                        <span className="pill">{course.totalLessons} lessons</span>
                      </div>
                      <h2 className="mb-2 font-display text-[28px] leading-tight sm:text-[34px]">{course.title}</h2>
                      <p className="mb-5 max-w-[560px] text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                        {course.description}
                      </p>
                      <div className="mb-6 flex flex-wrap gap-4 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                        <span className="inline-flex items-center gap-1.5">
                          <Layers size={15} /> Beginner {beginnerCount} · Intermediate {intermediateCount} · Advanced {advancedCount}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={15} /> ~{Math.round(minutes / 60)} hours of guided reading
                        </span>
                      </div>
                      <Link href={`/tutorials/${course.slug}`} className="btn btn-primary">
                        Start learning <ArrowRight size={17} />
                      </Link>
                    </div>

                    <div
                      className="relative flex flex-col justify-between border-t p-7 sm:p-9 lg:border-l lg:border-t-0"
                      style={{
                        borderColor: 'var(--line)',
                        background: 'linear-gradient(160deg, #0C1116 0%, #163024 55%, #0C1116 100%)',
                        color: 'var(--paper)',
                      }}
                    >
                      <div>
                        <div className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'rgba(251,248,240,0.55)' }}>
                          <BookOpen size={14} /> Path overview
                        </div>
                        <p className="mb-5 font-display text-[22px] leading-snug">{course.tagline}</p>
                        <ul className="space-y-2.5 text-[13.5px]" style={{ color: 'rgba(251,248,240,0.78)' }}>
                          <li>Clear explanations with real browser examples</li>
                          <li>Practice prompts after every lesson</li>
                          <li>Capstone mini-projects at the end</li>
                          <li>No fluff — one idea per section</li>
                        </ul>
                      </div>
                      <Link
                        href={`/tutorials/${course.slug}/what-is-javascript`}
                        className="mt-8 inline-flex items-center gap-2 text-[14px] font-semibold"
                        style={{ color: '#7dffc0' }}
                      >
                        Jump to lesson 1 <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
