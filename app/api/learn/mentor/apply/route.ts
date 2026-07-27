import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { becomeMentor } from '@/lib/learn/ecosystem';
import type { MentorSlot } from '@/lib/learn/mentors';

export const dynamic = 'force-dynamic';

/** POST /api/learn/mentor/apply — upgrade the account with the mentor role. */
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

  if (!title || !bio || expertise.length === 0 || slots.length === 0) {
    return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
  }

  try {
    await becomeMentor({
      lbId: user.uid,
      name: user.name,
      title,
      bio,
      expertise,
      priceXAF: Number.isFinite(priceXAF) ? priceXAF : 0,
      sessionMinutes,
      slots,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('becomeMentor failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
