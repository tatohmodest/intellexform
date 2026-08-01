'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Clock,
  Download,
  ExternalLink,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import type { AssessmentView, ExamQuestion, SubmissionView } from '@/lib/learn/assessments';
import DriveDocViewer from '@/components/dashboard/DriveDocViewer';
import CloudinaryDocViewer from '@/components/dashboard/CloudinaryDocViewer';
import { formatCountdown, toDatetimeLocalValue } from '@/lib/learn/countdown';
import { uploadMentorAsset } from '@/lib/learn/mentorUpload';
import MarkdownLite from '@/components/dashboard/MarkdownLite';

type CourseOption = { id: string; title: string };
type StudentOption = { id: string; name: string; email: string | null; courseTitle: string };

function normalizeAudience(a: AssessmentView): AssessmentView {
  return {
    ...a,
    recipientMode: a.recipientMode || (a.courseId ? 'course' : 'all'),
    recipientStudentIds: Array.isArray(a.recipientStudentIds) ? a.recipientStudentIds : [],
  };
}

export default function AssessmentStudio({
  institutionSlug = null,
  campusName,
  accent = '#00b369',
  initialCourseId = null,
  initialKind = null,
}: {
  institutionSlug?: string | null;
  campusName?: string;
  accent?: string;
  initialCourseId?: string | null;
  initialKind?: 'assignment' | 'exam' | null;
}) {
  const [items, setItems] = useState<AssessmentView[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AssessmentView | null>(null);
  const [subs, setSubs] = useState<SubmissionView[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiNotice, setAiNotice] = useState('');
  const [aiTopic, setAiTopic] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'build' | 'results'>('build');
  const [newKind, setNewKind] = useState<'assignment' | 'exam'>(initialKind || 'exam');
  const [newTitle, setNewTitle] = useState('');
  const [newCourseId, setNewCourseId] = useState<string>(initialCourseId || '');
  const [instructionsView, setInstructionsView] = useState<'write' | 'preview'>('write');
  const [uploadingBrief, setUploadingBrief] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = institutionSlug ? `?campus=${encodeURIComponent(institutionSlug)}` : '';
      const [ares, cres, sres] = await Promise.all([
        fetch(`/api/learn/assessments${q}`),
        fetch('/api/learn/teacher-courses'),
        fetch('/api/learn/instructor/students'),
      ]);
      const adata = await ares.json();
      setItems(((adata.assessments || []) as AssessmentView[]).map(normalizeAudience));
      if (cres.ok) {
        const cdata = await cres.json();
        const list = (cdata.courses || []) as Array<{ id: string; title: string }>;
        setCourses(list.map((c) => ({ id: c.id, title: c.title })));
      }
      if (sres.ok) {
        const sdata = await sres.json().catch(() => ({}));
        const groups = Array.isArray(sdata.groups) ? sdata.groups : [];
        const options = groups.flatMap(
          (g: {
            courseTitle?: string;
            students?: Array<{ studentId?: string; studentName?: string; studentEmail?: string | null }>;
          }) =>
            (g.students || []).map((s) => ({
              id: String(s.studentId || ''),
              name: String(s.studentName || 'Student'),
              email: s.studentEmail ?? null,
              courseTitle: String(g.courseTitle || 'Course'),
            })),
        );
        const dedup = Array.from(new Map(options.filter((s) => s.id).map((s) => [s.id, s])).values());
        setStudents(dedup);
      }
    } finally {
      setLoading(false);
    }
  }, [institutionSlug]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (initialCourseId) setNewCourseId(initialCourseId);
    if (initialKind) setNewKind(initialKind);
  }, [initialCourseId, initialKind]);

  async function create() {
    const title = newTitle.trim() || (newKind === 'exam' ? 'New exam' : 'New assignment');
    setError('');
    const res = await fetch('/api/learn/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind: newKind,
        title,
        institutionSlug: institutionSlug || null,
        courseId: newCourseId || null,
        recipientMode: newCourseId ? 'course' : 'all',
        recipientStudentIds: [],
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(
        data.error === 'recipient_students_required'
          ? 'Select at least one student when targeting selected students.'
          : data.error || 'Create failed',
      );
      return;
    }
    setNewTitle('');
    await load();
    await open(data.id);
  }

  async function open(id: string) {
    setError('');
    setTab('build');
    const res = await fetch(`/api/learn/assessments/${id}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Not found');
      return;
    }
    setActiveId(id);
    setDraft(normalizeAudience(data.assessment));
    const sres = await fetch(`/api/learn/assessments/${id}/submissions`);
    const sdata = await sres.json();
    setSubs(sdata.submissions || []);
  }

  function updateQuestion(i: number, patch: Partial<ExamQuestion>) {
    if (!draft) return;
    const questions = [...(draft.questions || [])];
    questions[i] = { ...questions[i], ...patch };
    setDraft({ ...draft, questions });
  }

  function addQuestion(type: 'mcq' | 'structural') {
    if (!draft) return;
    const q: ExamQuestion = {
      id: `q_${Date.now()}`,
      type,
      prompt: '',
      options: type === 'mcq' ? ['', '', '', ''] : undefined,
      correctIndex: type === 'mcq' ? 0 : null,
      points: type === 'mcq' ? 2 : 5,
      hint: '',
    };
    setDraft({ ...draft, questions: [...(draft.questions || []), q] });
  }

  function toggleRecipient(studentId: string) {
    if (!draft) return;
    const prev = Array.isArray(draft.recipientStudentIds) ? draft.recipientStudentIds : [];
    const has = prev.includes(studentId);
    const next = has ? prev.filter((id) => id !== studentId) : [...prev, studentId];
    setDraft({ ...draft, recipientStudentIds: next });
  }

  async function save(publish?: boolean) {
    if (!draft || !activeId) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/learn/assessments/${activeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          published: typeof publish === 'boolean' ? publish : draft.published,
          institutionSlug: draft.institutionSlug ?? institutionSlug ?? null,
          courseId: draft.courseId ?? null,
          recipientMode: draft.recipientMode || (draft.courseId ? 'course' : 'all'),
          recipientStudentIds: draft.recipientStudentIds || [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setDraft(normalizeAudience(data.assessment));
      await load();
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Save failed';
      setError(
        message === 'recipient_students_required'
          ? 'Select at least one student when targeting selected students.'
          : message,
      );
    } finally {
      setSaving(false);
    }
  }

  async function aiAssist() {
    if (!draft) return;
    setAiBusy(true);
    setError('');
    setAiNotice('');
    try {
      const res = await fetch('/api/learn/assessments/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic || draft.title,
          kind: draft.kind,
          count: draft.kind === 'exam' ? 6 : 3,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI failed');
      const incoming = (data.questions || []).map((q: ExamQuestion, i: number) => ({
        ...q,
        id: `ai_${Date.now()}_${i}`,
      }));
      setDraft({ ...draft, questions: [...(draft.questions || []), ...incoming] });
      if (data.note) setAiNotice(String(data.note));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'AI failed');
    } finally {
      setAiBusy(false);
    }
  }

  async function grade(studentId: string, score: number, feedback: string) {
    if (!activeId || !draft) return;
    const maxScore = (draft.questions || []).reduce((s, q) => s + (q.points || 0), 0);
    const res = await fetch(`/api/learn/assessments/${activeId}/submissions`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, score, maxScore, feedback }),
    });
    const data = await res.json();
    if (res.ok) {
      setSubs((prev) => prev.map((s) => (s.studentId === studentId ? data.submission : s)));
    }
  }

  async function uploadAssignmentBrief(file: File) {
    if (!draft || !activeId || draft.kind !== 'assignment') return;
    setUploadingBrief(true);
    setError('');
    try {
      const uploaded = await uploadMentorAsset('assignment', file, file.name);
      const res = await fetch(`/api/learn/assessments/${activeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attachmentFileUrl: uploaded.url,
          attachmentFilePublicId: uploaded.publicId,
          attachmentFileResourceType: uploaded.resourceType,
          attachmentFileFormat: uploaded.format,
          attachmentFileName: uploaded.originalFilename,
          attachmentFileBytes: uploaded.bytes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setDraft(normalizeAudience(data.assessment));
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploadingBrief(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
      <aside>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--ink-soft)' }}>
          {campusName || 'InTelleX tutors'}
        </p>
        <h2 className="mb-4 font-display text-[22px]">Assessments</h2>

        <div className="mb-3 flex gap-2">
          {(['exam', 'assignment'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setNewKind(k)}
              className="flex-1 border py-1.5 text-[12px] font-semibold capitalize"
              style={{
                borderColor: newKind === k ? accent : 'var(--line)',
                color: newKind === k ? accent : 'var(--ink-soft)',
              }}
            >
              {k}
            </button>
          ))}
        </div>
        {courses.length > 0 && (
          <label className="mb-3 block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--ink-soft)' }}>
              Assign to course
            </span>
            <select
              className="form-input !rounded-none !py-2 text-[13px]"
              value={newCourseId}
              onChange={(e) => setNewCourseId(e.target.value)}
            >
              <option value="">All my students (fallback)</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
        )}
        <div className="mb-4 flex gap-2">
          <input
            className="form-input !rounded-none !py-2 text-[13px]"
            placeholder={`New ${newKind} title`}
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && create()}
          />
          <button type="button" onClick={create} className="px-3 text-white" style={{ background: accent }}>
            <Plus size={14} />
          </button>
        </div>

        {loading ? (
          <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>Loading…</p>
        ) : (
          <ul className="divide-y" style={{ borderColor: 'var(--line)' }}>
            {items.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => open(a.id)}
                  className="w-full py-3 text-left"
                  style={{ color: activeId === a.id ? accent : 'var(--ink)' }}
                >
                  <span className="block text-[14px] font-semibold">{a.title}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                    {a.kind} · {a.published ? 'live' : 'draft'} · {a.questions?.length || 0} Q
                    {a.courseId ? ' · course' : ''}
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
            <ClipboardList className="mx-auto mb-3 opacity-40" size={28} />
            <p className="font-display text-[22px]">Make teaching feel like home</p>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Set exams (locked, one-slide, tab-exit terminates) and assignments (students submit
              Drive/Docs links you open inside InTelleX). AI helps you draft questions. Same tools
              for campus instructors and InTelleX tutors.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center gap-4 border-b pb-4" style={{ borderColor: 'var(--line)' }}>
              <button
                type="button"
                onClick={() => setTab('build')}
                className="border-b-2 pb-3 text-[14px] font-semibold"
                style={{ borderColor: tab === 'build' ? accent : 'transparent' }}
              >
                Build
              </button>
              <button
                type="button"
                onClick={() => setTab('results')}
                className="border-b-2 pb-3 text-[14px] font-semibold"
                style={{ borderColor: tab === 'results' ? accent : 'transparent' }}
              >
                Results & marks ({subs.length})
              </button>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => save()}
                  disabled={saving}
                  className="inline-flex items-center gap-1 border px-3 py-2 text-[13px] font-semibold"
                  style={{ borderColor: 'var(--line)' }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => save(!draft.published)}
                  className="px-3 py-2 text-[13px] font-semibold text-white"
                  style={{ background: accent }}
                >
                  {draft.published ? 'Unpublish' : 'Publish to students'}
                </button>
              </div>
            </div>

            {tab === 'build' && (
              <div className="space-y-6">
                <input
                  className="w-full border-0 bg-transparent font-display text-[28px] outline-none"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
                {courses.length > 0 && (
                  <label className="block max-w-md">
                    <span className="mb-1.5 block text-[13px] font-semibold">
                      Allocate to course roster
                    </span>
                    <select
                      className="form-input !rounded-none text-[13px]"
                      value={draft.courseId || ''}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          courseId: e.target.value || null,
                          recipientMode: e.target.value ? 'course' : draft.recipientMode,
                        })
                      }
                    >
                      <option value="">Not linked (broader notify)</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      When published, only students enrolled in this course are notified.
                    </p>
                  </label>
                )}
                <div className="max-w-2xl rounded-xl border p-3" style={{ borderColor: 'var(--line)' }}>
                  <label className="mb-1.5 block text-[13px] font-semibold">Who should receive this assessment?</label>
                  <select
                    className="form-input !rounded-none text-[13px]"
                    value={draft.recipientMode || (draft.courseId ? 'course' : 'all')}
                    onChange={(e) => {
                      const mode = e.target.value as 'all' | 'course' | 'students';
                      setDraft({
                        ...draft,
                        recipientMode: mode,
                        recipientStudentIds: mode === 'students' ? draft.recipientStudentIds || [] : [],
                      });
                    }}
                  >
                    <option value="all">All my students</option>
                    <option value="course" disabled={!draft.courseId}>
                      Students enrolled in selected course
                    </option>
                    <option value="students">Selected students only</option>
                  </select>
                  {(draft.recipientMode || (draft.courseId ? 'course' : 'all')) === 'students' && (
                    <div className="mt-3 max-h-52 overflow-y-auto border" style={{ borderColor: 'var(--line)' }}>
                      {students.length === 0 ? (
                        <p className="px-3 py-3 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                          No enrolled students found yet. Add students in My Students first.
                        </p>
                      ) : (
                        students.map((s) => {
                          const selected = (draft.recipientStudentIds || []).includes(s.id);
                          return (
                            <label
                              key={s.id}
                              className="flex cursor-pointer items-start gap-2 border-b px-3 py-2 text-[12.5px]"
                              style={{ borderColor: 'var(--line)' }}
                            >
                              <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => toggleRecipient(s.id)}
                                className="mt-0.5"
                              />
                              <span className="min-w-0">
                                <span className="block font-semibold">{s.name}</span>
                                <span style={{ color: 'var(--ink-soft)' }}>
                                  {s.email || 'No email'} · {s.courseTitle}
                                </span>
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
                <div className="rounded-xl border p-3" style={{ borderColor: 'var(--line)' }}>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[13px] font-semibold">Instructions (Markdown supported)</p>
                    <div className="inline-flex rounded-full border p-0.5" style={{ borderColor: 'var(--line)' }}>
                      <button
                        type="button"
                        onClick={() => setInstructionsView('write')}
                        className="rounded-full px-3 py-1 text-[12px] font-semibold"
                        style={{
                          background: instructionsView === 'write' ? `${accent}1a` : 'transparent',
                          color: instructionsView === 'write' ? accent : 'var(--ink-soft)',
                        }}
                      >
                        Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setInstructionsView('preview')}
                        className="rounded-full px-3 py-1 text-[12px] font-semibold"
                        style={{
                          background:
                            instructionsView === 'preview' ? `${accent}1a` : 'transparent',
                          color:
                            instructionsView === 'preview' ? accent : 'var(--ink-soft)',
                        }}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                  {instructionsView === 'write' ? (
                    <textarea
                      className="w-full border-0 bg-transparent text-[14.5px] outline-none"
                      style={{ color: 'var(--ink-soft)' }}
                      rows={6}
                      placeholder="# Assignment\nExplain requirements using markdown..."
                      value={draft.instructions}
                      onChange={(e) => setDraft({ ...draft, instructions: e.target.value })}
                    />
                  ) : (
                    <div className="min-h-[120px] text-[14px]">
                      <MarkdownLite text={draft.instructions || 'No instructions yet.'} />
                    </div>
                  )}
                </div>
                <textarea
                  className="form-input !rounded-none text-[13px]"
                  rows={2}
                  placeholder="Student tips (Drive share steps, exam rules…)"
                  value={draft.studentTips}
                  onChange={(e) => setDraft({ ...draft, studentTips: e.target.value })}
                />

                {draft.kind === 'assignment' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-end gap-4 text-[13px]">
                      <label className="block">
                        <span className="mb-1.5 flex items-center gap-1.5 font-semibold">
                          <Clock size={13} /> Submission deadline
                        </span>
                        <input
                          type="datetime-local"
                          className="form-input !rounded-none !py-1.5"
                          value={toDatetimeLocalValue(draft.dueAt)}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              dueAt: e.target.value ? new Date(e.target.value) : null,
                            })
                          }
                        />
                        <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                          Students see a live countdown. After this time they cannot submit files.
                        </p>
                      </label>
                      {draft.dueAt && (
                        <button
                          type="button"
                          className="text-[12px] font-semibold"
                          style={{ color: 'var(--ink-soft)' }}
                          onClick={() => setDraft({ ...draft, dueAt: null })}
                        >
                          Clear deadline
                        </button>
                      )}
                    </div>

                    <div className="rounded-xl border p-3" style={{ borderColor: 'var(--line)' }}>
                      <p className="mb-2 text-[13px] font-semibold">Assignment brief file (optional)</p>
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold" style={{ borderColor: 'var(--line)' }}>
                        {uploadingBrief ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                        {uploadingBrief ? 'Uploading...' : 'Upload PDF / DOC / DOCX'}
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          disabled={uploadingBrief}
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) void uploadAssignmentBrief(f);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      {draft.attachmentFileUrl && (
                        <div className="mt-3">
                          <div className="mb-2 flex flex-wrap gap-2">
                            <a
                              href={`/api/learn/assessments/${draft.id}/file?target=brief&disposition=inline`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold"
                              style={{ borderColor: 'var(--line)' }}
                            >
                              <ExternalLink size={12} /> Open brief
                            </a>
                            <a
                              href={`/api/learn/assessments/${draft.id}/file?target=brief&disposition=attachment`}
                              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold"
                              style={{ borderColor: 'var(--line)' }}
                            >
                              <Download size={12} /> Download
                            </a>
                          </div>
                          <CloudinaryDocViewer
                            title={`${draft.title} brief`}
                            format={draft.attachmentFileFormat}
                            fileName={draft.attachmentFileName}
                            viewUrl={`/api/learn/assessments/${draft.id}/file?target=brief&disposition=inline`}
                            downloadUrl={`/api/learn/assessments/${draft.id}/file?target=brief&disposition=attachment`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {draft.kind === 'exam' && (
                  <div className="flex flex-wrap gap-4 text-[13px]">
                    <label className="flex items-center gap-2">
                      Duration (min)
                      <input
                        type="number"
                        className="form-input !w-20 !rounded-none !py-1"
                        value={draft.durationMinutes ?? ''}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            durationMinutes: e.target.value ? Number(e.target.value) : null,
                          })
                        }
                      />
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={draft.terminateOnLeave}
                        onChange={(e) => setDraft({ ...draft, terminateOnLeave: e.target.checked })}
                      />
                      Terminate if they leave the tab
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={draft.lockNavigation}
                        onChange={(e) => setDraft({ ...draft, lockNavigation: e.target.checked })}
                      />
                      No going back
                    </label>
                  </div>
                )}

                <div className="border p-4" style={{ borderColor: 'var(--line)' }}>
                  <div className="mb-2 flex items-center gap-2 font-semibold">
                    <Sparkles size={16} style={{ color: accent }} /> Instructor AI assist
                  </div>
                  <p className="mb-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    Your AI helps you design questions - you stay in control of the final paper.
                  </p>
                  <div className="flex gap-2">
                    <input
                      className="form-input !rounded-none text-[13px]"
                      placeholder="Topic (e.g. JavaScript closures)"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={aiAssist}
                      disabled={aiBusy}
                      className="shrink-0 px-4 py-2 text-[13px] font-semibold text-white"
                      style={{ background: accent }}
                    >
                      {aiBusy ? <Loader2 size={14} className="animate-spin" /> : 'Generate'}
                    </button>
                  </div>
                  {aiNotice && (
                    <p className="mt-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                      {aiNotice}
                    </p>
                  )}
                </div>

                {draft.kind === 'exam' || (draft.questions || []).length > 0 ? (
                  <div>
                    <div className="mb-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => addQuestion('mcq')} className="text-[13px] font-semibold" style={{ color: accent }}>
                        + MCQ
                      </button>
                      <button type="button" onClick={() => addQuestion('structural')} className="text-[13px] font-semibold" style={{ color: accent }}>
                        + Structural
                      </button>
                    </div>
                    <div className="space-y-6">
                      {(draft.questions || []).map((q, i) => (
                        <div key={q.id} className="border-t pt-4" style={{ borderColor: 'var(--line)' }}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
                              {q.type} · Q{i + 1}
                            </span>
                            <button type="button" onClick={() => setDraft({ ...draft, questions: draft.questions.filter((_, j) => j !== i) })}>
                              <Trash2 size={14} style={{ color: 'var(--ink-soft)' }} />
                            </button>
                          </div>
                          <textarea
                            className="form-input !rounded-none mb-2"
                            rows={2}
                            placeholder="Question prompt"
                            value={q.prompt}
                            onChange={(e) => updateQuestion(i, { prompt: e.target.value })}
                          />
                          {q.type === 'mcq' && (
                            <div className="mb-2 space-y-2">
                              {(q.options || []).map((opt, oi) => (
                                <div key={oi} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`correct_${q.id}`}
                                    checked={q.correctIndex === oi}
                                    onChange={() => updateQuestion(i, { correctIndex: oi })}
                                  />
                                  <input
                                    className="form-input !rounded-none flex-1 !py-1.5 text-[13px]"
                                    value={opt}
                                    placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                                    onChange={(e) => {
                                      const options = [...(q.options || [])];
                                      options[oi] = e.target.value;
                                      updateQuestion(i, { options });
                                    }}
                                  />
                                </div>
                              ))}
                              <p className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                                Select the radio for the correct answer (auto-graded).
                              </p>
                            </div>
                          )}
                          <div className="flex gap-3">
                            <input
                              type="number"
                              className="form-input !w-24 !rounded-none !py-1.5 text-[13px]"
                              value={q.points}
                              onChange={(e) => updateQuestion(i, { points: Number(e.target.value) || 0 })}
                            />
                            <input
                              className="form-input !rounded-none flex-1 !py-1.5 text-[13px]"
                              placeholder="Internal hint"
                              value={q.hint || ''}
                              onChange={(e) => updateQuestion(i, { hint: e.target.value })}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
                    Assignments can be instruction-only, markdown-rich, or include a PDF brief.
                    Add structural prompts if you want a checklist of deliverables.
                  </p>
                )}

                {draft.kind === 'assignment' && (
                  <button type="button" onClick={() => addQuestion('structural')} className="text-[13px] font-semibold" style={{ color: accent }}>
                    + Add deliverable prompt
                  </button>
                )}

                {draft.published && (
                  <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    Student link:{' '}
                    <Link
                      href={
                        draft.kind === 'exam'
                          ? `/dashboard/exams/${draft.id}`
                          : `/dashboard/assignments/${draft.id}`
                      }
                      className="font-semibold"
                      style={{ color: accent }}
                    >
                      open as student →
                    </Link>
                  </p>
                )}
              </div>
            )}

            {tab === 'results' && (
              <div className="space-y-6">
                {draft.kind === 'assignment' && draft.dueAt && (
                  <DueClock dueAt={draft.dueAt} accent={accent} />
                )}
                {subs.length === 0 ? (
                  <p style={{ color: 'var(--ink-soft)' }}>No submissions yet.</p>
                ) : (
                  subs.map((s) => (
                    <div key={s.id} className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
                      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold">{s.studentName}</span>
                            {draft.kind === 'assignment' && draft.dueAt && (
                              <StudentDueChip dueAt={draft.dueAt} accent={accent} />
                            )}
                          </div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                            {s.status}
                            {typeof s.score === 'number' ? ` · ${s.score}/${s.maxScore ?? '-'}` : ''}
                            {s.submittedAt
                              ? ` · submitted ${new Date(s.submittedAt).toLocaleString()}`
                              : ''}
                          </div>
                        </div>
                      </div>
                      {s.fileUrl && (
                        <CloudinaryDocViewer
                          title={`${s.studentName} submission`}
                          format={s.fileFormat}
                          fileName={s.fileName}
                          viewUrl={`/api/learn/assessments/${draft.id}/file?studentId=${encodeURIComponent(s.studentId)}&disposition=inline`}
                          downloadUrl={`/api/learn/assessments/${draft.id}/file?studentId=${encodeURIComponent(s.studentId)}&disposition=attachment`}
                        />
                      )}
                      {!s.fileUrl && s.driveEmbedUrl && (
                        <DriveDocViewer embedUrl={s.driveEmbedUrl} title={`${s.studentName} submission`} />
                      )}
                      {s.answers && (
                        <pre className="mt-3 overflow-auto border p-3 text-[12px]" style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}>
                          {JSON.stringify(s.answers, null, 2)}
                        </pre>
                      )}
                      <GradeRow
                        accent={accent}
                        defaultScore={s.score ?? 0}
                        defaultFeedback={s.feedback || ''}
                        onSave={(score, feedback) => grade(s.studentId, score, feedback)}
                      />
                    </div>
                  ))
                )}
              </div>
            )}

            {error && (
              <p className="mt-4 text-[13px]" style={{ color: '#b91c1c' }}>
                {error}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function GradeRow({
  accent,
  defaultScore,
  defaultFeedback,
  onSave,
}: {
  accent: string;
  defaultScore: number;
  defaultFeedback: string;
  onSave: (score: number, feedback: string) => void;
}) {
  const [score, setScore] = useState(defaultScore);
  const [feedback, setFeedback] = useState(defaultFeedback);
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <input
        type="number"
        className="form-input !w-24 !rounded-none !py-1.5 text-[13px]"
        value={score}
        onChange={(e) => setScore(Number(e.target.value) || 0)}
      />
      <input
        className="form-input !rounded-none min-w-[200px] flex-1 !py-1.5 text-[13px]"
        placeholder="Feedback to student"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button
        type="button"
        onClick={() => onSave(score, feedback)}
        className="px-3 py-1.5 text-[13px] font-semibold text-white"
        style={{ background: accent }}
      >
        Save mark
      </button>
    </div>
  );
}

function useLiveCountdown(dueAt: string | Date | null | undefined) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!dueAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [dueAt]);
  return formatCountdown(dueAt, now);
}

function DueClock({ dueAt, accent }: { dueAt: string | Date; accent: string }) {
  const c = useLiveCountdown(dueAt);
  return (
    <div
      className="flex flex-wrap items-center gap-3 border px-4 py-3 text-[13px]"
      style={{
        borderColor: c.expired ? '#b91c1c55' : 'var(--line)',
        background: c.expired ? 'rgba(185,28,28,0.06)' : `${accent}0d`,
      }}
    >
      <Clock size={15} style={{ color: c.expired ? '#b91c1c' : accent }} />
      <span className="font-semibold" style={{ color: c.expired ? '#b91c1c' : accent }}>
        {c.expired ? 'Deadline passed - late submissions blocked' : `Time left: ${c.label}`}
      </span>
      <span className="font-mono text-[11px]" style={{ color: 'var(--ink-soft)' }}>
        Due {new Date(dueAt).toLocaleString()}
      </span>
    </div>
  );
}

function StudentDueChip({ dueAt, accent }: { dueAt: string | Date; accent: string }) {
  const c = useLiveCountdown(dueAt);
  return (
    <span
      className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.12em]"
      style={{ color: c.expired ? '#b91c1c' : accent }}
      title={c.expired ? 'Deadline passed' : 'Time remaining until deadline'}
    >
      <Clock size={11} />
      {c.expired ? 'Closed' : c.label}
    </span>
  );
}
