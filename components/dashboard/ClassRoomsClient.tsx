'use client';

import PageHeader from '@/components/dashboard/PageHeader';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
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
  isStaffMonitor?: boolean;
  banned?: boolean;
  rules?: string;
  membersCanInvite?: boolean;
  membersCanPost?: boolean;
};
type Channel = { id: string; name: string; topic: string; unread: number };
type Member = {
  userId: string;
  name: string;
  email: string;
  avatar?: string | null;
  isOwner: boolean;
  isYou: boolean;
  isStaff?: boolean;
};
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

const NAME_COLORS = ['#1f7aec', '#c2570a', '#8b3fd9', '#00806b', '#d6336c', '#2b8a3e', '#b5651d', '#0b7285'];
function nameColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return NAME_COLORS[h % NAME_COLORS.length];
}

/** WhatsApp-style chat wallpaper. */
const WA_WALLPAPER: React.CSSProperties = {
  backgroundColor: '#efeae2',
  backgroundImage:
    'radial-gradient(rgba(11,20,26,0.035) 1px, transparent 1px), radial-gradient(rgba(11,20,26,0.025) 1px, transparent 1px)',
  backgroundSize: '22px 22px, 38px 38px',
  backgroundPosition: '0 0, 11px 11px',
};

function isImageName(name: string, url: string) {
  return /\.(png|jpe?g|gif|webp)$/i.test(name) || /\.(png|jpe?g|gif|webp)(\?|$)/i.test(url);
}

function GroupCreateFields({
  newTitle,
  setNewTitle,
  newDesc,
  setNewDesc,
  newRules,
  setNewRules,
  newInvite,
  setNewInvite,
  newCanPost,
  setNewCanPost,
  newCourse,
  setNewCourse,
  courses,
}: {
  newTitle: string;
  setNewTitle: (v: string) => void;
  newDesc: string;
  setNewDesc: (v: string) => void;
  newRules: string;
  setNewRules: (v: string) => void;
  newInvite: boolean;
  setNewInvite: (v: boolean) => void;
  newCanPost: boolean;
  setNewCanPost: (v: boolean) => void;
  newCourse: string;
  setNewCourse: (v: string) => void;
  courses: Course[];
}) {
  return (
    <>
      <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        Class advocates open a room for one course, then add course mates.
      </p>
      <div
        className="mt-3 border px-3 py-2 text-[12.5px] leading-relaxed"
        style={{ borderColor: 'var(--line)', background: 'rgba(0,179,105,0.08)' }}
      >
        Staff members monitor every class group by default. You do not invite them — they can open
        the room, read, and message without changing these settings. They can also pause or delete
        a group.
      </div>
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
      <textarea
        value={newRules}
        onChange={(e) => setNewRules(e.target.value)}
        placeholder="Group rules (optional) — how classmates should use this room"
        className="mt-2 w-full border px-3 py-2 text-[14px]"
        style={{ borderColor: 'var(--line)' }}
        rows={3}
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
      <label className="mt-3 flex items-start gap-2 text-[13px]">
        <input type="checkbox" checked={newCanPost} onChange={(e) => setNewCanPost(e.target.checked)} className="mt-0.5" />
        Members can post messages (staff and the class advocate always can)
      </label>
      <label className="mt-2 flex items-start gap-2 text-[13px]">
        <input type="checkbox" checked={newInvite} onChange={(e) => setNewInvite(e.target.checked)} className="mt-0.5" />
        Members can add classmates (otherwise only the class advocate)
      </label>
      {courses.length === 0 ? (
        <p className="mt-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
          Enrol in a course first so classmates can be added.
        </p>
      ) : null}
    </>
  );
}

export default function ClassRoomsClient({
  userId,
}: {
  userId: string;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const [classHead, setClassHead] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
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
  const [newRules, setNewRules] = useState('');
  const [newInvite, setNewInvite] = useState(false);
  const [newCanPost, setNewCanPost] = useState(true);
  const [newCourse, setNewCourse] = useState('');
  const [newChannel, setNewChannel] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editRules, setEditRules] = useState('');
  const [editInvite, setEditInvite] = useState(false);
  const [editCanPost, setEditCanPost] = useState(true);
  const [mobilePane, setMobilePane] = useState<'groups' | 'channels' | 'chat'>('groups');
  const [pickMates, setPickMates] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const stickBottom = useRef(true);

  const loadGroups = useCallback(async () => {
    const res = await fetch('/api/learn/groups');
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not load groups');
    setClassHead(Boolean(data.classHead));
    setIsStaff(Boolean(data.isStaff));
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

  const wantedGroup = search.get('group');

  useEffect(() => {
    loadGroups()
      .then(() => {
        if (wantedGroup) setGroupId(wantedGroup);
        else setGroupId(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load'))
      .finally(() => setLoaded(true));
  }, [loadGroups, wantedGroup]);

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
  const staffHere = Boolean(isStaff || groupMeta?.isStaffMonitor);
  const banned = Boolean(groupMeta?.banned);
  const canPost = Boolean(staffHere || (!banned && (owner || groupMeta?.membersCanPost !== false)));
  const canInvite = owner || Boolean(groupMeta?.membersCanInvite);

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
      {
        action: 'create_group',
        title: newTitle,
        description: newDesc,
        courseId: newCourse,
        rules: newRules,
        membersCanInvite: newInvite,
        membersCanPost: newCanPost,
      },
      'create',
    );
    if (!data?.id) return;
    setCreateOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewRules('');
    setNewInvite(false);
    setNewCanPost(true);
    await loadGroups();
    const id = String(data.id || '');
    if (id) enterGroup(id);
  }

  function enterGroup(id: string) {
    setGroupId(id);
    setMobilePane('channels');
    router.replace(`/dashboard/study-groups?group=${encodeURIComponent(id)}`, { scroll: false });
  }

  function leaveToList() {
    setGroupId(null);
    setChannelId(null);
    setChannels([]);
    setMembers([]);
    setMessages([]);
    setGroupMeta(null);
    setMobilePane('groups');
    router.replace('/dashboard/study-groups', { scroll: false });
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

  if (!loaded) {
    return (
      <div className="mx-auto max-w-[720px] py-16 text-center text-[14px]" style={{ color: 'var(--ink-soft)' }}>
        Loading your groups…
      </div>
    );
  }

  if (!groupId) {
    return (
      <div className="mx-auto max-w-[1180px]">
        <PageHeader
          art="/way_live.webp"
          tone="lilac"
          title="Your groups"
          description={
            isStaff
              ? 'Staff can open any class group without an invite, read and message inside, and pause or delete a room.'
              : 'Learn together with your course mates. Open a group to chat, share and ask questions.'
          }
          actions={
            classHead ? (
              <button
                type="button"
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--navy)] px-4 py-2.5 text-[14px] font-semibold text-white"
              >
                <Plus size={15} /> New group
              </button>
            ) : (
              <p className="text-[13.5px] text-[var(--navy)]/65">Class advocates can create groups for a course.</p>
            )
          }
        />

        {error ? <p className="mb-4 text-[13px] text-[#b91c1c]">{error}</p> : null}

        {groups.length === 0 ? (
          <div className="grid items-center gap-6 overflow-hidden rounded-[28px] bg-white p-6 sm:p-10 md:grid-cols-[1fr_300px]">
            <div>
              <h2 className="text-[24px] font-bold text-[var(--navy)]">You’re not in any group yet</h2>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[var(--ink-soft)]">
                {isStaff
                  ? 'When class advocates create course groups, they appear here so you can monitor them without being invited.'
                  : 'When a class advocate adds you to a course group, it will show up here. Then open it to start chatting.'}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/doodles/sitting.svg" alt="" className="mx-auto hidden h-48 w-auto md:block" />
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {groups.map((g, i) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => enterGroup(g.id)}
                  className="group flex h-full w-full flex-col rounded-3xl p-5 text-left transition-transform hover:-translate-y-1"
                  style={{ background: ['var(--pastel-lilac)', 'var(--pastel-mint)', 'var(--pastel-sky)', 'var(--pastel-butter)', 'var(--pastel-sky)'][i % 5] }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[15px] font-extrabold text-[var(--navy)]">
                      {initials(g.title)}
                    </span>
                    {g.unread > 0 ? (
                      <span className="rounded-full bg-[var(--green)] px-2.5 py-0.5 text-[12px] font-bold text-white">
                        {g.unread > 9 ? '9+' : g.unread} new
                      </span>
                    ) : g.banned ? (
                      <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-[12px] font-semibold text-[var(--navy)]">Paused</span>
                    ) : null}
                  </div>
                  <span className="mt-4 block text-[17px] font-bold leading-snug text-[var(--navy)]">{g.title}</span>
                  <span className="mt-1 block text-[13.5px] text-[var(--navy)]/70">{g.courseTitle || 'Course group'}</span>
                  {g.lastPreview ? (
                    <span className="mt-3 line-clamp-2 block rounded-2xl rounded-tl-md bg-white/70 px-3.5 py-2.5 text-[13px] text-[var(--navy)]/80">
                      {g.lastPreview}
                    </span>
                  ) : null}
                  <span className="mt-auto flex items-center justify-between pt-4 text-[13px] font-semibold text-[var(--navy)]">
                    <span className="inline-flex items-center gap-1.5">
                      <Users size={14} /> {g.memberCount} member{g.memberCount === 1 ? '' : 's'}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-xl bg-white px-3 py-1.5 transition-colors group-hover:bg-[var(--navy)] group-hover:text-white">
                      Open <ChevronRight size={14} />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {createOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <form
              className="w-full max-w-md card bg-white p-5"
              onSubmit={(e) => {
                e.preventDefault();
                void create();
              }}
            >
              <h2 className="font-display text-[22px]">New class group</h2>
              <GroupCreateFields
                newTitle={newTitle}
                setNewTitle={setNewTitle}
                newDesc={newDesc}
                setNewDesc={setNewDesc}
                newRules={newRules}
                setNewRules={setNewRules}
                newInvite={newInvite}
                setNewInvite={setNewInvite}
                newCanPost={newCanPost}
                setNewCanPost={setNewCanPost}
                newCourse={newCourse}
                setNewCourse={setNewCourse}
                courses={courses}
              />
              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="border px-3 py-2 text-[13px]"
                  style={{ borderColor: 'var(--line)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy === 'create'}
                  className="px-3 py-2 text-[13px] font-semibold text-white"
                  style={{ background: '#00B369' }}
                >
                  {busy === 'create' ? 'Creating…' : 'Create group'}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="-mx-4 -mt-6 mb-[-7rem] flex h-[calc(100dvh-64px)] min-h-[520px] overflow-hidden border-t sm:-mx-6 lg:-mr-10 lg:mb-[-4rem]" style={{ borderColor: 'var(--line)' }}>
      <aside
        className={`${mobilePane === 'groups' ? 'flex' : 'hidden'} w-[72px] shrink-0 flex-col items-center gap-2 overflow-y-auto py-3 md:flex`}
        style={{ background: '#f0f2f5' }}
      >
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            title={g.title}
            onClick={() => enterGroup(g.id)}
            className="relative flex h-12 w-12 items-center justify-center text-[13px] font-bold"
            style={{
              background: groupId === g.id ? '#00a884' : '#fff',
              color: groupId === g.id ? '#fff' : '#3b4a54',
              borderRadius: 999,
              boxShadow: groupId === g.id ? '0 0 0 3px rgba(0,168,132,0.25)' : '0 1px 2px rgba(11,20,26,0.15)',
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
            style={{ background: '#fff', color: '#00a884', boxShadow: '0 1px 2px rgba(11,20,26,0.15)' }}
          >
            <Plus size={20} />
          </button>
        ) : null}
      </aside>

      <aside
        className={`${mobilePane === 'channels' ? 'flex' : 'hidden'} w-full shrink-0 flex-col md:flex md:w-[240px]`}
        style={{ background: '#fff', color: '#111b21', borderRight: '1px solid #e9edef' }}
      >
        <div className="border-b px-4 py-3" style={{ borderColor: '#e9edef' }}>
          <button
            type="button"
            onClick={leaveToList}
            className="mb-2 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold"
            style={{ borderColor: '#d1d7db', color: '#111b21' }}
          >
            All groups
          </button>
          <p className="truncate font-semibold">{groupMeta?.title || 'Class rooms'}</p>
          <p className="truncate text-[11.5px]" style={{ color: '#667781' }}>
            {groupMeta?.courseTitle || 'Pick a group to start talking'}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: '#667781' }}>
            Channels
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
              className="mb-0.5 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[14px]"
              style={{
                background: channelId === ch.id ? '#e9edef' : 'transparent',
                color: channelId === ch.id ? '#fff' : '#b7c2d0',
              }}
            >
              <Hash size={14} />
              <span className="min-w-0 flex-1 truncate">{ch.name}</span>
              {ch.unread > 0 ? (
                <span className="rounded-full bg-[#25d366] px-1.5 text-[10px] font-bold text-white">{ch.unread}</span>
              ) : null}
            </button>
          ))}
          {owner ? (
            <button
              type="button"
              onClick={() => setChannelOpen(true)}
              className="mt-2 flex w-full items-center gap-2 border px-2 py-1.5 text-left text-[12.5px] font-semibold"
              style={{ borderColor: '#d1d7db', color: '#111b21' }}
            >
              <Plus size={13} /> New channel
            </button>
          ) : null}
        </div>
        <div className="border-t p-3 text-[12px]" style={{ borderColor: '#e9edef', color: '#667781' }}>
          {staffHere
            ? 'You are staff. You can read and message here without an invite, and pause or delete the group.'
            : owner
              ? 'You are class advocate. Add course mates from the member list. Staff monitor this room.'
              : classHead
                ? 'Create a group for your course, then add classmates. Staff monitor every group.'
                : 'Only class advocates can create groups. Instructors assign that from My Students. Staff monitor conversations.'}
        </div>
      </aside>

      <section className={`${mobilePane === 'chat' ? 'flex' : 'hidden'} min-w-0 flex-1 flex-col md:flex`} style={WA_WALLPAPER}>
        <header className="flex items-center gap-3 px-3 py-2.5" style={{ background: '#f0f2f5', borderBottom: '1px solid #e9edef' }}>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 md:hidden" onClick={() => setMobilePane('channels')} aria-label="Back">
            <ChevronLeft size={20} />
          </button>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-[14px] font-bold text-white">
            {initials(groupMeta?.title || 'G')}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15.5px] font-semibold text-[#111b21]">
              {groupMeta?.title || 'Group'}
              {activeChannel ? <span className="font-normal text-[#667781]"> · #{activeChannel.name}</span> : null}
            </p>
            <p className="truncate text-[12.5px] text-[#667781]">
              {members.length} members{activeChannel?.topic ? ` · ${activeChannel.topic}` : ''}
            </p>
          </div>
        </header>
        {groupId && (staffHere || banned || groupMeta?.rules) ? (
          <div
            className="px-4 py-2 text-center text-[12.5px] leading-relaxed"
            style={{
              background: banned ? '#fde8e8' : '#fff5c4',
            }}
          >
            {banned ? (
              <p>
                Staff paused this group. Members can read; posting is off until staff restore it.
              </p>
            ) : (
              <p>Staff monitor this conversation. They can enter without an invite.</p>
            )}
            {groupMeta?.rules ? (
              <p className="mt-1" style={{ color: 'var(--ink-soft)' }}>
                Rules: {groupMeta.rules}
              </p>
            ) : null}
          </div>
        ) : null}

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
                Chat with your class: channels for talk, notes, and ideas. Class heads create the room and add
                course mates.
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="mx-auto my-10 max-w-sm rounded-xl bg-[#fff5c4] px-4 py-3 text-center">
              <p className="text-[14px] font-semibold text-[#54656f]">#{activeChannel?.name || 'general'}</p>
              <p className="mt-1 text-[13px] text-[#54656f]">
                {activeChannel?.topic || 'This is the start of the channel. Share notes, ideas, and questions.'}
              </p>
            </div>
          ) : (
            grouped.map((row, i) =>
              row.type === 'day' ? (
                <p key={`d-${row.label}-${i}`} className="my-3 flex justify-center">
                  <span className="rounded-lg bg-white/90 px-3 py-1 text-[11.5px] font-medium text-[#54656f] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
                    {row.label}
                  </span>
                </p>
              ) : (
                <article
                  key={row.msg.id}
                  className={`group relative flex ${row.showName ? 'mt-2.5' : 'mt-0.5'} ${row.msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                >
                  {row.msg.senderId !== userId ? (
                    <div className="mr-1.5 w-8 shrink-0 self-end">
                      {row.showName ? (
                        <PersonAvatar
                          name={row.msg.senderName}
                          src={row.msg.senderAvatar || members.find((m) => m.userId === row.msg.senderId)?.avatar}
                          size={32}
                        />
                      ) : null}
                    </div>
                  ) : null}
                  <div
                    className={`relative max-w-[82%] px-2.5 pb-1.5 pt-1.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] sm:max-w-[68%] ${
                      row.msg.senderId === userId
                        ? `bg-[#d9fdd3] ${row.showName ? 'rounded-[10px] rounded-tr-none' : 'rounded-[10px]'}`
                        : `bg-white ${row.showName ? 'rounded-[10px] rounded-tl-none' : 'rounded-[10px]'}`
                    }`}
                  >
                    {row.showName && row.msg.senderId !== userId ? (
                      <p className="mb-0.5 text-[12.5px] font-semibold leading-tight" style={{ color: nameColor(row.msg.senderId) }}>
                        {row.msg.senderName}
                      </p>
                    ) : null}
                    {row.msg.attachments?.length ? (
                      <div className="mb-1 flex flex-col gap-1.5">
                        {row.msg.attachments.map((a) =>
                          a.kind === 'image' || isImageName(a.name, a.url) ? (
                            <a key={a.url} href={a.url} target="_blank" rel="noreferrer">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={a.url} alt={a.name} className="max-h-60 w-full max-w-[280px] rounded-lg object-cover" />
                            </a>
                          ) : (
                            <a
                              key={a.url}
                              href={a.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 rounded-lg bg-black/[0.05] px-3 py-2 text-[13px]"
                            >
                              <FileText size={16} className="shrink-0" /> <span className="truncate">{a.name}</span>
                            </a>
                          ),
                        )}
                      </div>
                    ) : null}
                    <div className="flex flex-wrap items-end justify-end gap-x-2">
                      {row.msg.body ? (
                        <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-[14.2px] leading-[1.35] text-[#111b21]">
                          {row.msg.body}
                        </p>
                      ) : null}
                      <span className="ml-auto translate-y-[2px] select-none text-[10.5px] leading-none text-[#667781]">
                        {new Date(row.msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {row.msg.senderId === userId || owner || staffHere ? (
                      <button
                        type="button"
                        className="absolute -top-2 right-1 hidden rounded-full bg-white px-2 py-0.5 text-[10.5px] font-semibold shadow group-hover:block"
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

        {channelId && canPost ? (
          <form onSubmit={send} className="px-3 py-2.5" style={{ background: '#f0f2f5' }}>
            {pendingFiles.length ? (
              <div className="mb-2 flex flex-wrap gap-2">
                {pendingFiles.map((f) => (
                  <span key={f.url} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[12px]">
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
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#54656f] hover:bg-black/5"
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
                className="max-h-32 min-h-[44px] flex-1 resize-none rounded-3xl border-0 bg-white px-4 py-3 text-[14.5px] outline-none"
                style={{ boxShadow: '0 1px 1px rgba(11,20,26,0.08)' }}
              />
              <button
                type="submit"
                disabled={busy === 'send' || (!body.trim() && !pendingFiles.length)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-50"
                style={{ background: '#00a884' }}
                aria-label="Send"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        ) : channelId ? (
          <p className="px-4 py-3 text-center text-[13px] text-[#54656f]" style={{ background: '#f0f2f5' }}>
            {banned
              ? 'This group is paused by staff. You can still read the conversation.'
              : 'Only the class advocate and staff can post in this group.'}
          </p>
        ) : null}
      </section>

      <aside className="hidden w-[240px] shrink-0 flex-col border-l lg:flex" style={{ borderColor: '#e9edef', background: '#fff' }}>
        <div className="flex items-center justify-between border-b px-3 py-3" style={{ borderColor: 'var(--line)' }}>
          <p className="text-[12px] font-semibold uppercase tracking-wide">Members — {members.length}</p>
          {owner || canInvite ? (
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              title="Add course mates"
              className="inline-flex items-center border px-2 py-1 text-[11px] font-semibold"
              style={{ borderColor: 'var(--line)' }}
            >
              <UserPlus size={13} />
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
                {m.isStaff ? <span className="ml-1 text-[10px] font-semibold" style={{ color: 'var(--ink-soft)' }}>STAFF</span> : null}
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
        {groupMeta && !owner && !staffHere ? (
          <button
            type="button"
            className="border-t px-3 py-2 text-left text-[12px]"
            style={{ borderColor: 'var(--line)', color: '#b91c1c' }}
            onClick={() =>
              post({ action: 'remove_member', groupId, userId }, 'leave').then((ok) => {
                if (ok) {
                  leaveToList();
                  void loadGroups();
                }
              })
            }
          >
            Leave group
          </button>
        ) : null}
        {owner || staffHere ? (
          <button
            type="button"
            className="border-t px-3 py-2 text-left text-[12px]"
            style={{ borderColor: 'var(--line)' }}
            onClick={() => {
              setEditRules(groupMeta?.rules || '');
              setEditInvite(Boolean(groupMeta?.membersCanInvite));
              setEditCanPost(groupMeta?.membersCanPost !== false);
              setSettingsOpen(true);
            }}
          >
            Group rules & permissions
          </button>
        ) : null}
        {staffHere ? (
          <button
            type="button"
            className="border-t px-3 py-2 text-left text-[12px]"
            style={{ borderColor: 'var(--line)', color: banned ? 'var(--green-deep)' : '#b91c1c' }}
            onClick={() => {
              const action = banned ? 'unban_group' : 'ban_group';
              const okAsk = banned
                ? confirm('Restore posting in this group?')
                : confirm('Pause this group? Students can still read, but cannot post.');
              if (!okAsk) return;
              post({ action, groupId }, 'ban').then((ok) => {
                if (ok && groupId) void loadWorkspace(groupId);
              });
            }}
          >
            {banned ? 'Restore group' : 'Pause group'}
          </button>
        ) : null}
        {owner || staffHere ? (
          <button
            type="button"
            className="border-t px-3 py-2 text-left text-[12px]"
            style={{ borderColor: 'var(--line)', color: '#b91c1c' }}
            onClick={() => {
              if (!confirm('Delete this group and all messages?')) return;
              post({ action: 'delete_group', groupId }, 'delg').then((ok) => {
                if (ok) {
                  leaveToList();
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
            className="w-full max-w-md card bg-white p-5"
            onSubmit={(e) => {
              e.preventDefault();
              void create();
            }}
          >
            <h2 className="font-display text-[22px]">New class group</h2>
            <GroupCreateFields
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              newDesc={newDesc}
              setNewDesc={setNewDesc}
              newRules={newRules}
              setNewRules={setNewRules}
              newInvite={newInvite}
              setNewInvite={setNewInvite}
              newCanPost={newCanPost}
              setNewCanPost={setNewCanPost}
              newCourse={newCourse}
              setNewCourse={setNewCourse}
              courses={courses}
            />
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
            className="w-full max-w-sm card bg-white p-5"
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
          <div className="w-full max-w-md card bg-white p-5">
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

      {settingsOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            className="w-full max-w-md card bg-white p-5"
            onSubmit={(e) => {
              e.preventDefault();
              post(
                {
                  action: 'update_group',
                  groupId,
                  rules: editRules,
                  membersCanInvite: editInvite,
                  membersCanPost: editCanPost,
                },
                'settings',
              ).then((ok) => {
                if (ok && groupId) {
                  setSettingsOpen(false);
                  void loadWorkspace(groupId);
                }
              });
            }}
          >
            <h2 className="font-display text-[20px]">Group rules & permissions</h2>
            <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              Staff still monitor this room and can enter without being invited. These settings only
              change what students can do.
            </p>
            <textarea
              value={editRules}
              onChange={(e) => setEditRules(e.target.value)}
              placeholder="Group rules"
              rows={4}
              className="mt-3 w-full border px-3 py-2 text-[14px]"
              style={{ borderColor: 'var(--line)' }}
            />
            <label className="mt-3 flex items-start gap-2 text-[13px]">
              <input type="checkbox" checked={editCanPost} onChange={(e) => setEditCanPost(e.target.checked)} className="mt-0.5" />
              Members can post messages
            </label>
            <label className="mt-2 flex items-start gap-2 text-[13px]">
              <input type="checkbox" checked={editInvite} onChange={(e) => setEditInvite(e.target.checked)} className="mt-0.5" />
              Members can add classmates
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setSettingsOpen(false)} className="border px-3 py-2 text-[13px]" style={{ borderColor: 'var(--line)' }}>
                Cancel
              </button>
              <button type="submit" className="px-3 py-2 text-[13px] font-semibold text-white" style={{ background: '#00B369' }}>
                Save
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
