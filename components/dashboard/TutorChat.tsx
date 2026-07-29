'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUp,
  BookOpen,
  Bot,
  Lightbulb,
  Loader2,
  Sparkles,
  Zap,
} from 'lucide-react';
import HighlightedCode from '@/components/HighlightedCode';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  {
    icon: Lightbulb,
    label: 'Explain simply',
    prompt: "Explain CSS flexbox like I'm 12 - with a tiny example I can try.",
  },
  {
    icon: Zap,
    label: 'Quiz me',
    prompt: 'Quiz me on JavaScript - one question at a time, and grade my answers.',
  },
  {
    icon: BookOpen,
    label: 'Build my plan',
    prompt: 'Make a 3-week learning plan to become a backend developer on InTelleX.',
  },
  {
    icon: Sparkles,
    label: 'Debug with me',
    prompt: 'Walk me through debugging a React useEffect infinite loop step by step.',
  },
];

function visibleTutorText(text: string): string {
  return text
    .replace(/<!--intellex-quiz:[\s\S]*?-->/g, '')
    .replace(/<!--intellex-plan:[\s\S]*?-->/g, '')
    .trim();
}

function RichText({ text }: { text: string }) {
  const parts = visibleTutorText(text).split(/```/);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 1) {
          const langMatch = part.match(/^([a-zA-Z0-9+#.-]*)\n/);
          const language = langMatch?.[1] || 'javascript';
          const code = langMatch
            ? part.slice(langMatch[0].length)
            : part.replace(/^[a-zA-Z0-9+#.-]*\n/, '');
          return (
            <pre
              key={i}
              className="mono notranslate my-3 overflow-x-auto p-4 text-[12.5px] leading-relaxed"
              style={{ background: '#0C1116', color: '#d7e2ec' }}
              translate="no"
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

function renderInlineTokens(line: string) {
  return line.split(LINK_RE).map((tok, ti) => {
    if (!tok) return null;
    if (tok.startsWith('**') && tok.endsWith('**')) {
      return <strong key={ti}>{tok.slice(2, -2)}</strong>;
    }
    if (tok.startsWith('`') && tok.endsWith('`')) {
      return (
        <code
          key={ti}
          className="mono notranslate px-1.5 py-0.5 text-[12.5px]"
          style={{ background: 'rgba(47, 111, 173, 0.10)', color: '#1f5fa8' }}
          translate="no"
        >
          {tok.slice(1, -1)}
        </code>
      );
    }
    if (tok.startsWith('http://') || tok.startsWith('https://')) {
      return (
        <a key={ti} href={tok} target="_blank" rel="noopener noreferrer" className={linkClass(tok)}>
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
  });
}

function InlineText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, li) => {
        if (!line.trim()) return <div key={li} className="h-2.5" />;
        const isBullet = /^\s*[-•]\s/.test(line);
        const isHeading = /^#{1,3}\s/.test(line);
        const clean = isHeading ? line.replace(/^#{1,3}\s/, '') : line;
        return (
          <p
            key={li}
            className={`leading-relaxed ${
              isHeading
                ? 'font-display text-[17px] font-semibold sm:text-[18px]'
                : 'text-[14.5px] sm:text-[15px]'
            } ${isBullet ? 'pl-4' : ''}`}
          >
            {renderInlineTokens(clean)}
          </p>
        );
      })}
    </>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 py-1" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: 'var(--ink)' }}
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.16 }}
        />
      ))}
    </span>
  );
}

export default function TutorChat() {
  const params = useSearchParams();
  const topic = params.get('topic');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState(topic ? `Teach me about: ${topic}` : '');
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 24), 140)}px`;
  }, [input]);

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
      textareaRef.current?.focus();
    }
  }

  const empty = messages.length === 0;
  const canSend = Boolean(input.trim()) && !busy;

  return (
    <div className="relative mx-auto flex min-h-[calc(100dvh-140px)] max-w-[1080px] flex-col overflow-x-hidden">
      {/* Editorial header - same language as My Courses */}
      <header
        className={`shrink-0 ${empty ? 'mb-2 border-b pb-8' : 'mb-0 border-b pb-5'}`}
        style={{ borderColor: 'var(--line)' }}
      >
        {empty ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em]"
              style={{ color: 'var(--ink-soft)' }}
            >
              Your curriculum · interactive tutor
            </p>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-[520px]">
                <h1 className="font-display text-[40px] leading-[0.95] tracking-tight sm:text-[52px]">
                  InTelleX
                  <br />
                  AI
                </h1>
                <p
                  className="mt-4 text-[15px] leading-relaxed"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  Quiz you. Build a plan. Explain anything. Debug with you. Same editorial feel as
                  My Courses - built to make you want the next question.
                </p>
              </div>
              <div
                className="flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.12em]"
                style={{ color: 'var(--ink-soft)' }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Bot size={12} /> Live
                </span>
                <span style={{ color: 'var(--line)' }}>·</span>
                <span>Grounded answers</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p
                className="font-mono text-[10.5px] uppercase tracking-[0.16em]"
                style={{ color: 'var(--ink-soft)' }}
              >
                InTelleX AI · session
              </p>
              <h1 className="font-display text-[22px] leading-tight sm:text-[26px]">Keep going</h1>
            </div>
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setInput('');
              }}
              className="shrink-0 px-3 py-2 text-[12.5px] font-semibold transition-colors hover:bg-[var(--paper-dim)]"
              style={{ color: 'var(--ink-soft)' }}
            >
              New chat
            </button>
          </div>
        )}
      </header>

      {/* Thread */}
      <div
        ref={listRef}
        className={`min-h-0 flex-1 ${empty ? 'pt-8' : 'pt-6'} pb-[calc(7.75rem+env(safe-area-inset-bottom,0px))] lg:pb-32`}
      >
        {empty ? (
          <section>
            <div className="mb-4">
              <h2 className="font-display text-[19px] leading-tight sm:text-[24px]">Start here</h2>
              <p className="mt-0.5 text-[13px] sm:text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                Tap a prompt - or type your own below
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SUGGESTIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.button
                    key={s.label}
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, duration: 0.3 }}
                    onClick={() => send(s.prompt)}
                    className="group flex h-full min-w-0 flex-col bg-paper p-4 text-left transition-shadow hover:shadow-card"
                    style={{ border: '1px solid var(--ink)' }}
                  >
                    <span
                      className="mb-3 inline-flex h-9 w-9 items-center justify-center"
                      style={{
                        background: 'var(--paper-dim)',
                        color: 'var(--ink)',
                      }}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="font-display text-[16px] font-semibold leading-snug sm:text-[17px]">
                      {s.label}
                    </span>
                    <span
                      className="mt-1.5 line-clamp-2 text-[13px] leading-snug"
                      style={{ color: 'var(--ink-soft)' }}
                    >
                      {s.prompt}
                    </span>
                    <span
                      className="mt-3 text-[12px] font-semibold uppercase tracking-[0.1em]"
                      style={{ color: 'var(--green-deep)' }}
                    >
                      Ask this →
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="mx-auto max-w-[720px] space-y-7">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {m.role === 'user' ? (
                    <div className="flex justify-end">
                      <div
                        className="max-w-[88%] px-4 py-3 text-[14.5px] leading-relaxed text-white sm:max-w-[75%]"
                        style={{ background: 'var(--ink)' }}
                      >
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <span
                        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center"
                        style={{ background: 'var(--paper-dim)', color: 'var(--ink)' }}
                      >
                        <Bot size={15} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.14em]"
                          style={{ color: 'var(--ink-soft)' }}
                        >
                          InTelleX AI
                        </p>
                        {m.content ? (
                          <div>
                            <RichText text={m.content} />
                            {busy && i === messages.length - 1 && (
                              <span
                                className="ml-0.5 inline-block h-[1.05em] w-[2px] animate-pulse align-middle"
                                style={{ background: 'var(--ink)' }}
                              />
                            )}
                          </div>
                        ) : (
                          <TypingDots />
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/*
        Fixed composer above mobile bottom nav.
        Zero borders / outlines / rings - soft lift only.
      */}
      <div
        className="pointer-events-none fixed inset-x-0 z-30 px-3 bottom-[calc(4.65rem+env(safe-area-inset-bottom,0px)+0.35rem)] sm:px-6 lg:bottom-5 lg:left-[268px] lg:px-10"
      >
        <div className="pointer-events-auto mx-auto w-full max-w-[720px]">
          <div
            className="pointer-events-none absolute inset-x-0 -top-12 h-12"
            style={{ background: 'linear-gradient(to top, var(--paper), transparent)' }}
            aria-hidden
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-end gap-2 bg-[var(--paper)] px-1 py-1"
            style={{
              boxShadow: '0 16px 48px rgba(12, 17, 22, 0.14)',
            }}
          >
            <label className="min-w-0 flex-1 bg-[var(--paper-dim)] px-4 py-3">
              <span className="sr-only">Ask InTelleX AI</span>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Ask InTelleX AI…"
                className="max-h-[140px] min-h-[24px] w-full resize-none border-0 bg-transparent p-0 text-[15px] leading-relaxed shadow-none outline-none ring-0 placeholder:text-[var(--ink-soft)] focus:border-0 focus:outline-none focus:ring-0"
                style={{
                  color: 'var(--ink)',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  WebkitAppearance: 'none',
                }}
              />
            </label>
            <button
              type="submit"
              disabled={!canSend}
              className="mb-0 flex h-12 w-12 shrink-0 items-center justify-center text-white transition-opacity disabled:opacity-30"
              style={{ background: canSend ? 'var(--green)' : 'var(--ink-soft)' }}
              aria-label="Send"
            >
              {busy ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <ArrowUp size={18} strokeWidth={2.5} />
              )}
            </button>
          </form>
          <p
            className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.12em]"
            style={{ color: 'var(--ink-soft)' }}
          >
            Enter to send · Shift+Enter for a new line
          </p>
        </div>
      </div>
    </div>
  );
}
