'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Award, Loader2, RefreshCw, Save, Search } from 'lucide-react';
import type { ContentAccessConfig, PricingMode } from '@/lib/contentAccess';

type Bundle = { tutorials: ContentAccessConfig[]; courses: ContentAccessConfig[] };

export default function AdminContentPricing() {
  const [data, setData] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<'tutorial' | 'course'>('tutorial');
  const [error, setError] = useState('');
  const [drafts, setDrafts] = useState<Record<string, ContentAccessConfig>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/content');
      if (!res.ok) throw new Error('Failed to load');
      const json = (await res.json()) as Bundle;
      setData(json);
      const map: Record<string, ContentAccessConfig> = {};
      for (const c of [...json.tutorials, ...json.courses]) {
        map[`${c.kind}:${c.slug}`] = c;
      }
      setDrafts(map);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = useMemo(() => {
    const list = tab === 'tutorial' ? data?.tutorials ?? [] : data?.courses ?? [];
    const query = q.trim().toLowerCase();
    if (!query) return list;
    return list.filter(
      (c) => c.title.toLowerCase().includes(query) || c.slug.toLowerCase().includes(query),
    );
  }, [data, tab, q]);

  function patch(key: string, update: Partial<ContentAccessConfig>) {
    setDrafts((d) => ({ ...d, [key]: { ...d[key], ...update } }));
  }

  async function save(key: string) {
    const draft = drafts[key];
    if (!draft) return;
    setSaving(key);
    setError('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setDrafts((d) => ({ ...d, [key]: json }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[26px]">Content pricing</h2>
          <p className="mt-1 max-w-xl text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Mark any tutorial or catalogue course free or payable. Payable tracks lock until the learner
            logs in and subscribes (one-time, per level, with optional certificate guarantee).
          </p>
        </div>
        <button type="button" onClick={() => void load()} className="btn btn-ghost !py-2 !px-3 text-[13px]">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-full border p-1" style={{ borderColor: 'var(--line)' }}>
          {(['tutorial', 'course'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="rounded-full px-4 py-1.5 text-[13px] font-semibold"
              style={
                tab === t
                  ? { background: 'var(--green)', color: '#fff' }
                  : { color: 'var(--ink-soft)' }
              }
            >
              {t === 'tutorial' ? `Tutorials (${data?.tutorials.length ?? 0})` : `Courses (${data?.courses.length ?? 0})`}
            </button>
          ))}
        </div>
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
          <input
            className="form-input !pl-9"
            placeholder="Search by title or slug…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p className="mb-3 text-[13px]" style={{ color: '#b42318' }}>
          {error}
        </p>
      )}

      {loading || !data ? (
        <div className="flex items-center gap-2 py-16 justify-center" style={{ color: 'var(--ink-soft)' }}>
          <Loader2 className="animate-spin" size={18} /> Loading content…
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const key = `${row.kind}:${row.slug}`;
            const draft = drafts[key] ?? row;
            const mode = draft.mode as PricingMode;
            return (
              <div
                key={key}
                className="rounded-2xl border p-4 sm:p-5"
                style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{draft.title}</div>
                    <div className="mono text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                      {draft.kind}/{draft.slug}
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-2 text-[13px]">
                    <input
                      type="checkbox"
                      checked={draft.certificateGuarantee}
                      onChange={(e) => patch(key, { certificateGuarantee: e.target.checked })}
                    />
                    <Award size={14} style={{ color: 'var(--green-deep)' }} />
                    Certificate guarantee
                  </label>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="block text-[12px] font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                    Access mode
                    <select
                      className="form-input mt-1"
                      value={mode}
                      onChange={(e) => patch(key, { mode: e.target.value as PricingMode })}
                    >
                      <option value="free">Free</option>
                      <option value="one_time">Payable · one-time (full)</option>
                      <option value="per_level">Payable · per level</option>
                    </select>
                  </label>

                  <label className="block text-[12px] font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                    One-time price (XAF)
                    <input
                      type="number"
                      min={0}
                      className="form-input mt-1"
                      disabled={mode === 'free'}
                      value={draft.oneTimePriceXAF}
                      onChange={(e) => patch(key, { oneTimePriceXAF: Number(e.target.value) || 0 })}
                    />
                  </label>

                  <label className="block text-[12px] font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                    Beginner (XAF)
                    <input
                      type="number"
                      min={0}
                      className="form-input mt-1"
                      disabled={mode !== 'per_level'}
                      value={draft.levelPrices.beginner}
                      onChange={(e) =>
                        patch(key, {
                          levelPrices: { ...draft.levelPrices, beginner: Number(e.target.value) || 0 },
                        })
                      }
                    />
                  </label>

                  <label className="block text-[12px] font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                    Intermediate (XAF)
                    <input
                      type="number"
                      min={0}
                      className="form-input mt-1"
                      disabled={mode !== 'per_level'}
                      value={draft.levelPrices.intermediate}
                      onChange={(e) =>
                        patch(key, {
                          levelPrices: {
                            ...draft.levelPrices,
                            intermediate: Number(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </label>

                  <label className="block text-[12px] font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>
                    Pro / Advanced (XAF)
                    <input
                      type="number"
                      min={0}
                      className="form-input mt-1"
                      disabled={mode !== 'per_level'}
                      value={draft.levelPrices.advanced}
                      onChange={(e) =>
                        patch(key, {
                          levelPrices: { ...draft.levelPrices, advanced: Number(e.target.value) || 0 },
                        })
                      }
                    />
                  </label>

                  <label className="block text-[12px] font-semibold uppercase tracking-wide sm:col-span-2 lg:col-span-3" style={{ color: 'var(--ink-soft)' }}>
                    Pricing note (optional)
                    <input
                      className="form-input mt-1"
                      placeholder="e.g. Includes certificate + mentor office hours"
                      value={draft.pricingNote ?? ''}
                      onChange={(e) => patch(key, { pricingNote: e.target.value })}
                    />
                  </label>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => void save(key)}
                    disabled={saving === key}
                    className="btn btn-primary !py-2 !px-4 text-[13px]"
                  >
                    {saving === key ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    Save
                  </button>
                </div>
              </div>
            );
          })}
          {rows.length === 0 && (
            <p className="py-10 text-center text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              No matches.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
