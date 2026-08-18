import { NextRequest, NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import { decideAdmission, deleteAdmission, listAdmissions, requireStaff } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireStaff('admissions.read');
    const applications = await listAdmissions();
    return NextResponse.json({ applications });
  } catch (err) {
    return staffFail(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requireStaff('admissions.decide');
    const body = await req.json().catch(() => ({}));
    if (body.action === 'delete' || body.delete === true) {
      const result = await deleteAdmission(actor, String(body.id || ''));
      return NextResponse.json(result);
    }
    const decision = body.decision;
    if (decision !== 'admitted' && decision !== 'rejected' && decision !== 'waitlisted') {
      return NextResponse.json({ error: 'Choose admit, reject, or waitlist.' }, { status: 400 });
    }
    const result = await decideAdmission(actor, String(body.id || ''), decision, body.notes);
    return NextResponse.json(result);
  } catch (err) {
    return staffFail(err);
  }
}
