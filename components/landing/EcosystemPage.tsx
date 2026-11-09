import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import TopNav from '@/components/landing/TopNav';
import Footer from '@/components/landing/Footer';
import Reveal from '@/components/Reveal';
import Doodle from '@/components/landing/Doodle';
import { ECOSYSTEM, type EcosystemItem } from '@/lib/ecosystem';

/** Line-art doodle per ecosystem section (replaces the older flat illustrations). */
const SLUG_DOODLE: Record<string, string> = {
  certifications: 'unboxing',
  internships: 'sprinting',
  'junior-dev': 'jumping',
  books: 'reading',
  resources: 'sittingreading',
  learning: 'readingside',
};

function CtaLink({
  href,
  label,
  external,
  primary,
}: {
  href: string;
  label: string;
  external?: boolean;
  primary?: boolean;
}) {
  const cls = primary ? 'btn btn-green' : 'btn btn-line';
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {label} <ArrowUpRight size={16} />
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}

export default function EcosystemPage({ item }: { item: EcosystemItem }) {
  const others = ECOSYSTEM.filter((e) => e.slug !== item.slug);

  return (
    <div className="site airy">
      <TopNav />
      <section className="py-14 sm:py-20">
        <div className="wrap">
          <Link href="/#ecosystem" className="mb-8 inline-flex items-center gap-2 text-sm" style={{ color: 'var(--ink-soft)' }}>
            <ArrowLeft size={15} /> Back to ecosystem
          </Link>

          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <div className="tab mb-4">{item.tab}</div>
              <h1 className="mb-4 text-[34px] leading-[1.05] sm:text-[52px]">{item.title}</h1>
              <p className="mb-6 text-base leading-relaxed sm:text-[17px]" style={{ color: 'var(--ink-soft)' }}>
                {item.body}
              </p>
              <ul className="mb-8 space-y-2.5">
                {item.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[14.5px]">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                      style={{ background: 'var(--green)' }}
                    />
                    <span style={{ color: 'var(--ink-soft)' }}>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <CtaLink {...item.primaryCta} primary />
                {item.secondaryCta && <CtaLink {...item.secondaryCta} />}
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.08}>
              <div className="line-card relative flex aspect-[4/3] items-center justify-center overflow-hidden p-10">
                <div
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{ backgroundImage: 'radial-gradient(#e7e9ec 1px, transparent 1px)', backgroundSize: '18px 18px' }}
                />
                <Doodle name={SLUG_DOODLE[item.slug] || 'readingside'} className="relative max-h-full w-full object-contain" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e7e9ec] bg-[#fafbfa] py-14 sm:py-20">
        <div className="wrap">
          <h2 className="mb-8 font-display text-[22px] sm:text-[26px]">More from the Intellex ecosystem</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((e) => (
              <Link
                key={e.slug}
                href={e.href}
                className="line-card group flex flex-col overflow-hidden transition-colors hover:border-[rgba(0,179,105,0.5)]"
              >
                <div className="flex aspect-[16/10] items-center justify-center border-b border-[#e7e9ec] p-6">
                  <Doodle name={SLUG_DOODLE[e.slug] || 'readingside'} className="max-h-full w-auto" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-1.5 text-[12.5px] font-medium" style={{ color: 'var(--green-deep)' }}>
                    {e.tab}
                  </div>
                  <div className="mb-2 font-display text-[17px] leading-snug group-hover:underline">{e.title}</div>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{e.short}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
