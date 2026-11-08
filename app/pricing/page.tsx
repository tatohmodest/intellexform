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
  { title: 'Live classes every week', body: 'Your instructor teaches the syllabus in order, with your cohort, at set times.' },
  { title: 'Your work, reviewed', body: 'Projects and exercises checked by your instructor, with specific things to fix.' },
  { title: 'Questions answered', body: 'In class, in messages, and with the AI tutor between sessions.' },
  { title: 'Materials that stay', body: 'Notes, exercises and recordings where available, all in your dashboard.' },
];

export default function PricingPage() {
  const flagship = PROGRAMMES.find((p) => p.id === 'fullstack')!;
  const groups = PROGRAMME_CATEGORIES.map((c) => ({ ...c, list: PROGRAMMES.filter((p) => p.category === c.id) })).filter(
    (g) => g.list.length,
  );

  return (
    <div className="site">
      <TopNav />

      <section className="px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[32px] bg-[var(--pastel-sky)] px-5 py-16 sm:px-12 sm:py-20 lg:px-16">
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-white/50" />
          <div className="relative mx-auto max-w-[760px] text-center">
            <div className="text-[13px] font-semibold text-[var(--green-deep)]">Pricing</div>
            <h1 className="mt-3 text-[40px] font-extrabold leading-[1.04] text-[var(--navy)] sm:text-[60px]">The price follows the support.</h1>
            <p className="mx-auto mt-5 max-w-[580px] text-[17px] leading-relaxed text-[var(--navy)]/75">
              The more of a teacher&apos;s time you get, the more it costs. Pick the level of support you actually need.
            </p>
          </div>

          <div className="relative mt-12 grid gap-4 lg:grid-cols-3">
            {TIERS.map((t) => (
              <div
                key={t.id}
                className={`flex flex-col rounded-[28px] p-7 sm:p-8 ${t.featured ? 'bg-[var(--navy)] text-white lg:-my-3 lg:py-11' : 'bg-white'}`}
              >
                <div className={`text-[13px] font-semibold ${t.featured ? 'text-[var(--pastel-mint)]' : 'text-[var(--green-deep)]'}`}>{t.level}</div>
                <h2 className={`mt-1 text-[24px] font-bold ${t.featured ? 'text-white' : 'text-[var(--navy)]'}`}>{t.name}</h2>
                <p className={`mt-2 text-[14.5px] leading-relaxed ${t.featured ? 'text-white/70' : 'text-[var(--ink-soft)]'}`}>{t.forWho}</p>
                <div className={`mt-6 font-display text-[30px] font-extrabold leading-none ${t.featured ? 'text-white' : 'text-[var(--navy)]'}`}>
                  {t.price}
                </div>
                <div className={`mt-1.5 text-[13.5px] ${t.featured ? 'text-white/70' : 'text-[var(--ink-soft)]'}`}>
                  {t.priceNote} · {t.duration}
                </div>
                <ul className="mt-7 flex flex-col gap-2.5">
                  {t.includes.map((i) => (
                    <li key={i} className={`flex gap-2.5 text-[14.5px] ${t.featured ? 'text-white/90' : 'text-[var(--navy)]'}`}>
                      <Check size={16} strokeWidth={3} className="mt-0.5 shrink-0 text-[var(--green)]" />
                      {i}
                    </li>
                  ))}
                  {t.excludes.map((i) => (
                    <li key={i} className={`flex gap-2.5 text-[14.5px] ${t.featured ? 'text-white/55' : 'text-[var(--ink-soft)]'}`}>
                      <Minus size={16} className="mt-0.5 shrink-0" />
                      {i}
                    </li>
                  ))}
                </ul>
                <Link
                  href={t.href}
                  className={`btn mt-auto !mt-8 w-full ${t.featured ? 'btn-primary' : 'btn-soft'}`}
                >
                  {t.cta} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What a month buys */}
      <section className="py-20 sm:py-28">
        <div className="wrap !max-w-[1280px]">
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <div className="text-[13px] font-semibold text-[var(--green-deep)]">Where your fee goes</div>
              <h2 className="mt-2 text-[32px] font-bold leading-[1.1] text-[var(--navy)] sm:text-[44px]">
                {priceNumber(flagship.monthlyXAF!)} XAF a month. Here is what that is.
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-[var(--ink-soft)]">
                Take {flagship.title}: {priceNumber(flagship.priceXAF)} XAF in full, or {priceNumber(flagship.monthlyXAF!)} XAF a month,
                about {priceNumber(dailyXaf(flagship.monthlyXAF!))} XAF a day. You are not paying for videos. You are paying for an
                instructor&apos;s time, every week, for {flagship.duration}.
              </p>
              <Link href={programmeHref(flagship)} className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--green-deep)]">
                See the full syllabus <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {MONTH_INCLUDES.map((m, i) => (
                <div
                  key={m.title}
                  className="rounded-3xl p-6"
                  style={{ background: ['var(--pastel-mint)', 'var(--pastel-butter)', 'var(--pastel-lilac)', 'var(--pastel-sky)'][i] }}
                >
                  <h3 className="text-[18px] font-bold text-[var(--navy)]">{m.title}</h3>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-[var(--navy)]/70">{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Every price */}
      <section className="pb-20 sm:pb-28">
        <div className="wrap !max-w-[1280px]">
          <div className="max-w-[680px]">
            <div className="text-[13px] font-semibold text-[var(--green-deep)]">Every programme</div>
            <h2 className="mt-2 text-[32px] font-bold leading-[1.1] text-[var(--navy)] sm:text-[44px]">All prices, nothing hidden.</h2>
            <p className="mt-4 text-[16px] text-[var(--ink-soft)]">
              A one-time registration fee of {priceNumber(REGISTRATION_FEE)} XAF applies to programmes. Pay with MTN MoMo, Orange
              Money or card.
            </p>
          </div>
          <div className="mt-10 flex flex-col gap-6">
            {groups.map((g) => (
              <div key={g.id} className="rounded-[28px] bg-[var(--paper-dim)] p-3 sm:p-4">
                <div className="px-3 pb-3 pt-2 text-[15px] font-bold text-[var(--navy)]">{g.label}</div>
                <ul className="flex flex-col gap-2">
                  {g.list.map((p) => (
                    <li key={p.id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 sm:flex-row sm:items-center">
                      <Link href={programmeHref(p)} className="group flex min-w-0 flex-1 items-center gap-3">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--paper-dim)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.logoUrl} alt="" className="h-6 w-6 object-contain" />
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5 text-[15.5px] font-bold text-[var(--navy)]">
                            {p.title}
                            <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100" />
                          </span>
                          <span className="block text-[13px] text-[var(--ink-soft)]">
                            {p.duration} · {p.level} · {p.format}
                          </span>
                        </span>
                      </Link>
                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <div className="text-right">
                          <div className="text-[16px] font-extrabold text-[var(--navy)]">{priceNumber(p.priceXAF)} XAF</div>
                          {p.monthlyXAF ? (
                            <div className="text-[12.5px] text-[var(--ink-soft)]">or {priceNumber(p.monthlyXAF)}/month</div>
                          ) : (
                            <div className="text-[12.5px] text-[var(--ink-soft)]">one payment</div>
                          )}
                        </div>
                        <Link href={enrolHref(p)} className="btn btn-primary !px-4 !py-2.5 text-[14px]">
                          Enrol
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-20 sm:pb-24">
        <div className="wrap !max-w-[900px]">
          <h2 className="text-[32px] font-bold text-[var(--navy)] sm:text-[40px]">Questions about paying</h2>
          <div className="mt-8 flex flex-col gap-3">
            {PROGRAMME_FAQ.map((f) => (
              <details key={f.q} className="group rounded-2xl bg-[var(--paper-dim)] p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-[16px] font-bold text-[var(--navy)]">
                  {f.q}
                  <span className="text-[22px] font-normal text-[var(--ink-soft)] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-soft)]">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="px-3 pb-6 sm:px-5">
        <div className="mx-auto flex max-w-[1360px] flex-col items-start gap-6 rounded-[32px] bg-[var(--green)] px-7 py-14 text-white sm:px-14 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[34px] font-extrabold leading-tight text-white sm:text-[44px]">Not sure which level you need?</h2>
            <p className="mt-2 max-w-[540px] text-[16px] text-white/85">
              Tell us your goal. If the library is enough for you, we will say so.
            </p>
          </div>
          <a href={orientationWhatsappLink()} target="_blank" rel="noopener noreferrer" className="btn bg-white !px-6 text-[var(--green-deep)] hover:bg-white/90">
            <MessageCircle size={16} /> Ask us on WhatsApp
          </a>
        </div>
      </section>

      <Footer />
      <AdvisorDock />
    </div>
  );
}
