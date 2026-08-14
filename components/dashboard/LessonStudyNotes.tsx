'use client';

import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';

export default function LessonStudyNotes({
  courseKey,
  lessonKey,
  accent = '#00b369',
}: {
  courseKey: string;
  lessonKey: string;
  accent?: string;
}) {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(
      `/api/learn/lesson-notes?courseKey=${encodeURIComponent(courseKey)}&lessonKey=${encodeURIComponent(lessonKey)}`,
    )
      .then((r) => r.json())
      .then((d) => setBody(d.note?.body || ''))
      .finally(() => setLoading(false));
  }, [courseKey, lessonKey]);

  async function save() {
    setBusy(true);
    setSaved(false);
    try {
      await fetch('/api/learn/lesson-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseKey, lessonKey, body }),
      });
      setSaved(true);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
        Loading notes…
      </p>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        className="form-input !rounded-none min-h-[140px]"
        placeholder="Write study notes for this lesson…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button
        type="button"
        onClick={save}
        disabled={busy}
        className="inline-flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-white"
        style={{ background: accent }}
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {saved ? 'Saved' : 'Save notes'}
      </button>
    </div>
  );
}
