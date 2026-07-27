import Link from 'next/link';
import { Building2, Lock, Network, ShieldCheck, Waypoints } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import Reveal from '@/components/Reveal';
import BrandLogo from '@/components/BrandLogo';
import { GOLDEN_RULE } from '@/lib/eduos/governance';
import { DEPLOYMENT_CHOICES } from '@/lib/eduos/federation';

export const metadata = {
  title: 'Institution Network — InTelleX',
  description:
    'InTelleX federated institution network: schools own their data, InTelleX owns trust, identity, and the Education Cloud.',
};

export default function NetworkPage() {
  return (
    <>
      <TopNav />
      <section className="border-b py-14 sm:py-20" style={{ borderColor: 'var(--line)' }}>
        <div className="wrap">
          <BrandLogo href="/" height={34} className="mb-6" />
          <Reveal className="max-w-[720px]">
            <div className="tab mb-3">Federated network</div>
            <h1 className="mb-4 text-[32px] leading-[1.08] sm:text-[44px]">
              Institutions plug in. They don&apos;t surrender their database.
            </h1>
            <p className="text-[16px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              InTelleX is the Education Cloud: identity, verification, discovery, AI routing, and governance.
              Academic records stay with each campus — Shared SaaS, managed cloud, customer-hosted, or hybrid.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="wrap grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: Network,
              title: 'Core layer',
              body: 'Registry, auth, applications, API gateway, marketplace, global search — never grades or private exams.',
            },
            {
              icon: Building2,
              title: 'Institution layer',
              body: 'Teachers, students, courses, grades, finance, and research stay under campus ownership.',
            },
            {
              icon: Lock,
              title: 'Isolation by design',
              body: 'Campus A never sees Campus B’s students or analytics. Cross-checks go through the gateway.',
            },
          ].map((c) => (
            <div key={c.title} className="rounded-[18px] border p-6" style={{ borderColor: 'var(--line)' }}>
              <c.icon size={22} style={{ color: 'var(--green-deep)' }} />
              <h2 className="mt-4 font-display text-[20px]">{c.title}</h2>
              <p className="mt-2 text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t py-12 sm:py-16" style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}>
        <div className="wrap">
          <h2 className="mb-6 font-display text-[24px] sm:text-[28px]">Deployment models</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(DEPLOYMENT_CHOICES).map(([key, val]) => (
              <div key={key} className="rounded-[16px] border bg-paper p-5" style={{ borderColor: 'var(--line)' }}>
                <div className="font-mono text-[10.5px] uppercase tracking-[0.12em]" style={{ color: 'var(--green-deep)' }}>
                  {key}
                </div>
                <h3 className="mt-1.5 font-display text-[17px]">{val.label}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{val.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="wrap max-w-[720px]">
          <ShieldCheck size={28} style={{ color: 'var(--green-deep)' }} />
          <h2 className="mt-4 font-display text-[24px]">Golden rule</h2>
          <p className="mt-3 text-[15.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {GOLDEN_RULE}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard/institutions" className="btn btn-primary">
              <Waypoints size={15} /> Apply to open a campus
            </Link>
            <Link href="/ecosystem" className="btn btn-ghost">Back to ecosystem</Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
