import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BookMarked, Sparkles } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { listInProgressForUser, listPathsForUser } from '@/lib/learn/bookTutor';
import BookTutorUpload from '@/components/dashboard/BookTutorUpload';
import BookTutorMineList from '@/components/dashboard/BookTutorMineList';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Book tutor · InTelleX',
  description: 'Learn a book step by step with an AI tutor that checks your understanding.',
};

export default async function BookTutorHubPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/library/learn');

  const [{ mine, library }, inProgress] = await Promise.all([
    listPathsForUser(session.uid),
    listInProgressForUser(session.uid),
  ]);

  return (
    <div className="mx-auto max-w-[820px]">
      <header className="mb-8">
        <Link href="/dashboard/library" className="text-[13px] font-semibold" style={{ color: 'var(--green-deep)' }}>
          ← Library
        </Link>
        <div className="tab mt-4 mb-2 inline-flex items-center gap-1.5">
          <Sparkles size={11} /> Book tutor
        </div>
        <h1 className="font-display text-[32px] leading-tight">Learn a book with AI</h1>
        <p className="mt-2 max-w-[640px] text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
          The original file is never stored. Front matter and tables of contents are not lessons.
          After upload, wait until the complete course is ready — then you learn from stored steps.
          Locked ebooks and scanned image PDFs will not convert.
        </p>
      </header>

      <BookTutorUpload />

      {inProgress.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-[21px]">Continue</h2>
          <div className="grid gap-3">
            {inProgress.map((p) =>
              p ? (
                <Link
                  key={p.id}
                  href={p.href}
                  className="block border p-4 hover:shadow-card"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <p className="font-semibold">{p.title}</p>
                  <div className="mt-3 h-1.5" style={{ background: 'var(--paper-dim)' }}>
                    <div style={{ width: `${p.pct}%`, background: 'var(--green-deep)', height: '100%' }} />
                  </div>
                  <p className="mt-2 text-[13px]" style={{ color: 'var(--green-deep)' }}>
                    Continue → · {p.pct}%
                  </p>
                </Link>
              ) : null,
            )}
          </div>
        </section>
      ) : null}

      {mine.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-[21px]">Your books</h2>
          <BookTutorMineList
            rows={mine.map((p) => ({
              id: p.id,
              title: p.title,
              lessonCount: p.lessonCount,
              isPrivate: p.isPrivate,
              engine: p.engine,
              status: p.status,
            }))}
          />
        </section>
      ) : null}

      {library.length > 0 ? (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-[21px]">From the library</h2>
          <ul className="space-y-2">
            {library.map((p) => (
              <li key={p.id} className="flex items-center gap-3 border px-4 py-3" style={{ borderColor: 'var(--line)' }}>
                <BookMarked size={16} style={{ color: 'var(--ink-soft)' }} />
                <div>
                  <Link href={`/dashboard/library/learn/${p.id}`} className="font-semibold">
                    {p.title}
                  </Link>
                  <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                    by {p.authorName} · {p.lessonCount} steps
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="mt-8 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          Library titles with readable chapters can start a shared tutor path. Open a book you own
          and choose Learn with AI.
        </p>
      )}
    </div>
  );
}
