import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Clock,
  Download,
  Gauge,
  Laptop,
  MessageCircle,
  Sparkles,
  Video,
} from 'lucide-react';
import { getProgrammeModules } from '@/lib/programmeCurricula';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import AdvisorDock from '@/components/landing/AdvisorDock';
import AskAdvisorButton from '@/components/landing/AskAdvisorButton';
import ProgrammeCard from '@/components/programmes/ProgrammeCard';
import Doodle, { CATEGORY_DOODLE } from '@/components/landing/Doodle';
import { buildWhatsappLink } from '@/lib/whatsapp';
import { getRequestLocale } from '@/lib/i18n/server';
import { translateUiText } from '@/lib/i18n/translate';
import {
  DELIVERY,
  ENROL_STEPS,
  PROGRAMMES,
  PROGRAMME_FAQ,
  dailyXaf,
  enrolHref,
  getProgramme,
  priceNumber,
} from '@/lib/programmes';

const DELIVERY_DOODLE: Record<string, string> = {
  live: 'sittingreading',
  mentorship: 'loving',
  materials: 'reading',
  projects: 'unboxing',
};

export function generateStaticParams() {
  return PROGRAMMES.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = getProgramme(params.id);
  const locale = getRequestLocale();
  const tr = (text: string) => translateUiText(text, locale);
  if (!p) return { title: locale === 'fr' ? 'Programme introuvable - InTelleX' : 'Programme not found - InTelleX' };
  return {
    title: locale === 'fr' ? `${tr(p.title)} - programme InTelleX` : `${p.title} - InTelleX programme`,
    description: `${tr(p.description)} ${tr(p.duration)}, ${tr(p.level)}. ${priceNumber(p.priceXAF)} XAF.`,
  };
}

export default function ProgrammePage({ params }: { params: { id: string } }) {
  const p = getProgramme(params.id);
  if (!p) notFound();

  const related = PROGRAMMES.filter((o) => o.category === p.category && o.id !== p.id).slice(0, 3);
  const months = parseInt(p.duration, 10);
  const monthlyTotal = p.monthlyXAF && p.duration.includes('month') ? p.monthlyXAF * months : null;
  const askLink = buildWhatsappLink(`Hello InTelleX! I have a question about the ${p.title} programme.`);

  const facts = [
    { icon: Clock, label: 'Duration', value: p.duration },
    { icon: Gauge, label: 'Level', value: p.level },
    { icon: Video, label: 'Format', value: p.format },
    { icon: BadgeCheck, label: 'Certificate', value: 'On completion' },
  ];

  return (
    <div className="site airy">
      <TopNav />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="wrap !max-w-[1200px] pb-12 pt-10 sm:pt-14">
        <Link href="/programmes" className="inline-flex items-center gap-1.5 text-[14px] text-[#4b5563] hover:text-[var(--ink)]">
          <ArrowLeft size={15} /> All programmes
        </Link>
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e7e9ec]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.logoUrl} alt="" className="h-7 w-7 object-contain" />
              </span>
              <span className="eyebrow">{p.categoryLabel}</span>
            </div>
            <h1 className="mt-5 text-[40px] leading-[1.04] sm:text-[56px]">{p.title}</h1>
            <p className="mt-5 max-w-[580px] text-[16px] leading-relaxed text-[#4b5563]">{p.description}</p>

            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {facts.map((f) => (
                <div key={f.label} className="line-card p-3.5">
                  <dt className="flex items-center gap-1.5 text-[12px] text-[#4b5563]">
                    <f.icon size={13} /> {f.label}
                  </dt>
                  <dd className="mt-1 text-[14px] font-medium leading-snug">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={enrolHref(p)} className="btn btn-green !px-6">
                Start my enrolment <ArrowRight size={16} />
              </Link>
              <AskAdvisorButton question={`Is the ${p.title} programme right for me?`} className="btn btn-line !px-6">
                <Sparkles size={16} /> Is it right for me?
              </AskAdvisorButton>
            </div>
          </div>
          <div className="line-card relative hidden items-center justify-center overflow-hidden p-12 lg:flex">
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{ backgroundImage: 'radial-gradient(#e7e9ec 1px, transparent 1px)', backgroundSize: '18px 18px' }}
            />
            <Doodle name={CATEGORY_DOODLE[p.category]} className="relative max-h-[340px] w-full max-w-[420px] object-contain" />
          </div>
        </div>
      </section>

      {/* ── Body + investment panel ─────────────────────────── */}
      <section className="border-t border-[#e7e9ec] py-16 sm:py-20">
        <div className="wrap !max-w-[1200px]">
          <div className="grid gap-10 lg:grid-cols-[1fr_370px] lg:gap-14">
            <div className="flex flex-col gap-20">
              <div>
                <div className="eyebrow">Outcomes</div>
                <h2 className="mt-3 text-[30px] leading-tight sm:text-[38px]">What you will be able to do</h2>
                <ul className="mt-6 grid gap-x-6 sm:grid-cols-2">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-3 border-t border-[#e7e9ec] py-4 text-[15px]">
                      <Check size={17} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[var(--green-deep)]" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <div className="eyebrow">Curriculum</div>
                    <h2 className="mt-3 text-[30px] leading-tight sm:text-[38px]">Module by module</h2>
                    <p className="mt-2 text-[15px] text-[#4b5563]">Open a module to see exactly what you will learn and build.</p>
                  </div>
                  <a href={`/api/programmes/${p.id}/curriculum`} download className="btn btn-line">
                    <Download size={15} /> Curriculum (PDF)
                  </a>
                </div>
                <div className="line-card mt-6 divide-y divide-[#e7e9ec] overflow-hidden">
                  {getProgrammeModules(p.id, p.technologies, p.duration).map((m, i) => (
                    <details key={m.title} className="group open:bg-[#fafbfa]" open={i === 0}>
                      <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#e7e9ec] bg-white text-[13px] font-medium text-[var(--green-deep)] group-open:border-transparent group-open:bg-[#5ce39a] group-open:text-[var(--ink)]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[16px] font-medium">{m.title}</span>
                          <span className="block text-[13px] text-[#4b5563]">
                            {m.weeks} · {m.topics.length} topics
                          </span>
                        </span>
                        <ChevronDown size={18} className="shrink-0 text-[#9ca3af] transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-5 pb-6 sm:pl-[74px]">
                        <p className="text-[14.5px] leading-relaxed text-[#4b5563]">{m.summary}</p>
                        <ul className="mt-4 space-y-3">
                          {m.topics.map((t) => (
                            <li key={t.title} className="flex gap-3">
                              <Check size={15} strokeWidth={2.5} className="mt-1 shrink-0 text-[var(--green-deep)]" />
                              <span>
                                <span className="block text-[14.5px] font-medium">{t.title}</span>
                                <span className="block text-[13.5px] leading-relaxed text-[#4b5563]">{t.detail}</span>
                              </span>
                            </li>
                          ))}
                        </ul>
                        {m.project ? (
                          <p className="dash-tile mt-4 px-4 py-3 text-[13.5px]">
                            <span className="font-medium">Project: </span>
                            {m.project}
                          </p>
                        ) : null}
                      </div>
                    </details>
                  ))}
                </div>
              </div>

              <div>
                <div className="eyebrow">Delivery</div>
                <h2 className="mt-3 text-[30px] leading-tight sm:text-[38px]">How you will learn</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {DELIVERY.filter((d) => !p.short || d.id !== 'mentorship').map((d) => (
                    <div key={d.id} className="line-card flex flex-col p-6">
                      <Doodle name={DELIVERY_DOODLE[d.id]} className="h-28 w-auto self-start" />
                      <h3 className="mt-4 text-[18px]">{d.title}</h3>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-[#4b5563]">{d.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="line-card p-6">
                  <h2 className="text-[20px]">Prerequisites</h2>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-[#4b5563]">{p.prerequisites}</p>
                </div>
                <div className="line-card p-6">
                  <h2 className="text-[20px]">What you need</h2>
                  <ul className="mt-2.5 flex flex-col gap-2 text-[14.5px] text-[#4b5563]">
                    {p.equipment.map((e) => (
                      <li key={e} className="flex gap-2.5">
                        <Laptop size={17} className="mt-0.5 shrink-0 text-[var(--ink)]" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="eyebrow">Enrolment</div>
                <h2 className="mt-3 text-[30px] leading-tight sm:text-[38px]">How enrolment works</h2>
                <ol className="mt-6">
                  {ENROL_STEPS.map((s, i) => (
                    <li key={s.title} className="flex gap-5 border-t border-[#e7e9ec] py-5">
                      <span className="text-[14px] font-medium text-[var(--green-deep)]">0{i + 1}</span>
                      <div>
                        <h3 className="text-[17px]">{s.title}</h3>
                        <p className="mt-0.5 text-[14px] leading-relaxed text-[#4b5563]">{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h2 className="text-[30px] leading-tight sm:text-[38px]">Questions</h2>
                <div className="mt-5">
                  {PROGRAMME_FAQ.map((f) => (
                    <details key={f.q} className="group border-t border-[#e7e9ec] py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-medium [&::-webkit-details-marker]:hidden">
                        {f.q}
                        <span className="text-[22px] font-light text-[#6b7280] transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-3 text-[14.5px] leading-relaxed text-[#4b5563]">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>

            {/* Investment panel */}
            <aside>
              <div className="line-card-green p-7 lg:sticky lg:top-24">
                <div className="text-[13px] text-[var(--green-deep)]">Your investment</div>
                <div className="mt-1 text-[38px] font-medium leading-none tracking-[-0.03em]">
                  {priceNumber(p.priceXAF)} <span className="text-[15px] font-normal text-[#4b5563]">XAF</span>
                </div>
                {p.monthlyXAF && (
                  <p className="mt-2 text-[14px] text-[#4b5563]">
                    or {priceNumber(p.monthlyXAF)} XAF / month
                    {monthlyTotal ? ` for ${months} months` : ''}
                    <span className="mt-1 block">That is about {priceNumber(dailyXaf(p.monthlyXAF))} XAF a day.</span>
                    {monthlyTotal && monthlyTotal > p.priceXAF && (
                      <span className="mt-2 inline-block rounded-full border border-[rgba(0,179,105,0.45)] bg-white px-3 py-1 text-[12.5px] font-medium text-[var(--green-deep)]">
                        Pay in full and save {priceNumber(monthlyTotal - p.priceXAF)} XAF
                      </span>
                    )}
                  </p>
                )}
                <div className="mt-6 rounded-xl border border-[#e7e9ec] bg-white p-4">
                  <div className="text-[12.5px] text-[#4b5563]">What it includes</div>
                  <ul className="mt-3 flex flex-col gap-2 text-[14px]">
                    {[
                      'Live classes with your instructor',
                      p.short ? 'Guided exercises and materials' : 'Mentorship and code reviews',
                      'Real projects for your portfolio',
                      'An InTelleX certificate on completion',
                    ].map((u) => (
                      <li key={u} className="flex gap-2.5">
                        <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[var(--green-deep)]" />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
                <ul className="mt-6 flex flex-col gap-3 text-[14px] text-[#4b5563]">
                  <li className="flex justify-between gap-4">
                    <span>Registration fee</span>
                    <span className="font-medium text-[var(--ink)]">{priceNumber(p.registrationFee)} XAF</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span>Payment</span>
                    <span className="text-right font-medium text-[var(--ink)]">MoMo · Orange Money · Card</span>
                  </li>
                </ul>
                <Link href={enrolHref(p)} className="btn btn-green mt-7 w-full">
                  Start my enrolment <ArrowRight size={17} />
                </Link>
                <a href={askLink} target="_blank" rel="noopener noreferrer" className="btn btn-line mt-3 w-full">
                  <MessageCircle size={17} /> Ask a question
                </a>
                <p className="mt-5 text-[12.5px] leading-relaxed text-[#4b5563]">
                  We confirm your cohort start date and schedule on WhatsApp before you pay.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="wrap !max-w-[1200px] pb-16">
          <h2 className="mb-6 text-[30px] leading-tight sm:text-[38px]">Related programmes</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ProgrammeCard key={r.id} programme={r} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="wrap !max-w-[1200px] pb-16 pt-8">
        <div className="line-card relative overflow-hidden px-6 py-16 text-center">
          <Doodle name="groovy" className="absolute -left-4 bottom-0 hidden w-[220px] lg:block" />
          <Doodle name="jumping" className="absolute -right-4 bottom-0 hidden w-[220px] lg:block" />
          <div className="relative mx-auto max-w-[560px]">
            <h2 className="text-[34px] leading-tight sm:text-[48px]">Ready to start {p.shortTitle}?</h2>
            <p className="mx-auto mt-3 max-w-[440px] text-[15.5px] leading-relaxed text-[#4b5563]">
              Send your enrolment request and we will confirm your cohort and schedule on WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href={askLink} target="_blank" rel="noopener noreferrer" className="btn btn-line !px-6">
                <MessageCircle size={16} /> WhatsApp us
              </a>
              <Link href={enrolHref(p)} className="btn btn-green !px-6">
                Start my enrolment <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AdvisorDock />
    </div>
  );
}
