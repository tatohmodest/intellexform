import Link from 'next/link';
import { ArrowUpRight, BookOpen, GraduationCap, Search, Sparkles } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import AdvisorDock from '@/components/landing/AdvisorDock';
import AskAdvisorButton from '@/components/landing/AskAdvisorButton';
import ProgrammeCard from '@/components/programmes/ProgrammeCard';
import { getAllCourses } from '@/lib/repo';
import { getRequestLocale } from '@/lib/i18n/server';
import { translateUiText } from '@/lib/i18n/translate';
import { searchProgrammes } from '@/lib/programmes';
import { getTutorialSearchIndex } from '@/lib/tutorials/searchIndex';
import { filterTutorialSearchIndex } from '@/lib/tutorials/searchFilter';

export const dynamic = 'force-dynamic';

const TOPICS = ['Web development', 'Data analysis', 'Cybersecurity', 'Mobile apps', 'Python', 'Full Stack Development'];

function filterCourses(
  courses: { slug: string; name: string; type?: string; shortDescription?: string }[],
  query: string,
  limit = 12,
) {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (!tokens.length) return [];
  return courses
    .filter((c) => {
      const hay = `${c.name} ${c.type || ''} ${c.shortDescription || ''}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    })
    .slice(0, limit);
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q || '').trim().slice(0, 120);
  const locale = getRequestLocale();
  const tr = (text: string) => translateUiText(text, locale);

  const [allCourses, tutorialIndex] = await Promise.all([
    getAllCourses().catch(() => []),
    Promise.resolve(getTutorialSearchIndex()),
  ]);

  const programmeHits = q ? searchProgrammes(q, tr).slice(0, 9) : [];
  const courseHits = q
    ? filterCourses(
        allCourses.map((c) => ({ slug: c.slug, name: c.name, type: c.type, shortDescription: c.shortDescription })),
        q,
      )
    : [];
  const tutorialHits = q ? filterTutorialSearchIndex(tutorialIndex, q, 24) : [];
  const tutorialPaths = tutorialHits.filter((i) => i.kind === 'tutorial');
  const tutorialLessons = tutorialHits.filter((i) => i.kind === 'lesson').slice(0, 8);
  const total = programmeHits.length + courseHits.length + tutorialHits.length;

  return (
    <div className="site">
      <TopNav />

      {/* Search header */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="mx-auto max-w-[1360px] rounded-[32px] bg-[var(--pastel-sky)] px-6 py-12 sm:px-12 sm:py-14">
          <div className="mx-auto max-w-[760px] text-center">
            <h1 className="text-[32px] font-extrabold leading-tight text-[var(--navy)] sm:text-[46px]">
              {q ? (
                <>
                  {tr('Results for')} <span className="text-[var(--green-deep)]">“{q}”</span>
                </>
              ) : (
                tr('What do you want to learn?')
              )}
            </h1>
            {q ? (
              <p className="mt-3 text-[16px] text-[var(--navy)]/70">
                {total
                  ? `${total} ${tr(total === 1 ? 'match' : 'matches')} · ${tr('programmes, courses and tutorials')}`
                  : tr('No matches yet. Try a broader skill, or ask our AI advisor.')}
              </p>
            ) : null}
            <form action="/search" method="get" className="mx-auto mt-7 flex max-w-[620px] items-center gap-2 rounded-2xl bg-white p-2 shadow-[0_12px_32px_-18px_rgba(18,50,79,0.35)]">
              <Search size={19} className="ml-3 shrink-0 text-[var(--ink-soft)]" />
              <input
                name="q"
                defaultValue={q}
                maxLength={120}
                placeholder={tr('Search programmes, courses, skills...')}
                aria-label={tr('Search programmes, courses, skills...')}
                className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-[16px] text-[var(--navy)] outline-none placeholder:text-[var(--ink-soft)]"
              />
              <button type="submit" className="shrink-0 rounded-xl bg-[var(--green)] px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-[var(--green-deep)]">
                {tr('Search')}
              </button>
            </form>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {TOPICS.map((topic) => (
                <Link
                  key={topic}
                  href={`/search?q=${encodeURIComponent(topic)}`}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    q.toLowerCase() === topic.toLowerCase() ? 'bg-[var(--navy)] text-white' : 'bg-white/70 text-[var(--navy)] hover:bg-white'
                  }`}
                >
                  {tr(topic)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="wrap !max-w-[1280px] pb-20 pt-12">
        {q && programmeHits.length > 0 && (
          <section>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <div className="text-[13px] font-semibold text-[var(--green-deep)]">{tr('Programmes')}</div>
                <h2 className="mt-1 text-[26px] font-bold text-[var(--navy)]">{tr('Learn it live with an instructor')}</h2>
              </div>
              <Link href="/programmes" className="hidden text-[14px] font-semibold text-[var(--green-deep)] sm:inline">
                {tr('All programmes →')}
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {programmeHits.map((p) => (
                <ProgrammeCard key={p.id} programme={p} />
              ))}
            </div>
          </section>
        )}

        {q && courseHits.length > 0 && (
          <section className="mt-14">
            <div className="text-[13px] font-semibold text-[var(--green-deep)]">{tr('Self-paced library')}</div>
            <h2 className="mt-1 text-[24px] font-bold text-[var(--navy)]">{tr('Courses')}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {courseHits.map((c) => (
                <Link
                  key={c.slug}
                  href={`/courses/${c.slug}`}
                  className="group flex items-start gap-3 rounded-3xl bg-[var(--paper-dim)] p-4 transition-colors hover:bg-[var(--pastel-mint)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--green-deep)]">
                    <GraduationCap size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug text-[var(--navy)]">{c.name}</span>
                    <span className="mt-0.5 line-clamp-2 block text-[13px] text-[var(--ink-soft)]">
                      {c.type || tr('Course')}
                      {c.shortDescription ? ` · ${c.shortDescription}` : ''}
                    </span>
                  </span>
                  <ArrowUpRight size={16} className="shrink-0 text-[var(--navy)]" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {q && tutorialPaths.length + tutorialLessons.length > 0 && (
          <section className="mt-14">
            <div className="text-[13px] font-semibold text-[var(--green-deep)]">{tr('Free tutorials')}</div>
            <h2 className="mt-1 text-[24px] font-bold text-[var(--navy)]">{tr('Tutorial paths and lessons')}</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[...tutorialPaths, ...tutorialLessons].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-3 rounded-3xl bg-[var(--paper-dim)] p-4 transition-colors hover:bg-[var(--pastel-sky)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--sky-deep)]">
                    <BookOpen size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold leading-snug text-[var(--navy)]">{item.title}</span>
                    <span className="mt-0.5 block text-[13px] text-[var(--ink-soft)]">
                      {item.kind === 'tutorial' ? item.tag || tr('Free tutorial') : `${item.courseTitle}${item.level ? ` · ${item.level}` : ''}`}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {(!q || total === 0) && (
          <section className="grid items-center gap-8 overflow-hidden rounded-[32px] bg-[var(--pastel-mint)] p-6 sm:p-10 md:grid-cols-[1fr_320px]">
            <div>
              <h2 className="text-[26px] font-bold text-[var(--navy)] sm:text-[32px]">
                {q ? tr('Not sure what to search for?') : tr('Not sure where to start?')}
              </h2>
              <p className="mt-3 max-w-[480px] text-[16px] leading-relaxed text-[var(--navy)]/75">
                {tr('Tell our AI advisor your goal and level, and it will point you to the right programme.')}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <AskAdvisorButton
                  question={q ? `I'm looking for ${q}. Which InTelleX programme fits me?` : undefined}
                  className="btn btn-dark !px-6"
                >
                  <Sparkles size={16} /> {tr('Ask the AI advisor')}
                </AskAdvisorButton>
                <Link href="/programmes" className="btn bg-white !px-6 text-[var(--navy)] hover:bg-white/80">
                  {tr('Browse all programmes')}
                </Link>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero_programmer.png" alt="" className="illo mx-auto w-full max-w-[300px]" />
          </section>
        )}
      </main>

      <Footer />
      <AdvisorDock />
    </div>
  );
}
