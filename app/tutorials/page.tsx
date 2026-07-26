import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Layers } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import { TUTORIALS, getFirstLessonSlug } from '@/lib/tutorials';

export const metadata = {
  title: 'Tutorials - Intellex',
  description:
    'Free step-by-step tutorials from Intellex. Learn JavaScript, Next.js, Node.js & Express, NestJS, Python, Go, Django, Flask, PostgreSQL, MongoDB, Flutter, Data Analysis, Digital Marketing, Docker, and Pygame from beginner to pro.',
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
            Clean, guided tutorials designed like the guides you love - but built for real skill.
            Start with JavaScript, Python, or Go, build backends with Node.js & Express or NestJS, ship apps with Next.js or Flutter, make games with Pygame, use Django or Flask, store data with PostgreSQL or MongoDB, analyze it, grow with Digital Marketing, and containerize with Docker.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="wrap">
          <div className="grid gap-5">
            {TUTORIALS.map((course) => {
              const beginnerCount = course.sections
                .filter((s) => s.level === 'beginner')
                .reduce((n, s) => n + s.lessons.length, 0);
              const intermediateCount = course.sections
                .filter((s) => s.level === 'intermediate')
                .reduce((n, s) => n + s.lessons.length, 0);
              const advancedCount = course.sections
                .filter((s) => s.level === 'advanced')
                .reduce((n, s) => n + s.lessons.length, 0);
              const minutes = course.sections.flatMap((s) => s.lessons).reduce((n, l) => n + l.minutes, 0);
              const firstSlug = getFirstLessonSlug(course);
              const highlights = course.highlights ?? [
                'Clear explanations with real examples',
                'Practice prompts after every lesson',
                'Capstone mini-projects at the end',
                'No fluff - one idea per section',
              ];

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
                        <span className="tab">{course.tag || 'Tutorial'}</span>
                        <span className="pill">{course.totalLessons} lessons</span>
                      </div>
                      <h2 className="mb-2 font-display text-[28px] leading-tight sm:text-[34px]">{course.title}</h2>
                      <p className="mb-5 max-w-[560px] text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                        {course.description}
                      </p>
                      <div className="mb-6 flex flex-wrap gap-4 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                        <span className="inline-flex items-center gap-1.5">
                          <Layers size={15} /> Beginner {beginnerCount} · Intermediate {intermediateCount} · Advanced{' '}
                          {advancedCount}
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
                        background:
                          course.slug === 'nextjs'
                            ? 'linear-gradient(160deg, #0C1116 0%, #10263d 55%, #0C1116 100%)'
                            : course.slug === 'python'
                              ? 'linear-gradient(160deg, #0C1116 0%, #2a2410 55%, #0C1116 100%)'
                              : course.slug === 'django'
                                ? 'linear-gradient(160deg, #0C1116 0%, #1a3324 55%, #0C1116 100%)'
                                : course.slug === 'flask'
                                  ? 'linear-gradient(160deg, #0C1116 0%, #2a1a14 55%, #0C1116 100%)'
                                  : course.slug === 'postgresql'
                                    ? 'linear-gradient(160deg, #0C1116 0%, #14263a 55%, #0C1116 100%)'
                                    : course.slug === 'mongodb'
                                      ? 'linear-gradient(160deg, #0C1116 0%, #16351f 55%, #0C1116 100%)'
                                      : course.slug === 'flutter'
                                        ? 'linear-gradient(160deg, #0C1116 0%, #0f2a3d 55%, #0C1116 100%)'
                                        : course.slug === 'data-analysis'
                                          ? 'linear-gradient(160deg, #0C1116 0%, #2a1830 55%, #0C1116 100%)'
                                          : course.slug === 'digital-marketing'
                                            ? 'linear-gradient(160deg, #0C1116 0%, #3a1f14 55%, #0C1116 100%)'
                                            : course.slug === 'golang'
                                              ? 'linear-gradient(160deg, #0C1116 0%, #0f2f35 55%, #0C1116 100%)'
                                              : course.slug === 'docker'
                                                ? 'linear-gradient(160deg, #0C1116 0%, #0d2a45 55%, #0C1116 100%)'
                                                : course.slug === 'nodejs-express'
                                                  ? 'linear-gradient(160deg, #0C1116 0%, #1a3320 55%, #0C1116 100%)'
                                                  : course.slug === 'nestjs'
                                                    ? 'linear-gradient(160deg, #0C1116 0%, #2a1630 55%, #0C1116 100%)'
                                                    : course.slug === 'pygame'
                                                      ? 'linear-gradient(160deg, #0C1116 0%, #1a2840 55%, #0C1116 100%)'
                                                      : 'linear-gradient(160deg, #0C1116 0%, #163024 55%, #0C1116 100%)',
                        color: 'var(--paper)',
                      }}
                    >
                      <div>
                        <div
                          className="mb-3 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]"
                          style={{ color: 'rgba(251,248,240,0.55)' }}
                        >
                          <BookOpen size={14} /> Path overview
                        </div>
                        <p className="mb-5 font-display text-[22px] leading-snug">{course.tagline}</p>
                        <ul className="space-y-2.5 text-[13.5px]" style={{ color: 'rgba(251,248,240,0.78)' }}>
                          {highlights.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      {firstSlug && (
                        <Link
                          href={`/tutorials/${course.slug}/${firstSlug}`}
                          className="mt-8 inline-flex items-center gap-2 text-[14px] font-semibold"
                          style={{
                            color:
                              course.slug === 'nextjs'
                                ? '#8fc0ff'
                                : course.slug === 'python'
                                  ? '#ffd666'
                                  : course.slug === 'django'
                                    ? '#8dffb5'
                                    : course.slug === 'flask'
                                      ? '#ffb38a'
                                      : course.slug === 'postgresql'
                                        ? '#9ecbff'
                                        : course.slug === 'mongodb'
                                          ? '#86efac'
                                          : course.slug === 'flutter'
                                            ? '#7dd3fc'
                                            : course.slug === 'data-analysis'
                                              ? '#e9b3ff'
                                              : course.slug === 'digital-marketing'
                                                ? '#ffc089'
                                                : course.slug === 'golang'
                                                  ? '#5dc9e0'
                                                  : course.slug === 'docker'
                                                    ? '#7eb6ff'
                                                    : course.slug === 'nodejs-express'
                                                      ? '#8dffb0'
                                                      : course.slug === 'nestjs'
                                                        ? '#f0abfc'
                                                        : course.slug === 'pygame'
                                                          ? '#9ecbff'
                                                          : '#7dffc0',
                          }}
                        >
                          Jump to lesson 1 <ArrowRight size={15} />
                        </Link>
                      )}
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
