'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FileText,
  Hash,
  Loader2,
  Paperclip,
  Plus,
  Send,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { uploadMentorAsset } from '@/lib/learn/mentorUpload';
import PersonAvatar from '@/components/ui/PersonAvatar';

type Group = {
  id: string;
  title: string;
  description: string;
  courseId: string | null;
  courseTitle: string | null;
  ownerId: string;
  memberCount: number;
  unread: number;
  lastPreview: string;
  isOwner: boolean;
};
type Channel = { id: string; name: string; topic: string; unread: number };
type Member = { userId: string; name: string; email: string; avatar?: string | null; isOwner: boolean; isYou: boolean };
type Mate = { userId: string; name: string; email: string; alreadyMember: boolean };
type Attachment = { name: string; url: string; kind: 'image' | 'file' };
type Message = {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string | null;
  body: string;
  attachments: Attachment[];
  createdAt: string;
};
type Course = { id: string; title: string };

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || 'G';
}

function timeLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function isImageName(name: string, url: string) {
  return /\.(png|jpe?g|gif|webp)$/i.test(name) || /\.(png|jpe?g|gif|webp)(\?|$)/i.test(url);
}

export default function ClassRoomsClient({
  userId,
}: {
  userId: string;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const [classHead, setClassHead] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupId, setGroupId] = useState<string | null>(search.get('group'));
  const [channelId, setChannelId] = useState<string | null>(search.get('channel'));
  const [channels, setChannels] = useState<Channel[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [mates, setMates] = useState<Mate[]>([]);
  const [groupMeta, setGroupMeta] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState('');
  const [pendingFiles, setPendingFiles] = useState<Attachment[]>([]);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [channelOpen, setChannelOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newChannel, setNewChannel] = useState('');
  const [mobilePane, setMobilePane] = useState<'groups' | 'channels' | 'chat'>('groups');
  const [pickMates, setPickMates] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const stickBottom = useRef(true);

  const loadGroups = useCallback(async () => {
    const res = await fetch('/api/learn/groups');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not load groups');
    setClassHead(Boolean(data.classHead));
    setCourses(data.courses || []);
    setGroups(data.groups || []);
    return data.groups as Group[];
  }, []);

  const loadWorkspace = useCallback(async (id: string) => {
    const res = await fetch(`/api/learn/groups?groupId=${encodeURIComponent(id)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not open group');
    setGroupMeta(data.group);
    setChannels(data.channels || []);
    setMembers(data.members || []);
    setMates(data.mates || []);
    return data.channels as Channel[];
  }, []);

  const loadMessages = useCallback(async (id: string, after?: string) => {
    const qs = after ? `&after=${encodeURIComponent(after)}` : '';
    const res = await fetch(`/api/learn/groups?channelId=${encodeURIComponent(id)}${qs}`);
    const data = await res.json();
    if (!res.ok) return;
    const next = (data.messages || []) as Message[];
    if (after) {
      if (next.length) setMessages((m) => [...m, ...next.filter((n) => !m.some((x) => x.id === n.id))]);
    } else {
      setMessages(next);
    }
  }, []);

  useEffect(() => {
    loadGroups()
      .then((list) => {
        const wanted = search.get('group') || list[0]?.id || null;
        if (wanted) setGroupId(wanted);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load'));
  }, [loadGroups, search]);

  useEffect(() => {
    if (!groupId) return;
    setError('');
    loadWorkspace(groupId)
      .then((chs) => {
        const wanted = search.get('channel') || chs[0]?.id || null;
        setChannelId(wanted);
        setMobilePane('channels');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not open group'));
  }, [groupId, loadWorkspace, search]);

  useEffect(() => {
    if (!channelId) return;
    loadMessages(channelId).then(() => {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'auto' }), 30);
    });
  }, [channelId, loadMessages]);

  const lastAtRef = useRef<string | undefined>();
  lastAtRef.current = messages[messages.length - 1]?.createdAt;

  useEffect(() => {
    if (!channelId) return;
    const t = setInterval(() => {
      void loadMessages(channelId, lastAtRef.current);
    }, 2800);
    return () => clearInterval(t);
  }, [channelId, loadMessages]);

  useEffect(() => {
    if (stickBottom.current) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const activeChannel = channels.find((c) => c.id === channelId);
  const owner = groupMeta?.isOwner || members.some((m) => m.isYou && m.isOwner);

  async function post(payload: Record<string, unknown>, key: string) {
    setBusy(key);
    setError('');
    try {
      const res = await fetch('/api/learn/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
      return null;
    } finally {
      setBusy('');
    }
  }

  async function create() {
    const data = await post(
      { action: 'create_group', title: newTitle, description: newDesc, courseId: newCourse },
      'create',
    );
    if (!data?.id) return;
    setCreateOpen(false);
    setNewTitle('');
    setNewDesc('');
    const list = await loadGroups();
    setGroupId(data.id || list[0]?.id);
  }

  async function send(e?: React.FormEvent) {
    e?.preventDefault();
    if (!channelId || (!body.trim() && !pendingFiles.length)) return;
    const data = await post(
      { action: 'send', channelId, body, attachments: pendingFiles },
      'send',
    );
    if (data?.message) {
      setMessages((m) => [...m, data.message]);
      setBody('');
      setPendingFiles([]);
      stickBottom.current = true;
      void loadGroups();
    }
  }

  async function attach(file: File) {
    setBusy('upload');
    setError('');
    try {
      const uploaded = await uploadMentorAsset('note', file, file.name);
      const kind: Attachment['kind'] =
        file.type.startsWith('image/') || isImageName(file.name, uploaded.url) ? 'image' : 'file';
      setPendingFiles((f) => [...f, { name: file.name, url: uploaded.url, kind }].slice(0, 4));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not upload file');
    } finally {
      setBusy('');
    }
  }

  const grouped = useMemo(() => {
    const rows: Array<{ type: 'day'; label: string } | { type: 'msg'; msg: Message; showName: boolean }> = [];
    let lastDay = '';
    let lastSender = '';
    let lastTs = 0;
    for (const msg of messages) {
      const day = new Date(msg.createdAt).toDateString();
      if (day !== lastDay) {
        rows.push({
          type: 'day',
          label: new Date(msg.createdAt).toLocaleDateString([], {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
          }),
        });
        lastDay = day;
        lastSender = '';
      }
      const ts = new Date(msg.createdAt).getTime();
      const showName = msg.senderId !== lastSender || ts - lastTs > 8 * 60 * 1000;
      rows.push({ type: 'msg', msg, showName });
      lastSender = msg.senderId;
      lastTs = ts;
    }
    return rows;
  }, [messages]);

  return (
    <div className="-mx-4 -mt-6 mb-[-7rem] flex h-[calc(100dvh-64px)] min-h-[520px] overflow-hidden border-t sm:-mx-6 lg:-mr-10 lg:mb-[-4rem]" style={{ borderColor: 'var(--line)' }}>
      <aside
        className={`${mobilePane === 'groups' ? 'flex' : 'hidden'} w-[72px] shrink-0 flex-col items-center gap-2 overflow-y-auto py-3 md:flex`}
        style={{ background: '#0C1116' }}
      >
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            title={g.title}
            onClick={() => {
              setGroupId(g.id);
              setMobilePane('channels');
              router.replace(`/dashboard/study-groups?group=${g.id}`, { scroll: false });
            }}
            className="relative flex h-12 w-12 items-center justify-center text-[13px] font-bold text-white"
            style={{
              background: groupId === g.id ? '#00B369' : '#1c2430',
              borderRadius: groupId === g.id ? 16 : 999,
            }}
          >
            {initials(g.title)}
            {g.unread > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 min-w-[16px] rounded-full bg-white px-1 text-[9px] font-bold text-black">
                {g.unread > 9 ? '9+' : g.unread}
              </span>
            ) : null}
          </button>
        ))}
        {classHead ? (
          <button
            type="button"
            title="New group"
            onClick={() => setCreateOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full text-white"
            style={{ background: '#1c2430', color: '#00B369' }}
          >
            <Plus size={20} />
          </button>
        ) : null}
      </aside>

      <aside
        className={`${mobilePane === 'channels' ? 'flex' : 'hidden'} w-full shrink-0 flex-col md:flex md:w-[240px]`}
        style={{ background: '#141b24', color: '#e8edf3' }}
      >
        <div className="border-b px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <p className="truncate font-semibold">{groupMeta?.title || 'Class rooms'}</p>
          <p className="truncate text-[11.5px]" style={{ color: '#8b97a8' }}>
            {groupMeta?.courseTitle || 'Pick a group to start talking'}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: '#8b97a8' }}>
            Text channels
          </p>
          {channels.map((ch) => (
            <button
              key={ch.id}
              type="button"
              onClick={() => {
                setChannelId(ch.id);
                setMobilePane('chat');
                router.replace(
                  `/dashboard/study-groups?group=${groupId}&channel=${ch.id}`,
                  { scroll: false },
                );
              }}
              className="mb-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13.5px]"
              style={{
                background: channelId === ch.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: channelId === ch.id ? '#fff' : '#b7c2d0',
              }}
            >
              <Hash size={14} />
              <span className="min-w-0 flex-1 truncate">{ch.name}</span>
              {ch.unread > 0 ? (
                <span className="rounded-full bg-white px-1.5 text-[10px] font-bold text-black">{ch.unread}</span>
              ) : null}
            </button>
          ))}
          {owner ? (
            <button
              type="button"
              onClick={() => setChannelOpen(true)}
              className="mt-2 flex w-full items-center gap-2 px-2 py-1.5 text-left text-[12.5px]"
              style={{ color: '#8b97a8' }}
            >
              <Plus size={13} /> New channel
            </button>
          ) : null}
        </div>
        <div className="border-t p-3 text-[12px]" style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#8b97a8' }}>
          {owner
            ? 'You are class head. Add course mates from the member list.'
            : classHead
              ? 'Create a group for your course, then add classmates.'
              : 'Only class heads can create groups. Staff allocate that privilege.'}
        </div>
      </aside>

      <section className={`${mobilePane === 'chat' ? 'flex' : 'hidden'} min-w-0 flex-1 flex-col md:flex`} style={{ background: '#f7f9fc' }}>
        <header className="flex items-center gap-3 border-b px-4 py-3" style={{ borderColor: 'var(--line)', background: '#fff' }}>
          <button type="button" className="md:hidden" onClick={() => setMobilePane('channels')}>
            <X size={16} />
          </button>
          <Hash size={16} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{activeChannel?.name || 'channel'}</p>
            {activeChannel?.topic ? (
              <p className="truncate text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                {activeChannel.topic}
              </p>
            ) : null}
          </div>
          <span className="hidden text-[12px] sm:inline" style={{ color: 'var(--ink-soft)' }}>
            {members.length} members
          </span>
        </header>

        <div
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
          onScroll={(e) => {
            const el = e.currentTarget;
            stickBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
          }}
        >
          {!groupId ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Users size={28} style={{ color: 'var(--ink-soft)' }} />
              <p className="mt-3 font-display text-[24px]">Class rooms</p>
              <p className="mt-1 max-w-[420px] text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                Chat like a class Discord: channels for talk, notes, and ideas. Class heads create the room and add
                course mates.
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-display text-[22px]">#{activeChannel?.name || 'general'}</p>
              <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                {activeChannel?.topic || 'This is the start of the channel. Share notes, ideas, and questions.'}
              </p>
            </div>
          ) : (
            grouped.map((row, i) =>
              row.type === 'day' ? (
                <p key={`d-${row.label}-${i}`} className="my-4 text-center text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                  {row.label}
                </p>
              ) : (
                <article key={row.msg.id} className={`group relative flex gap-2.5 ${row.showName ? 'mt-3' : 'mt-0.5'}`}>
                  <div className="w-8 shrink-0">
                    {row.showName ? (
                      <PersonAvatar
                        name={row.msg.senderName}
                        src={row.msg.senderAvatar || members.find((m) => m.userId === row.msg.senderId)?.avatar}
                        size={32}
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                  {row.showName ? (
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold">{row.msg.senderName}</span>
                      <span className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                        {timeLabel(row.msg.createdAt)}
                      </span>
                    </div>
                  ) : null}
                  {row.msg.body ? <p className="whitespace-pre-wrap text-[14.5px] leading-relaxed">{row.msg.body}</p> : null}
                  {row.msg.attachments?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {row.msg.attachments.map((a) =>
                        a.kind === 'image' || isImageName(a.name, a.url) ? (
                          <a key={a.url} href={a.url} target="_blank" rel="noreferrer">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={a.url} alt={a.name} className="max-h-56 max-w-[260px] border object-cover" style={{ borderColor: 'var(--line)' }} />
                          </a>
                        ) : (
                          <a
                            key={a.url}
                            href={a.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 border px-3 py-2 text-[13px]"
                            style={{ borderColor: 'var(--line)', background: '#fff' }}
                          >
                            <FileText size={14} /> {a.name}
                          </a>
                        ),
                      )}
                    </div>
                  ) : null}
                  {row.msg.senderId === userId || owner ? (
                    <button
                      type="button"
                      className="absolute right-0 top-0 hidden text-[11px] group-hover:block"
                      style={{ color: '#b91c1c' }}
                      onClick={() => post({ action: 'delete_message', messageId: row.msg.id }, `del-${row.msg.id}`).then((ok) => {
                        if (ok) setMessages((m) => m.filter((x) => x.id !== row.msg.id));
                      })}
                    >
                      Delete
                    </button>
                  ) : null}
                  </div>
                </article>
              ),
            )
          )}
          <div ref={bottomRef} />
        </div>

        {error ? (
          <p className="px-4 text-[13px]" style={{ color: '#b91c1c' }}>
            {error}
          </p>
        ) : null}

        {channelId ? (
          <form onSubmit={send} className="border-t p-3" style={{ borderColor: 'var(--line)', background: '#fff' }}>
            {pendingFiles.length ? (
              <div className="mb-2 flex flex-wrap gap-2">
                {pendingFiles.map((f) => (
                  <span key={f.url} className="inline-flex items-center gap-1 border px-2 py-1 text-[12px]" style={{ borderColor: 'var(--line)' }}>
                    {f.name}
                    <button type="button" onClick={() => setPendingFiles((all) => all.filter((x) => x.url !== f.url))}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            ) : null}
            <div className="flex items-end gap-2">
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void attach(file);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-10 w-10 items-center justify-center border"
                style={{ borderColor: 'var(--line)' }}
                title="Share a note, photo, or file"
              >
                {busy === 'upload' ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
              </button>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder={activeChannel ? `Message #${activeChannel.name}` : 'Message'}
                rows={1}
                className="max-h-32 min-h-[40px] flex-1 resize-none border px-3 py-2 text-[14px]"
                style={{ borderColor: 'var(--line)', background: 'transparent' }}
              />
              <button
                type="submit"
                disabled={busy === 'send' || (!body.trim() && !pendingFiles.length)}
                className="flex h-10 items-center gap-1 px-3 text-[13px] font-semibold text-white disabled:opacity-50"
                style={{ background: '#00B369' }}
              >
                <Send size={14} />
              </button>
            </div>
            <p className="mt-1 text-[11px]" style={{ color: 'var(--ink-soft)' }}>
              Enter to send · Shift+Enter for a new line · @firstName to ping someone
            </p>
          </form>
        ) : null}
      </section>

      <aside className="hidden w-[220px] shrink-0 flex-col border-l lg:flex" style={{ borderColor: 'var(--line)', background: '#fff' }}>
        <div className="flex items-center justify-between border-b px-3 py-3" style={{ borderColor: 'var(--line)' }}>
          <p className="text-[12px] font-semibold uppercase tracking-wide">Members — {members.length}</p>
          {owner ? (
            <button type="button" onClick={() => setAddOpen(true)} title="Add course mates">
              <UserPlus size={15} />
            </button>
          ) : null}
        </div>
        <ul className="flex-1 overflow-y-auto p-2">
          {members.map((m) => (
            <li key={m.userId} className="flex items-center justify-between gap-2 px-2 py-1.5 text-[13px]">
              <span className="flex min-w-0 items-center gap-2 truncate">
                <PersonAvatar name={m.name} src={m.avatar} size={22} />
                <span className="min-w-0 truncate">
                {m.name}
                {m.isOwner ? <span className="ml-1 text-[10px] font-semibold" style={{ color: '#00B369' }}>HEAD</span> : null}
                </span>
              </span>
              {owner && !m.isOwner ? (
                <button
                  type="button"
                  className="opacity-40 hover:opacity-100"
                  onClick={() =>
                    post({ action: 'remove_member', groupId, userId: m.userId }, 'rm').then((ok) => {
                      if (ok && groupId) void loadWorkspace(groupId);
                    })
                  }
                >
                  <Trash2 size={12} />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
        {groupMeta && !owner ? (
          <button
            type="button"
            className="border-t px-3 py-2 text-left text-[12px]"
            style={{ borderColor: 'var(--line)', color: '#b91c1c' }}
            onClick={() =>
              post({ action: 'remove_member', groupId, userId }, 'leave').then((ok) => {
                if (ok) {
                  setGroupId(null);
                  void loadGroups();
                }
              })
            }
          >
            Leave group
          </button>
        ) : null}
        {owner ? (
          <button
            type="button"
            className="border-t px-3 py-2 text-left text-[12px]"
            style={{ borderColor: 'var(--line)', color: '#b91c1c' }}
            onClick={() => {
              if (!confirm('Delete this group and all messages?')) return;
              post({ action: 'delete_group', groupId }, 'delg').then((ok) => {
                if (ok) {
                  setGroupId(null);
                  void loadGroups();
                }
              });
            }}
          >
            Delete group
          </button>
        ) : null}
      </aside>

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            className="w-full max-w-md border bg-white p-5"
            style={{ borderColor: 'var(--line)' }}
            onSubmit={(e) => {
              e.preventDefault();
              void create();
            }}
          >
            <h2 className="font-display text-[22px]">New class group</h2>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Class heads open a room for one course, then add course mates.
            </p>
            <input
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. SE 2026 · Cohort A"
              className="mt-4 w-full border px-3 py-2 text-[14px]"
              style={{ borderColor: 'var(--line)' }}
            />
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="What is this room for?"
              className="mt-2 w-full border px-3 py-2 text-[14px]"
              style={{ borderColor: 'var(--line)' }}
              rows={2}
            />
            <select
              required
              value={newCourse}
              onChange={(e) => setNewCourse(e.target.value)}
              className="mt-2 w-full border px-3 py-2 text-[14px]"
              style={{ borderColor: 'var(--line)', background: 'transparent' }}
            >
              <option value="">Course this group belongs to</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {courses.length === 0 ? (
              <p className="mt-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                Enrol in a course first so classmates can be added.
              </p>
            ) : null}
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setCreateOpen(false)} className="border px-3 py-2 text-[13px]" style={{ borderColor: 'var(--line)' }}>
                Cancel
              </button>
              <button type="submit" disabled={busy === 'create'} className="px-3 py-2 text-[13px] font-semibold text-white" style={{ background: '#00B369' }}>
                {busy === 'create' ? 'Creating…' : 'Create group'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {channelOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            className="w-full max-w-sm border bg-white p-5"
            style={{ borderColor: 'var(--line)' }}
            onSubmit={(e) => {
              e.preventDefault();
              post({ action: 'create_channel', groupId, name: newChannel }, 'ch').then((data) => {
                if (data?.id && groupId) {
                  setChannelOpen(false);
                  setNewChannel('');
                  void loadWorkspace(groupId).then(() => setChannelId(data.id));
                }
              });
            }}
          >
            <h2 className="font-display text-[20px]">New channel</h2>
            <input
              required
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
              placeholder="e.g. exam-prep"
              className="mt-3 w-full border px-3 py-2"
              style={{ borderColor: 'var(--line)' }}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setChannelOpen(false)} className="border px-3 py-2 text-[13px]" style={{ borderColor: 'var(--line)' }}>
                Cancel
              </button>
              <button type="submit" className="px-3 py-2 text-[13px] font-semibold text-white" style={{ background: '#00B369' }}>
                Add
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {addOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md border bg-white p-5" style={{ borderColor: 'var(--line)' }}>
            <h2 className="font-display text-[20px]">Add course mates</h2>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Only students in {groupMeta?.courseTitle || 'this course'} can be added.
            </p>
            <ul className="mt-3 max-h-64 overflow-y-auto">
              {mates.filter((m) => !m.alreadyMember).length === 0 ? (
                <li className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  Everyone from this course is already in, or no classmates are enrolled yet.
                </li>
              ) : (
                mates
                  .filter((m) => !m.alreadyMember)
                  .map((m) => (
                    <li key={m.userId}>
                      <label className="flex items-center gap-2 py-1.5 text-[14px]">
                        <input
                          type="checkbox"
                          checked={pickMates.includes(m.userId)}
                          onChange={(e) =>
                            setPickMates((ids) =>
                              e.target.checked ? [...ids, m.userId] : ids.filter((id) => id !== m.userId),
                            )
                          }
                        />
                        <span>
                          {m.name}
                          <span className="block text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                            {m.email}
                          </span>
                        </span>
                      </label>
                    </li>
                  ))
              )}
            </ul>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setAddOpen(false)} className="border px-3 py-2 text-[13px]" style={{ borderColor: 'var(--line)' }}>
                Close
              </button>
              <button
                type="button"
                disabled={!pickMates.length}
                className="px-3 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
                style={{ background: '#00B369' }}
                onClick={() =>
                  post({ action: 'add_members', groupId, userIds: pickMates }, 'add').then((ok) => {
                    if (ok && groupId) {
                      setPickMates([]);
                      setAddOpen(false);
                      void loadWorkspace(groupId);
                    }
                  })
                }
              >
                Add selected
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
