'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { AssessmentView, ExamQuestion, SubmissionView } from '@/lib/learn/assessments';
import DriveDocViewer from '@/components/dashboard/DriveDocViewer';

export default function AssessmentStudio({
  institutionSlug = null,
  campusName,
  accent = '#00b369',
}: {
  institutionSlug?: string | null;
  campusName?: string;
  accent?: string;
}) {
  const [items, setItems] = useState<AssessmentView[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<AssessmentView | null>(null);
  const [subs, setSubs] = useState<SubmissionView[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'build' | 'results'>('build');
  const [newKind, setNewKind] = useState<'assignment' | 'exam'>('exam');
  const [newTitle, setNewTitle] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = institutionSlug ? `?campus=${encodeURIComponent(institutionSlug)}` : '';
      const res = await fetch(`/api/learn/assessments${q}`);
      const data = await res.json();
      setItems(data.assessments || []);
    } finally {
      setLoading(false);
    }
  }, [institutionSlug]);

  useEffect(() => {
    load();
  }, [load]);

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
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Create failed');
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
    setDraft(data.assessment);
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
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setDraft(data.assessment);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function aiAssist() {
    if (!draft) return;
    setAiBusy(true);
    setError('');
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
      if (data.note) setError(data.note);
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
                <textarea
                  className="w-full border-0 bg-transparent text-[14.5px] outline-none"
                  style={{ color: 'var(--ink-soft)' }}
                  rows={3}
                  placeholder="Instructions for students"
                  value={draft.instructions}
                  onChange={(e) => setDraft({ ...draft, instructions: e.target.value })}
                />
                <textarea
                  className="form-input !rounded-none text-[13px]"
                  rows={2}
                  placeholder="Student tips (Drive share steps, exam rules…)"
                  value={draft.studentTips}
                  onChange={(e) => setDraft({ ...draft, studentTips: e.target.value })}
                />

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
                    Assignments can be instruction-only (students submit a Drive link). Add structural
                    prompts if you want a checklist of deliverables.
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
                {subs.length === 0 ? (
                  <p style={{ color: 'var(--ink-soft)' }}>No submissions yet.</p>
                ) : (
                  subs.map((s) => (
                    <div key={s.id} className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
                      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <div className="font-semibold">{s.studentName}</div>
                          <div className="font-mono text-[10px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                            {s.status}
                            {typeof s.score === 'number' ? ` · ${s.score}/${s.maxScore ?? '-'}` : ''}
                          </div>
                        </div>
                      </div>
                      {s.driveEmbedUrl && (
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
