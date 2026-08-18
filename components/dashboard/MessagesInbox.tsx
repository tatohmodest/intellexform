'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Send } from 'lucide-react';
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

export default function MessagesInbox({
  userId,
  initialThreadId,
}: {
  userId: string;
  initialThreadId?: string | null;
}) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(initialThreadId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadThreads = useCallback(async () => {
    const res = await fetch('/api/learn/messages');
    const data = await res.json();
    setThreads(data.threads || []);
  }, []);

  const loadThread = useCallback(async (id: string) => {
    const res = await fetch(`/api/learn/messages?threadId=${encodeURIComponent(id)}`);
    const data = await res.json();
    if (res.ok) {
      setMessages(data.messages || []);
      setActiveId(id);
      await loadThreads();
    }
  }, [loadThreads]);

  useEffect(() => {
    loadThreads()
      .then(() => {
        if (initialThreadId) return loadThread(initialThreadId);
      })
      .finally(() => setLoading(false));
  }, [loadThreads, loadThread, initialThreadId]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!activeId || !body.trim()) return;
    setBusy(true);
    try {
      const res = await fetch('/api/learn/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId: activeId, body }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((m) => [...m, data.message]);
        setBody('');
        await loadThreads();
      }
    } finally {
      setBusy(false);
    }
  }

  const active = threads.find((t) => t.id === activeId);

  return (
    <div className="grid min-h-[520px] gap-0 border lg:grid-cols-[280px_1fr]" style={{ borderColor: 'var(--line)' }}>
      <aside className="border-b lg:border-b-0 lg:border-r" style={{ borderColor: 'var(--line)' }}>
        <div className="border-b p-3 font-semibold" style={{ borderColor: 'var(--line)' }}>
          Inbox
        </div>
        {loading ? (
          <p className="p-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Loading…
          </p>
        ) : threads.length === 0 ? (
          <p className="p-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            No conversations yet. Instructors can message you from My Students.
          </p>
        ) : (
          <ul>
            {threads.map((t) => {
              const unread = t.unreadFor?.includes(userId);
              const other =
                Object.entries(t.participantNames || {}).find(([id]) => id !== userId)?.[1] ||
                'Conversation';
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => loadThread(t.id)}
                    className="w-full border-b px-3 py-3 text-left"
                    style={{
                      borderColor: 'var(--line)',
                      background: activeId === t.id ? 'var(--paper-dim)' : 'transparent',
                    }}
                  >
                    <p className={`truncate text-[14px] ${unread ? 'font-bold' : 'font-semibold'}`}>
                      {other}
                    </p>
                    <p className="truncate text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      {t.lastPreview || t.subject}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      <section className="flex min-h-[420px] flex-col">
        {!activeId ? (
          <div className="flex flex-1 items-center justify-center p-6 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Select a conversation
          </div>
        ) : (
          <>
            <div className="border-b p-3" style={{ borderColor: 'var(--line)' }}>
              <p className="font-semibold">{active?.subject}</p>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="flex max-w-[85%] gap-2"
                  style={{
                    marginLeft: m.senderId === userId ? 'auto' : 0,
                    flexDirection: m.senderId === userId ? 'row-reverse' : 'row',
                  }}
                >
                  <PersonAvatar name={m.senderName} src={m.senderAvatar} size={32} />
                  <div
                    className="border p-3"
                    style={{
                      borderColor: 'var(--line)',
                      background: m.senderId === userId ? 'rgba(0,179,105,0.06)' : 'transparent',
                    }}
                  >
                  <p className="text-[11px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
                    {m.senderName} · {new Date(m.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-[14px]">{m.body}</p>
                  {m.href ? (
                    <Link href={m.href} className="mt-2 inline-block text-[12.5px] font-semibold" style={{ color: 'var(--green-deep)' }}>
                      Open linked item →
                    </Link>
                  ) : null}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={send} className="flex gap-2 border-t p-3" style={{ borderColor: 'var(--line)' }}>
              <input
                className="form-input !rounded-none flex-1"
                placeholder="Write a message…"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-1 px-3 py-2 text-[13px] font-semibold text-white"
                style={{ background: 'var(--ink)' }}
              >
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Send
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
