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
    doodle: 'sittingreading',
  },
  {
    title: 'InTelleX is responsible for your teaching.',
    body: 'You do not browse tutors and hope. We select, approve and manage the instructors, and if something is not working, you tell InTelleX and we fix it.',
    doodle: 'loving',
  },
  {
    title: 'We would rather be believed than impressive.',
    body: 'No guaranteed jobs, no invented numbers. We show you what happens week by week and the work our learners produce, and let you decide.',
    doodle: 'meditating',
  },
];

/** One doodle per benefit group, in BENEFIT_GROUPS order. */
const GROUP_DOODLE: Record<string, string> = {
  structure: 'readingside',
  people: 'doggie',
  proof: 'unboxing',
  support: 'coffee',
};

function Doodle({ name, className = '' }: { name: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/doodles/${name}.svg`} alt="" className={`doodle ${className}`} loading="lazy" />;
}

export default function WhyIntellexPage() {
  return (
    <div className="site airy">
      <TopNav />

      <section className="wrap !max-w-[1200px] pb-16 pt-12 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="eyebrow">Why InTelleX</div>
            <h1 className="mt-5 text-[44px] leading-[1.02] sm:text-[64px]">The difference is a person paying attention.</h1>
            <p className="mt-6 max-w-[520px] text-[16px] leading-relaxed text-[#4b5563]">
              Most people who try to learn a skill online stop somewhere around week three. Not because the videos were bad,
              but because nobody noticed they stopped. InTelleX is built so somebody always notices.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/programmes" className="btn btn-green !px-6">
                Find your programme <ArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="btn btn-line !px-6">
                Compare options
              </Link>
            </div>
          </div>
          <div className="line-card flex items-center justify-center p-8 sm:p-12">
            <Doodle name="readingside" className="w-full max-w-[460px]" />
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="wrap !max-w-[1200px] pb-24">
        <div className="grid gap-4 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <div key={p.title} className="line-card flex flex-col p-7">
              <span className="text-[14px] font-medium text-[var(--green-deep)]">0{i + 1}</span>
              <h2 className="mt-3 text-[22px] leading-snug">{p.title}</h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-[#4b5563]">{p.body}</p>
              <Doodle name={p.doodle} className="mx-auto mt-auto h-40 w-auto pt-6" />
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="wrap !max-w-[1200px] pb-24 sm:pb-32">
        <div className="max-w-[640px]">
          <div className="eyebrow">Three ways to learn the same skill</div>
          <h2 className="mt-3 text-[34px] leading-[1.08] sm:text-[48px]">Same topic. Very different outcome.</h2>
        </div>
        <div className="line-card mt-10 overflow-x-auto p-2">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th className="p-4" />
                {COMPARE_COLUMNS.map((c, i) => (
                  <th key={c} className={`p-4 text-[15px] font-medium ${i === 2 ? 'rounded-t-xl bg-[#f3fbf7] text-[var(--green-deep)]' : ''}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((r, ri) => (
                <tr key={r.label}>
                  <th scope="row" className="border-t border-[#e7e9ec] p-4 text-[14px] font-medium">
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td
                      key={i}
                      className={`border-t border-[#e7e9ec] p-4 text-[14.5px] ${
                        i === 2 ? `bg-[#f3fbf7] font-medium ${ri === COMPARE_ROWS.length - 1 ? 'rounded-b-xl' : ''}` : 'text-[#4b5563]'
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
        <p className="mt-4 text-[14px] text-[#4b5563]">
          Free tutorials are genuinely useful. We publish{' '}
          <Link href="/tutorials" className="font-medium text-[var(--green-deep)] hover:underline">
            free tutorials
          </Link>{' '}
          ourselves. They are a great place to start, and a hard place to finish.
        </p>
      </section>

      {/* Week by week */}
      <section className="border-y border-[#e7e9ec] bg-[#fafbfa] py-24 sm:py-32">
        <div className="wrap !max-w-[1200px]">
          <div className="max-w-[640px]">
            <div className="eyebrow">How it works in practice</div>
            <h2 className="mt-3 text-[34px] leading-[1.08] sm:text-[48px]">From first message to finished project.</h2>
          </div>
          <div className="mt-12">
            <ProgrammeJourney />
          </div>
        </div>
      </section>

      {/* Benefits in detail */}
      <section className="wrap !max-w-[1200px] py-24 sm:py-32">
        <div className="max-w-[640px]">
          <div className="eyebrow">What you get</div>
          <h2 className="mt-3 text-[34px] leading-[1.08] sm:text-[48px]">Everything, in plain words.</h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {BENEFIT_GROUPS.map((g) => (
            <div key={g.id} className="line-card flex flex-col p-7 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[24px]">{g.title}</h3>
                  <p className="mt-1 text-[14.5px] text-[#4b5563]">{g.lead}</p>
                </div>
                <Doodle name={GROUP_DOODLE[g.id]} className="h-24 w-auto shrink-0" />
              </div>
              <ul className="mt-6 flex flex-col">
                {g.items.map((b) => (
                  <li key={b.title} className="border-t border-[#e7e9ec] py-4">
                    <div className="flex items-center gap-2 text-[15.5px] font-medium">
                      <Check size={16} strokeWidth={2.5} className="shrink-0 text-[var(--green-deep)]" />
                      {b.title}
                    </div>
                    <p className="mt-1 pl-6 text-[14px] leading-relaxed text-[#4b5563]">{b.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Not for */}
      <section className="wrap !max-w-[1200px] pb-24 sm:pb-32">
        <div className="max-w-[640px]">
          <div className="eyebrow">Honestly</div>
          <h2 className="mt-3 text-[34px] leading-[1.08] sm:text-[48px]">InTelleX is not for you if…</h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {NOT_FOR.map((n) => (
            <div key={n.title} className="line-card p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e7e9ec] bg-[#f6f7f8]">
                <X size={16} />
              </span>
              <h3 className="mt-4 text-[18px]">{n.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#4b5563]">{n.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap !max-w-[1200px] pb-16">
        <div className="line-card relative overflow-hidden px-6 py-16 text-center">
          <Doodle name="plant" className="absolute -bottom-2 left-4 hidden w-[170px] lg:block" />
          <Doodle name="float" className="absolute -right-2 bottom-2 hidden w-[230px] lg:block" />
          <h2 className="text-[34px] leading-tight sm:text-[48px]">Still deciding? Good.</h2>
          <p className="mx-auto mt-3 max-w-[480px] text-[15.5px] text-[#4b5563]">
            Compare what each option includes, or tell us about your goal and we will recommend one.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/pricing" className="btn btn-line !px-6">
              Compare options
            </Link>
            <a href={orientationWhatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-green !px-6">
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
