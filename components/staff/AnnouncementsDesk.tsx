'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, X } from 'lucide-react';
import { uploadMentorAsset } from '@/lib/learn/mentorUpload';

function audienceMeta(audience: string): { label: string; color: string } {
  if (audience === 'students') {
    return { label: 'Institution', color: 'var(--green-deep)' };
  }
  if (audience === 'staff') {
    return { label: 'Staff only', color: 'var(--ink-soft)' };
  }
  return { label: 'Public', color: 'var(--blue-ink)' };
}

type Item = {
  id: string;
  title: string;
  body: string;
  audience: string;
  authorName: string;
  createdAt: string | Date;
  campusSlug?: string;
  imageUrl?: string | null;
};

export default function AnnouncementsDesk({
  items,
  canWrite,
  campuses,
}: {
  items: Item[];
  canWrite: boolean;
  campuses: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState<'everyone' | 'students' | 'staff'>('everyone');
  const [campusSlug, setCampusSlug] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');

  async function onPickImage(file: File) {
    setUploading(true);
    setMsg('');
    try {
      const uploaded = await uploadMentorAsset('note', file, file.name);
      setImageUrl(uploaded.url);
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not upload image');
    } finally {
      setUploading(false);
    }
  }

  async function publish() {
    setBusy(true);
    setMsg('');
    try {
      const res = await fetch('/api/staff/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          audience,
          campusSlug,
          imageUrl: imageUrl || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not publish');
      setTitle('');
      setBody('');
      setImageUrl('');
      setAudience('everyone');
      setMsg('Published.');
      router.refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Could not publish');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {canWrite ? (
        <div className="border p-4" style={{ borderColor: 'rgba(0,179,105,0.28)', background: 'rgba(0,179,105,0.04)' }}>
          <h2 className="mb-1 font-display text-[20px]">Publish an announcement</h2>
          <p className="mb-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Choose who can see it. Public posts appear for everyone signed in. Institution posts
            are only for official students. An image is optional.
          </p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="mb-2 w-full border px-3 py-2 text-[14px]"
            style={{ borderColor: 'var(--line)', background: '#fff' }}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What should people know?"
            rows={4}
            className="mb-2 w-full border px-3 py-2 text-[14px]"
            style={{ borderColor: 'var(--line)', background: '#fff' }}
          />
          {imageUrl ? (
            <div className="relative mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="max-h-48 w-full border object-cover" style={{ borderColor: 'var(--line)' }} />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute right-2 top-2 inline-flex items-center gap-1 border bg-white px-2 py-1 text-[12px] font-semibold"
                style={{ borderColor: 'var(--line)' }}
              >
                <X size={12} /> Remove image
              </button>
            </div>
          ) : (
            <label className="mb-3 inline-flex cursor-pointer items-center gap-1.5 border px-3 py-2 text-[13px] font-semibold" style={{ borderColor: 'var(--line)', background: '#fff' }}>
              <ImagePlus size={14} />
              {uploading ? 'Uploading…' : 'Add image (optional)'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void onPickImage(file);
                  e.target.value = '';
                }}
              />
            </label>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-[12.5px] font-semibold">
              Visibility
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as typeof audience)}
                className="ml-2 border px-3 py-2 text-[13px] font-normal"
                style={{ borderColor: 'var(--line)', background: '#fff' }}
              >
                <option value="everyone">Public — everyone signed in</option>
                <option value="students">Institution only — official students</option>
                <option value="staff">Staff only</option>
              </select>
            </label>
            {campuses.length > 0 ? (
              <select
                value={campusSlug}
                onChange={(e) => setCampusSlug(e.target.value)}
                className="border px-3 py-2 text-[13px]"
                style={{ borderColor: 'var(--line)', background: '#fff' }}
              >
                <option value="">Entire institution</option>
                {campuses.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : null}
            <button
              type="button"
              onClick={publish}
              disabled={busy || uploading}
              className="px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50"
              style={{ background: '#00B369' }}
            >
              {busy ? 'Publishing…' : 'Publish'}
            </button>
            {msg ? (
              <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                {msg}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="border border-dashed px-4 py-10 text-center" style={{ borderColor: 'var(--line)' }}>
          <p className="font-display text-[20px]">No announcements yet</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            {canWrite
              ? 'Share registration updates, exam notices, or campus news.'
              : 'Announcements from authorized staff will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const meta = audienceMeta(item.audience);
            return (
              <article key={item.id} className="overflow-hidden border" style={{ borderColor: 'var(--line)' }}>
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.imageUrl} alt="" className="max-h-48 w-full object-cover" />
                ) : null}
                <div className="p-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: meta.color }}>
                    {meta.label}
                  </p>
                  <p className="mt-1 font-semibold">{item.title}</p>
                  <p className="mt-1 whitespace-pre-wrap text-[14px]">{item.body}</p>
                  <p className="mt-2 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                    {item.authorName}
                    {item.campusSlug ? ` · ${item.campusSlug}` : ''} ·{' '}
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
