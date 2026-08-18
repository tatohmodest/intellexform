import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { createBook, getRoles, listPublishedBooks } from '@/lib/learn/ecosystem';
import { getStaffPost } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

async function canAuthorBooks(userId: string) {
  const [roles, staff] = await Promise.all([getRoles(userId), getStaffPost(userId)]);
  return roles.includes('mentor') || roles.includes('admin') || Boolean(staff);
}

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const books = await listPublishedBooks();
  return NextResponse.json({
    books: books.map(({ chapters, ...b }) => ({ ...b, chapterCount: chapters.length })),
  });
}

/** POST /api/learn/books - instructors and staff create a new draft book. */
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!(await canAuthorBooks(user.uid))) {
    return NextResponse.json({ error: 'instructor_or_staff_required' }, { status: 403 });
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
