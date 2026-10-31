import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Clock,
  Gauge,
  Laptop,
  MessageCircle,
  Sparkles,
  Video,
} from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import AdvisorDock from '@/components/landing/AdvisorDock';
import AskAdvisorButton from '@/components/landing/AskAdvisorButton';
import ProgrammeCard, { CATEGORY_TINT } from '@/components/programmes/ProgrammeCard';
import { buildWhatsappLink } from '@/lib/whatsapp';
import {
  DELIVERY,
  ENROL_STEPS,
  PROGRAMMES,
  PROGRAMME_FAQ,
  dailyXaf,
  enrolHref,
  getProgramme,
  priceNumber,
  type ProgrammeCategory,
} from '@/lib/programmes';

const CATEGORY_ILLUSTRATION: Record<ProgrammeCategory, string> = {
  software: '/hero_illustration.webp',
  data: '/eco_learning.webp',
  security: '/join_cta.webp',
  foundations: '/way_selfpaced.webp',
};

const DELIVERY_LOOK: Record<string, { bg: string; image: string }> = {
  live: { bg: 'var(--pastel-sky)', image: '/way_live.webp' },
  mentorship: { bg: 'var(--pastel-mint)', image: '/hero_mentor.webp' },
  materials: { bg: 'var(--pastel-butter)', image: '/way_selfpaced.webp' },
  projects: { bg: 'var(--pastel-lilac)', image: '/hero_illustration.webp' },
};

export function generateStaticParams() {
  return PROGRAMMES.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = getProgramme(params.id);
  if (!p) return { title: 'Programme not found - InTelleX' };
  return {
    title: `${p.title} - InTelleX programme`,
    description: `${p.description} ${p.duration}, ${p.level}. ${priceNumber(p.priceXAF)} XAF.`,
  };
}

export default function ProgrammePage({ params }: { params: { id: string } }) {
  const p = getProgramme(params.id);
  if (!p) notFound();

  const related = PROGRAMMES.filter((o) => o.category === p.category && o.id !== p.id).slice(0, 3);
  const months = parseInt(p.duration, 10);
  const monthlyTotal = p.monthlyXAF && p.duration.includes('month') ? p.monthlyXAF * months : null;
  const askLink = buildWhatsappLink(`Hello InTelleX! I have a question about the ${p.title} programme.`);
  const tint = CATEGORY_TINT[p.category];

  const facts = [
    { icon: Clock, label: 'Duration', value: p.duration },
    { icon: Gauge, label: 'Level', value: p.level },
    { icon: Video, label: 'Format', value: p.format },
    { icon: BadgeCheck, label: 'Certificate', value: 'On completion' },
  ];

  return (
    <div className="site">
      <TopNav />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="mx-auto grid max-w-[1360px] overflow-hidden rounded-[32px] lg:grid-cols-[1.15fr_1fr]">
          <div className="px-6 py-10 sm:px-12 sm:py-14 lg:pl-16" style={{ background: tint }}>
            <Link
              href="/programmes"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3.5 py-1.5 text-[13px] font-semibold text-[var(--navy)] hover:bg-white"
            >
              <ArrowLeft size={14} /> All programmes
            </Link>
            <div className="mt-7 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.logoUrl} alt="" className="h-7 w-7 object-contain" />
              </span>
              <span className="text-[14px] font-semibold text-[var(--green-deep)]">{p.categoryLabel}</span>
            </div>
            <h1 className="mt-5 text-[38px] font-extrabold leading-[1.05] text-[var(--navy)] sm:text-[54px]">{p.title}</h1>
            <p className="mt-5 max-w-[600px] text-[17px] leading-relaxed text-[var(--navy)]/75">{p.description}</p>

            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label} className="rounded-2xl bg-white/75 p-3.5">
                  <dt className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--navy)]/60">
                    <f.icon size={13} /> {f.label}
                  </dt>
                  <dd className="mt-1 text-[14px] font-bold leading-snug text-[var(--navy)]">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={enrolHref(p)} className="btn btn-primary !px-6">
                Start my enrolment <ArrowRight size={16} />
              </Link>
              <AskAdvisorButton
                question={`Is the ${p.title} programme right for me?`}
                className="btn !px-6 bg-white text-[var(--navy)] hover:bg-white/80"
              >
                <Sparkles size={16} /> Is it right for me?
              </AskAdvisorButton>
            </div>
          </div>
          <div className="relative hidden min-h-[420px] bg-[#fdfbf3] lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CATEGORY_ILLUSTRATION[p.category]}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[70%_50%]"
            />
          </div>
        </div>
      </section>

      {/* ── Body + investment panel ─────────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="wrap !max-w-[1280px]">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
            <div className="flex flex-col gap-16">
              <div>
                <h2 className="text-[28px] font-bold text-[var(--navy)] sm:text-[34px]">What you will be able to do</h2>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-3 rounded-2xl p-4 text-[15px] text-[var(--navy)]" style={{ background: tint }}>
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--green)] text-white">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-[28px] font-bold text-[var(--navy)] sm:text-[34px]">Curriculum</h2>
                <p className="mt-2 text-[15px] text-[var(--ink-soft)]">The tools and topics this programme covers.</p>
                <ol className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {p.technologies.map((t, i) => (
                    <li key={t} className="flex items-center gap-4 rounded-2xl bg-[var(--paper-dim)] px-4 py-3.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[13px] font-bold text-[var(--green-deep)]">
                        {i + 1}
                      </span>
                      <span className="text-[15.5px] font-semibold text-[var(--navy)]">{t}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h2 className="text-[28px] font-bold text-[var(--navy)] sm:text-[34px]">How you will learn</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {DELIVERY.filter((d) => !p.short || d.id !== 'mentorship').map((d) => {
                    const look = DELIVERY_LOOK[d.id];
                    return (
                      <div key={d.id} className="overflow-hidden rounded-[24px]" style={{ background: look.bg }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={look.image} alt="" className="illo aspect-[16/9] w-full object-cover" loading="lazy" />
                        <div className="p-5 pt-3">
                          <h3 className="text-[17px] font-bold text-[var(--navy)]">{d.title}</h3>
                          <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--navy)]/70">{d.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-[var(--pastel-butter)] p-6">
                  <h2 className="text-[20px] font-bold text-[var(--navy)]">Prerequisites</h2>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[var(--navy)]/75">{p.prerequisites}</p>
                </div>
                <div className="rounded-[24px] bg-[var(--pastel-lilac)] p-6">
                  <h2 className="text-[20px] font-bold text-[var(--navy)]">What you need</h2>
                  <ul className="mt-2.5 flex flex-col gap-2 text-[15px] text-[var(--navy)]/75">
                    {p.equipment.map((e) => (
                      <li key={e} className="flex gap-2.5">
                        <Laptop size={17} className="mt-0.5 shrink-0" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid items-center gap-6 rounded-[28px] bg-[var(--pastel-sky)] p-6 sm:p-8 md:grid-cols-[1fr_260px]">
                <div>
                  <h2 className="text-[28px] font-bold text-[var(--navy)] sm:text-[32px]">How enrolment works</h2>
                  <ol className="mt-6 flex flex-col gap-4">
                    {ENROL_STEPS.map((s, i) => (
                      <li key={s.title} className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[14px] font-bold text-[var(--navy)]">
                          {i + 1}
                        </span>
                        <div>
                          <h3 className="text-[16px] font-bold text-[var(--navy)]">{s.title}</h3>
                          <p className="mt-0.5 text-[14px] leading-relaxed text-[var(--navy)]/70">{s.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/join_cta.webp" alt="" className="illo hidden w-full md:block" loading="lazy" />
              </div>

              <div>
                <h2 className="text-[28px] font-bold text-[var(--navy)] sm:text-[34px]">Questions</h2>
                <div className="mt-5 flex flex-col gap-2.5">
                  {PROGRAMME_FAQ.map((f) => (
                    <details key={f.q} className="group rounded-2xl bg-[var(--paper-dim)] px-5 py-4 open:bg-[var(--pastel-mint)]">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] font-bold text-[var(--navy)]">
                        {f.q}
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[18px] leading-none transition-transform group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-[14.5px] leading-relaxed text-[var(--navy)]/75">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            {/* Investment panel */}
            <aside>
              <div className="rounded-[28px] bg-[var(--pastel-sky)] p-7 text-[var(--navy)] lg:sticky lg:top-24">
                <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--green-deep)]">
                  Your investment
                </div>
                <div className="mt-1 font-display text-[40px] font-extrabold leading-none">
                  {priceNumber(p.priceXAF)} <span className="text-[16px] font-semibold">XAF</span>
                </div>
                {p.monthlyXAF && (
                  <p className="mt-2 text-[14px] text-[var(--navy)]/75">
                    or {priceNumber(p.monthlyXAF)} XAF / month
                    {monthlyTotal ? ` for ${months} months` : ''}
                    <span className="mt-1 block text-[var(--navy)]/60">
                      That is about {priceNumber(dailyXaf(p.monthlyXAF))} XAF a day.
                    </span>
                    {monthlyTotal && monthlyTotal > p.priceXAF && (
                      <span className="mt-2 inline-block rounded-full bg-[var(--green)] px-3 py-1 text-[12.5px] font-semibold text-white">
                        Pay in full and save {priceNumber(monthlyTotal - p.priceXAF)} XAF
                      </span>
                    )}
                  </p>
                )}
                <div className="mt-6 rounded-2xl bg-white p-4">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--navy)]/60">What it unlocks</div>
                  <ul className="mt-3 flex flex-col gap-2 text-[14px]">
                    {[
                      'Live classes with your instructor',
                      p.short ? 'Guided exercises and materials' : 'Mentorship and code reviews',
                      'Real projects for your portfolio',
                      'An InTelleX certificate',
                      'A skill you can earn with: a job, freelancing or your own product',
                    ].map((u) => (
                      <li key={u} className="flex gap-2.5">
                        <Check size={16} className="mt-0.5 shrink-0 text-[var(--green-deep)]" />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
                <ul className="mt-6 flex flex-col gap-3 text-[14px] text-[var(--navy)]/80">
                  <li className="flex justify-between gap-4">
                    <span>Registration fee</span>
                    <span className="font-semibold text-[var(--navy)]">{priceNumber(p.registrationFee)} XAF</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span>Payment</span>
                    <span className="text-right font-semibold text-[var(--navy)]">MoMo · Orange Money · Card</span>
                  </li>
                </ul>
                <Link href={enrolHref(p)} className="btn btn-primary mt-7 w-full">
                  Start my enrolment <ArrowRight size={17} />
                </Link>
                <a
                  href={askLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn mt-3 w-full bg-white text-[var(--navy)] hover:bg-white/80"
                >
                  <MessageCircle size={17} /> Ask a question
                </a>
                <p className="mt-5 text-[12.5px] leading-relaxed text-[var(--navy)]/60">
                  We confirm your cohort start date and schedule on WhatsApp before you pay.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="pb-16">
          <div className="wrap !max-w-[1280px]">
            <h2 className="mb-6 text-[28px] font-bold text-[var(--navy)] sm:text-[34px]">Related programmes</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <ProgrammeCard key={r.id} programme={r} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-3 pb-6 sm:px-5">
        <div className="relative mx-auto grid max-w-[1360px] items-center overflow-hidden rounded-[32px] bg-[var(--green)] lg:grid-cols-2">
          <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
          <div className="relative px-7 py-14 text-white sm:px-14 sm:py-16">
            <h2 className="text-[34px] font-extrabold leading-[1.08] sm:text-[48px]">Ready to start {p.shortTitle}?</h2>
            <p className="mt-4 max-w-[440px] text-[17px] leading-relaxed text-white/85">
              Send your enrolment request and we will confirm your cohort and schedule on WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={enrolHref(p)} className="btn bg-white !px-6 text-[var(--green-deep)] hover:bg-white/90">
                Start my enrolment <ArrowRight size={17} />
              </Link>
              <a
                href={askLink}
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
            <img src="/hero_career.webp" alt="" className="absolute inset-0 h-full w-full object-cover object-[70%_50%]" loading="lazy" />
          </div>
        </div>
      </section>

      <Footer />
      <AdvisorDock />
    </div>
  );
}
