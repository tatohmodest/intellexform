import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Globe,
  MessageCircle,
  Minus,
  Play,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { getAllMentors } from '@/lib/learn/ecosystem';
import type { Mentor } from '@/lib/learn/mentors';
import { TESTIMONIALS } from '@/lib/data/testimonials';
import { orientationWhatsappLink } from '@/lib/contact';
import { PROGRAMME_CATEGORIES, PROGRAMMES, priceNumber } from '@/lib/programmes';
import { COMPARE_COLUMNS, COMPARE_ROWS, TIERS } from '@/lib/positioning';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import Testimonials from '@/components/landing/Testimonials';
import AdvisorDock from '@/components/landing/AdvisorDock';
import AskAdvisorButton from '@/components/landing/AskAdvisorButton';
import ProgrammeJourney from '@/components/landing/ProgrammeJourney';
import PromoVideo from '@/components/landing/PromoVideo';
import { LaptopReview, ReviewNode } from '@/components/landing/LineArt';

export const dynamic = 'force-dynamic';

const PULL_QUOTE_ID = 'cm7n7nfvn000221m8b3bashfo';
const DEVICON = (name: string, file = `${name}-original`) => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${name}/${file}.svg`;

/** Tools taught across the programmes (from their syllabi). */
const TOOLS = [
  { name: 'JavaScript', src: DEVICON('javascript') },
  { name: 'React', src: DEVICON('react') },
  { name: 'Node.js', src: DEVICON('nodejs') },
  { name: 'Python', src: DEVICON('python') },
  { name: 'PostgreSQL', src: DEVICON('postgresql') },
  { name: 'MongoDB', src: DEVICON('mongodb') },
  { name: 'Flutter', src: DEVICON('flutter') },
  { name: 'Django', src: DEVICON('django', 'django-plain') },
  { name: 'Linux', src: DEVICON('linux') },
];

/** Doodle tiles for the frosted band; each row is repeated so the marquee loops seamlessly. */
const TILES_TOP = ['readingside', 'plant', 'coffee', 'sittingreading', 'selfie', 'meditating', 'unboxing'];
const TILES_BOTTOM = ['laying', 'sprinting', 'reading', 'groovy', 'levitate', 'sleek', 'jumping'];

const PROJECT_TILES = [
  { icon: Globe, label: 'Web app' },
  { icon: BarChart3, label: 'Dashboard' },
  { icon: Smartphone, label: 'Mobile app' },
  { icon: ShieldCheck, label: 'Security audit' },
];

const DIRECTION_DOODLE: Record<string, string> = {
  software: '/doodles/sleek.svg',
  data: '/doodles/readingside.svg',
  security: '/doodles/meditating.svg',
  marketing: '/doodles/selfie.svg',
};

const VETTING = [
  { title: 'Experience review', body: 'CV and professional background checked against the subjects they will teach.' },
  { title: 'Identity verified', body: 'Every instructor is a verified, named person. No anonymous accounts.' },
  { title: 'Teaching sample', body: 'A recorded introduction shows us how they explain before they meet a student.' },
];

function Doodle({ name, className = '' }: { name: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/doodles/${name}.svg`} alt="" className={`doodle ${className}`} loading="lazy" />;
}

function SectionHead({ eyebrow, title, lead, center }: { eyebrow: string; title: string; lead?: string; center?: boolean }) {
  return (
    <div className={`max-w-[640px] ${center ? 'mx-auto text-center' : ''}`}>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="mt-3 text-[34px] leading-[1.08] sm:text-[48px]">{title}</h2>
      {lead && <p className="mt-4 text-[16px] leading-relaxed text-[#4b5563]">{lead}</p>}
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
    <div className="line-card p-5">
      {m.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={m.avatarUrl} alt={m.name} className="h-16 w-16 rounded-2xl object-cover" />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f3fbf7] text-[20px] font-semibold text-[var(--green-deep)]">
          {m.initials || initials(m.name)}
        </div>
      )}
      <h3 className="mt-4 text-[17px]">{m.name}</h3>
      {m.title && <p className="mt-0.5 text-[13.5px] text-[var(--green-deep)]">{m.title}</p>}
      {m.expertise?.length > 0 && <p className="mt-2 text-[13px] text-[#4b5563]">{m.expertise.slice(0, 3).join(' · ')}</p>}
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
    <div className="site airy">
      <TopNav />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="wrap !max-w-[1200px] pb-10 pt-10 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <div className="eyebrow">A teaching school for tech and digital careers</div>
            <h1 className="mt-5 text-[44px] leading-[1.02] sm:text-[64px]">
              Tutorials show you how. <span className="text-[var(--green-deep)]">We make sure you can.</span>
            </h1>
            <p className="mt-6 max-w-[460px] text-[16px] leading-relaxed text-[#4b5563]">
              Join a programme, learn live with an InTelleX instructor, build projects that someone actually reviews, and
              finish able to do the work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/programmes" className="btn btn-green !px-6">
                Find your programme <ArrowRight size={16} />
              </Link>
              <Link href="/why-intellex" className="btn btn-line !px-6">
                Why learn with us
              </Link>
              <a href="#watch" className="inline-flex items-center gap-2 px-2 text-[14.5px] font-medium text-[var(--ink)] hover:text-[var(--green-deep)]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e7e9ec] bg-white">
                  <Play size={13} className="ml-0.5" fill="currentColor" />
                </span>
                Watch the video
              </a>
            </div>

            <div className="mt-10 flex max-w-[440px] divide-x divide-[#e7e9ec] border-b border-[#e7e9ec] pb-5">
              <div className="pr-6">
                <div className="text-[34px] font-medium tracking-[-0.03em]">{PROGRAMMES.length}</div>
                <div className="text-[13px] text-[#4b5563]">Programmes to choose from</div>
              </div>
              <div className="pl-6">
                <div className="text-[34px] font-medium tracking-[-0.03em]">3–6</div>
                <div className="text-[13px] text-[#4b5563]">Months, with an instructor</div>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex -space-x-2">
                {faces.map((t) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={t.id} src={t.photo} alt={t.name} className="h-8 w-8 rounded-full object-cover ring-2 ring-white" />
                ))}
              </div>
              <span className="text-[13px] text-[#4b5563]">Learners in Cameroon, Ireland and beyond</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[580px]">
            <LaptopReview className="w-full" />
            <Doodle name="laying" className="absolute left-[30%] top-[-6%] w-[44%]" />
          </div>
        </div>
      </section>

      {/* ── Tools strip ─────────────────────────────────────── */}
      <section className="wrap !max-w-[1200px] py-10">
        <p className="text-center text-[14px] text-[#4b5563]">Tools you will use in class</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {TOOLS.map((t) => (
            <span key={t.name} className="flex items-center gap-2 text-[15px] font-medium text-[var(--ink)] opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.src} alt="" className="h-6 w-6" loading="lazy" />
              {t.name}
            </span>
          ))}
        </div>
      </section>

      {/* ── The story in 40 seconds ─────────────────────────── */}
      <section id="watch" className="wrap !max-w-[1200px] scroll-mt-20 pb-6 pt-16 sm:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.6fr]">
          <div>
            <div className="eyebrow">Watch</div>
            <h2 className="mt-3 text-[34px] leading-[1.08] sm:text-[48px]">Stop learning the hard way.</h2>
            <p className="mt-4 max-w-[380px] text-[16px] leading-relaxed text-[#4b5563]">
              Endless tutorials, no one to ask, no real progress. Here is what changes when you learn with InTelleX.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/programmes" className="btn btn-green !px-6">
                Find your programme <ArrowRight size={16} />
              </Link>
              <a href={orientationWhatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-line !px-6">
                <MessageCircle size={16} /> Talk to us
              </a>
            </div>
          </div>
          <PromoVideo />
        </div>
      </section>

      {/* ── Frosted band: the honest question ───────────────── */}
      <section className="relative mt-10 overflow-hidden py-6">
        <div className="flex flex-col gap-5">
          {[TILES_TOP, TILES_BOTTOM].map((row, r) => (
            <div key={r} className={`marquee gap-5 ${r ? 'marquee-rev' : ''}`}>
              {[...row, ...row].map((d, i) => (
                <div
                  key={`${d}-${i}`}
                  className={`line-card flex h-[230px] w-[240px] shrink-0 justify-center overflow-hidden !border-[rgba(0,179,105,0.35)] px-4 ${
                    r ? 'items-end pb-0' : 'items-start pt-3'
                  }`}
                >
                  <Doodle name={d} className="h-[150px] w-full object-contain" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="frost absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center px-5 py-10 text-center sm:py-12">
          <h2 className="max-w-[640px] text-[36px] leading-[1.05] sm:text-[52px]">Why pay us when YouTube is free?</h2>
          <p className="mt-4 max-w-[520px] text-[15.5px] leading-relaxed text-[#4b5563]">
            The information is free. What isn&apos;t free is a person who decides what you learn next, checks what you build and
            notices when you stop.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="#difference" className="btn btn-line">
              See the difference
            </a>
            <Link href="/programmes" className="btn btn-green">
              Find your programme
            </Link>
          </div>
        </div>
      </section>

      {/* ── The difference ──────────────────────────────────── */}
      <section id="difference" className="wrap !max-w-[1200px] scroll-mt-20 py-24 sm:py-32">
        <SectionHead
          eyebrow="Three ways to learn the same skill"
          title="Same topic. Very different outcome."
          lead="Free tutorials are a great place to start, and a hard place to finish. Here is what changes when you learn with InTelleX."
        />
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {COMPARE_COLUMNS.map((col, c) => {
            const ours = c === 2;
            return (
              <div key={col} className={`${ours ? 'line-card-green' : 'line-card'} p-6 sm:p-8`}>
                <h3 className="text-[22px]">{col}</h3>
                <dl className="mt-5">
                  {COMPARE_ROWS.map((r) => (
                    <div key={r.label} className="border-t border-[#e7e9ec] py-4">
                      <dt className="text-[12.5px] text-[#4b5563]">{r.label}</dt>
                      <dd className="mt-1 flex items-start gap-2 text-[15px] font-medium">
                        {ours ? (
                          <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[var(--green-deep)]" />
                        ) : (
                          <Minus size={16} className="mt-0.5 shrink-0 text-[#9ca3af]" />
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
      </section>

      {/* ── How a programme works: feature bento ────────────── */}
      <section className="wrap !max-w-[1200px] pb-24 sm:pb-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            eyebrow="Inside a programme"
            title="Everything a video can't do."
            lead="Four things happen in every InTelleX programme. You can check each one in your first weeks."
          />
          <div className="flex gap-3">
            <Link href="/why-intellex" className="btn btn-line">
              The full case
            </Link>
            <Link href="/programmes" className="btn btn-green">
              Browse
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-5">
          <div className="line-card flex flex-col overflow-hidden p-6 sm:p-7 md:col-span-3">
            <h3 className="text-[18px]">Live classes, at set times</h3>
            <p className="mt-1 max-w-[380px] text-[14px] text-[#4b5563]">With your instructor and a cohort at your stage. Ask as you go.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Tue · 19:00 Live class', 'Thu · 19:00 Live class', 'Sat · 10:00 Q&A'].map((s) => (
                <span key={s} className="rounded-xl border border-[#e7e9ec] bg-[#f6f7f8] px-3 py-2 text-[13px]">
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-[var(--green)]" />
                  {s}
                </span>
              ))}
            </div>
            <Doodle name="sittingreading" className="mx-auto mt-auto w-[74%] max-w-[380px] translate-y-6 pt-4" />
          </div>

          <div className="line-card flex flex-col p-6 sm:p-7 md:col-span-2">
            <h3 className="text-[18px]">Every project gets reviewed</h3>
            <p className="mt-1 text-[14px] text-[#4b5563]">Your instructor tells you exactly what to fix, like a senior colleague would.</p>
            <ReviewNode className="mt-auto w-full pt-6" />
          </div>

          <div className="line-card flex flex-col overflow-hidden p-6 sm:p-7 md:col-span-2">
            <h3 className="text-[18px]">An AI tutor for 11pm questions</h3>
            <p className="mt-1 text-[14px] text-[#4b5563]">Small blockers don&apos;t wait a week. The big ones go to your instructor.</p>
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-[#e7e9ec] bg-[#f6f7f8] px-3.5 py-3 text-[13.5px]">
              <Sparkles size={16} className="shrink-0 text-[var(--green)]" />
              <span className="truncate">Why does my fetch return undefined?</span>
              <span className="h-4 w-px animate-pulse bg-[var(--ink)]" />
            </div>
            <Doodle name="coffee" className="mx-auto mt-auto w-[80%] translate-y-4 pt-4" />
          </div>

          <div className="line-card flex flex-col p-6 sm:p-7 md:col-span-3">
            <h3 className="text-[18px]">Real projects in your portfolio</h3>
            <p className="mt-1 max-w-[400px] text-[14px] text-[#4b5563]">Things you can open, demo and explain to an employer or a client. Not quizzes.</p>
            <div className="mt-5 flex items-center gap-2.5 rounded-xl border border-[#e7e9ec] bg-[#f6f7f8] px-3.5 py-3 text-[13.5px]">
              <Sparkles size={16} className="shrink-0 text-[var(--green)]" />
              Capstone: booking app for a local salon, deployed
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PROJECT_TILES.map((t) => (
                <div key={t.label} className="dash-tile flex aspect-square flex-col items-center justify-center gap-2 p-3">
                  <t.icon size={34} strokeWidth={1.25} />
                  <span className="text-[12.5px] text-[#4b5563]">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Week by week ────────────────────────────────────── */}
      <section id="experience" className="scroll-mt-20 border-y border-[#e7e9ec] bg-[#fafbfa] py-24 sm:py-32">
        <div className="wrap !max-w-[1200px]">
          <SectionHead
            eyebrow="What actually happens"
            title="Six months, week by week."
            lead="A career programme from the inside, from the first conversation to the certificate."
          />
          <div className="mt-12">
            <ProgrammeJourney />
          </div>
        </div>
      </section>

      {/* ── Directions ──────────────────────────────────────── */}
      <section id="programmes" className="wrap !max-w-[1200px] scroll-mt-20 py-24 sm:py-32">
        <SectionHead
          eyebrow="Choose a direction"
          title="Four directions. Each one taught properly."
          lead="We would rather teach a few things well than list everything. New directions open when we have instructors worth putting our name on."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {directions.map((d) => (
            <Link key={d.id} href={`/programmes?category=${d.id}`} className="line-card group flex flex-col p-6 transition-colors hover:border-[rgba(0,179,105,0.45)]">
              <div className="flex h-40 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={DIRECTION_DOODLE[d.id]} alt="" className="doodle max-h-full w-auto" loading="lazy" />
              </div>
              <h3 className="mt-4 text-[22px]">{d.label}</h3>
              <p className="mt-1 text-[14px] text-[#4b5563]">{d.blurb}</p>
              <ul className="mt-4 flex flex-col gap-1 border-t border-[#e7e9ec] pt-4">
                {d.list.slice(0, 3).map((p) => (
                  <li key={p.id} className="text-[13.5px]">
                    {p.shortTitle} <span className="text-[#9ca3af]">· {p.duration}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center justify-between pt-6 text-[13.5px] font-medium">
                <span>
                  {d.list.length} programme{d.list.length > 1 ? 's' : ''} · from {priceNumber(d.from)} XAF/mo
                </span>
                <ArrowUpRight size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
        <div className="line-card mt-4 flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <Doodle name="plant" className="hidden h-16 w-auto sm:block" />
            <div>
              <div className="text-[17px] font-medium">Complete beginner?</div>
              <p className="mt-0.5 text-[14px] text-[#4b5563]">
                Start with a 4–6 week Foundations programme from {priceNumber(foundationsFrom)} XAF.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <AskAdvisorButton question="Which InTelleX programme fits me best?" className="btn btn-line">
              Ask the advisor
            </AskAdvisorButton>
            <Link href="/programmes?category=foundations" className="btn btn-green">
              See Foundations
            </Link>
          </div>
        </div>
      </section>

      {/* ── Pricing ladder ──────────────────────────────────── */}
      <section className="border-y border-[#e7e9ec] bg-[#fafbfa] py-24 sm:py-32">
        <div className="wrap !max-w-[1200px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead
              eyebrow="What you pay for"
              title="The price follows the support."
              lead="A 2,000 XAF library and a six-month mentored programme are different products. Here is the difference, plainly."
            />
            <Link href="/pricing" className="btn btn-line">
              Full pricing <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {TIERS.map((t) => (
              <Link key={t.id} href={t.href} className={`${t.featured ? 'line-card-green' : 'line-card'} group flex flex-col p-7`}>
                <div className="text-[13px] text-[var(--green-deep)]">{t.level}</div>
                <h3 className="mt-1 text-[22px]">{t.name}</h3>
                <div className="mt-6 text-[28px] font-medium leading-none tracking-[-0.03em]">{t.price}</div>
                <div className="mt-1.5 text-[13px] text-[#4b5563]">
                  {t.priceNote} · {t.duration}
                </div>
                <ul className="mt-6 flex flex-col gap-2.5 border-t border-[#e7e9ec] pt-5">
                  {t.includes.slice(0, 4).map((i) => (
                    <li key={i} className="flex gap-2 text-[14px]">
                      <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[var(--green-deep)]" />
                      {i}
                    </li>
                  ))}
                </ul>
                <span className={`btn mt-auto !mt-8 w-full ${t.featured ? 'btn-green' : 'btn-line'}`}>
                  {t.cta} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instructors ─────────────────────────────────────── */}
      <section id="instructors" className="wrap !max-w-[1200px] scroll-mt-20 py-24 sm:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHead
              eyebrow="Who teaches you"
              title="You don't pick a stranger. We choose for you."
              lead="InTelleX is not a tutor directory. Every instructor is reviewed, approved and managed by our team. When you enrol, you enrol with InTelleX."
            />
            <ol className="mt-8 flex flex-col">
              {VETTING.map((v, i) => (
                <li key={v.title} className="flex gap-4 border-t border-[#e7e9ec] py-5">
                  <span className="text-[14px] font-medium text-[var(--green-deep)]">0{i + 1}</span>
                  <div>
                    <h3 className="text-[17px]">{v.title}</h3>
                    <p className="mt-0.5 text-[14px] leading-relaxed text-[#4b5563]">{v.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/dashboard/mentor" className="mt-4 inline-flex items-center gap-2 text-[15px] font-medium text-[var(--green-deep)]">
              Apply to teach with us <ArrowRight size={16} />
            </Link>
          </div>
          <div className="line-card flex items-center justify-center p-10">
            <Doodle name="loving" className="w-full max-w-[420px]" />
          </div>
        </div>
        {mentors.length > 0 && (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mentors.map((m) => (
              <InstructorCard key={m.id} m={m} />
            ))}
          </div>
        )}
      </section>

      {/* ── Student voices ──────────────────────────────────── */}
      {quote && (
        <section className="wrap !max-w-[1000px] pb-8">
          <figure className="line-card grid items-center gap-8 p-8 sm:p-12 md:grid-cols-[180px_1fr]">
            {quote.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={quote.photo} alt={quote.name} className="aspect-square w-36 rounded-2xl object-cover md:w-full" />
            )}
            <div>
              <blockquote className="text-[21px] font-medium leading-[1.45] tracking-[-0.02em] sm:text-[24px]">“{quote.testimonial}”</blockquote>
              <figcaption className="mt-6">
                <span className="block text-[15px] font-medium">{quote.name}</span>
                <span className="block text-[13.5px] text-[#4b5563]">InTelleX student · {quote.fieldOfInterest}</span>
              </figcaption>
            </div>
          </figure>
        </section>
      )}

      <Testimonials />

      {/* ── Final CTA ───────────────────────────────────────── */}
      <section className="wrap !max-w-[1200px] pb-16 pt-16">
        <div className="line-card relative overflow-hidden px-6 py-16 text-center sm:py-20">
          <Doodle name="groovy" className="absolute -left-6 bottom-0 hidden w-[230px] lg:block" />
          <Doodle name="jumping" className="absolute -right-4 bottom-0 hidden w-[230px] lg:block" />
          <div className="relative mx-auto max-w-[600px]">
            <h2 className="text-[38px] leading-[1.05] sm:text-[56px]">Talk to a person before you pay.</h2>
            <p className="mx-auto mt-4 max-w-[460px] text-[15.5px] leading-relaxed text-[#4b5563]">
              Tell us your goal, your level and when you are free. We will recommend a programme, or tell you honestly if the
              library is enough.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/programmes" className="btn btn-line !px-6">
                Browse programmes
              </Link>
              <a href={orientationWhatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-green !px-6">
                <MessageCircle size={16} /> Get advice on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AdvisorDock />
    </div>
  );
}
