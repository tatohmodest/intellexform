'use client';

import { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { OPEN_ADVISOR_EVENT } from '@/lib/advisor';

const SUGGESTIONS = ['Web development', 'Data analysis', 'Cybersecurity', 'Which skill pays well?'];

/** Hero search box: the visitor's question goes straight to the AI advisor. */
export default function HeroAsk() {
  const [q, setQ] = useState('');

  function ask(text: string) {
    const question = text.trim();
    if (!question) return;
    window.dispatchEvent(new CustomEvent(OPEN_ADVISOR_EVENT, { detail: question }));
    setQ('');
  }

  return (
    <div>
      <form
        className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-[0_12px_32px_-18px_rgba(18,50,79,0.35)]"
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
        }}
      >
        <Search size={19} className="ml-3 shrink-0 text-[var(--ink-soft)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          maxLength={300}
          placeholder="What will you learn?"
          aria-label="Ask what you want to learn"
          className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-[15.5px] outline-none placeholder:text-[var(--ink-soft)]"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-[var(--green)] px-4 py-2.5 text-[14.5px] font-semibold text-white transition-colors hover:bg-[var(--green-deep)]"
        >
          Ask <ArrowRight size={16} />
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s.endsWith('?') ? s : `Tell me about learning ${s.toLowerCase()} at InTelleX`)}
            className="rounded-full bg-white/70 px-3.5 py-1.5 text-[13px] font-medium text-[var(--navy)] transition-colors hover:bg-white"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
