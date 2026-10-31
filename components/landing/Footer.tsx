'use client';

import Link from 'next/link';
import { PLATFORM_CONTACT, generalWhatsappLink, platformMailto } from '@/lib/contact';
import BrandLogo from '@/components/BrandLogo';
import { useT } from '@/components/i18n/I18nRoot';

const COLUMNS: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: 'Programmes',
    links: [
      { href: '/programmes', label: 'All programmes' },
      { href: '/programmes?category=software', label: 'Software Development' },
      { href: '/programmes?category=data', label: 'Data & AI' },
      { href: '/programmes?category=security', label: 'Cybersecurity' },
      { href: '/programmes?category=foundations', label: 'Foundations' },
      { href: '/#how-it-works', label: 'How enrolment works' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/courses', label: 'Self-paced library' },
      { href: '/tutorials', label: 'Free tutorials' },
      { href: '/books', label: 'Books' },
      { href: '/certifications', label: 'Certificates' },
      { href: '/resources', label: 'Free resources' },
      { href: '/membership', label: 'Library membership' },
    ],
  },
  {
    title: 'InTelleX',
    links: [
      { href: '/about', label: 'About us' },
      { href: '/#instructors', label: 'Our instructors' },
      { href: '/dashboard/mentor', label: 'Teach with us' },
      { href: '/junior-dev', label: 'Junior Dev' },
      { href: '/internships', label: 'Internships' },
      { href: '/enterprise', label: 'For institutions' },
      { href: 'https://loopingbinary.com', label: 'Looping Binary', external: true },
    ],
  },
];

export default function Footer() {
  const tr = useT();
  return (
    <footer style={{ background: 'var(--ink)', color: 'rgba(255,255,255,0.62)' }} className="pb-10 pt-16">
      <div className="wrap">
        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.1fr]">
          <div className="max-w-[300px]">
            <BrandLogo href="/" height={36} variant="footer" className="brightness-0 invert" />
            <p className="mt-4 text-[14px] leading-relaxed">
              {tr('Learn. Teach. Empower. An online school by Looping Binary, built in Douala, Cameroon.')}
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h5 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-white">{tr(col.title)}</h5>
              {col.links.map((l) =>
                l.external ? (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-2.5 block text-[14px] transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link key={l.href} href={l.href} className="mb-2.5 block text-[14px] transition-colors hover:text-white">
                    {tr(l.label)}
                  </Link>
                ),
              )}
            </div>
          ))}
          <div>
            <h5 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-white">{tr('Contact')}</h5>
            <a
              href={generalWhatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-2.5 block text-[14px] transition-colors hover:text-white"
            >
              WhatsApp {PLATFORM_CONTACT.phoneDisplay}
            </a>
            <a href={platformMailto()} className="mb-2.5 block break-all text-[14px] transition-colors hover:text-white">
              {PLATFORM_CONTACT.email}
            </a>
            <Link href="/contact" className="mb-2.5 block text-[14px] transition-colors hover:text-white">
              {tr('Contact form')}
            </Link>
            <p className="mt-4 text-[13px]">{tr('Douala, Cameroon')}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 pt-6 text-[12.5px]" style={{ color: 'rgba(255,255,255,0.45)' }}>
          <span>{tr('© 2026 InTelleX, a Looping Binary company.')}</span>
          <span className="flex gap-5">
            <Link href="/about" className="hover:text-white">{tr('About')}</Link>
            <a href="/sitemap.xml" className="hover:text-white">{tr('Sitemap')}</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
