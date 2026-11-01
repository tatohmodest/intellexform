'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Search } from 'lucide-react';
import { useT } from '@/components/i18n/I18nRoot';

const SUGGESTIONS = ['Web development', 'Data analysis', 'Cybersecurity', 'Full Stack Development'];

/** Hero search box: the visitor's question goes straight to the AI advisor. */
export default function HeroAsk() {
  const router = useRouter();
  const t = useT();
  const [q, setQ] = useState('');

  function search(text: string) {
    const query = text.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div>
      <form
        className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-[0_12px_32px_-18px_rgba(18,50,79,0.35)]"
        onSubmit={(e) => {
          e.preventDefault();
          search(q);
        }}
      >
        <Search size={19} className="ml-3 shrink-0 text-[var(--ink-soft)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={300}
          placeholder={t('What will you learn?')}
          aria-label={t('Search courses and tutorials')}
          className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-[15.5px] outline-none placeholder:text-[var(--ink-soft)]"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[var(--green)] px-4 py-2.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-[var(--green-deep)]"
        >
          Search <ArrowRight size={16} />
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => search(s)}
            className="rounded-full bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-[var(--navy)] transition-colors hover:bg-white"
          >
            {t(s)}
          </button>
        ))}
      </div>
    </div>
  );
}
