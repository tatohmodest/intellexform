import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Course } from '@/lib/types';
import { CERT_TRACKS, coursesForTrack } from '@/lib/certTracks';
import CourseList from '@/components/CourseList';
import Reveal from '@/components/Reveal';
import { CertBrandMark } from '@/components/certs/CertBrandMark';
import { CertTrackHero } from '@/components/certs/CertTrackHero';

export default function CertTracks({ courses }: { courses: Course[] }) {
  const tracks = CERT_TRACKS.map((t) => ({
    track: t,
    items: coursesForTrack(courses, t, 5),
  })).filter((t) => t.items.length > 0);

  if (!tracks.length) return null;

  return (
    <section id="certificates" className="py-16 sm:py-20" style={{ background: 'var(--paper-dim)' }}>
      <div className="wrap">
        <Reveal className="mb-10 max-w-[700px]">
          <div className="tab mb-4">Professional certificates</div>
          <h2 className="mb-3 text-[27px] leading-[1.15] sm:text-[36px] sm:leading-[1.1]">
            Accredited paths. Intellex credentials. Job-ready proof.
          </h2>
          <p className="text-base" style={{ color: 'var(--ink-soft)' }}>
            Prepare for EC-Council CEH, Microsoft Azure & cloud roles, Data Analysis careers — and earn the
            Intellex Professional Certificate when you finish the work.
          </p>
        </Reveal>

        {/* Brand-led track rail — marks & issuers, not AI photo cards */}
        <div className="mb-12 grid gap-3 sm:grid-cols-2">
          {CERT_TRACKS.map((t) => (
            <Link
              key={t.id}
              href={t.href}
              className="group relative flex items-center gap-4 overflow-hidden rounded-[18px] border px-4 py-4 transition hover:-translate-y-0.5 sm:px-5"
              style={{
                borderColor: 'var(--line)',
                background: 'var(--paper)',
              }}
            >
              <span
                className="absolute inset-y-0 left-0 w-1 opacity-90 transition group-hover:w-1.5"
                style={{ background: t.accent }}
                aria-hidden
              />
              <CertBrandMark mark={t.mark} className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
              <span className="min-w-0 flex-1">
                <span className="mb-0.5 block font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: t.accent }}>
                  {t.badge}
                </span>
                <span className="block text-[12.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
                  {t.issuer}
                </span>
                <span className="mt-0.5 block font-display text-[16px] leading-snug group-hover:underline sm:text-[17px]">
                  {t.title}
                </span>
              </span>
              <ArrowRight
                size={16}
                className="shrink-0 opacity-40 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                style={{ color: t.accent }}
              />
            </Link>
          ))}
        </div>

        <div className="space-y-12">
          {tracks.slice(0, 3).map(({ track, items }) => (
            <div key={track.id} id={track.id}>
              <div className="mb-4">
                <CertTrackHero
                  track={track}
                  courseCount={items.length}
                  ctaHref={track.href}
                  ctaLabel="View full track"
                  compact
                />
              </div>
              <CourseList courses={items} issuer={track.issuer} />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/certifications" className="btn btn-primary">
            Explore all certificate tracks
          </Link>
        </div>
      </div>
    </section>
  );
}
