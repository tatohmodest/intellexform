import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { BOOK_TUTOR_MAX_BYTES } from '@/lib/learn/bookParse';
import { BookTutorError, createPathFromUpload, listPathsForUser } from '@/lib/learn/bookTutor';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const data = await listPathsForUser(user.uid);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: 'Expected a file upload.' }, { status: 400 });
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Choose a PDF, EPUB, DOCX, or text file.' }, { status: 400 });
  if (file.size > BOOK_TUTOR_MAX_BYTES) {
    return NextResponse.json({ error: 'File is too large (12 MB max).' }, { status: 400 });
  }

  const title = String(form.get('title') || '').trim();
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const id = await createPathFromUpload({
      userId: user.uid,
      userName: user.name,
      buffer,
      filename: file.name || 'book.pdf',
      mime: file.type,
      title,
    });
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    const status = err instanceof BookTutorError ? err.status : 400;
    const message = err instanceof Error ? err.message : 'Could not build a tutor from that file.';
    console.error('book tutor upload failed:', err);
    return NextResponse.json({ error: message }, { status });
  }
}
