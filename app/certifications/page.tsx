import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import Reveal from '@/components/Reveal';
import CourseList from '@/components/CourseList';
import { getAllCourses } from '@/lib/repo';
import { CERT_TRACKS, coursesForTrack } from '@/lib/certTracks';
import { CertBrandMark } from '@/components/certs/CertBrandMark';
import { CertTrackHero } from '@/components/certs/CertTrackHero';

export const metadata = {
  title: 'Certifications — Intellex',
  description:
    'EC-Council CEH prep, Microsoft Azure & cloud paths, Data Analysis tracks, and the Intellex Professional Certificate.',
};

export const dynamic = 'force-dynamic';

export default async function CertificationsPage() {
  const all = await getAllCourses();

  return (
    <>
      <TopNav />
      <section className="py-14 sm:py-20">
        <div className="wrap">
          <Link href="/#certificates" className="mb-8 inline-flex items-center gap-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
            <ArrowLeft size={15} /> Back to certificates
          </Link>

          <Reveal className="mb-10 max-w-[720px]">
            <div className="tab mb-4">Certifications</div>
            <h1 className="mb-4 text-[30px] leading-[1.1] sm:text-[42px]">
              Accredited paths & Intellex credentials
            </h1>
            <p className="text-base leading-relaxed sm:text-[17px]" style={{ color: 'var(--ink-soft)' }}>
              Prepare for industry exams like EC-Council CEH and Microsoft-aligned Azure/cloud roles,
              build a Data Analysis career track, and earn the Intellex Professional Certificate when you
              finish the work.
            </p>
          </Reveal>

          {/* Jump nav — brand marks, not photo thumbnails */}
          <nav aria-label="Certificate tracks" className="mb-16">
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {CERT_TRACKS.map((t) => {
                const count = coursesForTrack(all, t, 100).length;
                return (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="group flex h-full flex-col gap-3 rounded-[18px] border px-4 py-4 transition hover:-translate-y-0.5"
                      style={{
                        borderColor: 'var(--line)',
                        background: `linear-gradient(160deg, ${t.accentSoft}, var(--paper))`,
                      }}
                    >
                      <CertBrandMark mark={t.mark} className="h-12 w-12" />
                      <div>
                        <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: t.accent }}>
                          {t.badge}
                        </div>
                        <div className="text-[12.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
                          {t.issuer}
                        </div>
                        <div className="mt-1 font-display text-[15px] leading-snug group-hover:underline">
                          {t.title}
                        </div>
                        <div className="mt-2 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                          {count} course{count === 1 ? '' : 's'} in catalogue
                        </div>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="space-y-16">
            {CERT_TRACKS.map((track) => {
              const items = coursesForTrack(all, track, 8);
              return (
                <article key={track.id} id={track.id} className="scroll-mt-24">
                  <div className="mb-6">
                    <CertTrackHero
                      track={track}
                      courseCount={items.length}
                      ctaHref="/register"
                      ctaLabel="Start this path"
                    />
                  </div>

                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                      Related courses from the Intellex catalogue for this credential path.
                    </p>
                    <Link
                      href={`/courses?q=${encodeURIComponent(
                        track.id === 'microsoft-azure'
                          ? 'Azure'
                          : track.id === 'ec-council-ceh'
                            ? 'Cybersecurity'
                            : track.id === 'data-analysis'
                              ? 'Data'
                              : 'Certificate',
                      )}`}
                      className="inline-flex items-center gap-1 text-[13px] font-semibold"
                      style={{ color: track.accent }}
                    >
                      Browse related courses <ArrowUpRight size={15} />
                    </Link>
                  </div>

                  <CourseList courses={items} issuer={track.issuer} />
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
