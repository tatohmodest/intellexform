import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { createBook, getRoles, listPublishedBooks } from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const books = await listPublishedBooks();
  return NextResponse.json({
    books: books.map(({ chapters, ...b }) => ({ ...b, chapterCount: chapters.length })),
  });
}

/** POST /api/learn/books — mentors create a new draft book. */
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const roles = await getRoles(user.uid);
  if (!roles.includes('mentor')) {
    return NextResponse.json({ error: 'mentor_role_required' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const title = String(body.title ?? '').trim();
  if (!title) return NextResponse.json({ error: 'missing_title' }, { status: 400 });
  try {
    const id = await createBook({ authorId: user.uid, authorName: user.name, title });
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error('createBook failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
