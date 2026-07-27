import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Check,
  Layers,
  Lock,
  Mail,
  MessageCircle,
  Network,
  ShieldCheck,
} from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import Reveal from '@/components/Reveal';
import BrandLogo from '@/components/BrandLogo';
import { GOLDEN_RULE } from '@/lib/eduos/governance';
import { DEPLOYMENT_CHOICES } from '@/lib/eduos/federation';
import { MODULE_CATALOG } from '@/lib/eduos/capabilities';
import {
  COMMERCIAL_PLANS,
  PLATFORM_FUNCTIONALITIES,
  type CommercialPlanId,
} from '@/lib/eduos/plans';
import {
  PLATFORM_CONTACT,
  institutionMailto,
  institutionWhatsappLink,
} from '@/lib/contact';

export const metadata = {
  title: 'Enterprise & Institutions - InTelleX',
  description:
    'Digital campus for schools, academies, and companies. Core infrastructure, capability plans, pricing, and Platform Team onboarding.',
};

const PLAN_ORDER: CommercialPlanId[] = [
  'starter',
  'builder',
  'pro',
  'enterprise',
  'institution',
];

export default function EnterprisePage() {
  return (
    <>
      <TopNav />

      <section
        className="relative overflow-hidden border-b text-white"
        style={{
          borderColor: 'var(--line)',
          background: 'linear-gradient(120deg, #00b369 0%, #0C1116 68%)',
        }}
      >
        <div className="wrap relative py-14 sm:py-20">
          <BrandLogo href="/" height={34} className="mb-8 brightness-0 invert" />
          <Reveal className="max-w-[720px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">
              Enterprise · Institutions · Companies
            </p>
            <h1 className="mt-3 font-display text-[34px] leading-[0.95] tracking-tight sm:text-[48px]">
              Your digital campus on InTelleX
            </h1>
            <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/75">
              Schools, academies, and companies get a branded campus - students, teachers, courses,
              exams, AI, and library - provisioned by the Platform Team. Never self-serve chaos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact?type=institution"
                className="inline-flex items-center gap-2 px-5 py-3 text-[13.5px] font-semibold"
                style={{ background: '#fff', color: 'var(--ink)' }}
              >
                Talk to Platform Team <ArrowRight size={14} />
              </Link>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 border border-white/35 px-5 py-3 text-[13.5px] font-semibold text-white"
              >
                See plans & pricing
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="wrap grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: Network,
              title: 'Core layer',
              body: 'Identity, verification, discovery, API gateway, marketplace, AI - never grades or private exams.',
            },
            {
              icon: Building2,
              title: 'Institution layer',
              body: 'Teachers, students, courses, grades, finance, and research stay under campus ownership.',
            },
            {
              icon: Lock,
              title: 'Isolation by design',
              body: 'Campus A never sees Campus B students or analytics. Cross-checks go through the gateway.',
            },
          ].map((c) => (
            <div key={c.title} className="border p-6" style={{ borderColor: 'var(--line)' }}>
              <c.icon size={22} style={{ color: 'var(--green-deep)' }} />
              <h2 className="mt-4 font-display text-[20px]">{c.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
        <p className="wrap mt-8 max-w-3xl text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          <ShieldCheck size={14} className="mr-1.5 inline" style={{ color: 'var(--green-deep)' }} />
          {GOLDEN_RULE}
        </p>
      </section>

      <section
        id="capabilities"
        className="scroll-mt-24 border-t py-12 sm:py-16"
        style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
      >
        <div className="wrap">
          <div className="mb-8 max-w-[720px]">
            <Layers size={26} style={{ color: 'var(--green-deep)' }} />
            <h2 className="mt-3 font-display text-[26px] sm:text-[32px]">What institutions get</h2>
            <p className="mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Full product map - Core is always on. Capabilities unlock by plan or custom
              provisioning.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PLATFORM_FUNCTIONALITIES.map((g) => (
              <div key={g.group} className="border bg-paper p-5" style={{ borderColor: 'var(--line)' }}>
                <h3 className="font-display text-[18px]">{g.group}</h3>
                <ul className="mt-3 space-y-1.5 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  {g.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="modules" className="border-t py-12 sm:py-16" style={{ borderColor: 'var(--line)' }}>
        <div className="wrap">
          <h2 className="font-display text-[26px] sm:text-[30px]">Capability modules</h2>
          <p className="mt-2 max-w-2xl text-[15px]" style={{ color: 'var(--ink-soft)' }}>
            Assemble what your campus needs - Course Studio, Assessment, AI, live teaching, and more.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODULE_CATALOG.map((m) => (
              <div key={m.id} className="border p-4" style={{ borderColor: 'var(--line)' }}>
                <h3 className="font-semibold">{m.name}</h3>
                <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  {m.tagline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="scroll-mt-24 border-t py-12 sm:py-16"
        style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
      >
        <div className="wrap">
          <h2 className="font-display text-[26px] sm:text-[32px]">Plans & pricing</h2>
          <p className="mt-2 max-w-2xl text-[15px]" style={{ color: 'var(--ink-soft)' }}>
            Starter → Builder → Pro → Enterprise → Institution. Final quotes and billing cycle
            (monthly / yearly) are confirmed during Platform onboarding.
          </p>
          <div className="mt-10 grid gap-4 lg:grid-cols-5 md:grid-cols-2">
            {PLAN_ORDER.map((id) => {
              const p = COMMERCIAL_PLANS[id];
              const featured = id === 'pro';
              return (
                <div
                  key={id}
                  className="flex flex-col border bg-paper p-5"
                  style={{
                    borderColor: featured ? 'var(--green-deep)' : 'var(--line)',
                    boxShadow: featured ? '0 0 0 1px var(--green-deep)' : undefined,
                  }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--green-deep)' }}>
                    {id}
                  </p>
                  <h3 className="mt-1 font-display text-[20px]">{p.name}</h3>
                  <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    {p.summary}
                  </p>
                  <p className="mt-4 font-display text-[18px]">{p.priceLabel}</p>
                  <p className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                    {p.billing.join(' · ')}
                  </p>
                  <ul className="mt-4 flex-1 space-y-1.5 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    {p.highlights.map((h) => (
                      <li key={h} className="flex gap-1.5">
                        <Check size={13} className="mt-0.5 shrink-0" style={{ color: 'var(--green-deep)' }} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t py-12 sm:py-16" style={{ borderColor: 'var(--line)' }}>
        <div className="wrap">
          <h2 className="font-display text-[24px] sm:text-[28px]">Deployment options</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(DEPLOYMENT_CHOICES).map(([id, d]) => (
              <div key={id} className="border p-4" style={{ borderColor: 'var(--line)' }}>
                <h3 className="font-semibold">{d.label}</h3>
                <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  {d.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="partner" className="border-t py-14 sm:py-16" style={{ borderColor: 'var(--line)', background: 'var(--ink)', color: 'var(--paper)' }}>
        <div className="wrap flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
              Platform Team
            </p>
            <h2 className="mt-2 font-display text-[28px] leading-tight">Onboard your institution</h2>
            <p className="mt-3 text-[14.5px] text-white/70">
              We send an email-bound onboarding link with your plan. You fill campus details and
              choose allowed capabilities - we provision. Contact:{' '}
              {PLATFORM_CONTACT.email}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact?type=institution"
              className="inline-flex items-center gap-2 px-5 py-3 text-[13.5px] font-semibold"
              style={{ background: 'var(--green)', color: '#fff' }}
            >
              Contact form
            </Link>
            <a
              href={institutionMailto()}
              className="inline-flex items-center gap-2 border border-white/30 px-5 py-3 text-[13.5px] font-semibold"
            >
              <Mail size={15} /> Email
            </a>
            <a
              href={institutionWhatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/30 px-5 py-3 text-[13.5px] font-semibold"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
