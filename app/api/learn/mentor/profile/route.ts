import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getMentorProfile, updateMentorProfile } from '@/lib/learn/ecosystem';
import type { MentorSlot } from '@/lib/learn/mentors';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const profile = await getMentorProfile(user.uid);
  return NextResponse.json({ profile });
}

export async function PATCH(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const existing = await getMentorProfile(user.uid);
  if (!existing) return NextResponse.json({ error: 'not_a_mentor' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  if (typeof body.title === 'string') patch.title = body.title.trim().slice(0, 90);
  if (typeof body.bio === 'string') patch.bio = body.bio.trim().slice(0, 500);
  if (Array.isArray(body.expertise)) {
    patch.expertise = body.expertise.map((e: unknown) => String(e).trim()).filter(Boolean).slice(0, 6);
  }
  if (typeof body.priceXAF === 'number' && body.priceXAF >= 0) {
    patch.priceXAF = Math.min(Math.round(body.priceXAF), 1_000_000);
  }
  if ([30, 45, 60].includes(body.sessionMinutes)) patch.sessionMinutes = body.sessionMinutes;
  if (typeof body.active === 'boolean') patch.active = body.active;
  if (Array.isArray(body.slots)) {
    patch.slots = body.slots
      .filter(
        (s: MentorSlot) =>
          typeof s?.dayOffset === 'number' &&
          s.dayOffset >= 0 &&
          s.dayOffset <= 13 &&
          /^\d{2}:\d{2}$/.test(String(s?.time)),
      )
      .slice(0, 10);
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'nothing_to_update' }, { status: 400 });
  }
  try {
    await updateMentorProfile(user.uid, patch);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('updateMentorProfile failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
