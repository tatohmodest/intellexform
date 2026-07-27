import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getBook, purchaseBook } from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

/** POST /api/learn/books/[id]/purchase - add the book to the learner's shelf. */
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const book = await getBook(params.id);
  if (!book || !book.published) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }
  try {
    await purchaseBook(user.uid, book);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('purchaseBook failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
