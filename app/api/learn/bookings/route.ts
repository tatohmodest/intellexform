import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { createBooking, getBookings } from '@/lib/learn/repo';
import { findMentor } from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const bookings = await getBookings(user.uid);
  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const mentor = await findMentor(String(body.mentorId ?? ''));
  if (!mentor) return NextResponse.json({ error: 'unknown_mentor' }, { status: 400 });

  const scheduledAt = new Date(String(body.scheduledAt ?? ''));
  if (Number.isNaN(scheduledAt.getTime()) || scheduledAt.getTime() < Date.now()) {
    return NextResponse.json({ error: 'invalid_time' }, { status: 400 });
  }
  const topic = String(body.topic ?? '').trim().slice(0, 140) || `Mentorship with ${mentor.name}`;

  // Channel is the Agora room name — unique per booking.
  const channel = `mx-${mentor.id}-${crypto.randomBytes(4).toString('hex')}`;

  try {
    const id = await createBooking({
      userId: user.uid,
      mentorId: mentor.id,
      mentorName: mentor.name,
      topic,
      scheduledAt,
      durationMinutes: mentor.sessionMinutes,
      channel,
      priceXAF: mentor.priceXAF,
    });
    return NextResponse.json({ ok: true, id, channel });
  } catch (err) {
    console.error('createBooking failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
