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

/** Strip engine state markers so learners never see quiz/plan payloads. */
function visibleTutorText(text: string): string {
  return text
    .replace(/<!--intellex-quiz:[\s\S]*?-->/g, '')
    .replace(/<!--intellex-plan:[\s\S]*?-->/g, '')
    .trim();
}

/** Markdown-ish renderer: colored code fences, bold, inline code, colorful links. */
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
              className="mono my-3 overflow-x-auto rounded-2xl p-4 text-[12.5px] leading-relaxed"
              style={{ background: '#0C1116', color: '#d7e2ec' }}
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
          className="mono rounded-md px-1.5 py-0.5 text-[12.5px]"
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
    <span className="inline-flex items-center gap-1 py-1" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: 'var(--green-deep)' }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
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
  const [focused, setFocused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
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

  return (
    <div className="relative mx-auto flex min-h-[calc(100dvh-140px)] max-w-[820px] flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-90"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,179,105,0.14), transparent 55%), radial-gradient(ellipse 50% 40% at 100% 10%, rgba(74,144,226,0.10), transparent 50%)',
        }}
      />

      <header
        className={`shrink-0 ${empty ? 'pb-2 pt-2 text-center sm:pt-6' : 'border-b pb-5'}`}
        style={{ borderColor: 'var(--line)' }}
      >
        {empty ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-lg"
          >
            <span
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px]"
              style={{
                background:
                  'linear-gradient(145deg, rgba(0,179,105,0.22), rgba(74,144,226,0.16))',
                color: 'var(--green-deep)',
                boxShadow: '0 12px 40px rgba(0,179,105,0.18)',
              }}
            >
              <Bot size={30} />
            </span>
            <p
              className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em]"
              style={{ color: 'var(--green-deep)' }}
            >
              InTelleX AI · ready when you are
            </p>
            <h1 className="font-display text-[34px] leading-[1.05] tracking-tight sm:text-[44px]">
              What do you want
              <br />
              to learn next?
            </h1>
            <p
              className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed"
              style={{ color: 'var(--ink-soft)' }}
            >
              Quiz you. Build a plan. Explain anything. Debug with you. Grounded in the InTelleX
              curriculum - interactive like a real tutor.
            </p>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p
                className="font-mono text-[10.5px] uppercase tracking-[0.16em]"
                style={{ color: 'var(--ink-soft)' }}
              >
                InTelleX AI · live
              </p>
              <h1 className="font-display text-[22px] leading-tight sm:text-[26px]">Keep going</h1>
            </div>
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setInput('');
              }}
              className="shrink-0 border px-3 py-2 text-[12.5px] font-semibold transition-colors hover:bg-[var(--paper-dim)]"
              style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
            >
              New chat
            </button>
          </div>
        )}
      </header>

      <div
        className={`min-h-0 flex-1 ${empty ? 'pt-8' : 'pt-6'} pb-[calc(8.75rem+env(safe-area-inset-bottom,0px))] lg:pb-36`}
      >
        {empty ? (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {SUGGESTIONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.button
                  key={s.label}
                  type="button"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.35 }}
                  onClick={() => send(s.prompt)}
                  className="group flex items-start gap-3 rounded-2xl border bg-white/80 px-4 py-3.5 text-left backdrop-blur transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(12,17,22,0.08)]"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: 'rgba(0,179,105,0.12)', color: 'var(--green-deep)' }}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13px] font-semibold">{s.label}</span>
                    <span
                      className="mt-0.5 block text-[12.5px] leading-snug"
                      style={{ color: 'var(--ink-soft)' }}
                    >
                      {s.prompt}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto max-w-[720px] space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'user' ? (
                    <div
                      className="max-w-[85%] rounded-[22px] rounded-br-md px-4 py-3 text-[14.5px] leading-relaxed text-white sm:max-w-[75%]"
                      style={{
                        background: 'var(--ink)',
                        boxShadow: '0 8px 24px rgba(12,17,22,0.12)',
                      }}
                    >
                      {m.content}
                    </div>
                  ) : (
                    <div className="flex max-w-full gap-3 sm:max-w-[95%]">
                      <span
                        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background:
                            'linear-gradient(145deg, rgba(0,179,105,0.2), rgba(74,144,226,0.14))',
                          color: 'var(--green-deep)',
                        }}
                      >
                        <Bot size={15} />
                      </span>
                      <div className="min-w-0 flex-1 pt-0.5">
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
                                style={{ background: 'var(--green)' }}
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
        Claude/ChatGPT-style floating composer.
        Fixed slightly above the mobile bottom nav on this page only;
        near the viewport bottom on desktop (no bottom nav).
      */}
      <div
        className="pointer-events-none fixed inset-x-0 z-30 px-3 bottom-[calc(4.65rem+env(safe-area-inset-bottom,0px)+0.4rem)] sm:px-6 lg:bottom-5 lg:left-[268px] lg:px-10"
      >
        <div className="pointer-events-auto mx-auto w-full max-w-[820px]">
          <div
            className="pointer-events-none absolute inset-x-0 -top-14 h-14"
            style={{ background: 'linear-gradient(to top, var(--paper), transparent)' }}
            aria-hidden
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="relative flex items-end gap-2 rounded-[28px] border bg-white/95 p-2 pl-4 backdrop-blur-md transition-[box-shadow,border-color]"
            style={{
              borderColor: focused ? 'rgba(0,179,105,0.45)' : 'var(--line)',
              boxShadow: focused
                ? '0 14px 44px rgba(0,179,105,0.16)'
                : '0 12px 40px rgba(12,17,22,0.12)',
            }}
          >
            <label className="min-w-0 flex-1 py-1.5">
              <span className="sr-only">Ask InTelleX AI</span>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Ask InTelleX AI - explain, quiz me, build a plan…"
                className="max-h-[160px] min-h-[28px] w-full resize-none bg-transparent py-2 text-[15px] leading-relaxed outline-none placeholder:text-[var(--ink-soft)]"
                style={{ color: 'var(--ink)' }}
              />
            </label>
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-all disabled:opacity-35"
              style={{
                background: input.trim()
                  ? 'linear-gradient(145deg, #00b369, #009a5a)'
                  : 'var(--ink-soft)',
              }}
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
            className="mt-2 hidden text-center font-mono text-[10.5px] uppercase tracking-[0.12em] sm:block"
            style={{ color: 'var(--ink-soft)' }}
          >
            Grounded in InTelleX lessons · Enter to send
          </p>
        </div>
      </div>
    </div>
  );
}
