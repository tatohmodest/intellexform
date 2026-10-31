import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  Library,
  MessageCircle,
  Play,
  Sparkles,
  Trophy,
  Wallet,
} from 'lucide-react';
import { getAllMentors } from '@/lib/learn/ecosystem';
import type { Mentor } from '@/lib/learn/mentors';
import { TESTIMONIALS } from '@/lib/data/testimonials';
import { orientationWhatsappLink } from '@/lib/contact';
import {
  DELIVERY,
  ENROL_STEPS,
  FLAGSHIP_PROGRAMMES,
  PROGRAMMES,
  dailyXaf,
  enrolHref,
  priceNumber,
  programmeHref,
} from '@/lib/programmes';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import Testimonials from '@/components/landing/Testimonials';
import AdvisorDock from '@/components/landing/AdvisorDock';
import AskAdvisorButton from '@/components/landing/AskAdvisorButton';
import HeroAsk from '@/components/landing/HeroAsk';

export const dynamic = 'force-dynamic';

const FLAGSHIP_ID = 'fullstack';
/** Programme order: one strong pick per discipline first, then the rest. */
const INDEX_IDS = ['data-analysis', 'cybersecurity', 'mern', 'flutter-mobile-design', 'cybersecurity-ceh', 'django'];
const PULL_QUOTE_ID = 'cm7n7nfvn000221m8b3bashfo';

/** Pastel surface + illustration for each way we teach. */
const DELIVERY_LOOK: Record<string, { bg: string; image: string }> = {
  live: { bg: 'var(--pastel-sky)', image: '/way_live.webp' },
  mentorship: { bg: 'var(--pastel-mint)', image: '/hero_mentor.webp' },
  materials: { bg: 'var(--pastel-butter)', image: '/way_selfpaced.webp' },
  projects: { bg: 'var(--pastel-lilac)', image: '/hero_illustration.webp' },
};

const VETTING = [
  { title: 'Experience review', body: 'CV and professional background checked against the subjects they will teach.' },
  { title: 'Identity verified', body: 'Every instructor is a verified, named person. No anonymous accounts.' },
  { title: 'Teaching sample', body: 'A recorded introduction shows us how they explain before they meet a student.' },
];

const RESOURCES = [
  { href: '/courses', icon: Library, title: 'Self-paced library', bg: 'var(--pastel-sky)' },
  { href: '/tutorials', icon: BookOpen, title: 'Free tutorials', bg: 'var(--pastel-mint)' },
  { href: '/books', icon: BookOpen, title: 'Books', bg: 'var(--pastel-butter)' },
  { href: '/junior-dev', icon: Trophy, title: 'Junior Dev', bg: 'var(--pastel-lilac)' },
  { href: '/internships', icon: Briefcase, title: 'Internships', bg: 'var(--pastel-mint)' },
  { href: '/enterprise', icon: Building2, title: 'For institutions', bg: 'var(--pastel-sky)' },
];

function SectionHead({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className="max-w-[640px]">
      <div className="text-[13px] font-semibold text-[var(--green-deep)]">{eyebrow}</div>
      <h2 className="mt-2 text-[32px] font-bold leading-[1.1] text-[var(--navy)] sm:text-[44px]">{title}</h2>
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

  const flagship = FLAGSHIP_PROGRAMMES.find((p) => p.id === FLAGSHIP_ID)!;
  const morePrograms = INDEX_IDS.map((id) => FLAGSHIP_PROGRAMMES.find((p) => p.id === id)).filter(
    (p): p is (typeof FLAGSHIP_PROGRAMMES)[number] => Boolean(p),
  );
  const lowestPrice = Math.min(...PROGRAMMES.map((p) => p.priceXAF));
  const quote = TESTIMONIALS.find((t) => t.id === PULL_QUOTE_ID);
  const faces = TESTIMONIALS.filter((t) => t.photo).slice(0, 4);

  return (
    <div className="site">
      <TopNav />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="relative mx-auto grid max-w-[1360px] overflow-hidden rounded-[32px] lg:min-h-[640px] lg:grid-cols-[1.05fr_1fr]">
          <div className="relative flex flex-col justify-center bg-[var(--pastel-sky)] px-6 pb-12 pt-12 sm:px-12 sm:pt-16 lg:py-16 lg:pl-16 lg:pr-14">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-[var(--navy)]">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--green)] text-white">
                <Check size={12} strokeWidth={3} />
              </span>
              Live classes · Mentorship · Certificate
            </span>
            <h1 className="mt-6 text-[42px] font-extrabold leading-[1.04] text-[var(--navy)] sm:text-[60px] xl:text-[66px]">
              Learn skills that move you forward.
            </h1>
            <p className="mt-5 max-w-[500px] text-[17px] leading-relaxed text-[var(--navy)]/75 sm:text-[18px]">
              Join a programme, learn live with an instructor who knows your name, build real projects and
              finish with a skill you can earn with.
            </p>
            <div className="mt-8 max-w-[520px]">
              <HeroAsk />
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/programmes" className="btn btn-dark !px-6">
                Explore programmes <ArrowRight size={16} />
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {faces.map((t) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={t.id} src={t.photo} alt={t.name} className="h-9 w-9 rounded-full object-cover ring-[3px] ring-[var(--pastel-sky)]" />
                  ))}
                </div>
                <span className="text-[13.5px] font-medium text-[var(--navy)]/70">Learners across Cameroon</span>
              </div>
            </div>
          </div>

          <div className="relative order-first min-h-[340px] bg-white sm:min-h-[460px] lg:order-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero_programmer.png"
              alt="A happy learner sitting with a laptop as ideas, code and conversations branch out above"
              className="absolute inset-0 h-full w-full object-contain object-bottom px-3 pt-10 sm:px-6 lg:pt-16"
            />
            {/* Floating facts, straddling the seam on desktop */}
            <div className="gentle-float absolute left-4 top-4 flex items-center gap-3 rounded-2xl bg-white p-3 pr-5 shadow-[0_16px_40px_-20px_rgba(18,50,79,0.45)] lg:left-[-56px] lg:top-[12%]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--pastel-mint)] text-[var(--green-deep)]">
                <Play size={18} fill="currentColor" />
              </span>
              <span>
                <span className="block text-[15px] font-bold text-[var(--navy)]">Live online classes</span>
                <span className="block text-[12.5px] text-[var(--ink-soft)]">With your instructor and cohort</span>
              </span>
            </div>
            <Link
              href={programmeHref(flagship)}
              className="gentle-float absolute right-4 top-24 hidden items-center gap-3 rounded-2xl bg-white p-3 pr-4 shadow-[0_16px_40px_-20px_rgba(18,50,79,0.45)] ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 sm:flex lg:right-6 lg:top-[30%]"
              style={{ animationDelay: '1.5s' }}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--pastel-butter)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={flagship.logoUrl} alt="" className="h-6 w-6" />
              </span>
              <span>
                <span className="block text-[12px] font-semibold text-[var(--green-deep)]">Enrolling now</span>
                <span className="block text-[15px] font-bold text-[var(--navy)]">{flagship.shortTitle}</span>
                <span className="block text-[12.5px] text-[var(--ink-soft)]">
                  {flagship.duration} · from {priceNumber(flagship.monthlyXAF || flagship.priceXAF)} XAF{flagship.monthlyXAF ? '/mo' : ''}
                </span>
              </span>
              <ArrowUpRight size={16} className="ml-1 text-[var(--navy)]" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── For you: bento ───────────────────────────────────── */}
      <section className="px-3 pt-4 sm:px-5">
        <div className="mx-auto grid max-w-[1360px] gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Flagship - solid green */}
          <Link
            href={programmeHref(flagship)}
            className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-[28px] bg-[var(--green)] p-7 text-white md:col-span-2"
          >
            <div className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -right-24 top-8 h-48 w-48 rounded-full bg-white/[0.07]" />
            <div className="relative text-[13px] font-semibold text-white/80">Flagship programme</div>
            <h3 className="relative mt-2 max-w-[420px] text-[30px] font-extrabold leading-[1.1] sm:text-[36px]">{flagship.title}</h3>
            <p className="relative mt-3 max-w-[440px] text-[15px] leading-relaxed text-white/85">{flagship.description}</p>
            <div className="relative mt-auto flex items-end justify-between gap-4 pt-6">
              <div className="text-[14px] text-white/90">
                {flagship.duration} · from {priceNumber(flagship.monthlyXAF || flagship.priceXAF)} XAF
                {flagship.monthlyXAF ? '/month' : ''}
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--green-deep)] transition-transform group-hover:scale-110">
                <Play size={18} className="ml-0.5" fill="currentColor" />
              </span>
            </div>
          </Link>

          {/* Join a live class */}
          <Link href="#experience" className="group flex min-h-[260px] flex-col rounded-[28px] bg-[var(--pastel-butter)] p-7">
            <h3 className="text-[24px] font-bold leading-tight text-[var(--navy)]">Join a live class</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--navy)]/70">
              Learn with a real instructor and a group of motivated learners.
            </p>
            <div className="mt-auto flex items-center pt-6">
              <div className="flex -space-x-3">
                {faces.map((t) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={t.id} src={t.photo} alt="" className="h-11 w-11 rounded-full object-cover ring-4 ring-[var(--pastel-butter)]" />
                ))}
              </div>
              <ArrowRight size={18} className="ml-auto text-[var(--navy)] transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Ask AI */}
          <div className="flex min-h-[260px] flex-col overflow-hidden rounded-[28px] bg-[var(--pastel-lilac)]">
            <div className="p-7 pb-0">
              <h3 className="text-[24px] font-bold leading-tight text-[var(--navy)]">Not sure where to start?</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--navy)]/70">
                Our AI advisor helps you pick the right skill for your goals.
              </p>
              <AskAdvisorButton className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[14px] font-semibold text-[var(--navy)] transition-colors hover:bg-[var(--navy)] hover:text-white">
                <Sparkles size={16} /> Chat with AI
              </AskAdvisorButton>
            </div>
            <div className="mt-auto flex flex-col gap-2 p-7 pt-5">
              {['Which skill pays well?', 'Is data analysis for me?'].map((q) => (
                <AskAdvisorButton
                  key={q}
                  question={q}
                  className="self-start rounded-2xl rounded-bl-md bg-white/70 px-3.5 py-2 text-left text-[13px] font-medium text-[var(--navy)] transition-colors hover:bg-white"
                >
                  {q}
                </AskAdvisorButton>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Programmes ──────────────────────────────────────── */}
      <section id="programmes" className="scroll-mt-16 py-20 sm:py-28">
        <div className="wrap !max-w-[1280px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              eyebrow="Programmes"
              title="Find the programme that fits your goals."
              lead="Every programme has a clear syllabus, a fixed duration, an instructor and an investment you can see before you commit."
            />
            <Link href="/programmes" className="btn btn-soft">
              All {PROGRAMMES.length} programmes <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-12">
            <div className="flex flex-col rounded-[28px] bg-[var(--pastel-mint)] p-8 sm:p-10 lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={flagship.logoUrl} alt="" className="h-7 w-7" />
                </span>
                <span className="text-[13px] font-semibold text-[var(--green-deep)]">
                  Flagship · {flagship.categoryLabel}
                </span>
              </div>
              <h3 className="mt-6 text-[32px] font-extrabold leading-[1.1] text-[var(--navy)] sm:text-[44px]">{flagship.title}</h3>
              <p className="mt-4 max-w-[540px] text-[16px] leading-relaxed text-[var(--navy)]/75">{flagship.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {flagship.technologies.map((t) => (
                  <span key={t} className="rounded-full bg-white px-3 py-1 text-[12.5px] font-medium text-[var(--navy)]">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex flex-wrap items-end justify-between gap-6 pt-10">
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--navy)]/60">Your investment</div>
                  <div className="mt-1 font-display text-[40px] font-extrabold leading-none text-[var(--navy)]">
                    {priceNumber(flagship.priceXAF)} <span className="text-[15px] font-semibold">XAF</span>
                  </div>
                  {flagship.monthlyXAF && (
                    <div className="mt-2 text-[14px] text-[var(--navy)]/70">
                      or {priceNumber(flagship.monthlyXAF)} XAF/month, about {priceNumber(dailyXaf(flagship.monthlyXAF))} a day
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={programmeHref(flagship)} className="btn bg-white text-[var(--navy)] hover:bg-white/80">
                    See syllabus
                  </Link>
                  <Link href={enrolHref(flagship)} className="btn btn-primary">
                    Enrol <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] bg-[var(--paper-dim)] p-8 sm:p-10 lg:col-span-5">
              <div className="text-[13px] font-semibold text-[var(--green-deep)]">What you will leave with</div>
              <ul className="mt-6 flex flex-col gap-4">
                {flagship.highlights.map((h) => (
                  <li key={h} className="flex gap-3.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--green)] text-white">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <span className="text-[16px] leading-snug text-[var(--navy)]">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {morePrograms.map((p) => (
              <Link
                key={p.id}
                href={programmeHref(p)}
                className="group flex items-center gap-4 rounded-3xl bg-[var(--paper-dim)] p-5 transition-colors hover:bg-[var(--pastel-sky)]"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.logoUrl} alt="" className="h-8 w-8 object-contain" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-medium text-[var(--ink-soft)]">
                    {p.categoryLabel} · {p.duration}
                  </span>
                  <span className="mt-0.5 block font-display text-[17px] font-bold leading-snug text-[var(--navy)]">{p.title}</span>
                  <span className="mt-1 block text-[13.5px] font-semibold text-[var(--green-deep)]">
                    {priceNumber(p.priceXAF)} XAF
                    {p.monthlyXAF ? <span className="font-normal text-[var(--ink-soft)]"> · or {priceNumber(p.monthlyXAF)}/mo</span> : null}
                  </span>
                </span>
                <ArrowUpRight size={18} className="shrink-0 text-[var(--navy)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
          <p className="mt-6 text-center text-[15px] text-[var(--ink-soft)]">
            Plus short Foundations programmes for complete beginners, from {priceNumber(lowestPrice)} XAF.{' '}
            <AskAdvisorButton
              question="Which InTelleX programme fits me best?"
              className="font-semibold text-[var(--green-deep)] underline-offset-4 hover:underline"
            >
              Not sure which one? Ask the AI advisor.
            </AskAdvisorButton>
          </p>
        </div>
      </section>

      {/* ── Experience ──────────────────────────────────────── */}
      <section id="experience" className="scroll-mt-16 pb-20 sm:pb-28">
        <div className="wrap !max-w-[1280px]">
          <SectionHead
            eyebrow="The InTelleX experience"
            title="More than watching videos."
            lead="You learn the way people actually get good at things: a teacher, a group, honest feedback and real work to show for it."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DELIVERY.map((d) => {
              const look = DELIVERY_LOOK[d.id];
              return (
                <div key={d.id} className="flex flex-col overflow-hidden rounded-[28px]" style={{ background: look.bg }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={look.image} alt="" className="illo aspect-[4/3] w-full object-cover" loading="lazy" />
                  <div className="p-6 pt-4">
                    <h3 className="text-[20px] font-bold text-[var(--navy)]">{d.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--navy)]/70">{d.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Instructors ─────────────────────────────────────── */}
      <section id="instructors" className="scroll-mt-16 px-3 sm:px-5">
        <div className="mx-auto max-w-[1360px] overflow-hidden rounded-[32px] bg-[var(--pastel-mint)]">
          <div className="grid items-center gap-8 px-6 py-14 sm:px-12 lg:grid-cols-2 lg:py-20 lg:pl-16">
            <div>
              <SectionHead
                eyebrow="Our instructors"
                title="Taught by people who know their craft."
                lead="Our instructors teach under the InTelleX name and to our standards. Nobody teaches here until our team has reviewed and approved them."
              />
              <ol className="mt-8 flex flex-col gap-3">
                {VETTING.map((v, i) => (
                  <li key={v.title} className="flex gap-4 rounded-2xl bg-white/70 p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--green)] text-[15px] font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-[16px] font-bold text-[var(--navy)]">{v.title}</h3>
                      <p className="mt-0.5 text-[14px] leading-relaxed text-[var(--navy)]/70">{v.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link href="/dashboard/mentor" className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--green-deep)]">
                Apply to teach with us <ArrowRight size={16} />
              </Link>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero_mentor.webp" alt="An instructor guiding a student through a lesson" className="illo w-full" loading="lazy" />
          </div>
          {mentors.length > 0 && (
            <div className="grid gap-4 px-6 pb-14 sm:grid-cols-2 sm:px-12 lg:grid-cols-4 lg:px-16">
              {mentors.map((m) => (
                <InstructorCard key={m.id} m={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Student voices ──────────────────────────────────── */}
      {quote && (
        <section className="py-20 sm:py-28">
          <div className="wrap !max-w-[1100px]">
            <figure className="grid items-center gap-8 rounded-[32px] bg-[var(--pastel-butter)] p-8 sm:p-12 md:grid-cols-[200px_1fr]">
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

      {/* ── How it works ────────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-16 py-20 sm:py-28">
        <div className="wrap !max-w-[1280px]">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <SectionHead
                eyebrow="How it works"
                title="From first message to finished project."
                lead="You always know what you are investing in and what happens next. Pay in full or spread it monthly with MTN MoMo, Orange Money or card."
              />
              <ol className="mt-8 flex flex-col gap-3">
                {ENROL_STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-4 rounded-2xl bg-[var(--paper-dim)] p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--pastel-sky)] text-[15px] font-bold text-[var(--navy)]">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-[16px] font-bold text-[var(--navy)]">{s.title}</h3>
                      <p className="mt-0.5 text-[14px] leading-relaxed text-[var(--ink-soft)]">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="overflow-hidden rounded-[32px] bg-[var(--pastel-sky)] p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/join_cta.webp" alt="A path of completed steps leading to a certificate" className="illo w-full" loading="lazy" />
              <div className="flex items-center gap-3 px-4 pb-3 pt-2">
                <Wallet size={18} className="text-[var(--navy)]" />
                <span className="text-[14px] font-medium text-[var(--navy)]">MTN MoMo · Orange Money · Card</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/mtn.png" alt="" className="ml-auto h-8 w-8 rounded-lg object-contain" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/orange.png" alt="" className="h-8 w-8 rounded-lg object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Beyond your programme ───────────────────────────── */}
      <section id="resources" className="scroll-mt-16 pb-20 sm:pb-28">
        <div className="wrap !max-w-[1280px]">
          <SectionHead
            eyebrow="Also at InTelleX"
            title="Resources for every learner."
            lead="Alongside your programme or on their own. Library membership from 1,999 XAF/month."
          />
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {RESOURCES.map((r) => (
              <Link
                key={r.title}
                href={r.href}
                className="group flex flex-col justify-between gap-8 rounded-3xl p-5 transition-transform hover:-translate-y-1"
                style={{ background: r.bg }}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[var(--navy)]">
                  <r.icon size={18} />
                </span>
                <span className="flex items-center justify-between gap-2 text-[15px] font-bold text-[var(--navy)]">
                  {r.title}
                  <ArrowUpRight size={16} className="opacity-50 transition-opacity group-hover:opacity-100" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────── */}
      <section className="px-3 pb-6 sm:px-5">
        <div className="relative mx-auto grid max-w-[1360px] items-center overflow-hidden rounded-[32px] bg-[var(--green)] lg:grid-cols-2">
          <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="relative px-7 py-14 text-white sm:px-14 sm:py-20">
            <h2 className="text-[40px] font-extrabold leading-[1.05] sm:text-[60px]">Your next skill starts here.</h2>
            <p className="mt-4 max-w-[440px] text-[17px] leading-relaxed text-white/85">
              Pick a programme, or tell us your goal and we will help you choose the right one.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/programmes" className="btn bg-white !px-6 text-[var(--green-deep)] hover:bg-white/90">
                Explore programmes <ArrowRight size={17} />
              </Link>
              <a
                href={orientationWhatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn !px-6 bg-[var(--green-deep)] text-white hover:bg-[#00804b]"
              >
                <MessageCircle size={17} /> WhatsApp us
              </a>
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
