import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Globe,
  Network,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { getAllCourses } from '@/lib/repo';
import TopNav from '@/components/landing/TopNav';
import Rail from '@/components/landing/Rail';
import Footer from '@/components/landing/Footer';
import Testimonials from '@/components/landing/Testimonials';
import CourseRow from '@/components/CourseRow';
import Reveal from '@/components/Reveal';
import HomeHero from '@/components/landing/HomeHero';
import { ECOSYSTEM, LOOPING_BINARY } from '@/lib/ecosystem';

export const dynamic = 'force-dynamic';

const WAYS = [
  {
    id: 'self-paced',
    title: 'Self-paced courses',
    body: 'Catalogue courses with certificates — finish on your schedule.',
    href: '/courses',
  },
  {
    id: 'live',
    title: 'Live mentorship',
    body: 'Approved mentors. Online or onsite. Real accountability.',
    href: '/register',
  },
  {
    id: 'ai',
    title: 'AI Tutor',
    body: 'Knows InTelleX, free tutorials, and the live Mongo catalogue.',
    href: '/signup',
  },
];

export default async function HomePage() {
  const all = await getAllCourses();
  const trending = all
    .filter((c) => c.bestSeller || c.featured)
    .sort((a, b) => (b.courseNumberOfVotes || 0) - (a.courseNumberOfVotes || 0))
    .slice(0, 6);
  const mentorLed = all
    .filter((c) => c.featured && !c.selfPaced)
    .slice(0, 4);

  const pillars = [
    ...ECOSYSTEM.slice(0, 4),
    {
      slug: 'network',
      href: '/network',
      tab: 'Network',
      title: 'Federated institution network',
      short: 'Campuses connect. Academic data stays with the school.',
      image: '/eco_learning.webp',
    },
    {
      slug: 'tutorials',
      href: '/tutorials',
      tab: 'Tutorials',
      title: 'Free world-class tutorials',
      short: '26 tracks from HTML to Kubernetes, C++, Rust, and more.',
      image: '/eco_resources.webp',
    },
  ];

  return (
    <>
      <Rail />
      <TopNav />
      <HomeHero />

      <div className="border-b py-6" style={{ borderColor: 'var(--line)' }}>
        <div className="wrap flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-x-7 gap-y-2">
            {[
              { icon: Network, label: 'Federated Education OS' },
              { icon: ShieldCheck, label: 'Governance-first campuses' },
              { icon: Users, label: '360+ learners' },
              { icon: Globe, label: 'Built in Douala' },
            ].map((t) => (
              <span key={t.label} className="inline-flex items-center gap-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                <t.icon size={14} style={{ color: 'var(--green-deep)' }} /> {t.label}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {['MTN MoMo', 'Orange Money', 'Verified institutions'].map((p) => (
              <span key={p} className="pill">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Ecosystem showcase */}
      <section id="ecosystem" className="py-14 sm:py-18">
        <div className="wrap">
          <Reveal className="mb-8 max-w-[640px]">
            <div className="tab mb-3">The ecosystem</div>
            <h2 className="mb-2 text-[26px] leading-[1.12] sm:text-[34px]">
              One network. Many campuses. Clear ownership.
            </h2>
            <p className="text-[15px]" style={{ color: 'var(--ink-soft)' }}>
              InTelleX connects learning, institutions, mentorship, and careers — without stuffing every school into one database.
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <Link
                key={p.slug}
                href={p.href}
                className="group overflow-hidden rounded-[20px] border transition-shadow hover:shadow-card"
                style={{ borderColor: 'var(--line)' }}
              >
                <div className="aspect-[16/9] overflow-hidden" style={{ background: 'var(--paper-dim)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: 'var(--green-deep)' }}>
                    {p.tab}
                  </div>
                  <h3 className="mb-1.5 font-display text-[18px] leading-snug">{p.title}</h3>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    {p.short}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
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
            <Link href="/network" className="btn btn-ghost">
              <Building2 size={15} /> Institution network
            </Link>
          </div>
        </div>
      </section>

      {/* Catalogue — intentionally short */}
      <section id="courses" className="border-t py-14" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
        <div className="wrap">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <Reveal className="max-w-[560px]">
              <div className="tab mb-3">Catalogue</div>
              <h2 className="mb-2 text-[26px] leading-[1.12] sm:text-[32px]">
                Featured paths — not an endless scroll
              </h2>
              <p className="text-[15px]" style={{ color: 'var(--ink-soft)' }}>
                A tight sample from the live Mongo catalogue. Browse everything when you are ready.
              </p>
            </Reveal>
            <Link href="/courses" className="btn btn-ghost">
              All courses →
            </Link>
          </div>

          <CourseRow title="Trending now" courses={trending} href="/courses" />
          {mentorLed.length > 0 && (
            <CourseRow title="Mentor-led programs" courses={mentorLed} live href="/courses" />
          )}
        </div>
      </section>

      {/* Ways to learn */}
      <section id="learn" className="py-14 sm:py-16">
        <div className="wrap">
          <Reveal className="mb-8 max-w-[560px]">
            <div className="tab mb-3">Ways to learn</div>
            <h2 className="mb-2 text-[26px] sm:text-[32px]">Three doors. One identity.</h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {WAYS.map((w) => (
              <Link
                key={w.id}
                href={w.href}
                className="rounded-[18px] border p-6 transition-shadow hover:shadow-card"
                style={{ borderColor: 'var(--line)' }}
              >
                <h3 className="mb-2 font-display text-[19px]">{w.title}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  {w.body}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing compact */}
      <section id="pricing" className="border-t py-14" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
        <div className="wrap">
          <Reveal className="mb-8 max-w-[560px]">
            <div className="tab mb-3">Pricing</div>
            <h2 className="mb-2 text-[26px] sm:text-[32px]">Priced for students, not corporations</h2>
          </Reveal>
          <div className="grid items-stretch gap-5 md:grid-cols-3">
            <div className="rounded-[18px] border bg-paper p-6" style={{ borderColor: 'var(--line)' }}>
              <h3 className="font-display text-[18px]">Monthly</h3>
              <div className="mt-3 mb-4 font-display text-[28px] font-semibold">
                1,999 <span className="text-[13px] font-normal" style={{ color: 'var(--ink-soft)' }}>XAF</span>
              </div>
              <Link href="/register" className="btn btn-primary w-full !py-2.5 text-[13px]">Start monthly</Link>
            </div>
            <div className="rounded-[18px] p-6" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
              <div className="mb-1 font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--amber)' }}>Best value</div>
              <h3 className="font-display text-[18px]">Yearly</h3>
              <div className="mt-3 mb-4 font-display text-[28px] font-semibold">
                22,560 <span className="text-[13px] font-normal opacity-70">XAF</span>
              </div>
              <Link href="/register" className="btn btn-amber w-full !py-2.5 text-[13px]">Start yearly</Link>
            </div>
            <div className="rounded-[18px] border bg-paper p-6" style={{ borderColor: 'var(--line)' }}>
              <h3 className="font-display text-[18px]">Single course</h3>
              <div className="mt-3 mb-4 font-display text-[28px] font-semibold">
                From 4,999 <span className="text-[13px] font-normal" style={{ color: 'var(--ink-soft)' }}>XAF</span>
              </div>
              <Link href="/courses" className="btn btn-primary w-full !py-2.5 text-[13px]">Browse courses</Link>
            </div>
          </div>
          <p className="mt-5 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Junior Dev champions get 30% off their first plan —{' '}
            <Link href="/junior-dev" className="underline" style={{ color: 'var(--green-deep)' }}>details</Link>
            {' · '}
            <a href={LOOPING_BINARY.juniorDev} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--green-deep)' }}>
              compete
            </a>
            .
          </p>
        </div>
      </section>

      <Testimonials />

      <section className="py-14">
        <div className="wrap">
          <div
            className="flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[24px] p-8 sm:flex-row sm:items-center sm:p-10"
            style={{ background: 'linear-gradient(135deg, var(--ink) 0%, #0d3d2a 100%)', color: 'var(--paper)' }}
          >
            <div className="max-w-[520px]">
              <div className="mb-2 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: '#9AFFC8' }}>
                <BadgeCheck size={14} /> Education infrastructure
              </div>
              <h2 className="font-display text-[26px] leading-tight sm:text-[32px]">
                Ready to plug into the network?
              </h2>
              <p className="mt-2 text-[14.5px]" style={{ color: 'rgba(251,248,240,0.75)' }}>
                Learners start free tutorials today. Institutions apply. Mentors earn their place.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="btn btn-primary">Create account</Link>
              <Link href="/dashboard/institutions" className="btn btn-ghost" style={{ color: 'var(--paper)', borderColor: 'rgba(251,248,240,0.25)' }}>
                Apply for a campus
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
