import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Download, FileText } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { listPublishedNotesForStudent, studentOwnsNote } from '@/lib/learn/notes';

export const dynamic = 'force-dynamic';

export default async function StudentNotesPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/notes');

  const learner = await getLearner(session.uid);
  const institutionSlug =
    learner?.activeContext?.kind === 'institution'
      ? learner.activeContext.institutionSlug
      : null;

  const notes = await listPublishedNotesForStudent({
    studentId: session.uid,
    institutionSlug,
  });

  const withAccess = await Promise.all(
    notes.map(async (n) => ({
      note: n,
      owns: await studentOwnsNote(n, session.uid),
    })),
  );

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="mb-8">
        <div className="tab mb-2 inline-flex items-center gap-1.5">
          <FileText size={11} /> Notes
        </div>
        <h1 className="font-display text-[28px] leading-tight sm:text-[32px]">My notes</h1>
        <p className="mt-1 max-w-xl text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          Class notes from your instructors. Open them on the side or download. Library notes may
          need a purchase unless you are enrolled in the linked course.
        </p>
      </div>

      {withAccess.length === 0 ? (
        <div
          className="rounded-2xl border border-dashed p-10 text-center"
          style={{ borderColor: 'var(--line)' }}
        >
          <FileText size={28} style={{ color: 'var(--ink-soft)' }} />
          <p className="mt-3 font-display text-[20px]">No notes yet</p>
          <p className="mt-1 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
            When an instructor publishes notes for your class, they will show up here and in your
            notifications.
          </p>
          <Link
            href="/dashboard/library"
            className="mt-4 inline-flex text-[13.5px] font-semibold"
            style={{ color: 'var(--green-deep)' }}
          >
            Browse Library notes →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {withAccess.map(({ note, owns }) => (
            <Link
              key={note.id}
              href={`/dashboard/notes/${note.id}`}
              className="flex items-start justify-between gap-4 rounded-2xl border p-4 transition-shadow hover:shadow-card"
              style={{ borderColor: 'var(--line)' }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <FileText size={16} style={{ color: 'var(--green-deep)' }} />
                  <h2 className="truncate text-[15px] font-semibold">{note.title}</h2>
                </div>
                <p className="mt-1 text-[12.5px]" style={{ color: 'var(--ink-soft)' }}>
                  by {note.authorName}
                  {note.listInLibrary ? ' · Library' : ''}
                  {!owns && note.priceXAF > 0
                    ? ` · ${note.priceXAF.toLocaleString()} XAF`
                    : owns
                      ? ' · Ready to open'
                      : ' · Free'}
                </p>
                {note.body ? (
                  <p className="mt-2 line-clamp-2 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    {note.body}
                  </p>
                ) : null}
              </div>
              <span
                className="inline-flex shrink-0 items-center gap-1 text-[12.5px] font-semibold"
                style={{ color: 'var(--green-deep)' }}
              >
                <Download size={13} />
                {owns ? 'Open' : 'View'}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
