import { NextRequest, NextResponse } from 'next/server';
import { assertAdmin, isAdminEmail } from '@/lib/adminAuth';
import { getSessionUser } from '@/lib/auth/getUser';
import { isCloudinaryConfigured, signMediaUpload, type MediaUploadKind } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

const KINDS: MediaUploadKind[] = ['avatar', 'logo', 'cover', 'course_image', 'book_cover'];
const LEARNER_KINDS: MediaUploadKind[] = ['avatar', 'book_cover'];
const ADMIN_KINDS: MediaUploadKind[] = ['logo', 'cover', 'course_image', 'book_cover', 'avatar'];

/**
 * POST /api/media/upload-sign
 * Short-lived Cloudinary signature for browser uploads.
 * Avatars / book covers: any signed-in learner.
 * Campus logo/cover / course images: platform admin.
 */
export async function POST(req: NextRequest) {
  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ error: 'upload_unavailable' }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const kind = String(body.kind ?? '') as MediaUploadKind;
  if (!KINDS.includes(kind)) {
    return NextResponse.json({ error: 'invalid_kind' }, { status: 400 });
  }

  const learner = getSessionUser();
  const adminOk = assertAdmin(req) || (learner?.email ? isAdminEmail(learner.email) : false);

  if (ADMIN_KINDS.includes(kind) && (kind === 'logo' || kind === 'cover' || kind === 'course_image')) {
    if (!adminOk) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  } else if (LEARNER_KINDS.includes(kind)) {
    if (!learner && !adminOk) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  } else if (!adminOk && !learner) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const ownerId =
    (adminOk && typeof body.ownerId === 'string' && body.ownerId.trim()
      ? body.ownerId.trim()
      : null) ||
    learner?.uid ||
    (adminOk ? 'admin' : 'anon');

  try {
    const signed = signMediaUpload({ kind, ownerId });
    return NextResponse.json({
      ok: true,
      ...signed,
      uploadUrl: `https://api.cloudinary.com/v1_1/${signed.cloudName}/${signed.resourceType}/upload`,
    });
  } catch (err) {
    console.error('media upload-sign failed:', err);
    return NextResponse.json({ error: 'sign_failed' }, { status: 500 });
  }
}
