'use client';

import { useCallback, useEffect, useState } from 'react';
import { BookMarked, Loader2, Plus, RefreshCw } from 'lucide-react';
import ImageUploadField from '@/components/media/ImageUploadField';

type AdminBook = {
  id: string;
  title: string;
  authorName: string;
  category: string;
  coverImageUrl?: string | null;
  downloadUrl?: string | null;
  priceXAF: number;
  published: boolean;
  sales: number;
  chapterCount: number;
  updatedAt?: string;
};

type BookRequest = {
  id: string;
  userName: string;
  userEmail: string;
  title: string;
  authorHint: string;
  reason: string;
  status: 'pending' | 'fulfilled' | 'rejected';
  createdAt: string;
};

const CATEGORIES = ['Programming', 'Data & AI', 'Design', 'Marketing', 'Career', 'Business', 'Other'];

export default function AdminLibrary() {
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [requests, setRequests] = useState<BookRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Programming');
  const [priceXAF, setPriceXAF] = useState(0);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [publishNow, setPublishNow] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [bRes, rRes] = await Promise.all([
        fetch('/api/admin/books'),
        fetch('/api/admin/book-requests'),
      ]);
      if (bRes.ok) {
        const data = await bRes.json();
        setBooks(data.books || []);
      }
      if (rRes.ok) {
        const data = await rRes.json();
        setRequests(data.requests || []);
      }
    } catch {
      setError('Could not load library data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createBook() {
    if (!title.trim()) return;
    setBusy('create');
    setError('');
    try {
      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          priceXAF,
          coverImageUrl: coverImageUrl || null,
          downloadUrl: downloadUrl || null,
          published: publishNow,
          authorName: 'InTelleX',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Create failed');
      setTitle('');
      setPriceXAF(0);
      setCoverImageUrl('');
      setDownloadUrl('');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setBusy(null);
    }
  }

  async function patchBook(id: string, patch: Record<string, unknown>) {
    setBusy(id);
    setError('');
    try {
      const res = await fetch('/api/admin/books', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...patch }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Update failed');
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setBusy(null);
    }
  }

  async function setRequestStatus(id: string, status: 'fulfilled' | 'rejected' | 'pending') {
    setBusy(`req-${id}`);
    try {
      await fetch('/api/admin/book-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      await load();
    } finally {
      setBusy(null);
    }
  }

  if (loading && !books.length) {
    return (
      <div className="flex items-center justify-center gap-3 py-20" style={{ color: 'var(--ink-soft)' }}>
        <RefreshCw size={18} className="animate-spin" /> Loading library…
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <BookMarked size={11} /> Library
        </div>
        <h2 className="font-display text-[24px]">Publish books</h2>
        <p className="mt-1 max-w-2xl text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          Publish to the student library. Set price to 0 for free, or any XAF amount.
          Active InTelleX Students (1,999 XAF/mo) read paid books free.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border px-4 py-3 text-sm" style={{ borderColor: '#fecaca', color: '#b91c1c' }}>
          {error}
        </div>
      )}

      <section className="rounded-2xl border p-5" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
        <h3 className="mb-4 font-display text-[18px]">New book</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-[12px] font-semibold sm:col-span-2">
            Title
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[14px]"
              style={{ borderColor: 'var(--line)' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Python for beginners"
            />
          </label>
          <label className="block text-[12px] font-semibold">
            Category
            <select
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[14px]"
              style={{ borderColor: 'var(--line)' }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block text-[12px] font-semibold">
            Price (XAF) · 0 = free
            <input
              type="number"
              min={0}
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[14px]"
              style={{ borderColor: 'var(--line)' }}
              value={priceXAF}
              onChange={(e) => setPriceXAF(Math.max(0, Number(e.target.value) || 0))}
            />
          </label>
          <label className="block text-[12px] font-semibold sm:col-span-2 lg:col-span-4">
            Download link
            <input
              type="url"
              className="mt-1 w-full rounded-xl border px-3 py-2.5 text-[14px]"
              style={{ borderColor: 'var(--line)' }}
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              placeholder="https://..."
            />
          </label>
          <div className="sm:col-span-2 lg:col-span-4">
            <ImageUploadField
              label="Book cover image"
              value={coverImageUrl}
              onChange={setCoverImageUrl}
              kind="book_cover"
              hint="Upload the image shown as the library book cover."
              previewHeight={180}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" checked={publishNow} onChange={(e) => setPublishNow(e.target.checked)} />
            Publish to library now
          </label>
          <button
            type="button"
            className="btn btn-g"
            disabled={busy === 'create' || !title.trim()}
            onClick={createBook}
          >
            {busy === 'create' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Create book
          </button>
          <button type="button" className="btn btn-ghost" onClick={load}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-display text-[18px]">All books ({books.length})</h3>
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--line)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--paper-dim)' }}>
                {['Title', 'Author', 'Price', 'Status', 'Sales', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--ink-soft)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id} className="border-t" style={{ borderColor: 'var(--line)' }}>
                  <td className="px-4 py-3 font-semibold">{b.title}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{b.authorName}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      className="w-28 rounded-lg border px-2 py-1.5 text-[13px]"
                      style={{ borderColor: 'var(--line)' }}
                      defaultValue={b.priceXAF}
                      onBlur={(e) => {
                        const next = Math.max(0, Math.round(Number(e.target.value) || 0));
                        if (next !== b.priceXAF) patchBook(b.id, { priceXAF: next });
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span style={{ color: b.published ? 'var(--green-deep)' : 'var(--ink-soft)' }}>
                      {b.published ? 'Published' : 'Draft'}
                    </span>
                    {b.downloadUrl ? <div className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>Download link set</div> : null}
                  </td>
                  <td className="px-4 py-3">{b.sales}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-[12.5px] font-semibold"
                      style={{ color: 'var(--green-deep)' }}
                      disabled={busy === b.id}
                      onClick={() => patchBook(b.id, { published: !b.published })}
                    >
                      {busy === b.id ? '…' : b.published ? 'Unpublish' : 'Publish'}
                    </button>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: 'var(--ink-soft)' }}>
                    No books yet. Create one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="mb-3 font-display text-[18px]">Student book requests ({requests.length})</h3>
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--line)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--paper-dim)' }}>
                {['Requested', 'Student', 'Author hint', 'Why', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--ink-soft)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t" style={{ borderColor: 'var(--line)' }}>
                  <td className="px-4 py-3 font-semibold max-w-[200px]">{r.title}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>
                    <div>{r.userName}</div>
                    <div className="text-[11.5px]">{r.userEmail}</div>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{r.authorHint || ' - '}</td>
                  <td className="px-4 py-3 max-w-[220px]" style={{ color: 'var(--ink-soft)' }}>{r.reason || ' - '}</td>
                  <td className="px-4 py-3 capitalize">{r.status}</td>
                  <td className="px-4 py-3 space-x-2">
                    {r.status !== 'fulfilled' && (
                      <button
                        type="button"
                        className="text-[12px] font-semibold"
                        style={{ color: 'var(--green-deep)' }}
                        disabled={busy === `req-${r.id}`}
                        onClick={() => setRequestStatus(r.id, 'fulfilled')}
                      >
                        Mark fulfilled
                      </button>
                    )}
                    {r.status !== 'rejected' && (
                      <button
                        type="button"
                        className="text-[12px] font-semibold"
                        style={{ color: '#b91c1c' }}
                        disabled={busy === `req-${r.id}`}
                        onClick={() => setRequestStatus(r.id, 'rejected')}
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: 'var(--ink-soft)' }}>
                    No student requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
