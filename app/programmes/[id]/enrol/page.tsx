import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import LanguageSwitch from '@/components/i18n/LanguageSwitch';
import EnrolWizard from '@/components/programmes/EnrolWizard';
import { getRequestLocale } from '@/lib/i18n/server';
import { translateUiText } from '@/lib/i18n/translate';
import { PROGRAMMES, getProgramme } from '@/lib/programmes';

export function generateStaticParams() {
  return PROGRAMMES.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const p = getProgramme(params.id);
  const locale = getRequestLocale();
  if (!p) return { title: 'InTelleX' };
  const title = translateUiText(p.title, locale);
  return { title: locale === 'fr' ? `S’inscrire : ${title} - InTelleX` : `Enrol: ${title} - InTelleX`, robots: { index: false } };
}

export default function EnrolPage({ params }: { params: { id: string } }) {
  const p = getProgramme(params.id);
  if (!p) notFound();

  return (
    <div className="site relative min-h-dvh overflow-hidden bg-[#e3e6da]">
      {/* Faint vertical lines, as in the reference */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(90deg, rgba(18,50,79,0.06) 1px, transparent 1px)',
          backgroundSize: '25% 100%',
        }}
      />
      <header className="relative mx-auto flex max-w-[1200px] items-center justify-between px-5 py-5 sm:px-8">
        <BrandLogo href="/" height={30} />
        <div className="flex items-center gap-3">
          <LanguageSwitch />
          <Link
            href={`/programmes/${p.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-4 py-2 text-[13.5px] font-semibold text-[var(--navy)] hover:bg-white"
          >
            <ArrowLeft size={15} /> {p.shortTitle}
          </Link>
        </div>
      </header>
      <main className="relative px-4 pb-16 pt-4 sm:pt-10">
        <EnrolWizard
          programme={{
            id: p.id,
            title: p.title,
            duration: p.duration,
            level: p.level,
            priceXAF: p.priceXAF,
            monthlyXAF: p.monthlyXAF,
            registrationFee: p.registrationFee,
            logoUrl: p.logoUrl,
            categoryLabel: p.categoryLabel,
          }}
        />
      </main>
    </div>
  );
}
