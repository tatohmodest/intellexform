import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, BadgeCheck, Check, Globe, Users, Wallet } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getAllCourses } from '@/lib/repo';
import { getMyCourseSections, type MyCourseCard, type MyCourseSection } from '@/lib/learn/myCourses';
import TopNav from '@/components/landing/TopNav';
import Rail from '@/components/landing/Rail';
import Footer from '@/components/landing/Footer';
import Testimonials from '@/components/landing/Testimonials';
import CourseRow from '@/components/CourseRow';
import CoursesBrowser from '@/components/dashboard/CoursesBrowser';
import HomeHero from '@/components/landing/HomeHero';
import HeroCard from '@/components/landing/HeroCard';
import ContactUsSection from '@/components/landing/ContactUsSection';
import { ECOSYSTEM, LOOPING_BINARY } from '@/lib/ecosystem';

export const dynamic = 'force-dynamic';

const WAYS = [
  {
    id: 'self-paced',
    title: 'Self-paced courses',
    body: 'Learn on your schedule. Certificate when you finish.',
    tag: 'Included in every plan',
    image: '/way_selfpaced.webp',
    alt: 'Learner watching a self-paced course on a laptop',
    href: '/courses',
  },
  {
    id: 'live',
    title: 'Live mentoring',
    body: 'Approved mentors, online or onsite.',
    tag: 'Priced per mentor',
    image: '/way_live.webp',
    alt: 'Mentor teaching a student in a live session',
    href: '/contact?type=mentorship',
  },
  {
    id: 'ai',
    title: 'AI Tutor',
    body: 'Ask about any skill, course, or next step.',
    tag: 'Included with your account',
    image: '/way_ai.webp',
    alt: 'Student learning with an AI tutor',
    href: '/signup',
  },
];

const PLANS = [
  {
    name: 'Monthly',
    price: '1,999',
    unit: 'XAF / month',
    was: null,
    points: ['Every self-paced course', 'Certificates', 'AI Tutor + tutorials', 'Cancel anytime'],
    cta: 'Start monthly',
    href: '/signup',
    featured: false,
  },
  {
    name: 'Yearly',
    price: '22,560',
    unit: 'XAF / year',
    was: '24,000 XAF',
    points: ['Everything in Monthly', '6% off', 'One payment a year'],
    cta: 'Start yearly',
    href: '/signup',
    featured: true,
  },
  {
    name: 'Single course',
    price: '4,999+',
    unit: 'XAF / course',
    was: null,
    points: ['Lifetime access', 'Certificate', 'Upgrade anytime'],
    cta: 'Browse courses',
    href: '/courses',
    featured: false,
  },
];

function SectionHead({
  eyebrow,
  title,
  lead,
  action,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
      <div className="max-w-[620px]">
        <div className="eyebrow mb-2.5">{eyebrow}</div>
        <h2 className="text-[28px] leading-[1.12] sm:text-[36px]">{title}</h2>
        {lead && <p className="muted mt-2.5 text-[15px]">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

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
    const kind: MyCourseCard['kind'] =
      c.featured && !isSelfPaced
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
    .filter(
      (c) => !trendingCards.some((t) => t.slug === c.slug) && !selfPacedCards.some((s) => s.slug === c.slug),
    )
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
    ...ECOSYSTEM.slice(0, 5),
    {
      slug: 'tutorials',
      href: '/tutorials',
      tab: 'Tutorials',
      title: 'Free tutorials',
      short: '26 beginner-to-pro tracks.',
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
        <section className="section border-b" style={{ borderColor: 'var(--line)' }}>
          <div className="wrap">
            <SectionHead eyebrow="For you" title="Keep learning" />
            {homeSections.length > 0 ? (
              <CoursesBrowser sections={homeSections} total={homeTotal} inProgress={homeInProgress} />
            ) : (
              <Link href="/courses" className="btn btn-ghost">
                Browse all courses
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Trust strip */}
      <div className="border-b py-5" style={{ borderColor: 'var(--line)' }}>
        <div className="wrap flex flex-wrap items-center gap-x-8 gap-y-3">
          {[
            { icon: Users, label: '360+ learners' },
            { icon: BadgeCheck, label: 'Certificate on completion' },
            { icon: Wallet, label: 'MTN MoMo & Orange Money' },
            { icon: Globe, label: 'Built in Douala' },
          ].map((t) => (
            <span key={t.label} className="muted inline-flex items-center gap-2 text-[13px]">
              <t.icon size={15} style={{ color: 'var(--green-deep)' }} /> {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* Ways to learn */}
      <section id="learn" className="section">
        <div className="wrap">
          <SectionHead eyebrow="Ways to learn" title="Three ways in, one certificate out" />
          <div className="grid gap-5 md:grid-cols-3">
            {WAYS.map((w) => (
              <Link key={w.id} href={w.href} className="card group flex flex-col overflow-hidden">
                <div className="overflow-hidden" style={{ background: 'var(--paper-dim)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={w.image}
                    alt={w.alt}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-[19px]">{w.title}</h3>
                  <p className="muted mt-1.5 text-[14px] leading-relaxed">{w.body}</p>
                  <span
                    className="mt-auto pt-4 font-mono text-[11.5px]"
                    style={{ color: 'var(--green-deep)' }}
                  >
                    {w.tag}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue */}
      {trending.length + mentorLed.length > 0 && (
        <section id="courses" className="section section-dim">
          <div className="wrap">
            <SectionHead
              eyebrow="Catalogue"
              title="Skills employers hire for"
              action={
                <Link href="/courses" className="btn btn-ghost">
                  All courses <ArrowRight size={15} />
                </Link>
              }
            />
            <CourseRow title="Popular now" courses={trending} href="/courses" />
            {mentorLed.length > 0 && (
              <CourseRow title="Mentor-led programs" courses={mentorLed} live href="/courses" />
            )}
          </div>
        </section>
      )}

      {/* Ecosystem */}
      <section id="ecosystem" className="section">
        <div className="wrap">
          <SectionHead
            eyebrow="Ecosystem"
            title="One account, many doors"
            action={
              <Link href="/ecosystem" className="btn btn-ghost">
                Full map <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <Link key={p.slug} href={p.href} className="card group flex items-center gap-4 p-3 pr-5">
                <div
                  className="h-20 w-24 shrink-0 overflow-hidden rounded-[10px]"
                  style={{ background: 'var(--paper-dim)' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={'alt' in p ? p.alt : ''}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="eyebrow mb-1 text-[10px]">{p.tab}</div>
                  <h3 className="font-display text-[16px] leading-snug">{p.title}</h3>
                </div>
                <ArrowRight
                  size={16}
                  className="muted shrink-0 transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section section-dim">
        <div className="wrap">
          <SectionHead
            eyebrow="Pricing"
            title="Priced for students"
            lead="Pay with MTN MoMo, Orange Money, or card."
          />

          <div className="grid items-stretch gap-5 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-[18px] p-7 ${plan.featured ? '' : 'card'}`}
                style={plan.featured ? { background: 'var(--ink)', color: 'var(--paper)' } : undefined}
              >
                {plan.featured && (
                  <span
                    className="absolute -top-3 right-6 rounded-full px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-white"
                    style={{ background: 'var(--blue)' }}
                  >
                    Best value
                  </span>
                )}
                <h3 className="font-display text-[18px]">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display text-[30px] font-semibold sm:text-[34px]">{plan.price}</span>
                  <span className="text-[13px]" style={{ opacity: 0.65 }}>
                    {plan.unit}
                  </span>
                </div>
                {plan.was && (
                  <div className="font-mono text-[12.5px] line-through opacity-50">{plan.was}</div>
                )}
                <ul className="mb-7 mt-5 flex flex-col gap-2.5 text-[14px]">
                  {plan.points.map((li) => (
                    <li key={li} className="flex gap-2.5">
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0"
                        style={{
                          color: plan.featured ? 'var(--green)' : 'var(--green-deep)',
                        }}
                      />
                      {li}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`btn mt-auto ${plan.featured ? 'btn-primary' : 'btn-ghost'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p id="discounts" className="muted mt-6 text-center text-[13.5px]">
            Junior Dev champions get <strong style={{ color: 'var(--ink)' }}>30% off</strong> their first
            plan.{' '}
            <Link
              href="/junior-dev"
              className="font-semibold underline"
              style={{ color: 'var(--green-deep)' }}
            >
              Learn more
            </Link>
          </p>
        </div>
      </section>

      {/* AI Tutor */}
      <section id="ai" className="section">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="eyebrow mb-3">AI Tutor</div>
            <h2 className="text-[28px] leading-[1.12] sm:text-[36px]">An AI that knows your next lesson</h2>
            <p className="muted mt-3 max-w-[440px] text-[15px] leading-relaxed">
              Ask about a skill, a course, or what to learn next.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/signup" className="btn btn-primary">
                Try AI Tutor
              </Link>
              <Link href="/contact?type=mentorship" className="btn btn-ghost">
                Book a mentor
              </Link>
            </div>
          </div>
          <HeroCard />
        </div>
      </section>

      {/* Junior Dev callout */}
      <section className="pb-4">
        <div className="wrap">
          <div
            className="flex flex-col items-start justify-between gap-6 rounded-[20px] p-7 sm:flex-row sm:items-center sm:p-10"
            style={{ background: 'var(--green-deep)', color: 'var(--paper)' }}
          >
            <div>
              <h3 className="font-display text-[22px] sm:text-[26px]">
                In Junior Dev? Your access may be earned.
              </h3>
              <p className="mt-1.5 text-[14.5px]" style={{ color: 'rgba(255,255,255,0.82)' }}>
                Builder tier includes InTelleX courses.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/junior-dev" className="btn btn-light">
                See benefits
              </Link>
              <a
                href={LOOPING_BINARY.juniorDev}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{
                  color: 'var(--paper)',
                  borderColor: 'rgba(255,255,255,0.35)',
                }}
              >
                Open Junior Dev
              </a>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      <ContactUsSection />

      <section className="section">
        <div className="wrap">
          <div
            className="flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[20px] p-8 sm:flex-row sm:items-center sm:p-10"
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
              <p className="mt-2 text-[14.5px]" style={{ color: 'rgba(251,248,240,0.75)' }}>
                Free account. Upgrade any time.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="btn btn-primary">
                Create free account
              </Link>
              <Link
                href="/enterprise"
                className="btn btn-ghost"
                style={{
                  color: 'var(--paper)',
                  borderColor: 'rgba(251,248,240,0.25)',
                }}
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
