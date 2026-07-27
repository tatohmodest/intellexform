'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Plus,
  Save,
  Trash2,
  Video,
} from 'lucide-react';
import type { ContentVisibility } from '@/lib/learn/identity';
import type { TeacherCourseView, TeacherLesson } from '@/lib/learn/ecosystem';
import { isDirectVideo, toEmbedUrl } from '@/lib/learn/videoEmbed';

const VIS: Array<{ id: ContentVisibility; label: string; hint: string }> = [
  { id: 'private', label: 'Private', hint: 'Only your campus / your students' },
  { id: 'network', label: 'Partner network', hint: 'Visible across partner campuses' },
  { id: 'public', label: 'Public on InTelleX', hint: 'Discoverable on the network' },
];

export default function CourseStudio({
  institutionSlug = null,
  campusName,
  accent = '#00b369',
}: {
  institutionSlug?: string | null;
  campusName?: string;
  accent?: string;
}) {
  const [courses, setCourses] = useState<TeacherCourseView[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<TeacherCourseView | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = institutionSlug
        ? `?campus=${encodeURIComponent(institutionSlug)}`
        : '?scope=mine';
      const res = await fetch(`/api/learn/teacher-courses${q}`);
      const data = await res.json();
      const list = (data.courses || []) as TeacherCourseView[];
      const mine = institutionSlug
        ? list
        : list.filter((c) => !c.institutionSlug);
      setCourses(institutionSlug ? list : mine.length ? mine : list);
    } finally {
      setLoading(false);
    }
  }, [institutionSlug]);

  useEffect(() => {
    load();
  }, [load]);

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
    const res = await fetch(`/api/learn/teacher-courses/${id}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Not found');
      return;
    }
    setActiveId(id);
    setDraft(data.course);
  }

  function updateLesson(i: number, patch: Partial<TeacherLesson>) {
    if (!draft) return;
    const lessons = [...(draft.lessons || [])];
    lessons[i] = { ...lessons[i], ...patch };
    setDraft({ ...draft, lessons });
  }

  function addLesson() {
    if (!draft) return;
    const lessons = [
      ...(draft.lessons || []),
      {
        id: `lesson_${Date.now()}`,
        title: `Lesson ${(draft.lessons?.length || 0) + 1}`,
        videoUrl: '',
        videoProvider: 'url' as const,
        notes: '',
      },
    ];
    setDraft({ ...draft, lessons });
  }

  function removeLesson(i: number) {
    if (!draft) return;
    setDraft({ ...draft, lessons: draft.lessons.filter((_, idx) => idx !== i) });
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
          description: draft.description,
          visibility: draft.visibility,
          lessons: draft.lessons,
          published: typeof publish === 'boolean' ? publish : draft.published,
          institutionSlug: draft.institutionSlug ?? institutionSlug ?? null,
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

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
      <aside className="border-r pr-0 lg:pr-6" style={{ borderColor: 'var(--line)' }}>
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
            Create a course, paste Drive or YouTube links (or Cloudinary uploads), set visibility,
            publish for your students.
          </p>
        ) : (
          <ul className="space-y-1">
            {courses.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => openCourse(c.id)}
                  className="w-full border-b py-3 text-left transition-opacity hover:opacity-70"
                  style={{
                    borderColor: 'var(--line)',
                    color: activeId === c.id ? accent : 'var(--ink)',
                  }}
                >
                  <span className="block text-[14px] font-semibold leading-snug">{c.title}</span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                    {c.published ? 'Published' : 'Draft'} · {c.visibility} · {c.lessons?.length || 0} lessons
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      <div>
        {!draft ? (
          <div className="border border-dashed py-16 text-center" style={{ borderColor: 'var(--line)' }}>
            <Video className="mx-auto mb-3 opacity-40" size={28} />
            <p className="font-display text-[22px]">Course studio</p>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Record or upload lessons to Google Drive, set the file to anyone-with-link (or keep
              private for campus), paste the link here, and publish. Same tools for campus
              instructors and InTelleX tutors.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5" style={{ borderColor: 'var(--line)' }}>
              <div className="min-w-0 flex-1">
                <input
                  className="w-full border-0 bg-transparent font-display text-[28px] leading-tight outline-none"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
                <textarea
                  className="mt-2 w-full resize-none border-0 bg-transparent text-[14.5px] outline-none"
                  style={{ color: 'var(--ink-soft)' }}
                  rows={2}
                  placeholder="What will students learn?"
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => save()}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 border px-3.5 py-2 text-[13px] font-semibold"
                  style={{ borderColor: 'var(--line)' }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => save(!draft.published)}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-white"
                  style={{ background: accent }}
                >
                  {draft.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  {draft.published ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>

            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
                Visibility
              </p>
              <div className="flex flex-wrap gap-2">
                {VIS.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setDraft({ ...draft, visibility: v.id })}
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
            </div>

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
                        Google Drive / YouTube / video URL
                      </label>
                      <input
                        className="form-input !rounded-none mb-2 text-[13px]"
                        placeholder="https://drive.google.com/file/d/…/view"
                        value={lesson.videoUrl}
                        onChange={(e) => updateLesson(i, { videoUrl: e.target.value })}
                      />
                      <p className="mb-3 text-[12px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                        Upload the recording to Google Drive → Share → Anyone with the link (or
                        restrict to campus accounts) → paste the link. YouTube works the same way.
                      </p>
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

            {error && (
              <p className="text-[13px]" style={{ color: '#b91c1c' }}>
                {error}
              </p>
            )}

            <p className="text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
              Students find published campus courses on the campus Courses tab. Public InTelleX
              tutor courses can appear across the network when visibility is Public.{' '}
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
