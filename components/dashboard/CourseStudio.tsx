'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Plus,
  Radio,
  Save,
  Trash2,
  Users,
  Video,
  X,
} from 'lucide-react';
import type { ContentVisibility } from '@/lib/learn/identity';
import type {
  CourseAudience,
  CourseDeliveryMode,
  CourseLevel,
  CourseModule,
  TeacherCourseView,
  TeacherLesson,
} from '@/lib/learn/courseTypes';
import { isDirectVideo, toEmbedUrl } from '@/lib/learn/videoEmbed';
import ContentVersionHistory from '@/components/dashboard/ContentVersionHistory';
import { uploadMediaAsset } from '@/lib/learn/mentorUpload';
import CourseRoster from '@/components/dashboard/CourseRoster';

const VIS: Array<{ id: ContentVisibility; label: string; hint: string }> = [
  { id: 'private', label: 'Private', hint: 'Only your campus / your students' },
  { id: 'network', label: 'Partner network', hint: 'Visible across partner campuses' },
  { id: 'public', label: 'Public on InTelleX', hint: 'Discoverable on the network' },
];

const AUDIENCES: Array<{ id: CourseAudience; label: string; hint: string }> = [
  {
    id: 'allocated',
    label: 'My allocated students',
    hint: 'Free for students already assigned to you',
  },
  {
    id: 'open',
    label: 'Anyone on InTelleX',
    hint: 'Open enrolment - charge a price or leave it free',
  },
  {
    id: 'institution',
    label: 'Institution members',
    hint: 'Only students of the owning campus',
  },
];

const MODES: Array<{ id: CourseDeliveryMode; label: string; icon: typeof Video }> = [
  { id: 'self_paced', label: 'Self-paced', icon: Video },
  { id: 'live', label: 'Live online sessions', icon: Radio },
  { id: 'hybrid', label: 'Hybrid', icon: Users },
];

const LEVELS: Array<{ id: CourseLevel; label: string }> = [
  { id: 'all', label: 'All levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

const CATEGORIES = [
  'Software engineering',
  'Data & AI',
  'Design',
  'Business',
  'Cybersecurity',
  'Cloud & DevOps',
  'Mathematics',
  'Sciences',
  'Languages',
  'Exam prep',
  'Other',
];

type InstructorOption = {
  userId: string;
  userName: string;
  title?: string;
};

export default function CourseStudio({
  institutionSlug = null,
  campusName,
  accent = '#00b369',
  canAllocateInstructor = false,
  allowInstructorSales = false,
}: {
  institutionSlug?: string | null;
  campusName?: string;
  accent?: string;
  canAllocateInstructor?: boolean;
  /** Campus policy: may instructors price/sell extra courses? */
  allowInstructorSales?: boolean;
}) {
  const [courses, setCourses] = useState<TeacherCourseView[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TeacherCourseView | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [coverBusy, setCoverBusy] = useState(false);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [tab, setTab] = useState<'overview' | 'delivery' | 'lessons' | 'students'>('overview');
  const [instructors, setInstructors] = useState<InstructorOption[]>([]);

  const campusSalesLocked = Boolean(institutionSlug) && !allowInstructorSales;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = institutionSlug
        ? `?campus=${encodeURIComponent(institutionSlug)}`
        : '?scope=mine';
      const res = await fetch(`/api/learn/teacher-courses${q}`);
      const data = await res.json();
      const list = (data.courses || []) as TeacherCourseView[];
      const mine = institutionSlug ? list : list.filter((c) => !c.institutionSlug);
      setCourses(institutionSlug ? list : mine.length ? mine : list);
    } finally {
      setLoading(false);
    }
  }, [institutionSlug]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!canAllocateInstructor || !institutionSlug) return;
    fetch(`/api/learn/institutions/${encodeURIComponent(institutionSlug)}/members?role=instructor`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setInstructors(d?.members || []))
      .catch(() => setInstructors([]));
  }, [canAllocateInstructor, institutionSlug]);

  async function createCourse() {
    const title = newTitle.trim() || 'Untitled course';
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/learn/teacher-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          institutionSlug: institutionSlug || null,
          visibility: institutionSlug ? 'private' : 'public',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not create');
      setNewTitle('');
      await load();
      await openCourse(data.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create');
    } finally {
      setCreating(false);
    }
  }

  async function openCourse(id: string) {
    setError('');
    setTab('overview');
    const res = await fetch(`/api/learn/teacher-courses/${id}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Not found');
      return;
    }
    setActiveId(id);
    setDraft(data.course);
  }

  function patch(next: Partial<TeacherCourseView>) {
    setDraft((d) => (d ? { ...d, ...next } : d));
  }

  function updateLesson(i: number, next: Partial<TeacherLesson>) {
    if (!draft) return;
    const lessons = [...(draft.lessons || [])];
    lessons[i] = { ...lessons[i], ...next };
    patch({ lessons });
  }

  function addLesson() {
    if (!draft) return;
    patch({
      lessons: [
        ...(draft.lessons || []),
        {
          id: `lesson_${Date.now()}`,
          title: `Lesson ${(draft.lessons?.length || 0) + 1}`,
          videoUrl: '',
          videoProvider: 'url' as const,
          notes: '',
          durationMinutes: null,
          preview: false,
        },
      ],
    });
  }

  function removeLesson(i: number) {
    if (!draft) return;
    patch({ lessons: draft.lessons.filter((_, idx) => idx !== i) });
  }

  async function uploadCover(file: File) {
    setCoverBusy(true);
    setError('');
    try {
      const uploaded = await uploadMediaAsset('course_cover', file, file.name);
      patch({ coverUrl: uploaded.url, coverPublicId: uploaded.publicId });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Cover upload failed';
      setError(msg === 'file_too_large' ? 'Cover must be 10 MB or smaller.' : msg);
    } finally {
      setCoverBusy(false);
    }
  }

  async function save(publish?: boolean) {
    if (!draft || !activeId) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/learn/teacher-courses/${activeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draft.title,
          subtitle: draft.subtitle,
          description: draft.description,
          visibility: draft.visibility,
          lessons: draft.lessons,
          published: typeof publish === 'boolean' ? publish : draft.published,
          institutionSlug: draft.institutionSlug ?? institutionSlug ?? null,
          coverUrl: draft.coverUrl ?? null,
          coverPublicId: draft.coverPublicId ?? null,
          category: draft.category,
          level: draft.level,
          language: draft.language,
          tags: draft.tags,
          deliveryMode: draft.deliveryMode,
          durationHours: draft.durationHours ?? null,
          priceXAF: campusSalesLocked ? 0 : draft.priceXAF ?? 0,
          audience: draft.audience,
          seats: draft.seats ?? null,
          certificate: draft.certificate ?? false,
          liveSchedule: draft.liveSchedule ?? null,
          plannedLessonCount: draft.plannedLessonCount ?? null,
          plannedModuleCount: draft.plannedModuleCount ?? null,
          modules: draft.modules ?? [],
          outcomes: draft.outcomes,
          requirements: draft.requirements,
          instructorId: draft.instructorId ?? null,
          instructorName: draft.instructorName ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setDraft(data.course);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const isLive = draft?.deliveryMode === 'live' || draft?.deliveryMode === 'hybrid';

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-10">
      <aside className="border-b pb-6 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6" style={{ borderColor: 'var(--line)' }}>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
          {campusName ? `${campusName} studio` : 'InTelleX tutor studio'}
        </p>
        <h2 className="mb-4 font-display text-[22px]">Courses</h2>

        <div className="mb-4 flex gap-2">
          <input
            className="form-input !rounded-none !py-2 text-[13px]"
            placeholder="New course title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createCourse()}
          />
          <button
            type="button"
            onClick={createCourse}
            disabled={creating}
            className="shrink-0 px-3 py-2 text-white"
            style={{ background: accent }}
            aria-label="Create course"
          >
            {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          </button>
        </div>

        {loading ? (
          <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            Loading…
          </p>
        ) : courses.length === 0 ? (
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Create a course, add a cover, price it, choose live or self-paced, then publish.
          </p>
        ) : (
          <ul className="space-y-1">
            {courses.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => openCourse(c.id)}
                  className="flex w-full items-center gap-2.5 border-b py-3 text-left transition-opacity hover:opacity-70"
                  style={{
                    borderColor: 'var(--line)',
                    color: activeId === c.id ? accent : 'var(--ink)',
                  }}
                >
                  {c.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.coverUrl} alt="" className="h-10 w-14 shrink-0 object-cover" />
                  ) : (
                    <span
                      className="flex h-10 w-14 shrink-0 items-center justify-center"
                      style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }}
                    >
                      <Video size={14} />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold leading-snug">
                      {c.title}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                      {c.published ? 'Published' : 'Draft'} · {c.lessons?.length || 0} lessons
                      {c.priceXAF ? ` · ${c.priceXAF.toLocaleString()} XAF` : ' · Free'}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <div className="min-w-0">
        {!draft ? (
          <div className="border border-dashed py-16 text-center" style={{ borderColor: 'var(--line)' }}>
            <Video className="mx-auto mb-3 opacity-40" size={28} />
            <p className="font-display text-[22px]">Course studio</p>
            <p className="mx-auto mt-2 max-w-md px-4 text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Add a cover image, set a price, choose live sessions or self-paced, award a
              certificate, and publish for your students.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5" style={{ borderColor: 'var(--line)' }}>
              <div className="min-w-0 flex-1">
                <input
                  className="w-full border-0 bg-transparent font-display text-[24px] leading-tight outline-none sm:text-[28px]"
                  value={draft.title}
                  onChange={(e) => patch({ title: e.target.value })}
                />
                <input
                  className="mt-1 w-full border-0 bg-transparent text-[14px] outline-none"
                  style={{ color: 'var(--ink-soft)' }}
                  placeholder="One-line subtitle students see on the card"
                  value={draft.subtitle || ''}
                  onChange={(e) => patch({ subtitle: e.target.value })}
                />
              </div>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={() => save()}
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 border px-3.5 py-2 text-[13px] font-semibold sm:flex-none"
                  style={{ borderColor: 'var(--line)' }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => save(!draft.published)}
                  disabled={saving}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-white sm:flex-none"
                  style={{ background: accent }}
                >
                  {draft.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  {draft.published ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>

            {draft.id ? (
              <div className="mt-4">
                <ContentVersionHistory entityType="teacher_course" entityId={draft.id} accent={accent} />
              </div>
            ) : null}

            <div className="flex flex-wrap gap-4 border-b" style={{ borderColor: 'var(--line)' }}>
              {(
                [
                  ['overview', 'Overview'],
                  ['delivery', 'Delivery & pricing'],
                  ['lessons', `Lessons (${draft.lessons?.length || 0})`],
                  ['students', 'Students'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className="border-b-2 pb-3 text-[14px] font-semibold"
                  style={{ borderColor: tab === id ? accent : 'transparent' }}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === 'overview' && (
              <div className="space-y-6">
                {/* Cover */}
                <section>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
                    Course cover
                  </p>
                  <div className="flex flex-wrap items-start gap-4">
                    <div
                      className="relative flex h-[124px] w-[220px] shrink-0 items-center justify-center overflow-hidden border"
                      style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
                    >
                      {draft.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={draft.coverUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                          16:9 image
                        </span>
                      )}
                      {coverBusy && (
                        <span className="absolute inset-0 flex items-center justify-center bg-white/70">
                          <Loader2 size={18} className="animate-spin" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <label
                        className="inline-flex cursor-pointer items-center gap-2 border px-3 py-2 text-[13px] font-semibold"
                        style={{ borderColor: 'var(--line)' }}
                      >
                        <ImagePlus size={14} /> {draft.coverUrl ? 'Replace cover' : 'Upload cover'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            e.target.value = '';
                            if (f) uploadCover(f);
                          }}
                        />
                      </label>
                      {draft.coverUrl && (
                        <button
                          type="button"
                          onClick={() => patch({ coverUrl: null, coverPublicId: null })}
                          className="ml-2 text-[12.5px] font-semibold"
                          style={{ color: 'var(--ink-soft)' }}
                        >
                          Remove
                        </button>
                      )}
                      <p className="mt-2 text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                        Wide landscape image, at least 1280×720. This is what students see on the
                        course card.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <label className="mb-1.5 block text-[13px] font-semibold">Description</label>
                  <textarea
                    className="form-input !rounded-none text-[14px]"
                    rows={4}
                    placeholder="What is this course about, and who is it for?"
                    value={draft.description}
                    onChange={(e) => patch({ description: e.target.value })}
                  />
                </section>

                <section className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold">Category</label>
                    <select
                      className="form-input !rounded-none text-[13px]"
                      value={draft.category || ''}
                      onChange={(e) => patch({ category: e.target.value })}
                    >
                      <option value="">Choose…</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold">Level</label>
                    <select
                      className="form-input !rounded-none text-[13px]"
                      value={draft.level || 'all'}
                      onChange={(e) => patch({ level: e.target.value as CourseLevel })}
                    >
                      {LEVELS.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold">Language</label>
                    <input
                      className="form-input !rounded-none text-[13px]"
                      placeholder="English"
                      value={draft.language || ''}
                      onChange={(e) => patch({ language: e.target.value })}
                    />
                  </div>
                </section>

                <section>
                  <label className="mb-1.5 block text-[13px] font-semibold">
                    Google Drive Folder Link (Optional)
                  </label>
                  <input
                    className="form-input !rounded-none text-[13px]"
                    placeholder="https://drive.google.com/drive/folders/…"
                    value={draft.googleDriveFolderUrl || ''}
                    onChange={(e) => patch({ googleDriveFolderUrl: e.target.value })}
                  />
                  <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                    Paste a Google Drive folder URL containing course videos. Learners can play videos and browse lessons inside the platform player with a playlist sidebar.
                  </p>
                </section>

                <ListEditor
                  label="What students will learn"
                  placeholder="Build and deploy a REST API"
                  accent={accent}
                  values={draft.outcomes || []}
                  onChange={(outcomes) => patch({ outcomes })}
                />
                <ListEditor
                  label="Requirements"
                  placeholder="Basic JavaScript"
                  accent={accent}
                  values={draft.requirements || []}
                  onChange={(requirements) => patch({ requirements })}
                />
              </div>
            )}

            {tab === 'delivery' && (
              <div className="space-y-6">
                <section>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
                    How it is taught
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {MODES.map((m) => {
                      const on = (draft.deliveryMode || 'self_paced') === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => patch({ deliveryMode: m.id })}
                          className="inline-flex items-center gap-2 border px-3 py-2 text-[13px] font-semibold"
                          style={{
                            borderColor: on ? accent : 'var(--line)',
                            background: on ? `${accent}12` : 'transparent',
                            color: on ? accent : 'var(--ink)',
                          }}
                        >
                          <m.icon size={14} /> {m.label}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold">
                      Duration (hours)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      className="form-input !rounded-none text-[13px]"
                      placeholder="Auto from lessons"
                      value={draft.durationHours ?? ''}
                      onChange={(e) =>
                        patch({ durationHours: e.target.value ? Number(e.target.value) : null })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold">Price (XAF)</label>
                    <input
                      type="number"
                      min={0}
                      step={500}
                      disabled={campusSalesLocked}
                      className="form-input !rounded-none text-[13px] disabled:opacity-60"
                      value={campusSalesLocked ? 0 : draft.priceXAF ?? 0}
                      onChange={(e) => patch({ priceXAF: Number(e.target.value) || 0 })}
                    />
                    <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      {campusSalesLocked
                        ? 'Campus courses are free. Your institution admin can enable instructor sales for extra paid courses.'
                        : '0 = free. Paid courses checkout via PayUnit.'}
                    </p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[13px] font-semibold">Seats</label>
                    <input
                      type="number"
                      min={0}
                      className="form-input !rounded-none text-[13px]"
                      placeholder="Unlimited"
                      value={draft.seats ?? ''}
                      onChange={(e) => patch({ seats: e.target.value ? Number(e.target.value) : null })}
                    />
                  </div>
                </section>

                <label className="flex items-start gap-2.5 text-[13.5px]">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 accent-[#00b369]"
                    checked={Boolean(draft.certificate)}
                    onChange={(e) => patch({ certificate: e.target.checked })}
                  />
                  <span>
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      <Award size={14} /> Award a certificate on completion
                    </span>
                    <span className="block text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                      Shown on the course card so students know it is certified.
                    </span>
                  </span>
                </label>

                {isLive && (
                  <section className="border p-4" style={{ borderColor: 'var(--line)' }}>
                    <p className="mb-2 inline-flex items-center gap-1.5 text-[13px] font-semibold">
                      <Users size={14} /> Live mentorship structure
                    </p>
                    <p className="mb-4 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                      You do not need video lessons yet. Set planned live lessons and/or modules,
                      then optionally name the modules manually.
                    </p>
                    <div className="mb-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[12.5px] font-semibold">
                          Planned live lessons (optional)
                        </label>
                        <input
                          type="number"
                          min={0}
                          className="form-input !rounded-none text-[13px]"
                          placeholder="e.g. 12"
                          value={draft.plannedLessonCount ?? ''}
                          onChange={(e) =>
                            patch({
                              plannedLessonCount: e.target.value ? Number(e.target.value) : null,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[12.5px] font-semibold">
                          Planned modules (optional)
                        </label>
                        <input
                          type="number"
                          min={0}
                          className="form-input !rounded-none text-[13px]"
                          placeholder="e.g. 4"
                          value={draft.plannedModuleCount ?? ''}
                          onChange={(e) =>
                            patch({
                              plannedModuleCount: e.target.value ? Number(e.target.value) : null,
                            })
                          }
                        />
                        <p className="mt-1 text-[11.5px]" style={{ color: 'var(--ink-soft)' }}>
                          Use modules when lesson count per module is still unknown.
                        </p>
                      </div>
                    </div>

                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-[12.5px] font-semibold">Modules (manual)</p>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-[12.5px] font-semibold"
                        style={{ color: accent }}
                        onClick={() => {
                          const next: CourseModule = {
                            id: `mod_${Date.now()}`,
                            title: `Module ${(draft.modules?.length || 0) + 1}`,
                            description: '',
                            plannedSessions: null,
                          };
                          patch({ modules: [...(draft.modules || []), next] });
                        }}
                      >
                        <Plus size={13} /> Add module
                      </button>
                    </div>
                    <div className="mb-5 space-y-3">
                      {(draft.modules || []).map((mod, mi) => (
                        <div key={mod.id} className="border p-3" style={{ borderColor: 'var(--line)' }}>
                          <div className="mb-2 flex items-center gap-2">
                            <input
                              className="form-input !rounded-none flex-1 text-[13px] font-semibold"
                              value={mod.title}
                              onChange={(e) => {
                                const modules = [...(draft.modules || [])];
                                modules[mi] = { ...mod, title: e.target.value };
                                patch({ modules });
                              }}
                            />
                            <button
                              type="button"
                              aria-label="Remove module"
                              onClick={() =>
                                patch({
                                  modules: (draft.modules || []).filter((_, i) => i !== mi),
                                })
                              }
                            >
                              <Trash2 size={14} style={{ color: 'var(--ink-soft)' }} />
                            </button>
                          </div>
                          <textarea
                            className="form-input !rounded-none mb-2 text-[12.5px]"
                            placeholder="What this module covers"
                            rows={2}
                            value={mod.description || ''}
                            onChange={(e) => {
                              const modules = [...(draft.modules || [])];
                              modules[mi] = { ...mod, description: e.target.value };
                              patch({ modules });
                            }}
                          />
                          <label className="flex items-center gap-2 text-[12px]">
                            Planned sessions in module
                            <input
                              type="number"
                              min={0}
                              className="form-input !w-24 !rounded-none !py-1 text-[12.5px]"
                              value={mod.plannedSessions ?? ''}
                              onChange={(e) => {
                                const modules = [...(draft.modules || [])];
                                modules[mi] = {
                                  ...mod,
                                  plannedSessions: e.target.value ? Number(e.target.value) : null,
                                };
                                patch({ modules });
                              }}
                            />
                          </label>
                        </div>
                      ))}
                      {(draft.modules || []).length === 0 && (
                        <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                          No modules yet. Add themes like Foundations, Projects, Exam prep.
                        </p>
                      )}
                    </div>

                    <p className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold">
                      <Clock size={14} /> Live schedule
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[12.5px] font-semibold">Starts</label>
                        <input
                          type="date"
                          className="form-input !rounded-none text-[13px]"
                          value={draft.liveSchedule?.startDate || ''}
                          onChange={(e) =>
                            patch({
                              liveSchedule: { ...(draft.liveSchedule || {}), startDate: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[12.5px] font-semibold">Ends</label>
                        <input
                          type="date"
                          className="form-input !rounded-none text-[13px]"
                          value={draft.liveSchedule?.endDate || ''}
                          onChange={(e) =>
                            patch({
                              liveSchedule: { ...(draft.liveSchedule || {}), endDate: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[12.5px] font-semibold">
                          Sessions per week
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={14}
                          className="form-input !rounded-none text-[13px]"
                          value={draft.liveSchedule?.sessionsPerWeek ?? ''}
                          onChange={(e) =>
                            patch({
                              liveSchedule: {
                                ...(draft.liveSchedule || {}),
                                sessionsPerWeek: e.target.value ? Number(e.target.value) : null,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[12.5px] font-semibold">
                          Session time
                        </label>
                        <input
                          type="time"
                          className="form-input !rounded-none text-[13px]"
                          value={draft.liveSchedule?.sessionTime || ''}
                          onChange={(e) =>
                            patch({
                              liveSchedule: {
                                ...(draft.liveSchedule || {}),
                                sessionTime: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="mb-1.5 block text-[12.5px] font-semibold">
                        Meeting link (optional)
                      </label>
                      <input
                        className="form-input !rounded-none text-[13px]"
                        placeholder="Leave empty to use InTelleX session rooms"
                        value={draft.liveSchedule?.meetingUrl || ''}
                        onChange={(e) =>
                          patch({
                            liveSchedule: {
                              ...(draft.liveSchedule || {}),
                              meetingUrl: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </section>
                )}

                <section>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
                    Who can enrol
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {AUDIENCES.map((a) => {
                      const on = (draft.audience || 'allocated') === a.id;
                      return (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => patch({ audience: a.id })}
                          className="border px-3 py-2 text-left text-[12.5px]"
                          style={{
                            borderColor: on ? accent : 'var(--line)',
                            background: on ? `${accent}12` : 'transparent',
                          }}
                        >
                          <span className="block font-semibold">{a.label}</span>
                          <span style={{ color: 'var(--ink-soft)' }}>{a.hint}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
                    Visibility
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {VIS.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => patch({ visibility: v.id })}
                        className="border px-3 py-2 text-left text-[12.5px]"
                        style={{
                          borderColor: draft.visibility === v.id ? accent : 'var(--line)',
                          background: draft.visibility === v.id ? `${accent}12` : 'transparent',
                        }}
                      >
                        <span className="block font-semibold">{v.label}</span>
                        <span style={{ color: 'var(--ink-soft)' }}>{v.hint}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {canAllocateInstructor && (
                  <section>
                    <label className="mb-1.5 block text-[13px] font-semibold">
                      Taught by (allocate an instructor)
                    </label>
                    <select
                      className="form-input !rounded-none text-[13px]"
                      value={draft.instructorId || ''}
                      onChange={(e) => {
                        const picked = instructors.find((i) => i.userId === e.target.value);
                        patch({
                          instructorId: e.target.value || null,
                          instructorName: picked?.userName || null,
                        });
                      }}
                    >
                      <option value="">Me ({draft.authorName})</option>
                      {instructors.map((i) => (
                        <option key={i.userId} value={i.userId}>
                          {i.userName}
                          {i.title ? ` - ${i.title}` : ''}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                      The allocated instructor can edit lessons and mark work. Students see them as
                      the teacher.
                    </p>
                  </section>
                )}
              </div>
            )}

            {tab === 'lessons' && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display text-[20px]">Lessons</h3>
                  <button
                    type="button"
                    onClick={addLesson}
                    className="inline-flex items-center gap-1 text-[13px] font-semibold"
                    style={{ color: accent }}
                  >
                    <Plus size={14} /> Add lesson
                  </button>
                </div>

                <div className="space-y-6">
                  {(draft.lessons || []).length === 0 && (
                    <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
                      No lessons yet. Add your first recording or live session outline.
                    </p>
                  )}
                  {(draft.lessons || []).map((lesson, i) => {
                    const embed = lesson.videoUrl
                      ? toEmbedUrl(lesson.videoUrl, lesson.videoProvider)
                      : '';
                    const direct = lesson.videoUrl
                      ? isDirectVideo(lesson.videoUrl, lesson.videoProvider)
                      : false;
                    return (
                      <div key={lesson.id} className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <input
                            className="w-full border-0 bg-transparent text-[16px] font-semibold outline-none"
                            value={lesson.title}
                            onChange={(e) => updateLesson(i, { title: e.target.value })}
                          />
                          <button type="button" onClick={() => removeLesson(i)} aria-label="Remove lesson">
                            <Trash2 size={15} style={{ color: 'var(--ink-soft)' }} />
                          </button>
                        </div>
                        <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                          Google Drive / YouTube / Cloudinary URL (plays in-app - do not upload the video file here)
                        </label>
                        <input
                          className="form-input !rounded-none mb-3 text-[13px]"
                          placeholder="https://drive.google.com/file/d/…/view"
                          value={lesson.videoUrl}
                          onChange={(e) => updateLesson(i, { videoUrl: e.target.value })}
                        />
                        <div className="mb-3 flex flex-wrap items-center gap-4">
                          <label className="flex items-center gap-2 text-[12.5px]">
                            Minutes
                            <input
                              type="number"
                              min={0}
                              className="form-input !w-24 !rounded-none !py-1 text-[13px]"
                              value={lesson.durationMinutes ?? ''}
                              onChange={(e) =>
                                updateLesson(i, {
                                  durationMinutes: e.target.value ? Number(e.target.value) : null,
                                })
                              }
                            />
                          </label>
                          <label className="flex items-center gap-2 text-[12.5px]">
                            <input
                              type="checkbox"
                              className="h-4 w-4 accent-[#00b369]"
                              checked={Boolean(lesson.preview)}
                              onChange={(e) => updateLesson(i, { preview: e.target.checked })}
                            />
                            Free preview lesson
                          </label>
                        </div>
                        <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                          Captions VTT URL (HTML5 players)
                        </label>
                        <input
                          className="form-input !rounded-none mb-3 text-[13px]"
                          placeholder="https://…/captions.vtt"
                          value={lesson.captionsUrl || ''}
                          onChange={(e) =>
                            updateLesson(i, { captionsUrl: e.target.value.trim() || null })
                          }
                        />
                        <textarea
                          className="form-input !rounded-none mb-3 text-[13px]"
                          rows={2}
                          placeholder="Lesson notes (optional)"
                          value={lesson.notes || ''}
                          onChange={(e) => updateLesson(i, { notes: e.target.value })}
                        />
                        {embed && (
                          <div className="overflow-hidden border" style={{ borderColor: 'var(--line)', background: '#0C1116' }}>
                            {direct ? (
                              // eslint-disable-next-line jsx-a11y/media-has-caption
                              <video src={embed} controls className="aspect-video w-full" />
                            ) : (
                              <iframe
                                title={lesson.title}
                                src={embed}
                                className="aspect-video w-full"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                              />
                            )}
                            <a
                              href={lesson.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-2 text-[12px] text-white/70"
                            >
                              Open source <ExternalLink size={12} />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === 'students' && (
              <CourseRoster courseId={draft.id} accent={accent} />
            )}

            {error && (
              <p className="text-[13px]" style={{ color: '#b91c1c' }}>
                {error}
              </p>
            )}

            <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
              Students find published campus courses on the campus Courses tab. Public InTelleX
              tutor courses appear across the network when visibility is Public.{' '}
              <Link href="/dashboard/courses" className="font-semibold" style={{ color: accent }}>
                Open learner catalogue
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ListEditor({
  label,
  placeholder,
  values,
  onChange,
  accent,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChange: (next: string[]) => void;
  accent: string;
}) {
  const [input, setInput] = useState('');

  function add() {
    const v = input.trim();
    if (!v || values.includes(v) || values.length >= 10) return;
    onChange([...values, v]);
    setInput('');
  }

  return (
    <section>
      <label className="mb-1.5 block text-[13px] font-semibold">{label}</label>
      <div className="flex gap-2">
        <input
          className="form-input !rounded-none text-[13px]"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 border px-3 text-[13px] font-semibold"
          style={{ borderColor: 'var(--line)', color: accent }}
        >
          Add
        </button>
      </div>
      {values.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {values.map((v) => (
            <li
              key={v}
              className="flex items-center justify-between gap-2 border px-3 py-1.5 text-[13px]"
              style={{ borderColor: 'var(--line)' }}
            >
              <span className="min-w-0 break-words">{v}</span>
              <button
                type="button"
                onClick={() => onChange(values.filter((x) => x !== v))}
                aria-label={`Remove ${v}`}
              >
                <X size={13} style={{ color: 'var(--ink-soft)' }} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
