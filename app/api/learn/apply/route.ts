import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/getUser';
import {
  getMyApplication,
  saveApplicationDraft,
  submitApplication,
  withdrawApplication,
} from '@/lib/learn/applications';
import { isOfficialStudent } from '@/lib/learn/studentAccess';
import { getOrgConfig } from '@/lib/org/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const [application, isStudent, org] = await Promise.all([
    getMyApplication(session.uid),
    isOfficialStudent(session.uid),
    getOrgConfig(),
  ]);
  return NextResponse.json({
    application,
    isStudent,
    org: {
      name: org.name,
      requirePayment: org.registration.requirePayment,
      feeXAF: org.registration.feeXAF,
      programs: org.registration.programs,
      terminology: org.terminology,
    },
  });
}

export async function PUT(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (await isOfficialStudent(session.uid)) {
    return NextResponse.json({ error: 'already_student' }, { status: 409 });
  }
  const body = await req.json().catch(() => ({}));
  const application = await saveApplicationDraft(session.uid, body);
  return NextResponse.json({ application });
}

export async function POST(req: NextRequest) {
  const session = getSessionUser();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (await isOfficialStudent(session.uid)) {
    return NextResponse.json({ error: 'already_student' }, { status: 409 });
  }
  const body = await req.json().catch(() => ({}));
  if (body.withdraw) {
    const application = await withdrawApplication(session.uid);
    return NextResponse.json({ application });
  }
  try {
    if (body.draft) await saveApplicationDraft(session.uid, body.draft);
    const application = await submitApplication(session.uid);
    return NextResponse.json({ application });
  } catch (err) {
    const status = (err as { status?: number }).status || 500;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Could not submit' },
      { status },
    );
  }
}
