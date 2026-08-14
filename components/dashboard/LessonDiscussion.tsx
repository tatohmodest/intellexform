'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, MessageSquare, Pin, ThumbsUp } from 'lucide-react';
import type { DiscussionPostView, DiscussionReplyView } from '@/lib/learn/discussionTypes';

export default function LessonDiscussion({
  courseKey,
  lessonKey,
  accent = '#00b369',
  canModerate = false,
}: {
  courseKey: string;
  lessonKey?: string | null;
  accent?: string;
  canModerate?: boolean;
}) {
  const [posts, setPosts] = useState<DiscussionPostView[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [replies, setReplies] = useState<Record<string, DiscussionReplyView[]>>({});
  const [replyText, setReplyText] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ courseKey });
      if (lessonKey) qs.set('lessonKey', lessonKey);
      const res = await fetch(`/api/learn/discussions?${qs}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } finally {
      setLoading(false);
    }
  }, [courseKey, lessonKey]);

  useEffect(() => {
    void load();
  }, [load]);

  async function createPost() {
    if (!body.trim()) return;
    setBusy(true);
    try {
      await fetch('/api/learn/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'post',
          courseKey,
          lessonKey: lessonKey || null,
          title: title || 'Question',
          body,
        }),
      });
      setTitle('');
      setBody('');
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function upvote(postId: string) {
    const res = await fetch('/api/learn/discussions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'upvote', postId }),
    });
    const data = await res.json();
    if (data.post) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? data.post : p)));
    }
  }

  async function pin(postId: string, pinned: boolean) {
    await fetch('/api/learn/discussions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'pin', postId, pinned }),
    });
    await load();
  }

  async function openReplies(postId: string) {
    setExpanded(postId);
    const res = await fetch(`/api/learn/discussions?view=replies&postId=${encodeURIComponent(postId)}`);
    const data = await res.json();
    setReplies((prev) => ({ ...prev, [postId]: data.replies || [] }));
  }

  async function sendReply(postId: string, isOfficial = false) {
    if (!replyText.trim()) return;
    setBusy(true);
    try {
      await fetch('/api/learn/discussions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply', postId, body: replyText, isOfficial }),
      });
      setReplyText('');
      await openReplies(postId);
      await load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 border-b pb-4" style={{ borderColor: 'var(--line)' }}>
        <input
          className="form-input !rounded-none text-[13px]"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-input !rounded-none min-h-[80px] text-[13px]"
          placeholder="Ask a question or start a discussion…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          type="button"
          disabled={busy || !body.trim()}
          onClick={createPost}
          className="inline-flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
          style={{ background: accent }}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
          Post
        </button>
      </div>

      {loading ? (
        <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
          Loading discussion…
        </p>
      ) : posts.length === 0 ? (
        <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          No discussion yet — be the first to ask.
        </p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.id} className="border-t pt-3" style={{ borderColor: 'var(--line)' }}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {p.pinned ? (
                      <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: accent }}>
                        Pinned
                      </span>
                    ) : null}
                    {p.officialAnswerId ? (
                      <span className="font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--green-deep)' }}>
                        Official answer
                      </span>
                    ) : null}
                    <h3 className="font-semibold text-[14px]">{p.title}</h3>
                  </div>
                  <p className="mt-1 text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                    {p.body}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                    {p.authorName} · {p.replyCount} replies
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => upvote(p.id)}
                    className="inline-flex items-center gap-1 border px-2 py-1 text-[12px] font-semibold"
                    style={{
                      borderColor: p.upvotedByMe ? accent : 'var(--line)',
                      color: p.upvotedByMe ? accent : 'var(--ink-soft)',
                    }}
                  >
                    <ThumbsUp size={12} /> {p.upvoteCount}
                  </button>
                  {canModerate ? (
                    <button
                      type="button"
                      onClick={() => pin(p.id, !p.pinned)}
                      className="inline-flex items-center gap-1 border px-2 py-1 text-[12px]"
                      style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
                    >
                      <Pin size={12} />
                    </button>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                className="mt-2 text-[12.5px] font-semibold"
                style={{ color: accent }}
                onClick={() => (expanded === p.id ? setExpanded(null) : openReplies(p.id))}
              >
                {expanded === p.id ? 'Hide replies' : 'View replies'}
              </button>
              {expanded === p.id ? (
                <div className="mt-3 space-y-2 pl-3 border-l" style={{ borderColor: 'var(--line)' }}>
                  {(replies[p.id] || []).map((r) => (
                    <div key={r.id}>
                      {r.isOfficial ? (
                        <span className="font-mono text-[10px] uppercase" style={{ color: 'var(--green-deep)' }}>
                          Official ·{' '}
                        </span>
                      ) : null}
                      <span className="text-[13px] font-semibold">{r.authorName}</span>
                      <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                        {r.body}
                      </p>
                    </div>
                  ))}
                  <textarea
                    className="form-input !rounded-none min-h-[60px] text-[13px]"
                    placeholder="Write a reply…"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => sendReply(p.id, false)}
                      className="px-3 py-1.5 text-[12.5px] font-semibold text-white"
                      style={{ background: accent }}
                    >
                      Reply
                    </button>
                    {canModerate ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => sendReply(p.id, true)}
                        className="border px-3 py-1.5 text-[12.5px] font-semibold"
                        style={{ borderColor: accent, color: accent }}
                      >
                        Mark official answer
                      </button>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
