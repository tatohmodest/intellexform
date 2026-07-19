import Link from 'next/link';
import { ArrowLeft, BadgeCheck, ArrowUpRight } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import Reveal from '@/components/Reveal';
import CourseList from '@/components/CourseList';
import { getAllCourses } from '@/lib/repo';
import { CERT_TRACKS, coursesForTrack } from '@/lib/certTracks';

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

          <Reveal className="mb-12 max-w-[720px]">
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

          <div className="mb-16 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {CERT_TRACKS.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="group overflow-hidden rounded-[18px] border transition hover:-translate-y-1"
                style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt="" className="aspect-[4/3] w-full object-cover" />
                <div className="p-5">
                  <div className="mb-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--green-deep)' }}>
                    <BadgeCheck size={12} /> {t.badge}
                  </div>
                  <div className="mb-1 text-[12.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>{t.issuer}</div>
                  <h2 className="font-display text-[17px] leading-snug group-hover:underline">{t.title}</h2>
                </div>
              </a>
            ))}
          </div>

          <div className="space-y-16">
            {CERT_TRACKS.map((track) => {
              const items = coursesForTrack(all, track, 8);
              return (
                <div key={track.id} id={track.id}>
                  <div className="mb-6 grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                      <div className="mb-2 overflow-hidden rounded-[18px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={track.image} alt="" className="aspect-[4/3] w-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--green-deep)' }}>
                        {track.issuer}
                      </div>
                      <h2 className="mb-3 font-display text-[26px] sm:text-[32px]">{track.title}</h2>
                      <p className="mb-5 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{track.blurb}</p>
                      <div className="flex flex-wrap gap-3">
                        <Link href="/register" className="btn btn-primary">Start this path</Link>
                        <Link href={`/courses?q=${encodeURIComponent(track.issuer.split(' ')[0])}`} className="btn btn-ghost">
                          Browse related courses <ArrowUpRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <CourseList courses={items} issuer={track.issuer} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
