'use client';

import { useEffect, useRef, useState } from 'react';
import { Bot, Loader2, Send } from 'lucide-react';

export default function LessonAiAssist({
  courseTitle,
  lessonTitle,
  courseKey,
  lessonKey,
  accent = '#00b369',
}: {
  courseTitle: string;
  lessonTitle: string;
  courseKey: string;
  lessonKey: string;
  accent?: string;
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function ask() {
    const q = input.trim();
    if (!q || busy) return;
    const next = [...messages, { role: 'user' as const, content: q }];
    setMessages(next);
    setInput('');
    setBusy(true);
    try {
      const res = await fetch('/api/learn/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next,
          context: {
            courseTitle,
            lessonTitle,
            courseKey,
            lessonKey,
          },
        }),
      });
      const text = await res.text();
      setMessages((prev) => [...prev, { role: 'assistant', content: text || 'I could not answer just now.' }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Try again in a moment.' },
      ]);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 border px-3 py-2 text-[13px] font-semibold"
        style={{ borderColor: accent, color: accent }}
      >
        <Bot size={14} /> Ask AI about this lesson
      </button>
    );
  }

  return (
    <div className="border p-3" style={{ borderColor: 'var(--line)' }}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold">
          <Bot size={14} style={{ color: accent }} /> In-course AI
        </p>
        <button
          type="button"
          className="text-[12px] font-semibold"
          style={{ color: 'var(--ink-soft)' }}
          onClick={() => setOpen(false)}
        >
          Close
        </button>
      </div>
      <p className="mb-3 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
        Context: {courseTitle} · {lessonTitle}
      </p>
      <div className="mb-3 max-h-48 space-y-2 overflow-y-auto text-[13px]">
        {messages.length === 0 ? (
          <p style={{ color: 'var(--ink-soft)' }}>Ask for an explanation, example, or quick check.</p>
        ) : (
          messages.map((m, i) => (
            <div key={i}>
              <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                {m.role === 'user' ? 'You' : 'AI'}
              </span>
              <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-2">
        <input
          className="form-input !rounded-none flex-1 text-[13px]"
          placeholder="Explain this concept…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void ask();
          }}
        />
        <button
          type="button"
          disabled={busy || !input.trim()}
          onClick={ask}
          className="inline-flex items-center gap-1 px-3 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
          style={{ background: accent }}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </div>
    </div>
  );
}
