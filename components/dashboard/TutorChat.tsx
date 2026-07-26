'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Explain CSS flexbox like I\'m 12',
  'How do async/await work in JavaScript?',
  'Quiz me on Python basics',
  'What should I learn to become a backend developer?',
];

/** Minimal markdown-ish renderer: code fences, bold, inline code, dashboard links. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/```/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <pre
            key={i}
            className="mono my-2.5 overflow-x-auto rounded-xl p-3.5 text-[12.5px] leading-relaxed"
            style={{ background: '#0C1116', color: '#d7e2ec' }}
          >
            <code>{part.replace(/^[a-z]*\n/, '')}</code>
          </pre>
        ) : (
          <InlineText key={i} text={part} />
        ),
      )}
    </>
  );
}

function InlineText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, li) => {
        if (!line.trim()) return <div key={li} className="h-2" />;
        // Tokenise **bold**, `code` and /dashboard/... links.
        const tokens = line.split(/(\*\*[^*]+\*\*|`[^`]+`|\/dashboard\/[\w/-]+)/g);
        const isBullet = /^\s*[-•]\s/.test(line);
        return (
          <p key={li} className={`text-[14px] leading-relaxed ${isBullet ? 'pl-4' : ''}`}>
            {tokens.map((tok, ti) => {
              if (tok.startsWith('**') && tok.endsWith('**')) {
                return <strong key={ti}>{tok.slice(2, -2)}</strong>;
              }
              if (tok.startsWith('`') && tok.endsWith('`')) {
                return (
                  <code
                    key={ti}
                    className="mono rounded px-1.5 py-0.5 text-[12.5px]"
                    style={{ background: 'var(--paper-dim)' }}
                  >
                    {tok.slice(1, -1)}
                  </code>
                );
              }
              if (tok.startsWith('/dashboard/')) {
                return (
                  <Link
                    key={ti}
                    href={tok}
                    className="font-semibold underline"
                    style={{ color: 'var(--green-deep)' }}
                  >
                    open lesson →
                  </Link>
                );
              }
              return <span key={ti}>{tok}</span>;
            })}
          </p>
        );
      })}
    </>
  );
}

export default function TutorChat() {
  const params = useSearchParams();
  const topic = params.get('topic');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState(topic ? `Teach me about: ${topic}` : '');
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setInput('');
    const nextMessages: Msg[] = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setBusy(true);
    try {
      const res = await fetch('/api/learn/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      if (!res.ok || !res.body) {
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content: 'Sorry — I hit a snag answering that. Please try again.',
          },
        ]);
        return;
      }
      setMessages((m) => [...m, { role: 'assistant', content: '' }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const current = acc;
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: 'assistant', content: current };
          return copy;
        });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-140px)] max-w-[820px] flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl"
              style={{ background: 'linear-gradient(135deg, rgba(0,179,105,0.16), rgba(74,144,226,0.16))', color: 'var(--green-deep)' }}
            >
              <Bot size={30} />
            </span>
            <h1 className="font-display text-[26px]">Your AI Tutor</h1>
            <p className="mt-2 max-w-md text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Grounded in the Intellex curriculum. Ask anything — it explains step by
              step, links you to the exact lesson, and quizzes you when you&apos;re ready.
            </p>
            <div className="mt-8 grid w-full max-w-lg gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border px-4 py-3 text-left text-[13px] transition-colors hover:bg-[var(--paper-dim)]"
                  style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
                >
                  <Sparkles size={12} className="mb-1.5" style={{ color: 'var(--green-deep)' }} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-5 pt-2">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={
                    m.role === 'user'
                      ? { background: 'var(--paper-dim)', color: 'var(--ink-soft)' }
                      : { background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }
                  }
                >
                  {m.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'text-white' : ''}`}
                  style={
                    m.role === 'user'
                      ? { background: 'var(--ink)' }
                      : { background: 'var(--paper-dim)' }
                  }
                >
                  {m.role === 'user' ? (
                    <p className="text-[14px] leading-relaxed">{m.content}</p>
                  ) : m.content ? (
                    <RichText text={m.content} />
                  ) : (
                    <Loader2 size={16} className="my-1 animate-spin" style={{ color: 'var(--ink-soft)' }} />
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Composer */}
      <div
        className="rounded-2xl border p-2.5"
        style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="Ask your tutor anything…"
            className="max-h-[120px] min-h-[44px] flex-1 resize-none bg-transparent px-3 py-2.5 text-[14px] outline-none"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white transition-opacity disabled:opacity-40"
            style={{ background: 'var(--green)' }}
            aria-label="Send"
          >
            {busy ? <Loader2 size={17} className="animate-spin" /> : <Send size={17} />}
          </button>
        </form>
      </div>
      <p className="mt-2 text-center text-[11.5px]" style={{ color: 'var(--ink-soft)' }}>
        The tutor cites lessons from the Intellex curriculum so you can go deeper.
      </p>
    </div>
  );
}
