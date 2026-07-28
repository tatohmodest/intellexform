import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  fulfillMentorDocumentRequest,
  getPendingMentorApplication,
} from '@/lib/learn/ecosystem';
import { isGoogleDriveShareUrl, toDriveEmbedUrl } from '@/lib/learn/assessments';

export const dynamic = 'force-dynamic';

function isCloudinaryUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.hostname.includes('cloudinary.com');
  } catch {
    return false;
  }
}

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
    const raw = body.resumeUrl.trim();
    if (isGoogleDriveShareUrl(raw)) {
      updates.resumeUrl = toDriveEmbedUrl(raw).url;
      updates.resumeSource = 'google_drive';
    } else if (isCloudinaryUrl(raw)) {
      updates.resumeUrl = raw;
      updates.resumeSource = 'cloudinary';
    } else {
      return NextResponse.json({ error: 'invalid_resume_url' }, { status: 400 });
    }
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
