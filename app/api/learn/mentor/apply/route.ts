import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { submitMentorApplication } from '@/lib/learn/ecosystem';
import { isGoogleDriveShareUrl, toDriveEmbedUrl } from '@/lib/learn/assessments';
import type { MentorSlot } from '@/lib/learn/mentors';

export const dynamic = 'force-dynamic';

function isCloudinaryUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.hostname.includes('cloudinary.com');
  } catch {
    return false;
  }
}

/**
 * POST /api/learn/mentor/apply - submit a mentor *application*.
 * Mentorship is not toggled on; Platform admins approve after reviewing
 * CV (public Google Drive link), government ID (front/back), and intro video.
 */
export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const title = String(body.title ?? '').trim();
  const bio = String(body.bio ?? '').trim();
  const expertise = Array.isArray(body.expertise)
    ? body.expertise.map((e: unknown) => String(e).trim()).filter(Boolean)
    : [];
  const priceXAF = Number(body.priceXAF ?? 0);
  const sessionMinutes = Number(body.sessionMinutes ?? 45);
  const slots: MentorSlot[] = Array.isArray(body.slots)
    ? body.slots
        .filter(
          (s: MentorSlot) =>
            typeof s?.dayOffset === 'number' &&
            s.dayOffset >= 0 &&
            s.dayOffset <= 13 &&
            /^\d{2}:\d{2}$/.test(String(s?.time)),
        )
        .map((s: MentorSlot) => ({ dayOffset: s.dayOffset, time: s.time }))
    : [];

  const resumeRaw = String(body.resumeUrl ?? '').trim();
  const idFrontUrl = String(body.idFrontUrl ?? '').trim();
  const idBackUrl = String(body.idBackUrl ?? '').trim();
  const introVideoUrl = String(body.introVideoUrl ?? '').trim();
  const introVideoBytes = Number(body.introVideoBytes ?? 0);
  const institutionSlug = String(body.institutionSlug ?? '').trim() || null;
  const institutionName = String(body.institutionName ?? '').trim() || null;

  if (!title || !bio || expertise.length === 0 || slots.length === 0) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }
  if (!resumeRaw || !idFrontUrl || !idBackUrl || !introVideoUrl) {
    return NextResponse.json({ error: 'missing_documents' }, { status: 400 });
  }

  // CV: prefer Google Drive / Docs public share links (also accept legacy Cloudinary).
  let resumeUrl = resumeRaw;
  let resumeSource: 'google_drive' | 'cloudinary' = 'cloudinary';
  if (isGoogleDriveShareUrl(resumeRaw)) {
    resumeUrl = toDriveEmbedUrl(resumeRaw).url;
    resumeSource = 'google_drive';
  } else if (isCloudinaryUrl(resumeRaw)) {
    resumeSource = 'cloudinary';
  } else {
    return NextResponse.json({ error: 'invalid_resume_url' }, { status: 400 });
  }

  if (![idFrontUrl, idBackUrl, introVideoUrl].every(isCloudinaryUrl)) {
    return NextResponse.json({ error: 'invalid_document_url' }, { status: 400 });
  }

  try {
    const result = await submitMentorApplication({
      lbId: user.uid,
      name: user.name,
      email: user.email,
      title,
      bio,
      expertise,
      priceXAF: Number.isFinite(priceXAF) ? priceXAF : 0,
      sessionMinutes,
      slots,
      linkedinUrl: String(body.linkedinUrl ?? '').trim() || undefined,
      githubUrl: String(body.githubUrl ?? '').trim() || undefined,
      portfolioUrl: String(body.portfolioUrl ?? '').trim() || undefined,
      resumeUrl,
      resumeSource,
      institutionSlug: institutionSlug || undefined,
      institutionName: institutionName || undefined,
      idFrontUrl,
      idBackUrl,
      introVideoUrl,
      introVideoBytes: Number.isFinite(introVideoBytes) ? introVideoBytes : undefined,
    });
    return NextResponse.json({
      ok: true,
      pending: true,
      applicationId: result.applicationId,
      status: result.status,
      message:
        'Mentor application submitted. You will receive mentor access after InTelleX admin review and approval.',
    });
  } catch (err) {
    console.error('submitMentorApplication failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
