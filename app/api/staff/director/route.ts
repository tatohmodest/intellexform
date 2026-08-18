import { NextRequest, NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import { answerDirectorQuestion, directorSnapshot, requireStaff } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireStaff('director.view');
    const snapshot = await directorSnapshot();
    return NextResponse.json({ snapshot });
  } catch (err) {
    return staffFail(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireStaff('director.view');
    const body = await req.json().catch(() => ({}));
    const snapshot = await directorSnapshot();
    const answer = answerDirectorQuestion(String(body.question || ''), snapshot);
    return NextResponse.json({ answer, snapshot });
  } catch (err) {
    return staffFail(err);
  }
}
