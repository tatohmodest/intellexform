'use client';

import { useEffect, useState } from 'react';

const TABS = [
  { href: '#learn', label: 'Ways to learn' },
  { href: '#fields', label: 'Fields' },
  { href: '#courses', label: 'Courses' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#ai', label: 'AI Tutor' },
  { href: '#testimonials', label: 'Stories' },
  { href: '#register', label: 'Register' },
];

export default function Rail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    function onScroll() {
      let idx = 0;
      TABS.forEach((t, i) => {
        const el = document.querySelector(t.href) as HTMLElement | null;
        if (el && window.scrollY + 120 >= el.offsetTop) idx = i;
      });
      setActive(idx);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed left-0 top-0 bottom-0 z-40 hidden flex-col items-start lg:flex">
      {TABS.map((t, i) => (
        <a
          key={t.href}
          href={t.href}
          className="font-mono text-[11px] uppercase tracking-[0.12em] no-underline transition-all"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            color: 'var(--paper)',
            background: i === active ? 'var(--green-deep)' : 'var(--ink)',
            padding: '14px 4px',
            paddingRight: i === active ? '8px' : '4px',
            borderRadius: '0 6px 6px 0',
            opacity: i === active ? 1 : 0.55,
          }}
        >
          {t.label}
        </a>
      ))}
    </div>
  );
}
