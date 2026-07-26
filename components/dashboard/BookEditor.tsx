'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Save,
  Trash2,
} from 'lucide-react';
import type { BookView } from '@/lib/learn/ecosystem';

const CATEGORIES = ['Programming', 'Data & AI', 'Design', 'Marketing', 'Career', 'Business', 'Other'];
const COLORS = ['#00b369', '#4a90e2', '#7c3aed', '#e0234e', '#f59e0b', '#0C1116'];
const EMOJIS = ['📘', '📗', '📙', '🧭', '🐍', '⚡', '🚀', '🎨', '📊', '💼'];

export default function BookEditor({ book }: { book: BookView }) {
  const router = useRouter();
  const [title, setTitle] = useState(book.title);
  const [subtitle, setSubtitle] = useState(book.subtitle);
  const [description, setDescription] = useState(book.description);
  const [category, setCategory] = useState(book.category);
  const [coverColor, setCoverColor] = useState(book.coverColor);
  const [coverEmoji, setCoverEmoji] = useState(book.coverEmoji);
  const [priceXAF, setPriceXAF] = useState(book.priceXAF);
  const [chapters, setChapters] = useState(book.chapters);
  const [published, setPublished] = useState(book.published);
  const [activeChapter, setActiveChapter] = useState(0);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(nextPublished?: boolean) {
    setBusy(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/learn/books/${book.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          description,
          category,
          coverColor,
          coverEmoji,
          priceXAF,
          chapters,
          published: nextPublished ?? published,
        }),
      });
      if (res.ok) {
        if (nextPublished !== undefined) setPublished(nextPublished);
        setSaved(true);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  const chapter = chapters[activeChapter];

  return (
    <div className="mx-auto max-w-[1000px]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/dashboard/mentor" className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
          <ArrowLeft size={14} /> Mentor Studio
        </Link>
        <div className="flex items-center gap-2.5">
          <button onClick={() => save()} disabled={busy} className="btn btn-ghost !px-5 !py-2.5 text-[13px]">
            {busy ? <Loader2 size={14} className="animate-spin" /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
            {saved ? 'Saved' : 'Save draft'}
          </button>
          <button
            onClick={() => save(!published)}
            disabled={busy}
            className="btn !px-5 !py-2.5 text-[13px] text-white"
            style={{ background: published ? '#a14d18' : 'var(--green)' }}
          >
            {published ? <EyeOff size={14} /> : <Eye size={14} />}
            {published ? 'Unpublish' : 'Publish to library'}
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="mb-8 grid gap-6 rounded-3xl border p-6 lg:grid-cols-[180px_1fr]" style={{ borderColor: 'var(--line)' }}>
        {/* Cover preview */}
        <div>
          <div
            className="flex aspect-[3/4] w-full max-w-[180px] flex-col items-center justify-center rounded-2xl p-4 text-center text-white shadow-book"
            style={{ background: `linear-gradient(160deg, ${coverColor}, ${coverColor}cc)` }}
          >
            <span className="text-[40px]">{coverEmoji}</span>
            <span className="mt-3 line-clamp-3 font-display text-[15px] leading-snug">{title || 'Untitled'}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setCoverColor(c)}
                className="h-6 w-6 rounded-full border-2"
                style={{ background: c, borderColor: coverColor === c ? 'var(--ink)' : 'transparent' }}
                aria-label={`Cover color ${c}`}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setCoverEmoji(e)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[15px]"
                style={{ background: coverEmoji === e ? 'var(--paper-dim)' : 'transparent' }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold">Title</label>
            <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold">Subtitle</label>
            <input className="form-input" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold">Description</label>
            <textarea className="form-input" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold">Category</label>
              <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold">Price (XAF, 0 = free)</label>
              <input
                type="number"
                min={0}
                step={500}
                className="form-input"
                value={priceXAF}
                onChange={(e) => setPriceXAF(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border p-3" style={{ borderColor: 'var(--line)' }}>
          <div className="mono px-2 pb-2 pt-1 text-[10.5px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
            Chapters
          </div>
          {chapters.map((c, i) => (
            <div key={i} className="group flex items-center gap-1">
              <button
                onClick={() => setActiveChapter(i)}
                className="flex-1 truncate rounded-lg px-3 py-2 text-left text-[13px]"
                style={
                  i === activeChapter
                    ? { background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)', fontWeight: 600 }
                    : { color: 'var(--ink-soft)' }
                }
              >
                {i + 1}. {c.title || 'Untitled'}
              </button>
              {chapters.length > 1 && (
                <button
                  onClick={() => {
                    const copy = chapters.filter((_, ci) => ci !== i);
                    setChapters(copy);
                    setActiveChapter(Math.min(activeChapter, copy.length - 1));
                  }}
                  className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-lg group-hover:flex"
                  style={{ color: 'var(--ink-soft)' }}
                  aria-label="Delete chapter"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              setChapters([...chapters, { title: `Chapter ${chapters.length + 1}`, content: '' }]);
              setActiveChapter(chapters.length);
            }}
            className="mt-2 flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold"
            style={{ color: 'var(--green-deep)' }}
          >
            <Plus size={13} /> Add chapter
          </button>
        </aside>

        <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--line)' }}>
          <input
            className="form-input mb-3 font-semibold"
            value={chapter?.title ?? ''}
            placeholder="Chapter title"
            onChange={(e) => {
              const copy = [...chapters];
              copy[activeChapter] = { ...copy[activeChapter], title: e.target.value };
              setChapters(copy);
            }}
          />
          <textarea
            className="form-input mono !text-[13.5px] leading-relaxed"
            rows={18}
            placeholder={'Write your chapter here.\n\nSupports:\n# Heading\n## Subheading\n**bold**, `inline code`\n- bullet lists\n1. numbered lists\n``` code blocks ```'}
            value={chapter?.content ?? ''}
            onChange={(e) => {
              const copy = [...chapters];
              copy[activeChapter] = { ...copy[activeChapter], content: e.target.value };
              setChapters(copy);
            }}
          />
          <p className="mt-2 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
            Markdown-style formatting: # headings, **bold**, `code`, lists and ``` code fences.
          </p>
        </div>
      </div>
    </div>
  );
}
