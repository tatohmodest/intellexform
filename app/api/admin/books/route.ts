import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin } from '@/lib/adminAuth';
import {
  createBook,
  getBook,
  listAllBooks,
  updateBookAsAdmin,
} from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const books = await listAllBooks(300);
  return NextResponse.json({
    books: books.map(({ chapters, ...b }) => ({
      ...b,
      chapterCount: chapters.length,
    })),
  });
}

/** Create a draft book authored as InTelleX (platform). */
export async function POST(req: NextRequest) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const title = String(body.title || '').trim();
  if (!title) return NextResponse.json({ error: 'missing_title' }, { status: 400 });

  const id = await createBook({
    authorId: 'system',
    authorName: String(body.authorName || 'InTelleX').slice(0, 80),
    title,
  });

  const patch: Record<string, unknown> = {};
  if (typeof body.subtitle === 'string') patch.subtitle = body.subtitle.slice(0, 160);
  if (typeof body.description === 'string') patch.description = body.description.slice(0, 1000);
  if (typeof body.category === 'string') patch.category = body.category.slice(0, 40);
  if (typeof body.priceXAF === 'number' && body.priceXAF >= 0) {
    patch.priceXAF = Math.min(Math.round(body.priceXAF), 1_000_000);
  }
  if (typeof body.published === 'boolean') patch.published = body.published;
  if (typeof body.coverColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(body.coverColor)) {
    patch.coverColor = body.coverColor;
  }
  if (Object.keys(patch).length) {
    await updateBookAsAdmin(id, patch as Parameters<typeof updateBookAsAdmin>[1]);
  }

  const book = await getBook(id);
  return NextResponse.json({ ok: true, id, book }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const id = String(body.id || '');
  if (!id) return NextResponse.json({ error: 'missing_id' }, { status: 400 });

  const existing = await getBook(id);
  if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const patch: Record<string, unknown> = {};
  if (typeof body.title === 'string' && body.title.trim()) patch.title = body.title.trim().slice(0, 120);
  if (typeof body.subtitle === 'string') patch.subtitle = body.subtitle.trim().slice(0, 160);
  if (typeof body.description === 'string') patch.description = body.description.trim().slice(0, 1000);
  if (typeof body.category === 'string') patch.category = body.category.trim().slice(0, 40);
  if (typeof body.authorName === 'string') patch.authorName = body.authorName.trim().slice(0, 80);
  if (typeof body.coverColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(body.coverColor)) {
    patch.coverColor = body.coverColor;
  }
  if (typeof body.priceXAF === 'number' && body.priceXAF >= 0) {
    patch.priceXAF = Math.min(Math.round(body.priceXAF), 1_000_000);
  }
  if (typeof body.published === 'boolean') patch.published = body.published;
  if (Array.isArray(body.chapters)) {
    patch.chapters = body.chapters
      .filter((c: { title?: unknown }) => typeof c?.title === 'string')
      .map((c: { title: string; content?: string }) => ({
        title: c.title.slice(0, 140),
        content: String(c.content ?? '').slice(0, 60_000),
      }))
      .slice(0, 60);
  }

  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: 'nothing_to_update' }, { status: 400 });
  }

  await updateBookAsAdmin(id, patch as Parameters<typeof updateBookAsAdmin>[1]);
  const book = await getBook(id);
  return NextResponse.json({ ok: true, book });
}
