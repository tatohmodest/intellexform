import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Check, MessageCircle, X } from 'lucide-react';
import { orientationWhatsappLink } from '@/lib/contact';
import { BENEFIT_GROUPS, COMPARE_COLUMNS, COMPARE_ROWS, NOT_FOR } from '@/lib/positioning';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import AdvisorDock from '@/components/landing/AdvisorDock';
import ProgrammeJourney from '@/components/landing/ProgrammeJourney';

export const metadata: Metadata = {
  title: 'Why learn with InTelleX',
  description:
    'Free tutorials give you information. InTelleX gives you a path, an instructor who checks your work, real projects and proof you can do the job.',
};

const PRINCIPLES = [
  {
    title: 'We sell competence, not content.',
    body: 'Content is everywhere. What is rare is someone who makes sure you can actually use it. Every part of a programme is built around you doing the work and getting told how to do it better.',
  },
  {
    title: 'InTelleX is responsible for your teaching.',
    body: 'You do not browse tutors and hope. We select, approve and manage the instructors, and if something is not working, you tell InTelleX and we fix it.',
  },
  {
    title: 'We would rather be believed than impressive.',
    body: 'No guaranteed jobs, no invented numbers. We show you what happens week by week and the work our learners produce, and let you decide.',
  },
];

export default function WhyIntellexPage() {
  return (
    <div className="site">
      <TopNav />

      <section className="px-3 pt-3 sm:px-5 sm:pt-4">
        <div className="relative mx-auto max-w-[1360px] overflow-hidden rounded-[32px] bg-[var(--pastel-butter)] px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/50" />
          <div className="relative max-w-[820px]">
            <div className="text-[13px] font-semibold text-[var(--green-deep)]">Why InTelleX</div>
            <h1 className="mt-3 text-[42px] font-extrabold leading-[1.03] text-[var(--navy)] sm:text-[64px]">
              The difference is a person paying attention.
            </h1>
            <p className="mt-6 max-w-[620px] text-[17px] leading-relaxed text-[var(--navy)]/75 sm:text-[18px]">
              Most people who try to learn a skill online stop somewhere around week three. Not because the videos were
              bad, but because nobody noticed they stopped. InTelleX is built so somebody always notices.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 sm:py-24">
        <div className="wrap !max-w-[1280px]">
          <div className="grid gap-4 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <div key={p.title} className="rounded-[28px] bg-[var(--paper-dim)] p-7 sm:p-8">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--green)] text-[15px] font-bold text-white">
                  {i + 1}
                </span>
                <h2 className="mt-5 text-[22px] font-bold leading-snug text-[var(--navy)]">{p.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-soft)]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="pb-20 sm:pb-28">
        <div className="wrap !max-w-[1280px]">
          <div className="max-w-[680px]">
            <div className="text-[13px] font-semibold text-[var(--green-deep)]">Three ways to learn the same skill</div>
            <h2 className="mt-2 text-[32px] font-bold leading-[1.1] text-[var(--navy)] sm:text-[44px]">Same topic. Very different outcome.</h2>
          </div>
          <div className="mt-10 overflow-x-auto rounded-[28px] bg-[var(--paper-dim)] p-2">
            <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th className="p-4" />
                  {COMPARE_COLUMNS.map((c, i) => (
                    <th
                      key={c}
                      className={`p-4 text-[15px] font-bold ${i === 2 ? 'rounded-t-2xl bg-[var(--green)] text-white' : 'text-[var(--navy)]'}`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((r, ri) => (
                  <tr key={r.label}>
                    <th scope="row" className="border-t border-black/5 p-4 text-[14px] font-semibold text-[var(--navy)]">
                      {r.label}
                    </th>
                    {r.values.map((v, i) => (
                      <td
                        key={i}
                        className={`border-t p-4 text-[14.5px] ${
                          i === 2
                            ? `border-white/20 bg-[var(--green)] font-semibold text-white ${ri === COMPARE_ROWS.length - 1 ? 'rounded-b-2xl' : ''}`
                            : 'border-black/5 text-[var(--ink-soft)]'
                        }`}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[14px] text-[var(--ink-soft)]">
            Free tutorials are genuinely useful. We publish{' '}
            <Link href="/tutorials" className="font-semibold text-[var(--green-deep)] hover:underline">
              free tutorials
            </Link>{' '}
            ourselves. They are a great place to start, and a hard place to finish.
          </p>
        </div>
      </section>

      {/* Week by week */}
      <section className="px-3 sm:px-5">
        <div className="mx-auto max-w-[1360px] rounded-[32px] bg-[var(--pastel-mint)] px-5 py-16 sm:px-12 lg:px-16 lg:py-24">
          <div className="max-w-[680px]">
            <div className="text-[13px] font-semibold text-[var(--green-deep)]">How it works in practice</div>
            <h2 className="mt-2 text-[32px] font-bold leading-[1.1] text-[var(--navy)] sm:text-[44px]">From first message to finished project.</h2>
          </div>
          <div className="mt-12">
            <ProgrammeJourney />
          </div>
        </div>
      </section>

      {/* Benefits in detail */}
      <section className="py-20 sm:py-28">
        <div className="wrap !max-w-[1280px]">
          <div className="max-w-[680px]">
            <div className="text-[13px] font-semibold text-[var(--green-deep)]">What you get</div>
            <h2 className="mt-2 text-[32px] font-bold leading-[1.1] text-[var(--navy)] sm:text-[44px]">Everything, in plain words.</h2>
          </div>
          <div className="mt-12 flex flex-col gap-4">
            {BENEFIT_GROUPS.map((g) => (
              <div key={g.id} className="grid gap-6 rounded-[28px] p-7 sm:p-9 lg:grid-cols-[300px_1fr]" style={{ background: g.bg }}>
                <div>
                  <h3 className="text-[26px] font-extrabold leading-tight text-[var(--navy)]">{g.title}</h3>
                  <p className="mt-1 text-[15px] text-[var(--navy)]/65">{g.lead}</p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {g.items.map((b) => (
                    <li key={b.title} className="rounded-2xl bg-white/75 p-5">
                      <div className="flex items-center gap-2 text-[16px] font-bold text-[var(--navy)]">
                        <Check size={16} strokeWidth={3} className="shrink-0 text-[var(--green-deep)]" />
                        {b.title}
                      </div>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--navy)]/70">{b.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Not for */}
      <section className="pb-20 sm:pb-28">
        <div className="wrap !max-w-[1280px]">
          <div className="rounded-[32px] bg-[var(--navy)] p-7 text-white sm:p-12">
            <div className="text-[13px] font-semibold text-[var(--pastel-mint)]">Honestly</div>
            <h2 className="mt-2 max-w-[640px] text-[32px] font-bold leading-[1.1] text-white sm:text-[42px]">InTelleX is not for you if…</h2>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {NOT_FOR.map((n) => (
                <div key={n.title} className="rounded-3xl bg-white/[0.07] p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                    <X size={16} />
                  </span>
                  <h3 className="mt-4 text-[18px] font-bold text-white">{n.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-3 pb-6 sm:px-5">
        <div className="mx-auto flex max-w-[1360px] flex-col items-start gap-6 rounded-[32px] bg-[var(--pastel-sky)] px-7 py-14 sm:px-14 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-[34px] font-extrabold leading-tight text-[var(--navy)] sm:text-[44px]">Still deciding? Good.</h2>
            <p className="mt-2 max-w-[520px] text-[16px] text-[var(--navy)]/70">
              Compare what each option includes, or tell us about your goal and we will recommend one.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/pricing" className="btn btn-dark !px-6">
              Compare options <ArrowRight size={16} />
            </Link>
            <a href={orientationWhatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-primary !px-6">
              <MessageCircle size={16} /> Ask us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <AdvisorDock />
    </div>
  );
}
