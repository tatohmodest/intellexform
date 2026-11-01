'use client';

import Link from 'next/link';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUp, ArrowUpRight, MessageCircle, Sparkles, X } from 'lucide-react';
import { PLATFORM_CONTACT, generalWhatsappLink } from '@/lib/contact';
import { OPEN_ADVISOR_EVENT } from '@/lib/advisor';
import { useLocale, useT } from '@/components/i18n/I18nRoot';
import { translateUiText } from '@/lib/i18n/translate';

type Msg = { role: 'user' | 'assistant'; content: string };


const STARTERS = [
  'Which tech skills are in demand right now?',
  "I'm a complete beginner. Where do I start?",
  'What are high-income tech careers?',
  'Is Full Stack Web Development worth it?',
];

const LINK_CLASS =
  'font-semibold text-[var(--green-deep)] underline decoration-[var(--green)] decoration-2 underline-offset-[3px] hover:text-[var(--navy)]';

/** Renders **bold** and [label](url) safely - no raw HTML. */
function inline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s<>)"']+)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      // Bold can wrap a link (**[Title](/programmes/x)**), so render its inside too.
      out.push(<strong key={`${keyBase}-b${i}`}>{inline(m[1], `${keyBase}-b${i}`)}</strong>);
    } else {
      const href = (m[3] || m[4] || '').replace(/[.,;:!?]+$/, '');
      const label = m[2] || href;
      if (href.startsWith('/')) {
        out.push(
          <Link key={`${keyBase}-l${i}`} href={href} className={LINK_CLASS}>
            {label}
            <ArrowUpRight size={13} className="ml-0.5 inline-block align-[-1px]" />
          </Link>,
        );
      } else if (/^https?:\/\//i.test(href)) {
        out.push(
          <a key={`${keyBase}-l${i}`} href={href} target="_blank" rel="noopener noreferrer nofollow" className={LINK_CLASS}>
            {label}
            <ArrowUpRight size={13} className="ml-0.5 inline-block align-[-1px]" />
          </a>,
        );
      } else {
        out.push(label);
      }
    }
    last = re.lastIndex;
    i += 1;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter((l) => l.trim());
        const isList = lines.length > 0 && lines.every((l) => /^\s*([-*]|\d+\.)\s+/.test(l));
        if (isList) {
          return (
            <ul key={bi} className="my-2 flex flex-col gap-1.5 pl-1">
              {lines.map((l, li) => (
                <li key={li} className="flex gap-2">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[var(--green)]" />
                  <span>{inline(l.replace(/^\s*([-*]|\d+\.)\s+/, ''), `${bi}-${li}`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi} className="my-2 first:mt-0 last:mb-0">
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {inline(l.replace(/^#+\s*/, ''), `${bi}-${li}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

export default function AdvisorDock() {
  const locale = useLocale();
  const t = useT();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const historyRef = useRef<Msg[]>([]);
  const localeRef = useRef(locale);
  localeRef.current = locale;
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    function onOpen(e: Event) {
      setOpen(true);
      const q = (e as CustomEvent<string | undefined>).detail;
      // Preset questions are written in English; show and send them in the visitor's language.
      if (q) void send(translateUiText(q, localeRef.current));
    }
    window.addEventListener(OPEN_ADVISOR_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_ADVISOR_EVENT, onOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 150);
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput('');
    setBusy(true);
    const history: Msg[] = [...historyRef.current, { role: 'user', content: q }];
    historyRef.current = history;
    setMessages([...history, { role: 'assistant', content: '' }]);
    let acc = '';
    try {
      const res = await fetch('/api/orientation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, locale }),
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t('Something went wrong. Please try again.'));
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...history, { role: 'assistant', content: acc }]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('Something went wrong. Please try again.');
      acc =
        locale === 'fr'
          ? `${msg} Vous pouvez aussi nous écrire sur WhatsApp au ${PLATFORM_CONTACT.phoneDisplay}.`
          : `${msg} You can also WhatsApp us on ${PLATFORM_CONTACT.phoneDisplay}.`;
      setMessages([...history, { role: 'assistant', content: acc }]);
    } finally {
      historyRef.current = [...history, { role: 'assistant', content: acc }];
      setBusy(false);
    }
  }

  return (
    <>
      {/* Chat panel */}
      <div
        role="dialog"
        aria-label="InTelleX AI advisor"
        aria-hidden={!open}
        className={`fixed inset-x-3 bottom-3 top-16 z-[95] flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_40px_100px_-30px_rgba(12,17,22,0.55)] ring-1 ring-black/5 transition-all duration-300 sm:inset-x-auto sm:bottom-[156px] sm:right-5 sm:top-auto sm:h-[600px] sm:max-h-[calc(100vh-240px)] sm:w-[400px] ${
          open ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <div className="relative overflow-hidden bg-[#dcedfa] px-5 pb-5 pt-4 text-[#12324f]">
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--green)] text-white">
                <Sparkles size={18} />
              </span>
              <div>
                <div className="font-display text-[18px] leading-tight">AI career advisor</div>
                <div className="text-[12px] text-[#12324f]/65">Ask about skills, careers and programmes</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/70 hover:bg-white"
              aria-label="Close advisor"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 text-[14.5px] leading-relaxed">
          {messages.length === 0 ? (
            <div>
              <div className="rounded-2xl rounded-tl-md bg-[var(--paper-dim)] p-4">
                Hi! I can help you pick the right skill and programme for your goals. Ask me anything, or try
                one of these:
              </div>
              <div className="mt-4 flex flex-col gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(t(s))}
                    className="rounded-xl bg-[var(--sky-soft)] px-4 py-2.5 text-left text-[14px] font-medium text-[var(--sky-deep)] transition-colors hover:bg-[var(--sky)] hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((m, i) =>
                m.role === 'user' ? (
                  <div key={i} data-no-i18n className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-[var(--green)] px-4 py-2.5 text-white">
                    {m.content}
                  </div>
                ) : (
                  <div key={i} data-no-i18n className="max-w-[92%] rounded-2xl rounded-tl-md bg-[var(--paper-dim)] px-4 py-3">
                    {m.content ? (
                      <Markdown text={m.content} />
                    ) : (
                      <span className="flex gap-1 py-1.5" aria-label="Thinking">
                        {[0, 0.15, 0.3].map((d) => (
                          <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--ink-soft)]" style={{ animationDelay: `${d}s` }} />
                        ))}
                      </span>
                    )}
                  </div>
                ),
              )}
            </div>
          )}
        </div>

        <form
          className="flex items-end gap-2 border-t border-black/5 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            maxLength={2000}
            placeholder={t('Ask about skills, careers, courses...')}
            className="max-h-28 min-h-[44px] flex-1 resize-none rounded-xl bg-[var(--paper-dim)] px-4 py-3 text-[14.5px] outline-none placeholder:text-[var(--ink-soft)] focus:ring-2 focus:ring-[var(--sky)]/40"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--green)] text-white transition-opacity disabled:opacity-40"
            aria-label="Send"
          >
            <ArrowUp size={18} />
          </button>
        </form>
        <div className="px-4 pb-3 text-center text-[11px] text-[var(--ink-soft)]">
          AI answers can be imperfect. For enrolment,{' '}
          <a href={generalWhatsappLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--green-deep)]">
            WhatsApp {PLATFORM_CONTACT.phoneDisplay}
          </a>
        </div>
      </div>

      {/* Dock */}
      <div className={`fixed bottom-5 right-5 z-[96] flex-col items-end gap-2.5 ${open ? 'hidden sm:flex' : 'flex'}`}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="group flex items-center gap-3 rounded-2xl bg-white p-3.5 text-[#12324f] shadow-[0_18px_40px_-16px_rgba(18,50,79,0.45)] ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 sm:py-3 sm:pl-3.5 sm:pr-5"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--green)]">
            {open ? <X size={16} /> : <Sparkles size={16} />}
          </span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-[11px] uppercase tracking-[0.12em] text-[#12324f]/60">Not sure what to learn?</span>
            <span className="block text-[14.5px] font-semibold">Chat with AI</span>
          </span>
        </button>
        <a
          href={generalWhatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chat with InTelleX on WhatsApp, ${PLATFORM_CONTACT.phoneDisplay}`}
          className="wa-pulse flex items-center gap-3 rounded-2xl bg-[var(--green)] p-3.5 text-white shadow-[0_18px_40px_-16px_rgba(0,120,70,0.8)] transition-colors hover:bg-[var(--green-deep)] sm:py-3 sm:pl-4 sm:pr-5"
        >
          <MessageCircle size={22} />
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-[11px] uppercase tracking-[0.12em] text-white/75">WhatsApp us</span>
            <span className="block text-[14.5px] font-semibold">{PLATFORM_CONTACT.phoneDisplay}</span>
          </span>
        </a>
      </div>
    </>
  );
}
