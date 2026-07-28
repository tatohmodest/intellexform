import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { isCloudinaryConfigured, signMediaUpload } from '@/lib/cloudinary';
import { MEDIA_UPLOAD_KINDS, type MediaUploadKind } from '@/lib/learn/mentorUploadKinds';

export const dynamic = 'force-dynamic';

/**
 * POST /api/learn/mentor/upload-sign
 * Returns a short-lived Cloudinary signature for direct browser upload
 * (mentor docs + assignment files).
 */
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: 'upload_unavailable' }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const kind = String(body.kind ?? '') as MediaUploadKind;
  if (!MEDIA_UPLOAD_KINDS.includes(kind)) {
    return NextResponse.json({ error: 'invalid_kind' }, { status: 400 });
  }

  try {
    const signed = signMediaUpload({
      kind,
      lbId: user.uid,
      mimeType: typeof body.mimeType === 'string' ? body.mimeType : undefined,
      filename: typeof body.filename === 'string' ? body.filename : undefined,
    });
    return NextResponse.json({
      ok: true,
      ...signed,
      uploadUrl: `https://api.cloudinary.com/v1_1/${signed.cloudName}/${signed.resourceType}/upload`,
    });
  } catch (err) {
    console.error('upload-sign failed:', err);
    return NextResponse.json({ error: 'sign_failed' }, { status: 500 });
  }
}
