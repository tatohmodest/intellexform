'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Pencil, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { Course } from '@/lib/types';
import { formatXAF } from '@/lib/format';

type AdminCourse = Course & { _id: string };

const EMPTY: Partial<AdminCourse> = {
  name: '', slug: '', type: 'Development', instructor: 'Intellex Mentors',
  currentPrice: 0, originalPrice: 0, courseImage: '', shortDescription: '',
  courseDetails: '', prerequisites: '', aboutInstructor: '', whatYouWillLearn: [],
  courseDuration: '', language: 'English', courseOrigin: 'Intellex', articleType: 'Video',
  courseRating: 0, courseNumberOfVotes: 0, courseLink: '', featured: false, bestSeller: false,
  certificateOfCompletion: true, accessOnMobileAndTV: true, downloadable: true,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-soft)' }}>{label}</span>
      {children}
    </label>
  );
}

function Editor({ course, onClose, onSaved }: { course: Partial<AdminCourse>; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<AdminCourse>>({ ...EMPTY, ...course, whatYouWillLearn: course.whatYouWillLearn ?? [] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k: keyof AdminCourse, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v }) as Partial<AdminCourse>);

  async function save() {
    setError('');
    if (!form.name?.trim()) { setError('Name is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, whatYouWillLearn: (form.whatYouWillLearn ?? []) };
      const editing = Boolean(form._id);
      const res = await fetch(editing ? `/api/admin/courses/${form._id}` : '/api/admin/courses', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const inputCls = 'form-input';

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4" style={{ background: 'rgba(19,32,25,0.6)' }} onClick={onClose}>
      <div className="my-8 w-full max-w-2xl rounded-[18px] border bg-paper p-6 shadow-book" style={{ borderColor: 'var(--line)' }} onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-[22px]">{form._id ? 'Edit course' : 'Add course'}</h3>
          <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: 'var(--paper-dim)' }}><X size={18} /></button>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name"><input className={inputCls} value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} /></Field>
            <Field label="Slug (URL, optional)"><input className={inputCls} value={form.slug ?? ''} onChange={(e) => set('slug', e.target.value)} placeholder="auto from name" /></Field>
          </div>

          <Field label="Image URL">
            <input className={inputCls} value={form.courseImage ?? ''} onChange={(e) => set('courseImage', e.target.value)} placeholder="https://…" />
          </Field>
          {form.courseImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.courseImage} alt="preview" className="h-32 w-full rounded-xl border object-cover" style={{ borderColor: 'var(--line)' }} onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0.25')} />
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type / category"><input className={inputCls} value={form.type ?? ''} onChange={(e) => set('type', e.target.value)} /></Field>
            <Field label="Instructor"><input className={inputCls} value={form.instructor ?? ''} onChange={(e) => set('instructor', e.target.value)} /></Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Current price (XAF)"><input type="number" className={inputCls} value={form.currentPrice ?? 0} onChange={(e) => set('currentPrice', e.target.value)} /></Field>
            <Field label="Original price"><input type="number" className={inputCls} value={form.originalPrice ?? 0} onChange={(e) => set('originalPrice', e.target.value)} /></Field>
          </div>

          <Field label="Short description"><textarea className={inputCls} rows={2} value={form.shortDescription ?? ''} onChange={(e) => set('shortDescription', e.target.value)} /></Field>
          <Field label="About this course"><textarea className={inputCls} rows={3} value={form.courseDetails ?? ''} onChange={(e) => set('courseDetails', e.target.value)} /></Field>
          <Field label="What you'll learn (one per line)">
            <textarea className={inputCls} rows={4} value={(form.whatYouWillLearn ?? []).join('\n')} onChange={(e) => set('whatYouWillLearn', e.target.value.split('\n'))} />
          </Field>
          <Field label="Prerequisites"><textarea className={inputCls} rows={2} value={form.prerequisites ?? ''} onChange={(e) => set('prerequisites', e.target.value)} /></Field>
          <Field label="About the instructor"><textarea className={inputCls} rows={2} value={form.aboutInstructor ?? ''} onChange={(e) => set('aboutInstructor', e.target.value)} /></Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Duration"><input className={inputCls} value={form.courseDuration ?? ''} onChange={(e) => set('courseDuration', e.target.value)} /></Field>
            <Field label="Language"><input className={inputCls} value={form.language ?? ''} onChange={(e) => set('language', e.target.value)} /></Field>
            <Field label="Origin"><input className={inputCls} value={form.courseOrigin ?? ''} onChange={(e) => set('courseOrigin', e.target.value)} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Rating"><input type="number" step="0.1" className={inputCls} value={form.courseRating ?? 0} onChange={(e) => set('courseRating', e.target.value)} /></Field>
            <Field label="No. of votes"><input type="number" className={inputCls} value={form.courseNumberOfVotes ?? 0} onChange={(e) => set('courseNumberOfVotes', e.target.value)} /></Field>
            <Field label="Article type"><input className={inputCls} value={form.articleType ?? ''} onChange={(e) => set('articleType', e.target.value)} /></Field>
          </div>
          <Field label="Course link (optional)"><input className={inputCls} value={form.courseLink ?? ''} onChange={(e) => set('courseLink', e.target.value)} /></Field>

          <div className="flex flex-wrap gap-4 text-sm">
            {([
              ['featured', 'Featured (Intellex program)'],
              ['bestSeller', 'Bestseller'],
              ['certificateOfCompletion', 'Certificate'],
              ['accessOnMobileAndTV', 'Mobile & TV'],
              ['downloadable', 'Downloadable'],
            ] as [keyof AdminCourse, string][]).map(([k, label]) => (
              <label key={k} className="flex items-center gap-2">
                <input type="checkbox" checked={Boolean(form[k])} onChange={(e) => set(k, e.target.checked)} />
                {label}
              </label>
            ))}
          </div>

          {error && <p className="rounded-lg px-3 py-2 text-sm" style={{ background: 'rgba(220,38,38,0.08)', color: '#b91c1c' }}>{error}</p>}

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button onClick={save} disabled={saving} className="btn btn-primary">
              {saving ? <Loader2 size={16} className="animate-spin" /> : null} Save course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Partial<AdminCourse> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/courses');
      setCourses(res.ok ? await res.json() : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return courses.filter((c) => `${c.name} ${c.type} ${c.instructor}`.toLowerCase().includes(q));
  }, [courses, search]);

  async function remove(c: AdminCourse) {
    if (!confirm(`Delete "${c.name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/courses/${c._id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ink-soft)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses…" className="form-input w-64 pl-9" />
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="btn btn-ghost" style={{ padding: '9px 16px' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={() => setEditing({ ...EMPTY })} className="btn btn-primary" style={{ padding: '9px 16px' }}>
            <Plus size={16} /> Add course
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center" style={{ color: 'var(--ink-soft)' }}>Loading…</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: 'var(--line)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--paper-dim)' }}>
                {['COURSE', 'TYPE', 'PRICE', 'FLAGS', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--ink-soft)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id} className="border-t" style={{ borderColor: 'var(--line)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.courseImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.courseImage} alt="" className="h-10 w-14 flex-shrink-0 rounded-md object-cover" style={{ background: 'var(--paper-dim)' }} />
                      ) : (
                        <div className="h-10 w-14 flex-shrink-0 rounded-md" style={{ background: 'var(--paper-dim)' }} />
                      )}
                      <span className="font-semibold" style={{ maxWidth: 320, display: 'inline-block' }}>{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{c.type}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--ink-soft)' }}>{formatXAF(c.currentPrice)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {c.featured && <span className="rounded-full px-2 py-0.5 font-mono text-[10px]" style={{ background: 'var(--green-deep)', color: 'var(--paper)' }}>Intellex</span>}
                      {c.bestSeller && <span className="rounded-full px-2 py-0.5 font-mono text-[10px]" style={{ background: 'var(--amber)', color: 'var(--ink)' }}>Best</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditing(c)} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs" style={{ background: 'var(--paper-dim)' }}><Pencil size={13} /> Edit</button>
                      <button onClick={() => remove(c)} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs" style={{ background: 'rgba(220,38,38,0.1)', color: '#b91c1c' }}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Editor course={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />
      )}
    </div>
  );
}
