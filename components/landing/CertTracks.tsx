import Link from 'next/link';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import type { Course } from '@/lib/types';
import { CERT_TRACKS, coursesForTrack } from '@/lib/certTracks';
import CourseList from '@/components/CourseList';
import Reveal from '@/components/Reveal';

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

        <div className="mb-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {CERT_TRACKS.map((t) => (
            <Link
              key={t.id}
              href={t.href}
              className="group overflow-hidden rounded-[18px] border transition hover:-translate-y-1"
              style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.image} alt="" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
              <div className="p-5">
                <div className="mb-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--green-deep)' }}>
                  <BadgeCheck size={12} /> {t.badge}
                </div>
                <div className="mb-1 text-[12.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>{t.issuer}</div>
                <h3 className="mb-2 font-display text-[17px] leading-snug group-hover:underline">{t.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{t.blurb}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="space-y-12">
          {tracks.slice(0, 3).map(({ track, items }) => (
            <div key={track.id} id={track.id}>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--green-deep)' }}>
                    {track.issuer}
                  </div>
                  <h3 className="font-display text-[22px] sm:text-[26px]">{track.title}</h3>
                  <p className="mt-1 max-w-[560px] text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>{track.blurb}</p>
                </div>
                <Link href={track.href} className="inline-flex items-center gap-1 text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                  View track <ArrowRight size={15} />
                </Link>
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
