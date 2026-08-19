import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen, Download, ExternalLink, Lock } from 'lucide-react';
import { getSessionUser } from '@/lib/auth/getUser';
import { getBook, getPurchasedBookIds } from '@/lib/learn/ecosystem';
import { hasActiveCertSubscription } from '@/lib/learn/certSubscription';
import {
  bookHasReadableChapters,
  isHttpUrl,
  toDriveDownloadUrl,
  toDriveViewUrl,
} from '@/lib/learn/driveDownload';
import MarkdownLite from '@/components/dashboard/MarkdownLite';
import GetBookButton from '@/components/dashboard/GetBookButton';
import StartBookTutorButton from '@/components/dashboard/StartBookTutorButton';

export const dynamic = 'force-dynamic';

export default async function BookReaderPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { ch?: string; mode?: string };
}) {
  const session = getSessionUser();
  if (!session) redirect(`/login?next=/dashboard/library/${params.id}`);

  const book = await getBook(params.id);
  if (!book || (!book.published && book.authorId !== session.uid)) notFound();

  const [purchased, isMember] = await Promise.all([
    getPurchasedBookIds(session.uid),
    hasActiveCertSubscription(session.uid),
  ]);
  const owned =
    book.priceXAF === 0 ||
    purchased.has(book.id) ||
    book.authorId === session.uid ||
    isMember;

  const chapters = Array.isArray(book.chapters) ? book.chapters : [];
  const hasReadable = bookHasReadableChapters(chapters);
  const hasDownload = isHttpUrl(book.downloadUrl);
  const downloadHref = hasDownload ? toDriveDownloadUrl(book.downloadUrl!) : null;
  const readExternalHref = hasDownload ? toDriveViewUrl(book.downloadUrl!) : null;
  const downloadFirst = hasDownload && !hasReadable;
  const wantReader = searchParams.mode === 'read' && hasReadable;

  // Drive / file books: hub with Read now + Download (never empty chapters).
  if (!wantReader && (downloadFirst || hasDownload)) {
    return (
      <div className="mx-auto max-w-[720px]">
        <Link
          href="/dashboard/library"
          className="mb-6 inline-flex items-center gap-1.5 text-[13.5px] font-semibold"
          style={{ color: 'var(--ink-soft)' }}
        >
          <ArrowLeft size={14} /> Library
        </Link>

        <div className="flex flex-col gap-8 sm:flex-row">
          <div className="shrink-0">
            {book.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="mx-auto aspect-[3/4] w-[160px] rounded-xl object-cover shadow-book sm:mx-0"
              />
            ) : (
              <div
                className="mx-auto flex aspect-[3/4] w-[160px] flex-col items-center justify-center rounded-xl p-4 text-center text-white shadow-book sm:mx-0"
                style={{
                  background: `linear-gradient(160deg, ${book.coverColor}, ${book.coverColor}cc)`,
                }}
              >
                <span className="font-display text-[36px] font-semibold">
                  {(book.title || 'B').charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p
              className="font-mono text-[11px] uppercase tracking-[0.16em]"
              style={{ color: 'var(--ink-soft)' }}
            >
              {book.category}
              {book.priceXAF === 0 ? ' · Free' : isMember ? ' · Included' : ''}
            </p>
            <h1 className="mt-2 font-display text-[32px] leading-tight">{book.title}</h1>
            {book.subtitle ? (
              <p className="mt-2 text-[15px]" style={{ color: 'var(--ink-soft)' }}>
                {book.subtitle}
              </p>
            ) : null}
            <p className="mt-1 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              by {book.authorName}
            </p>
            {book.description ? (
              <p className="mt-4 text-[14.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                {book.description}
              </p>
            ) : null}

            {!owned ? (
              <div className="mt-8">
                <GetBookButton
                  bookId={book.id}
                  priceXAF={book.priceXAF}
                  owned={false}
                  isMember={isMember}
                  downloadUrl={book.downloadUrl}
                />
                <p className="mt-3 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                  Unlock this title to read or download the file.
                </p>
              </div>
            ) : (
              <div className="mt-8 flex flex-wrap gap-3">
                <StartBookTutorButton bookId={book.id} />
                {readExternalHref ? (
                  <a
                    href={readExternalHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-semibold text-white"
                    style={{ background: 'var(--ink)' }}
                  >
                    <BookOpen size={16} /> Read now
                    <ExternalLink size={14} />
                  </a>
                ) : null}
                {downloadHref ? (
                  <a
                    href={downloadHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border px-5 py-3 text-[14px] font-semibold"
                    style={{ borderColor: 'var(--line)', color: 'var(--green-deep)' }}
                  >
                    <Download size={16} /> Download
                  </a>
                ) : null}
                {hasReadable ? (
                  <Link
                    href={`/dashboard/library/${book.id}?mode=read`}
                    className="inline-flex items-center gap-2 border px-5 py-3 text-[14px] font-semibold"
                    style={{ borderColor: 'var(--line)' }}
                  >
                    Read online chapters
                  </Link>
                ) : null}
              </div>
            )}

            {owned && downloadFirst ? (
              <p className="mt-4 text-[13px]" style={{ color: 'var(--ink-soft)' }}>
                This title is published as a file. Use Read now to open it, or Download to save a
                copy from Google Drive.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (!hasReadable || chapters.length === 0) {
    return (
      <div className="mx-auto max-w-[640px] py-16 text-center">
        <h1 className="font-display text-[28px]">{book.title}</h1>
        <p className="mt-3 text-[14px]" style={{ color: 'var(--ink-soft)' }}>
          No readable chapters yet.
        </p>
        {owned && downloadHref ? (
          <a
            href={downloadHref}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 text-[14px] font-semibold text-white"
            style={{ background: 'var(--green-deep)' }}
          >
            <Download size={16} /> Download book
          </a>
        ) : null}
        <div className="mt-6">
          <Link href="/dashboard/library" className="text-[13px] font-semibold">
            ← Back to library
          </Link>
        </div>
      </div>
    );
  }

  const chIdx = Math.max(
    0,
    Math.min(Number(searchParams.ch ?? 0) || 0, chapters.length - 1),
  );
  const chapter = chapters[chIdx];
  const locked = !owned && chIdx > 0;

  return (
    <div className="mx-auto flex max-w-[1050px] gap-8">
      <aside
        className="sticky top-[88px] hidden max-h-[calc(100vh-110px)] w-[260px] shrink-0 overflow-y-auto rounded-2xl border lg:block"
        style={{ borderColor: 'var(--line)' }}
      >
        <div className="border-b p-4" style={{ borderColor: 'var(--line)' }}>
          {book.coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="mx-auto aspect-[3/4] w-[110px] rounded-xl object-cover shadow-book"
            />
          ) : (
            <div
              className="mx-auto flex aspect-[3/4] w-[110px] flex-col items-center justify-center rounded-xl p-3 text-center text-white shadow-book"
              style={{
                background: `linear-gradient(160deg, ${book.coverColor}, ${book.coverColor}cc)`,
              }}
            >
              <span className="font-display text-[26px] font-semibold">
                {(book.title || 'B').charAt(0).toUpperCase()}
              </span>
              <span className="mt-2 line-clamp-3 font-display text-[11.5px] leading-snug">
                {book.title}
              </span>
            </div>
          )}
          <div className="mt-3 text-center text-[12px]" style={{ color: 'var(--ink-soft)' }}>
            by {book.authorName}
          </div>
          {owned && downloadHref ? (
            <a
              href={downloadHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost mt-3 !w-full !px-3 !py-2 text-[12px]"
            >
              <Download size={13} /> Download book
            </a>
          ) : null}
          {owned ? (
            <div className="mt-3">
              <StartBookTutorButton bookId={book.id} compact />
            </div>
          ) : null}
        </div>
        <div className="p-2">
          {chapters.map((c, i) => {
            const chapterLocked = !owned && i > 0;
            return (
              <Link
                key={i}
                href={`/dashboard/library/${book.id}?mode=read&ch=${i}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px]"
                style={
                  i === chIdx
                    ? {
                        background: 'rgba(0,179,105,0.1)',
                        color: 'var(--green-deep)',
                        fontWeight: 600,
                      }
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

      <article className="min-w-0 flex-1">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/dashboard/library"
            className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold"
            style={{ color: 'var(--ink-soft)' }}
          >
            <ArrowLeft size={14} /> Library
          </Link>
          {!owned && (
            <GetBookButton
              bookId={book.id}
              priceXAF={book.priceXAF}
              owned={false}
              isMember={isMember}
              downloadUrl={book.downloadUrl}
              compact
            />
          )}
        </div>

        <div
          className="mono mb-2 text-[11px] uppercase tracking-[0.12em]"
          style={{ color: 'var(--ink-soft)' }}
        >
          Chapter {chIdx + 1} of {chapters.length}
        </div>
        <h1 className="font-display text-[28px] leading-tight">{chapter?.title || 'Chapter'}</h1>

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
            <h2 className="font-display text-[20px]">This chapter is part of the full book</h2>
            <p className="mt-2 max-w-sm text-[14px]" style={{ color: 'var(--ink-soft)' }}>
              Chapter 1 is free to preview. Become an InTelleX Student to unlock the library, or get
              this book when you join.
            </p>
            <div className="mt-6">
              <GetBookButton
                bookId={book.id}
                priceXAF={book.priceXAF}
                owned={false}
                isMember={isMember}
                downloadUrl={book.downloadUrl}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="mt-6">
              <MarkdownLite text={chapter?.content || '_This chapter has no content yet._'} />
            </div>
            <div
              className="mt-10 flex items-center justify-between rounded-2xl border p-4"
              style={{ borderColor: 'var(--line)', background: 'var(--paper-dim)' }}
            >
              {chIdx > 0 ? (
                <Link
                  href={`/dashboard/library/${book.id}?mode=read&ch=${chIdx - 1}`}
                  className="btn btn-ghost !px-5 !py-2.5 text-[13.5px]"
                >
                  <ArrowLeft size={15} /> Previous
                </Link>
              ) : (
                <span />
              )}
              {chIdx < chapters.length - 1 && (
                <Link
                  href={`/dashboard/library/${book.id}?mode=read&ch=${chIdx + 1}`}
                  className="btn btn-primary !px-5 !py-2.5 text-[13.5px]"
                >
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
