import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getInstructorNote, purchaseNote, studentOwnsNote } from '@/lib/learn/notes';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const note = await getInstructorNote(params.id);
  if (!note || !note.published || !note.listInLibrary) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const owns = await studentOwnsNote(note, session.uid);
  if (owns) return NextResponse.json({ ok: true, alreadyOwned: true });

  await purchaseNote({ note, studentId: session.uid });
  return NextResponse.json({ ok: true });
}
