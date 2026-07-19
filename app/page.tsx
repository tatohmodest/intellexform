import Link from 'next/link';
import { Sparkles, Gauge, Compass, Globe, Video, BadgeCheck } from 'lucide-react';
import { getAllCourses } from '@/lib/repo';
import { formatXAF } from '@/lib/format';
import TopNav from '@/components/landing/TopNav';
import Rail from '@/components/landing/Rail';
import Footer from '@/components/landing/Footer';
import ContactForm from '@/components/landing/ContactForm';
import Testimonials from '@/components/landing/Testimonials';
import CourseCard from '@/components/CourseCard';
import CourseRow from '@/components/CourseRow';
import Reveal from '@/components/Reveal';
import HeroCard from '@/components/landing/HeroCard';

export const dynamic = 'force-dynamic';

const FIELDS = [
  { label: 'Full-Stack Web Development', core: true },
  { label: 'MERN Stack', core: true },
  { label: 'PERN Stack', core: true },
  { label: 'Web Dev Fundamentals', core: false },
  { label: 'Python', core: false },
  { label: 'JavaScript', core: false },
  { label: 'Java', core: false },
  { label: 'Data Analysis & Data Science', core: false },
  { label: 'Machine Learning', core: false },
  { label: 'Cybersecurity', core: false },
  { label: 'Digital Marketing', core: false },
  { label: 'Branding', core: false },
];

const WAYS = [
  {
    letter: 'A',
    title: 'Self-paced courses',
    body: 'Recorded courses you work through on your own time, in any field we cover. Finish a course and you get a certificate , it just proves you did the work.',
    tag: 'Included in every subscription',
  },
  {
    letter: 'B',
    title: 'Live tutoring',
    body: 'A mentor teaches you directly , online from anywhere, or onsite at a location you choose. Best for people who need a real person keeping them accountable.',
    tag: 'Priced per mentor & format',
  },
  {
    letter: 'C',
    title: 'AI Tutor',
    body: 'We take a real book , say, Python Crash Course , and train an AI on it that teaches like the author would, step by step, level by level. Unlock levels as you go, or all at once.',
    tag: 'Pay per level, or pay once',
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

  // Live / mentor-led = the flagship Intellex programs (not self-paced, not the cohort).
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

  return (
    <>
      <Rail />
      <TopNav />

      {/* HERO */}
      <header className="pb-14 pt-16 lg:pb-28">
        <div className="wrap grid items-center gap-10 sm:gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal direction="right">
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.1em]" style={{ color: 'var(--green-deep)' }}>
              <span style={{ width: 18, height: 1, background: 'var(--green-deep)' }} /> Skills to income, at your own pace
            </div>
            <h1 className="mb-5 font-display text-[30px] leading-[1.1] sm:text-[52px] sm:leading-[1.04]">
              A course is only the <em className="not-italic text-green-deep" style={{ fontStyle: 'italic' }}>first chapter.</em>
              <br />
              Learning is the rest of the book.
            </h1>
            <p className="mb-7 max-w-[480px] text-[18px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Intellex is where you actually finish what you start , self-paced courses, live mentors, and
              an AI tutor that studies a book so it can teach it to you, one level at a time.
            </p>
            <div className="mb-9 flex flex-wrap gap-3.5">
              <a href="#pricing" className="btn btn-primary">See pricing</a>
              <a href="#learn" className="btn btn-ghost">How it works</a>
            </div>
            <div className="flex flex-wrap gap-6 border-t pt-6 sm:gap-9" style={{ borderColor: 'var(--line)' }}>
              {[
                { num: '360+', label: 'Learners' },
                { num: '12', label: 'Fields covered' },
                { num: '90+', label: 'Courses' },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-display text-[26px] font-semibold">{s.num}</div>
                  <div className="text-xs uppercase tracking-[0.06em]" style={{ color: 'var(--ink-soft)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Hero visual: real learner photo with the live AI-tutor card floating over it */}
          <Reveal direction="left" delay={0.15} className="relative">
            <div className="overflow-hidden rounded-[24px] border shadow-book" style={{ borderColor: 'var(--line)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero_learner.webp"
                alt="An Intellex learner building her future"
                className="aspect-[4/5] h-full w-full object-cover"
              />
            </div>
            <div className="mt-5 lg:absolute lg:-bottom-8 lg:-left-8 lg:mt-0 lg:w-[290px] lg:z-10">
              <HeroCard />
            </div>
          </Reveal>
        </div>
      </header>

      {/* TRUST */}
      <div className="border-y py-8" style={{ borderColor: 'var(--line)' }}>
        <div className="wrap flex flex-wrap items-center justify-between gap-7">
          <p className="max-w-[280px] text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Built by Looping Binary , the same team behind Junior Dev and client software across Web Dev,
            Data, and Cybersecurity.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {['MTN MoMo', 'Orange Money', 'Certificate on completion', 'Cameroon-built'].map((p) => (
              <span key={p} className="pill">{p}</span>
            ))}
          </div>
        </div>
      </div>

      {/* WAYS TO LEARN */}
      <section id="learn" className="py-16 sm:py-24">
        <div className="wrap">
          <Reveal className="mb-12 max-w-[600px]">
            <div className="tab mb-4">Ways to learn</div>
            <h2 className="mb-3.5 text-[27px] leading-[1.15] sm:text-[38px] sm:leading-[1.12]">Three ways in, one certificate out</h2>
            <p className="text-base" style={{ color: 'var(--ink-soft)' }}>
              Pick the format that matches how you actually learn , or mix all three as you go.
            </p>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {WAYS.map((w) => (
              <div
                key={w.letter}
                className="flex flex-col gap-3.5 rounded-[18px] border p-7"
                style={{ background: 'var(--paper-dim)', borderColor: 'var(--line)' }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl font-display text-lg" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
                  {w.letter}
                </div>
                <h3 className="font-display text-xl">{w.title}</h3>
                <p className="text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{w.body}</p>
                <div className="mt-auto font-mono text-xs" style={{ color: 'var(--green-deep)' }}>{w.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FIELDS */}
      <section id="fields" className="py-16 sm:py-24" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
        <div className="wrap">
          <Reveal className="mb-12 max-w-[600px]">
            <div className="tab mb-4" style={{ background: 'rgba(74,144,226,0.18)', color: '#8fc0ff' }}>Fields</div>
            <h2 className="mb-3.5 text-[27px] leading-[1.15] sm:text-[38px] sm:leading-[1.12]">Whatever field you&apos;re chasing, it&apos;s in here</h2>
            <p className="text-base" style={{ color: 'rgba(251,248,240,0.72)' }}>
              Full stacks, single languages, or one specific skill , you&apos;re not boxed into one path.
            </p>
          </Reveal>
          <div className="mb-9 flex flex-wrap gap-3">
            {FIELDS.map((f) => (
              <div
                key={f.label}
                className="rounded-full px-4.5 py-2.5 text-sm"
                style={{
                  border: `1px solid ${f.core ? 'var(--green-deep)' : 'rgba(251,248,240,0.22)'}`,
                  background: f.core ? 'var(--green-deep)' : 'rgba(251,248,240,0.04)',
                  fontWeight: f.core ? 600 : 400,
                  padding: '11px 18px',
                }}
              >
                {f.label}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-5 border-t pt-6" style={{ borderColor: 'rgba(251,248,240,0.18)' }}>
            <p className="max-w-[520px] text-base">
              Not sure which of these gets you where you want to go? Tell us your goal and we&apos;ll point
              you to the right course, mentor, or AI tutor track.
            </p>
            <a href="#register" className="btn btn-amber">Help me choose</a>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="py-16 sm:py-24">
        <div className="wrap">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <Reveal className="max-w-[640px]">
              <div className="tab mb-4">The academy</div>
              <h2 className="mb-3.5 text-[27px] leading-[1.15] sm:text-[38px] sm:leading-[1.12]">
                A world-class catalogue, <span className="text-gradient">live</span> and on-demand
              </h2>
              <p className="text-base" style={{ color: 'var(--ink-soft)' }}>
                Live, mentor-led programs and 100+ self-paced courses — from web development to AI,
                cybersecurity and design. Learn from anywhere in the world, at your pace or ours.
              </p>
            </Reveal>
            <Link href="/courses" className="btn btn-ghost">Browse all courses →</Link>
          </div>

          {/* Trust strip */}
          <div className="mb-12 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { icon: Video, label: 'Live & mentor-led programs' },
              { icon: Globe, label: 'Learners across Cameroon & beyond' },
              { icon: BadgeCheck, label: 'Certificate on completion' },
            ].map((t) => (
              <span key={t.label} className="inline-flex items-center gap-2 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                <t.icon size={16} style={{ color: 'var(--green-deep)' }} /> {t.label}
              </span>
            ))}
          </div>

          {/* Academy-style scrollable rows */}
          <CourseRow
            title="Live & mentor-led programs"
            subtitle="Flagship Intellex programs with real mentors — online or onsite."
            courses={mentorLed}
            live
            href="/courses"
          />
          <CourseRow title="Trending on Intellex" subtitle="What learners are picking up right now." courses={trending} href="/courses" />
          <CourseRow title="Web development" subtitle="From first web page to full-stack apps." courses={webDev} href="/courses" />
          <CourseRow title="Data, AI & Machine Learning" subtitle="The skills every field is hiring for." courses={dataAI} href="/courses" />
          <CourseRow title="Cybersecurity" subtitle="Think like an attacker, defend like a pro." courses={security} href="/courses" />
          <CourseRow title="Design & Marketing" subtitle="Make it look good and get it seen." courses={designMkt} href="/courses" />
          <CourseRow title="Programming & DevOps" subtitle="Languages, tools and the craft of shipping." courses={devProg} href="/courses" />

          {/* SPECIAL PROGRAM */}
          {special && (
            <div
              className="relative mt-10 overflow-hidden rounded-[24px] p-6 sm:mt-14 sm:p-11"
              style={{ background: 'linear-gradient(135deg, var(--green), #007a48)', color: '#fff' }}
            >
              <div className="relative grid items-center gap-9 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <div className="mb-3.5 font-mono text-[11.5px] uppercase tracking-[0.1em]" style={{ color: '#ffffff' }}>
                    Special program · Cohort-based
                  </div>
                  <h3 className="mb-3 font-display text-[22px] leading-[1.2] sm:text-[28px]">
                    Build a real full-stack app in 3 weeks, coding alongside Claude Code &amp; Cursor AI
                  </h3>
                  <p className="mb-5 max-w-[480px] text-[14.5px] leading-relaxed" style={{ color: 'rgba(251,248,240,0.82)' }}>
                    Not a theory course. You ship a working, deployed full-stack application in three weeks,
                    using AI coding tools the way working developers do , as a pair-programmer, not a crutch.
                  </p>
                  <ul className="mb-0 flex flex-col gap-2">
                    {special.whatYouWillLearn.slice(0, 3).map((p) => (
                      <li key={p} className="relative pl-5 text-[13.5px]" style={{ color: 'rgba(255,255,255,0.92)' }}>
                        <span className="absolute left-0" style={{ color: '#ffffff' }}>,</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-[18px] border p-6" style={{ background: 'rgba(251,248,240,0.08)', borderColor: 'rgba(251,248,240,0.18)' }}>
                  <div className="mb-4 flex flex-wrap gap-2">
                    {['Claude Code', 'Cursor AI', 'Full-Stack', '3 weeks'].map((s) => (
                      <span key={s} className="rounded-full px-2.5 py-1 font-mono text-[10.5px]" style={{ background: 'rgba(251,248,240,0.12)' }}>{s}</span>
                    ))}
                  </div>
                  <div className="font-mono text-[13px] line-through opacity-60">{formatXAF(special.originalPrice)}</div>
                  <div className="my-1 mb-5 flex items-baseline gap-1.5">
                    <span className="font-display text-[32px] font-semibold">{formatXAF(special.currentPrice)}</span>
                    <span className="text-[12.5px]" style={{ color: 'rgba(251,248,240,0.7)' }}>/ cohort</span>
                  </div>
                  <Link href={`/courses/${special.slug}`} className="btn btn-light w-full">Reserve my seat</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SPECIAL SELF-PACED */}
      <section id="self-paced" className="py-16 sm:py-24" style={{ background: 'var(--paper-dim)' }}>
        <div className="wrap">
          <Reveal className="mb-10 max-w-[640px]">
            <div className="tab mb-4">Special · Self-paced</div>
            <h2 className="mb-3.5 text-[27px] leading-[1.15] sm:text-[38px] sm:leading-[1.12]">
              In-demand skills you can learn <span className="text-gradient">fast</span>
            </h2>
            <p className="text-base" style={{ color: 'var(--ink-soft)' }}>
              These aren&apos;t just courses you scroll past. We hand-pick the right one for your goal,
              monitor your progress, and give you step-by-step guides so you actually finish. Every
              special self-paced course starts from <strong>{formatXAF(50000)}</strong>.
            </p>
          </Reveal>

          {/* Why they're special */}
          <div className="mb-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: Sparkles, title: 'Hand-picked for you', body: 'Tell us your goal , we choose the exact course and path that gets you there, no guesswork.' },
              { icon: Gauge, title: 'Progress monitored', body: 'We keep an eye on how you\u2019re moving through it and nudge you so you never stall out.' },
              { icon: Compass, title: 'Guided step-by-step', body: 'Checklists, guides and resources at every step , help is there the moment you get stuck.' },
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

          {/* The courses */}
          <div className="mb-6 flex items-center gap-3">
            <div className="tab">Pick your track · from {formatXAF(50000)}</div>
            <div className="h-px flex-1" style={{ background: 'var(--line)' }} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {selfPaced.map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/courses" className="btn btn-ghost">See all courses →</Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 sm:py-24" style={{ background: 'var(--paper)' }}>
        <div className="wrap">
          <Reveal className="mb-12 max-w-[600px]">
            <div className="tab mb-4">Pricing</div>
            <h2 className="mb-3.5 text-[27px] leading-[1.15] sm:text-[38px] sm:leading-[1.12]">Priced for students, not corporations</h2>
            <p className="text-base" style={{ color: 'var(--ink-soft)' }}>
              We tried higher prices before this. This is the number that actually gets used.
            </p>
          </Reveal>
          <div className="grid items-stretch gap-6 md:grid-cols-3">
            {/* Monthly */}
            <div className="flex flex-col rounded-[20px] border bg-paper p-8" style={{ borderColor: 'var(--line)' }}>
              <h3 className="mb-1.5 font-display text-[19px]">Monthly</h3>
              <div className="mb-5 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>Full access to every self-paced course, in every field, for as long as you&apos;re subscribed.</div>
              <div className="mb-5 flex items-baseline gap-1.5">
                <span className="font-display text-[26px] sm:text-[34px] font-semibold">1,999</span>
                <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>XAF / month</span>
              </div>
              <ul className="mb-6 flex flex-col gap-2.5 text-sm">
                {['Every self-paced course, every field', 'Certificate after each course', 'Cancel or pause anytime'].map((li) => (
                  <li key={li} className="relative pl-5"><span className="absolute left-0" style={{ color: 'var(--green-deep)' }}>,</span>{li}</li>
                ))}
              </ul>
              <a href="#register" className="btn btn-primary mt-auto">Start monthly</a>
            </div>
            {/* Yearly featured */}
            <div className="relative flex flex-col rounded-[20px] p-8" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
              <span className="absolute -top-3 right-6 rounded-full px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em]" style={{ background: 'var(--amber)', color: 'var(--ink)' }}>Best value</span>
              <h3 className="mb-1.5 font-display text-[19px]">Yearly</h3>
              <div className="mb-5 text-[13.5px]" style={{ color: 'rgba(251,248,240,0.7)' }}>Same access as monthly, paid once a year , 6% cheaper than paying month to month.</div>
              <div className="font-mono text-[14px] line-through opacity-55">24,000 XAF</div>
              <div className="mb-5 mt-1.5 flex items-baseline gap-1.5">
                <span className="font-display text-[26px] sm:text-[34px] font-semibold">22,560</span>
                <span className="text-[13px]" style={{ color: 'rgba(251,248,240,0.7)' }}>XAF / year</span>
              </div>
              <ul className="mb-6 flex flex-col gap-2.5 text-sm">
                {['Everything in Monthly', '6% off the monthly rate', 'One payment, no renewals to track'].map((li) => (
                  <li key={li} className="relative pl-5"><span className="absolute left-0" style={{ color: 'var(--amber)' }}>,</span>{li}</li>
                ))}
              </ul>
              <a href="#register" className="btn btn-amber mt-auto">Start yearly</a>
            </div>
            {/* Single */}
            <div className="flex flex-col rounded-[20px] border bg-paper p-8" style={{ borderColor: 'var(--line)' }}>
              <h3 className="mb-1.5 font-display text-[19px]">Single courses</h3>
              <div className="mb-5 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>No subscription. Buy one course outright and keep it.</div>
              <div className="mb-5 flex items-baseline gap-1.5">
                <span className="font-display text-[26px] sm:text-[34px] font-semibold">From 4,999</span>
                <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>XAF / course</span>
              </div>
              <ul className="mb-6 flex flex-col gap-2.5 text-sm">
                {['Lifetime access to that course', 'Certificate on completion', 'Good for one specific skill'].map((li) => (
                  <li key={li} className="relative pl-5"><span className="absolute left-0" style={{ color: 'var(--green-deep)' }}>,</span>{li}</li>
                ))}
              </ul>
              <Link href="/courses" className="btn btn-primary mt-auto">Browse courses</Link>
            </div>
          </div>

          <div id="discounts" className="mt-6 grid gap-5 md:grid-cols-2">
            {[
              { pct: '6%', title: 'Pay yearly, not monthly', body: 'Commit for a year up front and the price drops from 24,000 to 22,560 XAF automatically.' },
              { pct: '30%', title: 'Win the Junior Dev tournament', body: 'Junior Dev champions get 30% off their first Intellex plan , one more reason to compete.' },
            ].map((d) => (
              <div key={d.title} className="flex items-start gap-4 rounded-[16px] p-6" style={{ border: '1px dashed var(--green-deep)', background: 'rgba(0,179,105,0.06)' }}>
                <div className="font-display text-[26px]" style={{ color: 'var(--green-deep)' }}>{d.pct}</div>
                <div>
                  <h4 className="mb-1 text-[15px] font-semibold">{d.title}</h4>
                  <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>{d.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE TUTORING */}
      <section className="py-16 sm:py-24">
        <div className="wrap grid items-center gap-10 sm:gap-14 lg:grid-cols-2">
          <div>
            <div className="tab mb-4">Live Tutoring</div>
            <h2 className="mb-3.5 text-[26px] sm:text-[34px]">Sometimes you need a person, not a playlist</h2>
            <p className="mb-6 text-base leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Mentors teach live, one-on-one or in small groups, in any field we cover. You choose the format.
            </p>
            <div className="mb-6 flex gap-2.5">
              <div className="flex-1 rounded-[14px] border p-[18px]" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
                <h4 className="mb-1.5 font-display text-[15px]">Online</h4>
                <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>Sessions over video call, on your schedule. Lower cost, same mentor quality.</p>
              </div>
              <div className="flex-1 rounded-[14px] border p-[18px]" style={{ borderColor: 'var(--line)', background: 'var(--amber-soft)' }}>
                <h4 className="mb-1.5 font-display text-[15px]">Onsite</h4>
                <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>Mentor comes to a location you choose. Costs more, but nothing beats in-person.</p>
              </div>
            </div>
            <a href="#register" className="btn btn-ghost">Get a quote for your subject</a>
          </div>
          <div className="rounded-[20px] p-7" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
            <div className="mb-5 overflow-hidden rounded-[14px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/mentor_session.webp" alt="An Intellex mentor guiding a student through a live session" className="aspect-[16/10] w-full object-cover" />
            </div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] font-display" style={{ background: 'var(--green-deep)' }}>M</div>
              <div>
                <div className="text-[14.5px] font-semibold">Mentor-led session</div>
                <div className="text-xs" style={{ color: 'rgba(251,248,240,0.6)' }}>Full-Stack Web Development</div>
              </div>
            </div>
            <div className="mb-2.5 rounded-[12px] px-4 py-3.5 text-[13.5px] leading-relaxed" style={{ background: 'rgba(251,248,240,0.06)' }}>
              &ldquo;Let&apos;s start with how your React state actually re-renders , bring your last project and we&apos;ll debug it live.&rdquo;
            </div>
            <div className="rounded-[12px] px-4 py-3.5 text-[13.5px] leading-relaxed" style={{ background: 'rgba(251,248,240,0.06)' }}>
              Onsite sessions are priced per mentor, subject, and distance. Tell us where you are and what you want to learn.
            </div>
          </div>
        </div>
      </section>

      {/* AI TUTOR */}
      <section id="ai" className="py-16 sm:py-24" style={{ background: 'var(--paper-dim)' }}>
        <div className="wrap">
          <Reveal className="mb-12 max-w-[600px]">
            <div className="tab mb-4">AI Tutor</div>
            <h2 className="mb-3.5 text-[27px] leading-[1.15] sm:text-[38px] sm:leading-[1.12]">We teach the AI the book, so it can teach you</h2>
            <p className="text-base" style={{ color: 'var(--ink-soft)' }}>
              Take a real textbook , Python Crash Course, for example. We give the AI the full book and it
              teaches you in that author&apos;s voice, level by level.
            </p>
          </Reveal>
          <div className="flex flex-col gap-4">
            <div className="rounded-[14px] border bg-paper p-[22px]" style={{ borderColor: 'var(--line)' }}>
              <h4 className="mb-1.5 flex items-center gap-2 font-display text-[16px]">
                Pay as you go <span className="rounded-full px-2 py-0.5 font-mono text-[10.5px] uppercase" style={{ background: 'var(--green-deep)', color: 'var(--paper)' }}>Level by level</span>
              </h4>
              <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>Pay for one level at a time. Finish it, unlock the next. Go slow and only pay for what you&apos;re using right now.</p>
            </div>
            <div className="rounded-[14px] border bg-paper p-[22px]" style={{ borderColor: 'var(--line)' }}>
              <h4 className="mb-1.5 flex items-center gap-2 font-display text-[16px]">
                Pay once <span className="rounded-full px-2 py-0.5 font-mono text-[10.5px] uppercase" style={{ background: 'var(--green-deep)', color: 'var(--paper)' }}>Everything, now</span>
              </h4>
              <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>Unlock every level of that course immediately with one payment and move at whatever speed you want.</p>
            </div>
          </div>
        </div>
      </section>

      {/* JUNIOR DEV */}
      <section className="px-6 pb-24 pt-6">
        <div className="mx-auto max-w-[1140px] rounded-[24px] p-7 sm:p-12" style={{ background: 'var(--green-deep)', color: 'var(--paper)' }}>
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div>
              <h3 className="max-w-[520px] font-display text-[22px] sm:text-[26px]">Already in Junior Dev? Your discount is already earned.</h3>
              <p className="mt-2 max-w-[480px] text-[14.5px]" style={{ color: 'rgba(251,248,240,0.82)' }}>
                Junior Dev isn&apos;t separate from Intellex , Builder tier and above already includes Intellex
                course access, and tournament winners get 30% off on top of that.
              </p>
            </div>
            <a href="#register" className="btn btn-light">Check my tier</a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* REGISTER */}
      <section id="register" className="py-16 sm:py-24">
        <div className="wrap grid gap-10 sm:gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <div className="tab mb-4">Register</div>
            <h2 className="mb-3.5 text-[26px] sm:text-[34px]">Pick a plan, tell us how to reach you</h2>
            <p className="text-base leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Fill this in and we&apos;ll follow up on WhatsApp with payment details for MTN MoMo or Orange
              Money, and get your account set up. Your choices are saved and sent straight to us.
            </p>
            <div className="mt-4.5 flex flex-wrap gap-2.5" style={{ marginTop: 18 }}>
              {['MTN MoMo', 'Orange Money', 'Flutterwave (card)'].map((p) => (
                <span key={p} className="pill">{p}</span>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
