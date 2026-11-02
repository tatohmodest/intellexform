'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, CheckCheck, Loader2, MessageCircle, Search, Send } from 'lucide-react';
import PersonAvatar from '@/components/ui/PersonAvatar';

type Thread = {
  id: string;
  participantIds: string[];
  participantNames: Record<string, string>;
  subject: string;
  lastPreview: string;
  lastMessageAt: string;
  unreadFor: string[];
};

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string | null;
  body: string;
  createdAt: string;
  href?: string | null;
};

const WALLPAPER: React.CSSProperties = {
  backgroundColor: '#efeae2',
  backgroundImage:
    'radial-gradient(rgba(11,20,26,0.035) 1px, transparent 1px), radial-gradient(rgba(11,20,26,0.025) 1px, transparent 1px)',
  backgroundSize: '22px 22px, 38px 38px',
  backgroundPosition: '0 0, 11px 11px',
};

function clock(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function listStamp(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return clock(iso);
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

function dayLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return 'Today';
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
}

export default function MessagesInbox({
  userId,
  initialThreadId,
}: {
  userId: string;
  initialThreadId?: string | null;
}) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(initialThreadId || null);
  const [activeThread, setActiveThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(Boolean(initialThreadId));
  const [threadError, setThreadError] = useState(false);
  const [query, setQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const stick = useRef(true);

  const loadThreads = useCallback(async () => {
    const res = await fetch('/api/learn/messages', { cache: 'no-store' });
    const data = await res.json();
    setThreads(data.threads || []);
  }, []);

  const loadThread = useCallback(
    async (id: string, quiet = false) => {
      if (!quiet) {
        setThreadLoading(true);
        setThreadError(false);
        setMessages([]);
        setActiveId(id);
      }
      let res: Response;
      let data: { messages?: Message[]; thread?: Thread | null };
      try {
        res = await fetch(`/api/learn/messages?threadId=${encodeURIComponent(id)}`, { cache: 'no-store' });
        data = await res.json();
      } catch (err) {
        if (!quiet) {
          setThreadError(true);
          setThreadLoading(false);
        }
        throw err;
      }
      if (!quiet) {
        setThreadLoading(false);
        if (!res.ok) setThreadError(true);
      }
      if (res.ok) {
        setMessages((prev) => {
          const next: Message[] = data.messages || [];
          return prev.length === next.length && prev[prev.length - 1]?.id === next[next.length - 1]?.id ? prev : next;
        });
        setActiveThread(data.thread || null);
        setActiveId(id);
        if (!quiet) await loadThreads();
      }
    },
    [loadThreads],
  );

  useEffect(() => {
    loadThreads()
      .then(() => {
        if (initialThreadId) return loadThread(initialThreadId);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [loadThreads, loadThread, initialThreadId]);

  // Light polling so new messages show up without a refresh.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      void loadThreads().catch(() => undefined);
      if (activeId) void loadThread(activeId, true).catch(() => undefined);
    }, 6000);
    return () => window.clearInterval(id);
  }, [activeId, loadThread, loadThreads]);

  useEffect(() => {
    if (stick.current) bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages, activeId]);

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    if (!activeId || !body.trim() || busy) return;
    setBusy(true);
    try {
      const res = await fetch('/api/learn/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId: activeId, body }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        stick.current = true;
        setMessages((m) => [...m, data.message]);
        setBody('');
        await loadThreads();
      }
    } finally {
      setBusy(false);
    }
  }

  const otherName = (t: Thread) =>
    Object.entries(t.participantNames || {}).find(([id]) => id !== userId)?.[1] || t.subject || 'Conversation';

  const active = threads.find((t) => t.id === activeId) || activeThread;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter((t) => `${otherName(t)} ${t.lastPreview} ${t.subject}`.toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threads, query]);

  const rows = useMemo(() => {
    const out: Array<{ type: 'day'; label: string } | { type: 'msg'; msg: Message; tail: boolean }> = [];
    let lastDay = '';
    let lastSender = '';
    for (const m of messages) {
      const day = new Date(m.createdAt).toDateString();
      if (day !== lastDay) {
        out.push({ type: 'day', label: dayLabel(m.createdAt) });
        lastDay = day;
        lastSender = '';
      }
      out.push({ type: 'msg', msg: m, tail: m.senderId !== lastSender });
      lastSender = m.senderId;
    }
    return out;
  }, [messages]);

  return (
    <div
      className="flex h-[calc(100dvh-170px)] min-h-[480px] overflow-hidden rounded-[24px] bg-white shadow-[0_18px_50px_-30px_rgba(18,50,79,0.5)] lg:h-[calc(100dvh-150px)]"
    >
      {/* Chat list */}
      <aside
        className={`${activeId ? 'hidden' : 'flex'} w-full shrink-0 flex-col md:flex md:w-[340px] lg:w-[380px]`}
        style={{ borderRight: '1px solid #e9edef' }}
      >
        <div className="px-4 pb-2 pt-4">
          <h1 className="font-display text-[24px] font-extrabold text-[#111b21]">Chats</h1>
          <label className="mt-3 flex items-center gap-2 rounded-xl bg-[#f0f2f5] px-3 py-2.5 text-[#54656f]">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or start a new chat"
              className="w-full bg-transparent text-[14px] text-[#111b21] outline-none placeholder:text-[#667781]"
            />
          </label>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {loading ? (
            <p className="flex items-center gap-2 p-4 text-[13px] text-[#667781]">
              <Loader2 size={14} className="animate-spin" /> Loading chats…
            </p>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-14 text-center text-[14px] text-[#667781]">
              <MessageCircle size={34} className="mx-auto mb-3 text-[#00a884]" />
              {threads.length === 0
                ? 'No conversations yet. Instructors can message you from My Students.'
                : 'No chats match your search.'}
            </div>
          ) : (
            <ul>
              {filtered.map((t) => {
                const unread = t.unreadFor?.includes(userId);
                const name = otherName(t);
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => {
                        stick.current = true;
                        setMessages([]);
                        setActiveThread(t);
                        setActiveId(t.id);
                        void loadThread(t.id);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f5f6f6]"
                      style={{ background: activeId === t.id ? '#f0f2f5' : undefined }}
                    >
                      <PersonAvatar name={name} size={48} />
                      <span className="min-w-0 flex-1 border-b border-[#e9edef] pb-3 pt-0.5">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className={`truncate text-[16px] text-[#111b21] ${unread ? 'font-bold' : 'font-medium'}`}>{name}</span>
                          <span className={`shrink-0 text-[12px] ${unread ? 'font-semibold text-[#00a884]' : 'text-[#667781]'}`}>
                            {listStamp(t.lastMessageAt)}
                          </span>
                        </span>
                        <span className="mt-0.5 flex items-center justify-between gap-2">
                          <span className={`truncate text-[13.5px] ${unread ? 'font-medium text-[#111b21]' : 'text-[#667781]'}`}>
                            {t.lastPreview || t.subject}
                          </span>
                          {unread ? <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#25d366]" aria-label="Unread" /> : null}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* Conversation */}
      <section className={`${activeId ? 'flex' : 'hidden'} min-w-0 flex-1 flex-col md:flex`} style={WALLPAPER}>
        {!activeId ? (
          <div className="flex flex-1 flex-col items-center justify-center bg-[#f0f2f5] px-6 text-center">
            <span className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white text-[#00a884]">
              <MessageCircle size={36} />
            </span>
            <p className="font-display text-[24px] font-extrabold text-[#41525d]">InTelleX Messages</p>
            <p className="mt-2 max-w-sm text-[14px] text-[#667781]">
              Select a chat to read and reply to your instructors and course mates.
            </p>
          </div>
        ) : (
          <>
            <header className="flex items-center gap-3 px-3 py-2.5" style={{ background: '#f0f2f5', borderBottom: '1px solid #e9edef' }}>
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 md:hidden"
                aria-label="Back to chats"
              >
                <ArrowLeft size={20} />
              </button>
              <PersonAvatar name={active ? otherName(active) : 'Chat'} size={40} />
              <div className="min-w-0">
                <p className="truncate text-[15.5px] font-semibold text-[#111b21]">{active ? otherName(active) : 'Conversation'}</p>
                {active?.subject ? <p className="truncate text-[12.5px] text-[#667781]">{active.subject}</p> : null}
              </div>
            </header>

            <div
              className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-8"
              onScroll={(e) => {
                const el = e.currentTarget;
                stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
              }}
            >
              {threadLoading ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-[13px] text-[#54656f]">
                  <Loader2 size={26} className="animate-spin text-[#00a884]" />
                  Loading messages…
                </div>
              ) : threadError ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-[13px] text-[#54656f]">
                  Couldn&apos;t load this chat.
                  <button
                    type="button"
                    onClick={() => void loadThread(activeId as string).catch(() => undefined)}
                    className="rounded-full bg-[#00a884] px-4 py-1.5 font-semibold text-white"
                  >
                    Try again
                  </button>
                </div>
              ) : null}
              {threadLoading || threadError ? null : rows.map((r, i) =>
                r.type === 'day' ? (
                  <p key={`d-${i}`} className="my-3 flex justify-center">
                    <span className="rounded-lg bg-white/90 px-3 py-1 text-[11.5px] font-medium text-[#54656f] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
                      {r.label}
                    </span>
                  </p>
                ) : (
                  <div
                    key={r.msg.id}
                    className={`flex ${r.tail ? 'mt-2' : 'mt-0.5'} ${r.msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[84%] px-2.5 pb-1.5 pt-1.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] sm:max-w-[65%] ${
                        r.msg.senderId === userId
                          ? `bg-[#d9fdd3] ${r.tail ? 'rounded-[10px] rounded-tr-none' : 'rounded-[10px]'}`
                          : `bg-white ${r.tail ? 'rounded-[10px] rounded-tl-none' : 'rounded-[10px]'}`
                      }`}
                    >
                      <div className="flex flex-wrap items-end justify-end gap-x-2">
                        <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-[14.5px] leading-[1.35] text-[#111b21]">
                          {r.msg.body}
                        </p>
                        <span className="ml-auto flex translate-y-[2px] select-none items-center gap-0.5 text-[10.5px] leading-none text-[#667781]">
                          {clock(r.msg.createdAt)}
                          {r.msg.senderId === userId ? (
                            active && !active.unreadFor?.some((id) => id !== userId) ? (
                              <CheckCheck size={14} className="text-[#53bdeb]" />
                            ) : (
                              <Check size={14} />
                            )
                          ) : null}
                        </span>
                      </div>
                      {r.msg.href ? (
                        <Link
                          href={r.msg.href}
                          className="mt-1.5 block rounded-lg bg-black/[0.05] px-3 py-2 text-[12.5px] font-semibold text-[#027eb5]"
                        >
                          Open linked item →
                        </Link>
                      ) : null}
                    </div>
                  </div>
                ),
              )}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={send} className="flex items-end gap-2 px-3 py-2.5" style={{ background: '#f0f2f5' }}>
              <textarea
                rows={1}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder="Type a message"
                className="max-h-32 min-h-[44px] flex-1 resize-none rounded-3xl bg-white px-4 py-3 text-[14.5px] outline-none"
              />
              <button
                type="submit"
                disabled={busy || !body.trim()}
                aria-label="Send"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-50"
                style={{ background: '#00a884' }}
              >
                {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
