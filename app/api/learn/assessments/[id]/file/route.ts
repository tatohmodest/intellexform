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
import { getAssessment, getSubmission } from '@/lib/learn/assessments';

export const dynamic = 'force-dynamic';

/**
 * GET /api/learn/assessments/[id]/file
 * Auth: student (own file) or assessment author.
 * ?disposition=inline|attachment&studentId= (author only)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: 'upload_unavailable' }, { status: 503 });
  }

  const assessment = await getAssessment(params.id);
  if (!assessment) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const studentIdParam = req.nextUrl.searchParams.get('studentId');
  const isAuthor = assessment.authorId === session.uid;
  const studentId = isAuthor && studentIdParam ? studentIdParam : session.uid;
  if (!isAuthor && studentId !== session.uid) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const submission = await getSubmission(params.id, studentId);
  if (!submission) return NextResponse.json({ error: 'not_found' }, { status: 404 });

  const fileUrl = submission.fileUrl || '';
  const driveUrl = submission.driveUrl || '';

  // Legacy Drive submissions.
  if (!fileUrl && driveUrl && /drive\.google\.com|docs\.google\.com/i.test(driveUrl)) {
    return NextResponse.redirect(driveUrl, 302);
  }

  const url = fileUrl || driveUrl;
  if (!url || !isCloudinaryUrl(url)) {
    return NextResponse.json({ error: 'file_missing' }, { status: 404 });
  }

  const disposition =
    req.nextUrl.searchParams.get('disposition') === 'inline' ? 'inline' : 'attachment';

  const resolved = await resolveCloudinaryDelivery({
    url,
    publicId: submission.filePublicId || null,
    resourceType: submission.fileResourceType || null,
    format: submission.fileFormat || null,
    attachment: disposition === 'attachment',
  });

  if (!resolved.ok) {
    return NextResponse.json({ error: resolved.error }, { status: 404 });
  }

  const hit = await fetchFirstWorkingCandidate(resolved.candidates);
  if (!hit) {
    return NextResponse.json(
      {
        error: 'cloudinary_delivery_blocked',
        hint:
          'Cloudinary refused delivery. In Settings → Security, allow delivery of PDF and ZIP files.',
      },
      { status: 502 },
    );
  }

  const bytes = await hit.response.arrayBuffer();
  const filename = safeDownloadFilename(
    submission.fileName || submission.studentName || 'submission',
    resolved.format,
  );

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
