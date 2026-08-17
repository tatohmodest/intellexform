import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Compass,
  Gauge,
  Globe,
  Users,
  Video,
} from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getAllCourses } from '@/lib/repo';
import { getMyCourseSections, type MyCourseCard, type MyCourseSection } from '@/lib/learn/myCourses';
import TopNav from '@/components/landing/TopNav';
import Rail from '@/components/landing/Rail';
import Footer from '@/components/landing/Footer';
import Testimonials from '@/components/landing/Testimonials';
import CourseRow from '@/components/CourseRow';
import CoursesBrowser from '@/components/dashboard/CoursesBrowser';
import Reveal from '@/components/Reveal';
import HomeHero from '@/components/landing/HomeHero';
import HeroCard from '@/components/landing/HeroCard';
import ContactUsSection from '@/components/landing/ContactUsSection';
import { ECOSYSTEM, LOOPING_BINARY } from '@/lib/ecosystem';

export const dynamic = 'force-dynamic';

const WAYS = [
  {
    id: 'self-paced',
    title: 'Self-paced courses',
    body: 'Recorded courses you work through on your own time - progress monitored, checklists when you stall, and a certificate when you finish. Mobile-friendly so you can learn between classes, work, or traffic.',
    tag: 'Included in every subscription',
    image: '/way_selfpaced.webp',
    alt: 'Learner watching a self-paced course on a laptop',
    href: '/courses',
  },
  {
    id: 'live',
    title: 'Live mentoring',
    body: 'A real mentor teaches you directly - online from anywhere, or onsite at a location you choose. Mentorship is approved, not toggled on: people earn the right to guide learners.',
    tag: 'Priced per mentor & format',
    image: '/way_live.webp',
    alt: 'Mentor teaching a student in a live session',
    href: '/contact?type=mentorship',
  },
  {
    id: 'ai',
    title: 'AI Tutor',
    body: 'An AI that knows InTelleX - free tutorials, the live Mongo catalogue, how campuses join the network, and how to learn step by step. Ask it about a skill, a course, or the platform itself.',
    tag: 'Included with your account',
    image: '/way_ai.webp',
    alt: 'Student learning with an AI tutor',
    href: '/signup',
  },
];

const VALUE_PILLARS = [
  {
    icon: BookOpen,
    title: 'Courses you can finish',
    body: 'Self-paced paths with progress tracking, checklists when you stall, and a certificate when you complete - not another abandoned playlist.',
  },
  {
    icon: Users,
    title: 'Mentors who earned the role',
    body: 'Live tutoring online or onsite. Mentorship is reviewed before someone can guide learners - so you get real accountability.',
  },
  {
    icon: Compass,
    title: 'Tutorials for registered students',
    body: 'World-class beginner-to-pro tracks - HTML, Python, design, marketing, DevOps, and more - so you can start before you pay.',
  },
  {
    icon: BadgeCheck,
    title: 'One identity across Looping Binary',
    body: 'Certificates, Junior Dev, books, and your learning progress sit on the same account. Progress once - carry it everywhere.',
  },
];

function parseCourseDurationMinutes(raw: string | undefined): number {
  const m = String(raw || '').match(/(\d+)/);
  if (!m) return 60;
  const n = Number(m[1]) || 1;
  return String(raw).toLowerCase().includes('h') ? n * 60 : n;
}

function buildFallbackSections(courses: Awaited<ReturnType<typeof getAllCourses>>): MyCourseSection[] {
  const toCard = (c: (typeof courses)[number]): MyCourseCard => {
    const priceXaf = Math.max(0, Number(c.currentPrice) || 0);
    const isSelfPaced = Boolean(c.selfPaced);
    const kind: MyCourseCard['kind'] = c.featured && !isSelfPaced
      ? 'tutoring'
      : isSelfPaced
        ? 'self-paced'
        : priceXaf > 0
          ? 'catalogue'
          : 'free';

    return {
      id: String(c.id || c.slug),
      slug: c.slug,
      title: c.name,
      subtitle: c.instructor || '',
      tagline: c.shortDescription || '',
      tag: c.type || 'Course',
      color: '#00b369',
      thumbnailUrl: c.courseImage || null,
      totalLessons: 0,
      totalMinutes: parseCourseDurationMinutes(c.courseDuration),
      priceXaf,
      pricingType: priceXaf > 0 ? 'ONE_TIME' : 'FREE',
      enrolled: false,
      doneCount: 0,
      pct: 0,
      href: `/courses/${c.slug}`,
      continueHref: `/courses/${c.slug}`,
      source: 'catalogue',
      kind,
    };
  };

  const safeCourses = courses.filter((c) => String(c.slug || '').trim().length > 0);
  const trendingCards = safeCourses
    .filter((c) => c.bestSeller || c.featured)
    .sort((a, b) => (b.courseNumberOfVotes || 0) - (a.courseNumberOfVotes || 0))
    .slice(0, 12)
    .map(toCard);
  const selfPacedCards = safeCourses
    .filter((c) => Boolean(c.selfPaced))
    .slice(0, 12)
    .map(toCard);
  const moreCards = safeCourses
    .filter((c) => !trendingCards.some((t) => t.slug === c.slug) && !selfPacedCards.some((s) => s.slug === c.slug))
    .slice(0, 12)
    .map(toCard);

  return [
    {
      id: 'home-recommended-trending',
      title: 'Recommended right now',
      subtitle: 'Popular courses learners are actively joining',
      courses: trendingCards,
    },
    {
      id: 'home-recommended-self-paced',
      title: 'Self-paced picks',
      subtitle: 'Study at your own speed with guided programmes',
      courses: selfPacedCards,
    },
    {
      id: 'home-recommended-more',
      title: 'More to explore',
      subtitle: 'Keep discovering the catalogue like a full learning marketplace',
      courses: moreCards,
    },
  ].filter((section) => section.courses.length > 0);
}

export default async function HomePage() {
  const session = getSessionUser();

  let personalizedSections: Awaited<ReturnType<typeof getMyCourseSections>>['sections'] = [];
  let personalizedTotal = 0;
  let personalizedInProgress = 0;

  if (session) {
    try {
      const data = await getMyCourseSections(session.uid);
      personalizedSections = data.sections;
      personalizedTotal = data.total;
      personalizedInProgress = data.inProgress;
    } catch (err) {
      console.error('home personalized courses failed:', err);
    }
  }

  const all = await getAllCourses();
  const trending = all
    .filter((c) => c.bestSeller || c.featured)
    .sort((a, b) => (b.courseNumberOfVotes || 0) - (a.courseNumberOfVotes || 0))
    .slice(0, 6);
  const mentorLed = all.filter((c) => c.featured && !c.selfPaced).slice(0, 4);
  const fallbackSections = buildFallbackSections(all);
  const homeSections = personalizedSections.length > 0 ? personalizedSections : fallbackSections;
  const homeTotal =
    personalizedSections.length > 0
      ? personalizedTotal
      : homeSections.reduce((sum, section) => sum + section.courses.length, 0);
  const homeInProgress = personalizedSections.length > 0 ? personalizedInProgress : 0;

  const pillars = [
    ...ECOSYSTEM.slice(0, 4),
    {
      slug: 'tutorials',
      href: '/tutorials',
      tab: 'Tutorials',
      title: 'Free world-class tutorials',
      short:
        'Twenty-six beginner-to-pro tracks - from HTML and Python to Kubernetes, C++, Rust, Linux, and Arduino.',
      image: '/eco_resources.webp',
      alt: 'Free tutorials illustration',
    },
  ];

  return (
    <>
      <Rail />
      <TopNav />
      <HomeHero />

      {session && (
        <section className="border-b py-12 sm:py-14" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
          <div className="wrap">
            <div className="mb-7 max-w-[760px]">
              <div className="tab mb-3">Recommended for you</div>
              <h2 className="mb-2 text-[26px] leading-[1.1] sm:text-[34px]">Keep learning on your timeline</h2>
              <p className="text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                Your enrolled courses appear first, then more tracks and instructor programs to explore,
                right on the home screen.
              </p>
            </div>
            {homeSections.length > 0 ? (
              <CoursesBrowser sections={homeSections} total={homeTotal} inProgress={homeInProgress} />
            ) : (
              <div className="border-t py-10" style={{ borderColor: 'var(--line)' }}>
                <p className="text-[15px]" style={{ color: 'var(--ink-soft)' }}>
                  Recommendations are loading. Browse the full catalogue while we prepare your picks.
                </p>
                <Link href="/courses" className="btn btn-ghost mt-4">
                  Browse all courses
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trust strip */}
      <div className="border-b py-7" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
        <div className="wrap flex flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { icon: Users, label: '360+ learners across Cameroon & beyond' },
              { icon: BadgeCheck, label: 'Certificate on every completed course' },
              { icon: BookOpen, label: 'Self-paced, live mentors & AI Tutor' },
              { icon: Globe, label: 'Built by Looping Binary in Douala' },
            ].map((t) => (
              <span
                key={t.label}
                className="inline-flex items-center gap-2 text-[13px]"
                style={{ color: 'var(--ink-soft)' }}
              >
                <t.icon size={15} style={{ color: 'var(--green-deep)' }} /> {t.label}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {['MTN MoMo', 'Orange Money', 'Certificates', 'InTelleX'].map((p) => (
              <span key={p} className="pill">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* What InTelleX brings */}
      <section className="py-16 sm:py-20">
        <div className="wrap">
          <Reveal className="mb-10 max-w-[680px]">
            <div className="tab mb-3">Why InTelleX</div>
            <h2 className="mb-3 text-[26px] leading-[1.12] sm:text-[34px]">
              Built so you actually finish what you start
            </h2>
            <p className="text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Tutorials free for registered students, a paid catalogue for career skills, live mentors when
              you need a person, and an AI Tutor grounded in what we teach - not generic chat.
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            {VALUE_PILLARS.map((v) => (
              <div
                key={v.title}
                className="rounded-[20px] border bg-paper p-6 sm:p-7"
                style={{ borderColor: 'var(--line)' }}
              >
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }}
                >
                  <v.icon size={20} />
                </div>
                <h3 className="mb-2 font-display text-[19px] leading-snug">{v.title}</h3>
                <p className="text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section id="ecosystem" className="border-t py-16 sm:py-20" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
        <div className="wrap">
          <Reveal className="mb-10 max-w-[680px]">
            <div className="tab mb-3">The ecosystem</div>
            <h2 className="mb-3 text-[26px] leading-[1.12] sm:text-[34px]">
              One account. Many doors into the same future.
            </h2>
            <p className="text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Certifications, internships, Junior Dev, books, free resources, and tutorials are how
              InTelleX stays useful after the first lesson. Each path has its own page - this is the map.
            </p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <Link
                key={p.slug}
                href={p.href}
                className="group overflow-hidden rounded-[20px] border bg-paper transition-shadow hover:shadow-card"
                style={{ borderColor: 'var(--line)' }}
              >
                <div className="aspect-[16/9] overflow-hidden" style={{ background: 'var(--paper-dim)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={'alt' in p ? p.alt : ''}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <div
                    className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em]"
                    style={{ color: 'var(--green-deep)' }}
                  >
                    {p.tab}
                  </div>
                  <h3 className="mb-2 font-display text-[18px] leading-snug">{p.title}</h3>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    {p.short}
                  </p>
                  <span
                    className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold"
                    style={{ color: 'var(--green-deep)' }}
                  >
                    Explore <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ecosystem" className="btn btn-primary">
              Full ecosystem map
            </Link>
            <Link href="/tutorials" className="btn btn-ghost">
              Student tutorials
            </Link>
          </div>
        </div>
      </section>

      {/* Catalogue - fewer rows, still explained */}
      <section id="courses" className="py-16 sm:py-20">
        <div className="wrap">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <Reveal className="max-w-[640px]">
              <div className="tab mb-3">Catalogue</div>
              <h2 className="mb-3 text-[26px] leading-[1.12] sm:text-[34px]">
                Skills employers hire for - sampled, not dumped
              </h2>
              <p className="text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                The full Mongo catalogue lives on the courses page. Here we only spotlight what
                learners are viewing right now and a few mentor-led programs - so the home page
                stays readable while still advertising the depth behind InTelleX.
              </p>
            </Reveal>
            <Link href="/courses" className="btn btn-ghost">
              Browse all courses →
            </Link>
          </div>

          <CourseRow
            title="Learners are viewing"
            subtitle="Popular picks from the live InTelleX catalogue - web, data, security, and more."
            courses={trending}
            href="/courses"
          />
          {mentorLed.length > 0 && (
            <CourseRow
              title="Live & mentor-led programs"
              subtitle="Flagship paths with real mentors - online or onsite - when a playlist is not enough."
              courses={mentorLed}
              live
              href="/courses"
            />
          )}
        </div>
      </section>

      {/* Ways to learn - full copy + imagery */}
      <section id="learn" className="border-t py-16 sm:py-24" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
        <div className="wrap">
          <Reveal className="mb-12 max-w-[640px]">
            <div className="tab mb-4">Ways to learn</div>
            <h2 className="mb-3.5 text-[27px] leading-[1.15] sm:text-[36px]">
              Three ways in, one certificate out
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Self-paced courses, live mentors, or the AI Tutor - mix them as you go. One InTelleX
              identity carries your progress, your campus memberships, and the proof you finished.
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {WAYS.map((w) => (
              <Link key={w.id} href={w.href} className="flex flex-col">
                <div className="mb-5 overflow-hidden rounded-[18px]" style={{ background: 'var(--paper)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={w.image} alt={w.alt} className="aspect-[4/3] w-full object-cover object-center" />
                </div>
                <h3 className="mb-2 font-display text-xl">{w.title}</h3>
                <p className="mb-3 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {w.body}
                </p>
                <div className="mt-auto font-mono text-xs" style={{ color: 'var(--green-deep)' }}>
                  {w.tag}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: Video,
                title: 'Watch anywhere',
                body: 'Mobile-friendly lessons you can pick up between classes, work, or traffic - without losing your place.',
              },
              {
                icon: Gauge,
                title: 'Progress monitored',
                body: 'We notice when you stall and nudge you forward, so InTelleX is not another abandoned playlist.',
              },
              {
                icon: Compass,
                title: 'Guided step-by-step',
                body: 'Checklists, free tutorials, and an AI Tutor that can point you to the next concrete lesson.',
              },
            ].map((v) => (
              <div
                key={v.title}
                className="flex flex-col gap-3 rounded-[18px] border bg-paper p-6"
                style={{ borderColor: 'var(--line)' }}
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ background: 'var(--green)', color: '#fff' }}
                >
                  <v.icon size={20} />
                </div>
                <h3 className="font-display text-[18px]">{v.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - full value articulation restored */}
      <section id="pricing" className="py-16 sm:py-24">
        <div className="wrap">
          <Reveal className="mb-12 max-w-[640px]">
            <div className="tab mb-4">Pricing</div>
            <h2 className="mb-3.5 text-[27px] leading-[1.15] sm:text-[36px]">
              Priced for students, not corporations
            </h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              We tried higher prices before this. These are the numbers that actually get used in
              Cameroon - full catalogue access, certificates, and the learning environment that
              helps you finish. Pay with MTN MoMo, Orange Money, or card.
            </p>
          </Reveal>

          <div className="grid items-stretch gap-6 md:grid-cols-3">
            <div className="flex flex-col rounded-[20px] border bg-paper p-8" style={{ borderColor: 'var(--line)' }}>
              <h3 className="mb-1.5 font-display text-[19px]">Monthly</h3>
              <div className="mb-5 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                Full access to every self-paced course, in every field - plus certificates and the
                learning dashboard.
              </div>
              <div className="mb-5 flex items-baseline gap-1.5">
                <span className="font-display text-[26px] font-semibold sm:text-[34px]">1,999</span>
                <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  XAF / month
                </span>
              </div>
              <ul className="mb-6 flex flex-col gap-2.5 text-sm">
                {[
                  'Every self-paced course, every field',
                  'Certificate after each completed course',
                  'AI Tutor + free tutorial library',
                  'Cancel or pause anytime',
                ].map((li) => (
                  <li key={li} className="relative pl-5">
                    <span className="absolute left-0" style={{ color: 'var(--green-deep)' }}>
                      ✓
                    </span>
                    {li}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn btn-primary mt-auto">
                Start monthly
              </Link>
            </div>

            <div
              className="relative flex flex-col rounded-[20px] p-8"
              style={{ background: 'var(--ink)', color: 'var(--paper)' }}
            >
              <span
                className="absolute -top-3 right-6 rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em]"
                style={{ background: 'var(--amber)', color: 'var(--ink)' }}
              >
                Best value
              </span>
              <h3 className="mb-1.5 font-display text-[19px]">Yearly</h3>
              <div className="mb-5 text-[13.5px] leading-relaxed" style={{ color: 'rgba(251,248,240,0.7)' }}>
                Same access as monthly - 6% cheaper when you commit for the year. One payment, fewer
                renewals to track.
              </div>
              <div className="font-mono text-[14px] line-through opacity-55">24,000 XAF</div>
              <div className="mb-5 mt-1.5 flex items-baseline gap-1.5">
                <span className="font-display text-[26px] font-semibold sm:text-[34px]">22,560</span>
                <span className="text-[13px]" style={{ color: 'rgba(251,248,240,0.7)' }}>
                  XAF / year
                </span>
              </div>
              <ul className="mb-6 flex flex-col gap-2.5 text-sm">
                {[
                  'Everything in Monthly',
                  '6% off the monthly rate',
                  'Best for serious year-long skill paths',
                  'One payment, no monthly renewals to track',
                ].map((li) => (
                  <li key={li} className="relative pl-5">
                    <span className="absolute left-0" style={{ color: 'var(--amber)' }}>
                      ✓
                    </span>
                    {li}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn btn-amber mt-auto">
                Start yearly
              </Link>
            </div>

            <div className="flex flex-col rounded-[20px] border bg-paper p-8" style={{ borderColor: 'var(--line)' }}>
              <h3 className="mb-1.5 font-display text-[19px]">Single courses</h3>
              <div className="mb-5 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                No subscription. Buy one course outright when you need a specific skill - and keep
                lifetime access to that course.
              </div>
              <div className="mb-5 flex items-baseline gap-1.5">
                <span className="font-display text-[26px] font-semibold sm:text-[34px]">From 4,999</span>
                <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  XAF / course
                </span>
              </div>
              <ul className="mb-6 flex flex-col gap-2.5 text-sm">
                {[
                  'Lifetime access to that course',
                  'Certificate on completion',
                  'Ideal for one focused skill',
                  'Upgrade to a plan anytime',
                ].map((li) => (
                  <li key={li} className="relative pl-5">
                    <span className="absolute left-0" style={{ color: 'var(--green-deep)' }}>
                      ✓
                    </span>
                    {li}
                  </li>
                ))}
              </ul>
              <Link href="/courses" className="btn btn-primary mt-auto">
                Browse courses
              </Link>
            </div>
          </div>

          <div id="discounts" className="mt-6 grid gap-5 md:grid-cols-2">
            <div
              className="flex items-start gap-4 rounded-[16px] p-6"
              style={{ border: '1px dashed var(--green-deep)', background: 'rgba(0,179,105,0.06)' }}
            >
              <div className="font-display text-[26px]" style={{ color: 'var(--green-deep)' }}>
                6%
              </div>
              <div>
                <h4 className="mb-1 text-[15px] font-semibold">Pay yearly, not monthly</h4>
                <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  Commit for a year up front and the price drops from 24,000 to 22,560 XAF
                  automatically - same catalogue, same certificates, fewer payments to remember.
                </p>
              </div>
            </div>
            <div
              className="flex items-start gap-4 rounded-[16px] p-6"
              style={{ border: '1px dashed var(--green-deep)', background: 'rgba(0,179,105,0.06)' }}
            >
              <div className="font-display text-[26px]" style={{ color: 'var(--green-deep)' }}>
                30%
              </div>
              <div>
                <h4 className="mb-1 text-[15px] font-semibold">Win the Junior Dev tournament</h4>
                <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  Champions get 30% off their first InTelleX plan.{' '}
                  <Link href="/junior-dev" className="underline" style={{ color: 'var(--green-deep)' }}>
                    Learn more
                  </Link>{' '}
                  or{' '}
                  <a
                    href={LOOPING_BINARY.juniorDev}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: 'var(--green-deep)' }}
                  >
                    compete on Junior Dev
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live + AI deep dives */}
      <section className="border-t py-16 sm:py-24" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="rounded-[22px] border bg-paper p-7 sm:p-8" style={{ borderColor: 'var(--line)' }}>
            <div className="tab mb-4">Live tutoring</div>
            <h2 className="mb-3 font-display text-[24px] sm:text-[28px]">
              Sometimes you need a person, not a playlist
            </h2>
            <p className="mb-5 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Mentors teach live - online or onsite - in the fields we cover. On InTelleX,
              mentorship is a privilege: applications are reviewed before someone can guide
              learners or publish in the library.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mentor_session.webp"
              alt="Mentor guiding a learner in a live session"
              className="mb-5 aspect-[16/10] w-full rounded-[14px] object-cover"
            />
            <Link href="/contact?type=mentorship" className="btn btn-ghost">
              Contact us for a quote
            </Link>
          </div>
          <div id="ai" className="rounded-[22px] border bg-paper p-7 sm:p-8" style={{ borderColor: 'var(--line)' }}>
            <div className="tab mb-4">AI Tutor</div>
            <h2 className="mb-3 font-display text-[24px] sm:text-[28px]">
              An AI that knows InTelleX - and your next lesson
            </h2>
            <p className="mb-5 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Ask about Docker, how campuses join the network, or which catalogue course fits your
              goal. The tutor is grounded in free tutorials, Mongo courses, and how this Education
              OS actually works.
            </p>
            <HeroCard />
          </div>
        </div>
      </section>

      {/* Junior Dev callout */}
      <section className="px-6 py-16">
        <div
          className="mx-auto max-w-[1140px] rounded-[24px] p-7 sm:p-12"
          style={{ background: 'var(--green-deep)', color: 'var(--paper)' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div>
              <h3 className="max-w-[520px] font-display text-[22px] sm:text-[26px]">
                Already in Junior Dev? Your InTelleX edge may already be earned.
              </h3>
              <p className="mt-2 max-w-[520px] text-[14.5px] leading-relaxed" style={{ color: 'rgba(251,248,240,0.82)' }}>
                Builder tier and above includes InTelleX course access. Tournament champions get 30%
                off their first plan - competition that turns into real learning leverage.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/junior-dev" className="btn btn-amber">
                See Junior Dev benefits
              </Link>
              <a
                href={LOOPING_BINARY.juniorDev}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{ color: 'var(--paper)', borderColor: 'rgba(251,248,240,0.35)' }}
              >
                Open Junior Dev
              </a>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      <ContactUsSection />

      <section className="py-14 sm:py-16">
        <div className="wrap">
          <div
            className="flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[24px] p-8 sm:flex-row sm:items-center sm:p-10"
            style={{
              background: 'linear-gradient(135deg, var(--ink) 0%, #0d3d2a 100%)',
              color: 'var(--paper)',
            }}
          >
            <div className="max-w-[560px]">
              <div
                className="mb-2 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]"
                style={{ color: '#9AFFC8' }}
              >
                <BadgeCheck size={14} /> Start today
              </div>
              <h2 className="font-display text-[26px] leading-tight sm:text-[32px]">
                Ready to learn with InTelleX?
              </h2>
              <p className="mt-2 text-[14.5px] leading-relaxed" style={{ color: 'rgba(251,248,240,0.75)' }}>
                Free for students with an account. Full catalogue, certificates, mentors, and AI when you are ready.
                Schools and companies: see our enterprise campus platform.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="btn btn-primary">
                Create free account
              </Link>
              <Link
                href="/enterprise"
                className="btn btn-ghost"
                style={{ color: 'var(--paper)', borderColor: 'rgba(251,248,240,0.25)' }}
              >
                For institutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
