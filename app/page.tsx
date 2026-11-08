import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, MessageCircle, Minus } from 'lucide-react';
import { getAllMentors } from '@/lib/learn/ecosystem';
import type { Mentor } from '@/lib/learn/mentors';
import { TESTIMONIALS } from '@/lib/data/testimonials';
import { orientationWhatsappLink } from '@/lib/contact';
import { PROGRAMME_CATEGORIES, PROGRAMMES, priceNumber, programmeHref } from '@/lib/programmes';
import { BENEFIT_GROUPS, COMPARE_COLUMNS, COMPARE_ROWS, JOURNEY, TIERS } from '@/lib/positioning';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import Testimonials from '@/components/landing/Testimonials';
import AdvisorDock from '@/components/landing/AdvisorDock';
import AskAdvisorButton from '@/components/landing/AskAdvisorButton';
import ProgrammeJourney, { ArtefactCard } from '@/components/landing/ProgrammeJourney';

export const dynamic = 'force-dynamic';

const PULL_QUOTE_ID = 'cm7n7nfvn000221m8b3bashfo';

/** Hero fan: the five phases of a programme, as the cards a learner actually sees. */
const FAN = [
  { tilt: '-rotate-[8deg] translate-y-10', z: 'z-10' },
  { tilt: '-rotate-[4deg] translate-y-3', z: 'z-20' },
  { tilt: 'rotate-0 -translate-y-2', z: 'z-30' },
  { tilt: 'rotate-[4deg] translate-y-3', z: 'z-20' },
  { tilt: 'rotate-[8deg] translate-y-10', z: 'z-10' },
];

const DIRECTION_BG: Record<string, string> = {
  software: 'var(--pastel-sky)',
  data: 'var(--pastel-butter)',
  security: 'var(--pastel-lilac)',
  marketing: 'var(--pastel-mint)',
};

const VETTING = [
  { title: 'Experience review', body: 'CV and professional background checked against the subjects they will teach.' },
  { title: 'Identity verified', body: 'Every instructor is a verified, named person. No anonymous accounts.' },
  { title: 'Teaching sample', body: 'A recorded introduction shows us how they explain before they meet a student.' },
];

function SectionHead({ eyebrow, title, lead, center }: { eyebrow: string; title: string; lead?: string; center?: boolean }) {
  return (
    <div className={`max-w-[680px] ${center ? 'mx-auto text-center' : ''}`}>
      <div className="text-[13px] font-semibold text-[var(--green-deep)]">{eyebrow}</div>
      <h2 className="mt-2 text-[32px] font-bold leading-[1.1] text-[var(--navy)] sm:text-[46px]">{title}</h2>
      {lead && <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-soft)] sm:text-[17px]">{lead}</p>}
    </div>
  );
}

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function InstructorCard({ m }: { m: Mentor }) {
  return (
    <div className="rounded-3xl bg-white p-5">
      {m.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.avatarUrl} alt={m.name} className="h-20 w-20 rounded-2xl object-cover" />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--pastel-mint)] font-display text-[24px] font-bold text-[var(--green-deep)]">
          {m.initials || initials(m.name)}
        </div>
      )}
      <h3 className="mt-4 text-[18px] font-bold text-[var(--navy)]">{m.name}</h3>
      {m.title && <p className="mt-0.5 text-[14px] text-[var(--green-deep)]">{m.title}</p>}
      {m.expertise?.length > 0 && (
        <p className="mt-2 text-[13.5px] text-[var(--ink-soft)]">{m.expertise.slice(0, 3).join(' · ')}</p>
      )}
    </div>
  );
}

export default async function HomePage() {
  const mentors = (await getAllMentors()).filter((m) => m.name).slice(0, 4);
  const quote = TESTIMONIALS.find((t) => t.id === PULL_QUOTE_ID);
  const faces = TESTIMONIALS.filter((t) => t.photo).slice(0, 4);

  const directions = PROGRAMME_CATEGORIES.filter((c) => c.id !== 'foundations').map((c) => {
    const list = PROGRAMMES.filter((p) => p.category === c.id);
    return { ...c, list, from: Math.min(...list.map((p) => p.monthlyXAF || p.priceXAF)) };
  });
  const foundationsFrom = Math.min(...PROGRAMMES.filter((p) => p.short).map((p) => p.priceXAF));

  return (
    <div className="site">
      <TopNav />

      {/* ── Hero: the promise, then the experience as cards ─────── */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[32px] bg-[var(--pastel-sky)] px-5 pt-14 sm:px-12 sm:pt-20">
          <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-white/40" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[var(--pastel-mint)]/70" />

          <div className="relative mx-auto max-w-[860px] text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[var(--navy)]">
              <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
              A teaching school for tech and digital careers
            </span>
            <h1 className="mt-6 text-[42px] font-extrabold leading-[1.02] text-[var(--navy)] sm:text-[64px] xl:text-[76px]">
              Tutorials show you how.
              <span className="block text-[var(--green-deep)]">We make sure you can.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[600px] text-[17px] leading-relaxed text-[var(--navy)]/75 sm:text-[18px]">
              Join a programme, learn live with an InTelleX instructor, build projects that someone actually reviews,
              and finish able to do the work, not just talk about it.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/programmes" className="btn btn-dark !px-6">
                Find your programme <ArrowRight size={16} />
              </Link>
              <Link href="/why-intellex" className="btn bg-white !px-6 text-[var(--navy)] hover:bg-white/80">
                Why learn with us
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="flex -space-x-2.5">
                {faces.map((t) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={t.id} src={t.photo} alt={t.name} className="h-8 w-8 rounded-full object-cover ring-[3px] ring-[var(--pastel-sky)]" />
                ))}
              </div>
              <span className="text-[13.5px] font-medium text-[var(--navy)]/70">Learners in Cameroon, Ireland and beyond</span>
            </div>
          </div>

          {/* Fan of real dashboard moments, one per phase */}
          <div className="relative mx-auto mt-14 hidden max-w-[1180px] items-end justify-center lg:flex">
            {JOURNEY.map((p, i) => (
              <div key={p.id} className={`-mx-4 w-[260px] shrink-0 ${FAN[i].tilt} ${FAN[i].z}`}>
                <div className="mb-2 text-center text-[12px] font-semibold text-[var(--navy)]/60">{p.when}</div>
                <ArtefactCard phase={p} className="!rounded-b-none pb-10" />
              </div>
            ))}
          </div>
          <div className="relative -mx-5 mt-10 flex snap-x gap-3 overflow-x-auto px-5 pb-8 lg:hidden">
            {JOURNEY.map((p) => (
              <div key={p.id} className="w-[250px] shrink-0 snap-center">
                <div className="mb-2 text-[12px] font-semibold text-[var(--navy)]/60">{p.when}</div>
                <ArtefactCard phase={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The honest question ─────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="wrap !max-w-[1280px]">
          <div className="grid items-end gap-6 lg:grid-cols-[1.1fr_1fr]">
            <SectionHead eyebrow="The honest question" title="Why pay us when YouTube is free?" />
            <p className="text-[17px] leading-relaxed text-[var(--ink-soft)]">
              Fair question. The information is free; we publish free tutorials too. What is not free is a person who
              decides what you learn next, checks what you build and notices when you stop.{' '}
              <span className="font-semibold text-[var(--navy)]">That is what you pay InTelleX for.</span>
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {COMPARE_COLUMNS.map((col, c) => {
              const ours = c === 2;
              return (
                <div
                  key={col}
                  className={`flex flex-col rounded-[28px] p-6 sm:p-8 ${ours ? 'bg-[var(--green)] text-white' : 'bg-[var(--paper-dim)]'}`}
                >
                  <h3 className={`text-[22px] font-bold ${ours ? 'text-white' : 'text-[var(--navy)]'}`}>{col}</h3>
                  <dl className="mt-6 flex flex-col gap-4">
                    {COMPARE_ROWS.map((r) => (
                      <div key={r.label} className={`border-t pt-4 ${ours ? 'border-white/20' : 'border-black/5'}`}>
                        <dt className={`text-[12.5px] font-medium ${ours ? 'text-white/70' : 'text-[var(--ink-soft)]'}`}>{r.label}</dt>
                        <dd className={`mt-1 flex items-start gap-2 text-[15.5px] font-semibold ${ours ? 'text-white' : 'text-[var(--navy)]'}`}>
                          {ours ? (
                            <Check size={16} strokeWidth={3} className="mt-1 shrink-0" />
                          ) : (
                            <Minus size={16} className="mt-1 shrink-0 opacity-40" />
                          )}
                          {r.values[c]}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── The experience, week by week ────────────────────── */}
      <section id="experience" className="scroll-mt-16 px-3 sm:px-5">
        <div className="mx-auto max-w-[1360px] rounded-[32px] bg-[var(--pastel-mint)] px-5 py-16 sm:px-12 lg:px-16 lg:py-24">
          <SectionHead
            eyebrow="What actually happens"
            title="Six months, week by week."
            lead="Here is what a career programme looks like from the inside. No mystery about what you are paying for."
          />
          <div className="mt-12">
            <ProgrammeJourney />
          </div>
        </div>
      </section>

      {/* ── What you leave with ─────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="wrap !max-w-[1280px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              eyebrow="What you gain"
              title="Not a course. A way of getting good."
              lead="Everything below is something you can check in your first weeks. If it is not happening, tell us."
            />
            <Link href="/why-intellex" className="btn btn-soft">
              The full case <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {BENEFIT_GROUPS.map((g) => (
              <div key={g.id} className="rounded-[28px] p-7 sm:p-9" style={{ background: g.bg }}>
                <h3 className="text-[26px] font-extrabold leading-tight text-[var(--navy)]">{g.title}</h3>
                <p className="mt-1 text-[15px] text-[var(--navy)]/65">{g.lead}</p>
                <ul className="mt-6 flex flex-col gap-3">
                  {g.items.map((b) => (
                    <li key={b.title} className="rounded-2xl bg-white/70 p-4">
                      <div className="text-[15.5px] font-bold text-[var(--navy)]">{b.title}</div>
                      <p className="mt-1 text-[14px] leading-relaxed text-[var(--navy)]/70">{b.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Directions ──────────────────────────────────────── */}
      <section id="programmes" className="scroll-mt-16 pb-20 sm:pb-28">
        <div className="wrap !max-w-[1280px]">
          <SectionHead
            eyebrow="Choose a direction"
            title="Four directions. Each one taught properly."
            lead="We would rather teach a few things well than list everything. New directions open when we have instructors worth putting our name on."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {directions.map((d) => (
              <Link
                key={d.id}
                href={`/programmes?category=${d.id}`}
                className="group flex min-h-[300px] flex-col rounded-[28px] p-6 transition-transform hover:-translate-y-1"
                style={{ background: DIRECTION_BG[d.id] }}
              >
                <div className="flex -space-x-2">
                  {d.list.slice(0, 3).map((p) => (
                    <span key={p.id} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white ring-2 ring-white/60">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.logoUrl} alt="" className="h-6 w-6 object-contain" />
                    </span>
                  ))}
                </div>
                <h3 className="mt-6 text-[24px] font-extrabold leading-tight text-[var(--navy)]">{d.label}</h3>
                <p className="mt-1.5 text-[14.5px] text-[var(--navy)]/70">{d.blurb}</p>
                <ul className="mt-4 flex flex-col gap-1">
                  {d.list.slice(0, 3).map((p) => (
                    <li key={p.id} className="text-[13.5px] font-medium text-[var(--navy)]/80">
                      {p.shortTitle} · {p.duration}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between pt-6">
                  <span className="text-[13.5px] font-semibold text-[var(--navy)]">
                    {d.list.length} programme{d.list.length > 1 ? 's' : ''} · from {priceNumber(d.from)} XAF/mo
                  </span>
                  <ArrowUpRight size={18} className="text-[var(--navy)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-[28px] bg-[var(--paper-dim)] p-6 sm:flex-row sm:items-center sm:p-7">
            <div>
              <div className="text-[17px] font-bold text-[var(--navy)]">Complete beginner?</div>
              <p className="mt-0.5 text-[14.5px] text-[var(--ink-soft)]">
                Start with a 4–6 week Foundations programme from {priceNumber(foundationsFrom)} XAF, and see how you like
                learning with an instructor.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/programmes?category=foundations" className="btn btn-dark">
                See Foundations
              </Link>
              <AskAdvisorButton question="Which InTelleX programme fits me best?" className="btn bg-white text-[var(--navy)] hover:bg-white/80">
                Ask the advisor
              </AskAdvisorButton>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ladder ──────────────────────────────────── */}
      <section className="px-3 sm:px-5">
        <div className="mx-auto max-w-[1360px] rounded-[32px] bg-[var(--pastel-butter)] px-5 py-16 sm:px-12 lg:px-16 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              eyebrow="What you pay for"
              title="The price follows the support."
              lead="A 2,000 XAF library and a six-month mentored programme are different products. Here is the difference, plainly."
            />
            <Link href="/pricing" className="btn bg-white text-[var(--navy)] hover:bg-white/80">
              Full pricing <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {TIERS.map((t) => (
              <Link
                key={t.id}
                href={t.href}
                className={`group flex flex-col rounded-[28px] p-7 transition-transform hover:-translate-y-1 ${
                  t.featured ? 'bg-[var(--navy)] text-white' : 'bg-white'
                }`}
              >
                <div className={`text-[13px] font-semibold ${t.featured ? 'text-[var(--pastel-mint)]' : 'text-[var(--green-deep)]'}`}>{t.level}</div>
                <h3 className={`mt-1 text-[22px] font-bold ${t.featured ? 'text-white' : 'text-[var(--navy)]'}`}>{t.name}</h3>
                <div className={`mt-5 font-display text-[28px] font-extrabold leading-none ${t.featured ? 'text-white' : 'text-[var(--navy)]'}`}>
                  {t.price}
                </div>
                <div className={`mt-1.5 text-[13.5px] ${t.featured ? 'text-white/70' : 'text-[var(--ink-soft)]'}`}>
                  {t.priceNote} · {t.duration}
                </div>
                <ul className="mt-6 flex flex-col gap-2">
                  {t.includes.slice(0, 4).map((i) => (
                    <li key={i} className={`flex gap-2 text-[14.5px] ${t.featured ? 'text-white/90' : 'text-[var(--navy)]'}`}>
                      <Check size={16} strokeWidth={3} className="mt-0.5 shrink-0 text-[var(--green)]" />
                      {i}
                    </li>
                  ))}
                </ul>
                <span className={`mt-auto inline-flex items-center gap-1.5 pt-7 text-[14.5px] font-semibold ${t.featured ? 'text-[var(--pastel-mint)]' : 'text-[var(--green-deep)]'}`}>
                  {t.cta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instructors ─────────────────────────────────────── */}
      <section id="instructors" className="scroll-mt-16 py-20 sm:py-28">
        <div className="wrap !max-w-[1280px]">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <SectionHead
                eyebrow="Who teaches you"
                title="You don't pick a stranger. We choose for you."
                lead="InTelleX is not a tutor directory. Every instructor is reviewed, approved and managed by our team, and teaches to our standards. When you enrol, you enrol with InTelleX."
              />
              <Link href="/dashboard/mentor" className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--green-deep)]">
                Apply to teach with us <ArrowRight size={16} />
              </Link>
            </div>
            <ol className="flex flex-col gap-3">
              {VETTING.map((v, i) => (
                <li key={v.title} className="flex gap-4 rounded-3xl bg-[var(--paper-dim)] p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--green)] text-[15px] font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[17px] font-bold text-[var(--navy)]">{v.title}</h3>
                    <p className="mt-0.5 text-[14.5px] leading-relaxed text-[var(--ink-soft)]">{v.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {mentors.length > 0 && (
            <div className="mt-10 grid gap-4 rounded-[32px] bg-[var(--pastel-mint)] p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
              {mentors.map((m) => (
                <InstructorCard key={m.id} m={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Student voices ──────────────────────────────────── */}
      {quote && (
        <section className="pb-12">
          <div className="wrap !max-w-[1100px]">
            <figure className="grid items-center gap-8 rounded-[32px] bg-[var(--pastel-lilac)] p-8 sm:p-12 md:grid-cols-[200px_1fr]">
              {quote.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={quote.photo} alt={quote.name} className="aspect-square w-40 rounded-3xl object-cover md:w-full" />
              )}
              <div>
                <blockquote className="font-display text-[22px] font-semibold leading-[1.4] text-[var(--navy)] sm:text-[26px]">
                  “{quote.testimonial}”
                </blockquote>
                <figcaption className="mt-6">
                  <span className="block text-[16px] font-bold text-[var(--navy)]">{quote.name}</span>
                  <span className="block text-[14px] text-[var(--navy)]/65">InTelleX student · {quote.fieldOfInterest}</span>
                </figcaption>
              </div>
            </figure>
          </div>
        </section>
      )}

      <Testimonials />

      {/* ── Final CTA ───────────────────────────────────────── */}
      <section className="px-3 pb-6 pt-16 sm:px-5">
        <div className="relative mx-auto grid max-w-[1360px] items-center overflow-hidden rounded-[32px] bg-[var(--green)] lg:grid-cols-2">
          <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="relative px-7 py-14 text-white sm:px-14 sm:py-20">
            <h2 className="text-[40px] font-extrabold leading-[1.05] sm:text-[58px]">Talk to a person before you pay.</h2>
            <p className="mt-4 max-w-[460px] text-[17px] leading-relaxed text-white/85">
              Tell us your goal, your level and when you are free. We will recommend a programme, or tell you honestly
              if the library is enough for you.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={orientationWhatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white !px-6 text-[var(--green-deep)] hover:bg-white/90"
              >
                <MessageCircle size={17} /> Get advice on WhatsApp
              </a>
              <Link href="/programmes" className="btn !px-6 bg-[var(--green-deep)] text-white hover:bg-[#00804b]">
                Browse programmes <ArrowRight size={17} />
              </Link>
            </div>
          </div>
          <div className="relative hidden h-full min-h-[420px] bg-[#fdfbf3] lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero_career.webp" alt="" className="absolute inset-0 h-full w-full object-cover object-[70%_50%]" loading="lazy" />
          </div>
        </div>
      </section>

      <Footer />
      <AdvisorDock />
    </div>
  );
}
