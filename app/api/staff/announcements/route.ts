import { NextRequest, NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import { listAnnouncements, publishAnnouncement, requireStaff } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireStaff('staff.access');
    const announcements = await listAnnouncements();
    return NextResponse.json({ announcements });
  } catch (err) {
    return staffFail(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requireStaff('announcements.write');
    const body = await req.json().catch(() => ({}));
    const audience =
      body.audience === 'students' || body.audience === 'staff' ? body.audience : 'everyone';
    const result = await publishAnnouncement(actor, {
      title: String(body.title || ''),
      body: String(body.body || ''),
      audience,
    });
    return NextResponse.json(result);
  } catch (err) {
    return staffFail(err);
  }
}
