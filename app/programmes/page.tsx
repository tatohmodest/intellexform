import Link from 'next/link';
import type { Metadata } from 'next';
import { Check, MessageCircle, Sparkles } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import AdvisorDock from '@/components/landing/AdvisorDock';
import AskAdvisorButton from '@/components/landing/AskAdvisorButton';
import ProgrammeCard, { CATEGORY_TINT } from '@/components/programmes/ProgrammeCard';
import { orientationWhatsappLink } from '@/lib/contact';
import { PROGRAMMES, PROGRAMME_CATEGORIES, priceNumber, type ProgrammeCategory } from '@/lib/programmes';

export const metadata: Metadata = {
  title: 'Programmes - InTelleX',
  description:
    'Instructor-led online programmes in software development, data analysis and cybersecurity. Live classes, mentorship, projects and a certificate. Pay monthly with mobile money.',
};

const CATEGORY_ILLUSTRATION: Record<ProgrammeCategory, string> = {
  software: '/hero_illustration.webp',
  data: '/eco_learning.webp',
  security: '/join_cta.webp',
  foundations: '/way_selfpaced.webp',
};

export default function ProgrammesPage({ searchParams }: { searchParams?: { category?: string } }) {
  const active = PROGRAMME_CATEGORIES.find((c) => c.id === searchParams?.category)?.id as
    | ProgrammeCategory
    | undefined;
  const groups = PROGRAMME_CATEGORIES.filter((c) => !active || c.id === active).map((c) => ({
    ...c,
    items: PROGRAMMES.filter((p) => p.category === c.id),
  }));
  const lowestPrice = Math.min(...PROGRAMMES.map((p) => p.priceXAF));

  return (
    <div className="site">
      <TopNav />

      {/* Hero */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="mx-auto grid max-w-[1360px] overflow-hidden rounded-[32px] lg:grid-cols-[1.1fr_1fr]">
          <div className="bg-[var(--pastel-sky)] px-6 py-12 sm:px-12 sm:py-16 lg:pl-16">
            <div className="text-[13px] font-semibold text-[var(--green-deep)]">Programmes</div>
            <h1 className="mt-3 text-[40px] font-extrabold leading-[1.05] text-[var(--navy)] sm:text-[56px]">
              Serious programmes for serious progress.
            </h1>
            <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-[var(--navy)]/75">
              Each programme is taught live by an InTelleX instructor, with mentorship, real projects and a
              certificate. Investments are shown in full, from {priceNumber(lowestPrice)} XAF.
            </p>
            <ul className="mt-7 grid gap-2.5 text-[15px] text-[var(--navy)] sm:grid-cols-2">
              {['Live classes with your cohort', 'Mentorship and code reviews', 'Portfolio projects', 'Pay monthly with mobile money'].map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--green)] text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <AskAdvisorButton
              question="Help me choose the right InTelleX programme."
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-[15px] font-semibold text-[var(--navy)] shadow-[0_10px_24px_-16px_rgba(18,50,79,0.5)] transition-colors hover:bg-[var(--navy)] hover:text-white"
            >
              <Sparkles size={17} /> Help me choose
            </AskAdvisorButton>
          </div>
          <div className="relative hidden min-h-[380px] bg-[#fdfbf3] lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/way_selfpaced.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <nav
        className="no-scrollbar mx-auto mt-8 flex max-w-[1280px] gap-2 overflow-x-auto px-5 sm:flex-wrap sm:px-8"
        aria-label="Programme categories"
      >
        <Link
          href="/programmes"
          className={`shrink-0 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-colors ${
            !active ? 'bg-[var(--navy)] text-white' : 'bg-[var(--paper-dim)] text-[var(--navy)] hover:bg-[var(--pastel-sky)]'
          }`}
        >
          All <span className="ml-1 opacity-60">{PROGRAMMES.length}</span>
        </Link>
        {PROGRAMME_CATEGORIES.map((c) => (
          <Link
            key={c.id}
            href={`/programmes?category=${c.id}`}
            className={`shrink-0 rounded-full px-5 py-2.5 text-[14px] font-semibold transition-colors ${
              active === c.id ? 'bg-[var(--navy)] text-white' : 'text-[var(--navy)] hover:brightness-95'
            }`}
            style={active === c.id ? undefined : { background: CATEGORY_TINT[c.id] }}
          >
            {c.label}
            <span className="ml-1 opacity-60">{PROGRAMMES.filter((p) => p.category === c.id).length}</span>
          </Link>
        ))}
      </nav>

      {groups.map((g) => (
        <section key={g.id} className="pt-14">
          <div className="wrap !max-w-[1280px]">
            <div className="mb-6 flex items-center gap-5">
              <div className="h-20 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#fdfbf3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={CATEGORY_ILLUSTRATION[g.id]} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div>
                <h2 className="text-[26px] font-bold text-[var(--navy)] sm:text-[30px]">{g.label}</h2>
                <p className="text-[15px] text-[var(--ink-soft)]">{g.blurb}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {g.items.map((p) => (
                <ProgrammeCard key={p.id} programme={p} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="px-3 pb-6 pt-20 sm:px-5">
        <div className="relative mx-auto grid max-w-[1360px] items-center overflow-hidden rounded-[32px] bg-[var(--green)] lg:grid-cols-2">
          <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="relative px-7 py-14 text-white sm:px-14 sm:py-16">
            <h2 className="text-[34px] font-extrabold leading-[1.08] sm:text-[48px]">Not sure where to start?</h2>
            <p className="mt-4 max-w-[440px] text-[17px] leading-relaxed text-white/85">
              Tell us your goal and current level, and we will recommend the right programme.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <AskAdvisorButton className="btn bg-white !px-6 text-[var(--green-deep)] hover:bg-white/90">
                <Sparkles size={17} /> Ask the AI advisor
              </AskAdvisorButton>
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
          <div className="relative hidden h-full min-h-[380px] bg-[#fdfbf3] lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero_mentor.webp" alt="" className="absolute inset-0 h-full w-full object-cover object-[65%_50%]" loading="lazy" />
          </div>
        </div>
      </section>

      <Footer />
      <AdvisorDock />
    </div>
  );
}
