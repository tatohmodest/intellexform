'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload } from 'lucide-react';

export default function BookTutorUpload() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setMsg('Choose a PDF, EPUB, DOCX, or text file.');
      return;
    }
    setBusy(true);
    setMsg('Uploading — large books are studied in the background, not in this click…');
    try {
      const body = new FormData();
      body.set('file', file);
      if (title.trim()) body.set('title', title.trim());
      const res = await fetch('/api/learn/book-tutor', { method: 'POST', body });
      const data = await res.json().catch(() => ({}));
      if (res.status === 413) {
        throw new Error('This host rejected the file as too large. Try the EPUB (usually much smaller) or a text PDF under 40 MB.');
      }
      if (!res.ok) throw new Error(data.error || 'Could not start a tutor from that file.');
      router.push(`/dashboard/library/learn/${data.id}`);
    } catch (err) {
      const raw = err instanceof Error ? err.message : '';
      const timedOut = /failed to fetch|networkerror|load failed/i.test(raw);
      setMsg(
        timedOut
          ? 'The connection dropped on a very large file. Try an unlocked EPUB, or a PDF under 40 MB that you can select text in.'
          : raw || 'Could not start a tutor from that file.',
      );
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border p-5"
      style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
    >
      <h2 className="font-display text-[22px]">Bring your own book</h2>
      <p className="mt-1 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
        Upload a copy you own (PDF, EPUB, DOCX, or text). We never save the file. Locked ebooks
        (.azw / .mobi) and scanned image PDFs will not work — use an unlocked EPUB or a PDF you
        can select text in. After upload, wait on the next page until every chapter is stored. You can
        leave and come back — preparation continues in the background.
      </p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title (optional)"
        className="mt-4 w-full border px-3 py-2.5 text-[14px]"
        style={{ borderColor: 'var(--line)', background: 'transparent' }}
      />
      <label
        className="mt-3 flex cursor-pointer flex-col items-center justify-center border border-dashed px-4 py-8 text-center"
        style={{ borderColor: 'var(--line)' }}
      >
        <Upload size={18} style={{ color: 'var(--ink-soft)' }} />
        <span className="mt-2 text-[13.5px] font-semibold">{file ? file.name : 'Choose file'}</span>
        <span className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
          PDF, EPUB, DOCX, Markdown, or .txt · 80 MB max · original file is not stored
        </span>
        <input
          type="file"
          accept=".pdf,.epub,.docx,.txt,.md,application/pdf,application/epub+zip"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </label>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="btn btn-primary !px-5 !py-2.5 text-[13.5px]"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : null}
          {busy ? 'Building tutor…' : 'Start learning'}
        </button>
        {msg ? (
          <span className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            {msg}
          </span>
        ) : null}
      </div>
    </form>
  );
}
