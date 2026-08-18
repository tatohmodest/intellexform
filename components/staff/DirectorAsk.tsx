'use client';

import { useState } from 'react';

const SUGGESTIONS = [
  'How many active students do we have?',
  'How much school fees are outstanding?',
  'Summarize today’s important activities.',
  'Show me the enrollment trend.',
];

export default function DirectorAsk() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);

  async function ask(q: string) {
    const text = q.trim();
    if (!text) return;
    setBusy(true);
    try {
      const res = await fetch('/api/staff/director', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not answer');
      setAnswer(data.answer);
      setQuestion(text);
    } catch (err) {
      setAnswer(err instanceof Error ? err.message : 'Could not answer');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border p-4" style={{ borderColor: 'var(--line)' }}>
      <h2 className="font-display text-[20px]">Ask about the institution</h2>
      <p className="mt-1 mb-3 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
        Answers use live InTelleX records and stay within the director desk.
      </p>
      <form
        className="flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
      >
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="How many active students do we have?"
          className="min-w-0 flex-1 border px-3 py-2.5 text-[14px]"
          style={{ borderColor: 'var(--line)', background: 'transparent' }}
        />
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: '#00B369' }}
        >
          {busy ? 'Thinking…' : 'Ask'}
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            className="border px-2.5 py-1 text-[12px]"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
          >
            {s}
          </button>
        ))}
      </div>
      {answer ? (
        <p className="mt-4 text-[15px] leading-relaxed">{answer}</p>
      ) : null}
    </section>
  );
}
