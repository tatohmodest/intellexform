'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Download,
  ExternalLink,
  FileText,
  Library,
  Loader2,
  Plus,
  Save,
  Send,
  Trash2,
  Upload,
} from 'lucide-react';
import type { InstructorNoteView } from '@/lib/learn/notes';
import type { TeacherCourseView } from '@/lib/learn/courseTypes';
import { uploadMentorAsset } from '@/lib/learn/mentorUpload';
import DriveDocViewer from '@/components/dashboard/DriveDocViewer';
import CloudinaryDocViewer from '@/components/dashboard/CloudinaryDocViewer';

export default function NotesStudio({
  accent = '#00b369',
  institutionSlug = null,
  initialCourseId = null,
}: {
  accent?: string;
  institutionSlug?: string | null;
  initialCourseId?: string | null;
}) {
  const [notes, setNotes] = useState<InstructorNoteView[]>([]);
  const [courses, setCourses] = useState<TeacherCourseView[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState<InstructorNoteView | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [driveInput, setDriveInput] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [nRes, cRes] = await Promise.all([
        fetch('/api/learn/notes'),
        fetch('/api/learn/teacher-courses'),
      ]);
      const nData = await nRes.json().catch(() => ({}));
      const cData = await cRes.json().catch(() => ({}));
      const list = (nData.notes || []) as InstructorNoteView[];
      setNotes(list);
      setCourses((cData.courses || []) as TeacherCourseView[]);
      if (!activeId && list[0]) {
        setActiveId(list[0].id);
        setDraft(list[0]);
        setDriveInput(list[0].driveUrl || '');
      } else if (activeId) {
        const found = list.find((n) => n.id === activeId);
        if (found) {
          setDraft(found);
          setDriveInput(found.driveUrl || '');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [activeId]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createNote() {
    setMsg(null);
    const res = await fetch('/api/learn/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Class notes',
        institutionSlug,
        courseId: initialCourseId,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || 'Could not create note');
      return;
    }
    await load();
    setActiveId(data.id);
    const nRes = await fetch(`/api/learn/notes/${data.id}`);
    const nData = await nRes.json().catch(() => ({}));
    if (nData.note) {
      setDraft(nData.note);
      setDriveInput(nData.note.driveUrl || '');
    }
  }

  async function save(publish = false) {
    if (!draft) return;
    setSaving(true);
    setMsg(null);
    try {
      const body: Record<string, unknown> = {
        title: draft.title,
        body: draft.body,
        courseId: draft.courseId,
        listInLibrary: draft.listInLibrary,
        priceXAF: draft.priceXAF,
        driveUrl: driveInput.trim() || null,
      };
      if (publish) body.published = true;
      const res = await fetch(`/api/learn/notes/${draft.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data.error === 'invalid_drive_url' ? 'Use a public Google Drive share link.' : data.error || 'Save failed');
        return;
      }
      setDraft(data.note);
      setDriveInput(data.note?.driveUrl || '');
      setMsg(publish ? 'Published and students notified.' : 'Saved.');
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function onUpload(file: File) {
    if (!draft) return;
    setUploading(true);
    setMsg(null);
    try {
      const uploaded = await uploadMentorAsset('note', file, file.name);
      const res = await fetch(`/api/learn/notes/${draft.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileUrl: uploaded.url,
          filePublicId: uploaded.publicId,
          fileResourceType: uploaded.resourceType,
          fileFormat: uploaded.format,
          fileName: uploaded.originalFilename,
          fileBytes: uploaded.bytes,
          driveUrl: null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data.error || 'Upload save failed');
        return;
      }
      setDraft(data.note);
      setDriveInput('');
      setMsg('File uploaded to Cloudinary.');
      await load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function removeNote() {
    if (!draft) return;
    if (!window.confirm('Delete this note?')) return;
    await fetch(`/api/learn/notes/${draft.id}`, { method: 'DELETE' });
    setActiveId(null);
    setDraft(null);
    await load();
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
        <Loader2 size={16} className="animate-spin" /> Loading notes studio...
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="rounded-2xl border p-3" style={{ borderColor: 'var(--line)' }}>
        <button
          type="button"
          onClick={() => void createNote()}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white"
          style={{ background: accent }}
        >
          <Plus size={15} /> New note
        </button>
        <div className="space-y-1">
          {notes.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                setActiveId(n.id);
                setDraft(n);
                setDriveInput(n.driveUrl || '');
                setMsg(null);
              }}
              className="w-full rounded-xl px-3 py-2.5 text-left text-[13px]"
              style={{
                background: activeId === n.id ? `${accent}14` : 'transparent',
                color: activeId === n.id ? accent : 'var(--ink)',
              }}
            >
              <span className="block font-semibold line-clamp-1">{n.title}</span>
              <span className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>
                {n.published ? 'Published' : 'Draft'}
                {n.listInLibrary ? ' · Library' : ''}
              </span>
            </button>
          ))}
          {notes.length === 0 && (
            <p className="px-2 py-4 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
              Send PDFs, DOCs, or Drive links to your students. Optionally list them in the Library with a price.
            </p>
          )}
        </div>
      </aside>

      {!draft ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed p-12 text-center"
          style={{ borderColor: 'var(--line)' }}
        >
          <FileText size={28} style={{ color: accent }} />
          <p className="mt-3 font-display text-[20px]">Instructor notes</p>
          <p className="mt-1 max-w-sm text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
            Share class notes without creating an assignment. Students can open them on the side or download.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <input
              className="form-input min-w-0 flex-1 !rounded-xl text-[16px] font-semibold"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Note title"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => void save(false)}
                className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold"
                style={{ borderColor: 'var(--line)' }}
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void save(true)}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold text-white"
                style={{ background: accent }}
              >
                <Send size={14} /> Publish to students
              </button>
              <button
                type="button"
                onClick={() => void removeNote()}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-[13px]"
                style={{ borderColor: 'var(--line)', color: '#b42318' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {msg && (
            <p className="text-[13px]" style={{ color: accent }}>
              {msg}
            </p>
          )}

          <textarea
            className="form-input min-h-[120px] !rounded-xl text-[14px]"
            placeholder="Optional written summary for students..."
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold">Link to course (optional)</label>
              <select
                className="form-input !rounded-xl text-[13px]"
                value={draft.courseId || ''}
                onChange={(e) => setDraft({ ...draft, courseId: e.target.value || null })}
              >
                <option value="">All my students</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold">Library price (XAF)</label>
              <input
                type="number"
                min={0}
                className="form-input !rounded-xl text-[13px]"
                value={draft.priceXAF ?? 0}
                onChange={(e) => setDraft({ ...draft, priceXAF: Number(e.target.value) || 0 })}
              />
              <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                0 = free. Enrolled course students still get notes free.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 text-[13.5px]">
            <input
              type="checkbox"
              checked={Boolean(draft.listInLibrary)}
              onChange={(e) => setDraft({ ...draft, listInLibrary: e.target.checked })}
            />
            <Library size={14} style={{ color: accent }} />
            Also list in student Library for discovery / purchase
          </label>

          <section className="rounded-2xl border p-4" style={{ borderColor: 'var(--line)' }}>
            <h3 className="mb-3 font-display text-[18px]">Attachment</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-[12.5px] font-semibold">Upload to Cloudinary</p>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {uploading ? 'Uploading...' : 'Choose PDF / DOC / DOCX'}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void onUpload(f);
                      e.target.value = '';
                    }}
                  />
                </label>
                {draft.fileName && (
                  <p className="mt-2 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                    Current: {draft.fileName}
                  </p>
                )}
              </div>
              <div>
                <p className="mb-2 text-[12.5px] font-semibold">Or public Google Drive link</p>
                <input
                  className="form-input !rounded-xl text-[13px]"
                  placeholder="https://drive.google.com/..."
                  value={driveInput}
                  onChange={(e) => setDriveInput(e.target.value)}
                />
                <p className="mt-1 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                  Share → Anyone with the link can view.
                </p>
              </div>
            </div>

            {(draft.fileUrl || draft.driveEmbedUrl) && (
              <div className="mt-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  {draft.fileUrl && (
                    <>
                      <a
                        href={`/api/learn/notes/${draft.id}/file?disposition=inline`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold"
                        style={{ borderColor: 'var(--line)' }}
                      >
                        <ExternalLink size={13} /> Open side preview
                      </a>
                      <a
                        href={`/api/learn/notes/${draft.id}/file?disposition=attachment`}
                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold"
                        style={{ borderColor: 'var(--line)' }}
                      >
                        <Download size={13} /> Download
                      </a>
                    </>
                  )}
                  {draft.driveUrl && (
                    <a
                      href={draft.driveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-semibold"
                      style={{ borderColor: 'var(--line)' }}
                    >
                      <ExternalLink size={13} /> Open in Drive
                    </a>
                  )}
                </div>
                {draft.fileUrl ? (
                  <CloudinaryDocViewer
                    viewUrl={`/api/learn/notes/${draft.id}/file?disposition=inline`}
                    downloadUrl={`/api/learn/notes/${draft.id}/file?disposition=attachment`}
                    format={draft.fileFormat}
                    title={draft.title}
                    fileName={draft.fileName}
                  />
                ) : draft.driveEmbedUrl ? (
                  <DriveDocViewer embedUrl={draft.driveEmbedUrl} title={draft.title} />
                ) : null}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
