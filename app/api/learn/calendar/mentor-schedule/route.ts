import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import { getLearner } from '@/lib/learn/repo';
import { getMentorProfile, listInstructorStudentGroups } from '@/lib/learn/ecosystem';
import {
  createMentorWeeklySlot,
  deleteMentorWeeklySlot,
  listMentorWeeklySlotsByMentor,
} from '@/lib/learn/calendarEvents';

export const dynamic = 'force-dynamic';

async function assertCanScheduleStudent(mentorId: string, studentId: string): Promise<boolean> {
  const groups = await listInstructorStudentGroups(mentorId);
  return groups.some((g) => g.students.some((s) => s.studentId === studentId));
}

export async function GET(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const profile = await getMentorProfile(session.uid);
  if (!profile) return NextResponse.json({ error: 'mentor_required' }, { status: 403 });

  const studentId = new URL(req.url).searchParams.get('studentId') || undefined;
  const slots = await listMentorWeeklySlotsByMentor(session.uid, studentId || undefined);
  return NextResponse.json({ slots });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const profile = await getMentorProfile(session.uid);
  if (!profile) return NextResponse.json({ error: 'mentor_required' }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const studentId = String(body.studentId || '').trim();
  if (!studentId) return NextResponse.json({ error: 'student_required' }, { status: 400 });

  const allowed = await assertCanScheduleStudent(session.uid, studentId);
  if (!allowed) {
    return NextResponse.json(
      { error: 'not_allocated', message: 'You can only set times for students enrolled in your courses.' },
      { status: 403 },
    );
  }

  const learner = await getLearner(session.uid);
  try {
    const slot = await createMentorWeeklySlot({
      mentorId: session.uid,
      mentorName: learner?.name || profile.name || 'Mentor',
      studentId,
      studentName: String(body.studentName || 'Student').slice(0, 120),
      title: String(body.title || ''),
      dayOfWeek: Number(body.dayOfWeek),
      startTime: String(body.startTime || ''),
      endTime: String(body.endTime || ''),
      kind: body.kind === 'school' || body.kind === 'mentorship' || body.kind === 'call' ? body.kind : 'call',
    });
    return NextResponse.json({ ok: true, slot }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed' },
      { status: 400 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const profile = await getMentorProfile(session.uid);
  if (!profile) return NextResponse.json({ error: 'mentor_required' }, { status: 403 });

  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const ok = await deleteMentorWeeklySlot({ id, mentorId: session.uid });
  if (!ok) return NextResponse.json({ error: 'not_found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
