import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { createBooking, getBookings } from '@/lib/learn/repo';
import { findMentor, listUserInstitutions } from '@/lib/learn/ecosystem';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const bookings = await getBookings(user.uid);
  return NextResponse.json({ bookings });
}

/**
 * Create a booking.
 *
 * Paid marketplace sessions must go through PayUnit first
 * (`POST /api/payments/initialize` with kind=session_booking). This endpoint
 * only creates free sessions, or campus teaching sessions that are never
 * billed on InTelleX.
 */
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

  const campuses = await listUserInstitutions(mentor.id);
  const studentCampuses = await listUserInstitutions(user.uid);
  const sharedCampus = campuses.find((c) => studentCampuses.some((s) => s.slug === c.slug));
  const isCampusTeaching =
    Boolean(sharedCampus) &&
    ['instructor', 'owner', 'admin'].includes(sharedCampus!.role);

  const price = Math.max(0, mentor.priceXAF || 0);

  // Marketplace paid sessions: must pay via PayUnit first.
  if (price > 0 && !isCampusTeaching) {
    return NextResponse.json(
      {
        error: 'payment_required',
        message: 'Pay for this session with PayUnit before it is booked.',
      },
      { status: 402 },
    );
  }

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
      priceXAF: isCampusTeaching ? 0 : price,
      paid: false,
      platformXAF: 0,
      instructorXAF: 0,
      commissionRate: 0,
      isTrial: false,
    });
    return NextResponse.json({ ok: true, id, channel, free: true });
  } catch (err) {
    console.error('createBooking failed:', err);
    return NextResponse.json({ error: 'db_unavailable' }, { status: 503 });
  }
}
