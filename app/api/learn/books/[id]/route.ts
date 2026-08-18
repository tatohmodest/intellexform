import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getBook, updateBook } from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const book = await getBook(params.id);
  if (!book) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ book });
}

/** PATCH /api/learn/books/[id] - the author edits/publishes their book. */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const book = await getBook(params.id);
  if (!book) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  if (book.authorId !== user.uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  if (typeof body.title === 'string' && body.title.trim()) patch.title = body.title.trim().slice(0, 120);
  if (typeof body.subtitle === 'string') patch.subtitle = body.subtitle.trim().slice(0, 160);
  if (typeof body.description === 'string') patch.description = body.description.trim().slice(0, 1000);
  if (typeof body.category === 'string') patch.category = body.category.trim().slice(0, 40);
  if (typeof body.coverColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(body.coverColor)) {
    patch.coverColor = body.coverColor;
  }
  if (typeof body.coverEmoji === 'string') patch.coverEmoji = body.coverEmoji.slice(0, 4);
  if (typeof body.priceXAF === 'number' && body.priceXAF >= 0) {
    patch.priceXAF = Math.min(Math.round(body.priceXAF), 1_000_000);
  }
  if (typeof body.published === 'boolean') patch.published = body.published;
  if (typeof body.downloadUrl === 'string') {
    const url = body.downloadUrl.trim();
    if (!url) patch.downloadUrl = null;
    else if (/^https?:\/\//i.test(url)) patch.downloadUrl = url.slice(0, 2000);
  } else if (body.downloadUrl === null) {
    patch.downloadUrl = null;
  }
  if (Array.isArray(body.chapters)) {
    patch.chapters = body.chapters
      .filter((c: { title?: unknown; content?: unknown }) => typeof c?.title === 'string')
      .map((c: { title: string; content?: string }) => ({
        title: c.title.slice(0, 140),
        content: String(c.content ?? '').slice(0, 60_000),
      }))
      .slice(0, 60);
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'nothing_to_update' }, { status: 400 });
  }
  try {
    await updateBook(params.id, user.uid, patch);
    if (patch.published === true && !book.published) {
      try {
        const { createNotificationsForUsers, listInstitutionNotifyIds } = await import(
          '@/lib/learn/notifications'
        );
        const ids = await listInstitutionNotifyIds({ includeStaff: true, exclude: user.uid });
        await createNotificationsForUsers(ids, {
          title: `New in the library: ${String(patch.title || book.title)}`,
          body: `${user.name} uploaded a book. Open the library to read it.`,
          href: '/dashboard/library',
          kind: 'note',
        });
      } catch {
        /* non-blocking */
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('updateBook failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
