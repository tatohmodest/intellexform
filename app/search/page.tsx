import Link from 'next/link';
import { BookOpen, GraduationCap } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import Rail from '@/components/landing/Rail';
import SiteSearch from '@/components/landing/SiteSearch';
import { getAllCourses } from '@/lib/repo';
import { getTutorialSearchIndex } from '@/lib/tutorials/searchIndex';
import { filterTutorialSearchIndex } from '@/lib/tutorials/searchFilter';

export const dynamic = 'force-dynamic';

function filterCourses(
  courses: { slug: string; name: string; type?: string; shortDescription?: string }[],
  query: string,
  limit = 24,
) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return courses
    .filter((c) => {
      const hay = `${c.name} ${c.type || ''} ${c.shortDescription || ''}`.toLowerCase();
      return hay.includes(q);
    })
    .slice(0, limit);
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q || '').trim();

  const [allCourses, tutorialIndex] = await Promise.all([
    getAllCourses(),
    Promise.resolve(getTutorialSearchIndex()),
  ]);

  const courses = allCourses.map((c) => ({
    slug: c.slug,
    name: c.name,
    type: c.type,
    shortDescription: c.shortDescription,
  }));

  const courseHits = q ? filterCourses(courses, q, 24) : [];
  const tutorialHits = q ? filterTutorialSearchIndex(tutorialIndex, q, 40) : [];
  const tutorialCourses = tutorialHits.filter((i) => i.kind === 'tutorial');
  const tutorialLessons = tutorialHits.filter((i) => i.kind === 'lesson');
  const total = courseHits.length + tutorialHits.length;

  return (
    <>
      <Rail />
      <TopNav />
      <main className="pb-20 pt-10 sm:pt-14">
        <div className="wrap max-w-[820px]">
          <div className="tab mb-3">Search</div>
          <h1 className="mb-2 font-display text-[28px] leading-tight sm:text-[36px]">
            {q ? `Results for “${q}”` : 'Search courses & tutorials'}
          </h1>
          <p className="mb-6 text-[15px]" style={{ color: 'var(--ink-soft)' }}>
            {q
              ? total
                ? `${total} match${total === 1 ? '' : 'es'} across courses, tutorial paths, and lessons.`
                : 'No matches yet — try a broader skill name like Python, Docker, or NestJS.'
              : 'Find a paid course or a free tutorial path in one place.'}
          </p>

          <SiteSearch
            tutorialIndex={tutorialIndex}
            courses={courses}
            className="mb-10 max-w-xl"
            placeholder="Search for courses, tutorials, skills…"
          />

          {!q ? (
            <div className="flex flex-wrap gap-3">
              <Link href="/courses" className="btn btn-ghost">
                Browse courses
              </Link>
              <Link href="/tutorials" className="btn btn-primary">
                Free tutorials
              </Link>
            </div>
          ) : (
            <div className="space-y-10">
              {courseHits.length > 0 && (
                <section>
                  <h2 className="mb-4 font-display text-[20px]">Courses</h2>
                  <ul className="space-y-2">
                    {courseHits.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/courses/${c.slug}`}
                          className="flex items-start gap-3 rounded-2xl border px-4 py-3.5 transition hover:-translate-y-0.5"
                          style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
                        >
                          <GraduationCap size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                          <span>
                            <span className="block text-[15px] font-medium">{c.name}</span>
                            <span className="block text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                              {c.type || 'Course'}
                              {c.shortDescription ? ` · ${c.shortDescription}` : ''}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/courses?q=${encodeURIComponent(q)}`}
                    className="mt-4 inline-block text-[13px] font-semibold"
                    style={{ color: 'var(--green-deep)' }}
                  >
                    See all course matches →
                  </Link>
                </section>
              )}

              {tutorialCourses.length > 0 && (
                <section>
                  <h2 className="mb-4 font-display text-[20px]">Tutorial paths</h2>
                  <ul className="space-y-2">
                    {tutorialCourses.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-start gap-3 rounded-2xl border px-4 py-3.5 transition hover:-translate-y-0.5"
                          style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
                        >
                          <BookOpen size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--blue-ink)' }} />
                          <span>
                            <span className="block text-[15px] font-medium">{item.title}</span>
                            <span className="block text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                              {item.tag || 'Free tutorial'}
                              {item.description ? ` · ${item.description}` : ''}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {tutorialLessons.length > 0 && (
                <section>
                  <h2 className="mb-4 font-display text-[20px]">Lessons</h2>
                  <ul className="space-y-2">
                    {tutorialLessons.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-start gap-3 rounded-2xl border px-4 py-3.5 transition hover:-translate-y-0.5"
                          style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
                        >
                          <BookOpen size={18} className="mt-0.5 shrink-0" style={{ color: 'var(--ink-soft)' }} />
                          <span>
                            <span className="block text-[15px] font-medium">{item.title}</span>
                            <span className="block text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                              {item.courseTitle}
                              {item.level ? ` · ${item.level}` : ''}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {total === 0 && (
                <div className="flex flex-wrap gap-3">
                  <Link href={`/courses?q=${encodeURIComponent(q)}`} className="btn btn-ghost">
                    Search courses
                  </Link>
                  <Link href="/tutorials" className="btn btn-primary">
                    Browse tutorials
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
