'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, Megaphone, Plus, Send } from 'lucide-react';
import JoinIssueModal, {
  joinIssueFromError,
  type JoinIssue,
} from '@/components/dashboard/JoinIssueModal';

export function JoinCampusButton({ slug, isMember }: { slug: string; isMember: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [issue, setIssue] = useState<JoinIssue | null>(null);

  if (isMember) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold"
        style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}
      >
        <Check size={14} /> Member
      </span>
    );
  }

  async function join() {
    setBusy(true);
    setIssue(null);
    try {
      const res = await fetch(`/api/learn/institutions/${slug}/join`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        router.refresh();
        return;
      }
      setIssue(joinIssueFromError(data.error, res.status));
    } catch {
      setIssue(joinIssueFromError('db_unavailable'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={join}
        disabled={busy}
        className="btn btn-light !rounded-none !px-6 !py-2.5 text-[13.5px]"
      >
        {busy ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
        Join campus
      </button>
      {issue ? <JoinIssueModal issue={issue} onClose={() => setIssue(null)} /> : null}
    </>
  );
}

export function AnnouncementComposer({ slug }: { slug: string }) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);

  async function post(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch(`/api/learn/institutions/${slug}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      if (res.ok) {
        setTitle('');
        setBody('');
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={post} className="border p-5" style={{ borderColor: 'var(--line)' }}>
      <div className="mb-3 flex items-center gap-2 text-[13.5px] font-semibold">
        <Megaphone size={15} style={{ color: 'var(--green-deep)' }} />
        Post an announcement
      </div>
      <input
        className="form-input mb-2.5 !rounded-none"
        placeholder="Announcement title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="form-input mb-3 !rounded-none"
        rows={3}
        placeholder="What should your campus know? (supports **bold**, lists, `code`)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <button type="submit" disabled={busy} className="btn btn-primary !rounded-none !px-5 !py-2.5 text-[13px]">
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        Publish
      </button>
    </form>
  );
}
