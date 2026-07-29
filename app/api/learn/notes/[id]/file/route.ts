import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import {
  contentTypeForFormat,
  fetchFirstWorkingCandidate,
  isCloudinaryUrl,
  resolveCloudinaryDelivery,
  safeDownloadFilename,
} from '@/lib/cloudinaryDocs';
import { getInstructorNote, studentOwnsNote } from '@/lib/learn/notes';

export const dynamic = 'force-dynamic';

/** GET /api/learn/notes/[id]/file?disposition=inline|attachment */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const note = await getInstructorNote(params.id);
  if (!note) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const isAuthor = note.authorId === session.uid;
  if (!isAuthor) {
    const owns = await studentOwnsNote(note, session.uid);
    if (!owns) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  if (note.driveUrl && !note.fileUrl) {
    return NextResponse.redirect(note.driveUrl, 302);
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: 'upload_unavailable' }, { status: 503 });
  }

  const url = note.fileUrl || '';
  if (!url || !isCloudinaryUrl(url)) {
    return NextResponse.json({ error: 'file_missing' }, { status: 404 });
  }

  const disposition =
    req.nextUrl.searchParams.get('disposition') === 'inline' ? 'inline' : 'attachment';

  const resolved = await resolveCloudinaryDelivery({
    url,
    publicId: note.filePublicId || null,
    resourceType: note.fileResourceType || null,
    format: note.fileFormat || null,
    attachment: disposition === 'attachment',
  });

  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error }, { status: 404 });
  }

  const hit = await fetchFirstWorkingCandidate(resolved.candidates);
  if (!hit) {
    return NextResponse.json({ error: 'cloudinary_delivery_blocked' }, { status: 502 });
  }

  const bytes = await hit.response.arrayBuffer();
  const filename = safeDownloadFilename(note.fileName || note.title || 'notes', resolved.format);

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      'Content-Type': contentTypeForFormat(resolved.format),
      'Content-Disposition': `${disposition}; filename="${filename}"`,
      'Content-Length': String(bytes.byteLength),
      'Cache-Control': 'private, no-store',
    },
  });
}
