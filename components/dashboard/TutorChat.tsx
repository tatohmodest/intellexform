'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react';
import HighlightedCode from '@/components/HighlightedCode';

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

/** Markdown-ish renderer: colored code fences, bold, inline code, colorful links. */
function RichText({ text }: { text: string }) {
  const parts = text.split(/```/);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          const langMatch = part.match(/^([a-zA-Z0-9+#.-]*)\n/);
          const language = langMatch?.[1] || 'javascript';
          const code = langMatch ? part.slice(langMatch[0].length) : part.replace(/^[a-zA-Z0-9+#.-]*\n/, '');
          return (
            <pre
              key={i}
              className="mono my-2.5 overflow-x-auto border p-3.5 text-[12.5px] leading-relaxed"
              style={{ background: '#0C1116', color: '#d7e2ec', borderColor: '#1a222c' }}
            >
              <HighlightedCode code={code} language={language} />
            </pre>
          );
        }
        return <InlineText key={i} text={part} />;
      })}
    </>
  );
}

const LINK_RE =
  /(\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s)<>]+|\/(?:dashboard|tutorials|courses|certifications|ecosystem|enterprise|books|resources|junior-dev|internships|learning|contact|network)[\w/?#&=%.-]*)/g;

function linkClass(href: string) {
  if (href.includes('/tutorials') || href.includes('/courses')) return 'tutor-link-green';
  if (href.startsWith('http')) return 'tutor-link-amber';
  return 'tutor-link';
}

function linkLabel(href: string) {
  if (href.startsWith('/dashboard/courses/')) return 'open lesson →';
  if (href.startsWith('/tutorials/')) return 'open tutorial →';
  if (href.startsWith('/courses/')) return 'view course →';
  if (href.startsWith('http')) {
    try {
      return new URL(href).hostname.replace(/^www\./, '');
    } catch {
      return 'open link →';
    }
  }
  return 'open →';
}

function InlineText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, li) => {
        if (!line.trim()) return <div key={li} className="h-2" />;
        const tokens = line.split(LINK_RE);
        const isBullet = /^\s*[-•]\s/.test(line);
        return (
          <p key={li} className={`text-[14px] leading-relaxed ${isBullet ? 'pl-4' : ''}`}>
            {tokens.map((tok, ti) => {
              if (!tok) return null;
              if (tok.startsWith('**') && tok.endsWith('**')) {
                return <strong key={ti}>{tok.slice(2, -2)}</strong>;
              }
              if (tok.startsWith('`') && tok.endsWith('`')) {
                return (
                  <code
                    key={ti}
                    className="mono px-1.5 py-0.5 text-[12.5px]"
                    style={{ background: 'rgba(47, 111, 173, 0.10)', color: '#1f5fa8' }}
                  >
                    {tok.slice(1, -1)}
                  </code>
                );
              }
              if (tok.startsWith('http://') || tok.startsWith('https://')) {
                return (
                  <a
                    key={ti}
                    href={tok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass(tok)}
                  >
                    {linkLabel(tok)}
                  </a>
                );
              }
              if (tok.startsWith('/')) {
                return (
                  <Link key={ti} href={tok} className={linkClass(tok)}>
                    {linkLabel(tok)}
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
            content: 'Sorry - I hit a snag answering that. Please try again.',
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
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-[1080px] flex-col overflow-x-hidden">
      {/* My Courses-style editorial header */}
      <header className="mb-2 border-b pb-8" style={{ borderColor: 'var(--line)' }}>
        <p
          className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--ink-soft)' }}
        >
          Curriculum · grounded answers
        </p>
        <h1 className="font-display text-[40px] leading-[0.95] tracking-tight sm:text-[52px]">
          AI
          <br />
          Tutor
        </h1>
        <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
          Ask anything about what you are learning. It explains step by step, links the exact
          lesson, and quizzes you when you are ready.
        </p>
      </header>

      <div
        className="mb-8 flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="max-w-[520px]">
          <p
            className="font-mono text-[11px] uppercase tracking-[0.18em]"
            style={{ color: 'var(--ink-soft)' }}
          >
            Free to use · cites InTelleX lessons
          </p>
          <p className="mt-2 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Pick a prompt below or type your own question - answers link straight into your
            courses and tutorials.
          </p>
        </div>
        <div
          className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--ink-soft)' }}
        >
          <span className="inline-flex items-center gap-1.5">
            <Bot size={12} /> Live tutor
          </span>
          <span style={{ color: 'var(--line)' }}>·</span>
          <span>{messages.length} messages</span>
        </div>
      </div>

      {/* Chat + composer */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-[280px] flex-1 overflow-y-auto pb-6">
          {messages.length === 0 ? (
            <section>
              <div className="mb-3.5 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display text-[19px] leading-tight sm:text-[24px]">
                    Suggested prompts
                  </h2>
                  <p className="mt-0.5 text-[13px] sm:text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                    Start with one of these, or write your own below
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="group flex h-full min-w-0 flex-col border bg-paper p-4 text-left transition-shadow hover:shadow-card"
                    style={{ borderColor: 'var(--ink)' }}
                  >
                    <span
                      className="mb-3 inline-flex h-9 w-9 items-center justify-center border"
                      style={{
                        borderColor: 'var(--line)',
                        background: 'rgba(0,179,105,0.10)',
                        color: 'var(--green-deep)',
                      }}
                    >
                      <Sparkles size={16} />
                    </span>
                    <span className="font-display text-[16px] font-semibold leading-snug sm:text-[17px]">
                      {s}
                    </span>
                    <span
                      className="mt-3 text-[12px] font-semibold uppercase tracking-[0.1em]"
                      style={{ color: 'var(--green-deep)' }}
                    >
                      Ask this →
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ) : (
            <div className="space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center border"
                    style={
                      m.role === 'user'
                        ? { background: 'var(--ink)', color: '#fff', borderColor: 'var(--ink)' }
                        : {
                            background: 'rgba(0,179,105,0.10)',
                            color: 'var(--green-deep)',
                            borderColor: 'var(--line)',
                          }
                    }
                  >
                    {m.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                  </span>
                  <div
                    className={`max-w-[min(100%,720px)] flex-1 border px-4 py-3 ${
                      m.role === 'user' ? 'text-white' : ''
                    }`}
                    style={
                      m.role === 'user'
                        ? { background: 'var(--ink)', borderColor: 'var(--ink)' }
                        : { background: 'var(--paper)', borderColor: 'var(--line)' }
                    }
                  >
                    <p
                      className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em]"
                      style={{
                        color: m.role === 'user' ? 'rgba(255,255,255,0.55)' : 'var(--ink-soft)',
                      }}
                    >
                      {m.role === 'user' ? 'You' : 'AI Tutor'}
                    </p>
                    {m.role === 'user' ? (
                      <p className="text-[14px] leading-relaxed">{m.content}</p>
                    ) : m.content ? (
                      <RichText text={m.content} />
                    ) : (
                      <Loader2
                        size={16}
                        className="my-1 animate-spin"
                        style={{ color: 'var(--ink-soft)' }}
                      />
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Composer — underline / sharp border like My Courses search */}
        <div className="sticky bottom-0 border-t pt-4" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-end gap-3 border p-3 sm:p-4"
            style={{ borderColor: 'var(--ink)', background: 'var(--paper)' }}
          >
            <label className="min-w-0 flex-1">
              <span className="sr-only">Ask the AI Tutor</span>
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
                className="max-h-[120px] min-h-[44px] w-full resize-none bg-transparent py-2.5 text-[15px] outline-none"
                style={{ color: 'var(--ink)' }}
              />
            </label>
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 px-4 text-[13px] font-semibold text-white transition-opacity disabled:opacity-40 sm:px-5"
              style={{ background: 'var(--green)' }}
              aria-label="Send"
            >
              {busy ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
            Cites InTelleX lessons · Enter to send · Shift+Enter for a new line
          </p>
        </div>
      </div>
    </div>
  );
}
