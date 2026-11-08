import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Award,
  Feather,
  FileText,
  Layers,
  Sparkles,
} from 'lucide-react';
import BookTutorUpload from '@/components/dashboard/BookTutorUpload';
import StartBookTutorButton from '@/components/dashboard/StartBookTutorButton';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getPurchasedBookIds,
  getRoles,
  listPublishedBooks,
} from '@/lib/learn/ecosystem';
import { hasActiveCertSubscription } from '@/lib/learn/certSubscription';
import { getBookRequestQuota, listBookRequestsByUser } from '@/lib/learn/bookRequests';
import {
  getPurchasedNoteIds,
  listLibraryNotes,
  studentOwnsNote,
} from '@/lib/learn/notes';
import { STUDENT_MONTHLY_XAF } from '@/lib/learn/studentMembership';
import GetBookButton from '@/components/dashboard/GetBookButton';
import GetNoteButton from '@/components/dashboard/GetNoteButton';
import BookRequestButton from '@/components/dashboard/BookRequestButton';
import NewBookButton from '@/components/dashboard/NewBookButton';
import { getStaffPost } from '@/lib/staff/store';
import PageHeader from '@/components/dashboard/PageHeader';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  const session = getSessionUser();
  if (!session) redirect('/login?next=/dashboard/library');

  const isMember = await hasActiveCertSubscription(session.uid);
  const staffPost = await getStaffPost(session.uid).catch(() => null);
  const [books, purchased, roles, libraryNotes, purchasedNotes, myRequests, quota] =
    await Promise.all([
      listPublishedBooks(),
      getPurchasedBookIds(session.uid),
      getRoles(session.uid),
      listLibraryNotes(),
      getPurchasedNoteIds(session.uid),
      listBookRequestsByUser(session.uid),
      getBookRequestQuota(session.uid, isMember),
    ]);
  const canUpload =
    roles.includes('mentor') || roles.includes('admin') || Boolean(staffPost && staffPost.active);

  const myShelf = books.filter(
    (b) =>
      purchased.has(b.id) ||
      b.authorId === session.uid ||
      b.priceXAF === 0 ||
      isMember,
  );
  const categories = Array.from(new Set(books.map((b) => b.category)));

  const noteOwnership = await Promise.all(
    libraryNotes.map(async (n) => ({
      id: n.id,
      owned: purchasedNotes.has(n.id) || (await studentOwnsNote(n, session.uid)),
    })),
  );
  const ownedNoteIds = new Set(noteOwnership.filter((x) => x.owned).map((x) => x.id));

  const bookCover = (b: (typeof books)[number], size: 'shelf' | 'card') =>
    b.coverImageUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={b.coverImageUrl}
        alt={b.title}
        className={`aspect-[3/4] w-full rounded-2xl object-cover shadow-[0_14px_30px_-18px_rgba(18,50,79,0.55)] ${
          size === 'shelf' ? 'transition-transform group-hover:-translate-y-1.5' : ''
        }`}
      />
    ) : (
      <div
        className={`flex aspect-[3/4] w-full flex-col items-center justify-center rounded-2xl p-3 text-center shadow-[0_14px_30px_-18px_rgba(18,50,79,0.4)] ${
          size === 'shelf' ? 'transition-transform group-hover:-translate-y-1.5' : ''
        }`}
        style={{ background: `${b.coverColor || '#00b369'}26`, color: 'var(--navy)' }}
      >
        <span className="text-[26px] font-extrabold">{(b.title || 'B').charAt(0).toUpperCase()}</span>
        {size === 'shelf' ? <span className="mt-2 line-clamp-3 text-[12px] font-semibold leading-snug">{b.title}</span> : null}
      </div>
    );

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        art="/eco_books.webp"
        tone="butter"
        title="Library"
        description="Books and class notes from your instructors, plus an AI tutor that turns any book into guided lessons."
        actions={
          <>
            <Link href="/dashboard/library/learn" className="btn bg-white !px-4 !py-2.5 text-[14px] text-[var(--navy)] hover:bg-white/80">
              <Sparkles size={15} /> Book tutor
            </Link>
            {canUpload ? <NewBookButton /> : null}
            <Link href="/dashboard/mentor" className="btn bg-white/60 !px-4 !py-2.5 text-[14px] text-[var(--navy)] hover:bg-white">
              <Feather size={15} /> {canUpload ? 'Your books' : 'Publish as an instructor'}
            </Link>
          </>
        }
      />

      {!isMember ? (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-5">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--pastel-mint)] text-[var(--green-deep)]">
              <Award size={20} />
            </span>
            <div>
              <div className="text-[15.5px] font-bold text-[var(--navy)]">
                InTelleX Student · {STUDENT_MONTHLY_XAF.toLocaleString('en-US')} XAF/month
              </div>
              <p className="mt-0.5 max-w-xl text-[13.5px] text-[var(--ink-soft)]">
                Every priced library book included, plus certifications and Intermediate→Pro free tracks.
              </p>
            </div>
          </div>
          <Link href="/membership" className="btn btn-primary shrink-0 !px-5">
            Become a student
          </Link>
        </div>
      ) : (
        <div className="mb-8 flex items-center gap-3 rounded-3xl bg-[var(--pastel-mint)] px-5 py-4 text-[14px] font-medium text-[var(--navy)]">
          <Award size={18} className="text-[var(--green-deep)]" /> Active InTelleX Student membership: priced library books are free for you.
        </div>
      )}

      <section className="mb-10">
        <BookTutorUpload />
      </section>

      {myShelf.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-[22px] font-bold text-[var(--navy)]">My shelf</h2>
          <div className="no-scrollbar flex gap-4 overflow-x-auto rounded-3xl bg-white p-5 pb-6">
            {myShelf.map((b) => (
              <Link key={b.id} href={`/dashboard/library/${b.id}`} className="group w-[128px] shrink-0" title={b.title}>
                {bookCover(b, 'shelf')}
              </Link>
            ))}
          </div>
        </section>
      )}

      {books.length === 0 && (
        <section className="mb-10 grid items-center gap-6 overflow-hidden rounded-[28px] bg-white p-6 sm:p-8 md:grid-cols-[1fr_300px]">
          <div>
            <h2 className="text-[24px] font-bold text-[var(--navy)]">Real books are on their way</h2>
            <p className="mt-2 max-w-[480px] text-[15px] leading-relaxed text-[var(--ink-soft)]">
              We are curating the shelf with books our instructors actually teach from. Meanwhile, upload any book
              you own to the AI tutor above, or request a title below.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/doodles/reading.svg" alt="" className="mx-auto hidden h-48 w-auto md:block" />
        </section>
      )}

      <section className="mb-10 grid gap-5 rounded-[28px] bg-[var(--pastel-lilac)] p-6 sm:p-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h3 className="text-[22px] font-bold text-[var(--navy)]">Need a title we don’t have?</h3>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--navy)]/70">
            Request books without cluttering the shelf. Students get 10 requests per month; everyone else gets 2.
          </p>
          <div className="mt-5">
            <BookRequestButton initialQuota={quota} />
          </div>
        </div>
        {myRequests.length > 0 && (
          <div className="rounded-3xl bg-white/80 p-5">
            <div className="mb-3 text-[14px] font-bold text-[var(--navy)]">Your recent requests</div>
            <ul className="space-y-2.5 text-[13.5px]">
              {myRequests.slice(0, 5).map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-[var(--navy)]">{r.title}</span>
                  <span className="rounded-full bg-[var(--paper-dim)] px-2.5 py-0.5 text-[12px] font-semibold capitalize text-[var(--navy)]/75">
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {libraryNotes.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2.5">
            <FileText size={17} className="text-[var(--green-deep)]" />
            <h2 className="text-[22px] font-bold text-[var(--navy)]">Class notes</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {libraryNotes.map((n) => {
              const owned = ownedNoteIds.has(n.id);
              return (
                <div key={n.id} className="flex gap-4 rounded-3xl bg-white p-4 transition-shadow hover:shadow-[0_18px_40px_-26px_rgba(18,50,79,0.5)]">
                  <Link href={`/dashboard/notes/${n.id}`} className="shrink-0">
                    <div className="flex h-[92px] w-[72px] items-center justify-center rounded-2xl bg-[var(--pastel-mint)] text-[var(--green-deep)]">
                      <FileText size={24} />
                    </div>
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link href={`/dashboard/notes/${n.id}`}>
                      <div className="line-clamp-2 text-[15px] font-bold leading-snug text-[var(--navy)]">{n.title}</div>
                    </Link>
                    <div className="mt-0.5 text-[12.5px] text-[var(--ink-soft)]">by {n.authorName}</div>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--ink-soft)]">
                      {n.body || 'Class notes from your instructor.'}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-[13.5px] font-bold" style={{ color: n.priceXAF > 0 ? 'var(--navy)' : 'var(--green-deep)' }}>
                        {n.priceXAF > 0 ? `${n.priceXAF.toLocaleString()} XAF` : 'Free'}
                      </span>
                      <GetNoteButton noteId={n.id} priceXAF={n.priceXAF} owned={owned} compact />
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
            <Layers size={17} className="text-[var(--green-deep)]" />
            <h2 className="text-[22px] font-bold text-[var(--navy)]">{cat}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {books
              .filter((b) => b.category === cat)
              .map((b) => {
                const owned = purchased.has(b.id) || b.priceXAF === 0 || b.authorId === session.uid || isMember;
                return (
                  <div key={b.id} className="flex gap-4 rounded-3xl bg-white p-4 transition-shadow hover:shadow-[0_18px_40px_-26px_rgba(18,50,79,0.5)]">
                    <Link href={`/dashboard/library/${b.id}`} className="w-[92px] shrink-0">
                      {bookCover(b, 'card')}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <Link href={`/dashboard/library/${b.id}`}>
                        <div className="line-clamp-2 text-[15px] font-bold leading-snug text-[var(--navy)]">{b.title}</div>
                      </Link>
                      <div className="mt-0.5 text-[12.5px] text-[var(--ink-soft)]">
                        by {b.authorName}
                        {b.downloadUrl ? ' · File / Drive' : ` · ${b.chapters.length} chapter${b.chapters.length === 1 ? '' : 's'}`}
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-[var(--ink-soft)]">{b.subtitle || b.description}</p>
                      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                        <span className="text-[13.5px] font-bold" style={{ color: b.priceXAF > 0 && !isMember ? 'var(--navy)' : 'var(--green-deep)' }}>
                          {b.priceXAF > 0 ? (isMember ? 'Included' : `${b.priceXAF.toLocaleString()} XAF`) : 'Free'}
                        </span>
                        {owned ? (
                          <StartBookTutorButton bookId={b.id} compact />
                        ) : (
                          <GetBookButton bookId={b.id} priceXAF={b.priceXAF} owned={owned} isMember={isMember} downloadUrl={b.downloadUrl} compact />
                        )}
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
