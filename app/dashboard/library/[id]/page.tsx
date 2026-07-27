import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getBook, getPurchasedBookIds } from '@/lib/learn/ecosystem';
import MarkdownLite from '@/components/dashboard/MarkdownLite';
import GetBookButton from '@/components/dashboard/GetBookButton';

export const dynamic = 'force-dynamic';

export default async function BookReaderPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { ch?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/library/${params.id}`);

  const book = await getBook(params.id);
  if (!book || (!book.published && book.authorId !== session.uid)) notFound();

  const purchased = await getPurchasedBookIds(session.uid);
  const owned =
    book.priceXAF === 0 || purchased.has(book.id) || book.authorId === session.uid;

  const chIdx = Math.max(
    0,
    Math.min(Number(searchParams.ch ?? 0) || 0, book.chapters.length - 1),
  );
  const chapter = book.chapters[chIdx];

  // Paid books show the first chapter as a free preview.
  const locked = !owned && chIdx > 0;

  return (
    <div className="mx-auto flex max-w-[1050px] gap-8">
      {/* Chapter sidebar */}
      <aside
        className="sticky top-[88px] hidden max-h-[calc(100vh-110px)] w-[260px] shrink-0 overflow-y-auto rounded-2xl border lg:block"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="border-b p-4" style={{ borderColor: 'var(--line)' }}>
          <div
            className="mx-auto flex aspect-[3/4] w-[110px] flex-col items-center justify-center rounded-xl p-3 text-center text-white shadow-book"
            style={{ background: `linear-gradient(160deg, ${book.coverColor}, ${book.coverColor}cc)` }}
          >
            <span className="text-[26px]">{book.coverEmoji}</span>
            <span className="mt-2 line-clamp-3 font-display text-[11.5px] leading-snug">{book.title}</span>
          </div>
          <div className="mt-3 text-center text-[12px]" style={{ color: 'var(--ink-soft)' }}>
            by {book.authorName}
          </div>
        </div>
        <div className="p-2">
          {book.chapters.map((c, i) => {
            const chapterLocked = !owned && i > 0;
            return (
              <Link
                key={i}
                href={`/dashboard/library/${book.id}?ch=${i}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px]"
                style={
                  i === chIdx
                    ? { background: 'rgba(0,179,105,0.1)', color: 'var(--green-deep)', fontWeight: 600 }
                    : { color: chapterLocked ? 'var(--ink-soft)' : 'var(--ink)' }
                }
              >
                {chapterLocked && <Lock size={12} className="shrink-0" />}
                <span className="truncate">
                  {i + 1}. {c.title}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Reader */}
      <article className="min-w-0 flex-1">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/dashboard/library"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold"
            style={{ color: 'var(--ink-soft)' }}
          >
            <ArrowLeft size={14} /> Library
          </Link>
          {!owned && <GetBookButton bookId={book.id} priceXAF={book.priceXAF} owned={false} compact />}
        </div>

        <div className="mono mb-2 text-[11px] uppercase tracking-[0.12em]" style={{ color: 'var(--ink-soft)' }}>
          Chapter {chIdx + 1} of {book.chapters.length}
        </div>
        <h1 className="font-display text-[28px] leading-tight">{chapter.title}</h1>

        {locked ? (
          <div
            className="mt-10 flex flex-col items-center rounded-3xl border border-dashed px-6 py-14 text-center"
            style={{ borderColor: 'var(--line)' }}
          >
            <span
              className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: 'var(--paper-dim)', color: 'var(--ink-soft)' }}
            >
              <Lock size={24} />
            </span>
            <h2 className="font-display text-[20px]">This chapter is part of the paid book</h2>
            <p className="mt-2 max-w-sm text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              Chapter 1 is free to preview. Get the full book to keep reading — the author
              earns directly from every sale.
            </p>
            <div className="mt-6">
              <GetBookButton bookId={book.id} priceXAF={book.priceXAF} owned={false} />
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <MarkdownLite text={chapter.content || '_This chapter has no content yet._'} />
            </div>
            <div
              className="mt-10 flex items-center justify-between rounded-2xl border p-4"
              style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
            >
              {chIdx > 0 ? (
                <Link href={`/dashboard/library/${book.id}?ch=${chIdx - 1}`} className="btn btn-ghost !px-5 !py-2.5 text-[13.5px]">
                  <ArrowLeft size={15} /> Previous
                </Link>
              ) : (
                <span />
              )}
              {chIdx < book.chapters.length - 1 && (
                <Link href={`/dashboard/library/${book.id}?ch=${chIdx + 1}`} className="btn btn-primary !px-5 !py-2.5 text-[13.5px]">
                  Next chapter <ArrowRight size={15} />
                </Link>
              )}
            </div>
          </>
        )}
      </article>
    </div>
  );
}
