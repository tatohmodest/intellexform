import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, ExternalLink, Lock } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getInstructorNote,
  studentOwnsNote,
} from '@/lib/learn/notes';
import DriveDocViewer from '@/components/dashboard/DriveDocViewer';
import CloudinaryDocViewer from '@/components/dashboard/CloudinaryDocViewer';
import GetNoteButton from '@/components/dashboard/GetNoteButton';

export const dynamic = 'force-dynamic';

export default async function StudentNotePage({ params }: { params: { id: string } }) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/notes/${params.id}`);

  const note = await getInstructorNote(params.id);
  if (!note || (!note.published && note.authorId !== session.uid)) notFound();

  const owns = await studentOwnsNote(note, session.uid);
  const isAuthor = note.authorId === session.uid;

  return (
    <div className="mx-auto max-w-[920px]">
      <Link
        href="/dashboard/library"
        className="mb-5 inline-flex items-center gap-2 text-sm"
        style={{ color: 'var(--ink-soft)' }}
      >
        <ArrowLeft size={15} /> Library / notes
      </Link>

      <div className="mb-6">
        <div className="tab mb-2">Class notes</div>
        <h1 className="font-display text-[28px] leading-tight">{note.title}</h1>
        <p className="mt-1 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
          By {note.authorName}
          {note.listInLibrary && note.priceXAF > 0 ? ` · ${note.priceXAF.toLocaleString()} XAF` : ''}
        </p>
        {note.body ? (
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            {note.body}
          </p>
        ) : null}
      </div>

      {!owns && !isAuthor ? (
        <div
          className="flex flex-col items-start gap-4 rounded-2xl border p-6"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="flex items-center gap-2 font-semibold">
            <Lock size={16} /> This note is in the Library
          </div>
          <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            Add it to your shelf to open or download the attachment.
          </p>
          <GetNoteButton noteId={note.id} priceXAF={note.priceXAF} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {note.fileUrl && (
              <>
                <a
                  href={`/api/learn/notes/${note.id}/file?disposition=inline`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <ExternalLink size={14} /> Open on the side
                </a>
                <a
                  href={`/api/learn/notes/${note.id}/file?disposition=attachment`}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <Download size={14} /> Download
                </a>
              </>
            )}
            {note.driveUrl && (
              <a
                href={note.driveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold"
                style={{ borderColor: 'var(--line)' }}
              >
                <ExternalLink size={14} /> Open in Drive
              </a>
            )}
          </div>

          {note.fileUrl ? (
            <CloudinaryDocViewer
              viewUrl={`/api/learn/notes/${note.id}/file?disposition=inline`}
              downloadUrl={`/api/learn/notes/${note.id}/file?disposition=attachment`}
              format={note.fileFormat}
              title={note.title}
              fileName={note.fileName}
            />
          ) : note.driveEmbedUrl ? (
            <DriveDocViewer embedUrl={note.driveEmbedUrl} title={note.title} />
          ) : (
            <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              No file attached yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
