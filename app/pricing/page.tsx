import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight, Check, MessageCircle, Minus } from 'lucide-react';
import { orientationWhatsappLink } from '@/lib/contact';
import { PROGRAMME_CATEGORIES, PROGRAMME_FAQ, PROGRAMMES, dailyXaf, enrolHref, priceNumber, programmeHref } from '@/lib/programmes';
import { REGISTRATION_FEE, TIERS } from '@/lib/positioning';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import AdvisorDock from '@/components/landing/AdvisorDock';

export const metadata: Metadata = {
  title: 'Pricing · What you pay for at InTelleX',
  description:
    'Library membership, Foundations and career programmes compared: what each includes, what it costs, and how to pay monthly with MTN MoMo, Orange Money or card.',
};

/** What one month of a career programme is made of. Kept to things every programme includes. */
const MONTH_INCLUDES = [
  { title: 'Live classes every week', body: 'Your instructor teaches the syllabus in order, with your cohort, at set times.', doodle: 'sittingreading' },
  { title: 'Your work, reviewed', body: 'Projects and exercises checked by your instructor, with specific things to fix.', doodle: 'readingside' },
  { title: 'Questions answered', body: 'In class, in messages, and with the AI tutor between sessions.', doodle: 'coffee' },
  { title: 'Materials that stay', body: 'Notes, exercises and recordings where available, all in your dashboard.', doodle: 'reading' },
];

const TIER_DOODLE: Record<string, string> = { library: 'laying', foundations: 'plant', career: 'sprinting' };

function Doodle({ name, className = '' }: { name: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/doodles/${name}.svg`} alt="" className={`doodle ${className}`} loading="lazy" />;
}

export default function PricingPage() {
  const flagship = PROGRAMMES.find((p) => p.id === 'fullstack')!;
  const groups = PROGRAMME_CATEGORIES.map((c) => ({ ...c, list: PROGRAMMES.filter((p) => p.category === c.id) })).filter(
    (g) => g.list.length,
  );

  return (
    <div className="site airy">
      <TopNav />

      <section className="wrap !max-w-[1200px] pb-8 pt-12 text-center sm:pt-20">
        <div className="eyebrow">Pricing</div>
        <h1 className="mx-auto mt-5 max-w-[760px] text-[44px] leading-[1.02] sm:text-[64px]">The price follows the support.</h1>
        <p className="mx-auto mt-5 max-w-[520px] text-[16px] leading-relaxed text-[#4b5563]">
          The more of a teacher&apos;s time you get, the more it costs. Pick the level of support you actually need.
        </p>
      </section>

      <section className="wrap !max-w-[1200px] pb-24 sm:pb-32">
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.id} className={`${t.featured ? 'line-card-green' : 'line-card'} flex flex-col p-7 sm:p-8`}>
              <div className="flex h-36 items-end justify-center">
                <Doodle name={TIER_DOODLE[t.id]} className="max-h-full w-auto" />
              </div>
              <div className="mt-6 text-[13px] text-[var(--green-deep)]">{t.level}</div>
              <h2 className="mt-1 text-[24px]">{t.name}</h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#4b5563]">{t.forWho}</p>
              <div className="mt-6 text-[30px] font-medium leading-none tracking-[-0.03em]">{t.price}</div>
              <div className="mt-1.5 text-[13px] text-[#4b5563]">
                {t.priceNote} · {t.duration}
              </div>
              <ul className="mt-6 flex flex-col gap-2.5 border-t border-[#e7e9ec] pt-5">
                {t.includes.map((i) => (
                  <li key={i} className="flex gap-2.5 text-[14px]">
                    <Check size={16} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[var(--green-deep)]" />
                    {i}
                  </li>
                ))}
                {t.excludes.map((i) => (
                  <li key={i} className="flex gap-2.5 text-[14px] text-[#6b7280]">
                    <Minus size={16} className="mt-0.5 shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
              <Link href={t.href} className={`btn mt-auto !mt-8 w-full ${t.featured ? 'btn-green' : 'btn-line'}`}>
                {t.cta} <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* What a month buys */}
      <section className="border-y border-[#e7e9ec] bg-[#fafbfa] py-24 sm:py-32">
        <div className="wrap !max-w-[1200px]">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.25fr]">
            <div>
              <div className="eyebrow">Where your fee goes</div>
              <h2 className="mt-3 text-[34px] leading-[1.08] sm:text-[44px]">
                {priceNumber(flagship.monthlyXAF!)} XAF a month. Here is what that is.
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-[#4b5563]">
                Take {flagship.title}: {priceNumber(flagship.priceXAF)} XAF in full, or {priceNumber(flagship.monthlyXAF!)} XAF a month,
                about {priceNumber(dailyXaf(flagship.monthlyXAF!))} XAF a day. You are not paying for videos. You are paying for an
                instructor&apos;s time, every week, for {flagship.duration}.
              </p>
              <Link href={programmeHref(flagship)} className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-[var(--green-deep)]">
                See the full syllabus <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {MONTH_INCLUDES.map((m) => (
                <div key={m.title} className="line-card flex flex-col p-6">
                  <Doodle name={m.doodle} className="h-24 w-auto self-start" />
                  <h3 className="mt-4 text-[18px]">{m.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[#4b5563]">{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Every price */}
      <section className="wrap !max-w-[1200px] py-24 sm:py-32">
        <div className="max-w-[640px]">
          <div className="eyebrow">Every programme</div>
          <h2 className="mt-3 text-[34px] leading-[1.08] sm:text-[48px]">All prices, nothing hidden.</h2>
          <p className="mt-4 text-[15.5px] text-[#4b5563]">
            A one-time registration fee of {priceNumber(REGISTRATION_FEE)} XAF applies to programmes. Pay with MTN MoMo, Orange Money
            or card.
          </p>
        </div>
        <div className="mt-10 flex flex-col gap-8">
          {groups.map((g) => (
            <div key={g.id}>
              <div className="pb-3 text-[15px] font-medium">{g.label}</div>
              <ul className="line-card divide-y divide-[#e7e9ec] overflow-hidden">
                {g.list.map((p) => (
                  <li key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:px-5">
                    <Link href={programmeHref(p)} className="group flex min-w-0 flex-1 items-center gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e7e9ec]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.logoUrl} alt="" className="h-6 w-6 object-contain" />
                      </span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 text-[15.5px] font-medium">
                          {p.title}
                          <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100" />
                        </span>
                        <span className="block text-[13px] text-[#4b5563]">
                          {p.duration} · {p.level} · {p.format}
                        </span>
                      </span>
                    </Link>
                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-right">
                        <div className="text-[16px] font-medium">{priceNumber(p.priceXAF)} XAF</div>
                        <div className="text-[12.5px] text-[#4b5563]">
                          {p.monthlyXAF ? `or ${priceNumber(p.monthlyXAF)}/month` : 'one payment'}
                        </div>
                      </div>
                      <Link href={enrolHref(p)} className="btn btn-green !px-4 !py-2.5 text-[14px]">
                        Enrol
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="wrap !max-w-[860px] pb-24">
        <h2 className="text-[32px] sm:text-[40px]">Questions about paying</h2>
        <div className="mt-8 flex flex-col">
          {PROGRAMME_FAQ.map((f) => (
            <details key={f.q} className="group border-t border-[#e7e9ec] py-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-[16px] font-medium">
                {f.q}
                <span className="text-[22px] font-light text-[#6b7280] transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4b5563]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="wrap !max-w-[1200px] pb-16">
        <div className="line-card relative overflow-hidden px-6 py-16 text-center">
          <Doodle name="selfie" className="absolute bottom-0 left-6 hidden w-[150px] lg:block" />
          <Doodle name="levitate" className="absolute bottom-4 right-4 hidden w-[230px] lg:block" />
          <h2 className="text-[34px] leading-tight sm:text-[48px]">Not sure which level you need?</h2>
          <p className="mx-auto mt-3 max-w-[460px] text-[15.5px] text-[#4b5563]">Tell us your goal. If the library is enough for you, we will say so.</p>
          <a href={orientationWhatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-green mt-8 !px-6">
            <MessageCircle size={16} /> Ask us on WhatsApp
          </a>
        </div>
      </section>

      <Footer />
      <AdvisorDock />
    </div>
  );
}
