import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { BookTutorError, createOrGetPathFromLibraryBook } from '@/lib/learn/bookTutor';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const pathId = await createOrGetPathFromLibraryBook({
      userId: user.uid,
      bookId: params.id,
    });
    return NextResponse.json({ ok: true, id: pathId });
  } catch (err) {
    const status = err instanceof BookTutorError ? err.status : 500;
    const message = err instanceof Error ? err.message : 'Could not start the book tutor.';
    return NextResponse.json({ error: message }, { status });
  }
}
