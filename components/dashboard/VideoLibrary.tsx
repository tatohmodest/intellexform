'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Clock, PlayCircle, Plus, Search, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  VIDEO_CATEGORIES,
  VIDEO_TUTORIALS,
  type VideoLevel,
  type VideoTutorial,
} from '@/lib/learn/videos';

const LEVELS: VideoLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

function VideoGrid({
  videos,
  onPlay,
  onRemove,
}: {
  videos: VideoTutorial[];
  onPlay: (v: VideoTutorial) => void;
  onRemove?: (id: string) => void;
}) {
  if (videos.length === 0) {
    return (
      <p className="border border-dashed px-4 py-8 text-center text-[14px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
        No videos match this search. Try another phrase, or paste a YouTube link to play it here.
      </p>
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {videos.map((v) => (
        <div
          key={v.id}
          className="group overflow-hidden rounded-2xl border text-left transition-shadow hover:shadow-card"
          style={{ borderColor: 'var(--line)' }}
        >
          <button type="button" onClick={() => onPlay(v)} className="block w-full text-left">
            <div className="relative aspect-video overflow-hidden" style={{ background: '#0C1116' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                alt={v.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
                <PlayCircle size={46} className="text-white" />
              </span>
              <span className="mono absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] text-white">
                {v.duration}
              </span>
            </div>
            <div className="p-4">
              <div className="line-clamp-2 text-[14px] font-semibold leading-snug">{v.title}</div>
              <div className="mt-1.5 flex items-center gap-2 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                <span>{v.channel}</span>
                <span>·</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
                  style={{ background: 'var(--paper-dim)' }}
                >
                  {v.level}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {v.description}
              </p>
            </div>
          </button>
          {onRemove && v.source === 'admin' ? (
            <div className="border-t px-4 py-2" style={{ borderColor: 'var(--line)' }}>
              <button
                type="button"
                onClick={() => onRemove(v.id)}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold"
                style={{ color: 'var(--ink-soft)' }}
              >
                <Trash2 size={12} /> Remove from hall
              </button>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default function VideoLibrary({ isAdmin = false }: { isAdmin?: boolean }) {
  const [category, setCategory] = useState<string>('All');
  const [playing, setPlaying] = useState<VideoTutorial | null>(null);
  const [catalog, setCatalog] = useState<VideoTutorial[]>(
    VIDEO_TUTORIALS.map((v) => ({ ...v, source: 'curated' as const })),
  );
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchHits, setSearchHits] = useState<VideoTutorial[] | null>(null);
  const [searchSource, setSearchSource] = useState<'youtube' | 'local' | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [form, setForm] = useState({
    youtubeUrl: '',
    title: '',
    channel: '',
    category: 'Career',
    duration: '',
    level: 'Beginner' as VideoLevel,
    description: '',
  });

  const loadCatalog = useCallback(async () => {
    try {
      const res = await fetch('/api/learn/videos');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.videos) && data.videos.length) {
        setCatalog(data.videos as VideoTutorial[]);
      }
    } catch {
      /* keep curated fallback */
    }
  }, []);

  useEffect(() => {
    void loadCatalog();
  }, [loadCatalog]);

  const videos = useMemo(
    () => (category === 'All' ? catalog : catalog.filter((v) => v.category === category)),
    [catalog, category],
  );

  async function onSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      setSearchHits(null);
      setSearchSource(null);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/learn/videos/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) return;
      const data = await res.json();
      setSearchHits((data.videos || []) as VideoTutorial[]);
      setSearchSource(data.source === 'youtube' ? 'youtube' : 'local');
    } finally {
      setSearching(false);
    }
  }

  async function addVideo(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setAdminError('');
    try {
      const res = await fetch('/api/learn/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAdminError(
          data.error === 'invalid_youtube'
            ? 'Paste a valid YouTube URL or 11-character video id.'
            : data.error === 'title_required'
              ? 'Title is required.'
              : 'Could not add this video.',
        );
        return;
      }
      setForm({
        youtubeUrl: '',
        title: '',
        channel: '',
        category: 'Career',
        duration: '',
        level: 'Beginner',
        description: '',
      });
      setAdminOpen(false);
      await loadCatalog();
    } finally {
      setSaving(false);
    }
  }

  async function removeVideo(id: string) {
    const res = await fetch(`/api/learn/videos?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (res.ok) await loadCatalog();
  }

  return (
    <>
      <form onSubmit={onSearch} className="mb-5 flex flex-col gap-2 sm:flex-row">
        <label className="relative min-w-0 flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--ink-soft)' }}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search YouTube — results play here in InTelleX"
            className="w-full border py-2.5 pl-9 pr-3 text-[14px]"
            style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
          />
        </label>
        <button
          type="submit"
          disabled={searching}
          className="px-4 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: 'var(--green)' }}
        >
          {searching ? 'Searching…' : 'Search'}
        </button>
        {searchHits ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSearchHits(null);
              setSearchSource(null);
            }}
            className="border px-4 py-2.5 text-[13px] font-semibold"
            style={{ borderColor: 'var(--line)' }}
          >
            Clear
          </button>
        ) : null}
      </form>

      {isAdmin ? (
        <div className="mb-6 border p-4" style={{ borderColor: 'var(--line)' }}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-display text-[18px]">InTelleX admin</p>
              <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                Add a YouTube video to the hall. Learners watch it here, not on YouTube.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAdminOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold text-white"
              style={{ background: 'var(--green)' }}
            >
              <Plus size={14} /> {adminOpen ? 'Close' : 'Add video'}
            </button>
          </div>
          {adminOpen ? (
            <form onSubmit={addVideo} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                required
                value={form.youtubeUrl}
                onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
                placeholder="YouTube URL or video id"
                className="border px-3 py-2 text-[13.5px] sm:col-span-2"
                style={{ borderColor: 'var(--line)' }}
              />
              <input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Title"
                className="border px-3 py-2 text-[13.5px]"
                style={{ borderColor: 'var(--line)' }}
              />
              <input
                value={form.channel}
                onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value }))}
                placeholder="Channel"
                className="border px-3 py-2 text-[13.5px]"
                style={{ borderColor: 'var(--line)' }}
              />
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="border px-3 py-2 text-[13.5px]"
                style={{ borderColor: 'var(--line)' }}
              >
                {VIDEO_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={form.level}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as VideoLevel }))}
                className="border px-3 py-2 text-[13.5px]"
                style={{ borderColor: 'var(--line)' }}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <input
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                placeholder="Duration (e.g. 2h)"
                className="border px-3 py-2 text-[13.5px]"
                style={{ borderColor: 'var(--line)' }}
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Short description"
                rows={2}
                className="border px-3 py-2 text-[13.5px] sm:col-span-2"
                style={{ borderColor: 'var(--line)' }}
              />
              {adminError ? (
                <p className="text-[13px] sm:col-span-2" style={{ color: '#b42318' }}>
                  {adminError}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 text-[13px] font-semibold text-white sm:col-span-2"
                style={{ background: 'var(--green)' }}
              >
                {saving ? 'Saving…' : 'Save to Video Hall'}
              </button>
            </form>
          ) : null}
        </div>
      ) : null}

      {searchHits ? (
        <section className="mb-8">
          <h2 className="mb-3 font-display text-[20px]">
            {searchSource === 'youtube' ? 'YouTube results in InTelleX' : 'Matching videos'}
          </h2>
          <p className="mb-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Click a result to watch it here. You stay on InTelleX.
          </p>
          <VideoGrid videos={searchHits} onPlay={setPlaying} />
        </section>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {VIDEO_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className="rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors"
                style={
                  c === category
                    ? { background: 'var(--ink)', color: '#fff' }
                    : { background: 'var(--paper-dim)', color: 'var(--ink-soft)' }
                }
              >
                {c}
              </button>
            ))}
          </div>
          <VideoGrid
            videos={videos}
            onPlay={setPlaying}
            onRemove={isAdmin ? removeVideo : undefined}
          />
        </>
      )}

      <AnimatePresence>
        {playing && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlaying(null)}
          >
            <motion.div
              className="w-full max-w-[900px]"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 flex items-center justify-between text-white">
                <div>
                  <div className="text-[15px] font-semibold">{playing.title}</div>
                  <div className="flex items-center gap-2 text-[12.5px] text-white/60">
                    {playing.channel} <Clock size={11} /> {playing.duration}
                  </div>
                </div>
                <button
                  onClick={() => setPlaying(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
                  aria-label="Close player"
                >
                  <X size={17} />
                </button>
              </div>
              <div className="aspect-video overflow-hidden rounded-2xl bg-black">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${playing.youtubeId}?autoplay=1&rel=0`}
                  title={playing.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
