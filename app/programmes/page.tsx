import Link from 'next/link';
import type { Metadata } from 'next';
import { Check, MessageCircle, Sparkles } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import AdvisorDock from '@/components/landing/AdvisorDock';
import AskAdvisorButton from '@/components/landing/AskAdvisorButton';
import Doodle, { CATEGORY_DOODLE } from '@/components/landing/Doodle';
import ProgrammeCard from '@/components/programmes/ProgrammeCard';
import { orientationWhatsappLink } from '@/lib/contact';
import { getRequestLocale } from '@/lib/i18n/server';
import { PROGRAMMES, PROGRAMME_CATEGORIES, priceNumber, type ProgrammeCategory } from '@/lib/programmes';

export function generateMetadata(): Metadata {
  return getRequestLocale() === 'fr'
    ? {
        title: 'Programmes - InTelleX',
        description:
          'Des programmes en ligne avec formateur en développement logiciel, analyse de données et cybersécurité. Cours en direct, mentorat, projets et certificat. Paiement mensuel par mobile money.',
      }
    : {
        title: 'Programmes - InTelleX',
        description:
          'Instructor-led online programmes in software development, data analysis and cybersecurity. Live classes, mentorship, projects and a certificate. Pay monthly with mobile money.',
      };
}

export default function ProgrammesPage({ searchParams }: { searchParams?: { category?: string } }) {
  const active = PROGRAMME_CATEGORIES.find((c) => c.id === searchParams?.category)?.id as
    | ProgrammeCategory
    | undefined;
  const groups = PROGRAMME_CATEGORIES.filter((c) => !active || c.id === active).map((c) => ({
    ...c,
    items: PROGRAMMES.filter((p) => p.category === c.id),
  }));
  const lowestPrice = Math.min(...PROGRAMMES.map((p) => p.priceXAF));

  const chip = (on: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-[14px] transition-colors ${
      on ? 'border-[rgba(0,179,105,0.5)] bg-[#f3fbf7] font-medium text-[var(--ink)]' : 'border-[#e7e9ec] text-[#4b5563] hover:border-[#cfd3d8]'
    }`;

  return (
    <div className="site airy">
      <TopNav />

      {/* Hero */}
      <section className="wrap !max-w-[1200px] pb-10 pt-12 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <div className="eyebrow">Programmes</div>
            <h1 className="mt-5 text-[44px] leading-[1.02] sm:text-[60px]">Serious programmes for serious progress.</h1>
            <p className="mt-6 max-w-[500px] text-[16px] leading-relaxed text-[#4b5563]">
              Each programme is taught live by an InTelleX instructor, with mentorship, real projects and a certificate.
              Prices are shown in full, from {priceNumber(lowestPrice)} XAF.
            </p>
            <ul className="mt-7 grid max-w-[520px] gap-2.5 text-[14.5px] sm:grid-cols-2">
              {['Live classes with your cohort', 'Mentorship and code reviews', 'Portfolio projects', 'Pay monthly with mobile money'].map((f) => (
                <li key={f} className="flex items-center gap-2.5">
                  <Check size={16} strokeWidth={2.5} className="shrink-0 text-[var(--green-deep)]" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <AskAdvisorButton question="Help me choose the right InTelleX programme." className="btn btn-green !px-6">
                <Sparkles size={16} /> Help me choose
              </AskAdvisorButton>
              <Link href="/pricing" className="btn btn-line !px-6">
                Compare pricing
              </Link>
            </div>
          </div>
          <div className="line-card relative flex items-center justify-center overflow-hidden p-8 sm:p-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{ backgroundImage: 'radial-gradient(#e7e9ec 1px, transparent 1px)', backgroundSize: '18px 18px' }}
            />
            <Doodle name="sittingreading" className="relative w-full max-w-[440px]" />
          </div>
        </div>
      </section>

      {/* Category tabs */}
      <nav className="no-scrollbar wrap !max-w-[1200px] flex gap-2 overflow-x-auto pb-2 pt-6 sm:flex-wrap" aria-label="Programme categories">
        <Link href="/programmes" className={chip(!active)}>
          All <span className="ml-1 opacity-60">{PROGRAMMES.length}</span>
        </Link>
        {PROGRAMME_CATEGORIES.map((c) => (
          <Link key={c.id} href={`/programmes?category=${c.id}`} className={chip(active === c.id)}>
            {c.label}
            <span className="ml-1 opacity-60">{PROGRAMMES.filter((p) => p.category === c.id).length}</span>
          </Link>
        ))}
      </nav>

      {groups.map((g) => (
        <section key={g.id} className="wrap !max-w-[1200px] pt-16">
          <div className="mb-6 flex items-end gap-5 border-b border-[#e7e9ec] pb-5">
            <Doodle name={CATEGORY_DOODLE[g.id]} className="h-20 w-auto shrink-0" />
            <div>
              <h2 className="text-[28px] leading-tight sm:text-[34px]">{g.label}</h2>
              <p className="mt-1 text-[15px] text-[#4b5563]">{g.blurb}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {g.items.map((p) => (
              <ProgrammeCard key={p.id} programme={p} />
            ))}
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="wrap !max-w-[1200px] pb-16 pt-24">
        <div className="line-card relative overflow-hidden px-6 py-16 text-center">
          <Doodle name="coffee" className="absolute -bottom-2 left-2 hidden w-[230px] lg:block" />
          <Doodle name="levitate" className="absolute bottom-4 right-2 hidden w-[230px] lg:block" />
          <div className="relative mx-auto max-w-[560px]">
            <h2 className="text-[34px] leading-tight sm:text-[48px]">Not sure where to start?</h2>
            <p className="mx-auto mt-3 max-w-[440px] text-[15.5px] leading-relaxed text-[#4b5563]">
              Tell us your goal and current level, and we will recommend the right programme.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <AskAdvisorButton className="btn btn-line !px-6">
                <Sparkles size={16} /> Ask the AI advisor
              </AskAdvisorButton>
              <a href={orientationWhatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-green !px-6">
                <MessageCircle size={16} /> WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <AdvisorDock />
    </div>
  );
}
