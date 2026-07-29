import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BookMarked, Feather, FileText, Layers } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getPurchasedBookIds, getRoles, listPublishedBooks } from '@/lib/learn/ecosystem';
import {
  getPurchasedNoteIds,
  listLibraryNotes,
  studentOwnsNote,
} from '@/lib/learn/notes';
import GetBookButton from '@/components/dashboard/GetBookButton';
import GetNoteButton from '@/components/dashboard/GetNoteButton';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/library');

  const [books, purchased, roles, libraryNotes, purchasedNotes] = await Promise.all([
    listPublishedBooks(),
    getPurchasedBookIds(session.uid),
    getRoles(session.uid),
    listLibraryNotes(),
    getPurchasedNoteIds(session.uid),
  ]);

  const myShelf = books.filter((b) => purchased.has(b.id) || b.authorId === session.uid);
  const categories = Array.from(new Set(books.map((b) => b.category)));

  const noteOwnership = await Promise.all(
    libraryNotes.map(async (n) => ({
      id: n.id,
      owned: purchasedNotes.has(n.id) || (await studentOwnsNote(n, session.uid)),
    })),
  );
  const ownedNoteIds = new Set(noteOwnership.filter((x) => x.owned).map((x) => x.id));

  return (
    <div className="mx-auto max-w-[1100px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="tab mb-2 inline-flex items-center gap-1.5">
            <BookMarked size={11} />
            Digital library
          </div>
          <h1 className="font-display text-[30px] leading-tight">Library</h1>
          <p className="mt-1 max-w-xl text-[14.5px]" style={{ color: 'var(--ink-soft)' }}>
            Books, handbooks, cheatsheets, and class notes - written by Intellex and by mentors
            across the ecosystem. Free to read or priced by the author.
          </p>
        </div>
        <Link
          href="/dashboard/mentor"
          className="flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12.5px] font-semibold"
          style={{ borderColor: 'var(--line)', color: 'var(--ink-soft)' }}
        >
          <Feather size={13} />
          {roles.includes('mentor') ? 'Write & sell your own book' : 'Become a mentor to publish'}
        </Link>
      </div>

      {myShelf.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 font-display text-[21px]">My shelf</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {myShelf.map((b) => (
              <Link
                key={b.id}
                href={`/dashboard/library/${b.id}`}
                className="w-[132px] shrink-0"
                title={b.title}
              >
                <div
                  className="flex aspect-[3/4] flex-col items-center justify-center rounded-xl p-3 text-center text-white shadow-book transition-transform hover:-translate-y-1"
                  style={{ background: `linear-gradient(160deg, ${b.coverColor}, ${b.coverColor}cc)` }}
                >
                  <span className="font-display text-[28px] font-semibold">
                    {(b.title || 'B').charAt(0).toUpperCase()}
                  </span>
                  <span className="mt-2 line-clamp-3 font-display text-[12px] leading-snug">{b.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {libraryNotes.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2.5">
            <FileText size={16} style={{ color: 'var(--green-deep)' }} />
            <h2 className="font-display text-[21px]">Class notes</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {libraryNotes.map((n) => {
              const owned = ownedNoteIds.has(n.id);
              return (
                <div
                  key={n.id}
                  className="flex gap-4 rounded-2xl border p-4 transition-shadow hover:shadow-card"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <Link href={`/dashboard/notes/${n.id}`} className="shrink-0">
                    <div
                      className="flex h-[92px] w-[72px] flex-col items-center justify-center rounded-lg text-white"
                      style={{ background: 'linear-gradient(160deg, #0f766e, #14b8a6)' }}
                    >
                      <FileText size={22} />
                    </div>
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/dashboard/notes/${n.id}`}>
                      <div className="line-clamp-2 text-[14.5px] font-semibold leading-snug">{n.title}</div>
                    </Link>
                    <div className="mt-0.5 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                      by {n.authorName}
                    </div>
                    <p
                      className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed"
                      style={{ color: 'var(--ink-soft)' }}
                    >
                      {n.body || 'Class notes from your instructor.'}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span
                        className="text-[13px] font-bold"
                        style={{ color: n.priceXAF > 0 ? 'var(--ink)' : 'var(--green-deep)' }}
                      >
                        {n.priceXAF > 0 ? `${n.priceXAF.toLocaleString()} XAF` : 'Free'}
                      </span>
                      <GetNoteButton
                        noteId={n.id}
                        priceXAF={n.priceXAF}
                        owned={owned}
                        compact
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {categories.map((cat) => (
        <section key={cat} className="mb-10">
          <div className="mb-4 flex items-center gap-2.5">
            <Layers size={16} style={{ color: 'var(--green-deep)' }} />
            <h2 className="font-display text-[21px]">{cat}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {books
              .filter((b) => b.category === cat)
              .map((b) => {
                const owned = purchased.has(b.id) || b.priceXAF === 0 || b.authorId === session.uid;
                return (
                  <div
                    key={b.id}
                    className="flex gap-4 rounded-2xl border p-4 transition-shadow hover:shadow-card"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    <Link href={`/dashboard/library/${b.id}`} className="shrink-0">
                      <div
                        className="flex aspect-[3/4] w-[92px] flex-col items-center justify-center rounded-lg p-2 text-center text-white"
                        style={{ background: `linear-gradient(160deg, ${b.coverColor}, ${b.coverColor}cc)` }}
                      >
                        <span className="font-display text-[22px] font-semibold">
                          {(b.title || 'B').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link href={`/dashboard/library/${b.id}`}>
                        <div className="line-clamp-2 text-[14.5px] font-semibold leading-snug">{b.title}</div>
                      </Link>
                      <div className="mt-0.5 text-[12px]" style={{ color: 'var(--ink-soft)' }}>
                        by {b.authorName} · {b.chapters.length} chapters
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                        {b.subtitle || b.description}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <span className="text-[13px] font-bold" style={{ color: b.priceXAF > 0 ? 'var(--ink)' : 'var(--green-deep)' }}>
                          {b.priceXAF > 0 ? `${b.priceXAF.toLocaleString()} XAF` : 'Free'}
                        </span>
                        <GetBookButton bookId={b.id} priceXAF={b.priceXAF} owned={owned} compact />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
