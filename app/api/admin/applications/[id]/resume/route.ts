import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { assertAdmin } from '@/lib/adminAuth';
import { isCloudinaryConfigured } from '@/lib/cloudinary';
import {
  contentTypeForFormat,
  isCloudinaryUrl,
  resolveCloudinaryDelivery,
  safeDownloadFilename,
} from '@/lib/cloudinaryDocs';
import { getDb } from '@/lib/repo';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/applications/[id]/resume
 * ?disposition=attachment|inline
 * Streams or redirects to a short-lived Cloudinary URL for the CV.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!assertAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: 'upload_unavailable' }, { status: 503 });
  }

  let oid: ObjectId;
  try {
    oid = new ObjectId(params.id);
  } catch {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
  }

  const disposition =
    req.nextUrl.searchParams.get('disposition') === 'inline' ? 'inline' : 'attachment';
  const useProxy = req.nextUrl.searchParams.get('proxy') === '1' || disposition === 'inline';

  try {
    const db = await getDb();
    const app = await db.collection('mentor_applications').findOne(
      { _id: oid },
      {
        projection: {
          resumeUrl: 1,
          resumePublicId: 1,
          resumeResourceType: 1,
          resumeFormat: 1,
          name: 1,
        },
      },
    );

    const resumeUrl = typeof app?.resumeUrl === 'string' ? app.resumeUrl : '';
    if (!resumeUrl) {
      return NextResponse.json({ error: 'resume_missing' }, { status: 404 });
    }

    // Legacy Drive links — open externally.
    if (/drive\.google\.com|docs\.google\.com/i.test(resumeUrl)) {
      return NextResponse.redirect(resumeUrl, 302);
    }

    if (!isCloudinaryUrl(resumeUrl)) {
      return NextResponse.json({ error: 'resume_missing' }, { status: 404 });
    }

    const resolved = await resolveCloudinaryDelivery({
      url: resumeUrl,
      publicId: typeof app?.resumePublicId === 'string' ? app.resumePublicId : null,
      resourceType:
        typeof app?.resumeResourceType === 'string' ? app.resumeResourceType : null,
      format: typeof app?.resumeFormat === 'string' ? app.resumeFormat : null,
      attachment: disposition === 'attachment',
    });

    if (!resolved.ok) {
      return NextResponse.json({ error: resolved.error }, { status: 404 });
    }

    if (!useProxy) {
      return NextResponse.redirect(resolved.deliveryUrl, 302);
    }

    const upstream = await fetch(resolved.deliveryUrl, {
      cache: 'no-store',
      redirect: 'follow',
    });
    if (!upstream.ok) {
      // Fallback: original delivery URL (public upload assets).
      return NextResponse.redirect(resumeUrl, 302);
    }

    const contentType = upstream.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'cloudinary_json_error', hint: 'Check API credentials and asset public_id/format.' },
        { status: 502 },
      );
    }

    const bytes = await upstream.arrayBuffer();
    const filename = safeDownloadFilename(String(app?.name ?? 'applicant-cv'), resolved.format);
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        'Content-Type': contentTypeForFormat(resolved.format),
        'Content-Disposition': `${disposition}; filename="${filename}"`,
        'Content-Length': String(bytes.byteLength),
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('resume download failed:', err);
    return NextResponse.json({ error: 'download_failed' }, { status: 500 });
  }
}
