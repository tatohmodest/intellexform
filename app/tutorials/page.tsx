import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Layers } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import TrackLogo from '@/components/TrackLogo';
import { TUTORIALS, getFirstLessonSlug } from '@/lib/tutorials';
import { getCatalogTrack } from '@/lib/learn/catalog';

export const metadata = {
  title: 'Tutorials - Intellex',
  description:
    'Step-by-step tutorials from Intellex for registered students. Learn Computer Architecture, HTML, CSS, JavaScript, Next.js, Node.js & Express, NestJS, Python, Go, C++, Java, Rust, Ruby on Rails, Django, Flask, PostgreSQL, MongoDB, Flutter, Data Analysis, Digital Marketing, Networking, Docker, Kubernetes, Linux Administration, Bash Scripting, Arduino, and Pygame from beginner to pro.',
};

export default function TutorialsHubPage() {
  return (
    <>
      <TopNav />

      <section
        className="relative overflow-hidden border-b py-16 sm:py-20"
        style={{
          borderColor: 'var(--line)',
          background: '#fff',
          backgroundImage: 'radial-gradient(#e7e9ec 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      >
        <div className="wrap relative">
          <div className="tab mb-4">Student tutorials</div>
          <h1 className="mb-4 max-w-[720px] font-display text-[34px] leading-[1.08] sm:text-[48px]">
            Learn by doing, section by section
          </h1>
          <p className="max-w-[560px] text-[16px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Free for registered students with an InTelleX account. Clean, guided tutorials designed like the guides you love - but built for real skill.
            Start with Computer Architecture for hardware DNA, then HTML and CSS, JavaScript, Python, Go, C++, Java, or Rust. Build backends with Node.js & Express, NestJS, or Ruby on Rails, ship apps with Next.js or Flutter, make games with Pygame, use Django or Flask, store data with PostgreSQL or MongoDB, analyze it, master Networking, grow with Digital Marketing, containerize with Docker and Kubernetes, administer Linux, automate with Bash, and prototype electronics with Arduino.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="wrap">
          <div className="grid gap-5">
            {TUTORIALS.map((course) => {
              const track = getCatalogTrack(course.slug);
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
                        <TrackLogo
                          slug={course.slug}
                          color={track?.color}
                          size={40}
                        />
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
                        background: '#f3fbf7',
                        color: 'var(--ink)',
                      }}
                    >
                      <div>
                        <div
                          className="mb-3 inline-flex items-center gap-2 text-[13px] font-medium"
                          style={{ color: 'var(--green-deep)' }}
                        >
                          <BookOpen size={14} /> Path overview
                        </div>
                        <p className="mb-5 font-display text-[22px] leading-snug">{course.tagline}</p>
                        <ul className="space-y-2.5 text-[13.5px]" style={{ color: '#4b5563' }}>
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
                            color: 'var(--green-deep)',
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
