import Link from 'next/link';
import { Sparkles, Gauge, Compass, Globe, Video, BadgeCheck, Users, Award } from 'lucide-react';
import { getAllCourses } from '@/lib/repo';
import { formatXAF } from '@/lib/format';
import TopNav from '@/components/landing/TopNav';
import Rail from '@/components/landing/Rail';
import Footer from '@/components/landing/Footer';
import Testimonials from '@/components/landing/Testimonials';
import CourseCard from '@/components/CourseCard';
import CourseRow from '@/components/CourseRow';
import CourseList from '@/components/CourseList';
import Reveal from '@/components/Reveal';
import HeroCard from '@/components/landing/HeroCard';
import HomeHero from '@/components/landing/HomeHero';
import CategoryStrip from '@/components/landing/CategoryStrip';
import CertTracks from '@/components/landing/CertTracks';
import { ECOSYSTEM, LOOPING_BINARY } from '@/lib/ecosystem';
import { coursesForTrack, CERT_TRACKS } from '@/lib/certTracks';

export const dynamic = 'force-dynamic';

const WAYS = [
  {
    id: 'self-paced',
    title: 'Self-paced courses',
    body: 'Recorded courses you work through on your own time. Finish a course and you get a certificate.',
    tag: 'Included in every subscription',
    image: '/way_selfpaced.webp',
    alt: 'Learner watching a self-paced course on a laptop',
  },
  {
    id: 'live',
    title: 'Live tutoring',
    body: 'A mentor teaches you directly — online from anywhere, or onsite at a location you choose.',
    tag: 'Priced per mentor & format',
    image: '/way_live.webp',
    alt: 'Mentor teaching a student in a live session',
  },
  {
    id: 'ai',
    title: 'AI Tutor',
    body: 'We train an AI on a real book so it teaches like the author — level by level.',
    tag: 'Pay per level, or pay once',
    image: '/way_ai.webp',
    alt: 'Student learning with an AI tutor and a textbook',
  },
];

export default async function HomePage() {
  const all = await getAllCourses();
  const bySlug = (s: string) => all.find((c) => c.slug === s);
  const special = bySlug('fullstack-3-weeks-ai');
  const selfPaced = all.filter((c) => c.selfPaced);

  const byTypes = (types: string[], limit = 14) => {
    const set = new Set(types.map((t) => t.toLowerCase()));
    return all.filter((c) => set.has((c.type || '').toLowerCase())).slice(0, limit);
  };

  const mentorLed = all.filter(
    (c) => c.featured && !c.selfPaced && c.slug !== 'fullstack-3-weeks-ai',
  );
  const trending = all
    .filter((c) => c.bestSeller && !c.featured && !c.selfPaced)
    .sort((a, b) => (b.courseNumberOfVotes || 0) - (a.courseNumberOfVotes || 0))
    .slice(0, 14);
  const webDev = byTypes(['Web Development', 'WordPress', 'E-commerce']);
  const dataAI = byTypes([
    'Data Science',
    'Machine Learning',
    'Artificial Intelligence',
    'AI & Data Science',
    'Database',
  ]);
  const security = byTypes(['Cybersecurity']);
  const designMkt = byTypes(['Design', 'Graphic Design', 'Marketing', 'Branding']);
  const devProg = byTypes([
    'Development',
    'Programming',
    'DevOps',
    'Linux',
    'Mobile Development',
    'Networking',
    'IT Certification',
    'Blockchain',
    'CAD',
    'Finance',
    'Business',
  ]);

  const dataTrack = coursesForTrack(all, CERT_TRACKS.find((t) => t.id === 'data-analysis')!, 6);
  const cyberTrack = coursesForTrack(all, CERT_TRACKS.find((t) => t.id === 'ec-council-ceh')!, 6);

  return (
    <>
      <Rail />
      <TopNav />
      <HomeHero />
      <CategoryStrip />

      {/* Trust / stats — Coursera-style social proof strip */}
      <div className="border-b py-7" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
        <div className="wrap flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { icon: Users, label: '360+ learners across Cameroon & beyond' },
              { icon: Award, label: 'Intellex + industry certification paths' },
              { icon: BadgeCheck, label: 'Certificate on every completed course' },
              { icon: Globe, label: 'Built by Looping Binary in Douala' },
            ].map((t) => (
              <span key={t.label} className="inline-flex items-center gap-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                <t.icon size={15} style={{ color: 'var(--green-deep)' }} /> {t.label}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {['MTN MoMo', 'Orange Money', 'EC-Council prep', 'Azure & Cloud', 'Intellex Cert'].map((p) => (
              <span key={p} className="pill">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* MARKETPLACE — courses first, Udemy/Coursera style */}
      <section id="courses" className="py-12 sm:py-16">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <Reveal className="max-w-[640px]">
              <div className="tab mb-3">A world-class catalogue</div>
              <h2 className="mb-2 text-[26px] leading-[1.12] sm:text-[34px]">
                Learn skills that employers actually hire for
              </h2>
              <p className="text-[15px]" style={{ color: 'var(--ink-soft)' }}>
                Live mentor programs, 100+ self-paced courses, and accredited certification tracks —
                from web development to cybersecurity and cloud.
              </p>
            </Reveal>
            <Link href="/courses" className="btn btn-ghost">Browse all courses →</Link>
          </div>

          <CourseRow
            title="Learners are viewing"
            subtitle="Popular picks right now across the Intellex catalogue."
            courses={trending}
            href="/courses"
          />
          <CourseRow
            title="Live & mentor-led programs"
            subtitle="Flagship Intellex programs with real mentors — online or onsite."
            courses={mentorLed}
            live
            href="/courses"
          />
          <CourseRow
            title="Self-paced tracks"
            subtitle="Guided, certificate-ready paths you finish on your schedule."
            courses={selfPaced}
            href="/#self-paced"
          />
        </div>
      </section>

      {/* PROFESSIONAL CERTIFICATES */}
      <CertTracks courses={all} />

      {/* LIST-STYLE: Data Analysis + Cybersecurity */}
      <section className="py-16 sm:py-20">
        <div className="wrap">
          <Reveal className="mb-10 max-w-[640px]">
            <div className="tab mb-3">Career lists</div>
            <h2 className="mb-2 text-[26px] leading-[1.12] sm:text-[34px]">
              Data Analysis & Cybersecurity — listed like the pros
            </h2>
            <p className="text-[15px]" style={{ color: 'var(--ink-soft)' }}>
              Dense, scannable course lists for high-demand tracks — the same pattern you know from
              Coursera and Udemy, tuned for Cameroon.
            </p>
          </Reveal>

          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-display text-[20px] sm:text-[22px]">Data Analysis</h3>
                <Link href="/courses?q=Data" className="text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                  See all →
                </Link>
              </div>
              <CourseList courses={dataTrack} issuer="Data & Analytics" />
            </div>
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="font-display text-[20px] sm:text-[22px]">Cybersecurity · EC-Council</h3>
                <Link href="/certifications#ec-council-ceh" className="text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                  CEH track →
                </Link>
              </div>
              <CourseList courses={cyberTrack} issuer="EC-Council" />
            </div>
          </div>
        </div>
      </section>

      {/* More category carousels */}
      <section className="border-t py-12 sm:py-16" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
        <div className="wrap">
          <CourseRow title="Web Development" courses={webDev} href="/courses?q=Web%20Development" />
          <CourseRow title="Data Science & AI" courses={dataAI} href="/courses?q=Data" />
          <CourseRow title="Cybersecurity" courses={security} href="/courses?q=Cybersecurity" />
          <CourseRow title="Design & Marketing" courses={designMkt} href="/courses?q=Design" />
          <CourseRow title="Programming & IT" courses={devProg} href="/courses" />

          {special && (
            <div
              className="mt-4 overflow-hidden rounded-[24px]"
              style={{ background: 'linear-gradient(135deg, var(--ink) 0%, #15202b 55%, #0d3d2a 100%)', color: 'var(--paper)' }}
            >
              <div className="grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em]" style={{ background: 'rgba(0,179,105,0.22)', color: '#9AFFC8' }}>
                    <Sparkles size={12} /> Special cohort
                  </div>
                  <h3 className="mb-3 font-display text-[24px] leading-tight sm:text-[30px]">{special.name}</h3>
                  <p className="mb-6 max-w-[480px] text-[14.5px] leading-relaxed" style={{ color: 'rgba(251,248,240,0.78)' }}>
                    {special.shortDescription || special.courseDetails}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link href={`/courses/${special.slug}`} className="btn btn-primary">View program</Link>
                    <span className="font-display text-[20px] font-semibold">{formatXAF(special.currentPrice)}</span>
                  </div>
                </div>
                <div className="overflow-hidden rounded-[18px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/marketplace_banner.webp"
                    alt=""
                    className="aspect-[16/10] w-full object-cover opacity-95"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* WAYS TO LEARN */}
      <section id="learn" className="py-16 sm:py-24">
        <div className="wrap">
          <Reveal className="mb-12 max-w-[600px]">
            <div className="tab mb-4">Ways to learn</div>
            <h2 className="mb-3.5 text-[27px] leading-[1.15] sm:text-[36px]">Three ways in, one certificate out</h2>
            <p className="text-base" style={{ color: 'var(--ink-soft)' }}>
              Self-paced, live mentors, or AI Tutor — mix them as you go.
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {WAYS.map((w) => (
              <div key={w.id} className="flex flex-col">
                <div className="mb-5 overflow-hidden rounded-[18px]" style={{ background: 'var(--paper-dim)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={w.image} alt={w.alt} className="aspect-[4/3] w-full object-cover object-center" />
                </div>
                <h3 className="mb-2 font-display text-xl">{w.title}</h3>
                <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{w.body}</p>
                <div className="mt-auto font-mono text-xs" style={{ color: 'var(--green-deep)' }}>{w.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SELF-PACED VALUE + GRID */}
      <section id="self-paced" className="py-16 sm:py-24" style={{ background: 'var(--paper-dim)' }}>
        <div className="wrap">
          <Reveal className="mb-10 max-w-[600px]">
            <div className="tab mb-4">Self-paced</div>
            <h2 className="mb-3 text-[26px] sm:text-[34px]">Built so you actually finish</h2>
            <p className="text-base" style={{ color: 'var(--ink-soft)' }}>
              Progress monitoring, checklists, and certificates — not another abandoned playlist.
            </p>
          </Reveal>
          <div className="mb-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: Video, title: 'Watch anywhere', body: 'Mobile-friendly lessons you can pick up between classes, work, or traffic.' },
              { icon: Gauge, title: 'Progress monitored', body: 'We notice when you stall and nudge you forward.' },
              { icon: Compass, title: 'Guided step-by-step', body: 'Checklists and resources the moment you get stuck.' },
            ].map((v) => (
              <div key={v.title} className="flex flex-col gap-3 rounded-[18px] border bg-paper p-6" style={{ borderColor: 'var(--line)' }}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'var(--green)', color: '#fff' }}>
                  <v.icon size={20} />
                </div>
                <h3 className="font-display text-[18px]">{v.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{v.body}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {selfPaced.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 sm:py-24">
        <div className="wrap">
          <Reveal className="mb-12 max-w-[600px]">
            <div className="tab mb-4">Pricing</div>
            <h2 className="mb-3.5 text-[27px] leading-[1.15] sm:text-[36px]">Priced for students, not corporations</h2>
            <p className="text-base" style={{ color: 'var(--ink-soft)' }}>
              We tried higher prices before this. This is the number that actually gets used.
            </p>
          </Reveal>
          <div className="grid items-stretch gap-6 md:grid-cols-3">
            <div className="flex flex-col rounded-[20px] border bg-paper p-8" style={{ borderColor: 'var(--line)' }}>
              <h3 className="mb-1.5 font-display text-[19px]">Monthly</h3>
              <div className="mb-5 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>Full access to every self-paced course, in every field.</div>
              <div className="mb-5 flex items-baseline gap-1.5">
                <span className="font-display text-[26px] font-semibold sm:text-[34px]">1,999</span>
                <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>XAF / month</span>
              </div>
              <ul className="mb-6 flex flex-col gap-2.5 text-sm">
                {['Every self-paced course, every field', 'Certificate after each course', 'Cancel or pause anytime'].map((li) => (
                  <li key={li} className="relative pl-5"><span className="absolute left-0" style={{ color: 'var(--green-deep)' }}>✓</span>{li}</li>
                ))}
              </ul>
              <Link href="/register" className="btn btn-primary mt-auto">Start monthly</Link>
            </div>
            <div className="relative flex flex-col rounded-[20px] p-8" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
              <span className="absolute -top-3 right-6 rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em]" style={{ background: 'var(--amber)', color: 'var(--ink)' }}>Best value</span>
              <h3 className="mb-1.5 font-display text-[19px]">Yearly</h3>
              <div className="mb-5 text-[13.5px]" style={{ color: 'rgba(251,248,240,0.7)' }}>Same access as monthly — 6% cheaper paid yearly.</div>
              <div className="font-mono text-[14px] line-through opacity-55">24,000 XAF</div>
              <div className="mb-5 mt-1.5 flex items-baseline gap-1.5">
                <span className="font-display text-[26px] font-semibold sm:text-[34px]">22,560</span>
                <span className="text-[13px]" style={{ color: 'rgba(251,248,240,0.7)' }}>XAF / year</span>
              </div>
              <ul className="mb-6 flex flex-col gap-2.5 text-sm">
                {['Everything in Monthly', '6% off the monthly rate', 'One payment, no renewals to track'].map((li) => (
                  <li key={li} className="relative pl-5"><span className="absolute left-0" style={{ color: 'var(--amber)' }}>✓</span>{li}</li>
                ))}
              </ul>
              <Link href="/register" className="btn btn-amber mt-auto">Start yearly</Link>
            </div>
            <div className="flex flex-col rounded-[20px] border bg-paper p-8" style={{ borderColor: 'var(--line)' }}>
              <h3 className="mb-1.5 font-display text-[19px]">Single courses</h3>
              <div className="mb-5 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>No subscription. Buy one course outright and keep it.</div>
              <div className="mb-5 flex items-baseline gap-1.5">
                <span className="font-display text-[26px] font-semibold sm:text-[34px]">From 4,999</span>
                <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>XAF / course</span>
              </div>
              <ul className="mb-6 flex flex-col gap-2.5 text-sm">
                {['Lifetime access to that course', 'Certificate on completion', 'Good for one specific skill'].map((li) => (
                  <li key={li} className="relative pl-5"><span className="absolute left-0" style={{ color: 'var(--green-deep)' }}>✓</span>{li}</li>
                ))}
              </ul>
              <Link href="/courses" className="btn btn-primary mt-auto">Browse courses</Link>
            </div>
          </div>

          <div id="discounts" className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="flex items-start gap-4 rounded-[16px] p-6" style={{ border: '1px dashed var(--green-deep)', background: 'rgba(0,179,105,0.06)' }}>
              <div className="font-display text-[26px]" style={{ color: 'var(--green-deep)' }}>6%</div>
              <div>
                <h4 className="mb-1 text-[15px] font-semibold">Pay yearly, not monthly</h4>
                <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                  Commit for a year up front and the price drops from 24,000 to 22,560 XAF automatically.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[16px] p-6" style={{ border: '1px dashed var(--green-deep)', background: 'rgba(0,179,105,0.06)' }}>
              <div className="font-display text-[26px]" style={{ color: 'var(--green-deep)' }}>30%</div>
              <div>
                <h4 className="mb-1 text-[15px] font-semibold">Win the Junior Dev tournament</h4>
                <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                  Champions get 30% off their first Intellex plan.{' '}
                  <Link href="/junior-dev" className="underline" style={{ color: 'var(--green-deep)' }}>Learn more</Link>
                  {' '}or{' '}
                  <a href={LOOPING_BINARY.juniorDev} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--green-deep)' }}>
                    compete on Junior Dev
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE + AI (condensed product deep-dives) */}
      <section className="py-16 sm:py-24" style={{ background: 'var(--paper-dim)' }}>
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-[22px] border bg-paper p-7 sm:p-8" style={{ borderColor: 'var(--line)' }}>
            <div className="tab mb-4">Live Tutoring</div>
            <h2 className="mb-3 font-display text-[24px] sm:text-[28px]">Sometimes you need a person</h2>
            <p className="mb-5 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Mentors teach live — online or onsite — in any field we cover.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mentor_session.webp" alt="" className="mb-5 aspect-[16/10] w-full rounded-[14px] object-cover" />
            <Link href="/register" className="btn btn-ghost">Get a quote</Link>
          </div>
          <div id="ai" className="rounded-[22px] border bg-paper p-7 sm:p-8" style={{ borderColor: 'var(--line)' }}>
            <div className="tab mb-4">AI Tutor</div>
            <h2 className="mb-3 font-display text-[24px] sm:text-[28px]">We teach the AI the book</h2>
            <p className="mb-5 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Train on a real textbook. Learn level by level — pay as you go, or unlock everything.
            </p>
            <HeroCard />
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section id="ecosystem" className="py-16 sm:py-24">
        <div className="wrap">
          <Reveal className="mb-10 max-w-[640px]">
            <div className="tab mb-4">The ecosystem</div>
            <h2 className="mb-3 text-[26px] sm:text-[34px]">The whole Looping Binary orbit</h2>
            <p className="text-base" style={{ color: 'var(--ink-soft)' }}>
              Certifications, internships, Junior Dev, books, resources, and the learning environment.
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ECOSYSTEM.map((e) => (
              <Link
                key={e.slug}
                href={e.href}
                className="group flex flex-col overflow-hidden rounded-[18px] border transition hover:-translate-y-0.5"
                style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.image} alt={e.alt} className="aspect-[16/10] w-full object-cover" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--green-deep)' }}>{e.tab}</div>
                  <h3 className="mb-2 font-display text-[18px] leading-snug group-hover:underline">{e.title}</h3>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{e.short}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* JUNIOR DEV */}
      <section className="px-6 pb-16 pt-2">
        <div className="mx-auto max-w-[1140px] rounded-[24px] p-7 sm:p-12" style={{ background: 'var(--green-deep)', color: 'var(--paper)' }}>
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div>
              <h3 className="max-w-[520px] font-display text-[22px] sm:text-[26px]">Already in Junior Dev? Your discount is already earned.</h3>
              <p className="mt-2 max-w-[480px] text-[14.5px]" style={{ color: 'rgba(251,248,240,0.82)' }}>
                Builder tier and above includes Intellex access. Tournament winners get 30% off.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/junior-dev" className="btn btn-light">About Junior Dev</Link>
              <a
                href={LOOPING_BINARY.juniorDev}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{ borderColor: 'rgba(251,248,240,0.35)', color: 'var(--paper)' }}
              >
                Open Junior Dev
              </a>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* JOIN CTA */}
      <section className="py-16 sm:py-24" style={{ background: 'var(--paper-dim)' }}>
        <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="overflow-hidden rounded-[22px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/join_cta.webp" alt="Milestone path toward joining Intellex" className="aspect-[16/10] w-full object-cover object-center" />
          </div>
          <div>
            <div className="tab mb-4">Ready when you are</div>
            <h2 className="mb-3.5 text-[27px] leading-[1.15] sm:text-[36px]">Wanna join?</h2>
            <p className="mb-7 max-w-[440px] text-base leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Pick a plan, tell us how to reach you, and we&apos;ll get you set up on WhatsApp —
              MTN MoMo or Orange Money, your call.
            </p>
            <Link href="/register" className="btn btn-primary">Yes, take me there</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
