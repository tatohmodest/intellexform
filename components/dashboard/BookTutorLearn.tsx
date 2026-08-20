'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, FlaskConical, Lightbulb, Loader2 } from 'lucide-react';
import MarkdownLite from '@/components/dashboard/MarkdownLite';
import BookTutorAnswerField, { type TutorUiType } from '@/components/dashboard/BookTutorAnswerField';
import BookTutorReadAloud from '@/components/dashboard/BookTutorReadAloud';
import BookTutorContents, { ContentsButton, type ContentsItem } from '@/components/dashboard/BookTutorContents';
import BookTutorLive, { type LiveTurn } from '@/components/dashboard/BookTutorLive';

type Check = { id: string; prompt: string; placement: 'mid' | 'end' };

type Lesson = {
  id: string;
  chapterId?: string;
  chapterTitle: string;
  title: string;
  explanation: string;
  example: string;
  question: string;
  kind?: 'orient' | 'teach' | 'practice';
  stepType?: 'introduction' | 'explanation' | 'example' | 'guided_practice' | 'assessment' | 'transition';
  interactionRequired?: boolean;
  keypoints?: string[];
  practiceTask?: string;
  note?: string;
  watchOut?: string;
  analogy?: string;
  checks?: Check[];
  uiType?: TutorUiType;
  language?: string;
  choices?: string[];
  index: number;
  total: number;
  savedAnswer?: string;
  savedFeedback?: string;
  savedCorrect?: boolean | null;
  canGoBack?: boolean;
  reviewing?: boolean;
};

type Session = {
  path: {
    id: string;
    title: string;
    authorName: string;
    status: string;
    error: string | null;
    engine: string;
    lessonCount: number;
    chapterCount: number;
    canDelete?: boolean;
    buildNote?: string | null;
    buildChapter?: number;
    buildChapters?: number;
    buildPhase?: 'analyzing' | 'planning' | 'generating' | 'validating' | 'ready' | 'failed';
    stillBuilding?: boolean;
  };
  progress: {
    currentLessonIndex: number;
    phase: string;
    completedCount: number;
    lastFeedback: string;
    lastCorrect: boolean | null;
    attemptsOnCurrent: number;
    checkpointPassed: number;
    waitingOnBuild?: boolean;
    canAdvance?: boolean;
  } | null;
  lesson: Lesson | null;
  contents?: ContentsItem[];
  tutor?: {
    turns: LiveTurn[];
    ask: boolean;
    prompt: string;
    kind: string;
    concept: string;
    passed: boolean;
    attempts: number;
    hints: number;
  } | null;
};

function Callout({
  icon,
  label,
  text,
  tone,
}: {
  icon: ReactNode;
  label: string;
  text: string;
  tone: 'note' | 'tip' | 'warning' | 'try';
}) {
  const styles = {
    note: { bg: 'var(--paper-dim)', border: 'var(--line)', accent: 'var(--blue-ink)' },
    tip: { bg: 'rgba(0,179,105,0.08)', border: 'rgba(0,179,105,0.22)', accent: 'var(--green-deep)' },
    warning: { bg: 'rgba(196, 98, 42, 0.08)', border: 'rgba(196, 98, 42, 0.25)', accent: '#a14d18' },
    try: { bg: 'var(--amber-soft)', border: 'rgba(74,144,226,0.28)', accent: 'var(--blue-ink)' },
  }[tone];

  return (
    <aside
      className="mt-6 rounded-xl border px-4 py-4 sm:px-5"
      style={{ background: styles.bg, borderColor: styles.border }}
    >
      <div
        className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.08em]"
        style={{ color: styles.accent }}
      >
        {icon}
        {label}
      </div>
      <div className="text-[14.5px] leading-relaxed" style={{ color: 'var(--ink)' }}>
        <MarkdownLite text={text} />
      </div>
    </aside>
  );
}

function YesNo({
  prompt,
  busy,
  onPick,
  onStuck,
  compact,
}: {
  prompt: string;
  busy: boolean;
  onPick: (yes: boolean) => void;
  onStuck?: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={compact ? 'mt-4' : 'mt-8 rounded-2xl border p-5'}
      style={compact ? undefined : { borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
    >
      <p className="font-display text-[18px] leading-snug">{prompt}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => onPick(true)}
          className="btn btn-primary !px-6 !py-2.5 text-[13.5px]"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : null}
          Yes, I get it
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => onPick(false)}
          className="btn !px-6 !py-2.5 text-[13.5px]"
          style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
        >
          No, I’m stuck
        </button>
      </div>
      {onStuck ? (
        <button
          type="button"
          disabled={busy}
          onClick={onStuck}
          className="mt-3 text-[13px] font-semibold"
          style={{ color: 'var(--green-deep)' }}
        >
          I don’t get this
        </button>
      ) : (
        <p className="mt-3 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
          Click Yes if this makes sense. No opens a short clarify bubble — it does not mean a trick answer.
        </p>
      )}
    </div>
  );
}

function ClarifyBubble({
  prompt,
  tutor,
  youSaid,
  value,
  busy,
  error,
  onChange,
  onSend,
  onPick,
}: {
  prompt: string;
  tutor: string;
  youSaid: string;
  value: string;
  busy: boolean;
  error: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onPick: (yes: boolean) => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/25 p-3 sm:items-center">
      <div
        className="w-full max-w-[440px] rounded-2xl border p-5 shadow-card"
        style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}
        role="dialog"
        aria-label="Clarify this step"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
          Clarify
        </p>
        <h3 className="mt-1 font-display text-[22px] leading-tight">What don’t you get?</h3>
        {tutor ? (
          <div className="mt-3 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink)' }}>
            <MarkdownLite text={tutor} />
          </div>
        ) : (
          <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Tell the writer where you are stuck. They will explain, then ask Yes / No again.
          </p>
        )}
        {youSaid ? (
          <p className="mt-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            You said: {youSaid}
          </p>
        ) : null}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder="I don’t get…"
          className="mt-4 w-full border px-3 py-2.5 text-[14px]"
          style={{ borderColor: 'var(--line)', background: 'transparent' }}
          disabled={busy}
        />
        <button
          type="button"
          onClick={onSend}
          disabled={busy || value.trim().length < 4}
          className="btn btn-primary mt-3 !px-5 !py-2.5 text-[13.5px]"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : null}
          Explain this
        </button>
        {error ? (
          <p className="mt-2 text-[13px]" style={{ color: '#b91c1c' }}>
            {error}
          </p>
        ) : null}
        <div className="mt-5 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
          <p className="mb-1 text-[12px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--ink-soft)' }}>
            Try the check again
          </p>
          <YesNo prompt={prompt} busy={busy} onPick={onPick} compact />
        </div>
      </div>
    </div>
  );
}

export default function BookTutorLearn({ initial }: { initial: Session }) {
  const [session, setSession] = useState(initial);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [clarifyOpen, setClarifyOpen] = useState(false);
  const [clarifyDraft, setClarifyDraft] = useState('');
  const [clarifyReply, setClarifyReply] = useState('');
  const [youSaid, setYouSaid] = useState('');
  const [contentsOpen, setContentsOpen] = useState(false);
  const [preparing, setPreparing] = useState(() => Boolean(initial.lesson && !initial.tutor?.turns?.length));
  const [teachFailed, setTeachFailed] = useState(false);

  const lesson = session.lesson;
  const progress = session.progress;
  const tutor = session.tutor;
  const tutorReady = Boolean(tutor?.turns?.length);
  const storedPassed =
    progress?.phase === 'passed' ||
    progress?.lastCorrect === true ||
    lesson?.savedCorrect === true ||
    Boolean(lesson?.reviewing && lesson?.savedCorrect);
  const passed = tutorReady ? !tutor?.ask || Boolean(tutor?.passed) || storedPassed : storedPassed;
  const complete = progress?.phase === 'complete';
  const stepType =
    lesson?.stepType ||
    (lesson?.kind === 'practice' ? 'guided_practice' : lesson?.kind === 'orient' ? 'introduction' : lesson?.question ? 'assessment' : 'explanation');
  const practice = stepType === 'guided_practice';
  const needsCheck = lesson?.interactionRequired === true || (lesson?.interactionRequired !== false && Boolean(lesson?.question) && stepType !== 'introduction' && stepType !== 'explanation' && stepType !== 'example' && stepType !== 'transition');
  const teachOnly = tutorReady ? !tutor?.ask : !needsCheck;
  const liveNeedsAnswer = tutorReady ? Boolean(tutor?.ask && !tutor.passed && !passed) : needsCheck && !passed;
  const checks = lesson?.checks || [];
  const checkpointPassed = progress?.checkpointPassed || 0;
  const currentCheck = tutorReady || preparing || passed || teachOnly ? undefined : checks[checkpointPassed];
  const revealRest = !currentCheck || currentCheck.placement === 'end';
  const revealWrite = needsCheck && Boolean(lesson?.question) && (passed || !currentCheck);
  const pct = useMemo(() => {
    const total = session.path.lessonCount || 1;
    const done = progress?.completedCount || 0;
    return Math.min(100, Math.round((done / total) * 100));
  }, [session.path.lessonCount, progress]);
  const contents = session.contents || [];
  const firstReal = contents.find((c) => !c.looksLikeContents);

  useEffect(() => {
    if (session.path.status === 'ready' || session.path.status === 'failed') return undefined;
    let stop = false;
    (async () => {
      while (!stop) {
        try {
          const res = await fetch(`/api/learn/book-tutor/${session.path.id}`);
          const data = await res.json().catch(() => null);
          if (stop) break;
          if (data?.path) setSession(data);
          if (!data?.path || data.path.status === 'ready' || data.path.status === 'failed') break;
          await new Promise((r) => setTimeout(r, 800));
        } catch {
          if (stop) break;
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    })();
    return () => {
      stop = true;
    };
  }, [session.path.id, session.path.status]);

  useEffect(() => {
    setClarifyOpen(false);
    setClarifyDraft('');
    setClarifyReply('');
    setYouSaid('');
    setAnswer(lesson?.savedAnswer || '');
    setTeachFailed(false);
  }, [lesson?.id, lesson?.savedAnswer]);

  useEffect(() => {
    if (!lesson?.id || tutorReady || teachFailed || complete) {
      setPreparing(false);
      return undefined;
    }
    let stop = false;
    setPreparing(true);
    (async () => {
      try {
        const res = await fetch(`/api/learn/book-tutor/${session.path.id}/teach`, { method: 'POST' });
        const data = await res.json().catch(() => null);
        if (stop) return;
        if (!res.ok || !data?.tutor?.turns?.length) {
          setTeachFailed(true);
          return;
        }
        if (data.lesson?.id && data.lesson.id !== lesson.id) return;
        setSession(data);
      } catch {
        if (!stop) setTeachFailed(true);
      } finally {
        if (!stop) setPreparing(false);
      }
    })();
    return () => {
      stop = true;
    };
  }, [lesson?.id, tutorReady, teachFailed, complete, session.path.id]);

  function openClarify(seed?: string) {
    setClarifyOpen(true);
    setError('');
    if (seed) setClarifyReply(seed);
  }

  async function pickCheck(yes: boolean) {
    if (!currentCheck) return;
    if (!yes) {
      openClarify();
      return;
    }
    setClarifyOpen(false);
    setClarifyDraft('');
    setClarifyReply('');
    setYouSaid('');
    setBusy('check');
    setError('');
    try {
      const res = await fetch(`/api/learn/book-tutor/${session.path.id}/checkpoint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkId: currentCheck.id, yes: true }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not record that check.');
      const nextPassed =
        typeof data.checkpointPassed === 'number' ? data.checkpointPassed : checkpointPassed + 1;
      setSession((cur) => ({
        ...cur,
        progress: cur.progress
          ? { ...cur.progress, checkpointPassed: nextPassed, lastFeedback: '' }
          : cur.progress,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not record that check.');
    } finally {
      setBusy('');
    }
  }

  async function sendClarify() {
    if (!currentCheck || clarifyDraft.trim().length < 4) return;
    setBusy('clarify');
    setError('');
    try {
      const res = await fetch(`/api/learn/book-tutor/${session.path.id}/clarify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkId: currentCheck.id, confusion: clarifyDraft.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not explain that.');
      setYouSaid(clarifyDraft.trim());
      setClarifyReply(data.explanation || '');
      setClarifyDraft('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not explain that.');
    } finally {
      setBusy('');
    }
  }

  async function grade(e: React.FormEvent) {
    e.preventDefault();
    if (!answer.trim()) return;
    setBusy('grade');
    setError('');
    try {
      const res = await fetch(`/api/learn/book-tutor/${session.path.id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not grade that answer.');
      setSession((cur) => ({
        ...cur,
        progress: cur.progress
          ? {
              ...cur.progress,
              phase: data.phase,
              lastFeedback: data.feedback,
              lastCorrect: data.isCorrect,
              completedCount: data.isCorrect
                ? Math.max(
                    cur.progress.completedCount,
                    (cur.progress.completedCount || 0) + (cur.progress.lastCorrect ? 0 : 1),
                  )
                : cur.progress.completedCount,
            }
          : cur.progress,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not grade that answer.');
    } finally {
      setBusy('');
    }
  }

  async function checkLive() {
    if (!answer.trim()) return;
    setBusy('grade');
    setError('');
    try {
      const res = await fetch(`/api/learn/book-tutor/${session.path.id}/tutor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: answer }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not check that answer.');
      setSession(data);
      if (data.lesson?.savedAnswer) setAnswer(data.lesson.savedAnswer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not check that answer.');
    } finally {
      setBusy('');
    }
  }

  async function previous() {
    setBusy('back');
    setError('');
    setClarifyOpen(false);
    setClarifyDraft('');
    setClarifyReply('');
    setYouSaid('');
    try {
      const res = await fetch(`/api/learn/book-tutor/${session.path.id}/back`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not open the previous step.');
      setSession(data);
      setAnswer(data.lesson?.savedAnswer || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open the previous step.');
    } finally {
      setBusy('');
    }
  }

  async function next() {
    setBusy('next');
    setError('');
    setClarifyOpen(false);
    setClarifyDraft('');
    setClarifyReply('');
    setYouSaid('');
    try {
      const res = await fetch(`/api/learn/book-tutor/${session.path.id}/advance`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not open the next step.');
      setSession(data);
      setAnswer(data.lesson?.savedAnswer || '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open the next step.');
    } finally {
      setBusy('');
    }
  }

  async function jump(chapterId: string) {
    setBusy('goto');
    setError('');
    setClarifyOpen(false);
    setClarifyDraft('');
    setClarifyReply('');
    setYouSaid('');
    try {
      const res = await fetch(`/api/learn/book-tutor/${session.path.id}/goto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not open that chapter.');
      setSession(data);
      setAnswer(data.lesson?.savedAnswer || '');
      setContentsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open that chapter.');
    } finally {
      setBusy('');
    }
  }

  const phaseLabel =
    session.path.buildPhase === 'analyzing'
      ? 'Analyzing book…'
      : session.path.buildPhase === 'planning'
        ? 'Building curriculum…'
        : session.path.buildPhase === 'validating'
          ? 'Validating course…'
          : 'Generating learning experiences…';

  if (session.path.status === 'failed' || (!lesson && !complete && session.path.status !== 'ready')) {
    return (
      <div className="rounded-2xl border border-dashed px-4 py-10 text-center" style={{ borderColor: 'var(--line)' }}>
        <p className="font-display text-[22px]">{session.path.status === 'failed' ? 'Could not build this tutor' : 'Preparing your learning experience'}</p>
        <p className="mt-2 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          {session.path.error ||
            (session.path.status === 'failed'
              ? 'Try an unlocked EPUB, or a PDF you can select text in.'
              : 'Your book is being turned into tutor steps. Stay on this page if you can — each moment here writes another chapter. If you leave, come back and it will continue from where it stopped.')}
        </p>
        {session.path.status !== 'failed' ? (
          <>
            <p className="mt-4 text-[13.5px] font-semibold" style={{ color: 'var(--green-deep)' }}>
              {phaseLabel}
            </p>
            {session.path.buildChapters ? (
              <p className="mt-2 font-mono text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                {session.path.buildChapter || 0} of {session.path.buildChapters} chapters processed
                {session.path.lessonCount ? ` · ${session.path.lessonCount} steps stored so far` : ''}
              </p>
            ) : null}
            {session.path.buildNote ? (
              <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                {session.path.buildNote}
              </p>
            ) : null}
            <p className="mx-auto mt-4 max-w-[420px] text-[13px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Do not close this tab until you see the first lesson. After that you can learn while later chapters keep writing. Next uses stored steps — it does not start from scratch.
            </p>
            <Loader2 size={18} className="mx-auto mt-4 animate-spin" />
          </>
        ) : null}
      </div>
    );
  }

  if (complete || (!lesson && progress?.phase === 'complete')) {
    return (
      <div className="rounded-2xl border px-5 py-10 text-center" style={{ borderColor: 'var(--line)' }}>
        <CheckCircle2 size={28} className="mx-auto" style={{ color: 'var(--green-deep)' }} />
        <h2 className="mt-3 font-display text-[26px]">You reached the end</h2>
        <p className="mt-2 text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          {progress?.completedCount || 0} of {session.path.lessonCount} steps completed with {session.path.title}.
          Jumping chapters does not count as finishing the ones in between.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ContentsButton onClick={() => setContentsOpen(true)} />
          <button type="button" onClick={previous} className="btn !px-5 !py-2.5 text-[13.5px]" style={{ background: 'var(--paper)', border: '1px solid var(--line)' }}>
            <ArrowLeft size={15} /> Review steps
          </button>
          <Link href="/dashboard/library/learn" className="btn btn-primary !px-5 !py-2.5 text-[13.5px]">
            More book tutors
          </Link>
        </div>
        <BookTutorContents
          items={contents}
          open={contentsOpen}
          onClose={() => setContentsOpen(false)}
          onOpen={jump}
          busy={busy === 'goto'}
        />
      </div>
    );
  }

  if (!lesson) {
    return <p style={{ color: 'var(--ink-soft)' }}>No lesson to show yet.</p>;
  }

  return (
    <div>
      <div className="sticky top-0 z-20 mb-6 pb-3" style={{ background: 'var(--paper)' }}>
        <div className="h-1.5" style={{ background: 'var(--paper-dim)' }}>
          <div style={{ width: `${pct}%`, background: 'var(--green-deep)', height: '100%' }} />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
            Step {lesson.index + 1} of {lesson.total} · {lesson.chapterTitle}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
              style={{
                background: practice ? 'var(--amber-soft)' : 'rgba(0,179,105,0.12)',
                color: practice ? 'var(--blue-ink)' : 'var(--green-deep)',
              }}
            >
              {stepType === 'guided_practice'
                ? 'Try it'
                : stepType === 'assessment'
                  ? 'Check'
                  : stepType === 'example'
                    ? 'Example'
                    : stepType === 'introduction'
                      ? 'Welcome'
                      : stepType === 'transition'
                        ? 'Next'
                        : 'Lesson'}
            </span>
            <ContentsButton onClick={() => setContentsOpen(true)} />
          </div>
        </div>
        {session.path.stillBuilding ? (
          <p className="mt-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
            {session.path.buildNote || 'Later chapters are still being written. Stay here or come back — it continues from where it stopped.'}
          </p>
        ) : null}
      </div>
      <BookTutorContents
        items={contents}
        currentChapterId={lesson.chapterId}
        open={contentsOpen}
        onClose={() => setContentsOpen(false)}
        onOpen={jump}
        busy={busy === 'goto'}
      />
      {firstReal && firstReal.id !== lesson.chapterId && contents[0]?.looksLikeContents && contents[0]?.id === lesson.chapterId ? (
        <div
          className="mb-6 rounded-xl border px-4 py-3 text-[13.5px]"
          style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
        >
          <p style={{ color: 'var(--ink-soft)' }}>This stretch looks like a table of contents. Skip to the first real chapter.</p>
          <button
            type="button"
            onClick={() => jump(firstReal.id)}
            disabled={busy === 'goto'}
            className="btn btn-primary mt-3 !px-4 !py-2 text-[13px]"
          >
            Skip to {firstReal.title}
          </button>
        </div>
      ) : null}
      <article>
        <h2
          className="border-b pb-3 font-display text-[26px] leading-tight sm:text-[30px]"
          style={{ borderColor: 'var(--line)' }}
        >
          {lesson.title}
        </h2>
        <BookTutorReadAloud
          lessonId={`${lesson.id}:${tutorReady ? 't' : 's'}`}
          title={lesson.title}
          explanation={
            tutorReady
              ? tutor!.turns
                  .filter((t) => t.role === 'tutor')
                  .map((t) => t.text)
                  .join('\n\n')
              : lesson.explanation
          }
          example={
            tutorReady ? tutor!.turns.find((t) => t.role === 'tutor' && t.example)?.example || '' : lesson.example
          }
          practiceTask={tutorReady ? (tutor?.ask && !passed ? tutor.prompt : '') : practice ? lesson.practiceTask : ''}
        />
        {preparing ? (
          <p className="mt-4 flex items-center gap-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
            <Loader2 size={14} className="animate-spin" />
            Your tutor is preparing this step…
          </p>
        ) : null}
        {tutorReady ? (
          <BookTutorLive
            turns={tutor!.turns}
            ask={Boolean(tutor?.ask)}
            prompt={tutor?.prompt || ''}
            passed={passed}
            uiType={lesson.uiType || 'text_input'}
            language={lesson.language}
            choices={lesson.choices}
            answer={answer}
            busy={busy === 'grade'}
            error={error}
            onChange={setAnswer}
            onCheck={checkLive}
          />
        ) : (
          <>
            <div className="mt-5 tutorial-prose">
              <MarkdownLite text={lesson.explanation} />
            </div>

            {currentCheck?.placement === 'mid' ? (
              <YesNo
                prompt={currentCheck.prompt}
                busy={busy === 'check'}
                onPick={pickCheck}
                onStuck={() => openClarify()}
              />
            ) : null}

            {revealRest ? (
              <>
                {lesson.example ? (
                  /```/.test(lesson.example) ? (
                    <div className="mt-8">
                      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
                        Example
                      </p>
                      <MarkdownLite text={lesson.example} />
                    </div>
                  ) : (
                    <Callout tone="tip" label="Example" text={lesson.example} icon={<Lightbulb size={14} />} />
                  )
                ) : null}

                {practice && lesson.practiceTask ? (
                  <Callout tone="try" label="Your turn" text={lesson.practiceTask} icon={<FlaskConical size={14} />} />
                ) : null}

                {currentCheck?.placement === 'end' ? (
                  <YesNo
                    prompt={currentCheck.prompt}
                    busy={busy === 'check'}
                    onPick={pickCheck}
                    onStuck={() => openClarify()}
                  />
                ) : null}
              </>
            ) : null}
          </>
        )}
      </article>

      {tutorReady || teachOnly || preparing ? (
        <div
          className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
          style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
        >
          <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {liveNeedsAnswer || (preparing && needsCheck)
              ? 'Check your answer with the tutor before continuing.'
              : stepType === 'introduction'
                ? 'Continue when you have heard this.'
                : 'Continue when you are ready.'}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={previous}
              disabled={busy === 'back' || !lesson.canGoBack}
              className="btn !px-5 !py-2.5 text-[13.5px]"
              style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
            >
              {busy === 'back' ? <Loader2 size={15} className="animate-spin" /> : <ArrowLeft size={15} />}
              Previous
            </button>
            <button
              type="button"
              onClick={next}
              disabled={liveNeedsAnswer || (preparing && needsCheck) || busy === 'next'}
              className="btn btn-primary !px-5 !py-2.5 text-[13.5px]"
            >
              {busy === 'next' ? <Loader2 size={15} className="animate-spin" /> : null}
              {progress?.waitingOnBuild
                ? 'Write next chapter'
                : lesson.index + 1 >= lesson.total
                  ? 'Complete course'
                  : liveNeedsAnswer
                    ? 'Next'
                    : 'Continue'}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      ) : revealWrite ? (
        <form onSubmit={grade} className="mt-8 rounded-2xl border p-5" style={{ borderColor: 'var(--line)' }}>
          <h3 className="font-display text-[20px]">{practice ? 'What did you get?' : 'Now, in your words'}</h3>
          <p className="mt-2 text-[14.5px] leading-relaxed">{lesson.question}</p>
          {lesson.savedAnswer && (lesson.reviewing || passed) ? (
            <div
              className="mt-3 rounded-xl border px-4 py-3 text-[14px] leading-relaxed"
              style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--ink-soft)' }}>
                Your previous answer
              </p>
              <p className="mt-1 whitespace-pre-wrap">{lesson.savedAnswer}</p>
              {lesson.savedCorrect === true ? (
                <p className="mt-2 font-semibold" style={{ color: 'var(--green-deep)' }}>
                  Correct
                </p>
              ) : null}
            </div>
          ) : null}
          <BookTutorAnswerField
            uiType={lesson.uiType || 'text_input'}
            language={lesson.language}
            choices={lesson.choices}
            value={answer}
            disabled={passed}
            practice={practice}
            onChange={setAnswer}
          />
          {progress?.lastFeedback ? (
            <p
              className="mt-3 text-[14px]"
              style={{ color: progress.lastCorrect ? 'var(--green-deep)' : '#b91c1c' }}
            >
              {progress.lastFeedback}
            </p>
          ) : null}
          {error ? (
            <p className="mt-2 text-[13px]" style={{ color: '#b91c1c' }}>
              {error}
            </p>
          ) : null}
          <div
            className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
            style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
          >
            <button
              type="submit"
              disabled={busy === 'grade' || passed || !answer.trim()}
              className="btn !px-5 !py-2.5 text-[13.5px]"
              style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
            >
              {busy === 'grade' ? <Loader2 size={15} className="animate-spin" /> : null}
              {passed ? 'Checked' : lesson.uiType === 'code_editor' ? 'Run check' : practice ? 'Submit result' : 'Check answer'}
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={previous}
                disabled={busy === 'back' || !lesson.canGoBack}
                className="btn !px-5 !py-2.5 text-[13.5px]"
                style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
              >
                {busy === 'back' ? <Loader2 size={15} className="animate-spin" /> : <ArrowLeft size={15} />}
                Previous
              </button>
              <button
                type="button"
                onClick={next}
                disabled={!passed || busy === 'next'}
                className="btn btn-primary !px-5 !py-2.5 text-[13.5px]"
              >
                {busy === 'next' ? <Loader2 size={15} className="animate-spin" /> : null}
                {progress?.waitingOnBuild
                  ? 'Write next chapter'
                  : lesson.index + 1 >= lesson.total
                    ? 'Complete course'
                    : 'Next'}
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
          {!passed ? (
            <p className="mt-3 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
              {practice
                ? 'Next stays locked until you paste a real result from the try-it. You can retry.'
                : lesson.uiType === 'code_editor'
                  ? 'Write or paste code in the editor. Next stays locked until this check is correct.'
                  : lesson.uiType === 'multiple_choice'
                    ? 'Pick one, then check. Next stays locked until it is correct.'
                    : 'Next stays locked until this written check is correct. You can retry.'}
            </p>
          ) : null}
        </form>
      ) : error && !clarifyOpen ? (
        <p className="mt-4 text-[13px]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      ) : null}

      {!tutorReady && !teachOnly && !preparing && !revealWrite ? (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={previous}
            disabled={busy === 'back' || !lesson.canGoBack}
            className="btn !px-5 !py-2.5 text-[13.5px]"
            style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--ink)' }}
          >
            {busy === 'back' ? <Loader2 size={15} className="animate-spin" /> : <ArrowLeft size={15} />}
            Previous
          </button>
        </div>
      ) : null}

      {clarifyOpen && currentCheck ? (
        <ClarifyBubble
          prompt={currentCheck.prompt}
          tutor={clarifyReply}
          youSaid={youSaid}
          value={clarifyDraft}
          busy={busy === 'check' || busy === 'clarify'}
          error={error}
          onChange={setClarifyDraft}
          onSend={sendClarify}
          onPick={pickCheck}
        />
      ) : null}
    </div>
  );
}
