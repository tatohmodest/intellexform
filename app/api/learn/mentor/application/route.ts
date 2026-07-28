import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  fulfillMentorDocumentRequest,
  getPendingMentorApplication,
} from '@/lib/learn/ecosystem';
import { isCloudinaryUrl } from '@/lib/cloudinaryFormats';

export const dynamic = 'force-dynamic';

/** GET /api/learn/mentor/application - current pending application (incl. open doc requests). */
export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const app = await getPendingMentorApplication(user.uid);
    return NextResponse.json({ application: app });
  } catch (err) {
    console.error('get mentor application failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}

/**
 * PATCH /api/learn/mentor/application
 * Fulfill an open admin document request with only the asked items.
 */
export async function PATCH(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const updates: Parameters<typeof fulfillMentorDocumentRequest>[1] = {};

  if (typeof body.resumeUrl === 'string' && body.resumeUrl.trim()) {
    if (!isCloudinaryUrl(body.resumeUrl.trim())) {
      return NextResponse.json({ error: 'invalid_resume_url' }, { status: 400 });
    }
    updates.resumeUrl = body.resumeUrl.trim();
    updates.resumeSource = 'cloudinary';
    if (typeof body.resumePublicId === 'string') updates.resumePublicId = body.resumePublicId;
    if (typeof body.resumeResourceType === 'string') {
      updates.resumeResourceType = body.resumeResourceType;
    }
    if (typeof body.resumeFormat === 'string') updates.resumeFormat = body.resumeFormat;
  }

  if (typeof body.idFrontUrl === 'string' && body.idFrontUrl.trim()) {
    if (!isCloudinaryUrl(body.idFrontUrl.trim())) {
      return NextResponse.json({ error: 'invalid_document_url' }, { status: 400 });
    }
    updates.idFrontUrl = body.idFrontUrl.trim();
  }
  if (typeof body.idBackUrl === 'string' && body.idBackUrl.trim()) {
    if (!isCloudinaryUrl(body.idBackUrl.trim())) {
      return NextResponse.json({ error: 'invalid_document_url' }, { status: 400 });
    }
    updates.idBackUrl = body.idBackUrl.trim();
  }
  if (typeof body.introVideoUrl === 'string' && body.introVideoUrl.trim()) {
    if (!isCloudinaryUrl(body.introVideoUrl.trim())) {
      return NextResponse.json({ error: 'invalid_document_url' }, { status: 400 });
    }
    updates.introVideoUrl = body.introVideoUrl.trim();
    if (typeof body.introVideoBytes === 'number') {
      updates.introVideoBytes = body.introVideoBytes;
    }
  }

  try {
    const result = await fulfillMentorDocumentRequest(user.uid, updates);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    const application = await getPendingMentorApplication(user.uid);
    return NextResponse.json({ ok: true, application });
  } catch (err) {
    console.error('fulfill mentor document request failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
