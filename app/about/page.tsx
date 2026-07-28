import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Building2, Globe2, MapPin, Sparkles } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import BrandLogo from '@/components/BrandLogo';
import JsonLd from '@/components/seo/JsonLd';
import { LOOPING_BINARY } from '@/lib/ecosystem';
import { PLATFORM_CONTACT } from '@/lib/contact';
import {
  CAMEROON_CITIES,
  CAMEROON_REGIONS,
  FOUNDER,
  SITE_GEO,
} from '@/lib/seo/keywords';
import { breadcrumbJsonLd, personCeoJsonLd } from '@/lib/seo/schema';
import { absoluteUrl, buildShareMetadata } from '@/lib/seo/share';

export const metadata: Metadata = {
  ...buildShareMetadata({
    title: 'About InTelleX & CEO Tatoh Modest Wilton',
    description:
      'Meet Tatoh Modest Wilton, Founder & CEO of Looping Binary - the Cameroon company that builds InTelleX. Based in Douala, serving learners nationwide.',
    path: '/about',
    image: '/way_selfpaced.webp',
    imageAlt: 'About InTelleX and Looping Binary - Douala, Cameroon',
    keywords: [
      'Tatoh Modest Wilton',
      'Looping Binary CEO',
      'InTelleX founder',
      'about InTelleX',
      'edtech founder Cameroon',
    ],
  }),
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          personCeoJsonLd(),
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
          ]),
        ]}
      />
      <TopNav />

      <section
        className="relative overflow-hidden py-16 sm:py-20"
        style={{
          background:
            'radial-gradient(900px 420px at 10% -10%, rgba(0,179,105,0.16), transparent 55%), radial-gradient(700px 380px at 95% 0%, rgba(74,144,226,0.12), transparent 50%), var(--paper)',
        }}
      >
        <div className="wrap max-w-[880px]">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm"
            style={{ color: 'var(--ink-soft)' }}
          >
            <ArrowLeft size={15} /> Back to home
          </Link>
          <BrandLogo href="/" height={32} className="mb-5" />
          <div className="tab mb-4">About</div>
          <h1 className="mb-4 font-display text-[30px] leading-[1.12] sm:text-[42px]">
            InTelleX is built in Cameroon for Cameroon - and for anyone ready to learn.
          </h1>
          <p className="max-w-[640px] text-[15.5px] leading-relaxed sm:text-base" style={{ color: 'var(--ink-soft)' }}>
            InTelleX is the learning operating system from{' '}
            <a
              href={LOOPING_BINARY.home}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold"
              style={{ color: 'var(--green-deep)' }}
            >
              Looping Binary
            </a>
            : courses, live mentorship, AI tutoring, and campus tools under one roof. Our home is{' '}
            {SITE_GEO.placename}, with learners and institutions across every region.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/courses" className="btn btn-g">
              Browse courses <ArrowRight size={15} />
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Contact the team
            </Link>
          </div>
        </div>
      </section>

      {/* CEO */}
      <section id="ceo" className="scroll-mt-24 py-14 sm:py-16" style={{ background: 'var(--paper-dim)' }}>
        <div className="wrap grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="tab mb-4 inline-flex items-center gap-1.5">
              <Sparkles size={11} /> Leadership
            </div>
            <h2 className="mb-3 font-display text-[28px] leading-tight sm:text-[34px]">
              {FOUNDER.name}
            </h2>
            <p className="mb-4 text-[14px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--green-deep)' }}>
              {FOUNDER.role} · {FOUNDER.company}
            </p>
            <p className="mb-4 text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              {FOUNDER.shortBio}
            </p>
            <p className="mb-6 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Under his leadership, Looping Binary ships products that turn skills into income -
              from competitive learning at Junior Dev, to internships, to InTelleX as the platform
              where students, mentors, and institutions actually finish the work.
            </p>
            <ul className="mb-8 space-y-3 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
              <li className="flex items-start gap-2.5">
                <Building2 size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                <span>
                  Founded <strong style={{ color: 'var(--ink)' }}>Looping Binary</strong> - parent
                  company of InTelleX, Junior Dev, and the internship program.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                <span>
                  Based in <strong style={{ color: 'var(--ink)' }}>{SITE_GEO.city}</strong>, serving
                  Northwest, Southwest, West, Centre, Littoral and all Cameroon regions.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Globe2 size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                <span>
                  Building African edtech that works in English and French markets - courses,
                  campuses, and certifications.
                </span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <a
                href={FOUNDER.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-g"
              >
                Looping Binary <ArrowRight size={15} />
              </a>
              <a
                href={FOUNDER.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Founder profile
              </a>
              <a href={`mailto:${PLATFORM_CONTACT.email}`} className="btn btn-ghost">
                Email
              </a>
            </div>
          </div>

          <div
            className="rounded-[28px] border p-7 sm:p-9"
            style={{
              borderColor: 'var(--line)',
              background:
                'linear-gradient(165deg, #0C1116 0%, #132019 55%, #0C1116 100%)',
              color: 'rgba(251,248,240,0.88)',
            }}
          >
            <div className="mono text-[11px] uppercase tracking-[0.16em] text-white/50">
              Founder letter
            </div>
            <p className="mt-4 font-display text-[22px] leading-snug text-white sm:text-[26px]">
              &ldquo;We build InTelleX so Cameroonian learners - from Douala to Bamenda, Buea to Yaounde -
              can finish skills that pay.&rdquo;
            </p>
            <p className="mt-6 text-[14px] leading-relaxed text-white/70">
              Looping Binary exists to close the gap between studying and shipping. InTelleX is how
              we put courses, mentors, AI tutoring, and campus tooling in one place - so
              institutions and individuals stop juggling five tools and start completing real work.
            </p>
            <div className="mt-8 border-t border-white/15 pt-5">
              <div className="font-display text-[18px] text-white">{FOUNDER.name}</div>
              <div className="mt-1 text-[12.5px] text-white/55">
                {FOUNDER.role}, {FOUNDER.company} · Builder of {FOUNDER.product}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-14 sm:py-16">
        <div className="wrap">
          <div className="tab mb-3">Nationwide</div>
          <h2 className="mb-3 font-display text-[26px] sm:text-[30px]">
            Built for every region of Cameroon
          </h2>
          <p className="mb-8 max-w-[560px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
            Whether you are in Douala, Yaounde, Bamenda, Buea, Bafoussam or beyond - InTelleX is
            designed for Cameroon&apos;s connectivity, languages, and career paths.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {CAMEROON_REGIONS.map((r) => (
              <div
                key={r.code}
                className="rounded-2xl border px-3.5 py-3"
                style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
              >
                <div className="text-[13.5px] font-semibold">{r.name}</div>
                <div className="mt-0.5 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  {r.fr} · {r.capital}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
            Cities we actively serve include {CAMEROON_CITIES.slice(0, 12).join(', ')}, and more.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div
          className="wrap flex flex-wrap items-center justify-between gap-4 rounded-[24px] px-6 py-7 sm:px-8"
          style={{ background: 'var(--ink)', color: 'rgba(251,248,240,0.85)' }}
        >
          <div>
            <div className="font-display text-[22px] text-white">Ready to learn or partner?</div>
            <p className="mt-1 text-[13.5px] text-white/65">
              Students start free tutorials. Institutions talk to the platform team.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/signup" className="btn btn-g">
              Join InTelleX
            </Link>
            <Link href="/enterprise" className="btn btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>
              For institutions
            </Link>
            <a href={absoluteUrl('/sitemap.xml')} className="btn btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}>
              Sitemap
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
