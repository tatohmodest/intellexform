import { NextRequest, NextResponse } from 'next/server';
import { staffFail } from '@/lib/staff/http';
import { listCampuses } from '@/lib/staff/org';
import { createOrUpdateCampus, requireStaff } from '@/lib/staff/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireStaff('staff.access');
    const campuses = await listCampuses();
    return NextResponse.json({ campuses });
  } catch (err) {
    return staffFail(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const actor = await requireStaff('campuses.manage');
    const body = await req.json().catch(() => ({}));
    const campus = await createOrUpdateCampus(actor, {
      name: String(body.name || ''),
      city: body.city,
      address: body.address,
      color: body.color,
      slug: body.slug,
    });
    return NextResponse.json({ ok: true, campus });
  } catch (err) {
    return staffFail(err);
  }
}
