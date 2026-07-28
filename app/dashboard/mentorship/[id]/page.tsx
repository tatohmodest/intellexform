import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import {
  ArrowLeft,
  Award,
  Building2,
  Clock,
  Globe2,
  Radio,
  Star,
  Video,
} from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  courseDurationHours,
  findMentor,
  listCoursesByInstructor,
  listUserInstitutions,
} from '@/lib/learn/ecosystem';
import BookInstructorButton from '@/components/dashboard/BookInstructorButton';

export const dynamic = 'force-dynamic';

export default async function InstructorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/mentorship/${params.id}`);

  const mentor = await findMentor(params.id);
  if (!mentor) notFound();

  const [courses, institutions] = await Promise.all([
    listCoursesByInstructor(params.id, { publishedOnly: true }),
    listUserInstitutions(params.id),
  ]);

  return (
    <div className="mx-auto max-w-[880px] overflow-x-hidden">
      <Link
        href="/dashboard/mentorship"
        className="mb-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold"
        style={{ color: 'var(--ink-soft)' }}
      >
        <ArrowLeft size={14} /> Instructors
      </Link>

      <header
        className="mb-8 overflow-hidden text-white"
        style={{
          background: `linear-gradient(120deg, ${mentor.accent || '#00b369'} 0%, #0C1116 72%)`,
        }}
      >
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-9">
          <div className="flex min-w-0 items-start gap-4">
            {mentor.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mentor.avatarUrl}
                alt={mentor.name}
                className="h-20 w-20 shrink-0 object-cover sm:h-24 sm:w-24"
              />
            ) : (
              <span
                className="flex h-20 w-20 shrink-0 items-center justify-center font-display text-[28px] font-bold sm:h-24 sm:w-24"
                style={{ background: 'rgba(255,255,255,0.12)' }}
              >
                {mentor.initials}
              </span>
            )}
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                Instructor · Mentorship
              </p>
              <h1 className="mt-1 break-words font-display text-[30px] leading-[0.95] sm:text-[40px]">
                {mentor.name}
              </h1>
              <p className="mt-2 text-[14px] text-white/75">{mentor.title}</p>
              {mentor.instructorBadge && (
                <p className="mt-2 inline-flex items-center gap-1.5 border border-white/25 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/85">
                  <Award size={11} /> {mentor.instructorBadge}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/55">
                <span className="inline-flex items-center gap-1">
                  <Star size={11} /> {mentor.rating.toFixed(1)}
                </span>
                <span>{mentor.sessionsCompleted} sessions</span>
                <span>{mentor.sessionMinutes} min</span>
                <span>{mentor.priceXAF.toLocaleString()} XAF</span>
              </div>
            </div>
          </div>
          <BookInstructorButton mentor={mentor} />
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="min-w-0 space-y-8 lg:col-span-3">
          {mentor.introVideoUrl && (
            <section>
              <h2 className="mb-3 font-display text-[20px]">Meet {mentor.name.split(/\s+/)[0]}</h2>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                src={mentor.introVideoUrl}
                controls
                playsInline
                className="w-full rounded-xl"
                style={{ background: '#0C1116' }}
              />
            </section>
          )}

          <section className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
            <h2 className="font-display text-[20px]">About</h2>
            <p className="mt-3 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {mentor.bio}
            </p>
          </section>

          <section className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
            <h2 className="font-display text-[20px]">Expertise</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {mentor.expertise.map((e) => (
                <li
                  key={e}
                  className="border px-2.5 py-1 text-[12px] font-semibold"
                  style={{ borderColor: 'var(--line)' }}
                >
                  {e}
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
            <h2 className="font-display text-[20px]">
              Courses by {mentor.name.split(/\s+/)[0]}
            </h2>
            {courses.length === 0 ? (
              <p className="mt-3 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                No published courses yet. Book a 1-on-1 session instead.
              </p>
            ) : (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {courses.map((c) => {
                  const hours = courseDurationHours(c);
                  return (
                    <li key={c.id} className="border" style={{ borderColor: 'var(--line)' }}>
                      {c.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.coverUrl}
                          alt=""
                          className="aspect-video w-full object-cover"
                        />
                      ) : (
                        <div
                          className="flex aspect-video w-full items-center justify-center"
                          style={{ background: `${c.accent || '#00b369'}18` }}
                        >
                          <Video size={20} style={{ color: c.accent || '#00b369' }} />
                        </div>
                      )}
                      <div className="p-3.5">
                        <h3 className="text-[15px] font-semibold leading-snug">{c.title}</h3>
                        {c.subtitle && (
                          <p className="mt-1 line-clamp-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                            {c.subtitle}
                          </p>
                        )}
                        <div
                          className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em]"
                          style={{ color: 'var(--ink-soft)' }}
                        >
                          {c.deliveryMode === 'live' || c.deliveryMode === 'hybrid' ? (
                            <span className="inline-flex items-center gap-1">
                              <Radio size={10} /> Live
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <Video size={10} /> Self-paced
                            </span>
                          )}
                          {hours > 0 && (
                            <span className="inline-flex items-center gap-1">
                              <Clock size={10} /> {hours}h
                            </span>
                          )}
                          {c.certificate && (
                            <span className="inline-flex items-center gap-1">
                              <Award size={10} /> Certificate
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                          {c.priceXAF ? `${c.priceXAF.toLocaleString()} XAF` : 'Free'}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-6 lg:col-span-2">
          {institutions.length > 0 && (
            <div className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
              <h3 className="font-display text-[18px]">Teaches at</h3>
              <ul className="mt-3 space-y-2">
                {institutions.map((i) => (
                  <li key={i.slug}>
                    <Link
                      href={`/dashboard/institutions/${i.slug}`}
                      className="flex items-center gap-2.5 text-[13.5px] font-medium"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg text-[12px] font-bold text-white"
                        style={{ background: i.color }}
                      >
                        {i.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={i.logoUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          i.name.slice(0, 1)
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate">{i.name}</span>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                          {i.role}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {institutions.length === 0 && (
            <div className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
              <h3 className="font-display text-[18px]">Teaches at</h3>
              <p className="mt-2 inline-flex items-center gap-2 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                <Building2 size={14} /> Independent on InTelleX
              </p>
            </div>
          )}

          <div className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
            <h3 className="font-display text-[18px]">Languages</h3>
            <p className="mt-2 flex items-center gap-2 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
              <Globe2 size={14} /> {mentor.languages.join(', ') || 'English'}
            </p>
          </div>

          <div className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
            <h3 className="font-display text-[18px]">Session</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Live HD video with screen sharing via InTelleX session rooms. Pick an open slot when
              you book.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
              <Video size={14} /> {mentor.slots.length} open slot{mentor.slots.length === 1 ? '' : 's'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
